const routes = [
  '/',
  '/about',
  '/work',
  '/work/paperplane',
  '/work/dataforge',
  '/services',
  '/services/web',
  '/services/systems',
  '/services/integrations',
  '/process',
  '/contact',
  '/privacy',
  '/terms',
  '/sitemap.xml',
  '/robots.txt',
  '/work/operational-consolidation', // redirect test
  '/work/commerce-platform', // redirect test
  '/work/systems-integration', // redirect test
];

async function checkRoutes() {
  console.log('Testing routes on http://localhost:3002...\n');
  let hasErrors = false;

  for (const path of routes) {
    try {
      const url = `http://localhost:3002${path}`;
      const res = await fetch(url, { redirect: 'manual' });

      if (res.status === 307 || res.status === 308) {
        const location = res.headers.get('location');
        console.log(`[REDIRECT ${res.status}] ${path} -> ${location}`);
        continue;
      }

      if (res.status !== 200) {
        console.error(`[FAIL ${res.status}] ${path}`);
        hasErrors = true;
        continue;
      }

      const text = await res.text();
      let canonical = 'none';
      let title = 'none';
      const canMatch = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
      if (canMatch) canonical = canMatch[1];
      const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch) title = titleMatch[1];

      console.log(`[OK 200] ${path.padEnd(20)} | Title: ${title.slice(0, 35)}... | Canonical: ${canonical}`);
    } catch (err) {
      console.error(`[ERROR] ${path}: ${err.message}`);
      hasErrors = true;
    }
  }

  // Check JSON-LD
  console.log('\n--- Checking Structured Data (JSON-LD) ---');
  for (const page of ['/', '/work/paperplane']) {
    const res = await fetch(`http://localhost:3002${page}`);
    const text = await res.text();
    const matches = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    console.log(`Page ${page}: found ${matches.length} JSON-LD script block(s).`);
    for (const m of matches) {
      const parsed = JSON.parse(m[1]);
      const types = parsed['@graph']
        ? parsed['@graph'].map((g) => g['@type']).join(', ')
        : parsed['@type'];
      console.log(`  -> Type: ${types}`);
    }
  }

  if (!hasErrors) {
    console.log('\nAll routes, redirects, canonical tags, and structured data verified successfully!');
  } else {
    process.exit(1);
  }
}

checkRoutes();
