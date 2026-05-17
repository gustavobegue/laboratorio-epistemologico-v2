import * as admin from 'firebase-admin'
import { HttpsError } from 'firebase-functions/v2/https'

const TECHO_ALUMNO = 30   // evaluaciones por alumno por día
const TECHO_SISTEMA = 1200 // 80% del límite free tier de Gemini (1.500 req/día)

function fechaUtcHoy(): string {
  return new Date().toISOString().split('T')[0]
}

// Verifica y registra el consumo del alumno — lanza error si supera el techo
export async function verificarCuotaAlumno(uid: string): Promise<void> {
  const db = admin.firestore()
  const hoy = fechaUtcHoy()
  const ref = db.collection('sesiones').doc(uid)

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref)

    if (!doc.exists) {
      tx.set(ref, { evaluacionesHoy: 1, fechaContadorEvaluaciones: hoy })
      return
    }

    const data = doc.data() as { evaluacionesHoy: number; fechaContadorEvaluaciones: string }
    const esHoy = data.fechaContadorEvaluaciones === hoy
    const count = esHoy ? data.evaluacionesHoy : 0

    if (count >= TECHO_ALUMNO) {
      throw new HttpsError(
        'resource-exhausted',
        `Alcanzaste tu límite de ${TECHO_ALUMNO} evaluaciones por hoy. Volvé mañana.`,
      )
    }

    tx.update(ref, {
      evaluacionesHoy: count + 1,
      fechaContadorEvaluaciones: hoy,
    })
  })
}

// Verifica y registra el consumo global — lanza error si supera el techo del sistema
export async function verificarCuotaGlobal(): Promise<void> {
  const db = admin.firestore()
  const hoy = fechaUtcHoy()
  const ref = db.collection('sistema').doc('cuota')

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref)

    if (!doc.exists) {
      tx.set(ref, { fecha: hoy, totalDia: 1, techo: TECHO_SISTEMA })
      return
    }

    const data = doc.data() as { fecha: string; totalDia: number; techo: number }
    const esHoy = data.fecha === hoy
    const count = esHoy ? data.totalDia : 0

    if (count >= data.techo) {
      throw new HttpsError(
        'resource-exhausted',
        'El sistema alcanzó su límite de evaluaciones para hoy. Volvé a intentarlo mañana.',
      )
    }

    tx.update(ref, {
      fecha: hoy,
      totalDia: count + 1,
    })
  })
}
