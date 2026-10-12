import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lightweight secret scanner for CI. Flags high-confidence secret formats in
 * source and config files. It is intentionally conservative: it only matches
 * well-known secret shapes (JWTs, cloud keys, private keys) and skips test
 * fixtures, docs and .env* files. It is a readiness aid, not a replacement for
 * a dedicated scanner such as gitleaks.
 */

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "coverage", "docs"]);
const SKIP_EXT = new Set([".md", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif", ".ico"]);

const PATTERNS = [
  { name: "JWT", re: /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/ },
  { name: "OpenAI-style key", re: /sk-[A-Za-z0-9]{20,}/ },
  { name: "Slack token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: "AWS access key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub token", re: /ghp_[A-Za-z0-9]{20,}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z_-]{30,}/ },
  { name: "Private key", re: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/ },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === ".env" || entry.startsWith(".env.")) continue;
    const full = join(dir, entry);
    const rel = relative(root, full);
    if (rel.split(/[\\/]/).some((part) => SKIP_DIRS.has(part))) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) yield* walk(full);
    else if (stat.isFile()) yield full;
  }
}

const findings = [];

for (const file of walk(root)) {
  if (file.includes(`${"/"}tests${"/"}`) || file.includes(`${"/"}test${"/"}`)) continue;
  if (SKIP_EXT.has(extname(file).toLowerCase())) continue;
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const rel = relative(root, file);
  text.split("\n").forEach((line, index) => {
    for (const { name, re } of PATTERNS) {
      if (re.test(line)) {
        findings.push(`${rel}:${index + 1}: possible ${name}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Possible secrets found:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("No obvious secrets found in scanned files.");
