# Laboratorio Epistemológico V2

Herramienta pedagógica para la cátedra de **Introducción al Pensamiento Científico** (Lic. en Ciencia Política, UNPSJB). Los alumnos analizan proposiciones arrastrando "pastillas metodológicas" sobre ellas y reciben feedback evaluado por IA.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript estricto + Vite |
| Estilos | Tailwind CSS |
| Estado | Zustand |
| Routing | React Router v6 |
| Backend | Firebase Cloud Functions (Node 22) |
| Base de datos | Firestore |
| Auth | Firebase Auth — Email/Password |
| LLM | Google Gemini 2.0 Flash (capa gratuita) |
| Secretos | Firebase Secret Manager |

## Roles

| Rol | Capacidades |
|-----|-------------|
| **Profesor** | Crear laboratorios, generar proposiciones con IA desde URL, compartir enlace a alumnos |
| **Alumno** | Analizar proposiciones arrastrando pastillas, ver feedback del LLM |

## Flujo principal

```
Profesor crea laboratorio → IA genera proposiciones desde URL de noticia
    │
    └─ comparte enlace /lab/:id al grupo
           │
           ▼
Alumno arrastra pastilla epistemológica sobre proposición
    │
    ▼
Cloud Function: evaluarPastilla
    │  valida rol → cuota alumno → cuota global → llama a Gemini
    ▼
Gemini 2.0 Flash
    │  veredicto + razonamiento + argumento formal (si PERTINENTE)
    ▼
Firestore (log completo de evaluación)
    │
    ▼
Alumno ve feedback en tiempo real
```

## Configuración inicial

### Requisitos

- Node.js 22+
- Firebase CLI: `npm install -g firebase-tools`
- Proyecto Firebase con Firestore, Auth y Functions habilitados

### 1. Clonar y dependencias

```bash
git clone <repo>
cd laboratorio-epistemologico-v2

npm install
cd functions && npm install && cd ..
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
# Completar con los valores del proyecto Firebase
```

Los valores se obtienen en Firebase Console → Configuración del proyecto → Aplicaciones web.

### 3. API key de Gemini

```bash
# Obtener key gratuita en aistudio.google.com
firebase functions:secrets:set GEMINI_API_KEY
```

### 4. Habilitar Email/Password en Firebase Auth

Firebase Console → Authentication → Sign-in method → Email/Password → Habilitar.

### 5. Desplegar reglas e índices

```bash
firebase deploy --only firestore
```

### 6. Desplegar Cloud Functions

```bash
firebase deploy --only functions
```

### 7. Desarrollo local

```bash
npm run dev
```

### 8. Build y deploy del frontend

```bash
npm run build
firebase deploy --only hosting
```

## Estructura del proyecto

```
├── src/
│   ├── types/index.ts          # interfaces TypeScript del dominio
│   ├── lib/
│   │   ├── firebase.ts         # inicialización Firebase
│   │   └── auth.ts             # iniciarSesion, registrar, cerrarSesion
│   ├── stores/
│   │   ├── authStore.ts        # usuario, nombre, rol, cargando
│   │   └── laboratorioStore.ts # laboratorio activo
│   ├── hooks/
│   │   ├── useAuth.ts          # listener onAuthStateChanged (init en App)
│   │   ├── useLaboratorio.ts   # carga lab desde store o Firestore
│   │   ├── useEvaluacion.ts    # llama a Cloud Function evaluarPastilla
│   │   └── useGenerarProposiciones.ts
│   ├── components/
│   │   ├── FeedbackPanel.tsx   # muestra veredicto + argumento formal
│   │   ├── PastillaCard.tsx
│   │   └── CrearLaboratorioForm.tsx
│   └── pages/
│       ├── AuthPage.tsx        # login / registro
│       ├── HomePage.tsx        # lista labs (profesor) o instrucción (alumno)
│       └── LaboratorioPage.tsx
├── functions/src/
│   ├── index.ts                # Cloud Functions exportadas
│   └── lib/
│       ├── gemini.ts           # llamada a Gemini + prompt + validación schema
│       ├── doctrina.ts         # doctrina epistemológica por pastilla
│       └── cuota.ts            # control de cuota alumno y global
├── firestore.rules             # reglas de seguridad con control de roles
├── firestore.indexes.json      # índices compuestos
├── firebase.json               # config deploy (hosting, functions, firestore)
├── .env.example                # plantilla de variables de entorno
└── docs/                       # arquitectura, doctrina epistemológica, prompts LLM
```

## Pastillas epistemológicas

### Atributo (se predican directamente de la proposición)
- Fáctico, Empírico, Observacional

### Relación (requieren sistema teórico o evidencia de referencia)
- Nomológico-Deductivo, Falsable, Verificable

### Meta (juzgan el acto de análisis, no la proposición)
- Modelos de cientificidad de Wallerstein y Pardo

## Documentación técnica

- `docs/arquitectura.md` — decisiones de diseño
- `docs/doctrina-pastillas.md` — fuentes: Bunge, Klimovsky, Pardo, Wallerstein
- `docs/prompts-llm.md` — prompt de evaluación del LLM
- `CLAUDE.md` — contexto del proyecto para Claude Code
