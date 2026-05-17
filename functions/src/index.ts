import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'

import { verificarCuotaAlumno, verificarCuotaGlobal } from './lib/cuota'
import { evaluarConGemini, type RespuestaLlm } from './lib/gemini'

admin.initializeApp()
const db = admin.firestore()
const geminiApiKey = defineSecret('GEMINI_API_KEY')

interface EvaluarInput {
  proposicion: { texto: string; fuenteContexto: string }
  pastillaId: string
  nombrePastilla: string
  laboratorioId: string
  proposicionId: string
  sistemaTeoricoEspecificado?: string
}

export const evaluarPastilla = onCall<EvaluarInput>(
  { secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Se requiere autenticación.')
    }

    const uid = request.auth.uid
    const { proposicion, pastillaId, nombrePastilla, laboratorioId, proposicionId, sistemaTeoricoEspecificado } = request.data

    if (!proposicion?.texto || !pastillaId || !nombrePastilla) {
      throw new HttpsError('invalid-argument', 'Faltan campos obligatorios.')
    }

    // Orden de validación: alumno → global → Gemini
    await verificarCuotaAlumno(uid)
    await verificarCuotaGlobal()

    let respuesta: RespuestaLlm
    try {
      respuesta = await evaluarConGemini(
        geminiApiKey.value(),
        proposicion,
        pastillaId,
        nombrePastilla,
        sistemaTeoricoEspecificado,
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[evaluarPastilla] Error de Gemini: ${msg}`)
      if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many')) {
        throw new HttpsError('resource-exhausted', mensajeQuotaGemini(msg))
      }
      throw new HttpsError('internal', 'No se pudo obtener la evaluación. Intentá de nuevo.')
    }

    // Log completo para reproducibilidad y auditoría pedagógica
    await db.collection('evaluaciones').add({
      uid,
      laboratorioId,
      proposicionId,
      pastillaId,
      nombrePastilla,
      sistemaTeoricoEspecificado: sistemaTeoricoEspecificado ?? null,
      proposicion,
      veredicto: respuesta.veredicto,
      razonamiento: respuesta.razonamiento,
      elementosRelevantes: respuesta.elementosRelevantes,
      justificacionDoctrinal: respuesta.justificacionDoctrinal,
      sugerenciaPedagogica: respuesta.sugerenciaPedagogica,
      modeloLlm: 'gemini-2.0-flash',
      temperaturaUsada: 0.2,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })

    return respuesta
  },
)

interface ProposicionInput {
  texto: string
  fuenteContexto: string
  fuenteUrl?: string
}

interface CrearLaboratorioInput {
  titulo: string
  descripcion?: string
  proposiciones: ProposicionInput[]
}

export const crearLaboratorio = onCall<CrearLaboratorioInput>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Se requiere autenticación.')
  }

  const uid = request.auth.uid
  const usuarioDoc = await db.collection('usuarios').doc(uid).get()
  if (usuarioDoc.data()?.rol !== 'profesor') {
    throw new HttpsError('permission-denied', 'Solo los profesores pueden crear laboratorios.')
  }

  const { titulo, descripcion, proposiciones } = request.data
  if (!titulo?.trim()) {
    throw new HttpsError('invalid-argument', 'El título es obligatorio.')
  }
  if (!Array.isArray(proposiciones) || proposiciones.length === 0) {
    throw new HttpsError('invalid-argument', 'Se requiere al menos una proposición.')
  }

  const proposicionesConId = proposiciones.map((p, i) => ({
    id: `prop-${Date.now()}-${i}`,
    texto: p.texto.trim(),
    fuenteContexto: p.fuenteContexto.trim(),
    fuenteUrl: p.fuenteUrl?.trim() ?? null,
  }))

  const ref = await db.collection('laboratorios').add({
    titulo: titulo.trim(),
    descripcion: descripcion?.trim() ?? null,
    ownerId: request.auth.uid,
    proposiciones: proposicionesConId,
    creadoEn: admin.firestore.FieldValue.serverTimestamp(),
    actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
    compartible: true,
  })

  return { laboratorioId: ref.id }
})

interface ObtenerLaboratorioInput {
  laboratorioId: string
}

export const obtenerLaboratorio = onCall<ObtenerLaboratorioInput>(async (request) => {
  const { laboratorioId } = request.data
  if (!laboratorioId) {
    throw new HttpsError('invalid-argument', 'Se requiere el ID del laboratorio.')
  }

  const doc = await db.collection('laboratorios').doc(laboratorioId).get()
  if (!doc.exists) {
    throw new HttpsError('not-found', 'Laboratorio no encontrado.')
  }

  return { id: doc.id, ...doc.data() }
})

// ─── Generación de proposiciones desde URL ───────────────────────────────────

interface GenerarProposicionesInput {
  url: string
}

interface ProposicionGenerada {
  texto: string
  fuenteContexto: string
}

interface GenerarProposicionesResult {
  proposiciones: ProposicionGenerada[]
  tituloSugerido: string
}

function mensajeQuotaGemini(errorMsg: string): string {
  // Cuando la cuota diaria está agotada, el error lo indica explícitamente.
  // Gemini puede devolver retryDelay corto (del límite por minuto) aunque la cuota
  // diaria también esté violada — por eso chequeamos la cuota diaria primero.
  const cuotaDiariaAgotada = errorMsg.includes('PerDay') || errorMsg.includes('per_day')

  if (cuotaDiariaAgotada) {
    const ahora = new Date()
    const medianoche = new Date()
    medianoche.setUTCHours(24, 0, 0, 0)
    const minRestantes = Math.ceil((medianoche.getTime() - ahora.getTime()) / 60000)
    const horas = Math.floor(minRestantes / 60)
    const mins = minRestantes % 60
    const tiempoStr = horas > 0 ? `${horas}h ${mins}min` : `${mins} minutos`
    return `Cuota diaria de Gemini agotada. Se reinicia a las 00:00 UTC (en ${tiempoStr}). Podés continuar más tarde.`
  }

  // Solo límite por minuto — extraer el tiempo de espera del error
  const match = errorMsg.match(/retry in (\d+(?:\.\d+)?)s/i)
  const segundos = match ? Math.ceil(parseFloat(match[1])) : 0

  if (segundos > 0) {
    return `Límite de consultas por minuto alcanzado. Podés reintentar en ${segundos} segundos.`
  }

  return 'Límite de consultas de Gemini alcanzado. Esperá unos minutos e intentá de nuevo.'
}

function extraerTextoDeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000)
}

async function extraerProposicionesConGemini(
  apiKey: string,
  textoArticulo: string,
  urlFuente: string,
): Promise<GenerarProposicionesResult> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `ROL: Asistente pedagógico para un docente de Epistemología en una universidad argentina.

TAREA: A partir del siguiente texto periodístico o académico, extraé entre 2 y 3 proposiciones adecuadas para que los alumnos practiquen análisis epistemológico (categorías como fáctico, empírico, observacional, teórico, nomológico-deductivo, falsable, verificable).

CRITERIOS para cada proposición:
- Debe ser una afirmación concreta y verificable (máx. 2 oraciones)
- Debe prestarse al análisis metodológico, no ser meramente opinativa
- El fuenteContexto describe el tipo de documento, medio, fecha y tema general (2-3 oraciones)

URL DE LA FUENTE: ${urlFuente}

TEXTO:
${textoArticulo}

Respondé ÚNICAMENTE con este JSON, sin texto adicional:
{
  "tituloSugerido": "Título breve para el laboratorio (máx. 60 caracteres)",
  "proposiciones": [
    {
      "texto": "La proposición completa",
      "fuenteContexto": "2-3 oraciones de contexto sobre la fuente"
    }
  ]
}`

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 900,
      responseMimeType: 'application/json',
    },
  })

  const parsed = JSON.parse(result.response.text()) as {
    tituloSugerido?: string
    proposiciones?: ProposicionGenerada[]
  }

  if (!Array.isArray(parsed.proposiciones) || parsed.proposiciones.length === 0) {
    throw new Error('Respuesta inválida de Gemini')
  }

  return {
    tituloSugerido: parsed.tituloSugerido ?? 'Análisis de proposiciones',
    proposiciones: parsed.proposiciones,
  }
}

export const generarProposiciones = onCall<GenerarProposicionesInput>(
  { secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Se requiere autenticación.')
    }

    const usuarioDoc = await db.collection('usuarios').doc(request.auth.uid).get()
    if (usuarioDoc.data()?.rol !== 'profesor') {
      throw new HttpsError('permission-denied', 'Solo los profesores pueden generar proposiciones.')
    }

    const { url } = request.data
    if (!url || !/^https?:\/\/.+/.test(url)) {
      throw new HttpsError('invalid-argument', 'Se requiere una URL válida (http/https).')
    }

    console.log(`[generarProposiciones] Fetching: ${url}`)

    let html: string
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LaboratorioEpistemologico/1.0)' },
        signal: AbortSignal.timeout(12000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      html = await response.text()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[generarProposiciones] Fetch error: ${msg}`)
      throw new HttpsError(
        'unavailable',
        'No se pudo acceder al artículo. Verificá que la URL sea pública y correcta.',
      )
    }

    const texto = extraerTextoDeHtml(html)
    if (texto.length < 150) {
      throw new HttpsError(
        'failed-precondition',
        'El artículo no tiene suficiente texto. Probá con otra URL.',
      )
    }

    console.log(`[generarProposiciones] Texto extraído: ${texto.length} chars`)

    try {
      const resultado = await extraerProposicionesConGemini(geminiApiKey.value(), texto, url)
      console.log(`[generarProposiciones] Proposiciones generadas: ${resultado.proposiciones.length}`)
      return resultado
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[generarProposiciones] Gemini error: ${msg}`)
      if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many')) {
        throw new HttpsError('resource-exhausted', mensajeQuotaGemini(msg))
      }
      throw new HttpsError('internal', 'No se pudieron generar las proposiciones. Intentá de nuevo.')
    }
  },
)
