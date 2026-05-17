# Plan de desarrollo iterativo

Tres entregas secuenciales. Cada una es revisable y commiteable antes de continuar la siguiente. No generación monolítica.

---

## Iteración 1 — Esqueleto + tipos + configuración base

**Criterio de completitud:** el proyecto compila sin errores, las reglas de Firestore están definidas, no hay lógica de negocio implementada.

### Prompt

```
CONTEXTO DEL PROYECTO:
Estoy construyendo "Laboratorio Epistemológico V2", una herramienta
pedagógica para una cátedra universitaria de Introducción al
Pensamiento Científico (Lic. en Ciencia Política, UNPSJB). Los alumnos
analizan proposiciones extraídas de fuentes de actualidad arrastrando
"pastillas metodológicas" (categorías de Bunge, Klimovsky, Pardo y
Wallerstein) sobre ellas, y reciben feedback evaluado por un LLM.

TAREA DE ESTA ITERACIÓN:
Generá ÚNICAMENTE el esqueleto del proyecto. NO implementes lógica de
negocio, NO conectes con LLM, NO escribas drag & drop funcional. Solo
estructura, tipos, y configuración base.

STACK:
- React 18 con TypeScript estricto
- Vite como bundler
- Tailwind para estilos (paleta sobria: azul oscuro #1e3a5f, gris
  pizarra #475569, fondo crema #faf8f3, tipografía serif para headers
  tipo Lora o Source Serif, sans para UI tipo Inter)
- Firebase 10+ (Firestore + Functions + Auth anónima)
- Zustand para estado global (no Redux)
- React Router v6

ENTREGABLES DE ESTA ITERACIÓN:
1. Estructura de carpetas: /src/components, /src/pages, /src/lib,
   /src/types, /src/hooks, /src/stores, /functions (Cloud Functions).
2. Archivo /src/types/index.ts con interfaces TypeScript para:
   Proposicion, Pastilla, Laboratorio, Evaluacion, Usuario, CuotaSistema.
   CuotaSistema incluye: fecha (string ISO), totalDia (number), techo (number).
3. Archivo firestore.rules con reglas restrictivas por defecto y
   comentarios indicando dónde se relajarán.
4. Configuración de Vite, tsconfig estricto (noImplicitAny, strict,
   strictNullChecks), tailwind.config con la paleta indicada.
5. README.md con: descripción del proyecto, stack, cómo correr, y
   un diagrama ASCII del flujo de datos React → Cloud Function →
   LLM API → Firestore → React.

RESTRICCIONES (no negociables):
- TypeScript estricto. CERO uso de `any`.
- Ningún componente con más de 150 líneas en esta iteración (son
  esqueletos, no implementaciones).
- Ninguna API key hardcodeada, ni siquiera placeholder. Usar
  variables de entorno con prefijo VITE_ para frontend y sin
  prefijo para Cloud Functions.
- Comentarios en español, código en inglés.
- NO instales librerías que no haya pedido. Si pensás que una es
  necesaria, sugerila en el README pero no la agregues.

ESTILO DE CÓDIGO:
- Componentes funcionales con hooks, nunca clases.
- Nombres descriptivos en inglés (ej: PastillaCard, no PCard).
- Una exportación por archivo cuando sea componente.
- Imports ordenados: React, libs externas, internos, tipos, estilos.

FORMATO DE ENTREGA:
Devolvé un solo árbol de archivos con el contenido completo de cada
uno. Al final, una lista numerada de los siguientes pasos sugeridos
para la iteración 2.
```

---

## Iteración 2 — UI completa con datos mockeados

**Criterio de completitud:** la interfaz es navegable con datos estáticos. Drag & drop funciona. No hay llamadas a backend ni a LLM.

### Prompt

```
CONTEXTO DEL PROYECTO:
[Mismo bloque de contexto de la iteración 1]

TAREA DE ESTA ITERACIÓN:
Implementá la UI completa usando datos mockeados. NO conectes con
Firebase ni con el LLM. El objetivo es tener una interfaz navegable
y testeable visualmente antes de integrar el backend.

ENTREGABLES DE ESTA ITERACIÓN:
1. Datos mock en /src/lib/mocks.ts: al menos 3 proposiciones de ejemplo
   con sus metadatos, y el set completo de pastillas con sus tipos
   (atributo, relación, meta) y colores diferenciados.
2. Página principal: lista de laboratorios del usuario (mock).
3. Página del laboratorio: visualización de la proposición, zona de
   drag & drop, panel de pastillas diferenciadas por tipo.
4. Panel de pastillas-meta ("¿Desde qué modelo de cientificidad estás
   analizando?") separado visualmente del área de análisis.
5. Modal o segundo slot para pastillas-relación: cuando el alumno
   arrastra una pastilla de tipo "relación", aparece un campo para
   especificar contra qué sistema teórico/evidencia se evalúa.
6. Panel de feedback con estado "pendiente" (spinner o placeholder).
7. Componente de compartir laboratorio (muestra un link ficticio).

RESTRICCIONES:
- Cero llamadas a red. Todo es local y síncrono.
- Mantener todas las restricciones de la iteración 1.
- Accesibilidad mínima: roles ARIA en zona de drop, contraste WCAG AA.
- Responsive: funcional en 1024px y 768px de ancho mínimo.

FORMATO DE ENTREGA:
Árbol de archivos modificados/nuevos. Lista de decisiones de UX que
tomaste y por qué. Lista de lo que falta para la iteración 3.
```

---

## Iteración 3 — Integración LLM + persistencia Firestore

**Criterio de completitud:** un alumno puede analizar una proposición, recibir feedback evaluado por el LLM, y compartir su laboratorio con un link.

### Prompt

```
CONTEXTO DEL PROYECTO:
[Mismo bloque de contexto de la iteración 1]

TAREA DE ESTA ITERACIÓN:
Integrá el backend real: Cloud Functions que llaman al LLM con el
prompt de evaluación, y persistencia en Firestore. La UI ya está
construida — solo conectar.

ENTREGABLES DE ESTA ITERACIÓN:
1. Cloud Function `evaluarPastilla`: recibe proposición + pastilla +
   contexto de fuente, inyecta la doctrina canónica correspondiente
   (hardcodeada en la función por ahora), llama a Gemini 2.0 Flash con
   temperatura 0.2 y responseMimeType "application/json", valida el
   schema JSON de respuesta, loguea en Firestore.
2. Cloud Function `crearLaboratorio` y `obtenerLaboratorio`: CRUD
   básico con reglas de acceso del owner.
3. Hook `useEvaluacion` en el frontend que llama a `evaluarPastilla`
   y maneja estados: idle → loading → success → error.
4. Persistencia del estado del laboratorio en Firestore (pastillas
   aplicadas, evaluaciones recibidas).
5. Link de compartir funcional: genera URL con ID del laboratorio,
   vista de solo lectura para el destinatario.
6. Gestión de cuota en dos niveles (ver docs/arquitectura.md):
   - Documento Firestore `/sistema/cuota` con `fecha`, `totalDia` y
     `techo` (1.200). Auto-reset lazy por fecha UTC, sin cron job.
   - Campo `evaluacionesHoy` por sesión de alumno, techo 30/día.
   - La Cloud Function valida primero cuota del alumno, luego cuota
     global, antes de llamar a Gemini. Si se supera cualquiera,
     devuelve error descriptivo sin realizar la llamada a la API.
   - El frontend muestra mensajes diferenciados según el nivel
     de cuota alcanzado.

RESTRICCIONES:
- La API key del LLM NUNCA toca el cliente. Solo existe en las
  Cloud Functions como variable de entorno.
- Toda evaluación se loguea completa: proposición, pastilla, doctrina
  inyectada, prompt completo, respuesta raw, veredicto, modelo,
  temperatura, timestamp.
- Si la Cloud Function recibe un JSON malformado del LLM: reintentar
  una vez, si falla de nuevo devolver error explícito al frontend.
- Mantener todas las restricciones anteriores.

FORMATO DE ENTREGA:
Árbol de archivos modificados/nuevos. Lista de lo que quedaría
pendiente para una versión de producción (rate limiting avanzado,
segunda llamada de verificación, política de retención, etc.).
```
