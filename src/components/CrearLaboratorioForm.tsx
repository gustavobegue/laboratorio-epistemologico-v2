import { useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

import { functions, db } from '../lib/firebase'
import { useGenerarProposiciones } from '../hooks/useGenerarProposiciones'

interface ProposicionDraft {
  id?: string
  texto: string
  fuenteContexto: string
}

interface CrearLaboratorioInput {
  titulo: string
  descripcion?: string
  proposiciones: Array<{ texto: string; fuenteContexto: string }>
}

interface CrearLaboratorioResult {
  laboratorioId: string
}

const crearLaboratorioFn = httpsCallable<CrearLaboratorioInput, CrearLaboratorioResult>(
  functions,
  'crearLaboratorio',
)

const PROPOSICION_VACIA: ProposicionDraft = { texto: '', fuenteContexto: '' }

interface ModoEdicion {
  labId: string
  titulo: string
  descripcion?: string
  proposiciones: Array<{ id: string; texto: string; fuenteContexto: string }>
}

interface Props {
  onCreado: (labId: string) => void
  onCancelar: () => void
  modoEdicion?: ModoEdicion
}

export function CrearLaboratorioForm({ onCreado, onCancelar, modoEdicion }: Props) {
  const esEdicion = !!modoEdicion

  const [titulo, setTitulo] = useState(modoEdicion?.titulo ?? '')
  const [descripcion, setDescripcion] = useState(modoEdicion?.descripcion ?? '')
  const [proposiciones, setProposiciones] = useState<ProposicionDraft[]>(
    modoEdicion?.proposiciones.map((p) => ({ id: p.id, texto: p.texto, fuenteContexto: p.fuenteContexto }))
    ?? [{ ...PROPOSICION_VACIA }],
  )
  const [urlArticulo, setUrlArticulo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { generar, cargando: generando, error: errorGeneracion, limpiarError } = useGenerarProposiciones()

  const handleGenerar = async () => {
    if (!urlArticulo.trim()) return
    limpiarError()
    const resultado = await generar(urlArticulo.trim())
    if (!resultado) return

    setProposiciones(resultado.proposiciones.map((p) => ({ texto: p.texto, fuenteContexto: p.fuenteContexto })))
    if (!titulo.trim() && resultado.tituloSugerido) {
      setTitulo(resultado.tituloSugerido)
    }
  }

  const actualizarProposicion = (idx: number, campo: keyof ProposicionDraft, valor: string) => {
    setProposiciones((prev) => prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p)))
  }

  const agregarProposicion = () => {
    if (proposiciones.length >= 5) return
    setProposiciones((prev) => [...prev, { ...PROPOSICION_VACIA }])
  }

  const quitarProposicion = (idx: number) => {
    if (proposiciones.length <= 1) return
    setProposiciones((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const proposicionesValidas = proposiciones.filter((p) => p.texto.trim() && p.fuenteContexto.trim())
    if (!titulo.trim() || proposicionesValidas.length === 0) {
      setError('El título y al menos una proposición completa son obligatorios.')
      return
    }

    setCargando(true)
    try {
      if (esEdicion && modoEdicion) {
        const proposicionesConId = proposicionesValidas.map((p, i) => ({
          id: p.id ?? `prop-${Date.now()}-${i}`,
          texto: p.texto.trim(),
          fuenteContexto: p.fuenteContexto.trim(),
          fuenteUrl: null,
        }))
        await updateDoc(doc(db, 'laboratorios', modoEdicion.labId), {
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          proposiciones: proposicionesConId,
          actualizadoEn: serverTimestamp(),
        })
        onCreado(modoEdicion.labId)
      } else {
        const result = await crearLaboratorioFn({
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || undefined,
          proposiciones: proposicionesValidas.map((p) => ({
            texto: p.texto.trim(),
            fuenteContexto: p.fuenteContexto.trim(),
          })),
        })
        onCreado(result.data.laboratorioId)
      }
    } catch {
      setError(
        esEdicion
          ? 'No se pudo guardar los cambios. Intentá de nuevo.'
          : 'No se pudo crear el laboratorio. Intentá de nuevo.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-form-titulo"
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 id="lab-form-titulo" className="text-xl font-semibold text-azul">
            {esEdicion ? 'Editar laboratorio' : 'Nuevo laboratorio'}
          </h2>
          {!esEdicion && (
            <p className="text-sm text-pizarra mt-1">
              Pegá la URL de una noticia y Gemini genera las proposiciones automáticamente, o cargalas a mano.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Generación con IA — solo en modo creación */}
          {!esEdicion && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-azul">Generar proposiciones desde una noticia</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlArticulo}
                  onChange={(e) => { setUrlArticulo(e.target.value); limpiarError() }}
                  placeholder="https://www.infobae.com/articulo..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
                  disabled={generando}
                />
                <button
                  type="button"
                  onClick={handleGenerar}
                  disabled={generando || !urlArticulo.trim()}
                  className="px-4 py-2 bg-azul text-white text-sm rounded-lg
                             hover:bg-azul/90 transition-colors disabled:opacity-50 disabled:cursor-wait
                             whitespace-nowrap"
                >
                  {generando ? 'Generando…' : 'Generar con IA'}
                </button>
              </div>
              {generando && (
                <p className="text-xs text-pizarra animate-pulse">
                  Gemini está leyendo el artículo y extrayendo proposiciones…
                </p>
              )}
              {errorGeneracion && (
                <p role="alert" className="text-xs text-red-600">{errorGeneracion}</p>
              )}
            </div>
          )}

          {/* Título y descripción */}
          <div className="space-y-4">
            <div>
              <label htmlFor="lab-titulo" className="block text-sm font-medium text-pizarra mb-1">
                Título *
              </label>
              <input
                id="lab-titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="ej. Análisis de proposiciones — TP Nº 1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
                required
              />
            </div>
            <div>
              <label htmlFor="lab-descripcion" className="block text-sm font-medium text-pizarra mb-1">
                Descripción <span className="font-normal text-pizarra/60">(opcional)</span>
              </label>
              <input
                id="lab-descripcion"
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="ej. Proposiciones sobre política económica argentina 2023"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
              />
            </div>
          </div>

          {/* Proposiciones */}
          <div>
            <h3 className="text-sm font-semibold text-pizarra mb-3">
              Proposiciones ({proposiciones.length}/5)
              {!esEdicion && proposiciones.some((p) => p.texto) && (
                <span className="ml-2 text-xs font-normal text-pizarra/60">
                  — podés editar las generadas por IA antes de crear
                </span>
              )}
            </h3>
            <div className="space-y-4">
              {proposiciones.map((prop, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pizarra uppercase tracking-wide">
                      Proposición {idx + 1}
                    </span>
                    {proposiciones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => quitarProposicion(idx)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`prop-texto-${idx}`} className="block text-xs text-pizarra mb-1">
                      Texto de la proposición *
                    </label>
                    <textarea
                      id={`prop-texto-${idx}`}
                      value={prop.texto}
                      onChange={(e) => actualizarProposicion(idx, 'texto', e.target.value)}
                      rows={2}
                      placeholder="ej. «La inflación anual en Argentina superó el 100% en 2023.»"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={`prop-fuente-${idx}`} className="block text-xs text-pizarra mb-1">
                      Contexto de la fuente *
                    </label>
                    <textarea
                      id={`prop-fuente-${idx}`}
                      value={prop.fuenteContexto}
                      onChange={(e) => actualizarProposicion(idx, 'fuenteContexto', e.target.value)}
                      rows={2}
                      placeholder="ej. «Informe del INDEC, Dic. 2023. Índice de precios al consumidor...»"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {proposiciones.length < 5 && (
              <button
                type="button"
                onClick={agregarProposicion}
                className="mt-3 text-sm text-azul hover:text-azul/80 flex items-center gap-1"
              >
                + Agregar proposición
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onCancelar}
              disabled={cargando}
              className="px-4 py-2 text-sm text-pizarra border border-gray-300 rounded-lg
                         hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || generando}
              className="px-4 py-2 text-sm bg-azul text-white rounded-lg
                         hover:bg-azul/90 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {cargando
                ? (esEdicion ? 'Guardando…' : 'Creando…')
                : (esEdicion ? 'Guardar cambios' : 'Crear laboratorio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
