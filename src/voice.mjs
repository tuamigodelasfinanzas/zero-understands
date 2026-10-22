// Voices with edge-tts (free). One voice per character, the same in every video.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const VOICES = {
  narr: { voice: 'en-US-BrianMultilingualNeural', rate: '+4%', pitch: '+0Hz' },
  pix: { voice: 'en-US-AnaNeural', rate: '+6%', pitch: '+12Hz' },
  zero: { voice: 'en-US-GuyNeural', rate: '-4%', pitch: '+38Hz' },
};
export const voiceOn = () => String(process.env.ZERO_VOICE ?? 'true') !== 'false';
export const probe = f => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());
// rough duration when there is no voice (previews): ~2.6 words per second for the narrator
export const estimate = (text, who) => Math.max(0.6, String(text).split(/\s+/).length / (who === 'narr' ? 2.6 : 2.3) + 0.2);

const clean = t => String(t ?? '').replace(/\p{Extended_Pictographic}|\u{FE0F}|\u{200D}/gu, '').replace(/(\d)\s?%/g, '$1 percent').replace(/\s+/g, ' ').trim();

export function tts(text, file, who = 'narr', overrides = {}) {
  const v = Object.assign({}, VOICES[who] || VOICES.narr, overrides?.[who] || {});
  const tf = path.join(os.tmpdir(), `zero-tts-${process.pid}-${Math.random().toString(36).slice(2)}.txt`);
  fs.writeFileSync(tf, clean(text));
  let err = '';
  for (let i = 0; i < 3; i++) {
    try {
      fs.rmSync(file, { force: true });
      execFileSync('edge-tts', ['--voice', v.voice, `--rate=${v.rate}`, `--pitch=${v.pitch}`, '--file', tf, '--write-media', file], { stdio: 'pipe' });
      if (fs.existsSync(file) && fs.statSync(file).size > 1000) { fs.rmSync(tf, { force: true }); return probe(file); }
    } catch (e) { err = String(e.stderr || e.message).slice(-200); }
  }
  fs.rmSync(tf, { force: true });
  throw new Error('edge-tts failed: ' + err);
}
