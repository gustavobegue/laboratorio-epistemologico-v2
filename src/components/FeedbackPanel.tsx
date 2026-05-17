import type { FeedbackEstado, RespuestaLlm } from '../types'

interface Props {
  estado: FeedbackEstado
  respuesta: RespuestaLlm | null
  mensajeCuota?: string | null
}

const VEREDICTO_ESTILOS: Record<string, string> = {
  PERTINENTE: 'bg-green-100 text-green-800 border-green-300',
  PARCIALMENTE_PERTINENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  NO_PERTINENTE: 'bg-red-100 text-red-800 border-red-300',
  INSUFICIENTE_INFORMACION: 'bg-gray-100 text-gray-700 border-gray-300',
}

const VEREDICTO_LABEL: Record<string, string> = {
  PERTINENTE: 'Pertinente',
  PARCIALMENTE_PERTINENTE: 'Parcialmente pertinente',
  NO_PERTINENTE: 'No pertinente',
  INSUFICIENTE_INFORMACION: 'Información insuficiente',
}

export function FeedbackPanel({ estado, respuesta, mensajeCuota }: Props) {
  if (estado === 'vacio') {
    return (
      <section aria-label="Panel de feedback" aria-live="polite"
        className="border border-gray-200 rounded-xl p-5 bg-white text-center">
        <p className="text-pizarra text-sm opacity-60">
          Arrastrá una pastilla sobre la proposición para recibir feedback epistemológico.
        </p>
      </section>
    )
  }

  if (estado === 'cargando') {
    return (
      <section aria-label="Panel de feedback" aria-live="polite"
        className="border border-gray-200 rounded-xl p-5 bg-white text-center">
        <div className="inline-block w-5 h-5 border-2 border-azul border-t-transparent
                        rounded-full animate-spin mb-2" role="status" aria-label="Evaluando" />
        <p className="text-pizarra text-sm">Evaluando con Gemini...</p>
      </section>
    )
  }

  if (estado === 'cuota_agotada') {
    return (
      <section aria-label="Panel de feedback" aria-live="polite"
        className="border border-orange-200 rounded-xl p-5 bg-orange-50">
        <p className="text-orange-800 text-sm font-medium">
          {mensajeCuota ?? 'El sistema alcanzó su límite de evaluaciones. Intentá más tarde.'}
        </p>
      </section>
    )
  }

  if (estado === 'error' || !respuesta) {
    return (
      <section aria-label="Panel de feedback" aria-live="polite"
        className="border border-red-200 rounded-xl p-5 bg-red-50">
        <p className="text-red-800 text-sm">
          No se pudo obtener la evaluación. Intentá de nuevo.
        </p>
      </section>
    )
  }

  const estiloVeredicto = VEREDICTO_ESTILOS[respuesta.veredicto] ?? VEREDICTO_ESTILOS['INSUFICIENTE_INFORMACION']
  const labelVeredicto = VEREDICTO_LABEL[respuesta.veredicto] ?? respuesta.veredicto

  return (
    <section aria-label="Panel de feedback" aria-live="polite"
      className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${estiloVeredicto}`}>
          {labelVeredicto}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-pizarra uppercase tracking-wide mb-1">Razonamiento</h4>
        <p className="text-sm text-gray-800 leading-relaxed">{respuesta.razonamiento}</p>
      </div>

      {respuesta.argumentoFormal && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2">
            Argumento formal de validez
          </h4>
          <p className="text-sm text-green-900 leading-relaxed">{respuesta.argumentoFormal}</p>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-pizarra uppercase tracking-wide mb-1">Sustento doctrinal</h4>
        <p className="text-sm text-gray-800 leading-relaxed">{respuesta.justificacionDoctrinal}</p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <h4 className="text-xs font-semibold text-pizarra uppercase tracking-wide mb-1">Sugerencia pedagógica</h4>
        <p className="text-sm text-pizarra leading-relaxed">{respuesta.sugerenciaPedagogica}</p>
      </div>
    </section>
  )
}
