# ZeroStoryEngine, ZeroObjectJourney y ZeroEnding

ZeroOpen mete al espectador dentro del sistema ([zeroopen.md](zeroopen.md)). Estos tres sistemas lo mantienen ahí durante 10 minutos (`src/story.mjs`).

## Una historia, no una lista de pasos

```
HOOK → MYSTERY → ENTER SYSTEM → DISCOVERY → COMPLICATION → BIG REVEAL → CONSEQUENCE → ZERO UNDERSTANDS
```

- **Un objetivo para ZERO todo el vídeo.** En el 001, que la caja llegue a tiempo al cumpleaños de mamá.
- **ONE OBJECT TO FOLLOW.** Un objeto físico nos lleva por todo el sistema: una caja, €100, un paquete de datos, un billete. Nunca "ahora hablemos de los procesadores de pago", sino "sigue los €100 de ZERO".
- **Revelación progresiva.** Cada respuesta abre una pregunta mayor (pregunta → respuesta → pregunta mayor). Nunca una pregunta seguida de 9 minutos de explicación.
- **Complicación.** Algo le pasa al objeto y ZERO puede perderlo.
- **Gran revelación.** Abrimos plano: el sistema entero de golpe, la escala que nadie ve.
- **Consecuencia.** El objeto llega y el resultado aterriza en el mundo normal de ZERO.

```bash
node tools/zeroopen.mjs story "Why Airlines Sell the Same Seat Twice"   # el plan: objeto, objetivo, cadena de preguntas...
node tools/zeroopen.mjs story episodes/v001-package/full.mjs            # el test sobre el episodio entero
```

El episodio declara dónde empieza cada acto y cuál es su objeto:

```js
story: [['hook', 0], ['mystery', 1], ['enter', 3], ...],
object: { name: 'the yellow box', ids: ['box', 'u1', ...] },
```

## ZeroEnding: final circular

El final vuelve al principio. Tiene cinco momentos:
1. **Volver** al lugar, la hora o el objeto del arranque.
2. **Pago**: el objeto llega.
3. **Ironía**: una última línea que le da la vuelta a todo. `ironyBeat()`: el móvil de ZERO vibra, él lo lee, mira a cámara y PIX solo dice "...".
4. **Mirada** de ZERO a cámara.
5. **CLICK · ZERO UNDERSTANDS** sobre negro: `endMark()`, 1,4 s, con el mismo `zu-signature` de la apertura.

Nunca "that's all for today", "like and subscribe" ni nada parecido.

En el 001:
- **Pago:** la caja llega a las 10:14 AM y dentro está ZERO, que se pasó la noche despierto y se ha quedado dormido.
- **Ironía:** sale y le llega al móvil *"Reminder: Mom's birthday is TODAY"*. El sistema llegó perfectamente a tiempo; el que se olvidó fue él.
- **Pregunta para el siguiente vídeo:** "And if she doesn't like the gift? Sending it back is an even stranger system."
- **Cierre:** CLICK · ZERO UNDERSTANDS.

## Test del episodio (`story`)

| Comprobación | Umbral |
|---|---|
| 1. Los ocho actos están y van en orden | Todos, sin saltos de orden |
| 2. El objeto está en pantalla la mayor parte del tiempo | ≥ 60 % |
| 3. Las preguntas siguen llegando | ≥ 4 preguntas y nunca más de 150 s sin una |
| 4. Interrupciones de patrón: ningún "aspecto" dura demasiado (mismo escenario de fondo seguido) | ≤ 50 s |
| 5. Nada de "step 1, step 2" | Ninguno |
| 6. Termina en la firma y sin CTA | Firma al final, sin CTA |

Lo encontrado en el 001 y ya corregido:
- Había 256 s sin una sola pregunta (toda la parte 2). Se añadió "So how does one box find the right plane?" cuando la pala tira a ZERO de la cinta.
- Había 50 s seguidos dentro del hub con el mismo aspecto. "Nobody opens your box" pasa a ser lo que ven las cámaras: la etiqueta enmarcada, con la cara de ZERO colándose en el flash.
