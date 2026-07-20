/* ── Tab navigation ── */
document.querySelectorAll('nav button[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button[data-tab]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    btn.closest('.nav-category')?.classList.add('open');
  });
});

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

/* ── Certificate Decode (X.509 DER/PEM) ── */
const CERT_OID_NAMES = {
  '2.5.4.3': 'CN', '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST',
  '2.5.4.10': 'O', '2.5.4.11': 'OU', '2.5.4.5': 'serialNumber',
  '2.5.4.9': 'streetAddress', '2.5.4.17': 'postalCode',
  '1.2.840.113549.1.9.1': 'emailAddress',
};
const CERT_OID_SIG_ALGS = {
  '1.2.840.113549.1.1.4': 'MD5 with RSA',
  '1.2.840.113549.1.1.5': 'SHA1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA512 with RSA',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS',
  '1.2.840.10045.4.1': 'ECDSA with SHA1',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA384',
  '1.2.840.10045.4.3.4': 'ECDSA with SHA512',
};
const CERT_OID_PUBKEY_ALGS = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.10045.2.1': 'EC',
  '1.2.840.10040.4.1': 'DSA',
};
const CERT_OID_CURVES = {
  '1.2.840.10045.3.1.7': 'P-256 (prime256v1)',
  '1.3.132.0.34': 'P-384 (secp384r1)',
  '1.3.132.0.35': 'P-521 (secp521r1)',
};
const CERT_OID_EXT_NAMES = {
  '2.5.29.14': 'Subject Key Identifier',
  '2.5.29.15': 'Key Usage',
  '2.5.29.17': 'Subject Alternative Name',
  '2.5.29.19': 'Basic Constraints',
  '2.5.29.31': 'CRL Distribution Points',
  '2.5.29.35': 'Authority Key Identifier',
  '2.5.29.37': 'Extended Key Usage',
  '1.3.6.1.5.5.7.1.1': 'Authority Information Access',
};
const CERT_EKU_NAMES = {
  '1.3.6.1.5.5.7.3.1': 'TLS Server Authentication',
  '1.3.6.1.5.5.7.3.2': 'TLS Client Authentication',
  '1.3.6.1.5.5.7.3.3': 'Code Signing',
  '1.3.6.1.5.5.7.3.4': 'Email Protection',
  '1.3.6.1.5.5.7.3.8': 'Time Stamping',
  '1.3.6.1.5.5.7.3.9': 'OCSP Signing',
};

class DerReader {
  constructor(bytes) { this.b = bytes; }
  readTLV(pos) {
    const b = this.b;
    if (pos >= b.length) throw new Error('Unexpected end of data');
    const tag = b[pos];
    let len = b[pos + 1];
    let lenBytes = 1;
    if (len & 0x80) {
      const n = len & 0x7f;
      len = 0;
      for (let i = 0; i < n; i++) len = (len << 8) | b[pos + 2 + i];
      lenBytes = 1 + n;
    }
    const contentStart = pos + 1 + lenBytes;
    const contentEnd = contentStart + len;
    if (contentEnd > b.length) throw new Error('Truncated DER data');
    return { tag, contentStart, contentEnd, end: contentEnd };
  }
  content(tlv) { return this.b.slice(tlv.contentStart, tlv.contentEnd); }
}

function certParseOid(bytes) {
  const parts = [];
  let val = 0;
  for (let i = 0; i < bytes.length; i++) {
    val = val * 128 + (bytes[i] & 0x7f);
    if (!(bytes[i] & 0x80)) { parts.push(val); val = 0; }
  }
  const first = Math.floor(parts[0] / 40);
  const second = parts[0] % 40;
  return [first, second, ...parts.slice(1)].join('.');
}

function certBytesToInt(bytes) {
  let n = 0;
  for (const b of bytes) n = (n << 8) | b;
  return n;
}

function certParseTime(tag, bytes) {
  const s = new TextDecoder().decode(bytes).replace('Z', '');
  let y, mo, d, h, mi, se = '00';
  if (tag === 0x17) { // UTCTime
    y = parseInt(s.slice(0, 2), 10);
    y = y < 50 ? 2000 + y : 1900 + y;
    mo = s.slice(2, 4); d = s.slice(4, 6); h = s.slice(6, 8); mi = s.slice(8, 10);
    if (s.length >= 12) se = s.slice(10, 12);
  } else { // GeneralizedTime
    y = parseInt(s.slice(0, 4), 10);
    mo = s.slice(4, 6); d = s.slice(6, 8); h = s.slice(8, 10); mi = s.slice(10, 12);
    if (s.length >= 14) se = s.slice(12, 14);
  }
  return new Date(Date.UTC(y, parseInt(mo, 10) - 1, parseInt(d, 10), parseInt(h, 10), parseInt(mi, 10), parseInt(se, 10)));
}

function certParseName(r, tlv) {
  const parts = [];
  let pos = tlv.contentStart;
  while (pos < tlv.contentEnd) {
    const rdnSet = r.readTLV(pos); // SET OF AttributeTypeAndValue
    let p2 = rdnSet.contentStart;
    while (p2 < rdnSet.contentEnd) {
      const atv = r.readTLV(p2); // SEQUENCE
      let p3 = atv.contentStart;
      const oidTlv = r.readTLV(p3);
      const oid = certParseOid(r.content(oidTlv));
      p3 = oidTlv.end;
      const valTlv = r.readTLV(p3);
      const value = new TextDecoder('utf-8').decode(r.content(valTlv));
      parts.push(`${CERT_OID_NAMES[oid] || oid}=${value}`);
      p2 = atv.end;
    }
    pos = rdnSet.end;
  }
  return parts.join(', ');
}

function certSerialHex(bytes) {
  let i = 0;
  while (i < bytes.length - 1 && bytes[i] === 0) i++;
  return Array.from(bytes.slice(i)).map(b => b.toString(16).padStart(2, '0')).join(':');
}

function certParseSAN(bytes) {
  const r = new DerReader(bytes);
  const seq = r.readTLV(0);
  const names = [];
  let p = seq.contentStart;
  while (p < seq.contentEnd) {
    const t = r.readTLV(p);
    const ctx = t.tag & 0x1f;
    const val = r.content(t);
    if (ctx === 2) names.push('DNS:' + new TextDecoder().decode(val));
    else if (ctx === 1) names.push('email:' + new TextDecoder().decode(val));
    else if (ctx === 6) names.push('URI:' + new TextDecoder().decode(val));
    else if (ctx === 7) names.push('IP:' + (val.length === 4 ? Array.from(val).join('.') : Array.from(val).map(b => b.toString(16).padStart(2, '0')).join(':')));
    else if (ctx === 4) names.push('DirName: (present)');
    else names.push(`otherName (tag 0x${t.tag.toString(16)})`);
    p = t.end;
  }
  return names;
}

function certParseKeyUsage(bytes) {
  const r = new DerReader(bytes);
  const bs = r.readTLV(0); // BIT STRING
  const content = r.content(bs);
  const byte0 = content[1] || 0;
  const byte1 = content[2] || 0;
  const names = ['Digital Signature', 'Non Repudiation', 'Key Encipherment', 'Data Encipherment', 'Key Agreement', 'Certificate Sign', 'CRL Sign', 'Encipher Only', 'Decipher Only'];
  const bits = [];
  for (let i = 0; i < 8; i++) if (byte0 & (0x80 >> i)) bits.push(names[i]);
  if (byte1 & 0x80) bits.push(names[8]);
  return bits;
}

function certParseBasicConstraints(bytes) {
  const r = new DerReader(bytes);
  const seq = r.readTLV(0);
  let p = seq.contentStart;
  let isCA = false, pathLen = null;
  if (p < seq.contentEnd) {
    let t = r.readTLV(p);
    if (t.tag === 0x01) { isCA = r.content(t)[0] !== 0; p = t.end; }
    if (p < seq.contentEnd) { t = r.readTLV(p); if (t.tag === 0x02) pathLen = certBytesToInt(r.content(t)); }
  }
  return { isCA, pathLen };
}

function certParseExtKeyUsage(bytes) {
  const r = new DerReader(bytes);
  const seq = r.readTLV(0);
  let p = seq.contentStart;
  const out = [];
  while (p < seq.contentEnd) {
    const t = r.readTLV(p);
    const oid = certParseOid(r.content(t));
    out.push(CERT_EKU_NAMES[oid] || oid);
    p = t.end;
  }
  return out;
}

function certPemToBytes(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/-----BEGIN [^-]+-----([\s\S]+?)-----END [^-]+-----/);
  const b64 = (match ? match[1] : trimmed).replace(/\s+/g, '');
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function certParseCertificate(bytes) {
  const r = new DerReader(bytes);
  const certTlv = r.readTLV(0); // Certificate SEQUENCE
  const tbsTlv = r.readTLV(certTlv.contentStart); // tbsCertificate SEQUENCE
  const sigAlgTlv = r.readTLV(tbsTlv.end); // Certificate.signatureAlgorithm
  const sigAlgOidTlv = r.readTLV(sigAlgTlv.contentStart);
  const sigAlgOid = certParseOid(r.content(sigAlgOidTlv));

  let p = tbsTlv.contentStart;
  const end = tbsTlv.contentEnd;

  let version = 1;
  let t = r.readTLV(p);
  if (t.tag === 0xa0) { // [0] EXPLICIT version
    const inner = r.readTLV(t.contentStart);
    version = certBytesToInt(r.content(inner)) + 1;
    p = t.end;
    t = r.readTLV(p);
  }

  const serialBytes = r.content(t); // serialNumber INTEGER
  p = t.end;

  t = r.readTLV(p); p = t.end; // tbs signature AlgorithmIdentifier (redundant copy)

  t = r.readTLV(p); // issuer Name
  const issuer = certParseName(r, t);
  p = t.end;

  t = r.readTLV(p); // validity SEQUENCE
  let vp = t.contentStart;
  const nbTlv = r.readTLV(vp);
  const notBefore = certParseTime(nbTlv.tag, r.content(nbTlv));
  vp = nbTlv.end;
  const naTlv = r.readTLV(vp);
  const notAfter = certParseTime(naTlv.tag, r.content(naTlv));
  p = t.end;

  t = r.readTLV(p); // subject Name
  const subject = certParseName(r, t);
  p = t.end;

  t = r.readTLV(p); // subjectPublicKeyInfo SEQUENCE
  let sp = t.contentStart;
  const algTlv = r.readTLV(sp);
  let ap = algTlv.contentStart;
  const pubKeyOidTlv = r.readTLV(ap);
  const pubKeyOid = certParseOid(r.content(pubKeyOidTlv));
  ap = pubKeyOidTlv.end;
  let curveName = null;
  if (pubKeyOid === '1.2.840.10045.2.1' && ap < algTlv.contentEnd) {
    const paramTlv = r.readTLV(ap);
    if (paramTlv.tag === 0x06) {
      const curveOid = certParseOid(r.content(paramTlv));
      curveName = CERT_OID_CURVES[curveOid] || curveOid;
    }
  }
  sp = algTlv.end;
  const pubKeyBitTlv = r.readTLV(sp);
  const pubKeyBits = r.content(pubKeyBitTlv); // [0] = unused-bits count
  let keySizeBits = null;
  if (pubKeyOid === '1.2.840.113549.1.1.1') {
    const rsaKey = new DerReader(pubKeyBits.slice(1));
    const rsaSeq = rsaKey.readTLV(0);
    const modTlv = rsaKey.readTLV(rsaSeq.contentStart);
    let modBytes = rsaKey.content(modTlv);
    let mi = 0; while (mi < modBytes.length - 1 && modBytes[mi] === 0) mi++;
    keySizeBits = (modBytes.length - mi) * 8;
  } else if (pubKeyOid === '1.2.840.10045.2.1') {
    const point = pubKeyBits.slice(1);
    if (point.length > 1 && point[0] === 0x04) keySizeBits = ((point.length - 1) / 2) * 8;
  }
  p = t.end;

  const extensions = [];
  while (p < end) {
    t = r.readTLV(p);
    if (t.tag === 0xa3) { // [3] EXPLICIT extensions
      const seqTlv = r.readTLV(t.contentStart);
      let ep = seqTlv.contentStart;
      while (ep < seqTlv.contentEnd) {
        const extTlv = r.readTLV(ep);
        let xp = extTlv.contentStart;
        const oidTlv = r.readTLV(xp);
        const extOid = certParseOid(r.content(oidTlv));
        xp = oidTlv.end;
        let critical = false;
        let valTlv = r.readTLV(xp);
        if (valTlv.tag === 0x01) { // BOOLEAN critical
          critical = r.content(valTlv)[0] !== 0;
          xp = valTlv.end;
          valTlv = r.readTLV(xp);
        }
        extensions.push({ oid: extOid, critical, value: r.content(valTlv) });
        ep = extTlv.end;
      }
    }
    p = t.end;
  }

  return { version, serialBytes, issuer, subject, notBefore, notAfter, sigAlgOid, pubKeyOid, curveName, keySizeBits, extensions };
}

async function certDecode() {
  const input = document.getElementById('cert-in');
  const statusEl = document.getElementById('cert-status');
  const outputBox = document.getElementById('cert-output-box');
  const pre = document.getElementById('cert-pre');
  setError('cert-err', '');
  input.classList.remove('error');
  statusEl.style.display = 'none';
  outputBox.style.display = 'none';

  const val = input.value.trim();
  if (!val) { setError('cert-err', 'Please paste a PEM or Base64 DER certificate.'); input.classList.add('error'); return; }

  let bytes;
  try {
    bytes = certPemToBytes(val);
  } catch (e) {
    setError('cert-err', 'Invalid Base64 encoding.'); input.classList.add('error'); return;
  }

  let cert;
  try {
    cert = certParseCertificate(bytes);
  } catch (e) {
    setError('cert-err', 'Failed to parse certificate: ' + e.message); input.classList.add('error'); return;
  }

  const toHexColon = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(':');
  const [fpSha1, fpSha256] = await Promise.all([
    crypto.subtle.digest('SHA-1', bytes),
    crypto.subtle.digest('SHA-256', bytes),
  ]);

  const now = new Date();
  const expired = now > cert.notAfter;
  const notYetValid = now < cert.notBefore;
  statusEl.className = 'jwt-status ' + (expired || notYetValid ? 'expired' : 'valid');
  statusEl.innerHTML = expired
    ? `✗ Certificate expired on ${cert.notAfter.toLocaleString()}`
    : notYetValid
      ? `✗ Certificate not yet valid (starts ${cert.notBefore.toLocaleString()})`
      : `✓ Certificate valid until ${cert.notAfter.toLocaleString()}`;
  statusEl.style.display = 'flex';

  const lines = [];
  lines.push(`Version: v${cert.version}`);
  lines.push(`Serial Number: ${certSerialHex(cert.serialBytes)}`);
  lines.push('');
  lines.push(`Subject: ${cert.subject}`);
  lines.push(`Issuer: ${cert.issuer}`);
  lines.push('');
  lines.push(`Valid From: ${cert.notBefore.toUTCString()}`);
  lines.push(`Valid Until: ${cert.notAfter.toUTCString()}`);
  lines.push('');
  lines.push(`Signature Algorithm: ${CERT_OID_SIG_ALGS[cert.sigAlgOid] || cert.sigAlgOid}`);
  lines.push(`Public Key Algorithm: ${CERT_OID_PUBKEY_ALGS[cert.pubKeyOid] || cert.pubKeyOid}${cert.curveName ? ' (' + cert.curveName + ')' : ''}`);
  if (cert.keySizeBits) lines.push(`Public Key Size: ${cert.keySizeBits} bits`);
  lines.push('');
  lines.push(`SHA-256 Fingerprint: ${toHexColon(fpSha256)}`);
  lines.push(`SHA-1 Fingerprint:   ${toHexColon(fpSha1)}`);

  if (cert.extensions.length) {
    lines.push('');
    lines.push('Extensions:');
    for (const ext of cert.extensions) {
      const name = CERT_OID_EXT_NAMES[ext.oid] || ext.oid;
      const crit = ext.critical ? ' (critical)' : '';
      try {
        if (ext.oid === '2.5.29.17') {
          lines.push(`  ${name}${crit}:`);
          for (const n of certParseSAN(ext.value)) lines.push(`    ${n}`);
        } else if (ext.oid === '2.5.29.15') {
          lines.push(`  ${name}${crit}: ${certParseKeyUsage(ext.value).join(', ')}`);
        } else if (ext.oid === '2.5.29.37') {
          lines.push(`  ${name}${crit}: ${certParseExtKeyUsage(ext.value).join(', ')}`);
        } else if (ext.oid === '2.5.29.19') {
          const bc = certParseBasicConstraints(ext.value);
          lines.push(`  ${name}${crit}: CA=${bc.isCA}${bc.pathLen !== null ? ', pathLenConstraint=' + bc.pathLen : ''}`);
        } else {
          lines.push(`  ${name}${crit}: (${ext.value.length} bytes)`);
        }
      } catch (e) {
        lines.push(`  ${name}${crit}: (unable to parse)`);
      }
    }
  }

  pre.textContent = lines.join('\n');
  outputBox.style.display = 'block';
}

function certBytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function certBytesToPem(bytes) {
  const b64 = certBytesToBase64(bytes);
  const lines = b64.match(/.{1,64}/g) || [];
  return '-----BEGIN CERTIFICATE-----\n' + lines.join('\n') + '\n-----END CERTIFICATE-----';
}

async function certLoadFile(file) {
  if (!file) return;
  setError('cert-err', '');
  document.getElementById('cert-in').classList.remove('error');
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const looksLikePem = new TextDecoder('ascii', { fatal: false }).decode(bytes.slice(0, 32)).includes('-----BEGIN');
    document.getElementById('cert-in').value = looksLikePem ? new TextDecoder().decode(bytes) : certBytesToPem(bytes);
    certDecode();
  } catch (e) {
    setError('cert-err', 'Failed to read file: ' + e.message);
    document.getElementById('cert-in').classList.add('error');
  }
}

function certFileChosen(event) {
  certLoadFile(event.target.files[0]);
  event.target.value = '';
}

function certFileDropped(event) {
  event.preventDefault();
  certLoadFile(event.dataTransfer.files[0]);
}

function certClearOutput() {
  document.getElementById('cert-in').classList.remove('error');
  setError('cert-err', '');
  document.getElementById('cert-status').style.display = 'none';
  document.getElementById('cert-output-box').style.display = 'none';
  document.getElementById('cert-pre').textContent = '';
}

function clearCert() {
  document.getElementById('cert-in').value = '';
  certClearOutput();
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
document.getElementById('cert-in').addEventListener('input', certClearOutput);
// Init HTTP table on load
renderHttpTable('');

/* ══════════════════════════════════════════════════════════════
   Image Editor
   Fully client-side: redact, annotate, crop, resize, export.
   Undo/redo via base-canvas snapshots. Redaction is baked into
   the bitmap on commit (destructive) so it can never leak.
   ══════════════════════════════════════════════════════════════ */
const img = {
  canvas: null, ctx: null,
  base: null,            // offscreen canvas holding committed pixels
  history: [], hi: -1,   // ImageData snapshots + index
  tool: 'redact',
  color: '#ff3b30',
  stroke: 6,
  pixel: 14,
  drawing: false,
  start: null,
  penPts: [],
  cropRect: null,
};
const IMG_MAX_LOAD = 4000;   // downscale larger images on load
const IMG_MAX_DIM = 8000;    // hard cap for manual resize
const IMG_HISTORY = 12;      // snapshot cap (memory guard)

function imgEl(id) { return document.getElementById(id); }

// The offscreen base canvas is read back frequently (snapshots, pixelate),
// so hint the browser to keep it in a CPU-readable buffer. Only affects the
// first getContext call per canvas; later calls return the same context.
function imgBaseCtx(c) { return c.getContext('2d', { willReadFrequently: true }); }

function imgHumanSize(n) {
  return n < 1024 ? n + ' B'
    : n < 1048576 ? (n / 1024).toFixed(1) + ' KB'
    : (n / 1048576).toFixed(2) + ' MB';
}

function imgPos(e) {
  const r = img.canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (img.canvas.width / r.width),
    y: (e.clientY - r.top) * (img.canvas.height / r.height),
  };
}

function imgNormRect(a, b) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

/* ── Rendering ── */
function imgRenderBase() {
  if (!img.base) return;
  img.ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);
  img.ctx.drawImage(img.base, 0, 0);
}

function imgRender() {
  imgRenderBase();
  if (img.tool === 'crop' && img.cropRect) imgDrawCropOverlay(img.cropRect);
}

function imgStyleStroke(ctx) {
  ctx.strokeStyle = img.color;
  ctx.fillStyle = img.color;
  ctx.lineWidth = img.stroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function imgDrawArrow(ctx, a, b) {
  const head = Math.max(12, img.stroke * 3);
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - head * Math.cos(ang - Math.PI / 6), b.y - head * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(b.x - head * Math.cos(ang + Math.PI / 6), b.y - head * Math.sin(ang + Math.PI / 6));
  ctx.closePath(); ctx.fill();
}

function imgDrawPen(ctx, pts) {
  if (pts.length < 1) return;
  imgStyleStroke(ctx);
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function imgPixelate(ctx, x, y, w, h, block) {
  x = Math.max(0, Math.round(x)); y = Math.max(0, Math.round(y));
  w = Math.min(img.base.width - x, Math.round(w));
  h = Math.min(img.base.height - y, Math.round(h));
  if (w <= 0 || h <= 0) return;
  const src = ctx.getImageData(x, y, w, h).data;
  for (let by = 0; by < h; by += block) {
    for (let bx = 0; bx < w; bx += block) {
      let r = 0, g = 0, bl = 0, a = 0, n = 0;
      for (let dy = 0; dy < block && by + dy < h; dy++) {
        for (let dx = 0; dx < block && bx + dx < w; dx++) {
          const i = ((by + dy) * w + (bx + dx)) * 4;
          r += src[i]; g += src[i + 1]; bl += src[i + 2]; a += src[i + 3]; n++;
        }
      }
      ctx.fillStyle = `rgba(${(r / n) | 0},${(g / n) | 0},${(bl / n) | 0},${a / n / 255})`;
      ctx.fillRect(x + bx, y + by, Math.min(block, w - bx), Math.min(block, h - by));
    }
  }
}

function imgCommitShape(ctx, tool, a, b) {
  if (tool === 'redact') {
    const r = imgNormRect(a, b);
    ctx.fillStyle = '#000';
    ctx.fillRect(r.x, r.y, r.w, r.h);
  } else if (tool === 'pixelate') {
    const r = imgNormRect(a, b);
    if (r.w > 1 && r.h > 1) imgPixelate(ctx, r.x, r.y, r.w, r.h, img.pixel);
  } else if (tool === 'rect') {
    const r = imgNormRect(a, b);
    imgStyleStroke(ctx);
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  } else if (tool === 'arrow') {
    imgStyleStroke(ctx);
    imgDrawArrow(ctx, a, b);
  }
}

function imgDrawCropOverlay(r) {
  const ctx = img.ctx, W = img.canvas.width, H = img.canvas.height;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, r.y);
  ctx.fillRect(0, r.y + r.h, W, H - (r.y + r.h));
  ctx.fillRect(0, r.y, r.x, r.h);
  ctx.fillRect(r.x + r.w, r.y, W - (r.x + r.w), r.h);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.max(1, W / (img.canvas.getBoundingClientRect().width || W));
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.restore();
}

/* ── History ── */
function imgPush() {
  const snap = imgBaseCtx(img.base).getImageData(0, 0, img.base.width, img.base.height);
  img.history = img.history.slice(0, img.hi + 1);
  img.history.push(snap);
  if (img.history.length > IMG_HISTORY) img.history.shift();
  img.hi = img.history.length - 1;
  imgUpdateHistBtns();
}

function imgRestore() {
  const snap = img.history[img.hi];
  img.base.width = snap.width;
  img.base.height = snap.height;
  imgBaseCtx(img.base).putImageData(snap, 0, 0);
  imgSyncSize();
  imgRender();
  imgUpdateHistBtns();
}

function imgUpdateHistBtns() {
  imgEl('img-undo').disabled = img.hi <= 0;
  imgEl('img-redo').disabled = img.hi >= img.history.length - 1;
}

function imgUndo() { if (img.hi > 0) { img.hi--; imgRestore(); imgEstimateSize(); } }
function imgRedo() { if (img.hi < img.history.length - 1) { img.hi++; imgRestore(); imgEstimateSize(); } }

/* ── Sizing ── */
function imgSyncSize() {
  img.canvas.width = img.base.width;
  img.canvas.height = img.base.height;
  imgEl('img-w').value = img.base.width;
  imgEl('img-h').value = img.base.height;
}

/* ── Loading ── */
function imgIngest(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    setError('img-err', 'That is not an image file.');
    return;
  }
  setError('img-err', '');
  const url = URL.createObjectURL(file);
  const im = new Image();
  im.onload = () => { imgLoadImage(im); URL.revokeObjectURL(url); };
  im.onerror = () => { setError('img-err', 'Could not load that image.'); URL.revokeObjectURL(url); };
  im.src = url;
}

function imgLoadImage(im) {
  let w = im.naturalWidth, h = im.naturalHeight;
  if (Math.max(w, h) > IMG_MAX_LOAD) {
    const s = IMG_MAX_LOAD / Math.max(w, h);
    w = Math.round(w * s); h = Math.round(h * s);
    showToast(`Large image downscaled to ${w}×${h}`);
  }
  img.base = document.createElement('canvas');
  img.base.width = w; img.base.height = h;
  imgBaseCtx(img.base).drawImage(im, 0, 0, w, h);

  img.history = []; img.hi = -1; img.cropRect = null;
  imgEl('img-placeholder').style.display = 'none';
  img.canvas.style.display = 'block';
  imgEl('img-toolbar').style.display = 'flex';
  imgEl('img-actionbar').style.display = 'flex';
  imgEl('img-cropbar').style.display = 'none';

  imgSyncSize();
  imgPush();
  imgRender();
  imgEstimateSize();
}

function imgFileChosen(e) {
  const f = e.target.files && e.target.files[0];
  if (f) imgIngest(f);
}

/* ── Tool selection ── */
function imgSetTool(t) {
  img.tool = t;
  document.querySelectorAll('#img-toolbar .img-tool[data-tool]').forEach(b =>
    b.classList.toggle('active', b.dataset.tool === t));
  const colorTool = ['rect', 'arrow', 'pen', 'text'].includes(t);
  imgEl('img-color-wrap').style.display = colorTool ? 'flex' : 'none';
  imgEl('img-stroke-wrap').style.display = colorTool ? 'flex' : 'none';
  imgEl('img-pixel-wrap').style.display = (t === 'pixelate') ? 'flex' : 'none';
  if (img.canvas) img.canvas.style.cursor = (t === 'text') ? 'text' : 'crosshair';
  if (t !== 'crop' && img.cropRect) imgCancelCrop();
  imgRender();
}

/* ── Pointer drawing ── */
function imgDown(e) {
  if (!img.base) return;
  const p = imgPos(e);
  if (img.tool === 'text') {
    const t = prompt('Enter label text:');
    if (t) {
      const ctx = imgBaseCtx(img.base);
      ctx.fillStyle = img.color;
      ctx.textBaseline = 'top';
      ctx.font = `600 ${Math.max(14, img.stroke * 4)}px Inter, sans-serif`;
      ctx.fillText(t, p.x, p.y);
      imgPush(); imgRender(); imgEstimateSize();
    }
    return;
  }
  img.drawing = true;
  img.start = p;
  img.penPts = [p];
  img.canvas.setPointerCapture(e.pointerId);
}

function imgMove(e) {
  if (!img.drawing) return;
  const p = imgPos(e);
  if (img.tool === 'pen') {
    img.penPts.push(p);
    imgRenderBase();
    imgDrawPen(img.ctx, img.penPts);
    return;
  }
  imgRenderBase();
  if (img.tool === 'crop') { imgDrawCropOverlay(imgNormRect(img.start, p)); return; }
  imgCommitShape(img.ctx, img.tool, img.start, p);
}

function imgUp(e) {
  if (!img.drawing) return;
  img.drawing = false;
  const p = imgPos(e);
  const ctx = imgBaseCtx(img.base);

  if (img.tool === 'pen') {
    if (img.penPts.length > 1) { imgDrawPen(ctx, img.penPts); imgPush(); }
    imgRender(); imgEstimateSize();
    return;
  }
  if (img.tool === 'crop') {
    const r = imgNormRect(img.start, p);
    if (r.w > 4 && r.h > 4) { img.cropRect = r; imgEl('img-cropbar').style.display = 'flex'; }
    else { img.cropRect = null; imgEl('img-cropbar').style.display = 'none'; }
    imgRender();
    return;
  }
  const r = imgNormRect(img.start, p);
  if (r.w < 2 && r.h < 2) { imgRender(); return; }   // ignore stray clicks
  imgCommitShape(ctx, img.tool, img.start, p);
  imgPush(); imgRender(); imgEstimateSize();
}

/* ── Crop / resize ── */
function imgApplyCrop() {
  if (!img.cropRect) return;
  const r = img.cropRect;
  const nc = document.createElement('canvas');
  nc.width = Math.round(r.w); nc.height = Math.round(r.h);
  imgBaseCtx(nc).drawImage(img.base, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
  img.base = nc;
  img.cropRect = null;
  imgEl('img-cropbar').style.display = 'none';
  imgSyncSize(); imgPush(); imgRender(); imgEstimateSize();
}

function imgCancelCrop() {
  img.cropRect = null;
  imgEl('img-cropbar').style.display = 'none';
  imgRender();
}

function imgAspect(which) {
  if (!img.base || !imgEl('img-aspect').checked) return;
  const ratio = img.base.width / img.base.height;
  if (which === 'w') {
    const w = parseInt(imgEl('img-w').value);
    if (w > 0) imgEl('img-h').value = Math.round(w / ratio);
  } else {
    const h = parseInt(imgEl('img-h').value);
    if (h > 0) imgEl('img-w').value = Math.round(h * ratio);
  }
}

function imgApplyResize() {
  if (!img.base) return;
  const w = parseInt(imgEl('img-w').value), h = parseInt(imgEl('img-h').value);
  if (!w || !h || w < 1 || h < 1) { setError('img-err', 'Enter a valid width and height.'); return; }
  if (w > IMG_MAX_DIM || h > IMG_MAX_DIM) { setError('img-err', `Max dimension is ${IMG_MAX_DIM}px.`); return; }
  setError('img-err', '');
  const nc = document.createElement('canvas');
  nc.width = w; nc.height = h;
  imgBaseCtx(nc).drawImage(img.base, 0, 0, w, h);
  img.base = nc;
  imgSyncSize(); imgPush(); imgRender(); imgEstimateSize();
}

/* ── Export ── */
function imgQuality() { return parseInt(imgEl('img-quality').value) / 100; }

function imgFormatChange() {
  const f = imgEl('img-format').value;
  imgEl('img-quality-wrap').style.display = (f === 'image/png') ? 'none' : 'flex';
  imgEstimateSize();
}

function imgToBlob(cb) {
  const f = imgEl('img-format').value;
  const q = (f === 'image/png') ? undefined : imgQuality();
  img.base.toBlob(cb, f, q);
}

function imgEstimateSize() {
  imgEl('img-quality-val').textContent = imgEl('img-quality').value;
  if (!img.base) { imgEl('img-size').textContent = ''; return; }
  imgToBlob(b => { if (b) imgEl('img-size').textContent = imgHumanSize(b.size); });
}

function imgExport() {
  if (!img.base) return;
  const f = imgEl('img-format').value;
  const ext = f === 'image/jpeg' ? 'jpg' : f === 'image/webp' ? 'webp' : 'png';
  imgToBlob(b => {
    if (!b) { setError('img-err', 'Export failed in this browser.'); return; }
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url; a.download = 'edited.' + ext;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded (' + imgHumanSize(b.size) + ')');
  });
}

function imgCopy() {
  if (!img.base) return;
  if (!window.ClipboardItem || !navigator.clipboard || !navigator.clipboard.write) {
    showToast('Clipboard image copy not supported here');
    return;
  }
  img.base.toBlob(b => {
    if (!b) return;
    navigator.clipboard.write([new ClipboardItem({ 'image/png': b })])
      .then(() => showToast('Copied to clipboard (PNG)'))
      .catch(() => showToast('Copy failed — use Download'));
  }, 'image/png');
}

function imgReset() {
  img.base = null; img.history = []; img.hi = -1;
  img.cropRect = null; img.drawing = false;
  img.canvas.style.display = 'none';
  imgEl('img-placeholder').style.display = 'flex';
  imgEl('img-toolbar').style.display = 'none';
  imgEl('img-actionbar').style.display = 'none';
  imgEl('img-cropbar').style.display = 'none';
  imgEl('img-size').textContent = '';
  imgEl('img-file').value = '';
  setError('img-err', '');
}

/* ── Init ── */
function imgInit() {
  img.canvas = imgEl('img-canvas');
  if (!img.canvas) return;
  img.ctx = img.canvas.getContext('2d');

  const strokeEl = imgEl('img-stroke');
  strokeEl.addEventListener('input', () => {
    img.stroke = parseInt(strokeEl.value);
    imgEl('img-stroke-val').textContent = strokeEl.value;
  });
  const pixelEl = imgEl('img-pixel');
  pixelEl.addEventListener('input', () => {
    img.pixel = parseInt(pixelEl.value);
    imgEl('img-pixel-val').textContent = pixelEl.value;
  });
  imgEl('img-color').addEventListener('input', e => { img.color = e.target.value; });

  img.canvas.addEventListener('pointerdown', imgDown);
  img.canvas.addEventListener('pointermove', imgMove);
  window.addEventListener('pointerup', imgUp);

  imgEl('img-w').addEventListener('input', () => imgAspect('w'));
  imgEl('img-h').addEventListener('input', () => imgAspect('h'));

  const stage = imgEl('img-stage'), ph = imgEl('img-placeholder');
  ['dragenter', 'dragover'].forEach(ev => stage.addEventListener(ev, e => { e.preventDefault(); ph.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(ev => stage.addEventListener(ev, e => { e.preventDefault(); ph.classList.remove('dragover'); }));
  stage.addEventListener('drop', e => {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) imgIngest(f);
  });

  window.addEventListener('paste', e => {
    if (!imgEl('tab-img').classList.contains('active')) return;
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) {
      if (it.type && it.type.startsWith('image/')) {
        const f = it.getAsFile();
        if (f) { imgIngest(f); e.preventDefault(); }
        break;
      }
    }
  });

  window.addEventListener('keydown', e => {
    if (!imgEl('tab-img').classList.contains('active')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? imgRedo() : imgUndo(); }
    else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); imgRedo(); }
  });

  imgSetTool('redact');
}
imgInit();
