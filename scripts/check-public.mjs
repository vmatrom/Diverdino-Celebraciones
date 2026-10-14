import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const html=await readFile('public/index.html','utf8');
assert.ok(html.includes('Diverdino'));
assert.ok(!/Concepto creativo|propuesta\.html|Diseñada para|Octubre 2026|#4fc3dc<|demo|360/i.test(html),'No production/proposal notes visible');
assert.ok(html.includes('https://www.tiktok.com/@diverdino44'));
assert.ok(html.includes('sin posibilidad de hacer fuego'));
assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(schema['@graph'][0].telephone,'+34644580495');assert.equal(schema['@graph'][0].address.postalCode,'03202');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=match[1];if(/^(https?:|tel:|data:)/.test(url))continue;assert.ok((await readFile(path.join('public',url))).length,'Local asset '+url);}
for(const name of ['hero-familiar.webp','social-v2.webp','together-v2.webp'])assert.ok(!html.includes(name),'Only real material displayed');
console.log('Public content, structured data, links and local assets checked.');
