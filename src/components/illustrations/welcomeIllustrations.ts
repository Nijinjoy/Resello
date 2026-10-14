// Onboarding illustrations: soft-3D editorial scenes in the brand palette
// (see src/theme/colors.ts). Plain SVG markup rendered with SvgXml, so each
// one can be opened and edited in any SVG tool. All use a 320x320 viewBox
// with a transparent background so they sit directly on the screen.
// react-native-svg has no blur filters, so soft shadows are radial gradients.

const EMERALD = '#0E5E4E';
const EMERALD_DARK = '#0A4539';
const EMERALD_LIGHT = '#2E8A72';
const CHARCOAL = '#2B2F2E';
const OFF_WHITE = '#FAF7F2';
const SAND = '#EADFCB';
const BEIGE = '#D8C7A8';
const TAN = '#C49A6C';
const FONT = 'font-family="Helvetica, Arial, sans-serif"';

const defs = (id: string) => `
  <defs>
    <radialGradient id="${id}-shadow">
      <stop offset="0" stop-color="${CHARCOAL}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${CHARCOAL}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${EMERALD_LIGHT}"/><stop offset="1" stop-color="${EMERALD_DARK}"/>
    </linearGradient>
    <linearGradient id="${id}-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

const shadow = (id: string, cx: number, cy: number, rx: number, ry: number) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-shadow)"/>`;

// A white pill with a soft shadow, used for prices and status chips.
const pill = (
  id: string,
  x: number,
  y: number,
  w: number,
  label: string,
  color = CHARCOAL,
) => `
  ${shadow(id, x + w / 2, y + 26, w / 2 + 6, 7)}
  <rect x="${x}" y="${y}" width="${w}" height="28" rx="14" fill="#FFFFFF"/>
  <text x="${x + w / 2}" y="${
  y + 18.5
}" ${FONT} font-size="12" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>`;

const sneaker = (fill: string, stripe: string) => `
  <path d="M4 44 L4 24 Q4 16 12 15 L24 14 Q30 22 40 21 Q50 28 66 30 L92 33 Q104 35 104 43 L104 46 L4 46 Z" fill="${fill}"/>
  <path d="M22 36 Q48 40 84 37" fill="none" stroke="${stripe}" stroke-width="6" stroke-linecap="round"/>
  <rect x="0" y="44" width="108" height="10" rx="5" fill="${CHARCOAL}"/>
  <path d="M44 23 L48 19 M51 26 L55 22 M58 28 L62 24" stroke="${BEIGE}" stroke-width="2.5" stroke-linecap="round"/>`;

const headphones = (color: string) => `
  <path d="M8 46 V36 A32 32 0 0 1 72 36 V46" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
  <rect x="0" y="40" width="20" height="34" rx="10" fill="${color}"/>
  <rect x="60" y="40" width="20" height="34" rx="10" fill="${color}"/>
  <rect x="4" y="46" width="6" height="22" rx="3" fill="#FFFFFF" opacity="0.18"/>
  <rect x="64" y="46" width="6" height="22" rx="3" fill="#FFFFFF" opacity="0.18"/>`;

const handbag = () => `
  <path d="M24 26 Q46 -6 68 26" fill="none" stroke="${EMERALD_DARK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M8 26 H84 L92 80 Q92 86 86 86 H6 Q0 86 0 80 Z" fill="${TAN}"/>
  <path d="M8 26 H84 L86 44 Q46 58 6 44 Z" fill="#B0865A"/>
  <rect x="40" y="42" width="12" height="10" rx="3" fill="${EMERALD}"/>`;

export const discoverIllustration = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  ${defs('d')}
  <g>
    <circle cx="160" cy="160" r="122" fill="${SAND}" opacity="0.55"/>
    ${shadow('d', 168, 214, 54, 12)}
    <g transform="translate(168 128) rotate(-8)">
      <rect x="-38" y="-78" width="76" height="152" rx="16" fill="${CHARCOAL}"/>
      <rect x="-33" y="-73" width="66" height="142" rx="12" fill="url(#d-screen)"/>
      <rect x="-12" y="-68" width="24" height="5" rx="2.5" fill="${CHARCOAL}"/>
      <rect x="-24" y="-48" width="48" height="48" rx="10" fill="${OFF_WHITE}" opacity="0.92"/>
      <g transform="translate(-16 -36) scale(0.3)">${sneaker(
        EMERALD,
        BEIGE,
      )}</g>
      <rect x="-24" y="10" width="34" height="5" rx="2.5" fill="#FFFFFF" opacity="0.8"/>
      <rect x="-24" y="20" width="22" height="5" rx="2.5" fill="#FFFFFF" opacity="0.45"/>
      <rect x="-24" y="40" width="48" height="16" rx="8" fill="${OFF_WHITE}"/>
      <rect x="-33" y="-73" width="66" height="60" rx="12" fill="url(#d-gloss)"/>
    </g>
    ${shadow('d', 250, 254, 40, 9)}
    <g transform="translate(212 170)">${headphones(CHARCOAL)}</g>
    ${shadow('d', 84, 262, 52, 10)}
    <g transform="translate(38 172)">${handbag()}</g>
    ${shadow('d', 176, 290, 62, 10)}
    <g transform="translate(120 232)">${sneaker(OFF_WHITE, EMERALD)}</g>
    ${pill('d', 214, 82, 84, 'AED 1,299', EMERALD)}
    ${pill('d', 22, 128, 74, 'AED 349')}
  </g>
</svg>`;

export const sellIllustration = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  ${defs('s')}
  <g>
    <circle cx="160" cy="166" r="122" fill="#DCEBE5" opacity="0.7"/>
    ${shadow('s', 152, 292, 66, 12)}
    <g transform="translate(152 172)">
      <rect x="-58" y="-114" width="116" height="226" rx="22" fill="${CHARCOAL}"/>
      <rect x="-52" y="-108" width="104" height="214" rx="17" fill="${OFF_WHITE}"/>
      <rect x="-14" y="-103" width="28" height="6" rx="3" fill="${CHARCOAL}"/>
      <text x="-42" y="-78" ${FONT} font-size="10" font-weight="700" fill="${CHARCOAL}">New listing</text>
      <rect x="-42" y="-68" width="84" height="66" rx="10" fill="${SAND}"/>
      <g transform="translate(-20 -54) scale(0.5)">${headphones(CHARCOAL)}</g>
      <circle cx="30" cy="-14" r="10" fill="${EMERALD}"/>
      <path d="M24 -16 h3 l2 -3 h4 l2 3 h3 v8 h-14 z" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="31" cy="-12" r="2.2" fill="#FFFFFF"/>
      <rect x="-42" y="8" width="60" height="6" rx="3" fill="${BEIGE}"/>
      <rect x="-42" y="20" width="40" height="6" rx="3" fill="${BEIGE}" opacity="0.6"/>
      <text x="-42" y="50" ${FONT} font-size="15" font-weight="700" fill="${EMERALD}">AED 450</text>
      <rect x="-42" y="60" width="38" height="14" rx="7" fill="${SAND}"/>
      <rect x="0" y="60" width="30" height="14" rx="7" fill="${SAND}"/>
      <rect x="-42" y="80" width="84" height="20" rx="10" fill="${EMERALD}"/>
      <text x="0" y="93.5" ${FONT} font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">Post listing</text>
    </g>
    ${shadow('s', 62, 112, 26, 7)}
    <circle cx="62" cy="86" r="24" fill="${EMERALD}"/>
    <path d="M50 82 h5 l3 -5 h8 l3 5 h5 v14 h-24 z" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="62" cy="89" r="4.2" fill="none" stroke="#FFFFFF" stroke-width="2.4"/>
    ${shadow('s', 256, 128, 50, 9)}
    <rect x="206" y="72" width="100" height="54" rx="14" fill="#FFFFFF"/>
    <text x="220" y="93" ${FONT} font-size="9" fill="#6B7370">Earnings</text>
    <text x="220" y="113" ${FONT} font-size="14" font-weight="700" fill="${EMERALD}">+AED 1,250</text>
    <circle cx="290" cy="90" r="9" fill="#DCEBE5"/>
    <path d="M286 93 L290 87 L294 93" fill="none" stroke="${EMERALD}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    ${shadow('s', 258, 266, 44, 9)}
    <rect x="218" y="168" width="82" height="96" rx="14" fill="#FFFFFF"/>
    <rect x="226" y="176" width="66" height="48" rx="9" fill="${SAND}"/>
    <g transform="translate(240 186) scale(0.42)">${handbag()}</g>
    <text x="227" y="242" ${FONT} font-size="11" font-weight="700" fill="${CHARCOAL}">AED 320</text>
    <rect x="226" y="248" width="34" height="11" rx="5.5" fill="${EMERALD}"/>
    <text x="243" y="256.5" ${FONT} font-size="7" font-weight="700" fill="#FFFFFF" text-anchor="middle">SOLD</text>
    ${shadow('s', 62, 262, 46, 8)}
    <rect x="14" y="230" width="98" height="30" rx="15" fill="#FFFFFF"/>
    <circle cx="31" cy="245" r="5" fill="${EMERALD_LIGHT}"/>
    <text x="42" y="249" ${FONT} font-size="10" font-weight="700" fill="${CHARCOAL}">New offer</text>
  </g>
</svg>`;

const leaf = (
  x: number,
  y: number,
  rotate: number,
  scale: number,
  fill: string,
) =>
  `<path transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" d="M0 0 Q14 -22 0 -44 Q-14 -22 0 0Z" fill="${fill}"/>`;

export const greenerIllustration = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  ${defs('g')}
  <g>
    <circle cx="160" cy="160" r="122" fill="#DFE8DC" opacity="0.75"/>
    ${shadow('g', 70, 214, 30, 8)}
    ${leaf(70, 168, -30, 1.1, EMERALD_LIGHT)}
    ${leaf(70, 168, 10, 1.25, EMERALD)}
    ${leaf(70, 168, 45, 1, EMERALD_LIGHT)}
    <path d="M50 168 H90 L84 210 Q83 214 79 214 H61 Q57 214 56 210 Z" fill="${OFF_WHITE}"/>
    <rect x="48" y="164" width="44" height="9" rx="4.5" fill="${BEIGE}"/>
    ${shadow('g', 176, 196, 82, 12)}
    <rect x="114" y="82" width="128" height="88" rx="10" fill="${CHARCOAL}"/>
    <rect x="120" y="88" width="116" height="76" rx="6" fill="url(#g-screen)"/>
    <rect x="120" y="88" width="116" height="34" rx="6" fill="url(#g-gloss)"/>
    <path d="M100 170 H256 L264 184 Q265 188 260 188 H96 Q91 188 92 184 Z" fill="#C9CDCB"/>
    <rect x="160" y="172" width="36" height="5" rx="2.5" fill="#A9AEAC"/>
    <circle cx="178" cy="126" r="16" fill="none" stroke="${OFF_WHITE}" stroke-width="4" opacity="0.9"/>
    <path d="M170 126 L176 132 L187 120" fill="none" stroke="${OFF_WHITE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${pill('g', 190, 62, 92, 'Refurbished', EMERALD)}
    ${shadow('g', 96, 292, 62, 11)}
    <path d="M40 222 L60 206 H142 L122 222 Z" fill="#C7AC80"/>
    <rect x="40" y="222" width="82" height="66" rx="5" fill="${BEIGE}"/>
    <path d="M122 222 L142 206 V270 L122 288 Z" fill="#BFA478"/>
    <rect x="40" y="236" width="82" height="9" fill="#C7AC80"/>
    <path transform="translate(81 274)" d="M0 0 Q9 -13 0 -26 Q-9 -13 0 0Z" fill="${EMERALD}"/>
    <path d="M81 274 V258" stroke="${BEIGE}" stroke-width="1.6" stroke-linecap="round"/>
    ${shadow('g', 234, 294, 64, 11)}
    <rect x="178" y="262" width="112" height="26" rx="9" fill="${CHARCOAL}"/>
    <rect x="186" y="238" width="98" height="26" rx="9" fill="${OFF_WHITE}"/>
    <path d="M194 251 H276" stroke="${BEIGE}" stroke-width="3" stroke-dasharray="8 6"/>
    <rect x="194" y="214" width="84" height="26" rx="9" fill="${EMERALD}"/>
    <path d="M216 214 Q236 226 256 214" fill="none" stroke="${EMERALD_DARK}" stroke-width="3"/>
    ${leaf(286, 120, 30, 0.45, EMERALD_LIGHT)}
    ${leaf(30, 110, -25, 0.38, EMERALD)}
    ${leaf(160, 250, 70, 0.35, EMERALD_LIGHT)}
  </g>
</svg>`;
