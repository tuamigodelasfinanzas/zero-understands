// Prints the schedule rows that must be rendered now: dated today or tomorrow (Madrid time) and not rendered yet.
// Usage: node src/queue.mjs <site/state/rendered.json> [YYYY-MM-DD to force one date]
import fs from 'node:fs';

const [stateFile, force] = process.argv.slice(2);
const sched = JSON.parse(fs.readFileSync(new URL('../content/schedule.json', import.meta.url))).items;
const done = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
const day = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(d);
const today = day(new Date()), tomorrow = day(new Date(Date.now() + 864e5));
const want = force ? [force] : [today, tomorrow];
const rows = sched.filter(r => want.includes(r.date) && (force || !done[r.date + '|' + r.file]));
console.log(JSON.stringify(rows));
