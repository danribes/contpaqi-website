/**
 * Generate placeholder PNG assets for the ContPAQi AI Bridge website
 *
 * This script creates minimal PNG files for:
 * - favicon.ico (multi-size ICO)
 * - favicon-16x16.png
 * - favicon-32x32.png
 * - apple-touch-icon.png (180x180)
 * - og-image.png (1200x630)
 */

const fs = require('fs');
const path = require('path');

// Minimal 1x1 blue PNG (base for scaling concepts)
// For actual production, these should be replaced with properly designed assets

// Simple PNG generator using raw bytes
function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk (image data)
  const rawData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 3)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const offset = y * (1 + width * 3) + 1 + x * 3;
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation for PNG
function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  const table = makeCRCTable();

  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xFF];
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeCRCTable() {
  const table = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  return table;
}

// Create ICO file (simple version with single 32x32 image)
function createICO(pngBuffer) {
  // ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type (1 = ICO)
  header.writeUInt16LE(1, 4); // number of images

  // ICO directory entry
  const entry = Buffer.alloc(16);
  entry[0] = 32; // width
  entry[1] = 32; // height
  entry[2] = 0; // color palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset (header + entry = 6 + 16)

  return Buffer.concat([header, entry, pngBuffer]);
}

// Brand colors
const brandBlue = { r: 59, g: 130, b: 246 }; // #3B82F6

// Generate files
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

// Create directories if they don't exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Generate PNGs
console.log('Generating favicon-16x16.png...');
const png16 = createPNG(16, 16, brandBlue.r, brandBlue.g, brandBlue.b);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

console.log('Generating favicon-32x32.png...');
const png32 = createPNG(32, 32, brandBlue.r, brandBlue.g, brandBlue.b);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

console.log('Generating apple-touch-icon.png...');
const png180 = createPNG(180, 180, brandBlue.r, brandBlue.g, brandBlue.b);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

console.log('Generating favicon.ico...');
const ico = createICO(png32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

console.log('Generating og-image.png...');
const ogImage = createPNG(1200, 630, brandBlue.r, brandBlue.g, brandBlue.b);
fs.writeFileSync(path.join(imagesDir, 'og-image.png'), ogImage);

console.log('All assets generated successfully!');
