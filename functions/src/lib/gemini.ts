import { GoogleGenerativeAI } from '@google/generative-ai'
import { DOCTRINA } from './doctrina'

export interface RespuestaLlm {
  razonamiento: string
  elementosRelevantes: string[]
  veredicto: 'PERTINENTE' | 'PARCIALMENTE_PERTINENTE' | 'NO_PERTINENTE' | 'INSUFICIENTE_INFORMACION'
  justificacionDoctrinal: string
  sugerenciaPedagogica: string
  argumentoFormal?: string | null
}

const VEREDICTOS_VALIDOS = new Set([
  'PERTINENTE',
  'PARCIALMENTE_PERTINENTE',
  'NO_PERTINENTE',
  'INSUFICIENTE_INFORMACION',
])

export function esRespuestaValida(obj: unknown): obj is RespuestaLlm {
  if (typeof obj !== 'object' || obj === null) return false
  const r = obj as Record<string, unknown>
  return (
    typeof r.razonamiento === 'string' &&
    Array.isArray(r.elementosRelevantes) &&
    typeof r.veredicto === 'string' &&
    VEREDICTOS_VALIDOS.has(r.veredicto) &&
    typeof r.justificacionDoctrinal === 'string' &&
    typeof r.sugerenciaPedagogica === 'string' &&
    (r.argumentoFormal === undefined || r.argumentoFormal === null || typeof r.argumentoFormal === 'string')
  )
}

function construirPrompt(
  proposicion: { texto: string; fuenteContexto: string },
  pastillaId: string,
  nombrePastilla: string,
  sistemaTeoricoEspecificado?: string,
): string {
  const doctrina = DOCTRINA[pastillaId] ?? 'Doctrina no disponible para esta pastilla.'
  const bloqueRelacion = sistemaTeoricoEspecificado
    ? `\nSISTEMA TEÓRICO / EVIDENCIA ESPECIFICADO POR EL ESTUDIANTE:\n"${sistemaTeoricoEspecificado}"\n`
    : ''

  return `ROL: Sos un evaluador epistemológico para un curso universitario de Introducción al Pensamiento Científico. Tu tarea NO es opinar sobre la veracidad de la proposición, sino evaluar si la categoría metodológica aplicada es pertinente según la doctrina provista.

DOCTRINA APLICABLE (única fuente de verdad):
${doctrina}

PROPOSICIÓN ANALIZADA:
"${proposicion.texto}"

CONTEXTO DE LA FUENTE:
"${proposicion.fuenteContexto}"

PASTILLA APLICADA:
"${nombrePastilla}"
${bloqueRelacion}
INSTRUCCIONES:
1. Identificá elementos relevantes de la proposición para evaluar la pastilla.
2. Compará contra la doctrina provista, NO contra conocimiento general del autor.
3. Emití un veredicto: PERTINENTE, PARCIALMENTE_PERTINENTE, NO_PERTINENTE.
4. Si la doctrina es insuficiente, devolvé INSUFICIENTE_INFORMACION. NO inventes criterios.
5. Solo si el veredicto es PERTINENTE: incluí "argumentoFormal" con un argumento lógico en 3-4 oraciones que formalice por qué la categoría metodológica aplica con precisión a esta proposición. Usá estructura: (a) premisa mayor doctrinal, (b) premisa menor sobre la proposición, (c) conclusión. En cualquier otro veredicto, omitir ese campo o enviarlo como null.

Respondé ÚNICAMENTE con este JSON, sin texto adicional:
{
  "razonamiento": "2-4 oraciones explicando el análisis",
  "elementosRelevantes": ["elemento1", "elemento2"],
  "veredicto": "PERTINENTE",
  "justificacionDoctrinal": "cita la doctrina provista",
  "sugerenciaPedagogica": "qué debería revisar el estudiante",
  "argumentoFormal": "Solo cuando PERTINENTE: (a) premisa doctrinal... (b) en esta proposición... (c) por lo tanto..."
}`
}

function limpiarJson(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

export async function evaluarConGemini(
  apiKey: string,
  proposicion: { texto: string; fuenteContexto: string },
  pastillaId: string,
  nombrePastilla: string,
  sistemaTeoricoEspecificado?: string,
): Promise<RespuestaLlm> {
  console.log(`[Gemini] Iniciando evaluación — pastilla: ${pastillaId}`)

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const prompt = construirPrompt(proposicion, pastillaId, nombrePastilla, sistemaTeoricoEspecificado)

  let text: string
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        // @ts-expect-error thinkingConfig no está en los tipos de v0.21 pero sí en la API
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    text = limpiarJson(result.response.text())
    console.log(`[Gemini] Respuesta recibida (${text.length} chars)`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[Gemini] Error en llamada a API: ${msg}`)
    throw new Error(`Gemini API error: ${msg}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    console.error(`[Gemini] JSON inválido: ${text.slice(0, 200)}`)
    throw new Error('Respuesta de Gemini no es JSON válido')
  }

  if (!esRespuestaValida(parsed)) {
    console.error(`[Gemini] Schema inválido: ${JSON.stringify(parsed).slice(0, 200)}`)
    throw new Error('Respuesta de Gemini no cumple el schema esperado')
  }

  console.log(`[Gemini] Veredicto: ${parsed.veredicto}`)
  return parsed
}
