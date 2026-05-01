const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT = path.join(PUBLIC_DIR, 'mind-grow.zip');

const INCLUDE_DIRS = [
  'app', 'components', 'constants', 'utils',
  'src', 'hooks', 'context', 'assets', 'scripts', 'server',
];
const INCLUDE_ROOT_FILES = [
  'package.json', 'app.json', 'tsconfig.json',
  'babel.config.js', 'metro.config.js', '.gitignore',
];

const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', 'static-build', '.cache', '.upm', '.local', 'attached_assets']);

function walkDir(dir, base, files = {}) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory()) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkDir(fullPath, base, files);
    } else {
      const relPath = path.relative(base, fullPath).replace(/\\/g, '/');
      try {
        files[relPath] = fs.readFileSync(fullPath);
      } catch (e) {
        console.warn(`  skip ${relPath}: ${e.message}`);
      }
    }
  }
  return files;
}

function createZip(files) {
  const entries = Object.entries(files);
  const chunks = [];

  function u32le(n) {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(n, 0);
    return b;
  }
  function u16le(n) {
    const b = Buffer.alloc(2);
    b.writeUInt16LE(n, 0);
    return b;
  }

  const zlib = require('zlib');
  const centralDir = [];
  let offset = 0;

  for (const [name, data] of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const compressed = zlib.deflateRawSync(data, { level: 6 });
    const useCompressed = compressed.length < data.length;
    const fileData = useCompressed ? compressed : data;
    const method = useCompressed ? 8 : 0;

    const crc = crc32(data);

    const localHeader = Buffer.concat([
      Buffer.from([0x50, 0x4B, 0x03, 0x04]),
      u16le(20),
      u16le(0),
      u16le(method),
      u16le(0), u16le(0),
      u32le(crc),
      u32le(fileData.length),
      u32le(data.length),
      u16le(nameBuf.length),
      u16le(0),
      nameBuf,
    ]);

    centralDir.push({ nameBuf, method, crc, compressedSize: fileData.length, uncompressedSize: data.length, offset });

    chunks.push(localHeader);
    chunks.push(fileData);
    offset += localHeader.length + fileData.length;
  }

  const centralDirStart = offset;
  const centralDirChunks = [];

  for (const e of centralDir) {
    const entry = Buffer.concat([
      Buffer.from([0x50, 0x4B, 0x01, 0x02]),
      u16le(20), u16le(20),
      u16le(0),
      u16le(e.method),
      u16le(0), u16le(0),
      u32le(e.crc),
      u32le(e.compressedSize),
      u32le(e.uncompressedSize),
      u16le(e.nameBuf.length),
      u16le(0), u16le(0), u16le(0), u16le(0),
      u32le(0),
      u32le(e.offset),
      e.nameBuf,
    ]);
    centralDirChunks.push(entry);
  }

  const centralDirBuf = Buffer.concat(centralDirChunks);
  const eocd = Buffer.concat([
    Buffer.from([0x50, 0x4B, 0x05, 0x06]),
    u16le(0), u16le(0),
    u16le(centralDir.length),
    u16le(centralDir.length),
    u32le(centralDirBuf.length),
    u32le(centralDirStart),
    u16le(0),
  ]);

  return Buffer.concat([...chunks, centralDirBuf, eocd]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return t;
  })());
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

console.log('📦 Generating mind-grow.zip...');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const files = {};

for (const dir of INCLUDE_DIRS) {
  walkDir(path.join(ROOT, dir), ROOT, files);
}

for (const file of INCLUDE_ROOT_FILES) {
  const p = path.join(ROOT, file);
  if (fs.existsSync(p)) {
    files[file] = fs.readFileSync(p);
  }
}

const count = Object.keys(files).length;
console.log(`  Found ${count} files`);

const zip = createZip(files);
fs.writeFileSync(OUTPUT, zip);
console.log(`✅ mind-grow.zip created (${(zip.length / 1024).toFixed(1)} KB) → public/mind-grow.zip`);
