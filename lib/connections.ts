type KeyEnv={CONNECTIONS_ENCRYPTION_KEY?:string};
function err(message:string,status=400):never{throw Object.assign(new Error(message),{status});}
function str(x:unknown,max:number){if(typeof x!=='string'||x.length>max)err('Revisa los datos de conexión.');return x.trim();}
async function key(env:KeyEnv){const hex=env.CONNECTIONS_ENCRYPTION_KEY;if(!hex||!/^[a-f0-9]{64}$/.test(hex))err('El almacén seguro de conexiones no está configurado.',503);return crypto.subtle.importKey('raw',Uint8Array.from(hex.match(/../g)!,h=>parseInt(h,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function seal(value:string,env:KeyEnv){const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode('diverdino:metricool:v1')},await key(env),new TextEncoder().encode(value)));return JSON.stringify({v:1,iv:btoa(String.fromCharCode(...iv)),data:btoa(String.fromCharCode(...cipher))});}
async function unseal(value:string,env:KeyEnv){try{const data=JSON.parse(value);if(data.v!==1)err('Formato de credencial no compatible.');const decoded=await crypto.subtle.decrypt({name:'AES-GCM',iv:Uint8Array.from(atob(data.iv),c=>c.charCodeAt(0)),additionalData:new TextEncoder().encode('diverdino:metricool:v1')},await key(env),Uint8Array.from(atob(data.data),c=>c.charCodeAt(0)));return new TextDecoder().decode(decoded);}catch{err('No se ha podido abrir la credencial. Vuelve a guardarla desde Metricool.',503);}}
export async function connectionState(db:D1Database){const rows=await db.prepare('SELECT * FROM connections').all<any>();return Object.fromEntries(rows.results.map(row=>[row.provider,{...JSON.parse(row.settings),hasToken:!!row.encrypted_secret,verified:row.verified,updated:row.updated}]));}
export async function saveConnection(db:D1Database,env:KeyEnv,b:any){
 if(!['metricool','google'].includes(b.provider))err('Servicio no válido.');
 const old=await db.prepare('SELECT * FROM connections WHERE provider=?').bind(b.provider).first<any>();let settings,secret=old?.encrypted_secret||'';
 if(b.provider==='metricool'){
  const account=str(b.account||'',160),userId=str(b.userId||'',25),blogId=str(b.blogId||'',25);
  if((userId&&!/^\d{1,20}$/.test(userId))||(blogId&&!/^\d{1,20}$/.test(blogId)))err('userId y blogId deben ser números de Metricool.');
  settings={account,userId,blogId};const token=str(b.token||'',1000);
  if(token){if(!/^[\x21-\x7e]{10,1000}$/.test(token))err('El token de API tiene un formato incorrecto.');secret=await seal(token,env);}
  if(b.removeToken===true)secret='';
 }else{
  const account=str(b.account||'',160),ga4MeasurementId=str(b.ga4MeasurementId||'',30),googleSiteVerification=str(b.googleSiteVerification||'',200),ga4PropertyId=str(b.ga4PropertyId||'',25);
  if(ga4MeasurementId&&!/^G-[A-Z0-9]{6,20}$/.test(ga4MeasurementId))err('Introduce el ID del flujo de GA4, que empieza por G-.');
  if(!/^[a-zA-Z0-9_-]{0,200}$/.test(googleSiteVerification))err('Pega solo el contenido de la etiqueta de Google, sin HTML.');
  if(ga4PropertyId&&!/^\d{1,20}$/.test(ga4PropertyId))err('El identificador de propiedad de GA4 es numérico.');
  settings={account,ga4MeasurementId,googleSiteVerification,ga4PropertyId};secret='';
 }
 const serialized=JSON.stringify(settings),verified=old?.settings===serialized&&old?.encrypted_secret===secret?old.verified:'';
 await db.prepare('INSERT INTO connections(provider,settings,encrypted_secret,verified,updated) VALUES(?,?,?,?,?) ON CONFLICT(provider) DO UPDATE SET settings=excluded.settings,encrypted_secret=excluded.encrypted_secret,verified=excluded.verified,updated=excluded.updated').bind(b.provider,serialized,secret,verified,new Date().toISOString()).run();return {ok:true};
}
export async function verifyMetricool(db:D1Database,env:KeyEnv){
 const row=await db.prepare("SELECT * FROM connections WHERE provider='metricool'").first<any>();if(!row?.encrypted_secret)err('Guarda primero el token API de Metricool.');
 const settings=JSON.parse(row.settings);if(!settings.userId||!settings.blogId)err('Completa userId y blogId antes de comprobar la conexión.');
 await db.prepare("UPDATE connections SET verified='' WHERE provider='metricool'").run();
 const url=new URL('https://app.metricool.com/api/admin/simpleProfiles');url.searchParams.set('userId',settings.userId);
 let response:Response;try{response=await fetch(url,{headers:{'X-Mc-Auth':await unseal(row.encrypted_secret,env),Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(12000)});}catch{err('No se ha podido contactar con Metricool. Reintenta la comprobación más tarde.',502);}
 if(!response.ok){await db.prepare("UPDATE connections SET verified='' WHERE provider='metricool'").run();err(response.status===401||response.status===403?'Metricool ha rechazado el acceso. Revisa el token y que tu plan incluya API.':'Metricool no ha completado la comprobación. Reintenta más tarde.',502);}
 let result:any;try{result=await response.json();}catch{err('Metricool devolvió una respuesta no compatible.',502);}
 const entries=Array.isArray(result)?result:Array.isArray(result?.data)?result.data:Array.isArray(result?.profiles)?result.profiles:null;
 if(!entries||!entries.some((entry:any)=>String(entry.blogId)===settings.blogId))err('No se ha encontrado el blogId indicado entre las marcas autorizadas. Revisa la cuenta.',409);
 // Only prove read access to the selected brand; this is not a publishing permission check.
 const saved=await db.prepare("UPDATE connections SET verified=? WHERE provider='metricool' AND settings=? AND encrypted_secret=?").bind(new Date().toISOString(),row.settings,row.encrypted_secret).run();if(saved.meta.changes!==1)err('Los datos han cambiado durante la comprobación. Comprueba de nuevo la cuenta actual.',409);return {ok:true,message:'Acceso API a la marca comprobado. No se ha publicado ni programado contenido.'};
}
