import {mkdir,cp,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),out=path.resolve(root,'pages-dist');
if(path.dirname(out)!==root||path.basename(out)!=='pages-dist')throw new Error('Invalid build destination');
await mkdir(out,{recursive:true});
for(const file of ['index.html','styles.css','refinements.css','motion.css','party.css','motion.js','party.js','data.js','booking.js','public-data.js','favicon.svg','robots.txt','sitemap.xml','llms.txt','assets','vendor'])await cp(path.join(root,'public',file),path.join(out,file),{recursive:true});
const site='https://vmatrom.github.io/Diverdino-Celebraciones/';
for(const file of ['index.html','sitemap.xml','robots.txt']){const p=path.join(out,file);let s=await readFile(p,'utf8');s=s.replaceAll('https://www.diverdinoelche.com/assets/',site+'assets/');if(file==='index.html'){s=s.replace('rel="canonical" href="https://www.diverdinoelche.com/"',`rel="canonical" href="${site}"`);const match=s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);if(match){const data=JSON.parse(match[1]);for(const item of data['@graph']){if(item['@type']==='WebSite'){item.url=site;item['@id']=site+'#web';}}s=s.replace(match[1],JSON.stringify(data));}}else s=s.replaceAll('https://www.diverdinoelche.com/',site);await writeFile(p,s);}
await writeFile(path.join(out,'.nojekyll'),'');
console.log('GitHub Pages public artifact: '+out);
