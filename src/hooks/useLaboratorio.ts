import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'

import { db } from '../lib/firebase'
import { useLaboratorioStore } from '../stores/laboratorioStore'
import type { Laboratorio, Proposicion } from '../types'

type EstadoCarga = 'idle' | 'cargando' | 'listo' | 'no_encontrado' | 'error'

export function useLaboratorio(labId: string | undefined) {
  const laboratorioActivo = useLaboratorioStore((s) => s.laboratorioActivo)
  const setLaboratorioActivo = useLaboratorioStore((s) => s.setLaboratorioActivo)
  const [estado, setEstado] = useState<EstadoCarga>('idle')

  const yaEnStore = laboratorioActivo?.id === labId

  useEffect(() => {
    if (!labId || yaEnStore) return

    setEstado('cargando')

    getDoc(doc(db, 'laboratorios', labId))
      .then((snap) => {
        if (!snap.exists()) {
          setEstado('no_encontrado')
          return
        }
        const d = snap.data()
        const laboratorio: Laboratorio = {
          id: snap.id,
          titulo: d.titulo ?? '',
          descripcion: d.descripcion ?? undefined,
          ownerId: d.ownerId ?? '',
          compartible: d.compartible ?? true,
          proposiciones: (d.proposiciones ?? []) as Proposicion[],
          evaluaciones: [],
          creadoEn: d.creadoEn?.toDate() ?? new Date(),
          actualizadoEn: d.actualizadoEn?.toDate() ?? new Date(),
        }
        setLaboratorioActivo(laboratorio)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [labId, yaEnStore, setLaboratorioActivo])

  return {
    laboratorio: yaEnStore ? laboratorioActivo : null,
    estado: yaEnStore ? ('listo' as EstadoCarga) : estado,
  }
}
