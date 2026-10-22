// The thumbnail director: from a video title (and any variables you want to fix) to three finished concepts.
// It takes the creative decisions in docs/miniaturas.md: category, world, main metaphor, ZERO's emotion and pose,
// main object, accent colour, thumbnail text (never the title), text and ZERO placement, and which concept to lead with.
//
//   plan({ VIDEO_TITLE: 'Why Airlines Overbook Flights' })
//   plan({ VIDEO_TITLE, VIDEO_TOPIC, VIDEO_CATEGORY, CORE_CONCEPT, MAIN_OBJECT, ZERO_EMOTION, THUMBNAIL_TEXT,
//          BACKGROUND_ENVIRONMENT, ACCENT_COLOR, OPTIONAL_PIX, ZERO_SIDE, RECOMMENDED, VARIANTS: { A: {...}, B, C } })
//
// Every variable is optional except the title. A fixed variable wins over the automatic choice; THUMBNAIL_TEXT and
// ZERO_EMOTION apply to the recommended concept, VARIANTS.<id> overrides one concept (text, hero, heroOpts, zero, pix...).

// ---------- visual families: they change the world's light and accents, never ZERO, the type or the layout ----------
export const FAMILIES = {
  money: { name: 'MONEY / FINANCE', bg1: '#08161F', bg2: '#123B3F', wall: '#16363B', floor: '#0F2629', accent: '#2E9E5B', key: '#FFE2A6', grade: '#FFC93C' },
  tech: { name: 'TECHNOLOGY / INTERNET', bg1: '#070D26', bg2: '#13285C', wall: '#0E1838', floor: '#111B38', accent: '#3FD0FF', key: '#CFE8FF', grade: '#7B5CD6' },
  business: { name: 'BUSINESS / COMPANIES', bg1: '#0F1830', bg2: '#22385E', wall: '#22304A', floor: '#1E2436', accent: '#FF8A3D', key: '#FFE2A6', sky1: '#FF9E5E', sky2: '#4B3F8A', grade: '#FF8A3D' },
  logistics: { name: 'LOGISTICS / HOW THINGS MOVE', bg1: '#141A33', bg2: '#25304F', wall: '#25304F', floor: '#2A3048', accent: '#4FA8FF', key: '#FFE2A6', grade: '#FF9E45' },
  psychology: { name: 'PSYCHOLOGY / MARKETING', bg1: '#170B26', bg2: '#3A1E48', wall: '#2B2240', floor: '#20192F', accent: '#FF6B5B', key: '#FFE2A6', grade: '#FF6B5B' },
  mystery: { name: 'HIDDEN SYSTEM / MYSTERY', bg1: '#05060D', bg2: '#1D1A33', wall: '#1D1A33', floor: '#1A1830', accent: '#7B5CD6', key: '#FFE2A6', vignette: 0.8, grade: '#7B5CD6' },
};

// text colour by angle keeps the brand meaning of the palette: yellow = curiosity, coral = danger/consequence
const TEXT_COLOR = { curiosity: '#FFC93C', consequence: '#FF6B5B', scale: '#FFC93C' };

// ---------- playbooks: one per kind of system ----------
// keywords score the title/topic; each concept has a hero (situation), a world, ZERO's emotion and text options.
// Text options: first one whose `when` matches the title wins; `hl` = which line is highlighted.
const T = (lines, when, hl) => ({ lines, when, hl });
export const PLAYBOOKS = [
  {
    id: 'package', family: 'logistics', world: 'warehouse',
    keywords: ['amazon', 'package', 'packages', 'parcel', 'delivery', 'deliver', 'delivered', 'shipping', 'shipped', 'warehouse', 'fulfillment', 'courier', 'ups', 'fedex', 'dhl', 'usps', 'mail', 'postal', 'returns', 'return', 'prime', 'next day', 'same day', 'logistics', 'order', 'online order'],
    concepts: {
      A: { hero: 'mouth', emotion: 'curious', concept: 'The yellow box rides the belt into the mouth of the system', worldOpts: { clock: [3, 10] }, worldWhen: /sleep|night|overnight|morning/, text: [T(['BY', 'MORNING?'], /sleep|night|overnight|morning/), T(['HOW?!'], /fast|quick|so fast|speed/), T(['WHERE DOES', 'IT GO?'])] },
      B: { hero: 'scanned', emotion: 'shocked', concept: 'ZERO himself on the sorter, label on his chest, under the red scanner', text: [T(['NO ONE', 'SLEEPS'], /sleep|night|overnight/), T(['IT NEVER', 'STOPS'])] },
      C: { hero: 'hub', world: 'hub', emotion: 'impressed', side: 'right', concept: 'From a catwalk: endless belts, thousands of parcels, a plane at the door', text: [T(['ALL THIS IN', 'ONE NIGHT?'], /sleep|night|overnight/), T(['THIS IS', 'ONE BUILDING'])] },
    },
    recommend: 'A',
  },
  {
    id: 'card', family: 'money', world: 'network',
    keywords: ['credit card', 'debit card', 'card', 'cards', 'pay by card', 'payment', 'payments', 'contactless', 'tap', 'visa', 'mastercard', 'transaction', 'swipe', 'chip', 'checkout', 'apple pay', 'fees', 'fee', 'cashback', 'points'],
    concepts: {
      A: { hero: 'ride', emotion: 'surprised', concept: 'ZERO rides the payment out of the card terminal toward the banks', heroOpts: { src: 'terminal', dest: 'bank' }, text: [T(['WHERE DOES', 'IT GO?'])] },
      B: { hero: 'slices', emotion: 'worried', concept: 'Every tap, the coin is cut into slices that strangers carry away', text: [T(['WHO TAKES', 'A CUT?'])] },
      C: { hero: 'web', emotion: 'impressed', concept: 'One terminal, one coffee, a whole planet of banks lighting up', text: [T(['ALL THIS FOR', 'A COFFEE?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'bank', family: 'money', world: 'bankhall',
    keywords: ['bank', 'banks', 'banking', 'savings', 'deposit', 'vault', 'fractional', 'reserve', 'account', 'money creation', 'cash', 'atm', 'central bank', 'printing money', 'interest rate'],
    concepts: {
      A: { hero: 'pipe', emotion: 'suspicious', concept: 'His deposit slides through a pipe behind the bank wall', heroOpts: { src: 'cash', sink: 'vault' }, text: [T(['WAIT...', 'WHERE?']), T(['WHERE IS', 'MY MONEY?'])] },
      B: { hero: 'empty', emotion: 'shocked', concept: 'The vault is open, and it is almost empty', text: [T(['IT\'S NOT', 'IN HERE'])] },
      C: { hero: 'machine', emotion: 'suspicious', concept: 'One coin goes in, a flood of money comes out', text: [T(['MONEY FROM', 'NOTHING?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'debt', family: 'money', world: 'city',
    keywords: ['debt', 'loan', 'loans', 'mortgage', 'interest', 'credit score', 'payday', 'student loan', 'student loans', 'minimum payment', 'borrow', 'bnpl', 'buy now pay later', 'rent'],
    concepts: {
      A: { hero: 'wheel', emotion: 'tired', concept: 'ZERO runs in a hamster wheel that drives the bank\'s machine', heroOpts: { sink: 'bank' }, text: [T(['WHO IS THIS', 'FOR?']), T(['WHY IT', 'NEVER ENDS'])] },
      B: { hero: 'funnel', emotion: 'worried', concept: 'Every house pays a little stream into one tower', heroOpts: { src: 'house', sink: 'tower' }, text: [T(['YOU PAY', 'TWICE'])] },
      C: { hero: 'giant', emotion: 'shocked', concept: 'The contract he signed, taller than a building', heroOpts: { obj: 'contract', h: 700 }, text: [T(['YOU SIGNED', 'THIS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'airline', family: 'business', world: 'airport',
    keywords: ['airline', 'airlines', 'flight', 'flights', 'plane', 'planes', 'airport', 'airports', 'overbook', 'overbooked', 'overbooking', 'ticket', 'tickets', 'seat', 'seats', 'boarding', 'luggage', 'baggage', 'pilot', 'airfare', 'fly', 'flying', 'jet lag', 'travel'],
    concepts: {
      A: { hero: 'two', emotion: 'suspicious', concept: 'Two boarding passes, one seat', text: [T(['WAIT...', 'TWO?'])] },
      B: { hero: 'gate', emotion: 'scared', concept: 'ZERO runs with his suitcase while the door closes', text: [T(['NO SEAT', 'FOR YOU'])] },
      C: { hero: 'corridor', world: 'cabin', emotion: 'impressed', concept: 'A plane full to the last seat', heroOpts: { item: 'seats', vx: 820, vy: 340 }, text: [T(['THEY DO THIS', 'ON PURPOSE'], /overbook/), T(['EVERY SEAT', 'IS SOLD TWICE'], /overbook/), T(['EVERY SEAT', 'COUNTS'])] },
    },
    variants: [{ when: /price|cheap|expensive|cost|fare|pay more/, A: { hero: 'two', heroOpts: { obj: 'tag' }, text: [T(['SAME', 'SEAT?'])] } }],
    recommend: 'A',
  },
  {
    id: 'supermarket', family: 'psychology', world: 'supermarket',
    keywords: ['supermarket', 'supermarkets', 'grocery', 'groceries', 'store', 'stores', 'aisle', 'milk', 'layout', 'walmart', 'costco', 'mall', 'impulse', 'checkout', 'discount', 'sale', 'coupon', 'loyalty', 'shopping', 'shop', 'retail'],
    concepts: {
      A: { hero: 'corridor', emotion: 'confused', concept: 'The milk glows at the far end of an endless aisle', heroOpts: { item: 'shelves', end: 'milk' }, text: [T(['WHY SO', 'FAR?'], /milk|back|layout|walk/), T(['NOTHING IS', 'RANDOM'])] },
      B: { hero: 'overload', emotion: 'confused', concept: 'ZERO came for one thing; his cart is a tower', text: [T(['YOU DIDN\'T', 'NEED THIS'])] },
      C: { hero: 'watcher', emotion: 'suspicious', concept: 'Cameras and eyes in the dark between the shelves', heroOpts: { phone: false }, text: [T(['THEY PLANNED', 'THIS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'subscription', family: 'psychology', world: 'livingroom',
    keywords: ['subscription', 'subscriptions', 'netflix', 'spotify', 'streaming', 'recurring', 'membership', 'memberships', 'cancel', 'free trial', 'saas', 'gym', 'auto-renew', 'renew', 'monthly'],
    concepts: {
      A: { hero: 'corridor', world: 'machine', emotion: 'confused', concept: 'The CANCEL door at the end of a corridor of doors', heroOpts: { item: 'doors', end: 'exit', sign: 'CANCEL' }, text: [T(['TRY TO', 'CANCEL'])] },
      B: { hero: 'swarm', emotion: 'worried', concept: 'Every app has a tube into his wallet', text: [T(['YOU NEVER', 'STOP PAYING'])] },
      C: { hero: 'giant', emotion: 'shocked', concept: 'One year of "only $9.99", printed', heroOpts: { obj: 'receipt', h: 760 }, text: [T(['IT ADDS', 'UP'])] },
    },
    recommend: 'B',
  },
  {
    id: 'insurance', family: 'money', world: 'city',
    keywords: ['insurance', 'insure', 'insurer', 'insurers', 'premium', 'premiums', 'coverage', 'claim', 'claims', 'deductible', 'warranty', 'policy'],
    concepts: {
      A: { hero: 'umbrella', emotion: 'confused', concept: 'An umbrella full of holes; the coins flow to a dry tower', text: [T(['WHO\'S', 'PROTECTED?'])] },
      B: { hero: 'stamp', emotion: 'shocked', concept: 'A giant stamp comes down on his claim', text: [T(['CLAIM', 'DENIED?'])] },
      C: { hero: 'funnel', emotion: 'impressed', concept: 'A whole city pays little streams into one tower', heroOpts: { src: 'house', sink: 'tower' }, text: [T(['WHERE DOES', 'IT GO?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'casino', family: 'psychology', world: 'casino',
    keywords: ['casino', 'casinos', 'gambling', 'gamble', 'slot', 'slots', 'lottery', 'betting', 'bet', 'bets', 'poker', 'roulette', 'house edge', 'sports betting', 'vegas', 'jackpot', 'loot box'],
    concepts: {
      A: { hero: 'pipe', emotion: 'suspicious', concept: 'Behind the slot machine, a pipe to the casino vault', heroOpts: { src: 'slot', srcH: 300, sink: 'vault' }, text: [T(['THE HOUSE', 'KNOWS'])] },
      B: { hero: 'funnel', emotion: 'sad', concept: 'Every player pours into one machine', heroOpts: { src: 'person', sink: 'slot', sinkH: 400 }, text: [T(['YOU WERE', 'NEVER WINNING'])] },
      C: { hero: 'corridor', emotion: 'impressed', concept: 'Endless rows of machines; no clocks, no windows', heroOpts: { item: 'slots' }, text: [T(['NO CLOCKS.', 'NO WINDOWS.'])] },
    },
    recommend: 'A',
  },
  {
    id: 'tech', family: 'tech', world: 'serverroom',
    keywords: ['free', 'app', 'apps', 'data', 'privacy', 'tracking', 'tracked', 'algorithm', 'algorithms', 'social media', 'tiktok', 'instagram', 'facebook', 'google', 'youtube', 'cookies', 'internet', 'cloud', 'server', 'servers', 'ai', 'chatgpt', 'wifi', 'email', 'website', 'online', 'phone', 'smartphone', 'ads', 'advertising', 'targeted'],
    concepts: {
      A: { hero: 'watcher', emotion: 'suspicious', concept: 'Eyes and cameras in the dark behind his phone', text: [T(['WHO\'S', 'WATCHING?'])] },
      B: { hero: 'scanned', emotion: 'shocked', concept: 'ZERO on the belt with a barcode: he is what is being sold', heroOpts: { laser: '#3FD0FF' }, text: [T(['YOU ARE THE', 'PRODUCT'], /free|ads|advertis|social|google|facebook|instagram|tiktok/), T(['YOU\'RE', 'NEXT'])] },
      C: { hero: 'corridor', emotion: 'impressed', concept: 'An endless hall of servers', heroOpts: { item: 'servers' }, text: [T(['IT\'S NOT', 'A CLOUD'], /cloud|internet|server|email|data/), T(['IT NEVER', 'FORGETS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'price', family: 'business', world: 'supermarket',
    keywords: ['price', 'prices', 'cost', 'costs', 'expensive', 'inflation', 'markup', 'margin', 'profit', 'worth', 'pay more', 'shrinkflation', 'why does', 'cost so much', 'so expensive', 'overpriced'],
    concepts: {
      A: { hero: 'slices', emotion: 'confused', concept: 'The price is cut into slices that strangers carry off', text: [T(['WHO GETS', 'THE MONEY?'])] },
      B: { hero: 'shrink', emotion: 'suspicious', concept: 'Same box, same price, almost nothing inside', text: [T(['SAME PRICE.', 'LESS.'])] },
      C: { hero: 'giant', emotion: 'shocked', concept: 'A price tag the size of a building', heroOpts: { obj: 'tag', h: 360, x: 820 }, text: [T(['WHY THIS', 'MUCH?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'cheap', family: 'business', world: 'factory',
    keywords: ['temu', 'shein', 'aliexpress', 'ikea', 'so cheap', 'cheap', 'cheaper', 'dollar store', 'made in china', 'factory', 'factories', 'supply chain', 'container', 'containers', 'port', 'ports', 'fast fashion', 'manufacturing', 'dropshipping', 'wholesale', 'cargo', 'ship', 'ships'],
    concepts: {
      A: { hero: 'machine', emotion: 'suspicious', concept: 'Raw stuff in, a flood of products with a $1 tag out', heroOpts: { input: 'raw', output: 'products', price: '$1' }, text: [T(['HOW IS IT', 'SO CHEAP?'])] },
      B: { hero: 'slices', emotion: 'worried', concept: 'The price is cut up before it reaches the person who made it', text: [T(['WHO PAYS', 'THE REST?'])] },
      C: { hero: 'giant', world: 'port', emotion: 'impressed', concept: 'One container ship, bigger than the port', heroOpts: { obj: 'ship', h: 330, x: 820 }, text: [T(['THIS IS', 'ONE SHIP'])] },
    },
    recommend: 'A',
  },
  {
    id: 'invest', family: 'money', world: 'trading',
    keywords: ['stock', 'stocks', 'stock market', 'invest', 'investing', 'investor', 'investors', 'shares', 'wall street', 'index fund', 'etf', 'crypto', 'bitcoin', 'trading', 'trader', 'hedge fund', 'market crash', 'crash', 'bubble', 'retirement', '401k', 'pension'],
    concepts: {
      A: { hero: 'chart', emotion: 'suspicious', concept: 'A giant pen in the dark is drawing the line he stands on', heroOpts: { mode: 'pen' }, text: [T(['WHO SETS', 'THE PRICE?'])] },
      B: { hero: 'chart', emotion: 'scared', concept: 'One step from the edge of the chart', heroOpts: { mode: 'cliff' }, text: [T(['WHO', 'LOSES?'])] },
      C: { hero: 'giant', emotion: 'impressed', concept: 'A wall of screens taller than a building, all moving', heroOpts: { obj: 'screenwall', h: 660 }, text: [T(['IT NEVER', 'SLEEPS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'tax', family: 'money', world: 'city',
    keywords: ['tax', 'taxes', 'irs', 'paycheck', 'salary', 'income', 'payroll', 'refund', 'tax return', 'vat', 'tariff', 'tariffs'],
    concepts: {
      A: { hero: 'slices', emotion: 'confused', concept: 'His paycheck coin, sliced and carried off', heroOpts: { dest: 'gov' }, text: [T(['WHERE DOES', 'IT GO?'])] },
      B: { hero: 'funnel', emotion: 'worried', concept: 'Every house sends a stream to one building', heroOpts: { src: 'house', sink: 'gov', sinkH: 360, sign: 'TAX OFFICE' }, text: [T(['YOU PAY', 'FIRST'])] },
      C: { hero: 'giant', emotion: 'shocked', concept: 'The rule book, taller than a building', heroOpts: { obj: 'contract', h: 700 }, text: [T(['WHO READS', 'THIS?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'mystery', family: 'mystery', world: 'machine', fallback: true,
    keywords: ['hidden', 'secret', 'really', 'actually', 'behind', 'inside', 'system', 'how does', 'how do', 'what happens', 'where does', 'why do', 'why does'],
    concepts: {
      A: { hero: 'mouth', emotion: 'curious', concept: 'The thing we follow disappears into the mouth of the system', text: [T(['WHAT\'S', 'INSIDE?'])] },
      B: { hero: 'scanned', emotion: 'shocked', concept: 'ZERO is inside the system, labelled', text: [T(['YOU\'RE PART', 'OF IT'])] },
      C: { hero: 'machine', emotion: 'impressed', concept: 'A machine much bigger than it should be', text: [T(['IT\'S', 'EVERYWHERE'])] },
    },
    recommend: 'A',
  },
];

// MAIN_OBJECT words -> kit objects the heroes understand
const OBJECTS = { package: 'box', parcel: 'box', box: 'box', card: 'card', 'credit card': 'card', coin: 'coin', money: 'cash', cash: 'cash', ticket: 'ticket', phone: 'phone', cart: 'cart', terminal: 'terminal', price: 'tag', tag: 'tag', slot: 'slot', seat: 'seat', suitcase: 'suitcase', bank: 'bank', house: 'house', receipt: 'receipt', wallet: 'wallet', tv: 'screen', screen: 'screen', vault: 'vault', paycheck: 'paycheck', coffee: 'cup', milk: 'milk', ship: 'ship', contract: 'contract', product: 'product' };
const EMOTIONS = ['curious', 'confused', 'shocked', 'surprised', 'suspicious', 'impressed', 'worried', 'realizing', 'sad', 'angry', 'scared', 'tired', 'pointing'];
const CATEGORY_ALIASES = { finance: 'money', money: 'money', tech: 'tech', technology: 'tech', internet: 'tech', business: 'business', companies: 'business', logistics: 'logistics', psychology: 'psychology', marketing: 'psychology', mystery: 'mystery', hidden: 'mystery' };

const norm = s => ' ' + String(s ?? '').toLowerCase().replace(/[^a-z0-9$' ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
const hash = s => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// how strongly a playbook matches: phrases count more than single words, the title more than the topic
function score(pb, title, extra) {
  let sc = 0;
  for (const k of pb.keywords) {
    const kw = ' ' + k + ' ';
    if (title.includes(kw)) sc += k.includes(' ') ? 3 : 2;
    else if (extra.includes(kw)) sc += 1;
  }
  return sc;
}

// thumbnail text must not repeat the title: drop options that reuse most of its words
const STOP = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'of', 'for', 'you', 'your', 'in', 'on', 'this', 'that', 'and', 'why', 'how', 'what', 'who', 'where', 'do', 'does']);
function echoes(lines, title) {
  const tw = new Set(norm(title).trim().split(' '));
  const words = norm(lines.join(' ')).trim().split(' ').filter(w => !STOP.has(w));
  if (!words.length) return false;
  return words.filter(w => tw.has(w)).length / words.length >= 0.6;
}
function pickText(options, title) {
  const t = norm(title);
  const ok = options.filter(o => !o.when || o.when.test(t));
  return (ok.find(o => !echoes(o.lines, title)) || ok[0] || options[options.length - 1]);
}
// split free text into 1-2 balanced lines
function lines(text) {
  const w = String(text).trim().split(/\s+/);
  if (w.length <= 1 || String(text).length <= 9) return [String(text).trim()];
  let best = null;
  for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(' '), b = w.slice(i).join(' '); const d = Math.abs(a.length - b.length); if (!best || d < best.d) best = { d, l: [a, b] }; }
  return best.l;
}

export function plan(input) {
  const I = typeof input === 'string' ? { VIDEO_TITLE: input } : input;
  const title = I.VIDEO_TITLE ?? I.title;
  if (!title) throw new Error('VIDEO_TITLE is required');
  const t = norm(title), extra = norm([I.VIDEO_TOPIC, I.CORE_CONCEPT, I.MAIN_OBJECT, I.BACKGROUND_ENVIRONMENT].join(' '));

  // 1. category + playbook
  const ranked = PLAYBOOKS.map(pb => ({ pb, sc: score(pb, t, extra) })).sort((a, b) => b.sc - a.sc);
  let pb = ranked[0].sc > 0 ? ranked[0].pb : PLAYBOOKS.find(p => p.fallback);
  if (I.PLAYBOOK) pb = PLAYBOOKS.find(p => p.id === I.PLAYBOOK) ?? pb;
  const famKey = CATEGORY_ALIASES[String(I.VIDEO_CATEGORY ?? '').toLowerCase()] ?? pb.family;
  const family = { ...FAMILIES[famKey] };
  const accent = I.ACCENT_COLOR ?? family.accent;

  // 2. concepts (with the playbook's title-specific variants applied)
  const concepts = JSON.parse(JSON.stringify(pb.concepts, (k, v) => v instanceof RegExp ? { __re: v.source } : v), (k, v) => v && v.__re ? new RegExp(v.__re) : v);
  for (const v of pb.variants || []) if (v.when.test(t)) for (const id of ['A', 'B', 'C']) if (v[id]) Object.assign(concepts[id], v[id]);

  // 3. ZERO's side: alternate between videos (so the feed never repeats), opposite between A and B
  const base = I.ZERO_SIDE ?? (hash(title) % 2 ? 'right' : 'left');
  const other = s => s === 'left' ? 'right' : 'left';
  const sides = { A: base, B: other(base), C: null };

  const recommended = I.RECOMMENDED ?? pb.recommend ?? 'A';
  const angles = { A: 'curiosity', B: 'consequence', C: 'scale' };
  const obj = I.MAIN_OBJECT ? OBJECTS[String(I.MAIN_OBJECT).toLowerCase()] : null;

  const variants = ['A', 'B', 'C'].map(id => {
    const c = concepts[id], angle = angles[id];
    const tx = pickText(c.text, title);
    const v = {
      id, angle, playbook: pb.id, concept: c.concept,
      family, accent, world: I.BACKGROUND_ENVIRONMENT && TWORLD_NAMES.includes(I.BACKGROUND_ENVIRONMENT) ? I.BACKGROUND_ENVIRONMENT : (c.world ?? pb.world),
      hero: c.hero, heroOpts: { ...(c.heroOpts || {}) }, worldOpts: c.worldOpts && (!c.worldWhen || c.worldWhen.test(t)) ? { ...c.worldOpts } : {},
      zero: { side: c.side ?? sides[id] ?? base, emotion: c.emotion },
      pix: { on: I.OPTIONAL_PIX === false || I.OPTIONAL_PIX === 'no' ? false : true },
      text: { lines: tx.lines, hl: tx.hl, color: TEXT_COLOR[angle] },
    };
    if (obj && ['mouth', 'pipe', 'ride', 'two', 'giant'].includes(v.hero)) v.heroOpts[{ mouth: 'obj', pipe: 'src', ride: 'src', two: 'obj', giant: 'obj' }[v.hero]] = obj;
    // fixed variables apply to the recommended concept
    if (id === recommended) {
      if (I.THUMBNAIL_TEXT) v.text.lines = Array.isArray(I.THUMBNAIL_TEXT) ? I.THUMBNAIL_TEXT : lines(I.THUMBNAIL_TEXT);
      if (I.ZERO_EMOTION && EMOTIONS.includes(I.ZERO_EMOTION)) v.zero.emotion = I.ZERO_EMOTION;
    }
    const ov = I.VARIANTS?.[id];
    if (ov) {
      if (ov.text) v.text = { ...v.text, ...(typeof ov.text === 'string' || Array.isArray(ov.text) ? { lines: Array.isArray(ov.text) ? ov.text : lines(ov.text) } : ov.text) };
      for (const k of ['hero', 'world', 'concept', 'accent']) if (ov[k]) v[k] = ov[k];
      if (ov.heroOpts) Object.assign(v.heroOpts, ov.heroOpts);
      if (ov.zero) Object.assign(v.zero, ov.zero);
      if (ov.pix != null) v.pix = typeof ov.pix === 'object' ? ov.pix : { on: !!ov.pix };
    }
    return v;
  });

  return {
    title, playbook: pb.id, category: family.name, world: pb.world, recommended,
    why: { A: 'curiosity gap: the viewer has to click to find out where it goes', B: 'the consequence lands on ZERO, so the viewer feels it', C: 'the scale is the surprise' }[recommended],
    variants,
  };
}

const TWORLD_NAMES = ['warehouse', 'hub', 'port', 'machine', 'network', 'bankhall', 'airport', 'cabin', 'supermarket', 'livingroom', 'casino', 'serverroom', 'city', 'factory', 'trading'];
