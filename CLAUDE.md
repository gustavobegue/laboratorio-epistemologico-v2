# Laboratorio Epistemológico V2

Herramienta pedagógica para la cátedra de Introducción al Pensamiento Científico (Lic. en Ciencia Política, UNPSJB). Los alumnos analizan proposiciones arrastrando "pastillas metodológicas" sobre ellas y reciben feedback evaluado por un LLM.

## Stack

- React 18 + TypeScript estricto + Vite
- Tailwind (paleta Legal-Tech: azul `#1e3a5f`, gris pizarra `#475569`, crema `#faf8f3`, serif para headers tipo Lora o Source Serif, sans para UI tipo Inter)
- Firebase 10+ (Firestore + Functions + Auth anónima)
- Zustand para estado global (no Redux)
- React Router v6

## Reglas de código no negociables

- TypeScript estricto, cero uso de `any`
- Sin API keys en el frontend, jamás. Toda llamada al LLM pasa por Cloud Functions
- Comentarios en español, código en inglés
- Componentes funcionales con hooks, nunca clases
- Una exportación por archivo cuando es componente
- Imports ordenados: React, libs externas, internos, tipos, estilos

## Workflow

Trabajamos en 3 iteraciones, NO generación monolítica:

1. **Iteración 1** — Esqueleto + tipos + reglas Firestore (sin lógica de negocio)
2. **Iteración 2** — UI completa con datos mockeados (sin llamadas a backend)
3. **Iteración 3** — Integración LLM + persistencia Firestore

Cada iteración es revisable y commiteable antes de continuar. Ver `docs/iteraciones.md` para los prompts de cada una.

## Tipos de pastillas (arquitectura conceptual)

La mecánica de drag & drop distingue tres tipos con tratamiento visual diferenciado:

1. **Pastillas-atributo** (Fáctico, Empírico, Observacional): se predican de la proposición directamente.
2. **Pastillas-relación** (Nomológico-Deductivo, Falsable, Verificable): requieren un segundo término; el usuario especifica contra qué sistema teórico o cuerpo de evidencia se evalúa.
3. **Pastillas-meta** (modelos de cientificidad de Wallerstein y Pardo): no se aplican a la proposición sino al acto de analizarla. Van en un panel separado: "¿Desde qué modelo de cientificidad estás juzgando esta proposición?".

## Documentos clave

- Arquitectura y decisiones técnicas: `docs/arquitectura.md`
- Doctrina epistemológica (Bunge, Klimovsky, Pardo, Wallerstein): `docs/doctrina-pastillas.md`
- Prompt de evaluación del LLM: `docs/prompts-llm.md`
- Prompts de desarrollo iterativo: `docs/iteraciones.md`

## Preferencias del autor

- Workflows determinísticos con verificación humana > generación autónoma
- Procesamiento local cuando es viable
- Trazabilidad y modularidad como criterios de diseño
- Logging de todas las evaluaciones (proposición + pastilla + veredicto + razonamiento)
