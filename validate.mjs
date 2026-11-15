import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const failures = [];

const resolvePublicPath = (url) => {
  const clean = url.split(/[?#]/)[0];
  if (!clean.startsWith('/')) return null;
  if (clean === '/') return path.join(dist, 'index.html');
  if (clean.endsWith('/')) return path.join(dist, clean, 'index.html');
  return path.join(dist, clean);
};

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const short = path.relative(dist, file);
  if (!source.includes('<html lang="de">')) failures.push(`${short}: lang=de fehlt`);
  if (!/<title>[^<]+<\/title>/.test(source)) failures.push(`${short}: title fehlt`);
  if (!/<meta name="description" content="[^"]+">/.test(source)) failures.push(`${short}: description fehlt`);
  if (!/<h1(?:\s|>)/.test(source)) failures.push(`${short}: h1 fehlt`);
  if (source.includes('undefined') || source.includes('href="#"')) failures.push(`${short}: Platzhalter gefunden`);

  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`${short}: doppelte IDs ${[...new Set(duplicateIds)].join(', ')}`);

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/.test(url)) continue;
    const target = resolvePublicPath(url);
    if (target && !fs.existsSync(target)) failures.push(`${short}: Ziel fehlt ${url}`);
  }
}

const css = fs.readFileSync(path.join(dist, 'assets', 'site.css'), 'utf8');
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const target = resolvePublicPath(match[1]);
  if (target && !fs.existsSync(target)) failures.push(`site.css: Asset fehlt ${match[1]}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files and all local references.`);
