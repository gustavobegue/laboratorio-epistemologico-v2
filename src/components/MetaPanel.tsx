import type { Pastilla } from '../types'
import { getColorChip } from '../lib/colores'

interface Props {
  pastillas: Pastilla[]
  seleccionada: Pastilla | null
  onSeleccionar: (pastilla: Pastilla | null) => void
}

export function MetaPanel({ pastillas, seleccionada, onSeleccionar }: Props) {
  return (
    <section
      aria-label="Modelo de cientificidad — panel meta"
      className="border border-violet-200 rounded-xl p-4 bg-violet-50/40"
    >
      <h3 className="font-semibold text-azul text-sm mb-0.5">
        ¿Desde qué modelo de cientificidad estás analizando esta proposición?
      </h3>
      <p className="text-pizarra text-xs mb-3">
        Pastillas-Meta (Pardo / Wallerstein) — no se aplican a la proposición, sino al acto de analizarla
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Modelo de cientificidad">
        {pastillas.map((p) => {
          const estaSeleccionada = seleccionada?.id === p.id
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={estaSeleccionada}
              className={`
                px-3 py-1.5 rounded-full border text-sm font-medium transition-all
                ${estaSeleccionada
                  ? `${getColorChip(p.colorBase)} ring-2 ring-offset-1 ring-violet-400`
                  : `${getColorChip(p.colorBase)} opacity-60`
                }
              `}
              onClick={() => onSeleccionar(estaSeleccionada ? null : p)}
            >
              {p.nombre}
            </button>
          )
        })}
      </div>
      {seleccionada && (
        <p className="mt-3 text-xs text-pizarra">
          <span className="font-medium">{seleccionada.nombre}:</span>{' '}
          {seleccionada.descripcionBreve}
        </p>
      )}
    </section>
  )
}
