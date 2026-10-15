import {mkdir,cp,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {publicSettings} from './public-settings.mjs';
const settings=await publicSettings();
const root=process.cwd(),out=path.resolve(root,'pages-dist');
if(path.dirname(out)!==root||path.basename(out)!=='pages-dist')throw new Error('Invalid build destination');
await mkdir(out,{recursive:true});
for(const file of ['index.html','gestion.html','access.js','styles.css','refinements.css','motion.css','party.css','motion.js','party.js','data.js','booking.js','public-data.js','analytics.js','integrations.json','favicon.svg','robots.txt','sitemap.xml','llms.txt','assets','vendor'])await cp(path.join(root,'public',file),path.join(out,file),{recursive:true});
for(const route of ['admin','panel']){await mkdir(path.join(out,route),{recursive:true});await writeFile(path.join(out,route,'index.html'),'<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=../gestion.html"><title>Área privada · Diverdino</title><a href="../gestion.html">Acceder al área privada de Diverdino ↗</a></html>');}
for(const route of ['admin.html','panel.html'])await writeFile(path.join(out,route),'<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=gestion.html"><title>Área privada · Diverdino</title><a href="gestion.html">Acceder al área privada de Diverdino ↗</a></html>');
const site=settings.publicUrl;
for(const file of ['index.html','sitemap.xml','robots.txt']){const p=path.join(out,file);let s=await readFile(p,'utf8');s=s.replaceAll('https://www.diverdinoelche.com/assets/',site+'assets/');if(file==='index.html'){s=s.replace('rel="canonical" href="https://www.diverdinoelche.com/"',`rel="canonical" href="${site}"`);const match=s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);if(match){const data=JSON.parse(match[1]);for(const item of data['@graph']){if(item['@type']==='WebSite'){item.url=site;item['@id']=site+'#web';}}s=s.replace(match[1],JSON.stringify(data));}}else s=s.replaceAll('https://www.diverdinoelche.com/',site);await writeFile(p,s);}
await writeFile(path.join(out,'.nojekyll'),'');
if(settings.googleSiteVerification){const file=path.join(out,'index.html');await writeFile(file,(await readFile(file,'utf8')).replace('</head>','<meta name="google-site-verification" content="'+settings.googleSiteVerification+'"></head>'));}
const cname=path.join(out,'CNAME');if(new URL(site).hostname!=='vmatrom.github.io')await writeFile(cname,new URL(site).hostname+'\n');else await rm(cname,{force:true});
console.log('GitHub Pages public artifact: '+out);
