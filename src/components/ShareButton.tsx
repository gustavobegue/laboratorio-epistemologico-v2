import { useState } from 'react'

interface Props {
  labId: string
}

export function ShareButton({ labId }: Props) {
  const [copiado, setCopiado] = useState(false)
  const linkCompartible = `${window.location.origin}/lab/${labId}`

  const handleCopiar = () => {
    // Iteración 3: el link será funcional con Firestore
    navigator.clipboard.writeText(linkCompartible).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
      <span className="text-xs text-pizarra flex-1 truncate">{linkCompartible}</span>
      <button
        onClick={handleCopiar}
        aria-label="Copiar link para compartir"
        className="text-xs px-3 py-1.5 bg-azul text-white rounded-lg
                   hover:bg-azul/90 transition-colors whitespace-nowrap"
      >
        {copiado ? '¡Copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}
