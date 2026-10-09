import fs from 'fs';
import path from 'path';

function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

const baseDir = path.join(process.cwd(), '.next/server/app');
const pages = [
  { name: 'home', file: 'index.html' },
  { name: 'services', file: 'services.html' },
  { name: 'services/web', file: 'services/web.html' },
  { name: 'services/systems', file: 'services/systems.html' },
  { name: 'services/integrations', file: 'services/integrations.html' },
  { name: 'process', file: 'process.html' },
  { name: 'about', file: 'about.html' },
  { name: 'contact', file: 'contact.html' },
  { name: 'work', file: 'work.html' },
];

const results = {};
for (const p of pages) {
  const filePath = path.join(baseDir, p.file);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    results[p.name] = countWords(stripHtml(html));
  } else {
    results[p.name] = 0;
  }
}

const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  results['footer'] = countWords(stripHtml(footerMatch[0]));
}

console.log(JSON.stringify(results, null, 2));
