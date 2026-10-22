// Writes the queue entry Make reads on the publishing day: site/queue/<date>.json
// Usage: node src/meta.mjs <episode.mjs> <date> <base url of the media folder> <out.json>
import fs from 'node:fs';
import path from 'node:path';

const [file, date, base, out] = process.argv.slice(2);
const ep = (await import(path.resolve(file))).default;
const short = ep.format === 'short';
// 17:00 Madrid on the publishing day, as UTC (handles summer/winter time)
function publishAt(d) {
  for (const off of ['+02:00', '+01:00']) {
    const t = new Date(`${d}T17:00:00${off}`);
    const hm = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false }).format(t);
    if (hm === '17:00') return t.toISOString().replace('.000Z', 'Z');
  }
}
const clean = s => String(s ?? '').replace(/[<>]/g, '');
const title = clean(short && !/#shorts/i.test(ep.title) ? `${ep.title} #Shorts` : ep.title).slice(0, 100);
fs.writeFileSync(out, JSON.stringify({
  date, publish_at: publishAt(date), id: ep.id, format: ep.format, title,
  description: clean(ep.description).slice(0, 4900),
  tags: ep.tags || [],
  category: ep.category === 'EDUCATION' ? '27' : '24',
  video_url: `${base}/${short ? 'short.mp4' : 'video.mp4'}`,
  thumb_url: short ? '' : `${base}/thumb.jpg`,
}, null, 1));
console.log('queue entry', out, title);
