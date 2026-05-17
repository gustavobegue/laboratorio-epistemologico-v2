# Prompt de evaluación del LLM

## Arquitectura en tres capas

### Capa 1 — Doctrina canónica como contexto fijo

No se le pide al modelo que "sepa" Bunge o Klimovsky. Se inyecta en cada llamada una definición operacional breve de la pastilla específica que aplicó el alumno, redactada por la cátedra, con cita textual o paráfrasis controlada del autor.

Esto garantiza:
- Trazabilidad: el modelo evalúa contra la doctrina del curso, no contra su comprensión difusa del autor.
- Consistencia entre evaluaciones de distintos alumnos y distintas sesiones.
- Capacidad de auditoría: si el veredicto es cuestionado, se puede ver exactamente qué doctrina se usó.

Ver `docs/doctrina-pastillas.md` para el contenido de esta capa por pastilla.

### Capa 2 — Tarea estructurada con salida JSON

El modelo no devuelve prosa libre. Devuelve un objeto con campos predefinidos. El backend valida el schema antes de mostrarlo al alumno.

### Capa 3 — Razonamiento explícito antes del veredicto

El modelo justifica antes de calificar, no después. Esto reduce el sesgo de confirmación (cuando da un veredicto y luego racionaliza para sostenerlo).

---

## Prompt completo

```
ROL: Sos un evaluador epistemológico para un curso universitario de
Introducción al Pensamiento Científico. Tu tarea NO es opinar sobre
la veracidad de la proposición, sino evaluar si la categoría
metodológica aplicada por el estudiante es pertinente según la
doctrina que se te provee.

DOCTRINA APLICABLE (única fuente de verdad):
[Inyectar la definición operacional de la pastilla específica que
arrastró el usuario, tomada de docs/doctrina-pastillas.md.
Ejemplo: "Según Bunge (1959), una proposición es FÁCTICA cuando refiere
a hechos del mundo y su verdad depende de la confrontación con datos
empíricos, a diferencia de las proposiciones formales cuya verdad
depende solo de su estructura lógica."]

PROPOSICIÓN ANALIZADA:
"[texto de la proposición]"

CONTEXTO DE LA FUENTE:
"[2-3 oraciones de contexto de donde se extrajo la proposición]"

PASTILLA APLICADA POR EL ESTUDIANTE:
"[nombre de la pastilla]"

INSTRUCCIONES:
1. Identificá qué elementos de la proposición serían relevantes para
   evaluar la pertinencia de la pastilla.
2. Compará esos elementos contra la doctrina provista (NO contra tu
   conocimiento general del autor).
3. Emití un veredicto: PERTINENTE, PARCIALMENTE_PERTINENTE,
   NO_PERTINENTE.
4. Si tenés dudas o la doctrina provista es insuficiente para decidir,
   devolvé INSUFICIENTE_INFORMACION. NO inventes criterios adicionales.

FORMATO DE SALIDA (JSON estricto, sin texto adicional):
{
  "razonamiento": "string, 2-4 oraciones",
  "elementos_relevantes": ["string", ...],
  "veredicto": "PERTINENTE | PARCIALMENTE_PERTINENTE | NO_PERTINENTE | INSUFICIENTE_INFORMACION",
  "justificacion_doctrinal": "string, citando la doctrina provista",
  "sugerencia_pedagogica": "string, qué debería revisar el estudiante"
}
```

---

## Parámetros de la llamada API (Google Gemini)

| Parámetro | Valor | Por qué |
|-----------|-------|---------|
| modelo | `gemini-2.0-flash` | Capa gratuita: 15 req/min, 1M tokens/día. Suficiente para una clase universitaria |
| temperatura | 0.1–0.3 | No se quiere creatividad, se quiere consistencia |
| maxOutputTokens | 600 | Suficiente para el JSON con razonamiento |
| responseMimeType | `application/json` | Gemini soporta JSON mode nativo — fuerza output JSON sin instrucción adicional |
| costo | $0 | La capa gratuita de Google AI Studio no requiere tarjeta de crédito |

> **Cómo obtener la API key:** Google AI Studio en aistudio.google.com → "Get API key" → sin facturación requerida para la capa gratuita.

---

## Puntos críticos no negociables

### INSUFICIENTE_INFORMACION como veredicto válido
Es el seguro contra alucinaciones. Sin esta opción, el modelo siempre forzará un veredicto aunque la doctrina provista no alcance para decidir.

### Validación de schema JSON en backend
Antes de mostrar el resultado al alumno, la Cloud Function valida que el JSON tenga exactamente los campos esperados y los valores de veredicto permitidos. Si el modelo devuelve algo malformado: reintento automático (máx. 2) o error explícito al alumno.

### Logging obligatorio
Cada evaluación guarda en Firestore:
- proposición completa
- pastilla aplicada
- doctrina inyectada (texto completo)
- prompt completo enviado
- respuesta raw del modelo
- veredicto parseado
- modelo + versión + temperatura usados
- timestamp

### Segunda llamada de verificación (opcional para demo, recomendada para producción)
Para casos de alto impacto (veredicto contradice al alumno con alta confianza): un segundo modelo recibe la evaluación del primero y la audita. Duplica costo pero da robustez y reproducibilidad.

---

## Notas sobre "alucinación epistemológica"

El riesgo central no es la alucinación genérica sino que el LLM evalúe según su comprensión difusa de Bunge en lugar de según la doctrina del curso. La Capa 1 (doctrina inyectada) es la defensa principal. Si la doctrina en `docs/doctrina-pastillas.md` es imprecisa o incompleta, el prompt no compensa esa debilidad — el modelo opera con lo que recibe.

La calidad pedagógica del sistema depende en primer lugar de la calidad de la doctrina canónica redactada por la cátedra.
