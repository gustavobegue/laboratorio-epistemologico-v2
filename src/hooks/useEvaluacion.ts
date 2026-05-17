import { useState, useCallback } from 'react'
import { httpsCallable, HttpsCallableResult } from 'firebase/functions'

import { functions } from '../lib/firebase'
import type { FeedbackEstado, Proposicion, RespuestaLlm } from '../types'

interface EvaluarParams {
  proposicion: Proposicion
  pastillaId: string
  nombrePastilla: string
  laboratorioId: string
  proposicionId: string
  sistemaTeoricoEspecificado?: string
}

const evaluarPastillaFn = httpsCallable<EvaluarParams, RespuestaLlm>(functions, 'evaluarPastilla')

export function useEvaluacion() {
  const [estado, setEstado] = useState<FeedbackEstado>('vacio')
  const [respuesta, setRespuesta] = useState<RespuestaLlm | null>(null)
  const [mensajeCuota, setMensajeCuota] = useState<string | null>(null)

  const evaluar = useCallback(async (params: EvaluarParams) => {
    setEstado('cargando')
    setRespuesta(null)
    setMensajeCuota(null)

    try {
      const result: HttpsCallableResult<RespuestaLlm> = await evaluarPastillaFn(params)
      setRespuesta(result.data)
      setEstado('completo')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      const msg = err instanceof Error ? err.message : ''
      if (code.includes('resource-exhausted')) {
        setMensajeCuota(msg || null)
        setEstado('cuota_agotada')
      } else {
        setEstado('error')
      }
    }
  }, [])

  const reset = useCallback(() => {
    setEstado('vacio')
    setRespuesta(null)
    setMensajeCuota(null)
  }, [])

  return { estado, respuesta, mensajeCuota, evaluar, reset }
}
