import type { Pastilla, TipoPastilla } from '../types'
import { PastillaChip } from './PastillaChip'

interface Props {
  tipo: TipoPastilla
  pastillas: Pastilla[]
  onDragStart: (pastillaId: string) => void
}

const TITULO: Record<TipoPastilla, string> = {
  atributo: 'Pastillas-Atributo',
  relacion: 'Pastillas-Relación',
  meta: 'Pastillas-Meta',
}

const DESCRIPCION: Record<TipoPastilla, string> = {
  atributo: 'Se predican directamente de la proposición',
  relacion: 'Requieren especificar un sistema teórico o evidencia',
  meta: 'Se aplican al acto de analizar, no a la proposición',
}

const BORDE: Record<TipoPastilla, string> = {
  atributo: 'border-blue-200',
  relacion: 'border-amber-200',
  meta: 'border-violet-200',
}

export function PastillaPanel({ tipo, pastillas, onDragStart }: Props) {
  return (
    <section
      aria-label={TITULO[tipo]}
      className={`border rounded-xl p-4 bg-white ${BORDE[tipo]}`}
    >
      <h3 className="font-semibold text-azul text-sm mb-0.5">{TITULO[tipo]}</h3>
      <p className="text-pizarra text-xs mb-3">{DESCRIPCION[tipo]}</p>
      <div className="flex flex-wrap gap-2">
        {pastillas.map((p) => (
          <PastillaChip key={p.id} pastilla={p} onDragStart={onDragStart} compacto />
        ))}
      </div>
    </section>
  )
}
