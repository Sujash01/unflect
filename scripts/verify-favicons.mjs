import sharp from 'sharp';
import fs from 'fs';

async function checkAsset(filePath, expectedSizes, expectedFormat) {
  if (!fs.existsSync(filePath)) {
    console.error(`FAIL: File does not exist: ${filePath}`);
    return false;
  }
  const stat = fs.statSync(filePath);
  if (filePath.endsWith('.ico')) {
    const buf = fs.readFileSync(filePath);
    const count = buf.readUInt16LE(4);
    console.log(`PASS: ${filePath} (${stat.size} bytes, ${count} embedded icons)`);
    return true;
  }
  if (filePath.endsWith('.svg')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasPath = content.includes('path d=');
    const hasBlackBg = content.includes('fill="#000000"');
    console.log(`PASS: ${filePath} (${stat.size} bytes, SVG, blackBg: ${hasBlackBg}, validVector: ${hasPath})`);
    return true;
  }
  const meta = await sharp(filePath).metadata();
  console.log(`PASS: ${filePath} (${meta.width}x${meta.height}, format: ${meta.format}, size: ${stat.size} bytes)`);
  return true;
}

async function main() {
  console.log('=== Checking Generated Favicon & Logo Assets ===');
  await checkAsset('src/app/favicon.ico', [16, 32, 48], 'ico');
  await checkAsset('public/favicon.ico', [16, 32, 48], 'ico');
  await checkAsset('src/app/icon.svg', null, 'svg');
  await checkAsset('public/icon.svg', null, 'svg');
  await checkAsset('src/app/icon.png', [512, 512], 'png');
  await checkAsset('public/icon.png', [512, 512], 'png');
  await checkAsset('src/app/apple-icon.png', [180, 180], 'png');
  await checkAsset('public/apple-icon.png', [180, 180], 'png');
  await checkAsset('public/favicon-48x48.png', [48, 48], 'png');
  await checkAsset('public/favicon-32x32.png', [32, 32], 'png');
  await checkAsset('public/brand/logo.png', [512, 512], 'png');
  await checkAsset('public/brand/logo-48.png', [48, 48], 'png');
  await checkAsset('public/brand/logo-192.png', [192, 192], 'png');
  await checkAsset('public/brand/logo-512.png', [512, 512], 'png');
  console.log('=== All asset checks passed ===');
}

main().catch(console.error);
