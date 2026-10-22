# Mundo vivo: personaje simple, mundo rico

Dirección visual v2 del canal (22-10-2026). Complementa `direccion-visual.md`, que sigue vigente. ZERO no cambia: es el
único con contorno negro y el que más contraste tiene. Lo que sube de nivel es el mundo a su alrededor.

## La firma visual de Zero Understands

Se reutiliza en todos los episodios, para que un vídeo se reconozca antes de ver el logo.

1. **"ZERO has been dropped inside the system."** Es la identidad diferencial del canal. ZERO no explica el sistema desde fuera: cae dentro y lo recorre montado en lo que seguimos (salta a la cinta, se sienta en la caja, viaja en el camión; en tarjetas de crédito, va subido a la transacción desde el datáfono por cables, redes, procesador y bancos). Prueba de cada tema: ¿sobre qué se monta ZERO y por dónde pasa?
2. **El objeto amarillo.** Lo que seguimos (la caja de 001) es amarillo; todo lo demás del sistema es marrón o gris. Siempre se encuentra en el plano.
3. **La boca del sistema.** Cada sistema tiene una entrada oscura (cortina de tiras, compuerta, túnel) con marco de rayas amarillas y negras.
4. **SYSTEM VIEW.** PIX cambia el mundo a la capa que lee la máquina: rejilla azul, línea de escaneo, solo los datos en amarillo. Lo humano (el corazón que dibujó ZERO) aparece como "NOT SCANNED".
5. **Gente diminuta con vida propia.** Personas planas en colores apagados, sin contorno: bostezan, teclean, cruzan la calle con paraguas. Nunca roban el foco.
6. **PIX vive en el sistema.** Sale de la boca del sistema, escanea, proyecta hologramas en las paredes, niega con la cabeza cuando ZERO se equivoca. No es un tooltip flotante: entra y sale del plano y se queda en el mundo.
7. **Rótulos dentro del mundo.** Placas (OUTBOUND), señales de carretera (AIRPORT), carteles iluminados. Nada de títulos flotando sobre el vídeo.

## Reglas por plano

- **Tres capas:** primer plano (mesa, postes de cola, lluvia delante), plano medio con la acción y fondo con su propia vida.
- **El mundo nunca está quieto:** vapor, tren que cruza, luces de ventanas que se encienden, gato que mueve la cola, cinta que corre, coches que pasan, lámparas que se balancean. Todo sale de `gt` en `src/world.js`, sin claves.
- **Un evento visual cada 3-6 s:** corte, movimiento de cámara, objeto nuevo, reacción, holograma, gag. Sin caos: un solo foco cada vez.
- **Cine:** plano general para situar, medio para la acción, inserto para el detalle (reloj, sello, etiqueta), cenital para los sistemas (cintas), seguimiento para los viajes (túnel, carretera), transición a través de objetos (zoom a la boca del sistema).
- **Contar con situaciones:** ZERO malinterpreta y el mundo le corrige (busca un GPS en la caja; PIX lo tacha).
- **Luz:** noche fría con charcos de luz cálida; azul para el sistema; coral solo para los problemas. ZERO lleva un borde suave y una sombra de contacto para que pertenezca a la escena.
- **Prueba de cada plano:** ¿se entiende sin sonido? ¿parece una animación terminada o una presentación? Si parece presentación, se rehace.

## Dónde está

- `src/world.js`: el kit del mundo (cocina, tienda, cinta, boca, túnel, carretera, camión en corte, lluvia, gente, PIX hologramas, SYSTEM VIEW).
- `episodes/v001-package/part1.mjs`: primer episodio con esta dirección (escenas s01-s11).
- `tools/stills.mjs`: fotogramas sueltos para revisar sin renderizar el vídeo.
- `tools/make_sfx.py`: ambientes sintetizados (lluvia, motor, cinta, túnel, nevera) y efectos.
- `.github/workflows/preview.yml`: render con voz en GitHub Actions; se dispara al cambiar `previews/request.txt`.
