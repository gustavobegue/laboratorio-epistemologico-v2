import { useState } from 'react'

import type { PastillaAplicada } from '../types'
import { getColorBadge } from '../lib/colores'

interface Props {
  pastillasAplicadas: PastillaAplicada[]
  onDrop: (pastillaId: string) => void
  onQuitarPastilla: (pastillaId: string) => void
}

export function AnalisisZone({ pastillasAplicadas, onDrop, onQuitarPastilla }: Props) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <section
      role="region"
      aria-label="Zona de análisis — arrastre pastillas aquí para aplicarlas"
      aria-dropeffect="copy"
      className={`
        min-h-[100px] rounded-xl border-2 border-dashed p-4 transition-colors
        ${dragOver
          ? 'border-azul bg-blue-50'
          : 'border-gray-300 bg-gray-50'
        }
      `}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const pastillaId = e.dataTransfer.getData('pastillaId')
        if (pastillaId) onDrop(pastillaId)
      }}
    >
      {pastillasAplicadas.length === 0 ? (
        <p className="text-pizarra text-sm text-center py-4 opacity-60">
          Arrastrá una pastilla aquí para analizarla
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {pastillasAplicadas.map(({ pastilla, sistemaTeoricoEspecificado }) => (
            <div
              key={pastilla.id}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-full text-sm font-medium border
                ${getColorBadge(pastilla.colorBase)}
              `}
            >
              <span>{pastilla.nombre}</span>
              {sistemaTeoricoEspecificado && (
                <span className="text-xs opacity-70">→ {sistemaTeoricoEspecificado}</span>
              )}
              <button
                aria-label={`Quitar pastilla ${pastilla.nombre}`}
                className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => onQuitarPastilla(pastilla.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
