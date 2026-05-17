import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'

import { useLaboratorio } from '../hooks/useLaboratorio'
import { useEvaluacion } from '../hooks/useEvaluacion'
import { PASTILLAS_MOCK } from '../lib/mocks'
import { ProposicionDisplay } from '../components/ProposicionDisplay'
import { AnalisisZone } from '../components/AnalisisZone'
import { PastillaPanel } from '../components/PastillaPanel'
import { MetaPanel } from '../components/MetaPanel'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { RelacionModal } from '../components/RelacionModal'
import { ShareButton } from '../components/ShareButton'
import type { Pastilla, PastillaAplicada } from '../types'

const pastillasAtributo = PASTILLAS_MOCK.filter((p) => p.tipo === 'atributo')
const pastillasRelacion = PASTILLAS_MOCK.filter((p) => p.tipo === 'relacion')
const pastillasMeta = PASTILLAS_MOCK.filter((p) => p.tipo === 'meta')

export function LaboratorioPage() {
  const { labId } = useParams<{ labId: string }>()
  const { laboratorio, estado } = useLaboratorio(labId)
  const { estado: estadoEval, respuesta, mensajeCuota, evaluar, reset } = useEvaluacion()

  const [proposicionIdx, setProposicionIdx] = useState(0)
  const [pastillasAplicadas, setPastillasAplicadas] = useState<PastillaAplicada[]>([])
  const [modeloCientificidad, setModeloCientificidad] = useState<Pastilla | null>(null)
  const [modalPastilla, setModalPastilla] = useState<Pastilla | null>(null)

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
    const pastilla = PASTILLAS_MOCK.find((p) => p.id === pastillaId)
    if (!pastilla) return
    if (pastilla.tipo === 'relacion') {
      setModalPastilla(pastilla)
    } else {
      aplicarYEvaluar({ pastilla })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposicion, laboratorio.id, evaluar])

  const handleConfirmarRelacion = useCallback((sistemaTeoricoEspecificado: string) => {
    if (!modalPastilla) return
    aplicarYEvaluar({ pastilla: modalPastilla, sistemaTeoricoEspecificado })
    setModalPastilla(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalPastilla])

  const handleQuitarPastilla = useCallback((pastillaId: string) => {
    setPastillasAplicadas((prev) => prev.filter((p) => p.pastilla.id !== pastillaId))
    if (pastillasAplicadas.length <= 1) reset()
  }, [pastillasAplicadas.length, reset])

  const handleCambiarProposicion = (idx: number) => {
    setProposicionIdx(idx)
    setPastillasAplicadas([])
    setModeloCientificidad(null)
    reset()
  }

  return (
    <main className="min-h-screen bg-crema">
      <header className="bg-azul text-white px-8 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors">
            ← Mis laboratorios
          </Link>
          <h1 className="font-semibold mt-0.5">{laboratorio.titulo}</h1>
        </div>
        <div className="w-64">
          <ShareButton labId={laboratorio.id} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ProposicionDisplay proposicion={proposicion} indice={proposicionIdx} />
            <AnalisisZone
              pastillasAplicadas={pastillasAplicadas}
              onDrop={handleDrop}
              onQuitarPastilla={handleQuitarPastilla}
            />
            <FeedbackPanel estado={estadoEval} respuesta={respuesta} mensajeCuota={mensajeCuota} />
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
