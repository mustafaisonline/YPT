#!/usr/bin/env node
/**
 * Adds sitewide SEO meta tags to all public HTML pages.
 * Redirect stubs get noindex. Run: node scripts/seo-patch.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const SEO_BLOCK = `    <meta property="og:site_name" content="Your Partner Technologies">
    <meta property="og:locale" content="en_MY">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">`;

const REDIRECT_MARKERS = ['http-equiv="refresh"', "http-equiv='refresh'"];

function walkHtml(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, files);
    else if (name.endsWith('.html')) files.push(p);
  }
  return files;
}

function isRedirect(html) {
  return REDIRECT_MARKERS.some((m) => html.includes(m));
}

function patchFile(filePath) {
  let html = readFileSync(filePath, 'utf8');
  let changed = false;

  if (isRedirect(html)) {
    if (!html.includes('name="robots"')) {
      html = html.replace(
        /(<meta charset="UTF-8">\s*\n)/,
        '$1    <meta name="robots" content="noindex, follow">\n'
      );
      changed = true;
    }
    if (changed) writeFileSync(filePath, html);
    return changed ? 'redirect-noindex' : 'skip';
  }

  if (!html.includes('og:site_name') && html.includes('og:type')) {
    html = html.replace(
      /(<meta property="og:type" content="[^"]*">\s*\n)/,
      `$1${SEO_BLOCK}\n`
    );
    changed = true;
  }

  if (changed) writeFileSync(filePath, html);
  return changed ? 'patched' : 'skip';
}

const files = walkHtml(ROOT);
const results = { patched: 0, redirect: 0, skip: 0 };
for (const f of files) {
  const r = patchFile(f);
  if (r === 'patched') results.patched++;
  else if (r === 'redirect-noindex') results.redirect++;
  else results.skip++;
}
console.log('SEO patch complete:', results);
