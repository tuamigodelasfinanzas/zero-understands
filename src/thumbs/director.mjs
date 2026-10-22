// The Thumbnail Engine's director: from a video title (and any variables you want to fix) to three finished concepts,
// each with and without text. It takes the creative decisions in docs/miniaturas.md, in this order:
//   CATEGORY -> MAIN MYSTERY -> VISUAL METAPHOR -> LAYOUT -> ZERO EMOTION -> ZERO POSE -> MAIN OBJECT -> ENVIRONMENT
//   -> COLOR ACCENT -> THUMBNAIL TEXT -> PIX yes/no
//
//   plan({ VIDEO_TITLE: 'Why Airlines Overbook Flights' })
//   plan({ VIDEO_TOPIC, VIDEO_TITLE, CORE_QUESTION, VIDEO_CATEGORY, CORE_CONCEPT, MAIN_OBJECT, ZERO_EMOTION,
//          THUMBNAIL_TEXT, BACKGROUND_ENVIRONMENT, ACCENT_COLOR, OPTIONAL_PIX, ZERO_SIDE, RECOMMENDED, VARIANTS: { A, B, C } })
//
// Every variable is optional except the title or the topic (with only a topic, the director proposes the title with the
// thumbnail: TITLE + THUMBNAIL = ONE HOOK). A fixed variable wins over the automatic choice; THUMBNAIL_TEXT,
// ZERO_EMOTION and CORE_QUESTION apply to the recommended concept, VARIANTS.<id> overrides one concept.

// ---------- channel colour code: one accent pair per category. Accent only: it lights the important thing, it never
// paints the whole thumbnail. Worlds keep the channel's dark blue night; ZERO, the type and the layouts never change.
export const FAMILIES = {
  money: { name: 'MONEY', bg1: '#08161F', bg2: '#123B3F', wall: '#16363B', floor: '#0F2629', accent: '#2E9E5B', accent2: '#FFC93C', key: '#FFE2A6', grade: '#FFC93C' },
  finance: { name: 'FINANCE', bg1: '#081226', bg2: '#16294F', wall: '#152647', floor: '#101D38', accent: '#2E9E5B', accent2: '#2F80ED', key: '#FFE2A6', grade: '#2E9E5B' },
  tech: { name: 'TECHNOLOGY', bg1: '#070D26', bg2: '#13285C', wall: '#0E1838', floor: '#111B38', accent: '#3FD0FF', accent2: '#7B5CD6', key: '#CFE8FF', grade: '#7B5CD6' },
  business: { name: 'BUSINESS', bg1: '#0F1830', bg2: '#22385E', wall: '#22304A', floor: '#1E2436', accent: '#FF8A3D', accent2: '#2F80ED', key: '#FFE2A6', sky1: '#FF9E5E', sky2: '#4B3F8A', grade: '#FF8A3D' },
  logistics: { name: 'LOGISTICS', bg1: '#141A33', bg2: '#25304F', wall: '#25304F', floor: '#2A3048', accent: '#FF9E45', accent2: '#FFC93C', key: '#FFE2A6', grade: '#FF9E45' },
  psychology: { name: 'PSYCHOLOGY', bg1: '#170B26', bg2: '#3A1E48', wall: '#2B2240', floor: '#20192F', accent: '#FF5FA2', accent2: '#7B5CD6', key: '#FFE2A6', grade: '#FF5FA2' },
  risk: { name: 'SCAMS / RISK', bg1: '#14080C', bg2: '#3A1620', wall: '#2E1A22', floor: '#221418', accent: '#E63946', accent2: '#FF8A3D', key: '#FFE2A6', vignette: 0.78, grade: '#E63946' },
  global: { name: 'GLOBAL SYSTEMS', bg1: '#06121F', bg2: '#123049', wall: '#132A40', floor: '#0F2236', accent: '#2EC4B6', accent2: '#2F80ED', key: '#FFE2A6', grade: '#2EC4B6' },
  mystery: { name: 'HIDDEN SYSTEM', bg1: '#05060D', bg2: '#1D1A33', wall: '#1D1A33', floor: '#1A1830', accent: '#7B5CD6', accent2: '#FFC93C', key: '#FFE2A6', vignette: 0.8, grade: '#7B5CD6' },
};

// text colour by angle keeps the brand meaning of the palette: yellow = curiosity, coral = danger/consequence
const TEXT_COLOR = { curiosity: '#FFC93C', consequence: '#FF6B5B', scale: '#FFC93C' };

// ---------- what each hero is, for the engine: its master layout, whether it opens the hidden layer, the pose its
// action imposes (else ZERO's emotion decides), PIX's function in it (none = PIX never appears), how many things
// need conscious attention besides ZERO and the text, and whether the image alone already asks the question.
export const HEROES = {
  cutaway: { layout: 'discovery', hidden: true, pose: 'chasing', pixRole: 'reveal', attention: 2 },
  mouth: { layout: 'discovery', hidden: true, pose: 'chasing', pixRole: 'reveal', attention: 2 },
  ride: { layout: 'discovery', pose: 'chasing', attention: 2 },
  pipe: { layout: 'discovery', hidden: true, pixRole: 'scan', attention: 2 },
  corridor: { layout: 'scale', pixRole: 'reveal', attention: 2 },
  watcher: { layout: 'discovery', hidden: true, attention: 2, noText: true },
  two: { layout: 'discovery', anomaly: true, pixRole: 'point', attention: 2 },
  scanned: { layout: 'danger', pixRole: 'warn', attention: 2 },
  empty: { layout: 'danger', hidden: true, pixRole: 'scan', attention: 1, noText: true },
  wheel: { layout: 'danger', pose: 'chasing', attention: 2 },
  gate: { layout: 'danger', pose: 'chasing', attention: 2 },
  swarm: { layout: 'danger', attention: 2, noText: true },
  umbrella: { layout: 'danger', attention: 2 },
  stamp: { layout: 'danger', attention: 2 },
  chart: { layout: 'danger', attention: 2 },
  overload: { layout: 'danger', attention: 1, noText: true },
  hub: { layout: 'scale', pixRole: 'illuminate', attention: 1 },
  giant: { layout: 'scale', attention: 1 },
  web: { layout: 'scale', attention: 2 },
  funnel: { layout: 'scale', attention: 2 },
  beforeafter: { layout: 'beforeafter', hidden: true, pixRole: 'scan', attention: 2 },
  slices: { layout: 'beforeafter', attention: 2 },
  shrink: { layout: 'beforeafter', anomaly: true, pixRole: 'point', attention: 1 },
  machine: { layout: 'beforeafter', hidden: true, pixRole: 'scan', attention: 2 },
};

// ---------- playbooks: one per kind of system ----------
// keywords score the title/topic; each concept is a micro-story (hero), with its mystery (the one unresolved visual
// question), its world, ZERO's emotion and text options (first whose `when` matches the title wins; `hl` = the
// highlighted line). `titles`: proposed when only the topic is given, written to pair with the A image.
const T = (lines, when, hl) => ({ lines, when, hl });
export const PLAYBOOKS = [
  {
    id: 'package', family: 'logistics', world: 'warehouse',
    keywords: ['amazon', 'buy online', 'click buy', 'online shopping', 'package', 'packages', 'parcel', 'delivery', 'deliver', 'delivered', 'shipping', 'shipped', 'warehouse', 'fulfillment', 'courier', 'ups', 'fedex', 'dhl', 'usps', 'mail', 'postal', 'returns', 'return', 'prime', 'next day', 'same day', 'logistics', 'order', 'online order'],
    titles: ['Where Your Package Goes While You Sleep', 'What Happens After You Click "Buy"'],
    concepts: {
      A: { hero: 'cutaway', emotion: 'surprised', mystery: 'What happens to that box inside there, overnight?', concept: 'ZERO has just put the yellow box on the belt; it shoots off into a wall cut open on an enormous hidden machine (scan, sort, routes, docks, a door onto the dawn). 11:47 PM on the clock', worldOpts: { clock: [11, 47] }, worldWhen: /sleep|night|overnight|morning/, text: [T(['BY', 'MORNING?'], /sleep|night|overnight|morning/), T(['HOW?!'], /fast|quick|so fast|speed/), T(['WHERE DOES', 'IT GO?'])] },
      B: { hero: 'scanned', emotion: 'shocked', mystery: 'Why is ZERO himself on the sorter, with a label?', concept: 'ZERO himself on the sorter, label on his chest, under the red scanner', text: [T(['NO ONE', 'SLEEPS'], /sleep|night|overnight/), T(['IT NEVER', 'STOPS'])] },
      C: { hero: 'hub', world: 'hub', emotion: 'impressed', side: 'right', mystery: 'How does one building move all this in one night?', concept: 'From a catwalk: endless belts, thousands of parcels, a plane at the door', text: [T(['ALL THIS IN', 'ONE NIGHT?'], /sleep|night|overnight/), T(['THIS IS', 'ONE BUILDING'])] },
    },
    recommend: 'A',
  },
  {
    id: 'card', family: 'money', world: 'network',
    keywords: ['credit card', 'debit card', 'card', 'cards', 'pay by card', 'payment', 'payments', 'contactless', 'tap', 'visa', 'mastercard', 'transaction', 'swipe', 'chip', 'checkout', 'apple pay', 'fees', 'fee', 'cashback', 'points'],
    titles: ['What Really Happens When You Tap Your Card', 'Who Gets Paid When You Pay by Card'],
    concepts: {
      A: { hero: 'cutaway', world: 'network', emotion: 'surprised', mystery: 'Where does the payment go behind the terminal?', concept: 'ZERO taps; his card shoots along a light rail into a wall cut open on the payment network: cables branching to everywhere, servers, an eye at the back', heroOpts: { interior: 'tech', obj: 'card' }, text: [T(['WHERE DOES', 'IT GO?']), T(['WHO ELSE', 'GETS PAID?'])] },
      B: { hero: 'beforeafter', emotion: 'surprised', mystery: 'A full coin goes in; less comes out the other side. Where is the rest?', concept: 'His money goes into the payment machine whole and comes out smaller; pipes carry the difference away', text: [T(['WHO TAKES', 'A CUT?'])] },
      C: { hero: 'web', emotion: 'impressed', mystery: 'Why does one coffee light up a whole planet of banks?', concept: 'One terminal, one coffee, a whole planet of banks lighting up', text: [T(['ALL THIS FOR', 'A COFFEE?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'bank', family: 'finance', world: 'bankhall',
    keywords: ['bank', 'banks', 'banking', 'savings', 'deposit', 'vault', 'fractional', 'reserve', 'account', 'money creation', 'cash', 'atm', 'central bank', 'printing money', 'interest rate'],
    titles: ['Where Your Money Goes When You Deposit It', 'Why Banks Don\'t Keep Your Money'],
    concepts: {
      A: { hero: 'cutaway', emotion: 'suspicious', mystery: 'His deposit goes in, and pipes take it everywhere except the vault', concept: 'ZERO\'s cash slides into the deposit slot of a bank wall cut open: glass pipes carry it up, away, to houses and other banks; only a trickle reaches the vault', heroOpts: { interior: 'money', obj: 'cash' }, text: [T(['WAIT...', 'WHERE?']), T(['WHERE IS', 'MY MONEY?'])] },
      B: { hero: 'empty', emotion: 'shocked', mystery: 'The vault is open, and it is almost empty', concept: 'ZERO opens the vault: it is almost empty', text: [T(['IT\'S NOT', 'IN HERE'])] },
      C: { hero: 'machine', emotion: 'suspicious', mystery: 'One coin goes in, a flood of money comes out. How?', concept: 'One coin goes in, a flood of money comes out', text: [T(['MONEY FROM', 'NOTHING?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'debt', family: 'finance', world: 'city',
    keywords: ['debt', 'loan', 'loans', 'mortgage', 'interest', 'credit score', 'payday', 'student loan', 'student loans', 'minimum payment', 'borrow', 'bnpl', 'buy now pay later', 'rent'],
    titles: ['Why Debt Never Seems to End', 'Who Really Profits From Your Loan'],
    concepts: {
      A: { hero: 'wheel', emotion: 'tired', mystery: 'Who is ZERO\'s running actually powering?', concept: 'ZERO runs in a hamster wheel that drives the bank\'s machine', heroOpts: { sink: 'bank' }, text: [T(['WHO IS THIS', 'FOR?']), T(['WHY IT', 'NEVER ENDS'])] },
      B: { hero: 'funnel', emotion: 'worried', mystery: 'Why does every house pay into the same tower?', concept: 'Every house pays a little stream into one tower', heroOpts: { src: 'house', sink: 'tower' }, text: [T(['YOU PAY', 'TWICE'])] },
      C: { hero: 'giant', emotion: 'shocked', mystery: 'How did a signature get this big?', concept: 'The contract he signed, taller than a building', heroOpts: { obj: 'contract', h: 700 }, text: [T(['YOU SIGNED', 'THIS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'airline', family: 'business', world: 'airport',
    keywords: ['airline', 'airlines', 'flight', 'flights', 'plane', 'planes', 'airport', 'airports', 'overbook', 'overbooked', 'overbooking', 'ticket', 'tickets', 'seat', 'seats', 'boarding', 'luggage', 'baggage', 'pilot', 'airfare', 'fly', 'flying', 'jet lag', 'travel'],
    titles: ['Why Airlines Overbook Flights', 'Why Airlines Sell More Seats Than They Have'],
    concepts: {
      A: { hero: 'two', emotion: 'suspicious', mystery: 'Two boarding passes for one seat. How?', concept: 'Two boarding passes, one seat', text: [T(['WAIT...', 'TWO?'])] },
      B: { hero: 'gate', emotion: 'scared', mystery: 'He has a ticket, so why is the door closing on him?', concept: 'ZERO runs with his suitcase while the door closes', text: [T(['BUT I', 'PAID!']), T(['NO SEAT', 'FOR YOU'])] },
      C: { hero: 'corridor', world: 'cabin', emotion: 'impressed', mystery: 'A plane full to the last seat, and still selling', concept: 'A plane full to the last seat', heroOpts: { item: 'seats', vx: 820, vy: 340 }, text: [T(['THEY DO THIS', 'ON PURPOSE'], /overbook/), T(['EVERY SEAT', 'IS SOLD TWICE'], /overbook/), T(['SOLD', 'TWICE?'], /overbook/), T(['EVERY SEAT', 'COUNTS'])] },
    },
    variants: [{ when: /price|cheap|expensive|cost|fare|pay more/, A: { hero: 'two', heroOpts: { obj: 'tag' }, text: [T(['SAME', 'SEAT?'])] } }],
    recommend: 'A',
  },
  {
    id: 'supermarket', family: 'psychology', world: 'supermarket',
    keywords: ['supermarket', 'supermarkets', 'grocery', 'groceries', 'store', 'stores', 'aisle', 'milk', 'layout', 'walmart', 'costco', 'mall', 'impulse', 'checkout', 'discount', 'sale', 'coupon', 'loyalty', 'shopping', 'shop', 'retail'],
    titles: ['What Supermarkets Don\'t Want You to Notice', 'Why the Milk Is Always at the Back'],
    concepts: {
      A: { hero: 'cutaway', emotion: 'suspicious', mystery: 'What happens behind the STAFF ONLY curtain?', concept: 'His shopping rides the checkout belt through the curtain into the back of the shop, cut open: stock racks, a pricing machine printing new tags, a map tracking every shopper', heroOpts: { interior: 'retail' }, text: [T(['NOTHING IS', 'RANDOM']), T(['THEY', 'KNEW'])] },
      B: { hero: 'overload', emotion: 'confused', mystery: 'He came for one thing. How did the cart become a tower?', concept: 'ZERO came for one thing; his cart is a tower', text: [T(['YOU DIDN\'T', 'NEED THIS'])] },
      C: { hero: 'corridor', emotion: 'confused', mystery: 'Why is the milk at the far end of an endless aisle?', concept: 'The milk glows at the far end of an endless aisle', heroOpts: { item: 'shelves', end: 'milk' }, text: [T(['WHY SO', 'FAR?'], /milk|back|layout|walk/), T(['IT\'S A', 'MAZE'])] },
    },
    recommend: 'A',
  },
  {
    id: 'subscription', family: 'psychology', world: 'livingroom',
    keywords: ['subscription', 'subscriptions', 'netflix', 'spotify', 'streaming', 'recurring', 'membership', 'memberships', 'cancel', 'free trial', 'saas', 'gym', 'auto-renew', 'renew', 'monthly'],
    titles: ['Why It\'s So Hard to Cancel a Subscription', 'How "Only $9.99" Takes Your Money'],
    concepts: {
      A: { hero: 'corridor', world: 'machine', emotion: 'confused', mystery: 'Why is CANCEL the last door of an endless corridor?', concept: 'The CANCEL door at the end of a corridor of doors', heroOpts: { item: 'doors', end: 'exit', sign: 'CANCEL' }, text: [T(['TRY TO', 'CANCEL'])] },
      B: { hero: 'swarm', emotion: 'worried', mystery: 'Every app has a tube into his wallet. Since when?', concept: 'Every app has a tube into his wallet', text: [T(['YOU NEVER', 'STOP PAYING'])] },
      C: { hero: 'giant', emotion: 'shocked', mystery: 'How long is a year of "only $9.99"?', concept: 'One year of "only $9.99", printed', heroOpts: { obj: 'receipt', h: 760 }, text: [T(['IT ADDS', 'UP'])] },
    },
    variants: [{ when: /artist|royalt|creator|payout|pays|get paid/, recommend: 'A', A: { hero: 'beforeafter', emotion: 'surprised', mystery: 'A whole subscription goes in; a tiny coin comes out for the artist. Where is the rest?', concept: 'His subscription money goes into the machine whole; a tiny coin comes out the other side for the artist', text: [T(['THAT\'S', 'ALL?']), T(['WHO GETS', 'THE REST?'])] } }],
    recommend: 'B',
  },
  {
    id: 'insurance', family: 'finance', world: 'city',
    keywords: ['insurance', 'insure', 'insurer', 'insurers', 'premium', 'premiums', 'coverage', 'claim', 'claims', 'deductible', 'warranty', 'policy'],
    titles: ['How Insurance Companies Really Make Money', 'Who Insurance Actually Protects'],
    concepts: {
      A: { hero: 'umbrella', emotion: 'confused', mystery: 'Why is his umbrella full of holes while the tower stays dry?', concept: 'An umbrella full of holes; the coins flow to a dry tower', text: [T(['WHO\'S', 'PROTECTED?'])] },
      B: { hero: 'stamp', emotion: 'shocked', mystery: 'Why is the stamp coming down on his claim?', concept: 'A giant stamp comes down on his claim', text: [T(['CLAIM', 'DENIED?'])] },
      C: { hero: 'funnel', emotion: 'impressed', mystery: 'A whole city pays in. Where does it all go?', concept: 'A whole city pays little streams into one tower', heroOpts: { src: 'house', sink: 'tower' }, text: [T(['WHERE DOES', 'IT GO?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'casino', family: 'psychology', world: 'casino',
    keywords: ['casino', 'casinos', 'gambling', 'gamble', 'slot', 'slots', 'lottery', 'betting', 'bet', 'bets', 'poker', 'roulette', 'house edge', 'sports betting', 'vegas', 'jackpot', 'loot box'],
    titles: ['How Casinos Make Sure They Always Win', 'Why Casinos Have No Clocks'],
    concepts: {
      A: { hero: 'pipe', emotion: 'suspicious', mystery: 'What is the pipe behind the slot machine for?', concept: 'Behind the slot machine, a pipe to the casino vault', heroOpts: { src: 'slot', srcH: 300, sink: 'vault' }, text: [T(['THE HOUSE', 'KNOWS'])] },
      B: { hero: 'funnel', emotion: 'sad', mystery: 'Every player pours into one machine. Who empties it?', concept: 'Every player pours into one machine', heroOpts: { src: 'person', sink: 'slot', sinkH: 400 }, text: [T(['YOU WERE', 'NEVER WINNING']), T(['THE HOUSE', 'WINS'])] },
      C: { hero: 'corridor', emotion: 'impressed', mystery: 'Endless machines, and not one clock or window. Why?', concept: 'Endless rows of machines; no clocks, no windows', heroOpts: { item: 'slots' }, text: [T(['NO CLOCKS.', 'NO WINDOWS.'])] },
    },
    recommend: 'A',
  },
  {
    id: 'tech', family: 'tech', world: 'serverroom',
    keywords: ['free', 'app', 'apps', 'photo', 'photos', 'upload', 'uploads', 'video', 'videos', 'data', 'privacy', 'tracking', 'tracked', 'algorithm', 'algorithms', 'social media', 'tiktok', 'instagram', 'facebook', 'google', 'youtube', 'cookies', 'internet', 'cloud', 'server', 'servers', 'ai', 'chatgpt', 'wifi', 'email', 'website', 'online', 'phone', 'smartphone', 'ads', 'advertising', 'targeted'],
    titles: ['Where Your Photos Go When You Upload Them', 'How Free Apps Really Make Money'],
    concepts: {
      A: { hero: 'cutaway', emotion: 'suspicious', mystery: 'Where does what he uploads go, and who is watching it?', concept: 'His upload rides a rail of light into a wall cut open on the internet: server rows, cables to everywhere, and a giant eye at the back', heroOpts: { interior: 'tech' }, text: [T(['WHO\'S', 'WATCHING?']), T(['IT NEVER', 'FORGETS'])] },
      B: { hero: 'scanned', emotion: 'shocked', mystery: 'Why does ZERO have a barcode on his chest?', concept: 'ZERO on the belt with a barcode: he is what is being sold', heroOpts: { laser: '#3FD0FF' }, text: [T(['YOU ARE THE', 'PRODUCT'], /free|ads|advertis|social|google|facebook|instagram|tiktok/), T(['YOU\'RE', 'NEXT'])] },
      C: { hero: 'corridor', emotion: 'impressed', mystery: 'An endless hall of servers. For what?', concept: 'An endless hall of servers', heroOpts: { item: 'servers' }, text: [T(['IT\'S NOT', 'A CLOUD'], /cloud|internet|server|email|data/), T(['IT NEVER', 'FORGETS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'price', family: 'business', world: 'supermarket',
    keywords: ['price', 'prices', 'cost', 'costs', 'expensive', 'inflation', 'markup', 'margin', 'profit', 'worth', 'pay more', 'shrinkflation', 'why does', 'cost so much', 'so expensive', 'overpriced'],
    titles: ['Why Everything Costs So Much', 'Where Your Money Goes When You Buy Something'],
    concepts: {
      A: { hero: 'slices', emotion: 'confused', mystery: 'Who are the strangers carrying off slices of the price?', concept: 'The price is cut into slices that strangers carry off', text: [T(['WHO GETS', 'THE MONEY?'])] },
      B: { hero: 'shrink', emotion: 'suspicious', mystery: 'Same box, same price. Where did the inside go?', concept: 'Same box, same price, almost nothing inside', text: [T(['SAME PRICE.', 'LESS.'])] },
      C: { hero: 'giant', emotion: 'shocked', mystery: 'How did the price tag get bigger than the shop?', concept: 'A price tag the size of a building', heroOpts: { obj: 'tag', h: 360, x: 820 }, text: [T(['WHY THIS', 'MUCH?']), T(['WHO DECIDED', 'THIS?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'cheap', family: 'global', world: 'factory',
    keywords: ['temu', 'shein', 'aliexpress', 'ikea', 'so cheap', 'cheap', 'cheaper', 'dollar store', 'made in china', 'factory', 'factories', 'supply chain', 'container', 'containers', 'port', 'ports', 'fast fashion', 'manufacturing', 'dropshipping', 'wholesale', 'cargo', 'ship', 'ships'],
    titles: ['How Temu Is So Cheap', 'Why Everything Is Made So Far Away'],
    concepts: {
      A: { hero: 'machine', emotion: 'suspicious', mystery: 'Raw stuff in, a flood of $1 products out. How?', concept: 'Raw stuff in, a flood of products with a $1 tag out', heroOpts: { input: 'raw', output: 'products', price: '$1' }, text: [T(['HOW IS IT', 'SO CHEAP?']), T(['BUT...', 'HOW?'])] },
      B: { hero: 'slices', emotion: 'worried', mystery: 'Who pays the part of the price that never arrives?', concept: 'The price is cut up before it reaches the person who made it', text: [T(['WHO PAYS', 'THE REST?'])] },
      C: { hero: 'giant', world: 'port', emotion: 'impressed', mystery: 'One ship bigger than the port. How many of these are there?', concept: 'One container ship, bigger than the port', heroOpts: { obj: 'ship', h: 330, x: 820 }, text: [T(['THIS IS', 'ONE SHIP'])] },
    },
    recommend: 'A',
  },
  {
    id: 'invest', family: 'finance', world: 'trading',
    keywords: ['stock', 'stocks', 'stock market', 'invest', 'investing', 'investor', 'investors', 'shares', 'wall street', 'index fund', 'etf', 'crypto', 'bitcoin', 'trading', 'trader', 'hedge fund', 'market crash', 'crash', 'bubble', 'retirement', '401k', 'pension'],
    titles: ['Who Really Sets Stock Prices', 'Why Most Investors Lose Money'],
    concepts: {
      A: { hero: 'chart', layout: 'discovery', emotion: 'suspicious', mystery: 'Whose hand is drawing the line he stands on?', concept: 'A giant pen in the dark is drawing the line he stands on', heroOpts: { mode: 'pen' }, text: [T(['WHO SETS', 'THE PRICE?'])] },
      B: { hero: 'chart', emotion: 'scared', mystery: 'One step from the edge. Who is on the other side?', concept: 'One step from the edge of the chart', heroOpts: { mode: 'cliff' }, text: [T(['WHO', 'LOSES?'])] },
      C: { hero: 'giant', emotion: 'impressed', mystery: 'A wall of screens taller than a building. Who watches all this?', concept: 'A wall of screens taller than a building, all moving', heroOpts: { obj: 'screenwall', h: 660 }, text: [T(['IT NEVER', 'SLEEPS'])] },
    },
    recommend: 'A',
  },
  {
    id: 'tax', family: 'money', world: 'city',
    keywords: ['tax', 'taxes', 'irs', 'paycheck', 'salary', 'income', 'payroll', 'refund', 'tax return', 'vat', 'tariff', 'tariffs'],
    titles: ['Where Your Taxes Actually Go', 'Why Your Paycheck Is Smaller Than Your Salary'],
    concepts: {
      A: { hero: 'beforeafter', emotion: 'surprised', mystery: 'A big paycheck goes in, a small one comes out. Where is the rest?', concept: 'His paycheck goes into the machine big and comes out small; pipes carry the rest away', text: [T(['WHERE DOES', 'IT GO?']), T(['WAIT...', 'THAT\'S IT?'])] },
      B: { hero: 'funnel', emotion: 'worried', mystery: 'Every house sends a stream to one building. Then what?', concept: 'Every house sends a stream to one building', heroOpts: { src: 'house', sink: 'gov', sinkH: 360, sign: 'TAX OFFICE' }, text: [T(['YOU PAY', 'FIRST'])] },
      C: { hero: 'giant', emotion: 'shocked', mystery: 'Who could ever read a rule book this tall?', concept: 'The rule book, taller than a building', heroOpts: { obj: 'contract', h: 700 }, text: [T(['WHO READS', 'THIS?'])] },
    },
    recommend: 'A',
  },
  {
    id: 'mystery', family: 'mystery', world: 'machine', fallback: true,
    keywords: ['hidden', 'secret', 'really', 'actually', 'behind', 'inside', 'system', 'how does', 'how do', 'what happens', 'where does', 'why do', 'why does'],
    titles: [],
    concepts: {
      A: { hero: 'mouth', emotion: 'curious', mystery: 'What is inside the mouth of the system?', concept: 'The thing we follow disappears into the mouth of the system', text: [T(['WHAT\'S', 'INSIDE?'])] },
      B: { hero: 'scanned', emotion: 'shocked', mystery: 'Why is ZERO labelled inside the system?', concept: 'ZERO is inside the system, labelled', text: [T(['YOU\'RE PART', 'OF IT'])] },
      C: { hero: 'machine', emotion: 'impressed', mystery: 'Why is the machine so much bigger than it should be?', concept: 'A machine much bigger than it should be', text: [T(['IT\'S', 'EVERYWHERE'])] },
    },
    recommend: 'A',
  },
];

// MAIN_OBJECT words -> kit objects the heroes understand
const OBJECTS = { package: 'box', parcel: 'box', box: 'box', card: 'card', 'credit card': 'card', coin: 'coin', money: 'cash', cash: 'cash', ticket: 'ticket', phone: 'phone', cart: 'cart', terminal: 'terminal', price: 'tag', tag: 'tag', slot: 'slot', seat: 'seat', suitcase: 'suitcase', bank: 'bank', house: 'house', receipt: 'receipt', wallet: 'wallet', tv: 'screen', screen: 'screen', vault: 'vault', paycheck: 'paycheck', coffee: 'cup', milk: 'milk', ship: 'ship', contract: 'contract', product: 'product' };
// the twelve master poses (compose.js) and the words that mean them
export const POSES = ['curious', 'confused', 'shocked', 'suspicious', 'worried', 'mindblown', 'thinking', 'discovery', 'lookingup', 'pointing', 'chasing', 'waitwhat'];
const POSE_ALIASES = { surprised: 'waitwhat', impressed: 'lookingup', realizing: 'discovery', sad: 'worried', scared: 'worried', tired: 'worried', angry: 'suspicious', 'mind blown': 'mindblown', 'looking up': 'lookingup', running: 'chasing', 'wait what': 'waitwhat', 'happy discovery': 'discovery' };
const poseName = p => POSES.includes(p) ? p : POSE_ALIASES[p] ?? 'curious';
const CATEGORY_ALIASES = { money: 'money', finance: 'finance', banking: 'finance', investing: 'finance', tech: 'tech', technology: 'tech', internet: 'tech', business: 'business', companies: 'business', logistics: 'logistics', psychology: 'psychology', marketing: 'psychology', scams: 'risk', scam: 'risk', risk: 'risk', fraud: 'risk', global: 'global', world: 'global', trade: 'global', shipping: 'global', mystery: 'mystery', hidden: 'mystery' };
const HERO_HAS_OBJ = { mouth: 'obj', cutaway: 'obj', pipe: 'src', ride: 'src', two: 'obj', giant: 'obj', beforeafter: 'in' };

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

// TITLE + THUMBNAIL = ONE HOOK: the text must add what the title doesn't say, never repeat it
const STOP = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'of', 'for', 'you', 'your', 'in', 'on', 'this', 'that', 'and', 'why', 'how', 'what', 'who', 'where', 'do', 'does']);
function echoes(lines, title) {
  const tw = new Set(norm(title).trim().split(' '));
  const words = norm(lines.join(' ')).trim().split(' ').filter(w => !STOP.has(w));
  if (!words.length) return false;
  return words.filter(w => tw.has(w)).length / words.length >= 0.6;
}
// every text option that fits this title and doesn't echo it, best first (the engine tries the next one if a
// thumbnail scores low on mobile readability)
function textOptions(options, title) {
  const t = norm(title);
  const ok = options.filter(o => !o.when || o.when.test(t));
  const fresh = ok.filter(o => !echoes(o.lines, title));
  return (fresh.length ? fresh : ok.length ? ok : [options[options.length - 1]]).map(o => ({ lines: o.lines, hl: o.hl }));
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
  const topic = I.VIDEO_TOPIC ?? '';
  if (!(I.VIDEO_TITLE ?? I.title) && !topic) throw new Error('VIDEO_TITLE (or VIDEO_TOPIC) is required');
  const probe = norm(I.VIDEO_TITLE ?? I.title ?? topic), extra = norm([topic, I.CORE_QUESTION, I.CORE_CONCEPT, I.MAIN_OBJECT, I.BACKGROUND_ENVIRONMENT].join(' '));

  // 1. category + playbook
  const ranked = PLAYBOOKS.map(pb => ({ pb, sc: score(pb, probe, extra) })).sort((a, b) => b.sc - a.sc);
  let pb = ranked[0].sc > 0 ? ranked[0].pb : PLAYBOOKS.find(p => p.fallback);
  if (I.PLAYBOOK) pb = PLAYBOOKS.find(p => p.id === I.PLAYBOOK) ?? pb;
  // only a topic: the title is proposed together with the thumbnail (one hook)
  const title = I.VIDEO_TITLE ?? I.title ?? pb.titles?.[0] ?? topic;
  const titleProposed = !(I.VIDEO_TITLE ?? I.title);
  const t = norm(title);
  const famKey = CATEGORY_ALIASES[String(I.VIDEO_CATEGORY ?? '').toLowerCase()] ?? pb.family;
  const family = { ...FAMILIES[famKey] };
  const accent = I.ACCENT_COLOR ?? family.accent;

  // 2. concepts (with the playbook's title-specific variants applied)
  const concepts = JSON.parse(JSON.stringify(pb.concepts, (k, v) => v instanceof RegExp ? { __re: v.source } : v), (k, v) => v && v.__re ? new RegExp(v.__re) : v);
  let pbRecommend = pb.recommend;
  for (const v of pb.variants || []) if (v.when.test(t)) { for (const id of ['A', 'B', 'C']) if (v[id]) Object.assign(concepts[id], v[id]); if (v.recommend) pbRecommend = v.recommend; }

  // 3. ZERO's side: alternate between videos (so the feed never repeats), opposite between A and B
  const base = I.ZERO_SIDE ?? (hash(title) % 2 ? 'right' : 'left');
  const other = s => s === 'left' ? 'right' : 'left';
  const sides = { A: base, B: other(base), C: null };

  const recommended = I.RECOMMENDED ?? pbRecommend ?? 'A';
  const angles = { A: 'curiosity', B: 'consequence', C: 'scale' };
  const obj = I.MAIN_OBJECT ? OBJECTS[String(I.MAIN_OBJECT).toLowerCase()] : null;
  const pixOff = I.OPTIONAL_PIX === false || I.OPTIONAL_PIX === 'no';
  // PIX is special: at most one concept per video has him (about a third of the thumbnails), only where he has a job
  // (revealing, scanning, warning...), and the recommended concept gets first call on him
  const pixConcept = pixOff ? null : [recommended, ...['A', 'B', 'C'].filter(x => x !== recommended)].find(id => HEROES[concepts[id].hero]?.pixRole && ['discovery', 'danger', 'beforeafter'].includes(concepts[id].layout ?? HEROES[concepts[id].hero].layout));

  const variants = ['A', 'B', 'C'].map(id => {
    const c = concepts[id], angle = angles[id], meta = { ...(HEROES[c.hero] || {}) };
    const opts = textOptions(c.text, title);
    const v = {
      id, angle, playbook: pb.id, concept: c.concept,
      // the decisions, in the order of docs/miniaturas.md
      category: family.name,
      mystery: (id === recommended && I.CORE_QUESTION) || c.mystery,
      metaphor: c.concept,
      layout: c.layout ?? meta.layout ?? 'discovery',
      zero: { side: c.side ?? sides[id] ?? base, emotion: poseName(c.emotion) },
      mainObject: c.heroOpts?.obj ?? c.heroOpts?.src ?? c.heroOpts?.in ?? null,
      world: I.BACKGROUND_ENVIRONMENT && TWORLD_NAMES.includes(I.BACKGROUND_ENVIRONMENT) ? I.BACKGROUND_ENVIRONMENT : (c.world ?? pb.world),
      accent, family,
      text: { lines: opts[0].lines, hl: opts[0].hl, color: TEXT_COLOR[angle] },
      textOptions: opts,
      pix: { on: id === pixConcept, role: meta.pixRole ?? null },
      hero: c.hero, heroOpts: { ...(c.heroOpts || {}) }, worldOpts: c.worldOpts && (!c.worldWhen || c.worldWhen.test(t)) ? { ...c.worldOpts } : {},
      meta,
    };
    if (obj && HERO_HAS_OBJ[v.hero]) { v.heroOpts[HERO_HAS_OBJ[v.hero]] = obj; v.mainObject = obj; }
    // fixed variables apply to the recommended concept
    if (id === recommended) {
      if (I.THUMBNAIL_TEXT) { v.text.lines = Array.isArray(I.THUMBNAIL_TEXT) ? I.THUMBNAIL_TEXT : lines(I.THUMBNAIL_TEXT); v.textOptions = [{ lines: v.text.lines }]; }
      if (I.ZERO_EMOTION) v.zero.emotion = poseName(I.ZERO_EMOTION);
    }
    const ov = I.VARIANTS?.[id];
    if (ov) {
      if (ov.text) { v.text = { ...v.text, ...(typeof ov.text === 'string' || Array.isArray(ov.text) ? { lines: Array.isArray(ov.text) ? ov.text : lines(ov.text) } : ov.text) }; v.textOptions = [{ lines: v.text.lines, hl: v.text.hl }]; }
      for (const k of ['hero', 'world', 'concept', 'accent', 'mystery', 'layout']) if (ov[k]) v[k] = ov[k];
      if (ov.hero) v.meta = { ...(HEROES[ov.hero] || {}) };
      if (ov.heroOpts) Object.assign(v.heroOpts, ov.heroOpts);
      if (ov.zero) Object.assign(v.zero, ov.zero, ov.zero.emotion ? { emotion: poseName(ov.zero.emotion) } : {});
      if (ov.pix != null) v.pix = typeof ov.pix === 'object' ? { role: v.meta.pixRole, ...ov.pix } : { on: !!ov.pix, role: v.meta.pixRole };
    }
    v.zero.pose = v.meta.pose ?? v.zero.emotion;               // the story's action wins over the emotion
    v.echo = echoes(v.text.lines, title);
    v.hook = { title, image: v.mystery, text: v.text.lines.join(' ') };
    return v;
  });

  return {
    title, titleProposed, titleOptions: titleProposed ? pb.titles : undefined, coreQuestion: I.CORE_QUESTION ?? variants.find(v => v.id === recommended).mystery,
    playbook: pb.id, category: family.name, world: pb.world, recommended,
    why: { A: 'curiosity gap: the viewer has to click to find out what happens inside', B: 'the consequence lands on ZERO, so the viewer feels it', C: 'the scale is the surprise' }[recommended],
    variants,
  };
}

const TWORLD_NAMES = ['warehouse', 'hub', 'port', 'machine', 'network', 'bankhall', 'airport', 'cabin', 'supermarket', 'livingroom', 'casino', 'serverroom', 'city', 'factory', 'trading'];
