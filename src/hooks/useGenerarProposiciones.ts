import { useState, useCallback } from 'react'
import { httpsCallable } from 'firebase/functions'

import { functions } from '../lib/firebase'

export interface ProposicionGenerada {
  texto: string
  fuenteContexto: string
}

interface GenerarResult {
  proposiciones: ProposicionGenerada[]
  tituloSugerido: string
}

const generarFn = httpsCallable<{ url: string }, GenerarResult>(functions, 'generarProposiciones')

export function useGenerarProposiciones() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generar = useCallback(async (url: string): Promise<GenerarResult | null> => {
    setCargando(true)
    setError(null)
    try {
      const result = await generarFn({ url })
      return result.data
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      const msg = err instanceof Error ? err.message : ''
      // Para resource-exhausted el servidor ya envía el mensaje en español con el tiempo exacto
      if (code.includes('resource-exhausted') && msg) {
        setError(msg)
      } else if (code.includes('unavailable')) {
        setError('No se pudo acceder al artículo. Verificá que la URL sea correcta y pública.')
      } else if (code.includes('failed-precondition')) {
        setError('El artículo no tiene suficiente texto. Probá con otra URL.')
      } else {
        setError(msg || 'No se pudieron generar las proposiciones. Intentá de nuevo.')
      }
      return null
    } finally {
      setCargando(false)
    }
  }, [])

  const limpiarError = useCallback(() => setError(null), [])

  return { generar, cargando, error, limpiarError }
}
