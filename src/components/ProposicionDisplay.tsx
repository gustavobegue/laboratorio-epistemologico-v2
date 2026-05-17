import type { Proposicion } from '../types'

interface Props {
  proposicion: Proposicion
  indice: number
}

export function ProposicionDisplay({ proposicion, indice }: Props) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs text-pizarra uppercase tracking-wide mb-2">
        Proposición {indice + 1}
      </p>
      <blockquote className="text-azul text-lg font-serif leading-relaxed border-l-4 border-azul pl-4 mb-4">
        "{proposicion.texto}"
      </blockquote>
      <details className="group">
        <summary className="text-xs text-pizarra cursor-pointer hover:text-azul transition-colors">
          Ver contexto de la fuente
        </summary>
        <p className="mt-2 text-sm text-pizarra leading-relaxed">
          {proposicion.fuenteContexto}
        </p>
        {proposicion.fuenteUrl && (
          <p className="mt-1 text-xs text-pizarra opacity-60">{proposicion.fuenteUrl}</p>
        )}
      </details>
    </article>
  )
}
