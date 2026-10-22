# ZeroOpen: la apertura de los vídeos largos

No es una intro. Cada vídeo largo de Zero Understands empieza ya dentro de la historia y sigue siempre la misma gramática:

```
ALGO NO CUADRA → ZERO LO NOTA → PIX REVELA → ZERO ENTRA → CLICK → ZERO UNDERSTANDS → la historia sigue
```

ZERO no explica el mundo desde fuera: le seguimos dentro para descubrir cómo funciona de verdad.

## Uso

```bash
node tools/zeroopen.mjs plan "Why Airlines Sell the Same Seat Twice"            # solo con el título
node tools/zeroopen.mjs plan "..." --question "..." --system "..." --mystery "..."  # fijando variables
node tools/zeroopen.mjs check episodes/v001-package/part1.mjs                      # test de las 12 preguntas
```

`plan` hace tres cosas:
- deriva los 12 campos (`CORE_QUESTION`, `EVERYDAY_SITUATION`, `VISUAL_ANOMALY`, `ZERO_ACTION`, `ZERO_REACTION`, `PIX_REVEAL`, `HIDDEN_SYSTEM`, `ENTRY_TRANSITION`, `OPENING_NARRATION`, `SOUND_DESIGN`, `MICRO_BRAND_MOMENT`, `FIRST_MAIN_STORY_BEAT`);
- los guarda en `content/opens/<título>.json`;
- escribe un episodio listo para previsualizar con la apertura completa en `episodes/opens/<título>.mjs`. Se previsualiza como cualquier episodio, con `previews/request.txt`.

## Las siete partes (`src/zeroopen.mjs`)

Cada parte es un beat etiquetado `zo: '<parte>'` para que el test la encuentre. Un episodio puede sustituir cualquier parte (`zeroOpenBeats(plan, { acts: { reveal: ... } })`) o escribirlas a mano usando las piezas, como hace el 001.

| Parte | Tiempo aprox. | Qué pasa | Regla |
|---|---|---|---|
| `event` | 0-5 s | ZERO hace algo normal y en el primer segundo ya hay acción y sonido | Sin logo, sin saludo, sin canal |
| `anomaly` | 5-10 s | El mundo enseña lo raro (pantalla, reloj, recibo, tarjeta de embarque) y ZERO mira de uno a otro | **Sin narración**: primero lo ve el espectador |
| `question` | 10-16 s | El narrador dice en voz alta lo que el espectador ya piensa, tras un silencio corto | Corta, curiosa, nada de documental |
| `reveal` | ~4 s | PIX escanea el objeto y abre la capa oculta (`hiddenlayer`) | PIX revela, no decora; cambia de forma en cada vídeo |
| `entry` | ~3 s | ZERO entra físicamente siguiendo el objeto; la cámara acelera hacia dentro | Nunca un corte genérico |
| `brand` | 1,2 s | PIX chirp → CLICK → wordmark ZERO UNDERSTANDS sobre el sistema en movimiento | Máximo 2 s; la cámara no se para |
| `promise` | sigue sin pausa | La primera frase del cuerpo del vídeo, ya dentro | Nada de "today we'll learn" |

## Piezas reutilizables

- **`screen`** (world.js): una pantalla del mundo, de mostrador o colgada, con tres líneas y un aviso `alert` que lleva la mirada. Aquí va el texto de los primeros 20 s: precios, horas, destinos.
- **`hiddenlayer`** (world.js): el panel de la pared que PIX abre. Puede abrirse con puertas que se separan (`doors`) o como rayos X (`xray`). Tipos:
  - `logistics`: cintas, escáneres, cajas que cambian de carril, camiones.
  - `money` y `subscriptions`: nodos y monedas que viajan.
  - `network`: routers y paquetes.
  - `booking`: panel de salidas y mapa de asientos.
  - `store`: pasillos, recorrido y zonas calientes.
  - `generic`.
- **`zumark`** (world.js): la firma. La cabeza de ZERO, el wordmark y un subrayado amarillo que entra, con el anillo del CLICK.
- **`zu-signature.wav`** (tools/make_sfx.py, con semilla propia para que nunca cambie): dura 1,15 s.
  - Dos chirridos de PIX.
  - Un CLICK seco con un golpe grave.
  - Una quinta ascendente que acaba en la octava (Mi5, Si5, Mi6), punteada y limpia, sin música épica.
- **`brandBeat({ behind })`**: el beat de la firma sobre el fondo que toque (en el 001, el túnel).
- **`openKeys(t, dur)`**: abre la capa oculta dentro de un beat.

## Variedad sin repetición

Cada arquetipo (logística, pagos, banca, aerolíneas, supermercado, suscripciones, internet, seguros, genérico) tiene variantes. Cada variante cambia la situación, el objeto, la anomalía, la revelación y la entrada. La variante sale del título y se puede pasar `avoid` con las ya usadas. Se repite la gramática, nunca la animación.

El constructor automático resuelve la anomalía con el texto de la pantalla del mundo y la capa oculta del tipo que toque. Una animación propia del tema (por ejemplo, los €100 que se parten en tres rutas) se escribe como sustitución de la parte `anomaly` del episodio, con las mismas piezas.

## Test de calidad (`check`)

Se calcula sobre los beats reales y con los tiempos estimados de la voz.

| Pregunta | Qué se comprueba |
|---|---|
| 1. ¿Pasa algo en los 3 primeros segundos? | Hay sonido o movimiento en el primer beat antes de 3 s |
| 2. ¿Hay hueco de curiosidad? | Existe un beat de anomalía sin narración |
| 3. ¿ZERO hace algo? | ZERO actúa en el beat del evento |
| 4. ¿La pregunta llega pronto? | Termina antes de 20 s |
| 5. ¿PIX revela? | PIX y un mecanismo de revelación están en el mismo beat |
| 6. ¿ZERO entra físicamente? | Hay un beat de entrada |
| 7. ¿La firma es cortísima? | Dura 2 s o menos |
| 8. ¿La historia sigue enseguida? | La primera frase llega en 0,6 s o menos |
| 9. ¿Sin exposición? | 45 palabras o menos antes de la firma y nada de "like/subscribe/welcome/today's video" |
| 10. ¿Quiero saber la respuesta? | **Hay que verlo** |
| 11. ¿Es para adultos? | Sin subtítulos (`text`) en los primeros 20 s y sin clichés de YouTube |
| 12. ¿Es inconfundible? | Aparecen ZERO, PIX y `zu-signature` |

Si falla algo importante, se rediseña la apertura.

## Shorts

En los Shorts no se usa ZeroOpen. Empiezan con su gancho más fuerte, sin firma ni tarjeta. La marca la ponen ZERO, PIX, la tipografía, los colores y la voz.

## Vídeo 001

La apertura (plan en `content/opens/v001-package.json`) arranca a las 6:47 PM en la tienda de envíos:
1. ZERO deja la caja sobre el mostrador. Narración: "ZERO forgot his mom's birthday. It's tomorrow."
2. La pantalla dice PORTLAND, ME · TOMORROW · 10:30 AM (F16). El reloj dice 6:47 PM. Silencio.
3. Narración: "She lives on the other side of the country. So how is that even possible?"
4. PIX sale de la boca del sistema, escanea la caja y abre la pared de al lado: cintas, escáneres y camiones.
5. ZERO salta sobre la caja.
6. CLICK · ZERO UNDERSTANDS.
7. Ya en el túnel: "Between this counter and her front door, something enormous happens while the country sleeps…"

ZERO entra en el sistema hacia los 25 s.
