import type { Laboratorio, Pastilla, Proposicion, RespuestaLlm } from '../types'

// Proposiciones de ejemplo con contexto de ciencias sociales argentinas
export const PROPOSICIONES_MOCK: Proposicion[] = [
  {
    id: 'prop-1',
    texto:
      'La tasa de desempleo en el Gran Buenos Aires alcanzó el 8,9% durante el segundo trimestre de 2023.',
    fuenteContexto:
      'Informe de la Encuesta Permanente de Hogares (EPH) del INDEC, publicado en septiembre de 2023. El indicador mide la proporción de la población económicamente activa que no tiene empleo y busca activamente trabajo en los 31 aglomerados urbanos relevados.',
    fuenteUrl: 'https://www.indec.gob.ar',
  },
  {
    id: 'prop-2',
    texto:
      'El incremento sostenido de la desigualdad económica erosiona la legitimidad de las instituciones representativas, debilitando la participación electoral en sectores de menores ingresos.',
    fuenteContexto:
      'Hipótesis extraída de un artículo académico sobre democracia y desigualdad en América Latina, publicado en la Revista Latinoamericana de Ciencia Política (2022). El argumento se basa en datos comparados de 18 países de la región entre 1990 y 2020.',
  },
  {
    id: 'prop-3',
    texto:
      'El Senado de la Nación aprobó la Ley de Financiamiento Universitario por 57 votos a favor y 10 en contra, en sesión celebrada el 14 de agosto de 2024.',
    fuenteContexto:
      'Crónica parlamentaria publicada por el servicio de información del Senado de la Nación Argentina. La sesión comenzó a las 14:00 h y concluyó a las 22:45 h, con quórum de 67 senadores presentes sobre 72 posibles.',
  },
]

// Set completo de pastillas con tipos y colores diferenciados
export const PASTILLAS_MOCK: Pastilla[] = [
  // — ATRIBUTO —
  {
    id: 'factico',
    nombre: 'Fáctico',
    tipo: 'atributo',
    autorReferencia: 'Bunge (1959)',
    descripcionBreve: 'Refiere a hechos del mundo empírico',
    colorBase: 'sky',
  },
  {
    id: 'empirico',
    nombre: 'Empírico',
    tipo: 'atributo',
    autorReferencia: 'Gianella / Chalmers',
    descripcionBreve: 'Fundamentado en datos de la experiencia sensible',
    colorBase: 'blue',
  },
  {
    id: 'observacional',
    nombre: 'Observacional',
    tipo: 'atributo',
    autorReferencia: 'Klimovsky (1994)',
    descripcionBreve: 'Nivel 1 de lenguaje: perceptible sin mediación teórica',
    colorBase: 'cyan',
  },
  {
    id: 'teorico',
    nombre: 'Teórico',
    tipo: 'atributo',
    autorReferencia: 'Klimovsky (1994)',
    descripcionBreve: 'Nivel 3: contiene términos abstractos inaccesibles a los sentidos',
    colorBase: 'indigo',
  },
  // — RELACIÓN —
  {
    id: 'nomologico-deductivo',
    nombre: 'Nomológico-Deductivo',
    tipo: 'relacion',
    autorReferencia: 'Klimovsky (1994)',
    descripcionBreve: 'El explicandum se deduce de leyes generales + condiciones iniciales',
    colorBase: 'amber',
  },
  {
    id: 'falsable',
    nombre: 'Falsable',
    tipo: 'relacion',
    autorReferencia: 'Popper / Klimovsky',
    descripcionBreve: 'Existen enunciados que podrían refutarla empíricamente',
    colorBase: 'orange',
  },
  {
    id: 'verificable',
    nombre: 'Verificable',
    tipo: 'relacion',
    autorReferencia: 'Carnap / Klimovsky',
    descripcionBreve: 'Su verdad puede establecerse de forma concluyente por observación',
    colorBase: 'yellow',
  },
  // — META —
  {
    id: 'positivismo',
    nombre: 'Positivismo',
    tipo: 'meta',
    autorReferencia: 'Pardo / Wallerstein',
    descripcionBreve: 'Monismo metodológico, neutralidad valorativa, leyes causales universales',
    colorBase: 'violet',
  },
  {
    id: 'hermeneutico',
    nombre: 'Hermenéutico',
    tipo: 'meta',
    autorReferencia: 'Pardo (Dilthey / Gadamer)',
    descripcionBreve: 'Comprensión del sentido histórico de las acciones humanas',
    colorBase: 'purple',
  },
  {
    id: 'critico',
    nombre: 'Crítico',
    tipo: 'meta',
    autorReferencia: 'Pardo / Wallerstein',
    descripcionBreve: 'Ciencia como praxis emancipadora; denuncia relaciones de poder',
    colorBase: 'fuchsia',
  },
]

// Laboratorio de ejemplo pre-cargado para el home
export const LABORATORIO_MOCK: Laboratorio = {
  id: 'lab-demo-001',
  titulo: 'Análisis de proposiciones — TP N° 1',
  descripcion: 'Práctica de clasificación epistemológica sobre textos de actualidad',
  ownerId: 'usuario-demo',
  proposiciones: PROPOSICIONES_MOCK,
  evaluaciones: [],
  creadoEn: new Date('2026-05-10'),
  actualizadoEn: new Date('2026-05-17'),
  compartible: true,
}

// Respuesta mock del LLM para mostrar en iter 2 sin llamada real
export const RESPUESTA_MOCK: RespuestaLlm = {
  razonamiento:
    'La proposición describe un hecho del mundo social medible y cuantificable. Su valor de verdad depende de la confrontación con los datos de la encuesta, no de su estructura lógica interna. No contiene términos teóricos abstractos que trasciendan lo observable.',
  elementosRelevantes: [
    'Porcentaje concreto y medible (8,9%)',
    'Referencia a un período temporal específico',
    'Fuente institucional de datos empíricos (EPH-INDEC)',
  ],
  veredicto: 'PERTINENTE',
  justificacionDoctrinal:
    'Según Bunge (1959), una proposición es fáctica cuando refiere a hechos del mundo y su verdad depende de la confrontación con datos empíricos. Esta proposición cumple ambos criterios: nombra un hecho social (tasa de desempleo) y remite a datos medibles.',
  sugerenciaPedagogica:
    'Considerá también aplicar la pastilla EMPÍRICO para profundizar en el rol de la EPH como instrumento de observación metódica. ¿Qué supuestos teóricos están implícitos en la definición operacional de "desempleo" que usa el INDEC?',
}
