// Doctrina canónica por pastilla — Capa 1 del prompt de evaluación.
// Fuente: docs/doctrina-pastillas.md (validado por la cátedra).

export const DOCTRINA: Record<string, string> = {
  factico: `
Definición operacional: Proposiciones que describen sucesos, procesos u objetos del mundo real y empírico. Su valor de verdad requiere obligatoriamente confrontación con hechos de la experiencia, no basta el análisis lógico o lingüístico.
Criterio de distinción: Se distingue de lo FORMAL en que los enunciados formales son analíticos y su verdad es puramente lógica (matemática, lógica), sin referencia al mundo sensible.
Cita: "La ciencia fáctica recurre a la experiencia para poner a prueba sus fórmulas. Los enunciados fácticos se refieren, en su mayoría, a entes extracientíficos: a sucesos y procesos" (Bunge, La ciencia su método y su filosofía, p. 10).
Caso INSUFICIENTE_INFORMACION: Proposiciones sobre entidades fácticas altamente teóricas e inobservables sin sistema teórico que las contextualice (ej. materia oscura sin marco operativo).
`.trim(),

  empirico: `
Definición operacional: Calidad de un enunciado cuya fundamentación, contrastabilidad o valor de verdad depende de datos recopilados a través de la experiencia sensible, la observación sistemática o la experimentación científica controlada.
Criterio de distinción: Se distingue de lo TEÓRICO PURO (abstracto, sin correspondencia perceptible directa) y de lo FORMAL (analítico, válido por estructura sintáctica).
Cita: "El conocimiento fáctico es empírico porque recurre a la experiencia sensible como principal instancia de control y legitimación para determinar la aceptabilidad de sus hipótesis" (Paráfrasis de Gianella, Introducción a la epistemología y metodología de la ciencia).
Caso INSUFICIENTE_INFORMACION: Proposiciones sobre sucesos empíricos bajo condiciones no reproducibles y que dependen puramente de simulaciones o deducciones teóricas indirectas.
`.trim(),

  observacional: `
Definición operacional: Nivel 1 del lenguaje científico (Klimovsky). Enunciados constituidos exclusivamente por términos observacionales singulares: nombran objetos, cualidades o relaciones directamente detectables por el aparato sensorial humano (o con instrumentos simples no teóricos como lupas), en una coordenada espacio-temporal específica.
Criterio de distinción: Se diferencia de las generalizaciones empíricas (Nivel 2, clases infinitas de casos) y de los enunciados teóricos (Nivel 3, contienen al menos un término abstracto inaccesible a los sentidos).
Cita: "Un término es observacional si se refiere a cosas, propiedades o relaciones que podemos percibir directamente a través de nuestros sentidos, sin la mediación de hipótesis teóricas complejas" (Klimovsky, Las desventuras del conocimiento científico, cap. 3).
Caso INSUFICIENTE_INFORMACION: Observaciones mediadas por instrumental tecnológico que requiere teorías físicas de calibración (ej. microscopio electrónico), donde el estatus observacional directo se desdibuja.
`.trim(),

  teorico: `
Definición operacional: Nivel 3 del lenguaje científico (Klimovsky). Enunciados que contienen al menos un término teórico: concepto abstracto que designa entidades, propiedades o procesos postulados que escapan a la observación sensorial directa, pero que explican el comportamiento de la base empírica.
Criterio de distinción: Se distingue de los enunciados observacionales singulares (Nivel 1) y de las generalizaciones empíricas (Nivel 2), que solo describen regularidades de objetos observables sin introducir vocabulario teórico abstracto.
Cita: "El nivel teórico se caracteriza por contener términos que designan entidades no directamente accesibles a la observación y que exigen una construcción conceptual para ser comprendidos" (Klimovsky, Las desventuras del conocimiento científico, cap. 3).
Caso INSUFICIENTE_INFORMACION: Términos del lenguaje coloquial usados de forma ambigua en disciplinas sociales sin definición conceptual clara ni reglas de correspondencia metodológica.
`.trim(),

  'nomologico-deductivo': `
Definición operacional: Modelo de explicación científica en el cual el fenómeno a explicar (explicandum) se deduce lógicamente de un conjunto de premisas (explicans) constituido por al menos una ley general universal (nomológica) y condiciones iniciales o hechos particulares. El vínculo es de necesidad lógica deductiva: si las premisas son verdaderas, el fenómeno necesariamente debió ocurrir.
Criterio de distinción: Se distingue de la explicación estadístico-inductiva (leyes probabilísticas, conclusión solo probable) y de las explicaciones teleológicas (explican por fines futuros). ATENCIÓN: es una relación procesual, no un atributo fijo de la proposición aislada. Requiere identificar el sistema teórico contra el que se evalúa.
Cita: "En la explicación nomológico-deductiva, el hecho se deduce de leyes generales y condiciones iniciales. El explicandum es consecuencia lógica necesaria del explicans" (Klimovsky, Las desventuras del conocimiento científico, cap. 15).
Caso INSUFICIENTE_INFORMACION: Explicaciones con "leyes generales" de escaso rigor universal o con múltiples excepciones; el esquema deductivo falla sin leyes estrictamente universales.
`.trim(),

  falsable: `
Definición operacional: Criterio de demarcación científica (Popper). Una hipótesis o teoría es falsable si es posible deducir lógicamente de ella un conjunto no vacío de enunciados observacionales (falsadores potenciales) que, de corroborarse empíricamente, refutarían de modo definitivo la hipótesis. Es una RELACIÓN entre hipótesis y enunciados básicos posibles, no una propiedad intrínseca.
Criterio de distinción: Se diferencia de lo VERIFICABLE (busca probar la verdad absoluta, imposible para universales) y de lo NO FALSABLE/METAFÍSICO (ningún acontecimiento posible puede contradecirlo, está blindado contra refutación).
Cita: "Tiene que ser posible refutar por la experiencia un sistema científico empírico" (Paráfrasis de Popper, La lógica de la investigación científica, cap. 1).
Caso INSUFICIENTE_INFORMACION: Enunciados de probabilidad estadística pura sin marcos de muestreo acotados, donde un caso fallido no refuta conclusivamente.
`.trim(),

  verificable: `
Definición operacional: Propiedad epistemológica por la cual un enunciado fáctico posee condiciones empíricas que permiten establecer de manera absoluta, concluyente y definitiva su verdad, a través de un número finito de observaciones directas. Es una RELACIÓN con el estado de la tecnología de observación disponible.
Criterio de distinción: Se distingue de la CONFIRMABILIDAD (Carnap: alternativa para leyes universales, nunca totalmente verificables sino gradualmente confirmables) y de la FALSABILIDAD (criterio negativo de refutación, no de verificación positiva).
Cita: "Ningún enunciado general o ley científica es estrictamente verificable; solo podemos aspirar a confirmar gradualmente nuestras hipótesis" (Paráfrasis de Carnap, Testabilidad y significado, 1936).
Caso INSUFICIENTE_INFORMACION: Hechos pasados singulares no repetibles sin análisis documental disponible; proposiciones de alcance universal e infinito.
`.trim(),

  positivismo: `
Definición operacional: Modelo de cientificidad que sostiene que el único conocimiento válido es el científico, caracterizado por: (1) apego estricto a hechos observables, (2) neutralidad valorativa del investigador, (3) búsqueda de leyes causales universales, (4) monismo metodológico bajo el patrón de las ciencias físico-naturales.
Criterio de distinción: Se distingue del HERMENÉUTICO (rechaza el monismo metodológico, prioriza la comprensión del sentido) y del CRÍTICO (descarta la neutralidad valorativa, concibe la ciencia como praxis emancipadora). ATENCIÓN: como pastilla-meta no se aplica a la proposición sino al acto de analizarla.
Cita: "El positivismo asume un método científico único, caracterizado por la objetividad, la cuantificación y el rechazo de toda especulación metafísica" (Paráfrasis de Pardo, El desafío de las ciencias sociales, en Gómez comp.).
Caso INSUFICIENTE_INFORMACION: Ciencias sociales con modelos matemáticos abstractos que no pretenden capturar hechos fácticos directos, ubicadas en zona gris entre positivismo y formalismo.
`.trim(),

  hermeneutico: `
Definición operacional: Modelo epistemológico (Dilthey, Weber, Gadamer vía Pardo) que sostiene que el objeto de las ciencias sociales es radicalmente diferente al de las naturales: el universo simbólico y el sentido de las acciones humanas. Su propósito no es la "explicación causal" por leyes generales, sino la "comprensión" e "interpretación" (Verstehen) del sentido subjetivo e histórico que los actores otorgan a sus prácticas.
Criterio de distinción: Se diferencia del POSITIVISMO (impugna el monismo metodológico y la neutralidad absoluta) y del CRÍTICO (que no se limita a comprender el sentido heredado sino que exige transformar las condiciones de injusticia estructural). Como pastilla-meta, se aplica al acto de analizar, no a la proposición.
Cita: "Las ciencias sociales no pueden explicarse por leyes causales universales. Su objeto prioritario es la comprensión del sentido de las acciones humanas" (Paráfrasis de Pardo, El desafío de las ciencias sociales).
Caso INSUFICIENTE_INFORMACION: Estudios mixtos cuali-cuantitativos donde la matriz metodológica de base no está claramente subordinada a una tradición.
`.trim(),

  critico: `
Definición operacional: Modelo epistemológico (Escuela de Frankfurt, marxismo crítico vía Pardo/Wallerstein) que sostiene que la ciencia nunca es neutral: es una práctica social ligada a intereses sociopolíticos. Su objetivo es el desenmascaramiento de relaciones asimétricas de poder, ideología opresora y dominación estructural, orientando la producción de conocimiento hacia la praxis política transformadora y la emancipación colectiva.
Criterio de distinción: Se distingue del POSITIVISMO (impugna frontalmente la pretensión de neutralidad y la separación sujeto/objeto) y de la HERMENÉUTICA PURA (rechaza la actitud meramente contemplativa del sentido heredado; exige transformar las condiciones de injusticia reveladas). Como pastilla-meta, se aplica al acto de analizar, no a la proposición.
Cita: "El conocimiento de la realidad social no es meramente teórico, sino crítico y emancipador. La teoría científica debe romper el statu quo articulando la investigación con la transformación emancipadora" (Paráfrasis de Pardo/Wallerstein, Las incertidumbres del saber).
Caso INSUFICIENTE_INFORMACION: Ensayos filosófico-políticos puramente especulativos sin correlato empírico ni metodología fáctica de intervención social.
`.trim(),
}
