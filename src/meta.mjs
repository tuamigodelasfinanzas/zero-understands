// Writes the queue entry Make reads on the publishing day: site/queue/<date>.json
// Usage: node src/meta.mjs <episode.mjs> <date> <base url of the media folder> <out.json>
import fs from 'node:fs';
import path from 'node:path';

const [file, date, base, out] = process.argv.slice(2);
const ep = (await import(path.resolve(file))).default;
const short = ep.format === 'short';
const clean = s => String(s ?? '').replace(/[<>]/g, '');
const title = clean(short && !/#shorts/i.test(ep.title) ? `${ep.title} #Shorts` : ep.title).slice(0, 100);
fs.writeFileSync(out, JSON.stringify({
  date, id: ep.id, format: ep.format, title,
  description: clean(ep.description).slice(0, 4900),
  tags: ep.tags || [],
  category: ep.category === 'EDUCATION' ? '27' : '24',
  video_url: `${base}/${short ? 'short.mp4' : 'video.mp4'}`,
  thumb_url: short ? '' : `${base}/thumb.jpg`,
}, null, 1));
console.log('queue entry', out, title);
