# Doctrina canónica de las pastillas

Este archivo es la **Capa 1** del prompt de evaluación. Cada sección define operacionalmente una pastilla para ser inyectada en el prompt del LLM. El contenido fue redactado y validado por la cátedra con paráfrasis controladas de los autores.

La calidad pedagógica del sistema depende en primer lugar de la calidad de este documento.

---

## Taxonomía de pastillas

| Tipo | Comportamiento en UI | Ejemplos |
|------|---------------------|---------|
| **Atributo** | Drag & drop directo sobre la proposición | Fáctico, Empírico, Observacional, Teórico |
| **Relación** | Requiere especificar un segundo término (sistema teórico o cuerpo de evidencia) | Nomológico-Deductivo, Falsable, Verificable |
| **Meta** | Va en panel separado; se aplica al acto de analizar, no a la proposición | Positivismo, Hermenéutico, Crítico |

---

## PASTILLAS-ATRIBUTO (Bunge / Klimovsky)

### FÁCTICO

- **Tipo:** Atributo
- **Autor de referencia:** Bunge, Mario. *La ciencia, su método y su filosofía* (1959)
- **Qué captura bien:** La distinción entre proposiciones que refieren a hechos del mundo (fácticas) y proposiciones cuya verdad depende solo de su estructura lógica (formales). Esta es una de las 15 características que Bunge presenta casi como checklist, por lo que la pastilla no traiciona el espíritu del autor.
- **Qué NO captura:** La objetividad no es una propiedad que se predique de una proposición individual, sino de un sistema de prácticas. No confundir factualidad con objetividad.

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Se refiere a enunciados o proposiciones que describen sucesos, procesos u objetos del mundo real y empírico. Para determinar su valor de verdad, no basta con el análisis lógico o lingüístico de sus términos, sino que requiere obligatoriamente una confrontación o contrastación con los hechos de la experiencia.

2. **Criterio de distinción:** Se distingue de lo *formal* en que los enunciados formales son de carácter analítico y su verdad es puramente lógica, coherente con un sistema de axiomas previos y sin referencia directa al mundo sensible.

3. **Ejemplo positivo:** "La temperatura de ebullición del agua destilada disminuye a medida que aumenta la altitud sobre el nivel del mar."

4. **Ejemplo negativo:** "Si un número entero es par y mayor que 2, entonces es el resultado de la suma de dos números primos."

5. **Cita o paráfrasis controlada:** "La ciencia fáctica... recurre a la experiencia para poner a prueba sus fórmulas... Los enunciados fácticos se refieren, en su mayoría, a entes extracientíficos: a sucesos y procesos" (Bunge, Mario, *La ciencia, su método y su filosofía*, p. 10).

6. **Casos límite:** Proposiciones que aluden a entidades fácticas inobservables o altamente teóricas (por ejemplo, "La materia oscura representa aproximadamente el 27% de la densidad de energía del universo"). Aunque refieren a sucesos reales, su extrema dependencia teórica dificulta catalogarla como puramente fáctica sin un sistema teórico que la acompañe. Ante este tipo de proposiciones aisladas de su marco operativo, el LLM debe reportar `INSUFICIENTE_INFORMACION`.

---

### EMPÍRICO

- **Tipo:** Atributo
- **Autor de referencia:** Gianella, Alicia. *Introducción a la epistemología y a la metodología de la ciencia* (1995) / Chalmers, Alan. *¿Qué es esa cosa llamada ciencia?* (1982)
- **Qué captura bien:** La dependencia del conocimiento respecto de la experiencia sensible directa o indirecta como fuente de legitimación y control del conocimiento fáctico. Permite identificar si el valor epistemológico de una proposición descansa, en última instancia, en datos contrastables obtenidos de la observación metódica o el diseño experimental.
- **Qué NO captura:** No captura la pretendida pureza o neutralidad de los hechos. El empirismo clásico solía omitir que todo dato observacional se encuentra inherentemente impregnado o "cargado" de supuestos teóricos previos (como señalan Chalmers y Klimovsky).

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Calidad de un enunciado científico que describe un fenómeno fáctico cuya fundamentación, contrastabilidad o asignación de valor de verdad depende de los datos recopilados a través de la experiencia sensible, la observación sistemática o la experimentación científica controlada.

2. **Criterio de distinción:** Se distingue de lo *teórico puro* (conceptos o enunciados abstractos que no tienen una correspondencia directa o inmediata con objetos perceptibles por los sentidos) y de lo *formal* (enunciados analíticos válidos por su mera estructura sintáctica).

3. **Ejemplo positivo:** "Al sumergir la barra de hierro en el recipiente con agua a 90°C, su longitud aumentó en 0,5 mm."

4. **Ejemplo negativo:** "La suma de los ángulos interiores de cualquier triángulo euclidiano es igual a 180°." (Relación matemática formal, independiente de mediciones empíricas).

5. **Cita o paráfrasis controlada:** "El conocimiento fáctico es empírico porque recurre a la experiencia sensible (la observación y el experimento) como su principal instancia de control y legitimación para determinar la aceptabilidad o el rechazo de sus hipótesis" (Paráfrasis de Gianella, Alicia, *Introducción a la epistemología y a la metodología de la ciencia*).

6. **Casos límite:** Enunciados que describen sucesos empíricos bajo condiciones extremas y teóricas no reproducibles directamente por humanos en la actualidad (ej. "En el núcleo de Júpiter, el hidrógeno se comporta como un metal líquido debido a la presión extrema"). Dado que la experiencia directa está totalmente imposibilitada y depende puramente de simulaciones y deducciones teóricas indirectas, el LLM debe responder con `INSUFICIENTE_INFORMACION`.

---

### OBSERVACIONAL

- **Tipo:** Atributo
- **Autor de referencia:** Klimovsky, Gregorio. *Las desventuras del conocimiento científico* (1994)
- **Qué captura bien:** Los niveles de lenguaje de Klimovsky (observacional, teórico, lógico-matemático) son categorías clasificatorias, y arrastrarlos a una proposición es análogo al ejercicio de análisis lógico que él propone.
- **Qué NO captura:** No captura conceptos o variables científicas que, a pesar de tener consecuencias físicas reales, carecen de cualidades fenoménicas directamente percibidas por el aparato perceptivo ordinario del ser humano (por ejemplo, el campo magnético, la plusvalía o el inconsciente).

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Se refiere al Nivel 1 del lenguaje de la ciencia propuesto por Klimovsky (enunciados de base empírica singular). Está constituido exclusivamente por términos observacionales singulares que nombran objetos, cualidades o relaciones directamente detectables por el aparato sensorial humano (o con instrumentos simples de amplificación no teórica, como lupas o anteojos), en una coordenada espacio-temporal específica.

2. **Criterio de distinción:** Se diferencia de las *generalizaciones empíricas* (Nivel 2, que abarcan clases infinitas de casos y no se limitan a un hecho singular descriptible observacionalmente en su totalidad) y de los *enunciados teóricos* (Nivel 3, que contienen al menos un término abstracto inaccesible a los sentidos).

3. **Ejemplo positivo:** "El papel tornasol colocado en el vaso de precipitados A se volvió de color rojo brillante al entrar en contacto con la sustancia líquida."

4. **Ejemplo negativo:** "Los virus de influenza mutan anualmente debido a la presión de selección de los anticuerpos del huésped." (Tanto "virus de influenza" como "anticuerpos" e "inmunidad" operan como términos teóricos abstractos del Nivel 3).

5. **Cita o paráfrasis controlada:** "Un término u objeto es observacional si se refiere a cosas, propiedades o relaciones que podemos percibir directamente a través de nuestros sentidos, sin la mediación de hipótesis teóricas complejas" (Klimovsky, Gregorio, *Las desventuras del conocimiento científico*, cap. 3).

6. **Casos límite:** Observaciones realizadas a través de instrumental tecnológico avanzado que requiere complejas teorías físicas de calibración (ej. "La imagen en el monitor de barrido electrónico muestra una red cristalina hexagonal"). Como la percepción está fuertemente mediada por la aceptación de una teoría del instrumento, el estatus observacional directo se desdibuja, y el LLM debe optar por `INSUFICIENTE_INFORMACION`.

---

### TEÓRICO

- **Tipo:** Atributo
- **Autor de referencia:** Klimovsky, Gregorio. *Las desventuras del conocimiento científico* (1994)
- **Qué captura bien:** Captura la presencia de conceptos e hipótesis abstractas construidas por la ciencia para explicar el comportamiento de lo observable mediante entidades y procesos que no son accesibles a la percepción directa (ej. campos electromagnéticos, clases sociales, genes). Es el núcleo conceptual explicativo de las disciplinas científicas maduras.
- **Qué NO captura:** No captura la verificación directa o sensible de sus enunciados de manera aislada. Un término teórico no puede "tocarse" o "verse" de forma inmediata; solo se conecta con la base empírica mediante un entramado deductivo y enunciados puente (reglas de correspondencia).

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Se refiere al Nivel 3 del lenguaje científico según la clasificación de Klimovsky. Son aquellos enunciados científicos (ya sean puros o mixtos) que contienen al menos un término teórico, es decir, un concepto abstracto que designa entidades, propiedades o procesos postulados que escapan por completo a la observación sensorial directa pero que explican el comportamiento de la base empírica.

2. **Criterio de distinción:** Se distingue de los *enunciados observacionales singulares* (Nivel 1) y de las *generalizaciones empíricas* (Nivel 2), ya que estas últimas únicamente describen regularidades de objetos observables directamente sin introducir nuevos términos teóricos abstractos.

3. **Ejemplo positivo:** "La atracción gravitatoria entre dos masas es producida por la deformación geométrica del espacio-tiempo en presencia de materia."

4. **Ejemplo negativo:** "Todos los cuervos registrados en la reserva natural del sur poseen plumaje negro." (Generalización empírica de Nivel 2; no introduce vocabulario teórico abstracto).

5. **Cita o paráfrasis controlada:** "El nivel de enunciados teóricos se caracteriza por contener términos teóricos, es decir, aquellos que designan entidades que no son directamente accesibles a la observación... y que exigen una construcción conceptual para ser comprendidos y aplicados" (Klimovsky, *Las desventuras del conocimiento científico*, cap. 3).

6. **Casos límite:** Términos tomados del lenguaje coloquial o común que en disciplinas sociales se usan de forma ambigua y no rigurosa (ej. "la atmósfera familiar hostil"). Sin una clara definición conceptual o reglas de correspondencia metodológica, el LLM debe emitir un veredicto de `INSUFICIENTE_INFORMACION`.

---

## PASTILLAS-RELACIÓN (Klimovsky)

> **Nota de implementación:** Cuando el alumno arrastra una pastilla de este tipo, la UI debe mostrar un modal o segundo slot solicitando: "¿Contra qué sistema teórico o cuerpo de evidencia se evalúa esta relación?" El texto ingresado se agrega al contexto que se envía al LLM.

### NOMOLÓGICO-DEDUCTIVO

- **Tipo:** Relación
- **Autor de referencia:** Klimovsky, Gregorio. *Las desventuras del conocimiento científico* (1994)
- **Advertencia pedagógica:** Este es uno de los conceptos más resistentes a la mecánica de pastilla. El método hipotético-deductivo en Klimovsky **no es clasificatorio, es procesual**: una hipótesis no "es" nomológico-deductiva como atributo fijo; lo es en relación con un sistema de contrastación. Aplicarla como atributo de una proposición aislada cosifica una relación.
- **Qué captura bien:** La identificación de la estructura lógica de la explicación científica cuando se especifica el sistema teórico.

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Es un modelo de explicación científica en el cual el fenómeno a explicar (*explicandum*) se deduce lógicamente de un conjunto de premisas explicativas (*explicans*) constituido por al menos una ley general de carácter universal (nomológica) y un conjunto de condiciones iniciales o hechos particulares. El vínculo entre las premisas y la conclusión es de necesidad lógica deductiva, asegurando que si las premisas son verdaderas, el fenómeno necesariamente debió ocurrir.

2. **Criterio de distinción:** Se distingue de la *explicación estadístico-inductiva* (donde las leyes son probabilísticas y la conclusión solo posee cierto grado de probabilidad, no necesidad lógica) y de las *explicaciones teleológicas* (que explican por propósitos o fines futuros).

3. **Ejemplo positivo:**
   - *Leyes generales (Explicans):* Todos los metales se dilatan con el calor.
   - *Condiciones iniciales (Explicans):* La barra de cobre X es un metal y fue expuesta al calor de un mechero.
   - *Fenómeno explicado (Explicandum):* La barra de cobre X se dilató.

4. **Ejemplo negativo:** "La fiebre disminuyó porque el paciente tomó una dosis de paracetamol, lo cual suele aliviar los síntomas en un 85% de los casos." (Explicación estadístico-inductiva, no deductivo-necesaria).

5. **Cita o paráfrasis controlada:** "En la explicación nomológico-deductiva, el hecho en cuestión se deduce de leyes generales y condiciones iniciales. El explicandum es una consecuencia lógica necesaria del explicans" (Klimovsky, *Las desventuras del conocimiento científico*, cap. 15).

6. **Casos límite:** Explicaciones históricas o sociológicas que formulan "leyes generales" de escaso rigor universal (ej. "Las revoluciones ocurren siempre que hay una privación económica extrema"). Al ser generalizaciones con múltiples excepciones, el esquema deductivo falla; en tales casos, si se fuerza este modelo sin leyes estrictamente universales, el sistema debe responder `INSUFICIENTE_INFORMACION` o señalar la debilidad de la premisa nomológica.

---

### FALSABLE

- **Tipo:** Relación
- **Autor de referencia:** Popper, Karl. *La lógica de la investigación científica* (1934) via Klimovsky, Gregorio. *Las desventuras del conocimiento científico* (1994)
- **Advertencia pedagógica:** La falsabilidad es una relación entre una hipótesis y un conjunto de enunciados básicos posibles, no una propiedad intrínseca de la proposición.

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Criterio metodológico de demarcación científica según el cual una hipótesis o teoría científica es falsable si es posible deducir lógicamente a partir de ella un conjunto no vacío de enunciados observacionales (falsadores potenciales) lógicamente posibles que, en caso de corroborarse empíricamente en la realidad, refutarían de modo definitivo la verdad de la hipótesis inicial.

2. **Criterio de distinción:** Se diferencia de lo *verificable* (que busca probar de forma absoluta la verdad de un enunciado universal, lo cual es imposible según la asimetría de la contrastación) y de lo *no falsable / metafísico* (enunciados blindados de tal manera que cualquier acontecimiento imaginable del mundo puede encajar en ellos sin contradecirlos).

3. **Ejemplo positivo:** "Todos los mamíferos terrestres tienen un sistema circulatorio cerrado." (Es falsable: el hallazgo de un solo mamífero terrestre con sistema circulatorio abierto refutaría de inmediato la ley).

4. **Ejemplo negativo:** "Las conductas obsesivas de los pacientes se deben a conflictos inconscientes reprimidos o a una compensación psicológica de carácter consciente." (Al admitir explicaciones contradictorias, ningún comportamiento real de los pacientes podría contradecir o refutar este postulado).

5. **Cita o paráfrasis controlada:** "No exigiré que un sistema científico pueda ser seleccionado de una vez para siempre en un sentido positivo; pero sí que su forma lógica sea tal que pueda ser resaltado, mediante pruebas empíricas, en un sentido negativo: tiene que ser posible refutar por la experiencia un sistema científico empírico" (Paráfrasis de Popper, Karl, *La lógica de la investigación científica*, cap. 1).

6. **Casos límite:** Enunciados de probabilidad estadística (ej. "El tratamiento Y tiene un índice de efectividad del 99%"). Al ser probabilístico, un caso individual fallido no refuta de manera concluyente la hipótesis. Ante enunciados probabilísticos puros sin marcos estadísticos de muestreo acotados, el LLM debe emitir `INSUFICIENTE_INFORMACION`.

---

### VERIFICABLE

- **Tipo:** Relación
- **Autor de referencia:** Carnap, Rudolf. *Testabilidad y significado* (1936) via Klimovsky, Gregorio. *Las desventuras del conocimiento científico* (1994)
- **Advertencia pedagógica:** Similar a Falsable: la verificabilidad es relacional, depende del estado de la tecnología de observación y del sistema teórico.

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Propiedad epistemológica por la cual un enunciado fáctico posee condiciones empíricas y metodológicas que permiten establecer de manera absoluta, concluyente y definitiva su verdad a través de un número finito de observaciones directas en el campo de la experiencia.

2. **Criterio de distinción:** Se distingue de la *confirmabilidad* (propuesta por Carnap como alternativa para leyes de alcance universal, las cuales nunca son totalmente verificables sino únicamente confirmables mediante acumulación de evidencia probabilística) y de la *falsabilidad popperiana* (criterio negativo de refutación).

3. **Ejemplo positivo:** "El microscopio número 3 del laboratorio de biología tiene colocado un objetivo de inmersión de 100x." (Es verificable concluyentemente mediante una sola inspección visual directa).

4. **Ejemplo negativo:** "Todo cuerpo en el universo mantiene su estado de reposo o movimiento rectilíneo uniforme a menos que actúe sobre él una fuerza neta." (Es de alcance universal e infinito, por ende, es inverificable de forma definitiva y exhaustiva).

5. **Cita o paráfrasis controlada:** "Si por verificación entendemos una demostración definitiva de verdad, ningún enunciado general o ley científica es estrictamente verificable, solo podemos aspirar a confirmar gradualmente nuestras hipótesis a medida que los datos empíricos les otorguen soporte" (Paráfrasis de Carnap, Rudolf, *Testabilidad y significado*, 1936).

6. **Casos límite:** Proposiciones acerca de hechos pasados singulares históricos no repetibles (ej. "La asamblea del cabildo del 25 de mayo de 1810 se inició exactamente a las nueve de la mañana"). Al no poder someterse a verificación empírica presencial en el presente por el observador científico, el LLM debe reportar `INSUFICIENTE_INFORMACION` si no se dispone del análisis documental historiográfico de correspondencia.

---

## PASTILLAS-META (Pardo / Wallerstein)

> **Nota de implementación:** Estas pastillas van en un panel separado en la UI, con el encabezado: "¿Desde qué modelo de cientificidad estás analizando esta proposición?" No se aplican sobre la proposición sino sobre el acto de analizarla. Esto reintroduce la reflexividad que Wallerstein exige.

### POSITIVISMO

- **Tipo:** Meta
- **Autor de referencia:** Pardo, Rubén. En: Gómez, R. (comp.) *La ciencia, método y filosofía*; Wallerstein, Immanuel. *Las incertidumbres del saber* (2004)
- **Qué captura bien:** La identificación de modelos de cientificidad en Pardo es taxonómica y se beneficia de una representación visual.
- **Qué NO captura:** Wallerstein es el autor más resistente a esta mecánica. Su tesis en *Las incertidumbres del saber* y en *Abrir las ciencias sociales* es que la ciencia es un producto histórico-estructural de la modernidad capitalista, no un conjunto de criterios atemporales aplicables. Usarlo como pastilla-meta, aplicada al acto de analizar y no a la proposición, mitiga (pero no elimina) este riesgo.

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Modelo o concepción de cientificidad que surge en la modernidad y se consolida en el siglo XIX, el cual sostiene que el único conocimiento válido es el conocimiento científico, caracterizado por el apego estricto a los hechos observables, la neutralidad valorativa del investigador, la búsqueda de leyes causales de carácter universal y la unificación del método científico (monismo metodológico) bajo el patrón de las ciencias físico-naturales.

2. **Criterio de distinción:** Se distingue del *modelo hermenéutico o comprensivista* (que rechaza el monismo metodológico y prioriza la comprensión del sentido y la especificidad histórica de los fenómenos humanos) y del *modelo crítico* (que descarta la neutralidad valorativa y concibe a la ciencia como praxis de emancipación social).

3. **Ejemplo positivo:** El análisis sociológico durkheimiano del suicidio como un hecho social cuantificable, buscando correlaciones estadísticas para establecer leyes causales independientes de la conciencia individual del investigador.

4. **Ejemplo negativo:** Un estudio hermenéutico sobre las representaciones subjetivas del duelo y la pérdida de identidad cultural en inmigrantes de segunda generación a través de relatos de vida autorreflexivos.

5. **Cita o paráfrasis controlada:** "El positivismo asume la existencia de un método científico único, aplicable a todo objeto de estudio, caracterizado por la objetividad, la cuantificación de las variables y el rechazo de toda especulación metafísica" (Paráfrasis de Pardo, "El desafío de las ciencias sociales", en Gómez).

6. **Casos límite:** Ciencias sociales que utilizan instrumental formal avanzado o modelos matemáticos abstractos (como la teoría de juegos en economía) pero que no pretenden necesariamente capturar "hechos fácticos puros e históricos" sino modelar conductas ideales. Aunque parezcan herederas del rigor positivista, su alejamiento de la base observacional directa las ubica en una zona gris que requiere declarar `INSUFICIENTE_INFORMACION` a menos que se defina la naturaleza empírica de su contrastación.

---

### HERMENÉUTICO

- **Tipo:** Meta
- **Autor de referencia:** Pardo, Rubén. En: Gómez, R. (comp.) *La ciencia, método y filosofía* (2000)

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Modelo epistemológico (con base en Dilthey, Weber y Gadamer) que sostiene que el objeto de las ciencias sociales y del espíritu es radicalmente diferente al de las ciencias naturales: el universo simbólico y el sentido de las acciones humanas. Su propósito metodológico no consiste en la "explicación causal" mediante leyes generales ciegas, sino en la "comprensión" e "interpretación" (*Verstehen*) del sentido subjetivo e histórico que los actores otorgan a sus prácticas, discursos y textos.

2. **Criterio de distinción:** Se diferencia claramente del *positivismo* (al impugnar el monismo metodológico y la neutralidad valorativa absoluta del investigador, asumiendo la ineludible pertenencia del analista al círculo hermenéutico del lenguaje) y del *modelo crítico* (el cual, si bien rechaza el positivismo, se enfoca en desarticular las relaciones estructurales de poder y dominación, y no meramente en comprender interpretativamente el sentido histórico heredado).

3. **Ejemplo positivo:** Una etnografía que estudia las pautas de interacción, el significado del espacio común y las expresiones socioculturales de un grupo de jóvenes en un asentamiento urbano a través de entrevistas en profundidad y observación participante.

4. **Ejemplo negativo:** Una investigación econométrica macroeconómica que busca predecir de forma matemática la fluctuación del tipo de cambio financiero basándose en la tasa de interés interbancaria global.

5. **Cita o paráfrasis controlada:** "Las ciencias sociales no pueden explicarse por leyes universales causales. Su objeto prioritario es la comprensión y la interpretación del sentido de las acciones humanas, concibiendo el lenguaje y la historicidad como la ontología misma de nuestra experiencia en el mundo" (Paráfrasis de Pardo, Rubén, "El desafío de las ciencias sociales", en Gómez).

6. **Casos límite:** Estudios mixtos cuali-cuantitativos en sociología que cruzan tabulados estadísticos y censales de población con inferencias interpretativas psico-sociales de carácter libre. Si la matriz metodológica de base no está claramente subordinada a una u otra tradición científica, el LLM debe reportar `INSUFICIENTE_INFORMACION`.

---

### CRÍTICO

- **Tipo:** Meta
- **Autor de referencia:** Pardo, Rubén; Wallerstein, Immanuel. *Las incertidumbres del saber* (2004)

**Doctrina canónica para inyectar al LLM:**

1. **Definición operacional:** Modelo epistemológico (asociado a la Escuela de Frankfurt y a las lecturas críticas del marxismo) que sostiene que la ciencia nunca es una actividad neutral, aséptica ni desinteresada, sino una práctica social ligada a intereses sociopolíticos. Su objetivo fundamental es el desenmascaramiento y deconstrucción de las relaciones asimétricas de poder, la ideología opresora y la dominación estructural invisibilizada, orientando la producción de conocimiento directamente hacia la praxis política transformadora y la emancipación colectiva de los sectores vulnerables o alienados.

2. **Criterio de distinción:** Se distingue del *positivismo* (al impugnar frontalmente la pretensión de neutralidad valorativa y la separación sujeto/objeto) y de la *hermenéutica comprensivista pura* (al rechazar una mera actitud contemplativa del sentido heredado; el modelo crítico exige transformar las condiciones de injusticia estructural reveladas por el análisis).

3. **Ejemplo positivo:** Una investigación de acción participativa en cooperativas de trabajo autogestionadas para sistematizar sus prácticas de economía popular y brindarles herramientas técnicas que fortalezcan su autonomía frente a la precarización laboral del mercado de plataformas.

4. **Ejemplo negativo:** Un análisis de mercado convencional encargado por un holding empresarial privado para optimizar su logística de distribución y maximizar su tasa de ganancia anual.

5. **Cita o paráfrasis controlada:** "El conocimiento de la realidad social no es meramente teórico, sino de carácter crítico y emancipador. La teoría científica debe romper el statu quo desnaturalizando lo dado y articulando la investigación con la transformación emancipadora de las condiciones de dominación" (Paráfrasis de Pardo, Rubén, "El desafío de las ciencias sociales", en articulación con Wallerstein, Immanuel, *Las incertidumbres del saber*).

6. **Casos límite:** Ensayos filosófico-políticos de carácter puramente reflexivo y especulativo sobre las nociones abstractas de poder, que carecen de cualquier correlato empírico, diseño de campo o metodología fáctica de intervención social clara. Al no constituirse como una práctica empírica reglamentada de las ciencias fácticas, el LLM debe emitir `INSUFICIENTE_INFORMACION`.
