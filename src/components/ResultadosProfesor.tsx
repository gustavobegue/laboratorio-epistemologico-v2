import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

import { db } from '../lib/firebase'
import type { Veredicto } from '../types'

interface EvaluacionCompleta {
  id: string
  nombreAlumno: string
  uid: string
  proposicionId: string
  nombrePastilla: string
  veredicto: Veredicto
  razonamiento: string
  timestamp: Date
}

const BADGE: Record<string, string> = {
  PERTINENTE: 'bg-green-100 text-green-800',
  PARCIALMENTE_PERTINENTE: 'bg-yellow-100 text-yellow-800',
  NO_PERTINENTE: 'bg-red-100 text-red-800',
  INSUFICIENTE_INFORMACION: 'bg-gray-100 text-gray-700',
}

const LABEL: Record<string, string> = {
  PERTINENTE: 'Pertinente',
  PARCIALMENTE_PERTINENTE: 'Parcial',
  NO_PERTINENTE: 'No pertinente',
  INSUFICIENTE_INFORMACION: 'Sin info',
}

interface Props {
  labId: string
  proposiciones: Array<{ id: string; texto: string }>
}

export function ResultadosProfesor({ labId, proposiciones }: Props) {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionCompleta[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'evaluaciones'),
      where('laboratorioId', '==', labId),
      orderBy('timestamp', 'desc'),
      limit(300),
    )

    return onSnapshot(
      q,
      (snap) => {
        setEvaluaciones(
          snap.docs.map((d) => ({
            id: d.id,
            nombreAlumno: (d.data().nombreAlumno as string) ?? 'Alumno',
            uid: d.data().uid as string,
            proposicionId: d.data().proposicionId as string,
            nombrePastilla: d.data().nombrePastilla as string,
            veredicto: d.data().veredicto as Veredicto,
            razonamiento: d.data().razonamiento as string,
            timestamp: d.data().timestamp?.toDate() ?? new Date(),
          })),
        )
        setCargando(false)
      },
      () => setCargando(false),
    )
  }, [labId])

  if (cargando) {
    return (
      <p className="text-pizarra text-sm animate-pulse py-8 text-center">
        Cargando resultados…
      </p>
    )
  }

  const alumnosUnicos = new Set(evaluaciones.map((e) => e.uid)).size

  if (evaluaciones.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
        <p className="text-pizarra text-sm">
          Ningún alumno ha evaluado proposiciones todavía.
        </p>
        <p className="text-pizarra/50 text-xs mt-1">
          Los resultados aparecen en tiempo real cuando los alumnos analicen con pastillas.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-pizarra/60">
        {evaluaciones.length} evaluación{evaluaciones.length !== 1 ? 'es' : ''} de{' '}
        {alumnosUnicos} alumno{alumnosUnicos !== 1 ? 's' : ''} · actualizado en tiempo real
      </p>

      {proposiciones.map((prop, idx) => {
        const evals = evaluaciones.filter((e) => e.proposicionId === prop.id)
        return (
          <section key={prop.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-azul">Proposición {idx + 1}</h3>
                <p className="text-xs text-pizarra/70 mt-0.5 line-clamp-2">{prop.texto}</p>
              </div>
              <span className="text-xs text-pizarra/50 whitespace-nowrap shrink-0">
                {evals.length} eval{evals.length !== 1 ? 's' : ''}
              </span>
            </div>

            {evals.length === 0 ? (
              <p className="text-sm text-pizarra/40 text-center py-4">Sin evaluaciones aún.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {evals.map((e) => (
                  <details key={e.id} className="group px-5 py-3">
                    <summary className="flex items-center gap-2 cursor-pointer list-none select-none">
                      <span className="text-sm font-medium text-pizarra flex-1 min-w-0 truncate">
                        {e.nombreAlumno}
                      </span>
                      <span className="text-xs text-pizarra/60 shrink-0">{e.nombrePastilla}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${BADGE[e.veredicto] ?? BADGE.INSUFICIENTE_INFORMACION}`}
                      >
                        {LABEL[e.veredicto] ?? e.veredicto}
                      </span>
                      <time className="text-xs text-pizarra/40 shrink-0">
                        {e.timestamp.toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                      <span className="text-pizarra/30 text-xs group-open:rotate-90 transition-transform">▶</span>
                    </summary>
                    <p className="mt-2 text-xs text-pizarra/70 leading-relaxed pl-0">
                      {e.razonamiento}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
