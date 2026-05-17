# Arquitectura y decisiones técnicas

## Flujo de datos

```
Alumno (React)
    ↓  drag & drop pastilla sobre proposición
Cloud Function (Firebase)
    ↓  agrega API key + doctrina canónica + prompt estructurado
Google Gemini API (capa gratuita)
    ↓  devuelve JSON con veredicto + razonamiento
Cloud Function
    ↓  valida schema JSON, loguea en Firestore
Firestore
    ↓  actualiza estado
Alumno (React)  ←  muestra feedback
```

## Stack y justificaciones

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | React 18 + TypeScript estricto + Vite | Ecosistema maduro, tipado evita errores en estructura de datos pedagógica |
| Estilos | Tailwind + paleta custom | Velocidad de desarrollo, paleta Legal-Tech aplicable directamente |
| Estado | Zustand | Más simple que Redux para el volumen de estado de esta app |
| Routing | React Router v6 | Estándar, sin necesidad de alternativas |
| Backend | Firebase Cloud Functions | Serverless, integración nativa con Firestore, sin servidor que mantener |
| DB | Firestore | Tiempo real nativo, sin schema rígido (útil para datos de laboratorio variables) |
| Auth | Firebase Auth anónima | Alumnos sin cuenta, trazabilidad por sesión |
| LLM | Google Gemini 2.0 Flash (capa gratuita) | 15 req/min, 1M tokens/día sin costo. Temperatura baja (0.1–0.3), output JSON estricto vía `responseMimeType: "application/json"` |

## Decisiones de seguridad no negociables

### API keys
- **Nunca en el frontend.** Todo request al LLM pasa por una Cloud Function que agrega la API key del lado servidor.
- Variables de entorno con prefijo `VITE_` solo para configuración no sensible (project ID, etc.).
- Cloud Functions usan variables de entorno sin prefijo `VITE_`, configuradas en Firebase Console.
- La API key de Gemini se obtiene gratis en Google AI Studio (aistudio.google.com) — no requiere tarjeta de crédito en la capa gratuita.

### Rate limiting y gestión de cuota gratuita

El sistema implementa dos niveles de control para garantizar que nunca se supere la capa gratuita de Gemini (1.500 req/día) ni se genere costo inesperado.

**Nivel 1 — Cuota global diaria (protege el límite de Gemini)**

Documento Firestore `/sistema/cuota`:
```
{
  fecha: "2026-05-17",   // fecha UTC del contador activo
  totalDia: 342,         // llamadas realizadas hoy
  techo: 1200            // 80% de 1.500 — buffer de seguridad
}
```

Lógica en Cloud Function `evaluarPastilla` antes de llamar a Gemini:
1. Leer `/sistema/cuota` en transacción Firestore.
2. Si `fecha` ≠ fecha UTC actual → resetear `totalDia = 0` y actualizar `fecha` (auto-reset sin cron job).
3. Si `totalDia >= techo` → devolver error sin llamar a Gemini. El frontend muestra: *"El sistema alcanzó su límite de evaluaciones para hoy. Volvé a intentarlo mañana."*
4. Si hay cuota disponible → incrementar `totalDia` y proceder con la llamada.

**Nivel 2 — Cuota por alumno-día (evita que un solo usuario agote la cuota global)**

Campo `evaluacionesHoy` en el documento de sesión del alumno (`/sesiones/{sessionId}`):
- Techo sugerido: 30 evaluaciones por alumno por día.
- Misma lógica de auto-reset por fecha UTC.
- Error diferenciado: *"Alcanzaste tu límite de evaluaciones por hoy. Volvé mañana."*

**Orden de validación en la Cloud Function:**
1. Primero chequear cuota del alumno (error más frecuente, evita leer cuota global innecesariamente).
2. Luego chequear cuota global.
3. Recién entonces llamar a Gemini.

**Por qué no se necesita cron job para el reset:**
El reset es lazy: ocurre automáticamente en la primera llamada del día nuevo. Si no hay llamadas, no hay nada que resetear. El campo `fecha` actúa como clave de invalidación.

- Importante: anticipar picos nocturnos cuando todos hacen el TP el mismo día. El techo de 1.200 llamadas/día equivale a ~40 alumnos haciendo 30 evaluaciones cada uno — dimensionado para una cátedra típica.

### Firestore rules
- Reglas restrictivas por defecto desde el día uno, nunca modo test en producción.
- Lectura pública con link (ID largo aleatorio, no incremental).
- Escritura solo del owner del laboratorio.
- Colección de evaluaciones separada: el alumno no puede editar ni eliminar evaluaciones ya registradas.
- Separación entre datos de identidad (perfil) y datos de contenido (laboratorio compartible).

### Estructura de IDs
- Documentos de laboratorio: ID aleatorio largo como token de acceso del link.
- Evitar secuenciales `/labs/1`, `/labs/2` que permiten enumeración.

## Consideraciones académicas

### Reproducibilidad de evaluaciones
- Guardar junto a cada evaluación: modelo LLM + versión + prompt completo + temperatura + veredicto.
- Si un alumno reclama una nota en seis meses, la evaluación debe ser reproducible.

### Logging obligatorio
- Toda evaluación loguea: proposición + pastilla aplicada + doctrina inyectada + veredicto + razonamiento + timestamp.
- Este log es insumo pedagógico para detectar patrones de error del modelo y de los alumnos, y refinar la doctrina.

### Validación del input
- Si se permite upload de PDF: limitar tamaño, validar tipo MIME.
- Si se permiten links: validar dominio, considerar lista blanca de fuentes académicas.

### Plan de contingencia si falla la API del LLM
- Mensaje de error claro (no pantalla rota).
- Modo offline con evaluaciones precomputadas para los recursos de ejemplo incluidos.
- Cola de reintentos o botón manual de reintento.

### Política de retención
- Definir qué se guarda, por cuánto tiempo, y mostrarlo en pantalla de aceptación al inicio.
- Aplica especialmente si alumnos suben PDFs propios o de terceros con copyright.

## Consideración futura (no para iteración 1)

Pantalla final donde el alumno evalúe la evaluación del LLM con las mismas pastillas: ¿Es factible? ¿Es objetiva? ¿Desde qué modelo de cientificidad opera la IA? Esto cierra el círculo wallersteiniano y agrega reflexividad que ningún libro de texto puede ofrecer.
