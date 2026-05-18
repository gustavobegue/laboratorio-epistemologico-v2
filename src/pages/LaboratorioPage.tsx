import { useState, useCallback } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'

import { useLaboratorio } from '../hooks/useLaboratorio'
import { useEvaluacion } from '../hooks/useEvaluacion'
import { useAuthStore } from '../stores/authStore'
import { useHistorialAlumno } from '../hooks/useHistorialAlumno'
import { PASTILLAS_MOCK } from '../lib/mocks'
import { ProposicionDisplay } from '../components/ProposicionDisplay'
import { AnalisisZone } from '../components/AnalisisZone'
import { PastillaPanel } from '../components/PastillaPanel'
import { MetaPanel } from '../components/MetaPanel'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { RelacionModal } from '../components/RelacionModal'
import { ShareButton } from '../components/ShareButton'
import { ResultadosProfesor } from '../components/ResultadosProfesor'
import type { Pastilla, PastillaAplicada } from '../types'

const pastillasAtributo = PASTILLAS_MOCK.filter((p) => p.tipo === 'atributo')
const pastillasRelacion = PASTILLAS_MOCK.filter((p) => p.tipo === 'relacion')
const pastillasMeta = PASTILLAS_MOCK.filter((p) => p.tipo === 'meta')

const VEREDICTO_BADGE: Record<string, string> = {
  PERTINENTE: 'bg-green-100 text-green-800',
  PARCIALMENTE_PERTINENTE: 'bg-yellow-100 text-yellow-800',
  NO_PERTINENTE: 'bg-red-100 text-red-800',
  INSUFICIENTE_INFORMACION: 'bg-gray-100 text-gray-700',
}

const VEREDICTO_LABEL: Record<string, string> = {
  PERTINENTE: 'Pertinente',
  PARCIALMENTE_PERTINENTE: 'Parcial',
  NO_PERTINENTE: 'No pertinente',
  INSUFICIENTE_INFORMACION: 'Sin info',
}

type Vista = 'analisis' | 'resultados'

export function LaboratorioPage() {
  const { labId } = useParams<{ labId: string }>()
  const { laboratorio, estado } = useLaboratorio(labId)
  const { estado: estadoEval, respuesta, mensajeCuota, evaluar, reset } = useEvaluacion()
  const { rol, user, cargando: authCargando } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [proposicionIdx, setProposicionIdx] = useState(0)
  const [pastillasAplicadas, setPastillasAplicadas] = useState<PastillaAplicada[]>([])
  const [modeloCientificidad, setModeloCientificidad] = useState<Pastilla | null>(null)
  const [modalPastilla, setModalPastilla] = useState<Pastilla | null>(null)
  const [vista, setVista] = useState<Vista>('analisis')
  const [historialAbierto, setHistorialAbierto] = useState(false)

  const historial = useHistorialAlumno(labId ?? '', user?.uid)

  if (estado === 'cargando' || estado === 'idle') {
    return (
      <main className="min-h-screen bg-crema flex items-center justify-center">
        <p className="text-pizarra animate-pulse">Cargando laboratorio…</p>
      </main>
    )
  }

  if (estado === 'no_encontrado') {
    return (
      <main className="min-h-screen bg-crema flex flex-col items-center justify-center gap-4">
        <p className="text-pizarra text-lg">Laboratorio no encontrado.</p>
        <Link to="/" className="text-azul underline text-sm">← Volver al inicio</Link>
      </main>
    )
  }

  if (estado === 'error' || !laboratorio) {
    return (
      <main className="min-h-screen bg-crema flex flex-col items-center justify-center gap-4">
        <p className="text-pizarra text-lg">No se pudo cargar el laboratorio.</p>
        <Link to="/" className="text-azul underline text-sm">← Volver al inicio</Link>
      </main>
    )
  }

  const proposicion = laboratorio.proposiciones[proposicionIdx]
  const historialDeEstaProposicion = historial.filter((e) => e.proposicionId === proposicion.id)

  const aplicarYEvaluar = (pastillaAplicada: PastillaAplicada) => {
    setPastillasAplicadas((prev) => {
      const yaAplicada = prev.some((p) => p.pastilla.id === pastillaAplicada.pastilla.id)
      return yaAplicada ? prev : [...prev, pastillaAplicada]
    })
    evaluar({
      proposicion,
      pastillaId: pastillaAplicada.pastilla.id,
      nombrePastilla: pastillaAplicada.pastilla.nombre,
      laboratorioId: laboratorio.id,
      proposicionId: proposicion.id,
      sistemaTeoricoEspecificado: pastillaAplicada.sistemaTeoricoEspecificado,
    })
  }

  const handleDrop = useCallback((pastillaId: string) => {
    if (!user) {
      navigate('/auth', { state: { from: location } })
      return
    }
    const pastilla = PASTILLAS_MOCK.find((p) => p.id === pastillaId)
    if (!pastilla) return
    if (pastilla.tipo === 'relacion') {
      setModalPastilla(pastilla)
    } else {
      aplicarYEvaluar({ pastilla })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposicion, laboratorio.id, evaluar, user])

  const handleConfirmarRelacion = useCallback((sistemaTeoricoEspecificado: string) => {
    if (!user) {
      navigate('/auth', { state: { from: location } })
      setModalPastilla(null)
      return
    }
    if (!modalPastilla) return
    aplicarYEvaluar({ pastilla: modalPastilla, sistemaTeoricoEspecificado })
    setModalPastilla(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalPastilla, user])

  const handleQuitarPastilla = useCallback((pastillaId: string) => {
    setPastillasAplicadas((prev) => prev.filter((p) => p.pastilla.id !== pastillaId))
    if (pastillasAplicadas.length <= 1) reset()
  }, [pastillasAplicadas.length, reset])

  const handleCambiarProposicion = (idx: number) => {
    setProposicionIdx(idx)
    setPastillasAplicadas([])
    setModeloCientificidad(null)
    setHistorialAbierto(false)
    reset()
  }

  return (
    <main className="min-h-screen bg-crema">
      <header className="bg-azul text-white px-8 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors">
            ← {rol === 'profesor' ? 'Mis laboratorios' : 'Inicio'}
          </Link>
          <h1 className="font-semibold mt-0.5">{laboratorio.titulo}</h1>
        </div>
        <div className="w-64">
          <ShareButton labId={laboratorio.id} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Selector de proposición */}
        <nav aria-label="Selección de proposición" className="flex gap-2 flex-wrap">
          {laboratorio.proposiciones.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleCambiarProposicion(idx)}
              aria-pressed={idx === proposicionIdx}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                idx === proposicionIdx
                  ? 'bg-azul text-white border-azul'
                  : 'bg-white text-pizarra border-gray-300 hover:border-azul/40'
              }`}
            >
              Proposición {idx + 1}
            </button>
          ))}
        </nav>

        {/* Tabs de vista (solo profesor) */}
        {rol === 'profesor' && (
          <div className="flex gap-1 border-b border-gray-200">
            {(['analisis', 'resultados'] as Vista[]).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  vista === v
                    ? 'text-azul border-azul'
                    : 'text-pizarra/60 border-transparent hover:text-pizarra'
                }`}
              >
                {v === 'analisis' ? 'Análisis' : 'Resultados alumnos'}
              </button>
            ))}
          </div>
        )}

        {/* Vista análisis */}
        {vista === 'analisis' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <ProposicionDisplay proposicion={proposicion} indice={proposicionIdx} />
                {!user && !authCargando && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    Para analizar proposiciones necesitás{' '}
                    <button
                      onClick={() => navigate('/auth', { state: { from: location } })}
                      className="underline font-medium hover:text-amber-900"
                    >
                      iniciar sesión o crear una cuenta
                    </button>
                    .
                  </div>
                )}
                <AnalisisZone
                  pastillasAplicadas={pastillasAplicadas}
                  onDrop={handleDrop}
                  onQuitarPastilla={handleQuitarPastilla}
                />
                <FeedbackPanel estado={estadoEval} respuesta={respuesta} mensajeCuota={mensajeCuota} />

                {/* Historial del alumno para esta proposición */}
                {historialDeEstaProposicion.length > 0 && (
                  <section className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setHistorialAbierto((v) => !v)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left
                                 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-pizarra">
                        Mis evaluaciones anteriores
                        <span className="ml-2 text-xs font-normal text-pizarra/50">
                          ({historialDeEstaProposicion.length})
                        </span>
                      </span>
                      <span className={`text-pizarra/40 text-xs transition-transform ${historialAbierto ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                    </button>

                    {historialAbierto && (
                      <div className="divide-y divide-gray-100 border-t border-gray-100">
                        {historialDeEstaProposicion.map((e) => (
                          <div key={e.id} className="px-5 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-pizarra">{e.nombrePastilla}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${VEREDICTO_BADGE[e.veredicto] ?? VEREDICTO_BADGE.INSUFICIENTE_INFORMACION}`}
                              >
                                {VEREDICTO_LABEL[e.veredicto] ?? e.veredicto}
                              </span>
                              <time className="text-xs text-pizarra/40 ml-auto">
                                {e.timestamp.toLocaleString('es-AR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </time>
                            </div>
                            <p className="text-xs text-pizarra/60 mt-1 line-clamp-2">{e.razonamiento}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>

              <div className="space-y-4">
                <PastillaPanel tipo="atributo" pastillas={pastillasAtributo} onDragStart={() => {}} />
                <PastillaPanel tipo="relacion" pastillas={pastillasRelacion} onDragStart={() => {}} />
              </div>
            </div>

            <MetaPanel
              pastillas={pastillasMeta}
              seleccionada={modeloCientificidad}
              onSeleccionar={setModeloCientificidad}
            />
          </>
        )}

        {/* Vista resultados (solo profesor) */}
        {vista === 'resultados' && rol === 'profesor' && (
          <ResultadosProfesor
            labId={laboratorio.id}
            proposiciones={laboratorio.proposiciones}
          />
        )}
      </div>

      {modalPastilla && (
        <RelacionModal
          pastilla={modalPastilla}
          onConfirmar={handleConfirmarRelacion}
          onCancelar={() => setModalPastilla(null)}
        />
      )}
    </main>
  )
}
