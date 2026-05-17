// Tipos del dominio epistemológico — Laboratorio Epistemológico V2

export type TipoPastilla = 'atributo' | 'relacion' | 'meta'

export type Veredicto =
  | 'PERTINENTE'
  | 'PARCIALMENTE_PERTINENTE'
  | 'NO_PERTINENTE'
  | 'INSUFICIENTE_INFORMACION'

export type FeedbackEstado = 'vacio' | 'cargando' | 'completo' | 'error' | 'cuota_agotada'

export type Rol = 'profesor' | 'alumno'

export interface Pastilla {
  id: string
  nombre: string
  tipo: TipoPastilla
  autorReferencia: string
  descripcionBreve: string
  colorBase: string
}

export interface PastillaAplicada {
  pastilla: Pastilla
  sistemaTeoricoEspecificado?: string
}

export interface Proposicion {
  id: string
  texto: string
  fuenteContexto: string
  fuenteUrl?: string
}

export interface RespuestaLlm {
  razonamiento: string
  elementosRelevantes: string[]
  veredicto: Veredicto
  justificacionDoctrinal: string
  sugerenciaPedagogica: string
  argumentoFormal?: string | null
}

export interface Evaluacion {
  id: string
  laboratorioId: string
  proposicionId: string
  pastillaId: string
  sistemaTeoricoEspecificado?: string
  veredicto: Veredicto
  razonamiento: string
  elementosRelevantes: string[]
  justificacionDoctrinal: string
  sugerenciaPedagogica: string
  modeloLlm: string
  temperaturaUsada: number
  promptCompleto: string
  timestamp: Date
}

export interface Laboratorio {
  id: string
  titulo: string
  descripcion?: string
  ownerId: string
  proposiciones: Proposicion[]
  evaluaciones: Evaluacion[]
  creadoEn: Date
  actualizadoEn: Date
  compartible: boolean
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  evaluacionesHoy: number
  fechaContadorEvaluaciones: string
}

export interface CuotaSistema {
  fecha: string
  totalDia: number
  techo: number
}
