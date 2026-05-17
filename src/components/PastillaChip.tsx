import type { Pastilla } from '../types'
import { getColorChip } from '../lib/colores'

interface Props {
  pastilla: Pastilla
  onDragStart: (pastillaId: string) => void
  compacto?: boolean
}

const ETIQUETA_TIPO: Record<string, string> = {
  atributo: 'A',
  relacion: 'R',
  meta: 'M',
}

export function PastillaChip({ pastilla, onDragStart, compacto = false }: Props) {
  const colorClases = getColorChip(pastilla.colorBase)

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Pastilla ${pastilla.nombre} — ${pastilla.descripcionBreve}`}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        border rounded-full cursor-grab active:cursor-grabbing
        text-sm font-medium select-none transition-colors
        ${colorClases}
      `}
      onDragStart={(e) => {
        e.dataTransfer.setData('pastillaId', pastilla.id)
        e.dataTransfer.effectAllowed = 'copy'
        onDragStart(pastilla.id)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDragStart(pastilla.id)
      }}
    >
      <span className="text-xs font-bold opacity-60">{ETIQUETA_TIPO[pastilla.tipo]}</span>
      <span>{pastilla.nombre}</span>
      {!compacto && (
        <span className="text-xs opacity-50 hidden lg:inline">— {pastilla.autorReferencia}</span>
      )}
    </div>
  )
}
