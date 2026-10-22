# Generador de miniaturas de Zero Understands

Sistema reutilizable que convierte el título de un vídeo en **tres miniaturas terminadas** (1280×720) con la identidad del canal. No es una plantilla fija: elige el mundo, la mini-historia, la emoción de ZERO, el texto y la composición según el tema, y deja fijo todo lo que hace que se reconozca el canal.

```bash
node tools/thumbs.mjs "Why Airlines Overbook Flights"          # solo el título
node tools/thumbs.mjs content/thumbs/v001-package.json          # con variables fijadas
node tools/thumbs.mjs --plan "Why Airlines Overbook Flights"   # solo enseña las decisiones, sin dibujar
```

Salida en `out/thumbs/<título>/` (o la carpeta que se indique): `A.jpg`, `B.jpg`, `C.jpg`, `thumb.jpg` (la recomendada), `sheet.jpg` (revisión: tamaño completo, tamaño móvil y simulación del feed) y `plan.json` (todas las decisiones + el control de calidad).

Sin ordenador: **Actions → Thumbnails → Run workflow** con el título, o subir un `content/thumbs/<vídeo>.json`. Las miniaturas se guardan en `previews/thumbs/<nombre>/`.

## 1. La identidad que se hereda (no se inventa nada para las miniaturas)

| Elemento | De dónde sale | Regla en miniatura |
|---|---|---|
| **ZERO** | `src/puppets.js` (geometría de la Biblia), 12 caras ZE-01..12, 22 poses | Exactamente el mismo dibujo que en los vídeos. Nunca más detalle. La muesca de la cabeza siempre arriba a la izquierda: cuando ZERO va a la derecha se reflejan sus brazos y piernas, nunca su cabeza. |
| **Contorno** | Biblia + `docs/mundo-vivo.md` | ZERO es lo único con contorno negro; lleva el borde crema suave (`zrim`) y sombra de contacto. El mundo son formas tonales planas sin contorno (cara clara arriba, lado oscuro, sombra suave). |
| **PIX** | `pix()` de `src/puppets.js`, caras PE-01..08 | Secundario: aparece cuando revela algo (haz de escaneo hacia la idea principal, halo azul = dato, rojo = peligro). Nunca tapa el texto. |
| **Tipografía** | Fredoka Bold (la del canal y los vídeos) | Mayúsculas, relleno blanco + una línea destacada en color, trazo negro grueso y sombra dura. Ninguna otra fuente. |
| **Color** | `docs/direccion-visual.md` §11 | Amarillo = curiosidad (texto A y C, el objeto que seguimos), coral = peligro/consecuencia (texto B), azul = sistema/dato, púrpura = misterio, verde = dinero/éxito, carbón = ZERO. Fondos oscuros de noche, como el vídeo 001. |
| **Firmas del canal** | `docs/mundo-vivo.md` | El objeto amarillo que seguimos, la boca del sistema con rayas amarillas y negras, gente diminuta con vida propia, rótulos dentro del mundo, mundo en miniatura. |

## 2. Filosofía

**ZERO + UNA GRAN IDEA + CURIOSIDAD.** Se entiende en un segundo, no explica el vídeo, crea la pregunta.

- **Mini-historia:** algo está pasando y ZERO lo acaba de descubrir. ZERO no posa: reacciona al mecanismo oculto (el paquete entra en la boca del sistema, su dinero se va por una tubería detrás de la pared, dos billetes para un asiento).
- **Regla de 3 elementos:** 1) ZERO, 2) la idea principal, 3) el texto corto. Todo lo demás es escenario.
- **Título ≠ texto:** el título explica qué se descubre; la miniatura crea la emoción. El director descarta cualquier texto que repita la mayoría de las palabras del título.
- **Sin cifras inventadas:** el texto automático nunca pone números como hechos. Si una miniatura lleva una cifra, va en `THUMBNAIL_TEXT` y tiene que estar en la hoja de fuentes del vídeo (FACT).

## 3. Composición estándar (igual en todo el canal)

Capas, de atrás adelante: **mundo** (desenfocado, más oscuro) → **luz** (un charco detrás de ZERO y otro en la idea principal) → **idea principal** → **ZERO** → primer plano → **PIX** → viñeta → **texto**.

- **ZERO:** 36-46 % de la altura (comprobado: 30-50 %), en el tercio izquierdo o derecho, nunca en el centro. El lado se alterna entre vídeos (para que el feed no repita) y entre A y B.
- **Idea principal:** en el lado opuesto a ZERO, por debajo de la zona de texto, con su propio charco de luz de acento.
- **Texto:** arriba, en el lado opuesto a ZERO (zonas `tr`/`tl`, o la que pida la mini-historia), 1-2 líneas, 2-5 palabras, tamaño automático entre 84 y 150 px. Detrás lleva una sombra oscura difusa para que se lea sobre cualquier mundo.
- **Zonas seguras:** márgenes de 24 px, y nada importante en la esquina inferior derecha (la duración del vídeo de YouTube).
- **Profundidad:** mundo con desenfoque y bruma, mini-historia nítida, ZERO con borde de luz, primer plano (barandillas, mesa) cuando hace falta.

## 4. Familias visuales (cambian la luz y los acentos, nunca a ZERO, la letra ni el layout)

| Familia | Ambiente | Acento | Temas |
|---|---|---|---|
| MONEY / FINANCE | verde petróleo y azul oscuro, oro | verde | tarjetas, bancos, deuda, seguros, inversión, impuestos |
| TECHNOLOGY / INTERNET | azul noche, cian, púrpura | cian | apps gratis, datos, publicidad, nube, IA |
| BUSINESS / COMPANIES | azul profesional, naranja | naranja | aerolíneas, precios, fábricas, Temu, IKEA |
| LOGISTICS / HOW THINGS MOVE | noche de almacén, sodio naranja, azul sistema | azul | paquetes, Amazon, envíos, cadena de suministro |
| PSYCHOLOGY / MARKETING | ciruela, coral, amarillo | coral | supermercados, suscripciones, casinos |
| HIDDEN SYSTEM / MYSTERY | casi negro, luz focal, púrpura | púrpura | todo lo que no encaja (reserva) |

## 5. Las tres variantes (siempre las tres)

| | Mecanismo del clic | Texto | Ejemplo (aerolíneas) |
|---|---|---|---|
| **A · CURIOSITY** | misterio, algo escondido | amarillo | Dos billetes, un asiento → WAIT... TWO? |
| **B · CONSEQUENCE** | lo que le pasa a ZERO / al espectador | coral | ZERO con maleta, la puerta se cierra → NO SEAT FOR YOU |
| **C · SCALE / SURPRISE** | lo grande, caro, complejo o raro que es | amarillo | Avión lleno hasta el último asiento → THEY DO THIS ON PURPOSE |

Una queda **recomendada** (`thumb.jpg`, la que sube Make); las otras dos quedan para la prueba de miniaturas de YouTube (Test & Compare).

## 6. Decisiones automáticas

Con solo el título, `src/thumbs/director.mjs` decide:

1. **Categoría y tema:** puntúa palabras clave del título (frases > palabras; título > tema) contra 15 manuales de tema (`PLAYBOOKS`). Si nada encaja, usa el de misterio.
2. **Mundo** (fondo), 3. **metáfora** (mini-historia), 4-5. **emoción y pose de ZERO**, 6. **objeto principal**, 7. **color de acento** (de la familia), 8. **texto** (la primera opción cuyo `when` encaja con el título y que no repita el título), 9. **zona del texto** (opuesta a ZERO o la que pida la historia), 10. **lado de ZERO** (alternado por título; A y B opuestos).

Temas incluidos: paquetes/Amazon, pagos con tarjeta, bancos, deuda, aerolíneas (y precios de vuelos), supermercados, suscripciones, seguros, casinos, internet/datos/publicidad, precios/inflación, productos baratos (Temu, IKEA, fábricas, barcos), bolsa/inversión, impuestos y misterio.

## 7. Variables (todas opcionales salvo el título)

| Variable | Qué hace |
|---|---|
| `VIDEO_TITLE` | Obligatoria. Con ella sola basta. |
| `VIDEO_TOPIC`, `CORE_CONCEPT` | Texto libre que ayuda a elegir el tema. |
| `VIDEO_CATEGORY` | Fuerza la familia: `money`, `tech`, `business`, `logistics`, `psychology`, `mystery`. |
| `MAIN_OBJECT` | Objeto que seguimos: `package`, `card`, `coin`, `cash`, `ticket`, `phone`, `cart`, `terminal`, `price`, `slot`, `seat`, `suitcase`, `bank`, `house`, `receipt`, `wallet`, `tv`, `vault`, `paycheck`, `coffee`, `milk`, `ship`, `contract`, `product`. |
| `ZERO_EMOTION` | Para la recomendada: `curious`, `confused`, `shocked`, `surprised`, `suspicious`, `impressed`, `worried`, `realizing`, `sad`, `angry`, `scared`, `tired`, `pointing`. |
| `THUMBNAIL_TEXT` | Texto de la recomendada (se parte solo en 1-2 líneas). |
| `BACKGROUND_ENVIRONMENT` | Mundo: `warehouse`, `hub`, `port`, `network`, `bankhall`, `airport`, `cabin`, `supermarket`, `livingroom`, `casino`, `serverroom`, `city`, `factory`, `trading`, `machine`. |
| `ACCENT_COLOR` | Color hex del acento de luz. |
| `OPTIONAL_PIX` | `false` para quitar a PIX. |
| `ZERO_SIDE` | `left` / `right` para la A (la B va al otro lado). |
| `RECOMMENDED` | `A`, `B` o `C`. |
| `PLAYBOOK` | Fuerza un tema (`package`, `card`, `bank`, `debt`, `airline`, `supermarket`, `subscription`, `insurance`, `casino`, `tech`, `price`, `cheap`, `invest`, `tax`, `mystery`). |
| `VARIANTS` | Cambia una variante concreta: `{ "B": { "text": "NO SEAT FOR YOU", "zero": { "emotion": "scared" }, "hero": "gate" } }`. |

## 8. Control de calidad

**Automático** (en `plan.json` y en `sheet.jpg`, con ✓/✗): ZERO entre 30 y 50 % de la altura, ZERO fuera del centro, 2-5 palabras, letra ≥ 84 px, el texto no tapa a ZERO ni la idea principal, márgenes, esquina de la duración libre, PIX no tapa el texto.

**Humano (o Claude) mirando `sheet.jpg`**, antes de aceptar:
1. ¿Se entiende la idea básica en un segundo?
2. ¿Se lee el texto en el móvil (la miniatura pequeña de la hoja)?
3. ¿ZERO se ve al instante?
4. ¿Hay un único punto focal obvio?
5. ¿Crea curiosidad sin dar la respuesta?
6. ¿Parece para adultos de 20-50 y no para niños?
7. ¿Es inconfundiblemente Zero Understands?
8. ¿Destacaría junto a miniaturas profesionales?

Si alguna respuesta es no, se rediseña: cambiar texto o emoción con `VARIANTS`, o mejorar la mini-historia en `src/thumbs/heroes.js` (así mejora en todos los vídeos que la usan).

## 9. Dónde está cada cosa

- `src/thumbs/kit.js`: piezas (cajas, cintas, boca del sistema, monedas, tarjetas, datáfono, bancos, cámaras acorazadas, aviones, asientos, estanterías, máquinas tragaperras, servidores, gráficos, paraguas, recibos, gente diminuta, luz).
- `src/thumbs/worlds.js`: los 15 mundos de fondo.
- `src/thumbs/heroes.js`: las 23 mini-historias (`cutaway`, `mouth`, `ride`, `pipe`, `corridor`, `watcher`, `scanned`, `slices`, `empty`, `wheel`, `gate`, `swarm`, `umbrella`, `stamp`, `chart`, `overload`, `shrink`, `hub`, `giant`, `web`, `machine`, `funnel`, `two`). `cutaway` es la firma del canal (vídeo 001, A): ZERO acaba de soltar el objeto en la cinta, que se mete en una pared cortada en sección que deja ver la máquina enorme escondida detrás (escanear, clasificar, rutas, muelles, una puerta abierta al amanecer); el reloj cuelga junto al texto. Patrón reutilizable: ZERO + objeto en movimiento + sistema gigante visto en corte + pregunta.
- `src/thumbs/compose.js`: capas, ZERO y sus emociones, PIX, texto, luz, QA.
- `src/thumbs/director.mjs`: familias, manuales de tema y decisiones automáticas.
- `src/thumbs/render.mjs` + `tools/thumbs.mjs`: render con Chromium y hoja de revisión.

**Añadir un tema nuevo:** una entrada en `PLAYBOOKS` (palabras clave, familia, mundo y las tres variantes con su mini-historia, emoción y textos). Casi nunca hace falta dibujar: las mini-historias aceptan objetos (`obj`, `src`, `sink`, `item`...).

## 10. En la cadena de publicación

- En un episodio, `thumbnail: 'content/thumbs/<vídeo>.json'` (o `thumbnail: { VIDEO_TITLE: ..., ... }`) hace que `src/render.mjs` genere las tres y use la recomendada como `thumb.jpg`. Sustituye al antiguo `thumb:` (un fotograma dibujado a mano), que sigue funcionando si no hay `thumbnail`.
- `publish.yml` sube también `thumbs/A.jpg`, `B.jpg` y `C.jpg` a GitHub Pages, y la cola de Make lleva `thumb_url` (la recomendada) y `thumb_variants` (las tres).
