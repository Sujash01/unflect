import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;
  const entries = [];

  for (const { buffer, width, height } of pngBuffers) {
    entries.push({
      width: width >= 256 ? 0 : width,
      height: height >= 256 ? 0 : height,
      size: buffer.length,
      offset: currentOffset,
      buffer,
    });
    currentOffset += buffer.length;
  }

  const out = Buffer.alloc(currentOffset);
  // Header
  out.writeUInt16LE(0, 0); // reserved
  out.writeUInt16LE(1, 2); // type 1 = ICO
  out.writeUInt16LE(count, 4); // count

  let entryOffset = 6;
  for (const entry of entries) {
    out.writeUInt8(entry.width, entryOffset);
    out.writeUInt8(entry.height, entryOffset + 1);
    out.writeUInt8(0, entryOffset + 2); // palette
    out.writeUInt8(0, entryOffset + 3); // reserved
    out.writeUInt16LE(1, entryOffset + 4); // color planes
    out.writeUInt16LE(32, entryOffset + 6); // bpp
    out.writeUInt32LE(entry.size, entryOffset + 8); // size
    out.writeUInt32LE(entry.offset, entryOffset + 12); // offset
    entry.buffer.copy(out, entry.offset);
    entryOffset += 16;
  }

  return out;
}

async function main() {
  const logoTsx = fs.readFileSync('src/components/brand/logo.tsx', 'utf8');
  const match = logoTsx.match(/LOGO_PATH =\s*"([^"]+)"/);
  if (!match) throw new Error('Could not find LOGO_PATH');
  const pathD = match[1];

  // SVG representation:
  // Pure black background (#000000)
  // Perfectly centered white UNFLECT geometric mark
  // viewBox="-8 -8 44 44" matches the 1200x1200 WhatsApp reference image with 100% precision
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 44 44" width="100%" height="100%">
  <rect x="-8" y="-8" width="44" height="44" fill="#000000" />
  <path d="${pathD}" fill="#FFFFFF" fill-rule="evenodd" />
</svg>`;

  console.log('Generating crisp SVG favicon...');
  fs.writeFileSync('src/app/icon.svg', svgContent);
  fs.writeFileSync('public/icon.svg', svgContent);

  // Generate PNG sizes
  const sizes = [16, 32, 48, 64, 96, 128, 144, 180, 192, 256, 512, 1024];
  const rendered = {};

  for (const size of sizes) {
    console.log(`Rendering ${size}x${size} PNG...`);
    const buf = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    rendered[size] = buf;
  }

  // Create ICO file containing 16x16, 32x32, 48x48
  const icoBuffer = createIco([
    { buffer: rendered[16], width: 16, height: 16 },
    { buffer: rendered[32], width: 32, height: 32 },
    { buffer: rendered[48], width: 48, height: 48 },
  ]);

  console.log('Writing favicon.ico files...');
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);

  // App router icons
  console.log('Writing App Router and public icons...');
  fs.writeFileSync('src/app/icon.png', rendered[512]);
  fs.writeFileSync('public/icon.png', rendered[512]);
  fs.writeFileSync('src/app/apple-icon.png', rendered[180]);
  fs.writeFileSync('public/apple-icon.png', rendered[180]);

  // Brand folder copies for direct crawling and Google Search logos
  fs.writeFileSync('public/brand/logo.png', rendered[512]);
  fs.writeFileSync('public/brand/logo-512.png', rendered[512]);
  fs.writeFileSync('public/brand/logo-192.png', rendered[192]);
  fs.writeFileSync('public/brand/logo-64.png', rendered[64]);
  fs.writeFileSync('public/brand/logo-48.png', rendered[48]);
  fs.writeFileSync('public/brand/logo-32.png', rendered[32]);
  fs.writeFileSync('public/brand/logo-128.png', rendered[128]);
  fs.writeFileSync('public/brand/logo-256.png', rendered[256]);
  fs.writeFileSync('public/brand/logo-1024.png', rendered[1024]);
  fs.writeFileSync('public/brand/logo-dark-solid.png', rendered[1024]);

  // Additional Google Search favicon fallbacks in public root
  fs.writeFileSync('public/favicon-32x32.png', rendered[32]);
  fs.writeFileSync('public/favicon-48x48.png', rendered[48]);
  fs.writeFileSync('public/icon-192.png', rendered[192]);
  fs.writeFileSync('public/icon-512.png', rendered[512]);

  // Update src/lib/brand-assets.ts
  const b64 = 'data:image/png;base64,' + rendered[512].toString('base64');
  fs.writeFileSync(
    'src/lib/brand-assets.ts',
    `/**\n * Base64-encoded UNFLECT brand logo for zero-latency inlining in\n * OpenGraph cards, SVGs, and edge image renderers.\n */\nexport const LOGO_DATA_URI = "${b64}";\n`
  );

  // Clean up any test images created in scripts
  const cleanup = [
    'public/brand/logo-master-clean.png',
    'public/brand/test-rendered-svg.png',
    'public/brand/test-cleaned-jpeg.png',
    'public/brand/test-icon.svg',
    'public/brand/test-favicon.ico',
    'public/brand/test-icon-16.png',
    'public/brand/test-icon-32.png',
    'public/brand/test-icon-48.png',
    'public/brand/test-icon-64.png',
    'public/brand/test-icon-180.png',
    'public/brand/test-icon-192.png',
    'public/brand/test-icon-512.png',
  ];
  for (const f of cleanup) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }

  console.log('Favicon generation completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
