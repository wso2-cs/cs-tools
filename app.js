/* ── Tab navigation ── */
function navigateToTab(tabId) {
  document.querySelectorAll('nav button[data-tab]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const navBtn = document.querySelector(`nav button[data-tab="${tabId}"]`);
  if (navBtn) {
    navBtn.classList.add('active');
    navBtn.closest('.nav-category')?.classList.add('open');
  }
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector('.content').scrollTop = 0;
}

document.querySelectorAll('nav button[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => navigateToTab(btn.dataset.tab));
});

// Homepage card navigation
document.querySelectorAll('.home-card[data-tab]').forEach(card => {
  card.addEventListener('click', () => navigateToTab(card.dataset.tab));
});

// Click header to return to homepage
function showHome() {
  document.querySelectorAll('nav button[data-tab]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-home').classList.add('active');
  document.querySelector('.content').scrollTop = 0;
}
document.querySelector('header h1').style.cursor = 'pointer';
document.querySelector('header h1').addEventListener('click', showHome);
document.querySelector('header img').style.cursor = 'pointer';
document.querySelector('header img').addEventListener('click', showHome);

function toggleCategory(headerBtn) {
  headerBtn.closest('.nav-category').classList.toggle('open');
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

/* ── Helpers ── */
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearIO(inId, outId, errId) {
  document.getElementById(inId).value = '';
  document.getElementById(outId).value = '';
  document.getElementById(inId).classList.remove('error');
  if (errId) setError(errId, '');
}

function swapIO(srcId, destId) {
  const src = document.getElementById(srcId);
  const dest = document.getElementById(destId);
  dest.value = src.value;
  src.value = '';
}

function copyText(id, isPre) {
  const el = document.getElementById(id);
  const text = isPre ? el.textContent : el.value;
  if (!text.trim()) { showToast('Nothing to copy'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
}

/* ── Unicode-safe Base64 ── */
function toBase64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

function fromBase64(b64) {
  const raw = atob(b64);
  const bytes = new Uint8Array([...raw].map(c => c.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}

/* ── Base64 Encode ── */
function b64Encode() {
  const input = document.getElementById('b64enc-in');
  const output = document.getElementById('b64enc-out');
  setError('b64enc-err', '');
  input.classList.remove('error');
  if (!input.value.trim()) { setError('b64enc-err', 'Please enter some text to encode.'); input.classList.add('error'); return; }
  try {
    output.value = toBase64(input.value);
  } catch (e) {
    setError('b64enc-err', 'Encoding failed: ' + e.message);
    input.classList.add('error');
  }
}

/* ── Base64 Decode ── */
function b64Decode() {
  const input = document.getElementById('b64dec-in');
  const output = document.getElementById('b64dec-out');
  setError('b64dec-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('b64dec-err', 'Please enter a Base64 string to decode.'); input.classList.add('error'); return; }
  try {
    output.value = fromBase64(val);
  } catch (e) {
    setError('b64dec-err', 'Invalid Base64 string. Please check your input.');
    input.classList.add('error');
    output.value = '';
  }
}

/* ── HTML Encode ── */
function htmlEncode() {
  const input = document.getElementById('htmlenc-in');
  const output = document.getElementById('htmlenc-out');
  setError('htmlenc-err', '');
  input.classList.remove('error');
  if (!input.value.trim()) { setError('htmlenc-err', 'Please enter some text to encode.'); input.classList.add('error'); return; }
  output.value = input.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── HTML Decode ── */
function htmlDecode() {
  const input = document.getElementById('htmldec-in');
  const output = document.getElementById('htmldec-out');
  setError('htmldec-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('htmldec-err', 'Please enter an HTML-encoded string to decode.'); input.classList.add('error'); return; }
  const txt = document.createElement('textarea');
  txt.innerHTML = val;
  output.value = txt.value;
}

/* ── URL Encode ── */
function urlEncode() {
  const input = document.getElementById('urlenc-in');
  const output = document.getElementById('urlenc-out');
  setError('urlenc-err', '');
  input.classList.remove('error');
  if (!input.value.trim()) { setError('urlenc-err', 'Please enter text to encode.'); input.classList.add('error'); return; }
  output.value = encodeURIComponent(input.value).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

/* ── URL Decode ── */
function urlDecode() {
  const input = document.getElementById('urldec-in');
  const output = document.getElementById('urldec-out');
  setError('urldec-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('urldec-err', 'Please enter a URL-encoded string to decode.'); input.classList.add('error'); return; }
  try {
    output.value = decodeURIComponent(val);
  } catch (e) {
    setError('urldec-err', 'Invalid URL-encoded string. Please check your input.');
    input.classList.add('error');
    output.value = '';
  }
}

/* ── JWT Decode ── */
function b64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return fromBase64(str);
}

function jwtDecode() {
  const input = document.getElementById('jwt-in');
  setError('jwt-err', '');
  input.classList.remove('error');
  document.getElementById('jwt-panels').style.display = 'none';
  document.getElementById('jwt-status').style.display = 'none';

  const token = input.value.trim();
  if (!token) { setError('jwt-err', 'Please paste a JWT token.'); input.classList.add('error'); return; }

  const parts = token.split('.');
  if (parts.length !== 3) {
    setError('jwt-err', 'Invalid JWT: expected 3 parts separated by dots.');
    input.classList.add('error');
    return;
  }

  let header, payload;
  try {
    header = JSON.parse(b64UrlDecode(parts[0]));
  } catch(e) {
    setError('jwt-err', 'Failed to decode JWT header: ' + e.message);
    input.classList.add('error');
    return;
  }
  try {
    payload = JSON.parse(b64UrlDecode(parts[1]));
  } catch(e) {
    setError('jwt-err', 'Failed to decode JWT payload: ' + e.message);
    input.classList.add('error');
    return;
  }

  document.getElementById('jwt-header-pre').textContent = JSON.stringify(header, null, 2);
  document.getElementById('jwt-payload-pre').textContent = JSON.stringify(payload, null, 2);
  document.getElementById('jwt-sig-pre').textContent = parts[2];

  /* Expiry status */
  const statusEl = document.getElementById('jwt-status');
  if (payload.exp !== undefined) {
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const expired = now > expDate;
    statusEl.className = 'jwt-status ' + (expired ? 'expired' : 'valid');
    statusEl.innerHTML = expired
      ? `✗ Token expired on ${expDate.toLocaleString()}`
      : `✓ Token valid until ${expDate.toLocaleString()}`;
  } else {
    statusEl.className = 'jwt-status no-exp';
    statusEl.innerHTML = 'ℹ No expiry (exp) claim found in payload';
  }

  statusEl.style.display = 'flex';
  document.getElementById('jwt-panels').style.display = 'grid';
}

function clearJwt() {
  document.getElementById('jwt-in').value = '';
  document.getElementById('jwt-in').classList.remove('error');
  setError('jwt-err', '');
  document.getElementById('jwt-panels').style.display = 'none';
  document.getElementById('jwt-status').style.display = 'none';
  document.getElementById('jwt-header-pre').textContent = '';
  document.getElementById('jwt-payload-pre').textContent = '';
  document.getElementById('jwt-sig-pre').textContent = '';
}

/* ── JSON Beautify / Minify ── */
function jsonBeautify() {
  const input = document.getElementById('json-in');
  const output = document.getElementById('json-out');
  const indent = parseInt(document.getElementById('json-indent').value, 10);
  setError('json-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }
  try {
    output.value = JSON.stringify(JSON.parse(val), null, indent);
  } catch (e) {
    setError('json-err', 'Invalid JSON: ' + e.message);
    input.classList.add('error');
    output.value = '';
  }
}

function jsonMinify() {
  const input = document.getElementById('json-in');
  const output = document.getElementById('json-out');
  setError('json-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }
  try {
    output.value = JSON.stringify(JSON.parse(val));
  } catch (e) {
    setError('json-err', 'Invalid JSON: ' + e.message);
    input.classList.add('error');
    output.value = '';
  }
}

/* ── XML Beautify / Minify ── */
function xmlBeautify() {
  const input = document.getElementById('xml-in');
  const output = document.getElementById('xml-out');
  const indent = parseInt(document.getElementById('xml-indent').value, 10);
  setError('xml-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }

  const parser = new DOMParser();
  const doc = parser.parseFromString(val, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    setError('xml-err', 'Invalid XML: ' + parseError.textContent.split('\n')[0]);
    input.classList.add('error');
    output.value = '';
    return;
  }
  output.value = formatXmlNode(doc.documentElement, 0, ' '.repeat(indent));
}

function formatXmlNode(node, depth, pad) {
  const prefix = pad.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent.trim();
    return t ? prefix + t : '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const tag = node.tagName;
  const attrs = Array.from(node.attributes)
    .map(a => ` ${a.name}="${a.value}"`).join('');

  const children = Array.from(node.childNodes)
    .map(c => formatXmlNode(c, depth + 1, pad))
    .filter(s => s !== '');

  if (children.length === 0) return `${prefix}<${tag}${attrs}/>`;

  // single text child — keep on one line
  if (children.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
    return `${prefix}<${tag}${attrs}>${node.childNodes[0].textContent.trim()}</${tag}>`;
  }

  return `${prefix}<${tag}${attrs}>\n${children.join('\n')}\n${prefix}</${tag}>`;
}

function xmlMinify() {
  const input = document.getElementById('xml-in');
  const output = document.getElementById('xml-out');
  setError('xml-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }

  const parser = new DOMParser();
  const doc = parser.parseFromString(val, 'application/xml');
  if (doc.querySelector('parseerror, parsererror')) {
    setError('xml-err', 'Invalid XML: cannot minify.');
    input.classList.add('error');
    output.value = '';
    return;
  }
  output.value = new XMLSerializer().serializeToString(doc)
    .replace(/>\s+</g, '><')
    .trim();
}

/* ── SAML Decode ── */
async function samlDecode() {
  const input = document.getElementById('saml-in');
  const output = document.getElementById('saml-out');
  setError('saml-err', '');
  input.classList.remove('error');
  let val = input.value.trim();
  if (!val) { setError('saml-err', 'Please paste a SAML request or response.'); input.classList.add('error'); return; }

  // URL-decode if needed
  if (val.includes('%')) { try { val = decodeURIComponent(val); } catch(e) {} }

  // Normalise to standard Base64
  val = val.replace(/-/g, '+').replace(/_/g, '/');
  while (val.length % 4) val += '=';

  let bytes;
  try {
    const raw = atob(val);
    bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  } catch(e) {
    setError('saml-err', 'Invalid Base64 encoding.'); input.classList.add('error'); return;
  }

  let xml = '';
  // Try raw-deflate first (HTTP-Redirect binding)
  try {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    writer.write(bytes); writer.close();
    const chunks = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); }
    const total = new Uint8Array(chunks.reduce((s, c) => s + c.length, 0));
    let off = 0; for (const c of chunks) { total.set(c, off); off += c.length; }
    xml = new TextDecoder().decode(total);
  } catch(e) {
    // HTTP-POST binding — plain Base64
    xml = new TextDecoder().decode(bytes);
  }

  if (!xml.trim().startsWith('<')) { setError('saml-err', 'Decoded content does not appear to be XML.'); input.classList.add('error'); return; }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  output.value = doc.querySelector('parsererror') ? xml : formatXmlNode(doc.documentElement, 0, '  ');
}

/* ── MD5 pure JS ── */
function md5(str) {
  const b = new TextEncoder().encode(str);
  function add(x,y){const l=(x&0xffff)+(y&0xffff);return((x>>>16)+(y>>>16)+(l>>>16))<<16|l&0xffff}
  function rol(n,s){return n<<s|n>>>32-s}
  function cmn(q,a,b,x,s,t){return add(rol(add(add(a,q),add(x,t)),s),b)}
  function ff(a,b,c,d,x,s,t){return cmn(b&c|~b&d,a,b,x,s,t)}
  function gg(a,b,c,d,x,s,t){return cmn(b&d|c&~d,a,b,x,s,t)}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t)}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|~d),a,b,x,s,t)}
  const w = new Int32Array(((b.length+8>>6)+1)*16);
  for(let i=0;i<b.length;i++) w[i>>2]|=b[i]<<(i%4)*8;
  w[b.length>>2]|=0x80<<(b.length%4)*8; w[w.length-2]=b.length*8;
  let a=1732584193,bv=-271733879,c=-1732584194,d=271733878;
  for(let i=0;i<w.length;i+=16){
    const[A,B,C,D]=[a,bv,c,d];
    a=ff(a,bv,c,d,w[i],7,-680876936);d=ff(d,a,bv,c,w[i+1],12,-389564586);c=ff(c,d,a,bv,w[i+2],17,606105819);bv=ff(bv,c,d,a,w[i+3],22,-1044525330);
    a=ff(a,bv,c,d,w[i+4],7,-176418897);d=ff(d,a,bv,c,w[i+5],12,1200080426);c=ff(c,d,a,bv,w[i+6],17,-1473231341);bv=ff(bv,c,d,a,w[i+7],22,-45705983);
    a=ff(a,bv,c,d,w[i+8],7,1770035416);d=ff(d,a,bv,c,w[i+9],12,-1958414417);c=ff(c,d,a,bv,w[i+10],17,-42063);bv=ff(bv,c,d,a,w[i+11],22,-1990404162);
    a=ff(a,bv,c,d,w[i+12],7,1804603682);d=ff(d,a,bv,c,w[i+13],12,-40341101);c=ff(c,d,a,bv,w[i+14],17,-1502002290);bv=ff(bv,c,d,a,w[i+15],22,1236535329);
    a=gg(a,bv,c,d,w[i+1],5,-165796510);d=gg(d,a,bv,c,w[i+6],9,-1069501632);c=gg(c,d,a,bv,w[i+11],14,643717713);bv=gg(bv,c,d,a,w[i+0],20,-373897302);
    a=gg(a,bv,c,d,w[i+5],5,-701558691);d=gg(d,a,bv,c,w[i+10],9,38016083);c=gg(c,d,a,bv,w[i+15],14,-660478335);bv=gg(bv,c,d,a,w[i+4],20,-405537848);
    a=gg(a,bv,c,d,w[i+9],5,568446438);d=gg(d,a,bv,c,w[i+14],9,-1019803690);c=gg(c,d,a,bv,w[i+3],14,-187363961);bv=gg(bv,c,d,a,w[i+8],20,1163531501);
    a=gg(a,bv,c,d,w[i+13],5,-1444681467);d=gg(d,a,bv,c,w[i+2],9,-51403784);c=gg(c,d,a,bv,w[i+7],14,1735328473);bv=gg(bv,c,d,a,w[i+12],20,-1926607734);
    a=hh(a,bv,c,d,w[i+5],4,-378558);d=hh(d,a,bv,c,w[i+8],11,-2022574463);c=hh(c,d,a,bv,w[i+11],16,1839030562);bv=hh(bv,c,d,a,w[i+14],23,-35309556);
    a=hh(a,bv,c,d,w[i+1],4,-1530992060);d=hh(d,a,bv,c,w[i+4],11,1272893353);c=hh(c,d,a,bv,w[i+7],16,-155497632);bv=hh(bv,c,d,a,w[i+10],23,-1094730640);
    a=hh(a,bv,c,d,w[i+13],4,681279174);d=hh(d,a,bv,c,w[i+0],11,-358537222);c=hh(c,d,a,bv,w[i+3],16,-722521979);bv=hh(bv,c,d,a,w[i+6],23,76029189);
    a=hh(a,bv,c,d,w[i+9],4,-640364487);d=hh(d,a,bv,c,w[i+12],11,-421815835);c=hh(c,d,a,bv,w[i+15],16,530742520);bv=hh(bv,c,d,a,w[i+2],23,-995338651);
    a=ii(a,bv,c,d,w[i+0],6,-198630844);d=ii(d,a,bv,c,w[i+7],10,1126891415);c=ii(c,d,a,bv,w[i+14],15,-1416354905);bv=ii(bv,c,d,a,w[i+5],21,-57434055);
    a=ii(a,bv,c,d,w[i+12],6,1700485571);d=ii(d,a,bv,c,w[i+3],10,-1894986606);c=ii(c,d,a,bv,w[i+10],15,-1051523);bv=ii(bv,c,d,a,w[i+1],21,-2054922799);
    a=ii(a,bv,c,d,w[i+8],6,1873313359);d=ii(d,a,bv,c,w[i+15],10,-30611744);c=ii(c,d,a,bv,w[i+6],15,-1560198380);bv=ii(bv,c,d,a,w[i+13],21,1309151649);
    a=ii(a,bv,c,d,w[i+4],6,-145523070);d=ii(d,a,bv,c,w[i+11],10,-1120210379);c=ii(c,d,a,bv,w[i+2],15,718787259);bv=ii(bv,c,d,a,w[i+9],21,-343485551);
    a=add(a,A);bv=add(bv,B);c=add(c,C);d=add(d,D);
  }
  return [a,bv,c,d].map(n=>Array.from({length:4},(_,i)=>((n>>i*8)&0xff).toString(16).padStart(2,'0')).join('')).join('');
}

/* ── Hash Generate ── */
async function hashGenerate() {
  const input = document.getElementById('hash-in');
  const resultsEl = document.getElementById('hash-results');
  setError('hash-err', '');
  input.classList.remove('error');
  if (!input.value.trim()) { setError('hash-err', 'Please enter text to hash.'); input.classList.add('error'); return; }

  const val = input.value;
  async function sha(algo) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(val));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  const [h1, h256, h512] = await Promise.all([sha('SHA-1'), sha('SHA-256'), sha('SHA-512')]);
  const rows = [['MD5', md5(val)], ['SHA-1', h1], ['SHA-256', h256], ['SHA-512', h512]];

  resultsEl.innerHTML = rows.map(([algo, hash]) =>
    `<div class="hash-row">
      <span class="hash-algo">${algo}</span>
      <code class="hash-value">${hash}</code>
      <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${hash}')">Copy</button>
    </div>`
  ).join('');
  resultsEl.style.display = 'flex';
}

function clearHash() {
  document.getElementById('hash-in').value = '';
  document.getElementById('hash-in').classList.remove('error');
  setError('hash-err', '');
  const r = document.getElementById('hash-results');
  r.style.display = 'none'; r.innerHTML = '';
}

function copyVal(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
}

/* ── Timestamp Convert ── */
function tsConvert() {
  const input = document.getElementById('ts-in');
  const resultsEl = document.getElementById('ts-results');
  setError('ts-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('ts-err', 'Please enter a timestamp or date string.'); input.classList.add('error'); return; }

  let date;
  if (/^\d+$/.test(val)) {
    const n = parseInt(val);
    date = new Date(n > 1e11 ? n : n * 1000);
  } else {
    date = new Date(val);
  }
  if (isNaN(date.getTime())) { setError('ts-err', 'Invalid timestamp or date string.'); input.classList.add('error'); return; }

  const sec = Math.floor(date.getTime() / 1000);
  const ms = date.getTime();
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const rel = abs < 60000 ? 'just now'
    : abs < 3600000   ? `${Math.round(abs/60000)} min ${future?'from now':'ago'}`
    : abs < 86400000  ? `${Math.round(abs/3600000)} hr ${future?'from now':'ago'}`
    : abs < 2592000000? `${Math.round(abs/86400000)} days ${future?'from now':'ago'}`
    : abs < 31536000000?`${Math.round(abs/2592000000)} months ${future?'from now':'ago'}`
    : `${Math.round(abs/31536000000)} years ${future?'from now':'ago'}`;

  const rows = [
    ['UTC',             date.toUTCString()],
    ['Local',           date.toLocaleString()],
    ['ISO 8601',        date.toISOString()],
    ['Unix (seconds)',  sec.toString()],
    ['Unix (ms)',       ms.toString()],
    ['Relative',        rel],
  ];

  resultsEl.innerHTML = rows.map(([label, value]) =>
    `<div class="ts-row">
      <span class="ts-label">${label}</span>
      <span class="ts-value">${value}</span>
      <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal(${JSON.stringify(value)})">Copy</button>
    </div>`
  ).join('');
  resultsEl.style.display = 'flex';
}

function tsNow() {
  document.getElementById('ts-in').value = Math.floor(Date.now() / 1000).toString();
  tsConvert();
}

function clearTs() {
  document.getElementById('ts-in').value = '';
  document.getElementById('ts-in').classList.remove('error');
  setError('ts-err', '');
  const r = document.getElementById('ts-results');
  r.style.display = 'none'; r.innerHTML = '';
}

/* ── Diff Viewer ── */
function computeDiff(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, () => new Int32Array(n+1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const out = []; let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) { out.unshift({t:'eq',s:a[i-1]}); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { out.unshift({t:'add',s:b[j-1]}); j--; }
    else { out.unshift({t:'del',s:a[i-1]}); i--; }
  }
  return out;
}

function diffCompare() {
  const left = document.getElementById('diff-left').value;
  const right = document.getElementById('diff-right').value;
  setError('diff-err', '');
  if (!left && !right) { setError('diff-err', 'Please enter text in both panels.'); return; }

  const aLines = left.split('\n'), bLines = right.split('\n');
  if (aLines.length > 2000 || bLines.length > 2000) { setError('diff-err', 'Input too large (max 2000 lines each).'); return; }

  const diff = computeDiff(aLines, bLines);
  let added = 0, removed = 0;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  document.getElementById('diff-pre').innerHTML = diff.map(({t, s}) => {
    if (t === 'add') { added++; return `<span class="diff-add">+ ${esc(s)}</span>`; }
    if (t === 'del') { removed++; return `<span class="diff-del">- ${esc(s)}</span>`; }
    return `<span class="diff-eq">  ${esc(s)}</span>`;
  }).join('\n');

  document.getElementById('diff-stats').innerHTML =
    `<span class="diff-stat-add">+${added} added</span> &nbsp; <span class="diff-stat-del">-${removed} removed</span>`;
  document.getElementById('diff-output').style.display = 'block';
}

function clearDiff() {
  document.getElementById('diff-left').value = '';
  document.getElementById('diff-right').value = '';
  setError('diff-err', '');
  const o = document.getElementById('diff-output');
  o.style.display = 'none';
  document.getElementById('diff-pre').innerHTML = '';
  document.getElementById('diff-stats').innerHTML = '';
}

/* ── Password Generator ── */
function pwGenerate() {
  setError('pwgen-err', '');
  const len = parseInt(document.getElementById('pwgen-len').value);
  const upper   = document.getElementById('pwgen-upper').checked;
  const lower   = document.getElementById('pwgen-lower').checked;
  const numbers = document.getElementById('pwgen-numbers').checked;
  const symbols = document.getElementById('pwgen-symbols').checked;
  if (!upper && !lower && !numbers && !symbols) {
    setError('pwgen-err', 'Select at least one character type.'); return;
  }
  let chars = '';
  if (upper)   chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower)   chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  const pwd = Array.from(arr).map(n => chars[n % chars.length]).join('');
  document.getElementById('pwgen-result').value = pwd;

  let score = 0;
  if (len >= 8)  score++;
  if (len >= 12) score++;
  if (len >= 16) score++;
  if (upper && lower) score++;
  if (numbers) score++;
  if (symbols) score++;
  const levels = [
    [16,'str-weak','Very Weak'],[33,'str-weak','Weak'],[50,'str-fair','Fair'],
    [66,'str-good','Good'],[83,'str-strong','Strong'],[100,'str-strong','Very Strong']
  ];
  const [pct, cls, lbl] = levels[Math.min(score, levels.length-1)];
  const fill = document.getElementById('strength-bar-fill');
  fill.style.width = pct + '%';
  fill.className = 'strength-bar-fill ' + cls;
  const sl = document.getElementById('strength-label');
  sl.textContent = lbl; sl.className = 'strength-label ' + cls;
  document.getElementById('pwgen-strength').style.display = 'flex';
}

/* ── Regex Tester ── */
function regexTest() {
  const pattern = document.getElementById('regex-pattern').value;
  const testStr = document.getElementById('regex-test').value;
  setError('regex-err', '');
  if (!pattern) { setError('regex-err', 'Please enter a regex pattern.'); return; }
  const flags = ['g','i','m','s'].filter(f => document.getElementById('re-'+f).checked).join('');
  let re;
  try { re = new RegExp(pattern, flags); }
  catch(e) { setError('regex-err', 'Invalid regex: ' + e.message); return; }

  const matches = [];
  if (flags.includes('g')) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(testStr)) !== null) {
      matches.push({index:m.index, len:m[0].length, val:m[0], groups:m.slice(1)});
      if (m[0].length === 0) re.lastIndex++;
    }
  } else {
    const m = re.exec(testStr);
    if (m) matches.push({index:m.index, len:m[0].length, val:m[0], groups:m.slice(1)});
  }

  document.getElementById('regex-stats').textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let hl = ''; let last = 0;
  for (const m of matches) {
    hl += esc(testStr.slice(last, m.index));
    hl += `<mark class="regex-match">${esc(testStr.slice(m.index, m.index + m.len))}</mark>`;
    last = m.index + m.len;
  }
  hl += esc(testStr.slice(last));
  document.getElementById('regex-highlight').innerHTML = hl.replace(/\n/g,'<br>');
  document.getElementById('regex-matches').innerHTML = matches.length === 0
    ? '<span style="color:var(--muted);font-size:0.8rem;">No matches</span>'
    : matches.map((m,i) =>
        `<div class="regex-match-item">
          <span class="regex-match-num">${i+1}</span>
          <code class="regex-match-val">${esc(m.val)}</code>
          <span class="regex-match-idx">at index ${m.index}</span>
          ${m.groups.filter(g=>g!==undefined).map((g,gi)=>`<span class="regex-group">group ${gi+1}: <code>${esc(g||'')}</code></span>`).join('')}
        </div>`
      ).join('');
  document.getElementById('regex-output').style.display = 'block';
}

function clearRegex() {
  document.getElementById('regex-pattern').value = '';
  document.getElementById('regex-test').value = '';
  setError('regex-err', '');
  document.getElementById('regex-output').style.display = 'none';
}

/* ── UUID Generator ── */
function uuidGenerate() {
  setError('uuid-err', '');
  if (!crypto.randomUUID) {
    setError('uuid-err', 'crypto.randomUUID() requires HTTPS or localhost.');
    return;
  }
  const count = Math.min(100, Math.max(1, parseInt(document.getElementById('uuid-count').value) || 1));
  const uuids = Array.from({length: count}, () => crypto.randomUUID());
  const resultsEl = document.getElementById('uuid-results');
  resultsEl.innerHTML = uuids.map(u =>
    `<div class="uuid-row">
      <code class="uuid-value">${u}</code>
      <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${u}')">Copy</button>
    </div>`
  ).join('');
  resultsEl.style.display = 'flex';
  const btn = document.getElementById('uuid-copy-all');
  btn.style.display = count > 1 ? 'flex' : 'none';
  btn.dataset.all = uuids.join('\n');
}

function uuidCopyAll() {
  copyVal(document.getElementById('uuid-copy-all').dataset.all);
}

function clearUuid() {
  setError('uuid-err', '');
  const r = document.getElementById('uuid-results');
  r.style.display = 'none'; r.innerHTML = '';
  document.getElementById('uuid-copy-all').style.display = 'none';
}

/* ── Base64 URL Encode / Decode ── */
function b64urlEncode() {
  const input = document.getElementById('b64urlenc-in');
  const output = document.getElementById('b64urlenc-out');
  setError('b64urlenc-err', '');
  input.classList.remove('error');
  if (!input.value.trim()) { setError('b64urlenc-err', 'Please enter some text to encode.'); input.classList.add('error'); return; }
  try {
    output.value = toBase64(input.value).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  } catch(e) {
    setError('b64urlenc-err', 'Encoding failed: ' + e.message); input.classList.add('error');
  }
}

function b64urlDecode() {
  const input = document.getElementById('b64urldec-in');
  const output = document.getElementById('b64urldec-out');
  setError('b64urldec-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('b64urldec-err', 'Please enter a Base64 URL string to decode.'); input.classList.add('error'); return; }
  try {
    let b64 = val.replace(/-/g,'+').replace(/_/g,'/');
    while (b64.length % 4) b64 += '=';
    output.value = fromBase64(b64);
  } catch(e) {
    setError('b64urldec-err', 'Invalid Base64 URL string.'); input.classList.add('error'); output.value = '';
  }
}

/* ── HTTP Status Code Reference ── */
const HTTP_CODES = [
  {code:100,name:'Continue',desc:'Request received, please continue.'},
  {code:101,name:'Switching Protocols',desc:'Switching to protocol specified in Upgrade header.'},
  {code:102,name:'Processing',desc:'Server has received and is processing the request (WebDAV).'},
  {code:103,name:'Early Hints',desc:'Used with the Link header to allow preloading resources.'},
  {code:200,name:'OK',desc:'Request succeeded.'},
  {code:201,name:'Created',desc:'Request succeeded and a new resource was created.'},
  {code:202,name:'Accepted',desc:'Request received but not yet acted upon.'},
  {code:203,name:'Non-Authoritative Information',desc:'Returned metadata is from a third-party copy.'},
  {code:204,name:'No Content',desc:'No content to send for this request.'},
  {code:205,name:'Reset Content',desc:'Client should reset the document view.'},
  {code:206,name:'Partial Content',desc:'Only part of the resource is being delivered (range requests).'},
  {code:207,name:'Multi-Status',desc:'Multiple status codes might be appropriate (WebDAV).'},
  {code:208,name:'Already Reported',desc:'Members of a DAV binding already enumerated (WebDAV).'},
  {code:226,name:'IM Used',desc:'Server fulfilled GET using instance manipulations.'},
  {code:300,name:'Multiple Choices',desc:'Multiple options for the resource.'},
  {code:301,name:'Moved Permanently',desc:'Resource has moved permanently to a new URL.'},
  {code:302,name:'Found',desc:'Resource temporarily at a different URI.'},
  {code:303,name:'See Other',desc:'Response to request found at another URI using GET.'},
  {code:304,name:'Not Modified',desc:'Resource has not been modified since last request.'},
  {code:307,name:'Temporary Redirect',desc:'Request should be repeated with another URI using same method.'},
  {code:308,name:'Permanent Redirect',desc:'Resource has moved permanently; repeat with same method.'},
  {code:400,name:'Bad Request',desc:'Server cannot process request due to client error.'},
  {code:401,name:'Unauthorized',desc:'Authentication is required and has failed or not been provided.'},
  {code:402,name:'Payment Required',desc:'Reserved for future use.'},
  {code:403,name:'Forbidden',desc:'Server refuses to authorize the request.'},
  {code:404,name:'Not Found',desc:'Requested resource could not be found.'},
  {code:405,name:'Method Not Allowed',desc:'Request method is not supported for the resource.'},
  {code:406,name:'Not Acceptable',desc:'Response does not match the Accept headers.'},
  {code:407,name:'Proxy Authentication Required',desc:'Client must authenticate with the proxy.'},
  {code:408,name:'Request Timeout',desc:'Server timed out waiting for the request.'},
  {code:409,name:'Conflict',desc:'Request conflict with the current state of the resource.'},
  {code:410,name:'Gone',desc:'Resource requested is no longer available.'},
  {code:411,name:'Length Required',desc:'Content-Length header field required.'},
  {code:412,name:'Precondition Failed',desc:'Client preconditions given in headers not met.'},
  {code:413,name:'Content Too Large',desc:'Request body exceeds server-defined limits.'},
  {code:414,name:'URI Too Long',desc:'URI requested by client is longer than server will process.'},
  {code:415,name:'Unsupported Media Type',desc:'Media format of request data not supported.'},
  {code:416,name:'Range Not Satisfiable',desc:'Range specified by Range header cannot be fulfilled.'},
  {code:417,name:'Expectation Failed',desc:'Expect request-header field cannot be met.'},
  {code:418,name:"I'm a Teapot",desc:'Server refuses to brew coffee because it is a teapot (RFC 2324).'},
  {code:421,name:'Misdirected Request',desc:'Request directed at a server not able to produce a response.'},
  {code:422,name:'Unprocessable Content',desc:'Request well-formed but semantically erroneous (WebDAV).'},
  {code:423,name:'Locked',desc:'Resource being accessed is locked (WebDAV).'},
  {code:424,name:'Failed Dependency',desc:'Request failed due to failure of a previous request (WebDAV).'},
  {code:425,name:'Too Early',desc:'Server unwilling to risk processing a request that might be replayed.'},
  {code:426,name:'Upgrade Required',desc:'Client should switch to a different protocol.'},
  {code:428,name:'Precondition Required',desc:'Origin server requires the request to be conditional.'},
  {code:429,name:'Too Many Requests',desc:'User has sent too many requests in a given amount of time (rate limiting).'},
  {code:431,name:'Request Header Fields Too Large',desc:'Server unwilling to process; header fields too large.'},
  {code:451,name:'Unavailable For Legal Reasons',desc:'Resource unavailable due to legal demands.'},
  {code:500,name:'Internal Server Error',desc:'Generic error when no specific message is suitable.'},
  {code:501,name:'Not Implemented',desc:'Server does not support the functionality required.'},
  {code:502,name:'Bad Gateway',desc:'Server acting as gateway received an invalid response.'},
  {code:503,name:'Service Unavailable',desc:'Server not ready to handle request (down or overloaded).'},
  {code:504,name:'Gateway Timeout',desc:'Server acting as gateway did not get a response in time.'},
  {code:505,name:'HTTP Version Not Supported',desc:'HTTP version used in the request is not supported.'},
  {code:506,name:'Variant Also Negotiates',desc:'Server has an internal configuration error.'},
  {code:507,name:'Insufficient Storage',desc:'Method could not be performed; server storage full (WebDAV).'},
  {code:508,name:'Loop Detected',desc:'Server detected an infinite loop while processing the request (WebDAV).'},
  {code:510,name:'Not Extended',desc:'Further extensions required for the server to fulfil the request.'},
  {code:511,name:'Network Authentication Required',desc:'Client needs to authenticate to gain network access.'},
];

function httpFilter() {
  renderHttpTable(document.getElementById('http-search').value.toLowerCase());
}

function renderHttpTable(q) {
  const cats = {1:'1xx Informational',2:'2xx Success',3:'3xx Redirection',4:'4xx Client Error',5:'5xx Server Error'};
  const clsMap = {1:'http-1xx',2:'http-2xx',3:'http-3xx',4:'http-4xx',5:'http-5xx'};
  const filtered = q ? HTTP_CODES.filter(c =>
    c.code.toString().includes(q) || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  ) : HTTP_CODES;
  let html = ''; let cur = 0;
  for (const c of filtered) {
    const cat = Math.floor(c.code / 100);
    if (cat !== cur) {
      if (cur) html += '</div>';
      html += `<div class="http-category"><div class="http-cat-label">${cats[cat]}</div>`;
      cur = cat;
    }
    html += `<div class="http-row">
      <span class="http-code ${clsMap[cat]}">${c.code}</span>
      <span class="http-name">${c.name}</span>
      <span class="http-desc">${c.desc}</span>
    </div>`;
  }
  if (cur) html += '</div>';
  if (!filtered.length) html = '<div style="color:var(--muted);padding:12px;font-size:0.85rem;">No matching status codes.</div>';
  document.getElementById('http-table').innerHTML = html;
}

/* ── CORS Header Builder ── */
function corsGenerate() {
  const origin = document.getElementById('cors-origin').value.trim() || '*';
  const methods = ['get','post','put','patch','delete','options','head']
    .filter(m => document.getElementById('cors-'+m).checked)
    .map(m => m.toUpperCase()).join(', ');
  const headers     = document.getElementById('cors-headers').value.trim();
  const expose      = document.getElementById('cors-expose').value.trim();
  const maxAge      = document.getElementById('cors-maxage').value.trim();
  const credentials = document.getElementById('cors-credentials').checked;

  let out = `Access-Control-Allow-Origin: ${origin}\n`;
  if (methods)     out += `Access-Control-Allow-Methods: ${methods}\n`;
  if (headers)     out += `Access-Control-Allow-Headers: ${headers}\n`;
  if (expose)      out += `Access-Control-Expose-Headers: ${expose}\n`;
  if (maxAge)      out += `Access-Control-Max-Age: ${maxAge}\n`;
  if (credentials) out += `Access-Control-Allow-Credentials: true\n`;

  document.getElementById('cors-result').value = out.trim();
  document.getElementById('cors-output').style.display = 'block';
}

/* ── YAML Linter / Formatter ── */
/* Structure-aware indentation fixer. Uses a stack to track parent-child
   relationships via original indent changes. For sequence items (- ),
   pushes TWO stack entries: one for the dash position and one for the
   content column, so continuation lines are correctly re-indented.
   Preserves comments, key ordering, values, and overall structure. */
const YAMLLint = (() => {

  /* Normalize "key:    value" to "key: value", preserving quoted values */
  function normalizeMappingLine(line) {
    let inS = false, inD = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '\\') { i++; continue; }
      if (c === '"' && !inS) inD = !inD;
      if (c === "'" && !inD) inS = !inS;
      if (c === ':' && !inS && !inD && (i + 1 >= line.length || line[i + 1] === ' ')) {
        const key = line.slice(0, i);
        const val = line.slice(i + 1).trim();
        if (val === '') return key + ':';
        return key + ': ' + val;
      }
    }
    return line;
  }

  function isMappingKey(trimmed) {
    let inS = false, inD = false;
    for (let i = 0; i < trimmed.length; i++) {
      const c = trimmed[i];
      if (c === '\\') { i++; continue; }
      if (c === '"' && !inS) inD = !inD;
      if (c === "'" && !inD) inS = !inS;
      if (c === ':' && !inS && !inD && (i + 1 >= trimmed.length || trimmed[i + 1] === ' ')) return true;
    }
    return false;
  }

  function format(text, targetIndent) {
    targetIndent = targetIndent || 2;
    const rawLines = text.replace(/\t/g, '  ').split('\n');
    const warnings = [];

    /*
     * Stack approach:
     * Each entry: { origIndent, outputIndent }
     * - origIndent: the original indent level this entry was created for
     * - outputIndent: the corrected indent to use for lines at this level
     *
     * For sequence items "- content":
     *   1. Push entry for the dash position (origIndent = dash column, outputIndent = computed)
     *   2. Push entry for the content column (origIndent = where content starts after "- ",
     *      outputIndent = dashOutputIndent + 2)
     *   This means continuation lines at the content column get properly indented.
     */
    const stack = [{ origIndent: -1, outputIndent: -targetIndent }];
    const result = [];

    let inBlockScalar = false;
    let blockBaseOrigIndent = 0;
    let blockBaseOutputIndent = 0;

    // Track duplicate keys per document
    let keyTracker = {};

    for (let i = 0; i < rawLines.length; i++) {
      const raw = rawLines[i];
      const trimmed = raw.trim();
      const origIndent = raw.match(/^( *)/)[1].length;
      const lineNum = i + 1;

      // Trailing whitespace is silently fixed by the formatter — no warning needed
      // Warnings: tabs
      if (raw.includes('\t')) {
        warnings.push({ line: lineNum, msg: 'Tab character (converted to spaces)' });
      }

      // Blank lines
      if (trimmed === '') { result.push(''); continue; }

      // Document markers
      if (trimmed === '---' || trimmed === '...') {
        result.push(trimmed);
        stack.length = 1;
        stack[0] = { origIndent: -1, outputIndent: -targetIndent };
        inBlockScalar = false;
        keyTracker = {};
        continue;
      }

      // Block scalar continuation: preserve content with relative indent
      if (inBlockScalar) {
        if (origIndent > blockBaseOrigIndent) {
          const relIndent = origIndent - blockBaseOrigIndent;
          result.push(' '.repeat(blockBaseOutputIndent + relIndent) + trimmed);
          continue;
        }
        inBlockScalar = false;
      }

      // Comments: use the output indent of the next non-comment line, or parent context
      if (trimmed.startsWith('#')) {
        // Peek ahead to find the next non-blank, non-comment line's indent context
        let commentOutputIndent = 0;
        // Use current stack context
        const tempStack = stack.slice();
        while (tempStack.length > 1 && tempStack[tempStack.length - 1].origIndent >= origIndent) {
          tempStack.pop();
        }
        const parent = tempStack[tempStack.length - 1];
        if (origIndent > parent.origIndent) {
          commentOutputIndent = parent.outputIndent + targetIndent;
        } else {
          commentOutputIndent = parent.outputIndent;
        }
        result.push(' '.repeat(Math.max(0, commentOutputIndent)) + trimmed);
        continue;
      }

      const isSeqItem = trimmed.startsWith('- ') || trimmed === '-';

      // Pop stack entries where origIndent >= current (we've dedented or are at same level)
      while (stack.length > 1 && stack[stack.length - 1].origIndent >= origIndent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];
      const outputIndent = parent.outputIndent + targetIndent;

      if (isSeqItem) {
        const content = trimmed === '-' ? '' : trimmed.slice(2).trim();

        // Push dash entry
        stack.push({ origIndent, outputIndent });

        // Find where content starts in the original line (after "- " plus any extra spaces)
        let contentCol = origIndent + 1; // position after '-'
        while (contentCol < raw.length && raw[contentCol] === ' ') contentCol++;
        if (contentCol <= origIndent + 1) contentCol = origIndent + 2;

        // Push content column entry so continuations map correctly
        const contentOutputIndent = outputIndent + 2;
        stack.push({ origIndent: contentCol, outputIndent: contentOutputIndent });

        // Normalize content
        let normalized = content;
        if (content && isMappingKey(content)) {
          normalized = normalizeMappingLine(content);
        }

        // Output
        if (content === '') {
          result.push(' '.repeat(outputIndent) + '-');
        } else {
          result.push(' '.repeat(outputIndent) + '- ' + normalized);
        }

        // Check for block scalar indicator in content
        if (/^[|>][+\-]?\s*$/.test(content)) {
          inBlockScalar = true;
          blockBaseOrigIndent = contentCol;
          blockBaseOutputIndent = contentOutputIndent;
        } else if (/:\s+[|>][+\-]?\s*$/.test(normalized)) {
          inBlockScalar = true;
          blockBaseOrigIndent = contentCol;
          blockBaseOutputIndent = contentOutputIndent;
        }

        // Sequence items start a new mapping scope — clear keys at the content level
        // so sibling seq items can reuse the same keys (e.g. "name" in each container)
        const contentDepthPrefix = contentOutputIndent + '|';
        for (const k of Object.keys(keyTracker)) {
          if (k.startsWith(contentDepthPrefix)) delete keyTracker[k];
          // Also clear any deeper keys
          const kDepth = parseInt(k.split('|')[0]);
          if (kDepth >= contentOutputIndent) delete keyTracker[k];
        }
      } else {
        // Regular line (mapping key, scalar, etc.)
        stack.push({ origIndent, outputIndent });

        // Normalize
        let normalized = trimmed;
        if (isMappingKey(trimmed)) {
          normalized = normalizeMappingLine(trimmed);
        }

        result.push(' '.repeat(outputIndent) + normalized);

        // Check for block scalar indicator
        if (/:\s+[|>][+\-]?\s*$/.test(normalized)) {
          inBlockScalar = true;
          blockBaseOrigIndent = origIndent;
          blockBaseOutputIndent = outputIndent;
        }

        // Duplicate key tracking
        if (isMappingKey(trimmed) && !trimmed.startsWith('- ')) {
          const key = normalized.split(':')[0].trim();
          const depthKey = outputIndent + '|' + key;

          // If this key has block children (key: with no inline value),
          // clear deeper keys so sibling parent keys can reuse child key names
          const valPart = normalized.slice(normalized.indexOf(':') + 1).trim();
          const hasChildren = valPart === '' || /^[|>][+\-]?\s*$/.test(valPart);
          if (hasChildren) {
            for (const k of Object.keys(keyTracker)) {
              const kDepth = parseInt(k.split('|')[0]);
              if (kDepth > outputIndent) delete keyTracker[k];
            }
          }

          if (keyTracker[depthKey]) {
            warnings.push({ line: lineNum, msg: `Duplicate key "${key}" (first at line ${keyTracker[depthKey]})` });
          } else {
            keyTracker[depthKey] = lineNum;
          }
        }
      }
    }

    // Trim trailing blank lines (keep at most one)
    while (result.length > 1 && result[result.length - 1] === '' && result[result.length - 2] === '') {
      result.pop();
    }

    return { output: result.join('\n'), warnings };
  }

  return { format };
})();

/* ── YAML Validate ── */
function yamlValidate() {
  const input = document.getElementById('yaml-in');
  const output = document.getElementById('yaml-out');
  setError('yaml-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('yaml-err', 'Please enter YAML to validate.'); input.classList.add('error'); return; }
  const indent = parseInt(document.getElementById('yaml-indent').value, 10);
  const { warnings } = YAMLLint.format(val, indent);
  if (warnings.length === 0) {
    output.value = 'Valid YAML! No issues found.';
  } else {
    output.value = 'Found ' + warnings.length + ' issue(s):\n\n' +
      warnings.map(w => 'Line ' + w.line + ': ' + w.msg).join('\n');
    input.classList.add('error');
  }
}

/* ── YAML Beautify (Fix Indentation) ── */
function yamlBeautify() {
  const input = document.getElementById('yaml-in');
  const output = document.getElementById('yaml-out');
  const indent = parseInt(document.getElementById('yaml-indent').value, 10);
  setError('yaml-err', '');
  input.classList.remove('error');
  const val = input.value;
  if (!val.trim()) { output.value = ''; return; }
  const { output: formatted, warnings } = YAMLLint.format(val, indent);
  output.value = formatted;
  if (warnings.length > 0) {
    setError('yaml-err', warnings.length + ' issue(s) fixed — see output. (' +
      warnings.slice(0, 3).map(w => 'L' + w.line + ': ' + w.msg).join('; ') +
      (warnings.length > 3 ? '; ...' : '') + ')');
  }
}

/* ── YAML Parser (text → JS object, for YAML→JSON conversion) ── */
const YAMLParse = (() => {
  function inferType(s) {
    if (s === '' || s === 'null' || s === 'Null' || s === 'NULL' || s === '~') return null;
    if (s === 'true' || s === 'True' || s === 'TRUE') return true;
    if (s === 'false' || s === 'False' || s === 'FALSE') return false;
    if (/^[-+]?0x[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16);
    if (/^[-+]?0o[0-7]+$/.test(s)) return parseInt(s.replace('0o', ''), 8);
    if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s) && !isNaN(Number(s))) return Number(s);
    if (/^[.](inf|Inf|INF)$/.test(s)) return Infinity;
    if (/^-[.](inf|Inf|INF)$/.test(s)) return -Infinity;
    if (/^[.](nan|NaN|NAN)$/.test(s)) return NaN;
    return s;
  }

  function unquote(s) {
    if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"')
      return s.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'")
      return s.slice(1, -1).replace(/''/g, "'");
    return null;
  }

  function scalar(s) { const u = unquote(s); return u !== null ? u : inferType(s); }

  function splitFlow(s) {
    const parts = []; let depth = 0, start = 0, inS = false, inD = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\') { i++; continue; }
      if (c === '"' && !inS) inD = !inD;
      if (c === "'" && !inD) inS = !inS;
      if (inS || inD) continue;
      if (c === '[' || c === '{') depth++;
      if (c === ']' || c === '}') depth--;
      if (c === ',' && depth === 0) { parts.push(s.slice(start, i)); start = i + 1; }
    }
    parts.push(s.slice(start));
    return parts;
  }

  function flowSeq(s) {
    s = s.slice(1, -1).trim(); if (!s) return [];
    return splitFlow(s).map(i => { i = i.trim(); return flowVal(i); });
  }
  function flowMap(s) {
    s = s.slice(1, -1).trim(); if (!s) return {};
    const obj = {};
    for (const item of splitFlow(s)) {
      const idx = item.indexOf(':');
      if (idx === -1) continue;
      obj[scalar(item.slice(0, idx).trim())] = flowVal(item.slice(idx + 1).trim());
    }
    return obj;
  }
  function flowVal(v) {
    if (/^\{.*\}$/.test(v)) return flowMap(v);
    if (/^\[.*\]$/.test(v)) return flowSeq(v);
    return scalar(v);
  }

  function stripComment(line) {
    let inS = false, inD = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '\\') { i++; continue; }
      if (c === '"' && !inS) inD = !inD;
      if (c === "'" && !inD) inS = !inS;
      if (c === '#' && !inS && !inD && (i === 0 || line[i - 1] === ' ')) return line.slice(0, i);
    }
    return line;
  }

  function findColon(line) {
    let inS = false, inD = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '\\') { i++; continue; }
      if (c === '"' && !inS) inD = !inD;
      if (c === "'" && !inD) inS = !inS;
      if (c === ':' && !inS && !inD && (i + 1 >= line.length || line[i + 1] === ' ')) return i;
    }
    return -1;
  }

  function parse(text) {
    const raw = text.replace(/\t/g, '  ').split('\n');
    const lines = [];
    for (let i = 0; i < raw.length; i++) {
      const cleaned = stripComment(raw[i]).replace(/\s+$/, '');
      lines.push(cleaned);
    }
    let pos = 0;
    function indent(l) { const m = lines[l].match(/^( *)/); return m ? m[1].length : 0; }
    function skip() { while (pos < lines.length && lines[pos].trim() === '') pos++; }

    function parseNode(minInd) {
      skip();
      if (pos >= lines.length) return undefined;
      while (pos < lines.length && /^---(\s|$)/.test(lines[pos].trim())) { pos++; skip(); }
      if (pos >= lines.length) return undefined;
      const ci = indent(pos);
      if (ci < minInd) return undefined;
      const t = lines[pos].trim();
      if (/^\[.*\]$/.test(t)) { pos++; return flowSeq(t); }
      if (/^\{.*\}$/.test(t)) { pos++; return flowMap(t); }
      if (t.startsWith('- ') || t === '-') return parseSeq(ci);
      if (findColon(t) !== -1) return parseMap(ci);
      pos++;
      return scalar(t);
    }

    function parseMap(base) {
      const obj = {};
      while (pos < lines.length) {
        skip(); if (pos >= lines.length) break;
        const ci = indent(pos);
        if (ci !== base) break;
        const t = lines[pos].trim();
        if (t.startsWith('- ')) break;
        const colIdx = findColon(t);
        if (colIdx === -1) break;
        const key = scalar(t.slice(0, colIdx).trim());
        const valPart = t.slice(colIdx + 1).trim();
        pos++;
        if (valPart === '' || valPart === undefined) {
          skip();
          if (pos < lines.length && indent(pos) > base) {
            obj[key] = parseNode(base + 1);
          } else if (pos < lines.length && indent(pos) === base && lines[pos].trim().startsWith('- ')) {
            // Sequence at same indent as parent key (common K8s pattern: "ports:\n- ...")
            obj[key] = parseSeq(base);
          } else { obj[key] = null; }
        } else if (/^[|>][+\-]?\s*$/.test(valPart)) {
          obj[key] = parseBlock(base, valPart[0] === '|' ? 'lit' : 'fold', valPart);
        } else if (/^\[.*\]$/.test(valPart)) { obj[key] = flowSeq(valPart); }
        else if (/^\{.*\}$/.test(valPart)) { obj[key] = flowMap(valPart); }
        else { obj[key] = scalar(valPart); }
      }
      return obj;
    }

    function parseSeq(base) {
      const arr = [];
      while (pos < lines.length) {
        skip(); if (pos >= lines.length) break;
        const ci = indent(pos);
        if (ci !== base) break;
        const t = lines[pos].trim();
        if (!t.startsWith('- ') && t !== '-') break;
        const val = t === '-' ? '' : t.slice(2).trim();
        pos++;
        if (val === '') {
          skip();
          if (pos < lines.length && indent(pos) > base) arr.push(parseNode(base + 1));
          else arr.push(null);
        } else if (/^[|>][+\-]?\s*$/.test(val)) {
          arr.push(parseBlock(base, val[0] === '|' ? 'lit' : 'fold', val));
        } else if (/^\[.*\]$/.test(val)) { arr.push(flowSeq(val)); }
        else if (/^\{.*\}$/.test(val)) { arr.push(flowMap(val)); }
        else if (findColon(val) !== -1) {
          // Inline mapping in seq: "- key: val"
          const seqContentIndent = base + 2;
          const savedLine = lines[pos - 1];
          lines[pos - 1] = ' '.repeat(seqContentIndent) + val;
          pos--;
          arr.push(parseMap(seqContentIndent));
          lines[pos > lines.length ? lines.length - 1 : pos - 1] = savedLine;
        } else { arr.push(scalar(val)); }
      }
      return arr;
    }

    function parseBlock(base, style, indicator) {
      const chomp = indicator.endsWith('-') ? 'strip' : indicator.endsWith('+') ? 'keep' : 'clip';
      const bl = []; let bi = -1;
      while (pos < lines.length) {
        const r = lines[pos];
        if (r.trim() === '') { bl.push(''); pos++; continue; }
        const ci = indent(pos);
        if (ci <= base) break;
        if (bi === -1) bi = ci;
        if (ci < bi) break;
        bl.push(r.slice(bi));
        pos++;
      }
      while (bl.length && bl[bl.length - 1] === '') bl.pop();
      let res;
      if (style === 'lit') { res = bl.join('\n'); }
      else {
        res = '';
        for (const l of bl) {
          if (l === '') res += '\n';
          else res += (res && !res.endsWith('\n') ? ' ' : '') + l;
        }
      }
      if (chomp === 'clip') res += '\n';
      else if (chomp === 'keep') res += '\n';
      return res;
    }

    // Handle multi-document: parse all documents, return array if >1
    const docs = [];
    while (pos < lines.length) {
      skip();
      if (pos >= lines.length) break;
      if (/^---(\s|$)/.test(lines[pos].trim())) { pos++; continue; }
      const doc = parseNode(0);
      if (doc !== undefined) docs.push(doc);
      // Skip trailing document end markers
      skip();
      if (pos < lines.length && /^\.\.\.(\s|$)/.test(lines[pos].trim())) pos++;
    }
    if (docs.length === 0) return null;
    if (docs.length === 1) return docs[0];
    return docs;
  }

  return parse;
})();

/* ── YAML → JSON ── */
function yamlToJson() {
  const input = document.getElementById('yaml-in');
  const output = document.getElementById('yaml-out');
  const indent = parseInt(document.getElementById('yaml-indent').value, 10);
  setError('yaml-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }
  try {
    const parsed = YAMLParse(val);
    output.value = JSON.stringify(parsed, null, indent);
  } catch (e) {
    setError('yaml-err', 'Invalid YAML: ' + e.message);
    input.classList.add('error');
    output.value = '';
  }
}

/* ── JSON → YAML ── */
function jsonToYaml() {
  const input = document.getElementById('yaml-in');
  const output = document.getElementById('yaml-out');
  const indent = parseInt(document.getElementById('yaml-indent').value, 10);
  setError('yaml-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { output.value = ''; return; }
  try {
    const parsed = JSON.parse(val);
    output.value = jsonObjToYaml(parsed, indent, 0);
  } catch (e) {
    setError('yaml-err', 'Invalid JSON: ' + e.message);
    input.classList.add('error');
    output.value = '';
  }
}

/* Simple JSON object → YAML serializer (no full YAML parser needed) */
function jsonObjToYaml(value, indent, depth) {
  indent = indent || 2;
  const pad = ' '.repeat(indent * depth);
  const childPad = ' '.repeat(indent * (depth + 1));

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') {
    if (value === '' || value === 'null' || value === 'true' || value === 'false' ||
        /^[-+]?\d/.test(value) || value.includes(': ') || value.includes('#') ||
        value.startsWith('- ') || value.startsWith('{') || value.startsWith('[') ||
        value.includes('\n')) {
      if (value.includes('\n')) {
        const lines = value.replace(/\n$/, '').split('\n');
        return '|\n' + lines.map(l => childPad + l).join('\n');
      }
      if (value.includes('"')) return "'" + value.replace(/'/g, "''") + "'";
      return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map(item => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const s = jsonObjToYaml(item, indent, depth + 1);
        const mapLines = s.split('\n');
        return pad + '- ' + mapLines[0].trim() + (mapLines.length > 1 ? '\n' + mapLines.slice(1).join('\n') : '');
      }
      if (Array.isArray(item)) return pad + '-\n' + jsonObjToYaml(item, indent, depth + 1);
      return pad + '- ' + jsonObjToYaml(item, indent, depth + 1);
    }).join('\n');
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    return keys.map(k => {
      const v = value[k];
      const keyStr = /[:{}\[\],&*#?|>!'"%@`]/.test(k) || k === '' || /^\d/.test(k) ? '"' + k.replace(/"/g, '\\"') + '"' : k;
      if (v === null || v === undefined) return pad + keyStr + ':';
      if (typeof v === 'object' && v !== null) return pad + keyStr + ':\n' + jsonObjToYaml(v, indent, depth + 1);
      return pad + keyStr + ': ' + jsonObjToYaml(v, indent, depth + 1);
    }).join('\n');
  }
  return String(value);
}

/* ── PEM / Certificate Decoder ── */
const PEM = (() => {
  // OID name lookup
  const OID_NAMES = {
    '2.5.4.3': 'CN', '2.5.4.4': 'SN', '2.5.4.5': 'serialNumber',
    '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST',
    '2.5.4.9': 'street', '2.5.4.10': 'O', '2.5.4.11': 'OU',
    '2.5.4.12': 'title', '2.5.4.17': 'postalCode', '2.5.4.42': 'GN',
    '2.5.4.46': 'dnQualifier',
    '1.2.840.113549.1.1.1': 'RSA',
    '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
    '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
    '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
    '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
    '1.2.840.113549.1.1.14': 'SHA-224 with RSA',
    '1.2.840.10045.2.1': 'EC',
    '1.2.840.10045.3.1.7': 'P-256 (secp256r1)',
    '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
    '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
    '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
    '1.3.101.112': 'Ed25519',
    '1.3.101.113': 'Ed448',
    '2.5.29.14': 'Subject Key Identifier',
    '2.5.29.15': 'Key Usage',
    '2.5.29.17': 'Subject Alternative Name',
    '2.5.29.19': 'Basic Constraints',
    '2.5.29.31': 'CRL Distribution Points',
    '2.5.29.32': 'Certificate Policies',
    '2.5.29.35': 'Authority Key Identifier',
    '2.5.29.37': 'Extended Key Usage',
    '1.3.6.1.5.5.7.1.1': 'Authority Information Access',
    '1.3.6.1.5.5.7.3.1': 'TLS Web Server Authentication',
    '1.3.6.1.5.5.7.3.2': 'TLS Web Client Authentication',
    '1.2.840.113549.1.9.1': 'emailAddress',
    '0.9.2342.19200300.100.1.25': 'DC',
  };

  const KEY_USAGE_BITS = [
    'Digital Signature', 'Non Repudiation', 'Key Encipherment',
    'Data Encipherment', 'Key Agreement', 'Key Cert Sign',
    'CRL Sign', 'Encipher Only', 'Decipher Only'
  ];

  function parseDER(bytes, start, end) {
    start = start || 0;
    end = end || bytes.length;
    const nodes = [];
    let pos = start;
    while (pos < end) {
      if (pos >= bytes.length) break;
      const tag = bytes[pos++];
      if (pos >= end) break;
      let len = bytes[pos++];
      if (len & 0x80) {
        const numBytes = len & 0x7f;
        len = 0;
        for (let i = 0; i < numBytes; i++) len = (len << 8) | bytes[pos++];
      }
      const valueStart = pos;
      const valueEnd = pos + len;
      const constructed = !!(tag & 0x20);
      const node = { tag, len, start: valueStart, end: valueEnd, bytes: bytes.slice(valueStart, valueEnd) };
      if (constructed) {
        node.children = parseDER(bytes, valueStart, valueEnd);
      }
      nodes.push(node);
      pos = valueEnd;
    }
    return nodes;
  }

  function readOID(bytes) {
    const parts = [];
    parts.push(Math.floor(bytes[0] / 40));
    parts.push(bytes[0] % 40);
    let val = 0;
    for (let i = 1; i < bytes.length; i++) {
      val = (val << 7) | (bytes[i] & 0x7f);
      if (!(bytes[i] & 0x80)) { parts.push(val); val = 0; }
    }
    return parts.join('.');
  }

  function readInt(bytes) {
    // Return as hex string for large numbers
    if (bytes.length > 6) return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(':');
    let val = 0;
    for (let i = 0; i < bytes.length; i++) val = val * 256 + bytes[i];
    return val;
  }

  function readUTF8(bytes) {
    return new TextDecoder().decode(new Uint8Array(bytes));
  }

  function readTime(node) {
    const s = readUTF8(node.bytes);
    if (node.tag === 0x17) { // UTCTime
      const yy = parseInt(s.slice(0, 2));
      const year = yy >= 50 ? 1900 + yy : 2000 + yy;
      return new Date(`${year}-${s.slice(2,4)}-${s.slice(4,6)}T${s.slice(6,8)}:${s.slice(8,10)}:${s.slice(10,12)}Z`);
    }
    // GeneralizedTime (0x18)
    return new Date(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(8,10)}:${s.slice(10,12)}:${s.slice(12,14)}Z`);
  }

  function readName(node) {
    // Name = SEQUENCE of SET of SEQUENCE { OID, value }
    // Returns { dn: "CN=..., O=...", fields: { CN: "...", O: "...", ... } }
    if (!node.children) return { dn: '', fields: {} };
    const parts = [];
    const fields = {};
    for (const set of node.children) {
      if (!set.children) continue;
      for (const seq of set.children) {
        if (!seq.children || seq.children.length < 2) continue;
        const oid = readOID(seq.children[0].bytes);
        const valNode = seq.children[1];
        const val = readUTF8(valNode.bytes);
        const name = OID_NAMES[oid] || oid;
        parts.push(name + '=' + val);
        fields[name] = val;
      }
    }
    return { dn: parts.join(', '), fields };
  }

  function readSANs(extValueBytes) {
    // SANs extension value is an OCTET STRING wrapping a SEQUENCE of GeneralNames
    const wrapper = parseDER(extValueBytes, 0, extValueBytes.length);
    if (!wrapper.length || !wrapper[0].children) return [];
    const sans = [];
    for (const gn of wrapper[0].children) {
      const tagNum = gn.tag & 0x1f;
      const val = readUTF8(gn.bytes);
      if (tagNum === 2) sans.push('DNS: ' + val);
      else if (tagNum === 1) sans.push('Email: ' + val);
      else if (tagNum === 6) sans.push('URI: ' + val);
      else if (tagNum === 7) {
        // IP address
        if (gn.bytes.length === 4) {
          sans.push('IP: ' + Array.from(gn.bytes).join('.'));
        } else if (gn.bytes.length === 16) {
          const parts = [];
          for (let i = 0; i < 16; i += 2) parts.push(((gn.bytes[i] << 8) | gn.bytes[i+1]).toString(16));
          sans.push('IP: ' + parts.join(':'));
        }
      } else {
        sans.push('Other(' + tagNum + '): ' + val);
      }
    }
    return sans;
  }

  function readKeyUsage(bytes) {
    // Key Usage is a BIT STRING
    const inner = parseDER(bytes, 0, bytes.length);
    if (!inner.length) return [];
    const bits = inner[0].bytes;
    if (bits.length < 2) return [];
    const unusedBits = bits[0];
    const usages = [];
    for (let i = 1; i < bits.length; i++) {
      for (let b = 7; b >= 0; b--) {
        const bitIndex = (i - 1) * 8 + (7 - b);
        if (bitIndex >= KEY_USAGE_BITS.length) break;
        if (i === bits.length - 1 && (7 - b) >= (8 - unusedBits)) break;
        if (bits[i] & (1 << b)) usages.push(KEY_USAGE_BITS[bitIndex]);
      }
    }
    return usages;
  }

  function readExtKeyUsage(bytes) {
    const inner = parseDER(bytes, 0, bytes.length);
    if (!inner.length || !inner[0].children) return [];
    return inner[0].children.map(c => {
      const oid = readOID(c.bytes);
      return OID_NAMES[oid] || oid;
    });
  }

  function readBasicConstraints(bytes) {
    const inner = parseDER(bytes, 0, bytes.length);
    if (!inner.length || !inner[0].children) return 'CA: false';
    const children = inner[0].children;
    const isCA = children.length > 0 && children[0].tag === 0x01 && children[0].bytes[0] !== 0;
    let pathLen = '';
    if (children.length > 1 && children[1].tag === 0x02) {
      pathLen = ', Path Length: ' + readInt(children[1].bytes);
    }
    return 'CA: ' + isCA + pathLen;
  }

  function getPublicKeyInfo(spki) {
    if (!spki.children || spki.children.length < 2) return { algorithm: 'Unknown', bits: 0 };
    const algoSeq = spki.children[0];
    const keyBits = spki.children[1];
    let algo = 'Unknown';
    let params = '';
    if (algoSeq.children && algoSeq.children.length > 0) {
      const oid = readOID(algoSeq.children[0].bytes);
      algo = OID_NAMES[oid] || oid;
      if (algoSeq.children.length > 1 && algoSeq.children[1].tag === 0x06) {
        params = OID_NAMES[readOID(algoSeq.children[1].bytes)] || '';
      }
    }
    // Key size: bit string length * 8 minus unused bits indicator
    const keySize = keyBits.bytes.length > 0 ? (keyBits.bytes.length - 1) * 8 : 0;
    // For RSA, parse the actual modulus to get bit size
    let bits = keySize;
    if (algo === 'RSA' && keyBits.bytes.length > 1) {
      const inner = parseDER(keyBits.bytes, 1, keyBits.bytes.length);
      if (inner.length && inner[0].children && inner[0].children.length > 0) {
        bits = (inner[0].children[0].bytes.length - (inner[0].children[0].bytes[0] === 0 ? 1 : 0)) * 8;
      }
    }
    return { algorithm: algo + (params ? ' (' + params + ')' : ''), bits };
  }

  async function decode(pem) {
    // Support multiple certs in a chain
    const certBlocks = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
    if (!certBlocks || certBlocks.length === 0) throw new Error('No PEM certificate found. Expected -----BEGIN CERTIFICATE----- block.');

    const certs = [];
    for (const block of certBlocks) {
      const b64 = block.replace(/-----BEGIN CERTIFICATE-----/, '').replace(/-----END CERTIFICATE-----/, '').replace(/\s/g, '');
      const raw = atob(b64);
      const der = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) der[i] = raw.charCodeAt(i);

      const root = parseDER(der, 0, der.length);
      if (!root.length || !root[0].children || root[0].children.length < 3) throw new Error('Invalid X.509 certificate structure.');

      const cert = root[0];
      const tbs = cert.children[0];
      const sigAlgoNode = cert.children[1];
      // const sigValue = cert.children[2];

      if (!tbs.children || tbs.children.length < 6) throw new Error('Invalid TBSCertificate structure.');

      let idx = 0;
      // Version: [0] EXPLICIT INTEGER
      let version = 1;
      if ((tbs.children[idx].tag & 0xe0) === 0xa0) {
        const versionNode = parseDER(tbs.children[idx].bytes, 0, tbs.children[idx].bytes.length);
        version = versionNode.length ? readInt(versionNode[0].bytes) + 1 : 1;
        idx++;
      }

      const serial = readInt(tbs.children[idx++].bytes);
      idx++; // skip signature algorithm (duplicate of outer)
      const issuer = readName(tbs.children[idx++]);
      const validity = tbs.children[idx++];
      const subject = readName(tbs.children[idx++]);
      const spki = tbs.children[idx++];

      const notBefore = validity.children ? readTime(validity.children[0]) : null;
      const notAfter = validity.children ? readTime(validity.children[1]) : null;

      // Signature algorithm
      let sigAlgo = 'Unknown';
      if (sigAlgoNode.children && sigAlgoNode.children.length > 0) {
        const oid = readOID(sigAlgoNode.children[0].bytes);
        sigAlgo = OID_NAMES[oid] || oid;
      }

      // Public key info
      const pubKeyInfo = getPublicKeyInfo(spki);

      // Extensions
      const extensions = [];
      const sans = [];
      let keyUsage = [];
      let extKeyUsage = [];
      let basicConstraints = '';

      for (let i = idx; i < tbs.children.length; i++) {
        const ext = tbs.children[i];
        if ((ext.tag & 0xe0) === 0xa0 && (ext.tag & 0x1f) === 3) {
          // Extensions wrapper
          const extsSeq = parseDER(ext.bytes, 0, ext.bytes.length);
          if (extsSeq.length && extsSeq[0].children) {
            for (const extEntry of extsSeq[0].children) {
              if (!extEntry.children || extEntry.children.length < 2) continue;
              const extOid = readOID(extEntry.children[0].bytes);
              const extName = OID_NAMES[extOid] || extOid;
              const critical = extEntry.children.length > 2 && extEntry.children[1].tag === 0x01 && extEntry.children[1].bytes[0] !== 0;
              const extValueNode = extEntry.children[extEntry.children.length - 1];

              if (extOid === '2.5.29.17') {
                sans.push(...readSANs(extValueNode.bytes));
              } else if (extOid === '2.5.29.15') {
                keyUsage = readKeyUsage(extValueNode.bytes);
              } else if (extOid === '2.5.29.37') {
                extKeyUsage = readExtKeyUsage(extValueNode.bytes);
              } else if (extOid === '2.5.29.19') {
                basicConstraints = readBasicConstraints(extValueNode.bytes);
              }

              extensions.push({ oid: extOid, name: extName, critical });
            }
          }
        }
      }

      // Fingerprints
      const sha1 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', der)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
      const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', der)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');

      const now = new Date();
      const isExpired = notAfter && now > notAfter;
      const isNotYetValid = notBefore && now < notBefore;

      certs.push({
        version, serial, subject, issuer,
        notBefore, notAfter,
        sigAlgo, pubKeyInfo,
        sans, keyUsage, extKeyUsage, basicConstraints,
        extensions, sha1, sha256,
        isExpired, isNotYetValid,
      });
    }
    return certs;
  }

  // Decode raw DER certificate byte arrays (for keystore viewer)
  async function decodeDER(derArrays) {
    const certs = [];
    for (const der of derArrays) {
      const root = parseDER(der, 0, der.length);
      if (!root.length || !root[0].children || root[0].children.length < 3) continue;

      const cert = root[0];
      const tbs = cert.children[0];
      const sigAlgoNode = cert.children[1];

      if (!tbs.children || tbs.children.length < 6) continue;

      let idx = 0;
      let version = 1;
      if ((tbs.children[idx].tag & 0xe0) === 0xa0) {
        const versionNode = parseDER(tbs.children[idx].bytes, 0, tbs.children[idx].bytes.length);
        version = versionNode.length ? readInt(versionNode[0].bytes) + 1 : 1;
        idx++;
      }

      const serial = readInt(tbs.children[idx++].bytes);
      idx++;
      const issuer = readName(tbs.children[idx++]);
      const validity = tbs.children[idx++];
      const subject = readName(tbs.children[idx++]);
      const spki = tbs.children[idx++];

      const notBefore = validity.children ? readTime(validity.children[0]) : null;
      const notAfter = validity.children ? readTime(validity.children[1]) : null;

      let sigAlgo = 'Unknown';
      if (sigAlgoNode.children && sigAlgoNode.children.length > 0) {
        const oid = readOID(sigAlgoNode.children[0].bytes);
        sigAlgo = OID_NAMES[oid] || oid;
      }

      const pubKeyInfo = getPublicKeyInfo(spki);

      const sans = [];
      let keyUsage = [];
      let extKeyUsage = [];
      let basicConstraints = '';

      for (let i = idx; i < tbs.children.length; i++) {
        const ext = tbs.children[i];
        if ((ext.tag & 0xe0) === 0xa0 && (ext.tag & 0x1f) === 3) {
          const extsSeq = parseDER(ext.bytes, 0, ext.bytes.length);
          if (extsSeq.length && extsSeq[0].children) {
            for (const extEntry of extsSeq[0].children) {
              if (!extEntry.children || extEntry.children.length < 2) continue;
              const extOid = readOID(extEntry.children[0].bytes);
              const extValueNode = extEntry.children[extEntry.children.length - 1];
              if (extOid === '2.5.29.17') sans.push(...readSANs(extValueNode.bytes));
              else if (extOid === '2.5.29.15') keyUsage = readKeyUsage(extValueNode.bytes);
              else if (extOid === '2.5.29.37') extKeyUsage = readExtKeyUsage(extValueNode.bytes);
              else if (extOid === '2.5.29.19') basicConstraints = readBasicConstraints(extValueNode.bytes);
            }
          }
        }
      }

      const sha1 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', der)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
      const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', der)))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');

      const now = new Date();
      certs.push({
        version, serial, subject, issuer,
        notBefore, notAfter, sigAlgo, pubKeyInfo,
        sans, keyUsage, extKeyUsage, basicConstraints,
        sha1, sha256,
        isExpired: notAfter && now > notAfter,
        isNotYetValid: notBefore && now < notBefore,
      });
    }
    return certs;
  }

  return { decode, decodeDER, parseDER, readOID, readUTF8 };
})();

async function pemDecode() {
  const input = document.getElementById('pem-in');
  const resultsEl = document.getElementById('pem-results');
  setError('pem-err', '');
  input.classList.remove('error');
  const val = input.value.trim();
  if (!val) { setError('pem-err', 'Please paste a PEM certificate.'); input.classList.add('error'); return; }

  try {
    const certs = await PEM.decode(val);
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const nameFieldLabels = {
      CN: 'Common Name', O: 'Organization', OU: 'Org Unit',
      L: 'Locality', ST: 'State', C: 'Country',
      emailAddress: 'Email', DC: 'Domain Component',
      serialNumber: 'Serial No.', SN: 'Surname', GN: 'Given Name',
      street: 'Street', postalCode: 'Postal Code', title: 'Title',
      dnQualifier: 'DN Qualifier',
    };
    const nameFieldOrder = ['CN', 'O', 'OU', 'L', 'ST', 'C', 'emailAddress', 'DC'];

    function renderNameFields(nameObj) {
      const f = nameObj.fields;
      const allKeys = nameFieldOrder.filter(k => f[k]).concat(Object.keys(f).filter(k => !nameFieldOrder.includes(k)));
      return allKeys.map(k => {
        const label = nameFieldLabels[k] || k;
        return `<div class="pem-field"><span class="pem-label">${esc(label)}</span><span class="pem-value">${esc(f[k])}</span></div>`;
      }).join('');
    }

    resultsEl.innerHTML = certs.map((cert, i) => {
      const statusCls = cert.isExpired ? 'pem-expired' : cert.isNotYetValid ? 'pem-expired' : 'pem-valid';
      const statusMsg = cert.isExpired ? 'EXPIRED' : cert.isNotYetValid ? 'NOT YET VALID' : 'VALID';
      const title = certs.length > 1 ? `<div class="pem-cert-title">Certificate ${i + 1} of ${certs.length}</div>` : '';
      return `${title}<div class="pem-cert">
        <div class="pem-status ${statusCls}">${statusMsg}</div>
        <div class="pem-section">
          <div class="pem-section-title">Subject</div>
          ${renderNameFields(cert.subject)}
        </div>
        ${cert.sans.length ? `<div class="pem-section">
          <div class="pem-section-title">Subject Alternative Names (${cert.sans.length})</div>
          <div class="pem-sans">${cert.sans.map(s => `<span class="pem-san-tag">${esc(s)}</span>`).join('')}</div>
        </div>` : ''}
        <div class="pem-section">
          <div class="pem-section-title">Issuer</div>
          ${renderNameFields(cert.issuer)}
        </div>
        <div class="pem-section">
          <div class="pem-section-title">Validity</div>
          <div class="pem-field"><span class="pem-label">Valid From</span><span class="pem-value">${cert.notBefore ? cert.notBefore.toUTCString() : 'N/A'}</span></div>
          <div class="pem-field"><span class="pem-label">Valid To</span><span class="pem-value">${cert.notAfter ? cert.notAfter.toUTCString() : 'N/A'}</span></div>
        </div>
        <div class="pem-section">
          <div class="pem-section-title">Details</div>
          <div class="pem-field"><span class="pem-label">Version</span><span class="pem-value">V${cert.version}</span></div>
          <div class="pem-field"><span class="pem-label">Serial Number</span><span class="pem-value" style="word-break:break-all;">${esc(String(cert.serial))}</span></div>
          <div class="pem-field"><span class="pem-label">Signature Algo</span><span class="pem-value">${esc(cert.sigAlgo)}</span></div>
          <div class="pem-field"><span class="pem-label">Public Key</span><span class="pem-value">${esc(cert.pubKeyInfo.algorithm)} (${cert.pubKeyInfo.bits} bit)</span></div>
          ${cert.basicConstraints ? `<div class="pem-field"><span class="pem-label">Basic Constraints</span><span class="pem-value">${esc(cert.basicConstraints)}</span></div>` : ''}
          ${cert.keyUsage.length ? `<div class="pem-field"><span class="pem-label">Key Usage</span><span class="pem-value">${cert.keyUsage.map(esc).join(', ')}</span></div>` : ''}
          ${cert.extKeyUsage.length ? `<div class="pem-field"><span class="pem-label">Ext Key Usage</span><span class="pem-value">${cert.extKeyUsage.map(esc).join(', ')}</span></div>` : ''}
        </div>
        <div class="pem-section">
          <div class="pem-section-title">Fingerprints</div>
          <div class="pem-field"><span class="pem-label">SHA-1</span><span class="pem-value pem-hash">${cert.sha1}</span>
            <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${cert.sha1.replace(/'/g, "\\'")}')">Copy</button></div>
          <div class="pem-field"><span class="pem-label">SHA-256</span><span class="pem-value pem-hash">${cert.sha256}</span>
            <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${cert.sha256.replace(/'/g, "\\'")}')">Copy</button></div>
        </div>
      </div>`;
    }).join('');
    resultsEl.style.display = 'flex';
  } catch (e) {
    setError('pem-err', e.message);
    input.classList.add('error');
    resultsEl.style.display = 'none';
  }
}

function clearPem() {
  document.getElementById('pem-in').value = '';
  document.getElementById('pem-in').classList.remove('error');
  setError('pem-err', '');
  const r = document.getElementById('pem-results');
  r.style.display = 'none'; r.innerHTML = '';
}

/* ── CSR Decoder ── */
async function csrDec() {
  const input = document.getElementById('csrdec-in');
  const resultsEl = document.getElementById('csrdec-results');
  setError('csrdec-err', '');
  input.classList.remove('error');
  resultsEl.style.display = 'none';
  resultsEl.innerHTML = '';

  const val = input.value.trim();
  if (!val) { setError('csrdec-err', 'Please paste a PEM CSR.'); input.classList.add('error'); return; }

  try {
    const b64 = val.replace(/-----BEGIN (NEW )?CERTIFICATE REQUEST-----/, '')
      .replace(/-----END (NEW )?CERTIFICATE REQUEST-----/, '')
      .replace(/\s/g, '');
    if (!b64) throw new Error('No CSR data found. Expected -----BEGIN CERTIFICATE REQUEST----- block.');
    const raw = atob(b64);
    const der = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) der[i] = raw.charCodeAt(i);

    const root = PEM.parseDER(der, 0, der.length);
    if (!root.length || !root[0].children || root[0].children.length < 3)
      throw new Error('Invalid PKCS#10 CSR structure.');

    const csr = root[0];
    const certReqInfo = csr.children[0]; // CertificationRequestInfo
    const sigAlgoNode = csr.children[1];

    if (!certReqInfo.children || certReqInfo.children.length < 3)
      throw new Error('Invalid CertificationRequestInfo.');

    // Version
    let idx = 0;
    const version = certReqInfo.children[idx].bytes[0];
    idx++;

    // Subject
    const subjectNode = certReqInfo.children[idx++];
    const subject = parseCSRName(subjectNode);

    // SubjectPublicKeyInfo
    const spki = certReqInfo.children[idx++];
    const pubKeyInfo = parseCSRPublicKey(spki);

    // Attributes [0] — may contain SANs extension request
    let sans = [];
    if (idx < certReqInfo.children.length) {
      const attrs = certReqInfo.children[idx];
      if ((attrs.tag & 0xe0) === 0xa0) {
        const attrNodes = PEM.parseDER(attrs.bytes, 0, attrs.bytes.length);
        for (const attr of attrNodes) {
          if (!attr.children || attr.children.length < 2) continue;
          const attrOid = PEM.readOID(attr.children[0].bytes);
          if (attrOid === '1.2.840.113549.1.9.14') {
            // extensionRequest
            const extSet = attr.children[1];
            const extSeqNodes = extSet.children || PEM.parseDER(extSet.bytes, 0, extSet.bytes.length);
            for (const extSeq of extSeqNodes) {
              const exts = extSeq.children || PEM.parseDER(extSeq.bytes, 0, extSeq.bytes.length);
              for (const ext of exts) {
                if (!ext.children || ext.children.length < 2) continue;
                const extOid = PEM.readOID(ext.children[0].bytes);
                if (extOid === '2.5.29.17') {
                  // SAN
                  const sanValue = ext.children[ext.children.length - 1];
                  const sanBytes = sanValue.tag === 0x04 ? sanValue.bytes : sanValue.bytes;
                  const sanSeq = PEM.parseDER(sanBytes, 0, sanBytes.length);
                  if (sanSeq.length && sanSeq[0].children) {
                    for (const gn of sanSeq[0].children) {
                      const tagNum = gn.tag & 0x1f;
                      if (tagNum === 2) sans.push('DNS: ' + PEM.readUTF8(gn.bytes));
                      else if (tagNum === 7 && gn.bytes.length === 4) sans.push('IP: ' + Array.from(gn.bytes).join('.'));
                      else if (tagNum === 7 && gn.bytes.length === 16) {
                        const p = [];
                        for (let i = 0; i < 16; i += 2) p.push(((gn.bytes[i] << 8) | gn.bytes[i+1]).toString(16));
                        sans.push('IP: ' + p.join(':'));
                      }
                      else if (tagNum === 1) sans.push('Email: ' + PEM.readUTF8(gn.bytes));
                      else if (tagNum === 6) sans.push('URI: ' + PEM.readUTF8(gn.bytes));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Signature algorithm
    let sigAlgo = 'Unknown';
    const OID_SIG = {
      '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
      '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
      '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
      '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
      '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
      '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
      '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
    };
    if (sigAlgoNode.children && sigAlgoNode.children.length > 0) {
      const oid = PEM.readOID(sigAlgoNode.children[0].bytes);
      sigAlgo = OID_SIG[oid] || oid;
    }

    // Fingerprint
    const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', der)))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');

    // Render
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const nameLabels = {
      CN: 'Common Name', O: 'Organization', OU: 'Department',
      L: 'City', ST: 'State / Province', C: 'Country',
      emailAddress: 'Email', DC: 'Domain Component',
    };
    const nameOrder = ['CN', 'O', 'OU', 'L', 'ST', 'C', 'emailAddress', 'DC'];

    function renderFields(fields) {
      const keys = nameOrder.filter(k => fields[k]).concat(Object.keys(fields).filter(k => !nameOrder.includes(k)));
      return keys.map(k => {
        const label = nameLabels[k] || k;
        return `<div class="pem-field"><span class="pem-label">${esc(label)}</span><span class="pem-value">${esc(fields[k])}</span></div>`;
      }).join('');
    }

    resultsEl.innerHTML = `<div class="pem-cert">
      <div class="pem-section"><div class="pem-section-title">Subject</div>${renderFields(subject)}</div>
      ${sans.length ? `<div class="pem-section"><div class="pem-section-title">Subject Alternative Names (${sans.length})</div>
        <div class="pem-sans">${sans.map(s => `<span class="pem-san-tag">${esc(s)}</span>`).join('')}</div></div>` : ''}
      <div class="pem-section"><div class="pem-section-title">Public Key</div>
        <div class="pem-field"><span class="pem-label">Algorithm</span><span class="pem-value">${esc(pubKeyInfo.algorithm)}</span></div>
        <div class="pem-field"><span class="pem-label">Key Size</span><span class="pem-value">${pubKeyInfo.bits} bit</span></div>
      </div>
      <div class="pem-section"><div class="pem-section-title">Details</div>
        <div class="pem-field"><span class="pem-label">Version</span><span class="pem-value">${version === 0 ? 'v1 (0)' : 'v' + (version + 1)}</span></div>
        <div class="pem-field"><span class="pem-label">Signature Algo</span><span class="pem-value">${esc(sigAlgo)}</span></div>
      </div>
      <div class="pem-section"><div class="pem-section-title">Fingerprint</div>
        <div class="pem-field"><span class="pem-label">SHA-256</span><span class="pem-value pem-hash">${sha256}</span>
          <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${sha256.replace(/'/g, "\\'")}')">Copy</button></div>
      </div>
    </div>`;
    resultsEl.style.display = 'flex';
  } catch (e) {
    setError('csrdec-err', e.message);
    input.classList.add('error');
  }
}

function parseCSRName(node) {
  const OID_NAMES = {
    '2.5.4.3': 'CN', '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST',
    '2.5.4.10': 'O', '2.5.4.11': 'OU', '1.2.840.113549.1.9.1': 'emailAddress',
    '0.9.2342.19200300.100.1.25': 'DC',
  };
  const fields = {};
  if (!node.children) return fields;
  for (const set of node.children) {
    if (!set.children) continue;
    for (const seq of set.children) {
      if (!seq.children || seq.children.length < 2) continue;
      const oid = PEM.readOID(seq.children[0].bytes);
      const val = PEM.readUTF8(seq.children[1].bytes);
      const name = OID_NAMES[oid] || oid;
      fields[name] = val;
    }
  }
  return fields;
}

function parseCSRPublicKey(spki) {
  const OID_ALGO = {
    '1.2.840.113549.1.1.1': 'RSA',
    '1.2.840.10045.2.1': 'EC',
    '1.3.101.112': 'Ed25519',
  };
  const OID_CURVES = {
    '1.2.840.10045.3.1.7': 'P-256',
    '1.3.132.0.34': 'P-384',
    '1.3.132.0.35': 'P-521',
  };
  if (!spki.children || spki.children.length < 2) return { algorithm: 'Unknown', bits: 0 };
  const algoSeq = spki.children[0];
  const keyBits = spki.children[1];
  let algo = 'Unknown', params = '';
  if (algoSeq.children && algoSeq.children.length > 0) {
    const oid = PEM.readOID(algoSeq.children[0].bytes);
    algo = OID_ALGO[oid] || oid;
    if (algoSeq.children.length > 1 && algoSeq.children[1].tag === 0x06) {
      const curveOid = PEM.readOID(algoSeq.children[1].bytes);
      params = OID_CURVES[curveOid] || curveOid;
    }
  }
  let bits = keyBits.bytes.length > 0 ? (keyBits.bytes.length - 1) * 8 : 0;
  if (algo === 'RSA' && keyBits.bytes.length > 1) {
    const inner = PEM.parseDER(keyBits.bytes, 1, keyBits.bytes.length);
    if (inner.length && inner[0].children && inner[0].children.length > 0) {
      bits = (inner[0].children[0].bytes.length - (inner[0].children[0].bytes[0] === 0 ? 1 : 0)) * 8;
    }
  }
  const display = algo + (params ? ' (' + params + ')' : '');
  return { algorithm: display, bits };
}

function clearCsrDec() {
  document.getElementById('csrdec-in').value = '';
  document.getElementById('csrdec-in').classList.remove('error');
  setError('csrdec-err', '');
  const r = document.getElementById('csrdec-results');
  r.style.display = 'none'; r.innerHTML = '';
}


/* ── CSR Generator ── */
const CSR = (() => {
  // ASN.1 DER encoding helpers
  function encodeLength(len) {
    if (len < 0x80) return [len];
    if (len < 0x100) return [0x81, len];
    return [0x82, (len >> 8) & 0xff, len & 0xff];
  }

  function encodeTLV(tag, value) {
    const v = value instanceof Uint8Array ? Array.from(value) : value;
    return [tag, ...encodeLength(v.length), ...v];
  }

  function encodeSequence(children) {
    const body = children.flat();
    return encodeTLV(0x30, body);
  }

  function encodeSet(children) {
    const body = children.flat();
    return encodeTLV(0x31, body);
  }

  function encodeOID(oid) {
    const parts = oid.split('.').map(Number);
    const bytes = [parts[0] * 40 + parts[1]];
    for (let i = 2; i < parts.length; i++) {
      let val = parts[i];
      if (val < 128) { bytes.push(val); }
      else {
        const chunks = [];
        while (val > 0) { chunks.unshift(val & 0x7f); val >>= 7; }
        for (let j = 0; j < chunks.length - 1; j++) chunks[j] |= 0x80;
        bytes.push(...chunks);
      }
    }
    return encodeTLV(0x06, bytes);
  }

  function encodeUTF8String(str) {
    const bytes = new TextEncoder().encode(str);
    return encodeTLV(0x0c, Array.from(bytes));
  }

  function encodePrintableString(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i));
    return encodeTLV(0x13, bytes);
  }

  function encodeIA5String(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i));
    return encodeTLV(0x16, bytes);
  }

  function encodeBitString(bytes) {
    // Prepend 0 unused bits
    return encodeTLV(0x03, [0, ...Array.from(bytes)]);
  }

  function encodeInteger(bytes) {
    const arr = Array.from(bytes);
    // Ensure positive (add leading 0 if high bit set)
    if (arr[0] & 0x80) arr.unshift(0);
    return encodeTLV(0x02, arr);
  }

  // OIDs for subject fields
  const OIDs = {
    CN: '2.5.4.3', O: '2.5.4.10', OU: '2.5.4.11',
    L: '2.5.4.7', ST: '2.5.4.8', C: '2.5.4.6',
    email: '1.2.840.113549.1.9.1',
  };

  const SIG_OIDS = {
    'RSA-SHA-256': '1.2.840.113549.1.1.11',
    'RSA-SHA-384': '1.2.840.113549.1.1.12',
    'RSA-SHA-512': '1.2.840.113549.1.1.13',
    'EC-SHA-256': '1.2.840.10045.4.3.2',
    'EC-SHA-384': '1.2.840.10045.4.3.3',
    'EC-SHA-512': '1.2.840.10045.4.3.4',
  };

  function buildSubject(fields) {
    const rdns = [];
    const order = ['CN', 'O', 'OU', 'L', 'ST', 'C', 'email'];
    for (const key of order) {
      const val = fields[key];
      if (!val) continue;
      const oid = encodeOID(OIDs[key]);
      let valEnc;
      if (key === 'C') valEnc = encodePrintableString(val.toUpperCase());
      else if (key === 'email') valEnc = encodeIA5String(val);
      else valEnc = encodeUTF8String(val);
      rdns.push(encodeSet([encodeSequence([oid, valEnc])]));
    }
    return encodeSequence(rdns);
  }

  function buildSANExtension(sans) {
    if (!sans.length) return null;
    const generalNames = [];
    for (const san of sans) {
      const trimmed = san.trim();
      if (!trimmed) continue;
      // Detect IP vs DNS
      const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed);
      if (isIP) {
        const octets = trimmed.split('.').map(Number);
        generalNames.push(encodeTLV(0x87, octets)); // [7] iPAddress
      } else {
        const bytes = new TextEncoder().encode(trimmed);
        generalNames.push(encodeTLV(0x82, Array.from(bytes))); // [2] dNSName
      }
    }
    if (!generalNames.length) return null;
    const sanSeq = encodeSequence(generalNames);
    const extReqValue = encodeSequence([
      encodeSequence([
        encodeOID('2.5.29.17'), // SAN OID
        encodeTLV(0x04, sanSeq), // OCTET STRING wrapping
      ])
    ]);
    // Wrap as [0] EXPLICIT for extensionRequest attribute
    return encodeSequence([
      encodeOID('1.2.840.113549.1.9.14'), // extensionRequest OID
      encodeSet([extReqValue]),
    ]);
  }

  async function generate(options) {
    const { cn, o, ou, l, st, c, email, sans, algo, sigHash } = options;
    if (!cn) throw new Error('Common Name (CN) is required.');

    const isEC = algo.startsWith('EC');
    let keyPair, spkiBytes;

    if (isEC) {
      const curve = algo === 'EC-P256' ? 'P-256' : 'P-384';
      keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: curve },
        true, ['sign', 'verify']
      );
    } else {
      const bits = algo === 'RSA-2048' ? 2048 : 4096;
      keyPair = await crypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: sigHash },
        true, ['sign', 'verify']
      );
    }

    // Export SPKI (public key)
    const spkiRaw = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    spkiBytes = new Uint8Array(spkiRaw);

    // Export PKCS#8 (private key)
    const pkcs8Raw = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const pkcs8Bytes = new Uint8Array(pkcs8Raw);

    // Build subject
    const subject = buildSubject({ CN: cn, O: o, OU: ou, L: l, ST: st, C: c, email });

    // Build CertificationRequestInfo
    const version = encodeTLV(0x02, [0]); // version 0

    // Attributes (SANs if any)
    const sanExt = buildSANExtension(sans);
    let attributes;
    if (sanExt) {
      // [0] IMPLICIT SET OF Attribute
      const attrBody = sanExt;
      attributes = encodeTLV(0xa0, attrBody);
    } else {
      attributes = encodeTLV(0xa0, []); // empty attributes
    }

    const certReqInfo = encodeSequence([
      version,
      subject,
      Array.from(spkiBytes),
      attributes,
    ]);

    // Sign the certReqInfo
    const certReqInfoBytes = new Uint8Array(certReqInfo);
    let signature;
    if (isEC) {
      const sigRaw = await crypto.subtle.sign(
        { name: 'ECDSA', hash: sigHash },
        keyPair.privateKey, certReqInfoBytes
      );
      // Convert from WebCrypto IEEE P1363 format to ASN.1 DER format
      signature = ieeeToAsn1Sig(new Uint8Array(sigRaw));
    } else {
      const sigRaw = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        keyPair.privateKey, certReqInfoBytes
      );
      signature = new Uint8Array(sigRaw);
    }

    // Signature algorithm
    const sigAlgoKey = (isEC ? 'EC' : 'RSA') + '-' + sigHash;
    const sigOid = SIG_OIDS[sigAlgoKey];
    let sigAlgoSeq;
    if (isEC) {
      sigAlgoSeq = encodeSequence([encodeOID(sigOid)]);
    } else {
      sigAlgoSeq = encodeSequence([encodeOID(sigOid), encodeTLV(0x05, [])]); // NULL params
    }

    // Build final CSR
    const csr = encodeSequence([
      Array.from(certReqInfoBytes),
      sigAlgoSeq,
      encodeBitString(signature),
    ]);

    const csrPem = toPEM(new Uint8Array(csr), 'CERTIFICATE REQUEST');
    const keyPem = toPEM(pkcs8Bytes, 'PRIVATE KEY');

    return { csrPem, keyPem };
  }

  // Convert ECDSA signature from IEEE P1363 (r||s) to ASN.1 DER
  function ieeeToAsn1Sig(raw) {
    const half = raw.length / 2;
    let r = raw.slice(0, half);
    let s = raw.slice(half);
    // Trim leading zeros but keep one if high bit set
    function trimInt(bytes) {
      let i = 0;
      while (i < bytes.length - 1 && bytes[i] === 0) i++;
      const trimmed = bytes.slice(i);
      if (trimmed[0] & 0x80) {
        const padded = new Uint8Array(trimmed.length + 1);
        padded.set(trimmed, 1);
        return padded;
      }
      return trimmed;
    }
    r = trimInt(r);
    s = trimInt(s);
    const rEnc = encodeTLV(0x02, Array.from(r));
    const sEnc = encodeTLV(0x02, Array.from(s));
    return new Uint8Array(encodeSequence([rEnc, sEnc]));
  }

  function toPEM(der, label) {
    const b64 = btoa(String.fromCharCode(...der));
    const lines = b64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
  }

  return { generate };
})();

function csrAlgoChange() {
  // Adjust signature options based on key type — all hashes work for both
}

async function csrGenerate() {
  setError('csr-err', '');
  const resultsEl = document.getElementById('csr-results');
  resultsEl.style.display = 'none';

  const cn = document.getElementById('csr-cn').value.trim();
  const o = document.getElementById('csr-o').value.trim();
  const ou = document.getElementById('csr-ou').value.trim();
  const l = document.getElementById('csr-l').value.trim();
  const st = document.getElementById('csr-st').value.trim();
  const c = document.getElementById('csr-c').value.trim();
  const email = document.getElementById('csr-email').value.trim();
  const sansRaw = document.getElementById('csr-sans').value.trim();
  const sans = sansRaw ? sansRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  const algo = document.getElementById('csr-algo').value;
  const sigHash = document.getElementById('csr-sig').value;

  try {
    const { csrPem, keyPem } = await CSR.generate({ cn, o, ou, l, st, c, email, sans, algo, sigHash });
    document.getElementById('csr-out').value = csrPem;
    document.getElementById('csr-key-out').value = keyPem;
    resultsEl.style.display = 'flex';
  } catch (e) {
    setError('csr-err', e.message);
  }
}

function csrCopyCSR() {
  const text = document.getElementById('csr-out').value;
  if (!text) { showToast('Nothing to copy'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('CSR copied!'));
}

function csrCopyKey() {
  const text = document.getElementById('csr-key-out').value;
  if (!text) { showToast('Nothing to copy'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('Private key copied!'));
}

function csrDownload(type) {
  const text = type === 'csr' ? document.getElementById('csr-out').value : document.getElementById('csr-key-out').value;
  if (!text) return;
  const cn = document.getElementById('csr-cn').value.trim().replace(/[^a-zA-Z0-9.-]/g, '_') || 'certificate';
  const filename = type === 'csr' ? `${cn}.csr` : `${cn}.key`;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function csrClear() {
  ['csr-cn', 'csr-o', 'csr-ou', 'csr-l', 'csr-st', 'csr-c', 'csr-email', 'csr-sans'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('csr-out').value = '';
  document.getElementById('csr-key-out').value = '';
  document.getElementById('csr-results').style.display = 'none';
  setError('csr-err', '');
}


/* ── Keystore / Truststore Viewer ── */
const KEYSTORE = (() => {

  // Detect file format from magic bytes
  function detectFormat(buf) {
    const u8 = new Uint8Array(buf);
    // JKS magic: 0xFEEDFEED
    if (u8.length > 4 && u8[0] === 0xFE && u8[1] === 0xED && u8[2] === 0xFE && u8[3] === 0xED) return 'jks';
    // PEM text
    if (u8.length > 10) {
      const head = new TextDecoder().decode(u8.slice(0, 30));
      if (head.includes('-----BEGIN')) return 'pem';
    }
    // PKCS#12: starts with ASN.1 SEQUENCE
    if (u8.length > 2 && u8[0] === 0x30) return 'p12';
    return 'unknown';
  }

  // ── JKS Parser ──
  // JKS stores trusted certs in the clear; password only for integrity check.
  function parseJKS(buf) {
    const dv = new DataView(buf);
    const u8 = new Uint8Array(buf);
    let pos = 0;

    const magic = dv.getUint32(pos); pos += 4;
    if (magic !== 0xFEEDFEED) throw new Error('Not a valid JKS file (bad magic bytes).');

    const version = dv.getUint32(pos); pos += 4;
    const entryCount = dv.getUint32(pos); pos += 4;

    const entries = [];
    for (let e = 0; e < entryCount; e++) {
      const tag = dv.getUint32(pos); pos += 4; // 1=privateKey, 2=trustedCert

      // Alias (UTF-16 length-prefixed)
      const aliasLen = dv.getUint16(pos); pos += 2;
      const aliasBytes = u8.slice(pos, pos + aliasLen);
      const alias = new TextDecoder().decode(aliasBytes);
      pos += aliasLen;

      // Timestamp (8 bytes, ms since epoch)
      const tsHi = dv.getUint32(pos); pos += 4;
      const tsLo = dv.getUint32(pos); pos += 4;
      const timestamp = new Date(tsHi * 0x100000000 + tsLo);

      const derCerts = [];

      if (tag === 2) {
        // Trusted certificate entry
        const certTypeLen = dv.getUint16(pos); pos += 2;
        pos += certTypeLen; // skip cert type string ("X.509")
        const certDataLen = dv.getUint32(pos); pos += 4;
        derCerts.push(new Uint8Array(buf.slice(pos, pos + certDataLen)));
        pos += certDataLen;
      } else if (tag === 1) {
        // Private key entry — skip encrypted key, read cert chain
        const keyLen = dv.getUint32(pos); pos += 4;
        pos += keyLen; // skip encrypted private key
        const chainLen = dv.getUint32(pos); pos += 4;
        for (let c = 0; c < chainLen; c++) {
          const cTypeLen = dv.getUint16(pos); pos += 2;
          pos += cTypeLen;
          const cDataLen = dv.getUint32(pos); pos += 4;
          derCerts.push(new Uint8Array(buf.slice(pos, pos + cDataLen)));
          pos += cDataLen;
        }
      }

      entries.push({
        alias,
        type: tag === 2 ? 'Trusted Certificate' : 'Private Key + Certificate Chain',
        timestamp,
        derCerts,
      });
    }
    return entries;
  }

  // ── PKCS#12 Parser ──
  // Implements PKCS#12 KDF (RFC 7292 App B) + 3DES-CBC for legacy keystores.

  // SHA-1 (sync, for KDF — Web Crypto is async so we need our own for the tight KDF loop)
  function sha1(data) {
    let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
    const msg = new Uint8Array(data);
    const bitLen = msg.length * 8;
    // Pre-processing: padding
    const padded = new Uint8Array(Math.ceil((msg.length + 9) / 64) * 64);
    padded.set(msg);
    padded[msg.length] = 0x80;
    const dv = new DataView(padded.buffer);
    dv.setUint32(padded.length - 4, bitLen, false);

    function rotl(n, s) { return ((n << s) | (n >>> (32 - s))) >>> 0; }

    for (let i = 0; i < padded.length; i += 64) {
      const w = new Uint32Array(80);
      for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4, false);
      for (let j = 16; j < 80; j++) w[j] = rotl(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);

      let a = h0, b = h1, c = h2, d = h3, e = h4;
      for (let j = 0; j < 80; j++) {
        let f, k;
        if (j < 20)      { f = (b & c) | ((~b) & d); k = 0x5A827999; }
        else if (j < 40) { f = b ^ c ^ d;             k = 0x6ED9EBA1; }
        else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
        else              { f = b ^ c ^ d;             k = 0xCA62C1D6; }
        const temp = (rotl(a, 5) + f + e + k + w[j]) >>> 0;
        e = d; d = c; c = rotl(b, 30); b = a; a = temp;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    const out = new Uint8Array(20);
    const odv = new DataView(out.buffer);
    odv.setUint32(0, h0); odv.setUint32(4, h1); odv.setUint32(8, h2);
    odv.setUint32(12, h3); odv.setUint32(16, h4);
    return out;
  }

  // PKCS#12 KDF (RFC 7292 Appendix B)
  function pkcs12KDF(password, salt, iterations, id, keyLen) {
    const v = 64; // SHA-1 block size
    const u = 20; // SHA-1 digest size

    // D = id repeated v times
    const D = new Uint8Array(v);
    D.fill(id);

    // Convert password to BMPString (big-endian UTF-16) + 2 null bytes
    const passBytes = new Uint8Array(password.length * 2 + 2);
    for (let i = 0; i < password.length; i++) {
      const code = password.charCodeAt(i);
      passBytes[i * 2] = (code >> 8) & 0xff;
      passBytes[i * 2 + 1] = code & 0xff;
    }
    // Last 2 bytes are already 0

    function fillAndCeil(input) {
      if (input.length === 0) return new Uint8Array(0);
      const len = Math.ceil(input.length / v) * v;
      const out = new Uint8Array(len);
      for (let i = 0; i < len; i++) out[i] = input[i % input.length];
      return out;
    }

    const S = fillAndCeil(salt);
    const P = fillAndCeil(passBytes);
    const I = new Uint8Array(S.length + P.length);
    I.set(S); I.set(P, S.length);

    let result = new Uint8Array(0);
    while (result.length < keyLen) {
      // Hash: SHA1(D || I) iterated
      const toHash = new Uint8Array(v + I.length);
      toHash.set(D); toHash.set(I, v);
      let A = sha1(toHash);
      for (let i = 1; i < iterations; i++) A = sha1(A);

      // Append A to result
      const newResult = new Uint8Array(result.length + A.length);
      newResult.set(result); newResult.set(A, result.length);
      result = newResult;

      if (result.length >= keyLen) break;

      // Update I: B = A repeated to v bytes, then I_j = (I_j + B + 1) mod 2^v
      const B = new Uint8Array(v);
      for (let i = 0; i < v; i++) B[i] = A[i % u];
      for (let j = 0; j < I.length; j += v) {
        let carry = 1;
        for (let k = v - 1; k >= 0; k--) {
          const sum = I[j + k] + B[k] + carry;
          I[j + k] = sum & 0xff;
          carry = sum >> 8;
        }
      }
    }
    return result.slice(0, keyLen);
  }

  // ── DES Implementation (for 3DES-CBC) ──
  // Initial permutation table
  const IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,
    57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
  const FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,
    36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
  const E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,
    24,25,26,27,28,29,28,29,30,31,32,1];
  const P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
  const S = [
    [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
    [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
    [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
    [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
    [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
    [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
    [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
    [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,2,0,14,9,11,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,11,14,1,7,4,0,9,12,14,2,3,5,10,15,6,8]
  ];
  const PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,
    63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
  const PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
  const SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];

  function permute(block, table, n) {
    const out = new Uint8Array(Math.ceil(table.length / 8));
    for (let i = 0; i < table.length; i++) {
      const srcBit = table[i] - 1;
      const srcByte = Math.floor(srcBit / 8);
      const srcOffset = 7 - (srcBit % 8);
      if (block[srcByte] & (1 << srcOffset)) {
        const dstByte = Math.floor(i / 8);
        const dstOffset = 7 - (i % 8);
        out[dstByte] |= (1 << dstOffset);
      }
    }
    return out;
  }

  function desGenerateSubkeys(key8) {
    const pc1 = permute(key8, PC1);
    let C = 0, D = 0;
    for (let i = 0; i < 28; i++) {
      const byte = Math.floor(i / 8);
      const bit = 7 - (i % 8);
      if (pc1[byte] & (1 << bit)) C |= (1 << (27 - i));
    }
    for (let i = 0; i < 28; i++) {
      const byte = Math.floor((i + 28) / 8);
      const bit = 7 - ((i + 28) % 8);
      if (pc1[byte] & (1 << bit)) D |= (1 << (27 - i));
    }

    const subkeys = [];
    for (let round = 0; round < 16; round++) {
      const shift = SHIFTS[round];
      C = ((C << shift) | (C >>> (28 - shift))) & 0x0FFFFFFF;
      D = ((D << shift) | (D >>> (28 - shift))) & 0x0FFFFFFF;

      const cd = new Uint8Array(7);
      for (let i = 0; i < 28; i++) {
        if (C & (1 << (27 - i))) {
          const byte = Math.floor(i / 8);
          cd[byte] |= (1 << (7 - (i % 8)));
        }
      }
      for (let i = 0; i < 28; i++) {
        if (D & (1 << (27 - i))) {
          const bit = i + 28;
          const byte = Math.floor(bit / 8);
          cd[byte] |= (1 << (7 - (bit % 8)));
        }
      }
      subkeys.push(permute(cd, PC2));
    }
    return subkeys;
  }

  function desProcessBlock(block8, subkeys, decrypt) {
    const ip = permute(block8, IP);
    let L = 0, R = 0;
    for (let i = 0; i < 32; i++) {
      const byte = Math.floor(i / 8);
      const bit = 7 - (i % 8);
      if (ip[byte] & (1 << bit)) L |= (1 << (31 - i));
    }
    for (let i = 0; i < 32; i++) {
      const byte = Math.floor((i + 32) / 8);
      const bit = 7 - ((i + 32) % 8);
      if (ip[byte] & (1 << bit)) R |= (1 << (31 - i));
    }

    for (let round = 0; round < 16; round++) {
      const sk = decrypt ? subkeys[15 - round] : subkeys[round];
      // Expand R
      const rBytes = new Uint8Array(4);
      rBytes[0] = (R >>> 24) & 0xff; rBytes[1] = (R >>> 16) & 0xff;
      rBytes[2] = (R >>> 8) & 0xff; rBytes[3] = R & 0xff;
      const expanded = permute(rBytes, E);

      // XOR with subkey
      for (let i = 0; i < 6; i++) expanded[i] ^= sk[i];

      // S-box substitution
      let sOut = 0;
      for (let i = 0; i < 8; i++) {
        const offset = i * 6;
        let bits6 = 0;
        for (let b = 0; b < 6; b++) {
          const byteIdx = Math.floor((offset + b) / 8);
          const bitIdx = 7 - ((offset + b) % 8);
          if (expanded[byteIdx] & (1 << bitIdx)) bits6 |= (1 << (5 - b));
        }
        const row = ((bits6 >> 5) << 1) | (bits6 & 1);
        const col = (bits6 >> 1) & 0xf;
        sOut = (sOut << 4) | S[i][row * 16 + col];
      }

      // P permutation
      const sBytes = new Uint8Array(4);
      sBytes[0] = (sOut >>> 24) & 0xff; sBytes[1] = (sOut >>> 16) & 0xff;
      sBytes[2] = (sOut >>> 8) & 0xff; sBytes[3] = sOut & 0xff;
      const pOut = permute(sBytes, P);
      let f = 0;
      for (let i = 0; i < 4; i++) f = (f << 8) | pOut[i];

      const newR = (L ^ f) >>> 0;
      L = R;
      R = newR;
    }

    // Combine R||L (swapped) and final permutation
    const rl = new Uint8Array(8);
    rl[0] = (R >>> 24) & 0xff; rl[1] = (R >>> 16) & 0xff;
    rl[2] = (R >>> 8) & 0xff; rl[3] = R & 0xff;
    rl[4] = (L >>> 24) & 0xff; rl[5] = (L >>> 16) & 0xff;
    rl[6] = (L >>> 8) & 0xff; rl[7] = L & 0xff;
    return permute(rl, FP);
  }

  function tripleDES_CBC_decrypt(data, key24, iv8) {
    const k1 = key24.slice(0, 8), k2 = key24.slice(8, 16), k3 = key24.slice(16, 24);
    const sk1 = desGenerateSubkeys(k1);
    const sk2 = desGenerateSubkeys(k2);
    const sk3 = desGenerateSubkeys(k3);
    const out = new Uint8Array(data.length);
    let prevCipher = iv8.slice();

    for (let i = 0; i < data.length; i += 8) {
      const block = data.slice(i, i + 8);
      // 3DES decrypt: D_k1(E_k2(D_k3(block)))
      let tmp = desProcessBlock(block, sk3, true);
      tmp = desProcessBlock(tmp, sk2, false);
      tmp = desProcessBlock(tmp, sk1, true);
      // XOR with previous ciphertext (CBC)
      for (let j = 0; j < 8; j++) out[i + j] = tmp[j] ^ prevCipher[j];
      prevCipher = block;
    }

    // Remove PKCS#5/PKCS#7 padding
    const padLen = out[out.length - 1];
    if (padLen > 0 && padLen <= 8) {
      return out.slice(0, out.length - padLen);
    }
    return out;
  }

  // Parse PKCS#12 / PFX
  function parsePKCS12(buf, password) {
    const u8 = new Uint8Array(buf);
    const root = PEM.parseDER(u8, 0, u8.length);
    if (!root.length || !root[0].children) throw new Error('Invalid PKCS#12 structure.');

    const pfx = root[0];
    if (!pfx.children || pfx.children.length < 2) throw new Error('Invalid PFX structure.');

    // version should be 3
    const authSafeContent = pfx.children[1]; // ContentInfo
    if (!authSafeContent.children || authSafeContent.children.length < 2)
      throw new Error('Missing AuthenticatedSafe.');

    // Get the authSafe data (may be wrapped in [0] EXPLICIT)
    let authSafeData;
    const contentNode = authSafeContent.children[1];
    if (contentNode.tag === 0xa0 || (contentNode.tag & 0x80)) {
      // EXPLICIT wrapper
      const inner = PEM.parseDER(contentNode.bytes, 0, contentNode.bytes.length);
      if (inner.length && inner[0].tag === 0x04) {
        authSafeData = inner[0].bytes;
      } else if (inner.length) {
        authSafeData = inner[0].bytes;
      }
    } else if (contentNode.tag === 0x04) {
      authSafeData = contentNode.bytes;
    }
    if (!authSafeData) throw new Error('Could not read AuthenticatedSafe data.');

    // AuthenticatedSafe = SEQUENCE of ContentInfo
    const authSafe = PEM.parseDER(authSafeData, 0, authSafeData.length);
    if (!authSafe.length || !authSafe[0].children) throw new Error('Invalid AuthenticatedSafe.');

    const entries = [];

    for (const contentInfo of authSafe[0].children) {
      if (!contentInfo.children || contentInfo.children.length < 2) continue;
      const oid = PEM.readOID(contentInfo.children[0].bytes);

      let safeBagsBytes;

      if (oid === '1.2.840.113549.1.7.1') {
        // pkcs7-data (unencrypted) — EXPLICIT [0] OCTET STRING
        const wrapper = contentInfo.children[1];
        const inner = PEM.parseDER(wrapper.bytes, 0, wrapper.bytes.length);
        if (inner.length && inner[0].tag === 0x04) safeBagsBytes = inner[0].bytes;

      } else if (oid === '1.2.840.113549.1.7.6') {
        // pkcs7-encryptedData
        if (!password) throw new Error('PKCS#12 file is encrypted. Please provide a password.');
        const wrapper = contentInfo.children[1];
        const inner = PEM.parseDER(wrapper.bytes, 0, wrapper.bytes.length);
        if (!inner.length || !inner[0].children) continue;
        const encData = inner[0]; // EncryptedData
        // version + EncryptedContentInfo
        const encContentInfo = encData.children[1];
        if (!encContentInfo.children || encContentInfo.children.length < 3) continue;

        // contentEncryptionAlgorithm
        const algoSeq = encContentInfo.children[1];
        if (!algoSeq.children || algoSeq.children.length < 2) continue;
        const algoOid = PEM.readOID(algoSeq.children[0].bytes);

        // Parse PBE parameters
        const pbeParams = algoSeq.children[1];
        if (!pbeParams.children || pbeParams.children.length < 2) continue;
        const salt = pbeParams.children[0].bytes;
        let iterations = 0;
        const iterBytes = pbeParams.children[1].bytes;
        for (let i = 0; i < iterBytes.length; i++) iterations = iterations * 256 + iterBytes[i];

        // Get encrypted content (may be IMPLICIT [0])
        const encContentNode = encContentInfo.children[2];
        const encBytes = encContentNode.bytes;

        // Derive key and IV using PKCS#12 KDF
        let decrypted;
        if (algoOid === '1.2.840.113549.1.12.1.3' || algoOid === '1.2.840.113549.1.12.1.6') {
          // pbeWithSHA1And3-KeyTripleDES-CBC or pbeWithSHA1And40BitRC2-CBC
          // For 3DES: 24-byte key, 8-byte IV
          const keyLen = algoOid.endsWith('.3') ? 24 : 5;
          const key = pkcs12KDF(password, salt, iterations, 1, keyLen);
          const iv = pkcs12KDF(password, salt, iterations, 2, 8);

          if (keyLen === 24) {
            decrypted = tripleDES_CBC_decrypt(encBytes, key, iv);
          } else {
            // RC2 not implemented — skip this container
            continue;
          }
        } else {
          continue; // Unknown algorithm
        }

        safeBagsBytes = decrypted;
      }

      if (!safeBagsBytes) continue;

      // Parse SafeContents = SEQUENCE of SafeBag
      const safeBags = PEM.parseDER(safeBagsBytes, 0, safeBagsBytes.length);
      if (!safeBags.length || !safeBags[0].children) continue;

      for (const safeBag of safeBags[0].children) {
        if (!safeBag.children || safeBag.children.length < 2) continue;
        const bagOid = PEM.readOID(safeBag.children[0].bytes);

        // Extract friendly name from bag attributes if present
        let alias = '';
        if (safeBag.children.length > 2) {
          const attrs = safeBag.children[2];
          const attrNodes = (attrs.tag & 0x20) ? (attrs.children || PEM.parseDER(attrs.bytes, 0, attrs.bytes.length)) : PEM.parseDER(attrs.bytes, 0, attrs.bytes.length);
          for (const attr of attrNodes) {
            if (!attr.children || attr.children.length < 2) continue;
            const attrOid = PEM.readOID(attr.children[0].bytes);
            if (attrOid === '1.2.840.113549.1.9.20') {
              // friendlyName (BMPString)
              const valSet = attr.children[1];
              const valNode = valSet.children ? valSet.children[0] : valSet;
              const bmpBytes = valNode.bytes;
              let name = '';
              for (let i = 0; i < bmpBytes.length; i += 2) {
                name += String.fromCharCode((bmpBytes[i] << 8) | bmpBytes[i + 1]);
              }
              alias = name;
            }
          }
        }

        if (bagOid === '1.2.840.113549.1.12.10.1.1') {
          // keyBag or pkcs8ShroudedKeyBag — private key, just note it
          entries.push({ alias: alias || 'Private Key', type: 'Private Key', timestamp: null, derCerts: [] });
        } else if (bagOid === '1.2.840.113549.1.12.10.1.2') {
          // pkcs8ShroudedKeyBag
          entries.push({ alias: alias || 'Private Key', type: 'Private Key (Encrypted)', timestamp: null, derCerts: [] });
        } else if (bagOid === '1.2.840.113549.1.12.10.1.3') {
          // certBag
          const bagValue = safeBag.children[1];
          const inner = PEM.parseDER(bagValue.bytes, 0, bagValue.bytes.length);
          if (inner.length && inner[0].children && inner[0].children.length >= 2) {
            const certContent = inner[0].children[1];
            const certInner = PEM.parseDER(certContent.bytes, 0, certContent.bytes.length);
            if (certInner.length && certInner[0].tag === 0x04) {
              entries.push({
                alias: alias || 'Certificate',
                type: 'Certificate',
                timestamp: null,
                derCerts: [new Uint8Array(certInner[0].bytes)],
              });
            }
          }
        }
      }
    }
    return entries;
  }

  // ── PEM bundle parser ──
  function parsePEMBundle(text) {
    const blocks = text.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
    if (!blocks || !blocks.length) throw new Error('No PEM certificates found.');
    return blocks.map((block, i) => {
      const b64 = block.replace(/-----BEGIN CERTIFICATE-----/, '').replace(/-----END CERTIFICATE-----/, '').replace(/\s/g, '');
      const raw = atob(b64);
      const der = new Uint8Array(raw.length);
      for (let j = 0; j < raw.length; j++) der[j] = raw.charCodeAt(j);
      return { alias: 'Certificate ' + (i + 1), type: 'Certificate', timestamp: null, derCerts: [der] };
    });
  }

  return { detectFormat, parseJKS, parsePKCS12, parsePEMBundle };
})();

async function keystoreDecode() {
  const fileInput = document.getElementById('ks-file');
  const passInput = document.getElementById('ks-pass');
  const resultsEl = document.getElementById('ks-results');
  const summaryEl = document.getElementById('ks-summary');
  setError('ks-err', '');
  resultsEl.innerHTML = '';
  resultsEl.style.display = 'none';
  summaryEl.style.display = 'none';

  if (!fileInput.files.length) { setError('ks-err', 'Please select a keystore file.'); return; }

  const file = fileInput.files[0];
  const buf = await file.arrayBuffer();
  const format = KEYSTORE.detectFormat(buf);

  if (format === 'unknown') { setError('ks-err', 'Unrecognized file format. Supported: JKS, PKCS#12/PFX, PEM.'); return; }

  let entries;
  try {
    if (format === 'jks') {
      entries = KEYSTORE.parseJKS(buf);
    } else if (format === 'p12') {
      entries = KEYSTORE.parsePKCS12(buf, passInput.value);
    } else {
      const text = new TextDecoder().decode(new Uint8Array(buf));
      entries = KEYSTORE.parsePEMBundle(text);
    }
  } catch (e) {
    setError('ks-err', e.message); return;
  }

  if (!entries.length) { setError('ks-err', 'No entries found in the keystore.'); return; }

  const certCount = entries.filter(e => e.derCerts.length > 0).reduce((s, e) => s + e.derCerts.length, 0);
  const keyCount = entries.filter(e => e.type.includes('Private Key')).length;
  summaryEl.innerHTML = `<strong>${entries.length}</strong> entries · <strong>${certCount}</strong> certificate${certCount !== 1 ? 's' : ''}${keyCount ? ` · <strong>${keyCount}</strong> private key${keyCount !== 1 ? 's' : ''}` : ''} · Format: <strong>${format.toUpperCase()}</strong>`;
  summaryEl.style.display = 'block';

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const nameFieldLabels = {
    CN: 'Common Name', O: 'Organization', OU: 'Org Unit',
    L: 'Locality', ST: 'State', C: 'Country',
    emailAddress: 'Email', DC: 'Domain Component',
  };
  const nameFieldOrder = ['CN', 'O', 'OU', 'L', 'ST', 'C', 'emailAddress', 'DC'];

  function renderNameFields(nameObj) {
    const f = nameObj.fields;
    const allKeys = nameFieldOrder.filter(k => f[k]).concat(Object.keys(f).filter(k => !nameFieldOrder.includes(k)));
    return allKeys.map(k => {
      const label = nameFieldLabels[k] || k;
      return `<div class="pem-field"><span class="pem-label">${esc(label)}</span><span class="pem-value">${esc(f[k])}</span></div>`;
    }).join('');
  }

  let html = '';
  for (let ei = 0; ei < entries.length; ei++) {
    const entry = entries[ei];
    const typeBadge = entry.type.includes('Private Key')
      ? '<span class="ks-badge ks-badge-key">Private Key</span>'
      : '<span class="ks-badge ks-badge-cert">Certificate</span>';

    html += `<div class="ks-entry">
      <div class="ks-entry-header">
        ${typeBadge}
        <span class="ks-alias">${esc(entry.alias)}</span>
        ${entry.timestamp ? `<span class="ks-ts">${entry.timestamp.toLocaleDateString()}</span>` : ''}
      </div>`;

    if (entry.derCerts.length > 0) {
      const certs = await PEM.decodeDER(entry.derCerts);
      for (let ci = 0; ci < certs.length; ci++) {
        const cert = certs[ci];
        const statusCls = cert.isExpired ? 'pem-expired' : cert.isNotYetValid ? 'pem-expired' : 'pem-valid';
        const statusMsg = cert.isExpired ? 'EXPIRED' : cert.isNotYetValid ? 'NOT YET VALID' : 'VALID';
        const chainLabel = entry.derCerts.length > 1 ? `<div class="pem-cert-title">Chain Certificate ${ci + 1} of ${entry.derCerts.length}</div>` : '';

        html += `${chainLabel}<div class="pem-cert">
          <div class="pem-status ${statusCls}">${statusMsg}</div>
          <div class="pem-section"><div class="pem-section-title">Subject</div>${renderNameFields(cert.subject)}</div>
          ${cert.sans.length ? `<div class="pem-section"><div class="pem-section-title">SANs (${cert.sans.length})</div><div class="pem-sans">${cert.sans.map(s => `<span class="pem-san-tag">${esc(s)}</span>`).join('')}</div></div>` : ''}
          <div class="pem-section"><div class="pem-section-title">Issuer</div>${renderNameFields(cert.issuer)}</div>
          <div class="pem-section"><div class="pem-section-title">Validity</div>
            <div class="pem-field"><span class="pem-label">Valid From</span><span class="pem-value">${cert.notBefore ? cert.notBefore.toUTCString() : 'N/A'}</span></div>
            <div class="pem-field"><span class="pem-label">Valid To</span><span class="pem-value">${cert.notAfter ? cert.notAfter.toUTCString() : 'N/A'}</span></div>
          </div>
          <div class="pem-section"><div class="pem-section-title">Details</div>
            <div class="pem-field"><span class="pem-label">Version</span><span class="pem-value">V${cert.version}</span></div>
            <div class="pem-field"><span class="pem-label">Serial</span><span class="pem-value" style="word-break:break-all;">${esc(String(cert.serial))}</span></div>
            <div class="pem-field"><span class="pem-label">Sig Algo</span><span class="pem-value">${esc(cert.sigAlgo)}</span></div>
            <div class="pem-field"><span class="pem-label">Public Key</span><span class="pem-value">${esc(cert.pubKeyInfo.algorithm)} (${cert.pubKeyInfo.bits} bit)</span></div>
            ${cert.basicConstraints ? `<div class="pem-field"><span class="pem-label">Basic Constraints</span><span class="pem-value">${esc(cert.basicConstraints)}</span></div>` : ''}
            ${cert.keyUsage.length ? `<div class="pem-field"><span class="pem-label">Key Usage</span><span class="pem-value">${cert.keyUsage.map(esc).join(', ')}</span></div>` : ''}
            ${cert.extKeyUsage.length ? `<div class="pem-field"><span class="pem-label">Ext Key Usage</span><span class="pem-value">${cert.extKeyUsage.map(esc).join(', ')}</span></div>` : ''}
          </div>
          <div class="pem-section"><div class="pem-section-title">Fingerprints</div>
            <div class="pem-field"><span class="pem-label">SHA-1</span><span class="pem-value pem-hash">${cert.sha1}</span>
              <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${cert.sha1.replace(/'/g, "\\'")}')">Copy</button></div>
            <div class="pem-field"><span class="pem-label">SHA-256</span><span class="pem-value pem-hash">${cert.sha256}</span>
              <button class="btn btn-secondary" style="padding:2px 10px;font-size:0.7rem;flex-shrink:0;" onclick="copyVal('${cert.sha256.replace(/'/g, "\\'")}')">Copy</button></div>
          </div>
        </div>`;
      }
    } else {
      html += '<div class="ks-no-cert">Private key data (encrypted) — certificate not available in this entry.</div>';
    }

    html += '</div>';
  }

  resultsEl.innerHTML = html;
  resultsEl.style.display = 'flex';
}

function clearKeystore() {
  document.getElementById('ks-file').value = '';
  document.getElementById('ks-pass').value = '';
  setError('ks-err', '');
  const r = document.getElementById('ks-results');
  r.style.display = 'none'; r.innerHTML = '';
  document.getElementById('ks-summary').style.display = 'none';
}


/* ── Theme toggle ── */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('theme-toggle');
  btn.textContent = isDark ? '🌙 Dark' : '☀️ Light';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

/* Restore saved theme on load */
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('theme-toggle').textContent = '☀️ Light';
  }
})();

/* ── Live encode/decode on input ── */
document.getElementById('htmlenc-in').addEventListener('input', htmlEncode);
document.getElementById('htmldec-in').addEventListener('input', htmlDecode);
document.getElementById('b64enc-in').addEventListener('input', b64Encode);
document.getElementById('b64dec-in').addEventListener('input', b64Decode);
document.getElementById('urlenc-in').addEventListener('input', urlEncode);
document.getElementById('urldec-in').addEventListener('input', urlDecode);
document.getElementById('jwt-in').addEventListener('input', jwtDecode);
document.getElementById('json-in').addEventListener('input', jsonBeautify);
document.getElementById('xml-in').addEventListener('input', xmlBeautify);
document.getElementById('saml-in').addEventListener('input', samlDecode);
document.getElementById('ts-in').addEventListener('input', tsConvert);
document.getElementById('b64urlenc-in').addEventListener('input', b64urlEncode);
document.getElementById('b64urldec-in').addEventListener('input', b64urlDecode);
document.getElementById('regex-pattern').addEventListener('input', regexTest);
document.getElementById('regex-test').addEventListener('input', regexTest);
document.getElementById('pem-in').addEventListener('input', pemDecode);
document.getElementById('csrdec-in').addEventListener('input', csrDec);
// Init HTTP table on load
renderHttpTable('');

/* ── Time Zone Converter (WorldTimeBuddy-style) ── */

// World capitals timezone catalogue
const TZ_CATALOG = [
  { name: 'Kabul', country: 'Afghanistan', abbr: 'AFT', offset: 4.5 },
  { name: 'Tirana', country: 'Albania', abbr: 'CET', offset: 1 },
  { name: 'Algiers', country: 'Algeria', abbr: 'CET', offset: 1 },
  { name: 'Andorra la Vella', country: 'Andorra', abbr: 'CET', offset: 1 },
  { name: 'Luanda', country: 'Angola', abbr: 'WAT', offset: 1 },
  { name: "St. John's", country: 'Antigua and Barbuda', abbr: 'AST', offset: -4 },
  { name: 'Buenos Aires', country: 'Argentina', abbr: 'ART', offset: -3 },
  { name: 'Yerevan', country: 'Armenia', abbr: 'AMT', offset: 4 },
  { name: 'Canberra', country: 'Australia', abbr: 'AEST', offset: 10 },
  { name: 'Vienna', country: 'Austria', abbr: 'CET', offset: 1 },
  { name: 'Baku', country: 'Azerbaijan', abbr: 'AZT', offset: 4 },
  { name: 'Nassau', country: 'Bahamas', abbr: 'EST', offset: -5 },
  { name: 'Manama', country: 'Bahrain', abbr: 'AST', offset: 3 },
  { name: 'Dhaka', country: 'Bangladesh', abbr: 'BST', offset: 6 },
  { name: 'Bridgetown', country: 'Barbados', abbr: 'AST', offset: -4 },
  { name: 'Minsk', country: 'Belarus', abbr: 'MSK', offset: 3 },
  { name: 'Brussels', country: 'Belgium', abbr: 'CET', offset: 1 },
  { name: 'Belmopan', country: 'Belize', abbr: 'CST', offset: -6 },
  { name: 'Porto-Novo', country: 'Benin', abbr: 'WAT', offset: 1 },
  { name: 'Thimphu', country: 'Bhutan', abbr: 'BTT', offset: 6 },
  { name: 'Sucre', country: 'Bolivia', abbr: 'BOT', offset: -4 },
  { name: 'Sarajevo', country: 'Bosnia and Herzegovina', abbr: 'CET', offset: 1 },
  { name: 'Gaborone', country: 'Botswana', abbr: 'CAT', offset: 2 },
  { name: 'Brasília', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { name: 'Bandar Seri Begawan', country: 'Brunei', abbr: 'BNT', offset: 8 },
  { name: 'Sofia', country: 'Bulgaria', abbr: 'EET', offset: 2 },
  { name: 'Ouagadougou', country: 'Burkina Faso', abbr: 'GMT', offset: 0 },
  { name: 'Gitega', country: 'Burundi', abbr: 'CAT', offset: 2 },
  { name: 'Praia', country: 'Cabo Verde', abbr: 'CVT', offset: -1 },
  { name: 'Phnom Penh', country: 'Cambodia', abbr: 'ICT', offset: 7 },
  { name: 'Yaoundé', country: 'Cameroon', abbr: 'WAT', offset: 1 },
  { name: 'Ottawa', country: 'Canada', abbr: 'EST', offset: -5 },
  { name: 'Bangui', country: 'Central African Republic', abbr: 'WAT', offset: 1 },
  { name: "N'Djamena", country: 'Chad', abbr: 'WAT', offset: 1 },
  { name: 'Santiago', country: 'Chile', abbr: 'CLT', offset: -4 },
  { name: 'Beijing', country: 'China', abbr: 'CST', offset: 8 },
  { name: 'Bogotá', country: 'Colombia', abbr: 'COT', offset: -5 },
  { name: 'Moroni', country: 'Comoros', abbr: 'EAT', offset: 3 },
  { name: 'Brazzaville', country: 'Congo (Republic)', abbr: 'WAT', offset: 1 },
  { name: 'Kinshasa', country: 'Congo (Democratic Republic)', abbr: 'WAT', offset: 1 },
  { name: 'San José', country: 'Costa Rica', abbr: 'CST', offset: -6 },
  { name: 'Zagreb', country: 'Croatia', abbr: 'CET', offset: 1 },
  { name: 'Havana', country: 'Cuba', abbr: 'CST', offset: -5 },
  { name: 'Nicosia', country: 'Cyprus', abbr: 'EET', offset: 2 },
  { name: 'Prague', country: 'Czechia', abbr: 'CET', offset: 1 },
  { name: 'Yamoussoukro', country: "Côte d'Ivoire", abbr: 'GMT', offset: 0 },
  { name: 'Copenhagen', country: 'Denmark', abbr: 'CET', offset: 1 },
  { name: 'Djibouti', country: 'Djibouti', abbr: 'EAT', offset: 3 },
  { name: 'Roseau', country: 'Dominica', abbr: 'AST', offset: -4 },
  { name: 'Santo Domingo', country: 'Dominican Republic', abbr: 'AST', offset: -4 },
  { name: 'Quito', country: 'Ecuador', abbr: 'ECT', offset: -5 },
  { name: 'Cairo', country: 'Egypt', abbr: 'EET', offset: 2 },
  { name: 'San Salvador', country: 'El Salvador', abbr: 'CST', offset: -6 },
  { name: 'Malabo', country: 'Equatorial Guinea', abbr: 'WAT', offset: 1 },
  { name: 'Asmara', country: 'Eritrea', abbr: 'EAT', offset: 3 },
  { name: 'Tallinn', country: 'Estonia', abbr: 'EET', offset: 2 },
  { name: 'Mbabane', country: 'Eswatini', abbr: 'SAST', offset: 2 },
  { name: 'Addis Ababa', country: 'Ethiopia', abbr: 'EAT', offset: 3 },
  { name: 'Suva', country: 'Fiji', abbr: 'FJT', offset: 12 },
  { name: 'Helsinki', country: 'Finland', abbr: 'EET', offset: 2 },
  { name: 'Paris', country: 'France', abbr: 'CET', offset: 1 },
  { name: 'Libreville', country: 'Gabon', abbr: 'WAT', offset: 1 },
  { name: 'Banjul', country: 'Gambia', abbr: 'GMT', offset: 0 },
  { name: 'Tbilisi', country: 'Georgia', abbr: 'GET', offset: 4 },
  { name: 'Berlin', country: 'Germany', abbr: 'CET', offset: 1 },
  { name: 'Accra', country: 'Ghana', abbr: 'GMT', offset: 0 },
  { name: 'Athens', country: 'Greece', abbr: 'EET', offset: 2 },
  { name: "St. George's", country: 'Grenada', abbr: 'AST', offset: -4 },
  { name: 'Guatemala City', country: 'Guatemala', abbr: 'CST', offset: -6 },
  { name: 'Conakry', country: 'Guinea', abbr: 'GMT', offset: 0 },
  { name: 'Bissau', country: 'Guinea-Bissau', abbr: 'GMT', offset: 0 },
  { name: 'Georgetown', country: 'Guyana', abbr: 'GYT', offset: -4 },
  { name: 'Port-au-Prince', country: 'Haiti', abbr: 'EST', offset: -5 },
  { name: 'Vatican City', country: 'Holy See', abbr: 'CET', offset: 1 },
  { name: 'Tegucigalpa', country: 'Honduras', abbr: 'CST', offset: -6 },
  { name: 'Budapest', country: 'Hungary', abbr: 'CET', offset: 1 },
  { name: 'Reykjavik', country: 'Iceland', abbr: 'GMT', offset: 0 },
  { name: 'New Delhi', country: 'India', abbr: 'IST', offset: 5.5 },
  { name: 'Jakarta', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { name: 'Tehran', country: 'Iran', abbr: 'IRST', offset: 3.5 },
  { name: 'Baghdad', country: 'Iraq', abbr: 'AST', offset: 3 },
  { name: 'Dublin', country: 'Ireland', abbr: 'GMT', offset: 0 },
  { name: 'Jerusalem', country: 'Israel', abbr: 'IST', offset: 2 },
  { name: 'Rome', country: 'Italy', abbr: 'CET', offset: 1 },
  { name: 'Kingston', country: 'Jamaica', abbr: 'EST', offset: -5 },
  { name: 'Tokyo', country: 'Japan', abbr: 'JST', offset: 9 },
  { name: 'Amman', country: 'Jordan', abbr: 'EET', offset: 2 },
  { name: 'Astana', country: 'Kazakhstan', abbr: 'UTC+5', offset: 5 },
  { name: 'Nairobi', country: 'Kenya', abbr: 'EAT', offset: 3 },
  { name: 'Tarawa', country: 'Kiribati', abbr: 'GILT', offset: 12 },
  { name: 'Pyongyang', country: 'Korea (North)', abbr: 'KST', offset: 9 },
  { name: 'Seoul', country: 'Korea (South)', abbr: 'KST', offset: 9 },
  { name: 'Kuwait City', country: 'Kuwait', abbr: 'AST', offset: 3 },
  { name: 'Bishkek', country: 'Kyrgyzstan', abbr: 'KGT', offset: 6 },
  { name: 'Vientiane', country: 'Laos', abbr: 'ICT', offset: 7 },
  { name: 'Riga', country: 'Latvia', abbr: 'EET', offset: 2 },
  { name: 'Beirut', country: 'Lebanon', abbr: 'EET', offset: 2 },
  { name: 'Maseru', country: 'Lesotho', abbr: 'SAST', offset: 2 },
  { name: 'Monrovia', country: 'Liberia', abbr: 'GMT', offset: 0 },
  { name: 'Tripoli', country: 'Libya', abbr: 'EET', offset: 2 },
  { name: 'Vaduz', country: 'Liechtenstein', abbr: 'CET', offset: 1 },
  { name: 'Vilnius', country: 'Lithuania', abbr: 'EET', offset: 2 },
  { name: 'Luxembourg', country: 'Luxembourg', abbr: 'CET', offset: 1 },
  { name: 'Antananarivo', country: 'Madagascar', abbr: 'EAT', offset: 3 },
  { name: 'Lilongwe', country: 'Malawi', abbr: 'CAT', offset: 2 },
  { name: 'Kuala Lumpur', country: 'Malaysia', abbr: 'MYT', offset: 8 },
  { name: 'Malé', country: 'Maldives', abbr: 'MVT', offset: 5 },
  { name: 'Bamako', country: 'Mali', abbr: 'GMT', offset: 0 },
  { name: 'Valletta', country: 'Malta', abbr: 'CET', offset: 1 },
  { name: 'Majuro', country: 'Marshall Islands', abbr: 'MHT', offset: 12 },
  { name: 'Nouakchott', country: 'Mauritania', abbr: 'GMT', offset: 0 },
  { name: 'Port Louis', country: 'Mauritius', abbr: 'MUT', offset: 4 },
  { name: 'Mexico City', country: 'Mexico', abbr: 'CST', offset: -6 },
  { name: 'Palikir', country: 'Micronesia', abbr: 'PONT', offset: 11 },
  { name: 'Chișinău', country: 'Moldova', abbr: 'EET', offset: 2 },
  { name: 'Monaco', country: 'Monaco', abbr: 'CET', offset: 1 },
  { name: 'Ulaanbaatar', country: 'Mongolia', abbr: 'ULAT', offset: 8 },
  { name: 'Podgorica', country: 'Montenegro', abbr: 'CET', offset: 1 },
  { name: 'Rabat', country: 'Morocco', abbr: 'UTC+1', offset: 1 },
  { name: 'Maputo', country: 'Mozambique', abbr: 'CAT', offset: 2 },
  { name: 'Naypyidaw', country: 'Myanmar', abbr: 'MMT', offset: 6.5 },
  { name: 'Windhoek', country: 'Namibia', abbr: 'CAT', offset: 2 },
  { name: 'Yaren', country: 'Nauru', abbr: 'NRT', offset: 12 },
  { name: 'Kathmandu', country: 'Nepal', abbr: 'NPT', offset: 5.75 },
  { name: 'Amsterdam', country: 'Netherlands', abbr: 'CET', offset: 1 },
  { name: 'Wellington', country: 'New Zealand', abbr: 'NZST', offset: 12 },
  { name: 'Managua', country: 'Nicaragua', abbr: 'CST', offset: -6 },
  { name: 'Niamey', country: 'Niger', abbr: 'WAT', offset: 1 },
  { name: 'Abuja', country: 'Nigeria', abbr: 'WAT', offset: 1 },
  { name: 'Skopje', country: 'North Macedonia', abbr: 'CET', offset: 1 },
  { name: 'Oslo', country: 'Norway', abbr: 'CET', offset: 1 },
  { name: 'Muscat', country: 'Oman', abbr: 'GST', offset: 4 },
  { name: 'Islamabad', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { name: 'Ngerulmud', country: 'Palau', abbr: 'PWT', offset: 9 },
  { name: 'Ramallah', country: 'Palestine', abbr: 'EET', offset: 2 },
  { name: 'Panama City', country: 'Panama', abbr: 'EST', offset: -5 },
  { name: 'Port Moresby', country: 'Papua New Guinea', abbr: 'PGT', offset: 10 },
  { name: 'Asunción', country: 'Paraguay', abbr: 'PYT', offset: -4 },
  { name: 'Lima', country: 'Peru', abbr: 'PET', offset: -5 },
  { name: 'Manila', country: 'Philippines', abbr: 'PHT', offset: 8 },
  { name: 'Warsaw', country: 'Poland', abbr: 'CET', offset: 1 },
  { name: 'Lisbon', country: 'Portugal', abbr: 'WET', offset: 0 },
  { name: 'Doha', country: 'Qatar', abbr: 'AST', offset: 3 },
  { name: 'Bucharest', country: 'Romania', abbr: 'EET', offset: 2 },
  { name: 'Moscow', country: 'Russia', abbr: 'MSK', offset: 3 },
  { name: 'Kigali', country: 'Rwanda', abbr: 'CAT', offset: 2 },
  { name: 'Basseterre', country: 'Saint Kitts and Nevis', abbr: 'AST', offset: -4 },
  { name: 'Castries', country: 'Saint Lucia', abbr: 'AST', offset: -4 },
  { name: 'Kingstown', country: 'Saint Vincent and the Grenadines', abbr: 'AST', offset: -4 },
  { name: 'Apia', country: 'Samoa', abbr: 'WST', offset: 13 },
  { name: 'San Marino', country: 'San Marino', abbr: 'CET', offset: 1 },
  { name: 'São Tomé', country: 'São Tomé and Príncipe', abbr: 'GMT', offset: 0 },
  { name: 'Riyadh', country: 'Saudi Arabia', abbr: 'AST', offset: 3 },
  { name: 'Dakar', country: 'Senegal', abbr: 'GMT', offset: 0 },
  { name: 'Belgrade', country: 'Serbia', abbr: 'CET', offset: 1 },
  { name: 'Victoria', country: 'Seychelles', abbr: 'SCT', offset: 4 },
  { name: 'Freetown', country: 'Sierra Leone', abbr: 'GMT', offset: 0 },
  { name: 'Singapore', country: 'Singapore', abbr: 'SGT', offset: 8 },
  { name: 'Bratislava', country: 'Slovakia', abbr: 'CET', offset: 1 },
  { name: 'Ljubljana', country: 'Slovenia', abbr: 'CET', offset: 1 },
  { name: 'Honiara', country: 'Solomon Islands', abbr: 'SBT', offset: 11 },
  { name: 'Mogadishu', country: 'Somalia', abbr: 'EAT', offset: 3 },
  { name: 'Pretoria', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { name: 'Juba', country: 'South Sudan', abbr: 'CAT', offset: 2 },
  { name: 'Madrid', country: 'Spain', abbr: 'CET', offset: 1 },
  { name: 'Sri Jayawardenepura Kotte', country: 'Sri Lanka', abbr: 'IST', offset: 5.5 },
  { name: 'Khartoum', country: 'Sudan', abbr: 'CAT', offset: 2 },
  { name: 'Paramaribo', country: 'Suriname', abbr: 'SRT', offset: -3 },
  { name: 'Stockholm', country: 'Sweden', abbr: 'CET', offset: 1 },
  { name: 'Bern', country: 'Switzerland', abbr: 'CET', offset: 1 },
  { name: 'Damascus', country: 'Syria', abbr: 'EET', offset: 2 },
  { name: 'Taipei', country: 'Taiwan', abbr: 'CST', offset: 8 },
  { name: 'Dushanbe', country: 'Tajikistan', abbr: 'TJT', offset: 5 },
  { name: 'Dodoma', country: 'Tanzania', abbr: 'EAT', offset: 3 },
  { name: 'Bangkok', country: 'Thailand', abbr: 'ICT', offset: 7 },
  { name: 'Dili', country: 'Timor-Leste', abbr: 'TLT', offset: 9 },
  { name: 'Lomé', country: 'Togo', abbr: 'GMT', offset: 0 },
  { name: "Nuku'alofa", country: 'Tonga', abbr: 'TOT', offset: 13 },
  { name: 'Port of Spain', country: 'Trinidad and Tobago', abbr: 'AST', offset: -4 },
  { name: 'Tunis', country: 'Tunisia', abbr: 'CET', offset: 1 },
  { name: 'Ankara', country: 'Turkey', abbr: 'TRT', offset: 3 },
  { name: 'Ashgabat', country: 'Turkmenistan', abbr: 'TMT', offset: 5 },
  { name: 'Funafuti', country: 'Tuvalu', abbr: 'TVT', offset: 12 },
  { name: 'Kampala', country: 'Uganda', abbr: 'EAT', offset: 3 },
  { name: 'Kyiv', country: 'Ukraine', abbr: 'EET', offset: 2 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', abbr: 'GST', offset: 4 },
  { name: 'London', country: 'United Kingdom', abbr: 'GMT', offset: 0 },
  { name: 'Washington, D.C.', country: 'United States', abbr: 'EST', offset: -5 },
  { name: 'Montevideo', country: 'Uruguay', abbr: 'UYT', offset: -3 },
  { name: 'Tashkent', country: 'Uzbekistan', abbr: 'UZT', offset: 5 },
  { name: 'Port Vila', country: 'Vanuatu', abbr: 'VUT', offset: 11 },
  { name: 'Caracas', country: 'Venezuela', abbr: 'VET', offset: -4 },
  { name: 'Hanoi', country: 'Vietnam', abbr: 'ICT', offset: 7 },
  { name: "Sana'a", country: 'Yemen', abbr: 'AST', offset: 3 },
  { name: 'Lusaka', country: 'Zambia', abbr: 'CAT', offset: 2 },
  { name: 'Harare', country: 'Zimbabwe', abbr: 'CAT', offset: 2 },
  // Major named timezones (searchable by common names)
  { name: 'Pacific Time', country: 'US West Coast', abbr: 'PST', offset: -8 },
  { name: 'Mountain Time', country: 'US Mountain', abbr: 'MST', offset: -7 },
  { name: 'Central Time', country: 'US Central', abbr: 'CST', offset: -6 },
  { name: 'Eastern Time', country: 'US East Coast', abbr: 'EST', offset: -5 },
  { name: 'Alaska Time', country: 'US Alaska', abbr: 'AKST', offset: -9 },
  { name: 'Hawaii Time', country: 'US Hawaii', abbr: 'HST', offset: -10 },
  { name: 'Atlantic Time', country: 'Caribbean / Atlantic', abbr: 'AST', offset: -4 },
  { name: 'Newfoundland Time', country: 'Canada', abbr: 'NST', offset: -3.5 },
  { name: 'Central European Time', country: 'Europe', abbr: 'CET', offset: 1 },
  { name: 'Eastern European Time', country: 'Europe', abbr: 'EET', offset: 2 },
  { name: 'Western European Time', country: 'Europe', abbr: 'WET', offset: 0 },
  { name: 'Greenwich Mean Time', country: 'Global', abbr: 'GMT', offset: 0 },
  { name: 'Coordinated Universal Time', country: 'Global', abbr: 'UTC', offset: 0 },
  { name: 'Moscow Time', country: 'Russia', abbr: 'MSK', offset: 3 },
  { name: 'Gulf Standard Time', country: 'Persian Gulf', abbr: 'GST', offset: 4 },
  { name: 'India Standard Time', country: 'India', abbr: 'IST', offset: 5.5 },
  { name: 'Indochina Time', country: 'Southeast Asia', abbr: 'ICT', offset: 7 },
  { name: 'China Standard Time', country: 'China / Taiwan', abbr: 'CST', offset: 8 },
  { name: 'Japan Standard Time', country: 'Japan', abbr: 'JST', offset: 9 },
  { name: 'Korea Standard Time', country: 'South Korea', abbr: 'KST', offset: 9 },
  { name: 'Australian Eastern Time', country: 'Australia', abbr: 'AEST', offset: 10 },
  { name: 'Australian Central Time', country: 'Australia', abbr: 'ACST', offset: 9.5 },
  { name: 'Australian Western Time', country: 'Australia', abbr: 'AWST', offset: 8 },
  { name: 'New Zealand Time', country: 'New Zealand', abbr: 'NZST', offset: 12 },
  { name: 'Singapore Time', country: 'Singapore / Malaysia', abbr: 'SGT', offset: 8 },
  { name: 'Hong Kong Time', country: 'Hong Kong', abbr: 'HKT', offset: 8 },
  { name: 'South Africa Standard Time', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { name: 'East Africa Time', country: 'East Africa', abbr: 'EAT', offset: 3 },
  { name: 'West Africa Time', country: 'West Africa', abbr: 'WAT', offset: 1 },
  { name: 'Brasília Time', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { name: 'Argentina Time', country: 'Argentina', abbr: 'ART', offset: -3 },
];

// Active rows shown in the grid
let tzRows = [
  { name: 'New Delhi', country: 'India', abbr: 'IST', offset: 5.5 },
  { name: 'Brasília', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { name: 'London', country: 'United Kingdom', abbr: 'GMT', offset: 0 },
  { name: 'Washington, D.C.', country: 'United States', abbr: 'EST', offset: -5 },
  { name: 'Tokyo', country: 'Japan', abbr: 'JST', offset: 9 },
];

let tzSelectedUTCHour = null; // 0-23, which UTC hour is selected
let tzBaseDate = null; // Date object for the selected date (midnight UTC)

function formatTzTime(date) {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatTzDate(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function formatTzDateShort(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

function dateInOffset(utcMs, offsetHours) {
  return new Date(utcMs + offsetHours * 3600000);
}

// Hero clocks — live
function updateTzHero() {
  const now = Date.now();
  const ist = dateInOffset(now, 5.5);
  const brt = dateInOffset(now, -3);
  const heroIst = document.getElementById('tz-hero-ist');
  if (!heroIst) return;
  heroIst.textContent = formatTzTime(ist);
  document.getElementById('tz-hero-ist-date').textContent = formatTzDate(ist);
  document.getElementById('tz-hero-brt').textContent = formatTzTime(brt);
  document.getElementById('tz-hero-brt-date').textContent = formatTzDate(brt);
}
updateTzHero();
setInterval(updateTzHero, 1000);

// Format hour for cell display
function fmtHour(h) {
  const total = (((h % 24) + 24) % 24);       // e.g. 0.5, 13.75
  const hr = Math.floor(total);                // whole hour: 0, 13
  const frac = total - hr;                     // fractional part: 0.5, 0.75
  const min = Math.round(frac * 60);           // minutes: 30, 45
  const minStr = min > 0 ? ':' + String(min).padStart(2, '0') : '';
  const display = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  const ampm = hr < 12 ? 'AM' : 'PM';
  return { top: String(display) + minStr, bot: ampm };
}

// Color class for an hour (local hour in that timezone)
function hourClass(h) {
  const hr = ((Math.floor(h) % 24) + 24) % 24;
  if (hr >= 9 && hr < 18) return 'tz-day';
  if ((hr >= 7 && hr < 9) || (hr >= 18 && hr < 21)) return 'tz-fringe';
  return 'tz-night';
}

// Offset label like "+05:30" or "−03:00"
function offsetLabel(offset) {
  const sign = offset >= 0 ? '+' : '−';
  const abs = Math.abs(offset);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Render the grid ──
function tzRenderGrid() {
  const grid = document.getElementById('tz-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!tzBaseDate) tzSetToday();

  const baseMidnightUTC = tzBaseDate.getTime(); // midnight UTC of selected date

  tzRows.forEach((tz, rowIdx) => {
    const row = document.createElement('div');
    row.className = 'tz-row';

    // Label
    const label = document.createElement('div');
    label.className = 'tz-row-label';
    label.innerHTML = `<div class="tz-row-name">${tz.name}</div>
      <div class="tz-row-meta">${tz.country ? tz.country + ' · ' : ''}${tz.abbr} · UTC ${offsetLabel(tz.offset)}</div>`;
    row.appendChild(label);

    // Remove button (don't allow removing if only 1 row)
    if (tzRows.length > 1) {
      const rm = document.createElement('button');
      rm.className = 'tz-row-remove';
      rm.textContent = '✕';
      rm.title = 'Remove';
      rm.onclick = () => { tzRows.splice(rowIdx, 1); tzRenderGrid(); };
      row.appendChild(rm);
    }

    // Hour strip
    const strip = document.createElement('div');
    strip.className = 'tz-hours';

    for (let utcH = 0; utcH < 24; utcH++) {
      const localH = utcH + tz.offset;
      const localHNorm = ((Math.floor(localH) % 24) + 24) % 24;
      const { top, bot } = fmtHour(localH);

      const cell = document.createElement('div');
      cell.className = `tz-cell ${hourClass(localH)}`;
      if (localHNorm === 0) cell.classList.add('tz-midnight');
      if (utcH === tzSelectedUTCHour) cell.classList.add('tz-selected');

      cell.innerHTML = `<span class="tz-cell-hour">${top}</span><span class="tz-cell-ampm">${bot}</span>`;

      // Click to select this column across all rows
      cell.addEventListener('click', () => {
        tzSelectedUTCHour = utcH;
        tzRenderGrid();
      });

      // Drag support
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        tzSelectedUTCHour = utcH;
        tzRenderGrid();
        const onMove = (ev) => {
          const target = document.elementFromPoint(ev.clientX, ev.clientY);
          if (target && target.closest('.tz-cell')) {
            const allCells = [...strip.children];
            const idx = allCells.indexOf(target.closest('.tz-cell'));
            if (idx >= 0 && idx !== tzSelectedUTCHour) {
              tzSelectedUTCHour = idx;
              tzRenderGrid();
            }
          }
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      strip.appendChild(cell);
    }

    row.appendChild(strip);
    grid.appendChild(row);
  });

  // Scroll all strips to show current selected hour or ~9AM range
  setTimeout(() => {
    grid.querySelectorAll('.tz-hours').forEach(strip => {
      const target = strip.querySelector('.tz-selected') || strip.children[9];
      if (target) target.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }, 0);
}

// Set date to today
function tzSetToday() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  document.getElementById('tz-date').value = `${y}-${m}-${d}`;
  tzBaseDate = new Date(`${y}-${m}-${d}T00:00:00Z`);
  // Set selected hour to current UTC hour
  tzSelectedUTCHour = now.getUTCHours();
  tzRenderGrid();
}

// Date input change
document.getElementById('tz-date').addEventListener('change', function() {
  tzBaseDate = new Date(this.value + 'T00:00:00Z');
  tzRenderGrid();
});

// ── Add timezone search ──
const tzSearchInput = document.getElementById('tz-search');
const tzSugBox = document.getElementById('tz-suggestions');
let tzSugIdx = -1;

tzSearchInput.addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  tzSugBox.innerHTML = '';
  tzSugIdx = -1;
  if (!q) { tzSugBox.classList.remove('open'); return; }

  // Check if query is an offset search like "+5", "-3", "+5.5", "5.5", "utc+5"
  const offsetMatch = q.replace(/^utc\s*/, '').match(/^([+-]?\d+\.?\d*)$/);
  const searchOffset = offsetMatch ? parseFloat(offsetMatch[1]) : null;

  const matches = TZ_CATALOG.filter(tz => {
    const already = tzRows.some(r => r.name === tz.name && r.country === tz.country);
    if (already) return false;

    // Match by offset number
    if (searchOffset !== null && tz.offset === searchOffset) return true;

    // Match by name, country, or abbreviation
    return tz.name.toLowerCase().includes(q)
      || tz.country.toLowerCase().includes(q)
      || tz.abbr.toLowerCase().includes(q);
  }).slice(0, 10);

  if (!matches.length) { tzSugBox.classList.remove('open'); return; }

  matches.forEach((tz, i) => {
    const item = document.createElement('div');
    item.className = 'tz-sug-item';
    item.innerHTML = `<span>${tz.name}, ${tz.country}</span><span class="tz-sug-offset">${tz.abbr} · UTC ${offsetLabel(tz.offset)}</span>`;
    item.addEventListener('click', () => tzAddRow(tz));
    tzSugBox.appendChild(item);
  });
  tzSugBox.classList.add('open');
});

tzSearchInput.addEventListener('keydown', function(e) {
  const items = tzSugBox.querySelectorAll('.tz-sug-item');
  if (!items.length) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); tzSugIdx = Math.min(tzSugIdx + 1, items.length - 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); tzSugIdx = Math.max(tzSugIdx - 1, 0); }
  else if (e.key === 'Enter' && tzSugIdx >= 0) { e.preventDefault(); items[tzSugIdx].click(); return; }
  else if (e.key === 'Escape') { tzSugBox.classList.remove('open'); return; }
  else return;
  items.forEach((it, i) => it.classList.toggle('active', i === tzSugIdx));
});

tzSearchInput.addEventListener('blur', () => setTimeout(() => tzSugBox.classList.remove('open'), 150));

function tzAddRow(tz) {
  tzRows.push({ ...tz });
  tzSearchInput.value = '';
  tzSugBox.classList.remove('open');
  tzRenderGrid();
}

// Init on load
tzSetToday();
/* ── IP / Subnet Calculator ── */
function parseIPv4(str) {
  const parts = str.trim().split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map(p => { const n = parseInt(p, 10); return (isNaN(n) || n < 0 || n > 255 || String(n) !== p.trim()) ? -1 : n; });
  if (nums.some(n => n < 0)) return null;
  return nums;
}

function ipToInt(parts) { return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0; }
function intToIP(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
function intToBin(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map(b => b.toString(2).padStart(8, '0')).join('.');
}

function maskFromCIDR(cidr) { return cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0; }

function cidrFromMask(maskInt) {
  let bits = 0; let found = false;
  for (let i = 31; i >= 0; i--) {
    if (maskInt & (1 << i)) { if (found) return -1; bits++; }
    else { found = true; }
  }
  return bits;
}

function ipClass(firstOctet) {
  if (firstOctet < 128) return 'A';
  if (firstOctet < 192) return 'B';
  if (firstOctet < 224) return 'C';
  if (firstOctet < 240) return 'D';
  return 'E';
}

function isPrivate(ipInt) {
  const a = (ipInt >>> 24) & 255, b = (ipInt >>> 16) & 255;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  return false;
}

function subnetCalc() {
  const errEl = document.getElementById('subnet-err');
  const resultsEl = document.getElementById('subnet-results');
  errEl.textContent = '';
  resultsEl.style.display = 'none';

  const ipStr = document.getElementById('subnet-ip').value.trim();
  const cidrStr = document.getElementById('subnet-cidr').value.trim();
  const maskStr = document.getElementById('subnet-mask-in').value.trim();

  const ipParts = parseIPv4(ipStr);
  if (!ipParts) { errEl.textContent = 'Invalid IP address'; return; }

  let cidr;
  if (maskStr) {
    const maskParts = parseIPv4(maskStr);
    if (!maskParts) { errEl.textContent = 'Invalid subnet mask'; return; }
    cidr = cidrFromMask(ipToInt(maskParts));
    if (cidr < 0) { errEl.textContent = 'Invalid subnet mask (not contiguous)'; return; }
    document.getElementById('subnet-cidr').value = cidr;
  } else {
    cidr = parseInt(cidrStr, 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) { errEl.textContent = 'CIDR must be 0–32'; return; }
  }

  const ipInt = ipToInt(ipParts);
  const maskInt = maskFromCIDR(cidr);
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : totalHosts - 2;
  const firstHost = cidr >= 31 ? networkInt : (networkInt + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;
  const cls = ipClass(ipParts[0]);
  const priv = isPrivate(ipInt);

  const grid = document.getElementById('subnet-grid');
  const rows = [
    ['Network Address', intToIP(networkInt) + '/' + cidr],
    ['Subnet Mask', intToIP(maskInt)],
    ['Wildcard Mask', intToIP(wildcardInt)],
    ['Broadcast Address', intToIP(broadcastInt)],
    ['First Usable Host', intToIP(firstHost)],
    ['Last Usable Host', intToIP(lastHost)],
    ['Total Hosts', totalHosts.toLocaleString()],
    ['Usable Hosts', usableHosts.toLocaleString()],
    ['IP Class', 'Class ' + cls],
    ['IP Type', priv ? 'Private (RFC 1918)' : 'Public'],
  ];
  grid.innerHTML = rows.map(([label, value]) =>
    '<div class="subnet-result-item"><span class="subnet-result-label">' + label + '</span><span class="subnet-result-value">' + value + '</span></div>'
  ).join('');

  // Binary breakdown
  const binSection = document.getElementById('subnet-binary-section');
  const binEl = document.getElementById('subnet-binary');
  const ipBin = intToBin(ipInt);
  const maskBin = intToBin(maskInt);
  const netBin = intToBin(networkInt);

  // Color network vs host bits
  const allBits = ipBin.replace(/\./g, '');
  const netPart = '<span class="subnet-bin-net">' + allBits.slice(0, cidr) + '</span>';
  const hostPart = '<span class="subnet-bin-host">' + allBits.slice(cidr) + '</span>';
  // Re-insert dots
  function dotify(bits) {
    return bits.match(/.{8}/g).join('.');
  }

  binEl.innerHTML = [
    ['IP Address', ipBin],
    ['Subnet Mask', maskBin],
    ['Network', intToBin(networkInt)],
  ].map(([label, val]) =>
    '<div class="subnet-bin-row"><span class="subnet-bin-label">' + label + '</span><span class="subnet-bin-value">' + val + '</span></div>'
  ).join('') +
  '<div class="subnet-bin-row"><span class="subnet-bin-label">Bits</span><span class="subnet-bin-value">' +
  '<span class="subnet-bin-net">' + dotify(allBits.slice(0, cidr).padEnd(32, '\u2007').slice(0, 32)) + '</span>' +
  ' ← ' + cidr + ' network / ' + (32 - cidr) + ' host</span></div>';
  binSection.style.display = '';

  // Subnet table (only if reasonable number, <= 256 subnets)
  const allSection = document.getElementById('subnet-all-section');
  const tbody = document.getElementById('subnet-table-body');
  if (totalHosts <= 1 || cidr < 16) {
    allSection.style.display = 'none';
  } else {
    // Find the classful boundary to list sibling subnets
    let parentCidr;
    if (ipParts[0] < 128) parentCidr = 8;
    else if (ipParts[0] < 192) parentCidr = 16;
    else parentCidr = 24;
    if (cidr <= parentCidr) { allSection.style.display = 'none'; }
    else {
      const parentMask = maskFromCIDR(parentCidr);
      const parentNet = (ipInt & parentMask) >>> 0;
      const subnetCount = Math.pow(2, cidr - parentCidr);
      if (subnetCount > 256) { allSection.style.display = 'none'; }
      else {
        const subnetSize = Math.pow(2, 32 - cidr);
        let html = '';
        for (let i = 0; i < subnetCount; i++) {
          const sNet = (parentNet + i * subnetSize) >>> 0;
          const sBcast = (sNet + subnetSize - 1) >>> 0;
          const sFirst = cidr >= 31 ? sNet : (sNet + 1) >>> 0;
          const sLast = cidr >= 31 ? sBcast : (sBcast - 1) >>> 0;
          const isCurrent = sNet === networkInt;
          html += '<tr' + (isCurrent ? ' class="subnet-current"' : '') + '><td>' +
            intToIP(sNet) + '/' + cidr + '</td><td>' +
            intToIP(sFirst) + ' – ' + intToIP(sLast) + '</td><td>' +
            intToIP(sBcast) + '</td></tr>';
        }
        tbody.innerHTML = html;
        allSection.style.display = '';
      }
    }
  }

  resultsEl.style.display = '';
}

function subnetClear() {
  document.getElementById('subnet-ip').value = '';
  document.getElementById('subnet-cidr').value = '24';
  document.getElementById('subnet-mask-in').value = '';
  document.getElementById('subnet-err').textContent = '';
  document.getElementById('subnet-results').style.display = 'none';
}

// Auto-calculate on Enter
document.getElementById('subnet-ip').addEventListener('keydown', e => { if (e.key === 'Enter') subnetCalc(); });
document.getElementById('subnet-cidr').addEventListener('keydown', e => { if (e.key === 'Enter') subnetCalc(); });
document.getElementById('subnet-mask-in').addEventListener('keydown', e => { if (e.key === 'Enter') subnetCalc(); });

// Sync CIDR ↔ mask
document.getElementById('subnet-mask-in').addEventListener('input', function() {
  const parts = parseIPv4(this.value);
  if (parts) {
    const c = cidrFromMask(ipToInt(parts));
    if (c >= 0) document.getElementById('subnet-cidr').value = c;
  }
});
document.getElementById('subnet-cidr').addEventListener('input', function() {
  const c = parseInt(this.value, 10);
  if (!isNaN(c) && c >= 0 && c <= 32) {
    document.getElementById('subnet-mask-in').value = intToIP(maskFromCIDR(c));
  }
});

/* ── Tool Search ── */
(function() {
  const searchInput = document.getElementById('tool-search');
  const searchResults = document.getElementById('search-results');
  if (!searchInput || !searchResults) return;

  // Build tool index from nav buttons
  const toolIndex = [];
  document.querySelectorAll('nav button[data-tab]').forEach(btn => {
    const cat = btn.closest('.nav-category');
    let catName = '';
    if (cat) {
      const hdr = cat.querySelector('.cat-header');
      if (hdr) {
        const clone = hdr.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined, .cat-arrow').forEach(el => el.remove());
        catName = clone.textContent.trim();
      }
    }
    toolIndex.push({
      id: btn.dataset.tab,
      name: btn.textContent.trim(),
      category: catName
    });
  });

  let selIdx = -1;

  function renderResults(query) {
    searchResults.innerHTML = '';
    selIdx = -1;
    if (!query) { searchResults.classList.remove('open'); return; }
    const q = query.toLowerCase();
    const matches = toolIndex.filter(t =>
      t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-no-results">No tools found</div>';
      searchResults.classList.add('open');
      return;
    }
    matches.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = '<span class="search-result-name">' + t.name + '</span><span class="search-result-cat">' + t.category + '</span>';
      item.addEventListener('click', () => {
        navigateToTab(t.id);
        searchInput.value = '';
        searchResults.classList.remove('open');
        searchInput.blur();
      });
      searchResults.appendChild(item);
    });
    searchResults.classList.add('open');
  }

  searchInput.addEventListener('input', () => renderResults(searchInput.value.trim()));

  searchInput.addEventListener('keydown', function(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); }
    else if (e.key === 'Enter' && selIdx >= 0) { e.preventDefault(); items[selIdx].click(); return; }
    else if (e.key === 'Escape') { searchResults.classList.remove('open'); searchInput.blur(); return; }
    else return;
    items.forEach((it, i) => it.classList.toggle('active', i === selIdx));
    items[selIdx]?.scrollIntoView({ block: 'nearest' });
  });

  searchInput.addEventListener('blur', () => setTimeout(() => searchResults.classList.remove('open'), 150));
  searchInput.addEventListener('focus', () => { if (searchInput.value.trim()) renderResults(searchInput.value.trim()); });
})();
