# Thumbnail Engine de Zero Understands

No es una plantilla: es un motor que, a partir del título (o solo del tema), decide la composición, la emoción de ZERO, la metáfora visual y el texto, y aun así todo parece el mismo canal. Genera **6 miniaturas por vídeo** (3 conceptos × con y sin texto, 1280×720), las puntúa, rediseña las que no llegan al mínimo y elige una **principal** y una **alternativa** claramente distinta.

```bash
node tools/thumbs.mjs "Why Airlines Overbook Flights"          # solo el título
node tools/thumbs.mjs content/thumbs/v001-package.json          # con variables fijadas
node tools/thumbs.mjs --plan "Why Airlines Overbook Flights"   # solo enseña las decisiones, sin dibujar
```

Salida en `out/thumbs/<título>/` (o la carpeta indicada): `A1.jpg` `A2.jpg` `B1.jpg` `B2.jpg` `C1.jpg` `C2.jpg` (1 = con texto, 2 = sin texto), `thumb.jpg` (principal), `alt.jpg` (alternativa), `A.jpg` `B.jpg` `C.jpg` (la mejor versión de cada concepto, para la prueba de miniaturas de YouTube), `sheet.jpg` (revisión: tamaño completo, tamaño móvil 160×90, puntuación y simulación del feed) y `plan.json` (decisiones, puntuaciones y controles).

Sin ordenador: **Actions → Thumbnails → Run workflow** con el título, o subir un `content/thumbs/<vídeo>.json`. Las miniaturas se guardan en `previews/thumbs/<nombre>/`.

## 0. La firma del canal: ZERO SEES WHAT WE DON'T

El mundo de fuera es sencillo. ZERO pregunta "But... how?". PIX aparece. Se abre la pared y detrás está el enorme mecanismo interno del mundo: banco → sistema financiero, móvil → internet, tarjeta → pagos, supermercado → la trastienda, paquete → el almacén nocturno. Es lo que separa al canal de "vídeos explicativos con un stickman", y es lo que más se protege.

- **Zero = curiosidad. PIX = revela el mundo oculto.**
- La escena en corte (`cutaway`, pared abierta tipo casa de muñecas) es el elemento visual recurrente. Hoy tiene cuatro interiores: `logistics` (almacén, vídeo 001), `money` (tuberías que llevan el dinero a todas partes menos a la cámara acorazada), `tech` (filas de servidores, cables de luz, un ojo gigante al fondo) y `retail` (la trastienda: estanterías, la máquina de precios, un mapa que sigue a cada cliente). Un sistema nuevo = un interior nuevo en `heroes.js`.
- **Escenas imposibles** permitidas: la miniatura no tiene que respetar la realidad si así se entiende mejor el concepto (un banco abierto como una casa de muñecas, una tarjeta gigante que se traga monedas).
- **Objeto gigante** cuando convenga: exagerar la escala del objeto frente a ZERO (montaña de paquetes, carguero inmenso, contrato más alto que un edificio).

## 1. La identidad que se hereda (no se inventa nada para las miniaturas)

| Elemento | De dónde sale | Regla en miniatura |
|---|---|---|
| **ZERO** | `src/puppets.js` (geometría de la Biblia) | Exactamente el mismo dibujo que en los vídeos, solo con las 12 poses maestras (§3b). Nunca más detalle. La muesca de la cabeza siempre arriba a la izquierda: cuando ZERO mira a la izquierda se reflejan sus brazos y piernas, nunca su cabeza. |
| **Contorno** | Biblia + `docs/mundo-vivo.md` | ZERO es lo único con contorno negro; lleva el borde crema suave (`zrim`) y sombra de contacto. El mundo son formas tonales planas sin contorno. |
| **PIX** | `pix()` de `src/puppets.js` | Solo con una función fija (§3b), en aproximadamente un tercio de las miniaturas. Nunca tapa el texto. |
| **Tipografía** | Fredoka Bold | Mayúsculas, blanco + una línea destacada en color, trazo negro grueso y sombra dura. Ninguna otra fuente. |
| **Color** | código de color del canal (§4) | Solo como acento: ilumina lo importante, nunca pinta toda la miniatura. Fondos oscuros de noche. Amarillo = curiosidad (texto A y C, el objeto que seguimos), coral = consecuencia (texto B). |

## 2. Filosofía

**1 ZERO + 1 ACCIÓN + 1 GRAN OBJETO + 1 MISTERIO + 2-5 palabras como máximo.** El mundo del vídeo puede ser rico; la miniatura tiene que ser simple. La complejidad del entorno crea ambiente, pero solo esos elementos piden atención consciente.

- **Micro-historia:** algo le acaba de pasar, le está pasando o le va a pasar a ZERO. Nunca 🧍 + 🏦; mejor 🧍 → 💰 → 🏦 → 😳. Solo hay que provocar "¿pero qué acaba de pasar?".
- **One mystery:** cada miniatura tiene UNA pregunta visual sin resolver (en `plan.json`, `mystery`). Zero mete 100 y salen menos: ¿dónde está el resto? Dos pasajeros para un asiento: ¿cómo?
- **ZERO mira hacia lo importante:** ojos, cabeza y cuerpo llevan al espectador hacia el concepto principal (ZERO → mira → objeto → texto). El motor gira a ZERO solo hacia el foco de la historia y lo comprueba.
- **TITLE + THUMBNAIL = ONE HOOK:** se piensan juntos. La miniatura nunca repite el título: añade lo que el título no dice (título "Why Airlines Overbook Flights" + imagen de dos pasajeros para un asiento + "BUT I PAID!"). Si solo se da el tema, el motor propone el título con la imagen.
- **A veces sin texto:** cada concepto sale también sin texto; a veces la imagen sola es más fuerte (la cámara acorazada vacía no necesita palabras).
- **Sin cifras inventadas:** el texto automático nunca pone números como hechos. Las cifras (`THUMBNAIL_TEXT`, `inLabel`/`outLabel` del Before/After) solo con fuente en la hoja del vídeo.

## 2b. Regla fija desde el vídeo 001: una micro-historia, no una escena

Validada por Chiño el 22-10-2026 con la A del vídeo 001 (`cutaway`). Vale para toda miniatura nueva.

- **Secuencia:** ZERO → OBJETO → SISTEMA ENORME → PREGUNTA. El objeto acaba de empezar su viaje y ZERO lo está viendo pasar o interactuando con él (lo acaba de soltar, lo persigue con el cuerpo, intenta alcanzarlo). ZERO no mira a cámara salvo que haya un motivo fuerte, y su cuerpo lleva la mirada hacia el objeto y el sistema.
- **ZERO simple, mundo rico.** La calidad sube con la luz, la profundidad, la escala, la maquinaria y el movimiento, nunca añadiendo detalle a ZERO.
- **El objeto es el detonante:** un poco más grande y con el color de acento sobre fondo oscuro, como un faro. Movimiento sutil y elegante (inclinación por el tirón, estela tenue, líneas de velocidad), nunca efectos de cómic.
- **ZERO ve lo que nosotros no:** parte del sistema se enseña en corte (pared abierta, casa de muñecas) para ver el mecanismo escondido. Se revela lo justo para fascinar y se esconde lo justo para que haga falta hacer clic. Nunca como infografía.
- **Escala:** ZERO pequeño frente al sistema enorme que hace falta para un objeto simple. Capas: delante ZERO, después el objeto, después la máquina de entrada y al fondo la operación gigante.
- **Tiempo o tensión:** si el tema tiene un plazo o una presión (de noche, en segundos, cada mes), se integra en la imagen, como el reloj junto al texto, sin añadir más texto.
- **Vida de fondo:** paquetes, luces que parpadean, gente diminuta, vehículos. Nunca compite con la historia principal.
- **PIX solo con función:** revela, ilumina, escanea o señala. Si no aporta, fuera.
- **Luz que guía:** ZERO, luego el objeto, luego el sistema escondido y por último el texto. El fondo visible, más oscuro y suave.
- **1 ZERO, 1 OBJETO, 1 ACCIÓN, 1 SISTEMA ENORME, 1 PREGUNTA.**
- **Convenciones del canal:** ZERO = simple · mundo = rico · PIX = revela · amarillo/acento = lo importante · mecanismos escondidos = curiosidad · cortes = descubrimiento · diferencia de escala = sorpresa.
- **Mejorar, no rehacer:** cuando ya hay una miniatura aprobada, se conserva lo que funciona y se mejora.

Control final (las 12 preguntas, además del Thumbnail Score): ¿ZERO se ve al instante? ¿Y el objeto? ¿El objeto va claramente hacia algún sitio? ¿ZERO interactúa? ¿El sistema parece mucho más grande de lo que ZERO esperaba? ¿Hay presión de tiempo o tensión? ¿El texto se lee al instante? ¿Plantea una pregunta en vez de dar la respuesta? ¿Funciona a 160×90? ¿Es para adultos? ¿Parece una historia animada y no una infografía? ¿Es inconfundiblemente Zero Understands? Si alguna respuesta importante es no, se rehace la composición.

## 3. Las cuatro composiciones maestras (layouts)

Para que el canal no se repita después de 20 vídeos, cada concepto usa uno de cuatro layouts. El motor lo elige según la mini-historia.

| Layout | Idea | Esquema | Ideal para | Mini-historias |
|---|---|---|---|---|
| **DISCOVERY** | ZERO descubre algo enorme o escondido | Zero → 👀 → mecanismo secreto | cómo funciona un banco, un seguro, adónde va tu dinero | `cutaway`, `mouth`, `pipe`, `watcher`, `two`, `ride` |
| **DANGER / CONSEQUENCE** | algo le está pasando a ZERO | sistema → ⚠ → Zero | deuda, inflación, estafas, suscripciones | `scanned`, `empty`, `gate`, `wheel`, `swarm`, `umbrella`, `stamp`, `chart`, `overload` |
| **SCALE** | ZERO diminuto ante algo gigantesco | Zero → mega almacén / barco / servidor | Amazon, logística global, internet, comercio | `hub`, `giant`, `web`, `funnel`, `corridor` |
| **BEFORE / AFTER** | una transformación muy clara | 100 → sistema → menos | impuestos, comisiones, salarios, royalties | `beforeafter`, `slices`, `shrink`, `machine` |

Capas, de atrás adelante: mundo (desenfocado, más oscuro) → luz (un charco detrás de ZERO y otro en el objeto, como un faro) → mini-historia → ZERO → primer plano → PIX → viñeta → texto. ZERO 28-52 % de la altura (más pequeño en SCALE), en un tercio lateral, nunca centrado. El lado se alterna entre vídeos y entre A y B. Texto arriba, opuesto a ZERO, 84-150 px, con una sombra difusa detrás. Márgenes de 24 px y nada importante bajo la duración del vídeo (abajo a la derecha).

## 3b. Bibliotecas fijas: ZERO y PIX

**12 poses maestras de ZERO** (`compose.js`, `POSES`). No se inventan poses para una miniatura; si hace falta una nueva, se añade a la biblioteca para todo el canal. Cuando la historia impone una acción (perseguir el objeto), la acción manda sobre la emoción.

| Pose | Cara | Cuerpo |
|---|---|---|
| `curious` | neutra | se inclina hacia delante |
| `confused` | confusa | se encoge de hombros, cabeza ladeada |
| `shocked` | sorpresa | brazos abiertos hacia fuera, echado atrás |
| `suspicious` | confusa | brazos cruzados |
| `worried` | miedo | manos a la boca |
| `mindblown` | sorpresa | manos a los lados de la cabeza |
| `thinking` | pensativa | mano en la barbilla |
| `discovery` | idea | presenta lo que ha encontrado |
| `lookingup` | sorpresa | mira hacia arriba, echado atrás (escala) |
| `pointing` | sorpresa | señala |
| `chasing` | sorpresa | se lanza tras el objeto, brazo estirado (la A del vídeo 001) |
| `waitwhat` | sorpresa | "Wait... WHAT?": una mano levantada, echado atrás |

Las palabras de antes siguen valiendo y se traducen solas (`surprised` → `waitwhat`, `impressed` → `lookingup`, `scared`/`sad`/`tired` → `worried`...).

**PIX, solo con función** (`PIX_ROLES`): `reveal` (abre o ilumina la capa oculta), `scan` (lee lo que algo es de verdad, halo azul), `warn` (avisa a ZERO, halo rojo), `illuminate` (ilumina algo), `point` (señala una anomalía) y `discover` (acaba de encontrar algo). Cada mini-historia dice qué función tiene PIX en ella (o ninguna). El motor pone a PIX como mucho en un concepto por vídeo (unas 2 de cada 6 miniaturas), con prioridad para el recomendado.

## 4. Código de color del canal (solo acento)

| Categoría | Acento | Temas |
|---|---|---|
| 💰 MONEY | verde / oro | tarjetas, impuestos |
| 🏦 FINANCE | verde / azul oscuro | bancos, deuda, seguros, inversión |
| 💻 TECHNOLOGY | cian / púrpura | apps gratis, datos, nube, IA |
| 🏭 BUSINESS | naranja / azul | aerolíneas, precios |
| 🚚 LOGISTICS | naranja / amarillo | paquetes, Amazon, envíos |
| 🧠 PSYCHOLOGY | rosa / púrpura | supermercados, suscripciones, casinos |
| ⚠ SCAMS / RISK | rojo / naranja | estafas, fraudes (`VIDEO_CATEGORY: "scams"`) |
| 🌍 GLOBAL SYSTEMS | turquesa / azul | Temu, IKEA, fábricas, barcos, comercio |
| HIDDEN SYSTEM | púrpura | lo que no encaja (reserva) |

## 5. Tres conceptos × con y sin texto = 6 miniaturas

| | Mecanismo del clic | Texto | Ejemplo (aerolíneas) |
|---|---|---|---|
| **A · CURIOSITY** | misterio, algo escondido | amarillo | Dos billetes, un asiento → WAIT... TWO? |
| **B · CONSEQUENCE** | lo que le pasa a ZERO | coral | ZERO con maleta, la puerta se cierra → BUT I PAID! |
| **C · SCALE / SURPRISE** | lo grande, caro o raro que es | amarillo | Avión lleno hasta el último asiento → THEY DO THIS ON PURPOSE |

Cada concepto sale con texto (`A1`) y sin texto (`A2`). La **principal** (`thumb.jpg`, la que sube Make) es el concepto recomendado: con texto, salvo que la imagen sola ya plantee la pregunta y puntúe igual o mejor. La **alternativa** (`alt.jpg`) es la mejor de los otros dos conceptos.

## 6. Decisiones automáticas (en este orden)

`src/thumbs/director.mjs`, con solo el título (o solo el tema):

**CATEGORÍA → MISTERIO PRINCIPAL → METÁFORA VISUAL → LAYOUT → EMOCIÓN DE ZERO → POSE → OBJETO PRINCIPAL → ENTORNO → ACENTO → TEXTO → PIX sí/no**

La categoría sale de puntuar palabras clave del título y del tema (frases > palabras; título > tema) contra 15 manuales de tema (`PLAYBOOKS`); si nada encaja, el de misterio. Cada manual trae, por concepto, la mini-historia, su misterio, el mundo, la emoción y varias opciones de texto (el motor descarta las que repiten el título y prueba la siguiente si una no llega al mínimo en el móvil). Con solo el tema, propone también el título (`titles`).

Temas incluidos: paquetes/Amazon, pagos con tarjeta, bancos, deuda, aerolíneas, supermercados, suscripciones, seguros, casinos, internet/datos/fotos/publicidad, precios/inflación, productos baratos (Temu, IKEA, fábricas, barcos), bolsa/inversión, impuestos y misterio.

## 7. Variables (todas opcionales salvo el título o el tema)

| Variable | Qué hace |
|---|---|
| `VIDEO_TITLE` | Con él solo basta. |
| `VIDEO_TOPIC` | El tema. Sin título, el motor propone el título junto con la miniatura. |
| `CORE_QUESTION` | La pregunta central del vídeo: pasa a ser el misterio del concepto recomendado. |
| `CORE_CONCEPT` | Texto libre que ayuda a elegir el tema. |
| `VIDEO_CATEGORY` | Fuerza la categoría: `money`, `finance`, `tech`, `business`, `logistics`, `psychology`, `scams`, `global`, `mystery`. |
| `MAIN_OBJECT` | Objeto que seguimos: `package`, `card`, `coin`, `cash`, `ticket`, `phone`, `cart`, `terminal`, `price`, `slot`, `seat`, `suitcase`, `bank`, `house`, `receipt`, `wallet`, `tv`, `vault`, `paycheck`, `coffee`, `milk`, `ship`, `contract`, `product`. |
| `ZERO_EMOTION` | Para el recomendado, una de las 12 poses (§3b). |
| `THUMBNAIL_TEXT` | Texto del recomendado (se parte solo en 1-2 líneas). |
| `BACKGROUND_ENVIRONMENT` | Mundo: `warehouse`, `hub`, `port`, `network`, `bankhall`, `airport`, `cabin`, `supermarket`, `livingroom`, `casino`, `serverroom`, `city`, `factory`, `trading`, `machine`. |
| `ACCENT_COLOR` | Color hex del acento. |
| `OPTIONAL_PIX` | `false` para quitar a PIX. |
| `ZERO_SIDE` | `left` / `right` para la A (la B va al otro lado). |
| `RECOMMENDED` | `A`, `B` o `C`. |
| `PLAYBOOK` | Fuerza un tema (`package`, `card`, `bank`, `debt`, `airline`, `supermarket`, `subscription`, `insurance`, `casino`, `tech`, `price`, `cheap`, `invest`, `tax`, `mystery`). |
| `VARIANTS` | Cambia un concepto: `{ "B": { "text": "BUT I PAID!", "zero": { "emotion": "worried" }, "hero": "gate", "layout": "danger", "mystery": "..." } }`. |

## 8. Thumbnail Score y control de calidad

Antes de aceptar una miniatura, el motor la puntúa sobre 10 (heurística: obliga a pasar un control, no predice el CTR): **Clarity, Curiosity, Zero visibility, Mobile readability** (calculada a 160×90), **Visual hierarchy, Adult appeal, Brand consistency, Emotional impact, Originality** (baja si los vídeos anteriores ya abrían con la misma mini-historia).

**Regla:** por debajo de 8 en Clarity, Curiosity o Mobile readability, se rediseña sola: primero quita a PIX y luego prueba las demás opciones de texto, sin romper ningún control. Si aun así no llega, queda marcada en rojo en `sheet.jpg` y no puede ser la principal.

**Controles automáticos** (✓/✗ en `plan.json` y `sheet.jpg`): ZERO entre 28 y 52 % de la altura y fuera del centro, ZERO mirando al concepto principal, un misterio definido, PIX solo con función, 2-5 palabras, letra ≥ 84 px, el texto no tapa a ZERO ni el objeto, márgenes, la esquina de la duración libre, PIX no tapa el texto.

**Mirada final (Claude o una persona) sobre `sheet.jpg`:** las 12 preguntas de §2b. Si una respuesta importante es no, se mejora la mini-historia en `heroes.js` (así mejora en todos los vídeos que la usan).

## 9. Dónde está cada cosa

- `src/thumbs/kit.js`: piezas del mundo (cajas, cintas, monedas, tarjetas, bancos, cámaras acorazadas, aviones, servidores, gente diminuta, luz...).
- `src/thumbs/worlds.js`: los 15 mundos de fondo.
- `src/thumbs/heroes.js`: las 24 mini-historias, entre ellas `cutaway` (la firma, con 4 interiores) y `beforeafter` (entra mucho, sale poco; una mirilla enseña cómo lo cortan y unas tuberías se llevan la diferencia).
- `src/thumbs/compose.js`: capas, poses maestras de ZERO, funciones de PIX, layouts, texto, luz, controles y Thumbnail Score.
- `src/thumbs/director.mjs`: código de color, ficha de cada mini-historia (`HEROES`: layout, capa oculta, pose, función de PIX), manuales de tema y decisiones.
- `src/thumbs/render.mjs` + `tools/thumbs.mjs`: render con Chromium, rediseño automático, principal y alternativa, hoja de revisión.

**Añadir un tema nuevo:** una entrada en `PLAYBOOKS` (palabras clave, familia, mundo, títulos y los tres conceptos con su mini-historia, misterio, emoción y textos). Para un sistema nuevo con capa oculta propia: un interior nuevo en `cutaway`.

## 10. En la cadena de publicación

- En un episodio, `thumbnail: 'content/thumbs/<vídeo>.json'` (o `thumbnail: { VIDEO_TITLE: ..., ... }`) hace que `src/render.mjs` genere las seis y use la principal como `thumb.jpg`. Sustituye al antiguo `thumb:` (un fotograma dibujado a mano), que sigue funcionando si no hay `thumbnail`.
- `publish.yml` sube también `thumbs/A.jpg`, `B.jpg` y `C.jpg` a GitHub Pages, y la cola de Make lleva `thumb_url` (la recomendada) y `thumb_variants` (la mejor de cada concepto).
