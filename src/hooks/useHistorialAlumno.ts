import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

import { db } from '../lib/firebase'
import type { Veredicto } from '../types'

export interface EvaluacionResumen {
  id: string
  proposicionId: string
  nombrePastilla: string
  veredicto: Veredicto
  razonamiento: string
  timestamp: Date
}

export function useHistorialAlumno(labId: string, uid: string | undefined) {
  const [historial, setHistorial] = useState<EvaluacionResumen[]>([])

  useEffect(() => {
    if (!uid || !labId) return

    const q = query(
      collection(db, 'evaluaciones'),
      where('laboratorioId', '==', labId),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(30),
    )

    return onSnapshot(
      q,
      (snap) => {
        setHistorial(
          snap.docs.map((d) => ({
            id: d.id,
            proposicionId: d.data().proposicionId as string,
            nombrePastilla: d.data().nombrePastilla as string,
            veredicto: d.data().veredicto as Veredicto,
            razonamiento: d.data().razonamiento as string,
            timestamp: d.data().timestamp?.toDate() ?? new Date(),
          })),
        )
      },
      () => { /* falla silenciosamente si el índice no está listo */ },
    )
  }, [labId, uid])

  return historial
}
