# ZERO (@zerounderstands)

Fully automated animated videos: ZERO and PIX, drawn from the character Bible (`zero-design/`), voiced with edge-tts, rendered in GitHub Actions and published on YouTube by Make.

**How it works**
1. Episodes live in `episodes/<id>/*.mjs` (one long video + Shorts per topic), written with the helpers in `src/kit.mjs`. All on-screen text is in the episode file, so a translated copy renders the same video in another language.
2. `content/schedule.json` says what goes out each day (Mon Short, Wed long video, Thu related Short, Sat Short).
3. `.github/workflows/publish.yml` runs every day at 09:00 UTC, renders what is due today or tomorrow, publishes the files on GitHub Pages and writes `queue/<date>.json`.
4. Make ("ZERO · Subir a YouTube programado") runs every day at 17:00 Madrid, reads `queue/<tomorrow>.json` and uploads the video as private, scheduled to go public at 20:00 Madrid the next day (afternoon in the US). That leaves 27 hours to review it in YouTube Studio.

**Render locally**: `ZERO_VOICE=false ZERO_FPS=6 ZERO_STILLS=1 node src/render.mjs episodes/001-phone/long.mjs out/test` (no voice, low fps, a still every second in `out/test/work`).

**Thumbnails**: `node tools/thumbs.mjs "<video title>"` makes three thumbnail concepts (curiosity, consequence, scale) in the channel's style and recommends one; see `docs/miniaturas.md`.

**Pieces**: `src/puppets.js` draws ZERO, PIX and the props; `src/stage.js` animates keyframes; `src/render.mjs` makes voice, frames, sound and the MP4; `tools/make_audio.py` creates the original music and sound effects (the brand sounds come from `zero-design/sonidos`); `tools/extract.py` reads the faces from the Bible SVGs.
