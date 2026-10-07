/**
 * Production build audit script for UNFLECT.
 *
 * Verifies:
 * 1. Zero occurrences of "[CONFIRM" or raw placeholders across all generated HTML files.
 * 2. Zero occurrences of "premium" across all generated HTML files.
 * 3. Title tags, meta descriptions, and canonical links on all key public pages.
 * 4. Structured data (JSON-LD) validity.
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

console.log('=== UNFLECT Production Build Audit ===\n');

let failedChecks = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    failedChecks++;
  }
}

const appServerDir = resolve('.next/server/app');

function getHtmlFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        getHtmlFiles(fullPath, fileList);
      } else if (file.endsWith('.html')) {
        fileList.push(fullPath);
      }
    }
  } catch {
    // If directory doesn't exist
  }
  return fileList;
}

const htmlFiles = getHtmlFiles(appServerDir);
console.log(`Found ${htmlFiles.length} prerendered HTML output files in .next/server/app.\n`);

assert(htmlFiles.length > 0, 'Prerendered HTML files exist in .next/server/app');

console.log('--- 1. Prohibited String Scans across HTML Outputs ---');
let confirmLeakCount = 0;
let premiumWordCount = 0;
let loremWordCount = 0;

for (const filePath of htmlFiles) {
  const content = readFileSync(filePath, 'utf8');
  const relPath = filePath.replace(resolve('.'), '');

  if (content.includes('[CONFIRM')) {
    console.error(`  [LEAK] Found "[CONFIRM" in ${relPath}`);
    confirmLeakCount++;
  }

  // Check for whole word "premium"
  if (/\bpremium\b/i.test(content)) {
    console.error(`  [HYPE] Found "premium" in ${relPath}`);
    premiumWordCount++;
  }

  if (/\blorem\b/i.test(content)) {
    console.error(`  [LOREM] Found "lorem" in ${relPath}`);
    loremWordCount++;
  }
}

assert(confirmLeakCount === 0, 'Zero [CONFIRM placeholders leaked into prerendered HTML', `${confirmLeakCount} leaked`);
assert(premiumWordCount === 0, 'Zero "premium" occurrences in prerendered HTML', `${premiumWordCount} found`);
assert(loremWordCount === 0, 'Zero "lorem" occurrences in prerendered HTML', `${loremWordCount} found`);

console.log('\n--- 2. Key Pages SEO & Metadata Validation ---');

const keyRoutes = [
  { file: 'index.html', path: '/' },
  { file: 'about.html', path: '/about' },
  { file: 'services.html', path: '/services' },
  { file: 'services/web.html', path: '/services/web' },
  { file: 'services/systems.html', path: '/services/systems' },
  { file: 'services/integrations.html', path: '/services/integrations' },
  { file: 'process.html', path: '/process' },
  { file: 'work.html', path: '/work' },
  { file: 'work/paperplane.html', path: '/work/paperplane' },
  { file: 'work/dataforge.html', path: '/work/dataforge' },
  { file: 'work/preptwin.html', path: '/work/preptwin' },
  { file: 'contact.html', path: '/contact' },
  { file: 'privacy.html', path: '/privacy' },
  { file: 'terms.html', path: '/terms' },
];

for (const route of keyRoutes) {
  const fullPath = join(appServerDir, route.file);
  try {
    const html = readFileSync(fullPath, 'utf8');

    // Title check
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const hasTitle = Boolean(titleMatch && titleMatch[1].trim().length > 0);

    // Meta description check
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const hasDesc = Boolean(descMatch && descMatch[1].trim().length > 0);

    // Canonical check
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
    const hasCanonical = Boolean(canonicalMatch && canonicalMatch[1].startsWith('https://unflect.in'));

    assert(
      hasTitle && hasDesc && hasCanonical,
      `SEO Tags intact for ${route.path.padEnd(24)} | Title: "${titleMatch ? titleMatch[1].slice(0, 30) : ''}..."`,
    );
  } catch (err) {
    assert(false, `Route ${route.path} file found: ${err.message}`);
  }
}

console.log('\n--- 3. JSON-LD Structured Data Schema Validation ---');
const homeHtml = readFileSync(join(appServerDir, 'index.html'), 'utf8');
const jsonLdMatches = [...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

assert(jsonLdMatches.length >= 1, 'Homepage contains JSON-LD structured data script');

let jsonLdParsed = false;
for (const match of jsonLdMatches) {
  try {
    const parsed = JSON.parse(match[1]);
    if (parsed['@context'] === 'https://schema.org') {
      jsonLdParsed = true;
    }
  } catch (err) {
    console.error('Failed to parse JSON-LD:', err.message);
  }
}
assert(jsonLdParsed, 'Homepage JSON-LD valid schema.org structure');

console.log('\n--- Final Audit Result ---');
if (failedChecks === 0) {
  console.log('ALL PRODUCTION AUDIT CHECKS PASSED PERFECTLY!\n');
} else {
  console.error(`AUDIT FAILED with ${failedChecks} error(s).\n`);
  process.exit(1);
}
