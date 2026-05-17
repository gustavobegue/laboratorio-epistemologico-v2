import { useState } from 'react'

import type { Pastilla } from '../types'

interface Props {
  pastilla: Pastilla
  onConfirmar: (sistemaTeoricoEspecificado: string) => void
  onCancelar: () => void
}

export function RelacionModal({ pastilla, onConfirmar, onCancelar }: Props) {
  const [sistemaTeoricoEspecificado, setSistemaTeoricoEspecificado] = useState('')

  const handleConfirmar = () => {
    const valor = sistemaTeoricoEspecificado.trim()
    if (valor) onConfirmar(valor)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 id="modal-titulo" className="text-azul font-semibold text-lg mb-1">
          Pastilla-Relación: {pastilla.nombre}
        </h2>
        <p className="text-pizarra text-sm mb-4">
          Esta pastilla requiere especificar un segundo término. ¿Contra qué sistema
          teórico o cuerpo de evidencia se evalúa esta relación?
        </p>

        <label htmlFor="sistema-teorico" className="block text-sm font-medium text-azul mb-1">
          Sistema teórico o evidencia
        </label>
        <textarea
          id="sistema-teorico"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-azul/40 focus:border-azul"
          placeholder="Ej: Marco teórico del materialismo histórico / Datos de la EPH 2023..."
          value={sistemaTeoricoEspecificado}
          onChange={(e) => setSistemaTeoricoEspecificado(e.target.value)}
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 text-sm text-pizarra hover:text-azul transition-colors"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm bg-azul text-white rounded-lg
                       hover:bg-azul/90 transition-colors disabled:opacity-40"
            disabled={!sistemaTeoricoEspecificado.trim()}
            onClick={handleConfirmar}
          >
            Aplicar pastilla
          </button>
        </div>
      </div>
    </div>
  )
}
