import adminHTML from '../content/admin.html?raw';
import {price,discount,day} from './business';
type Env={DB?:D1Database;BUCKET?:R2Bucket;ADMIN_EMAIL?:string};
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
function json(data:unknown,status=200){return Response.json(data,{status,headers});}
function fail(message:string,status=400):never{throw Object.assign(new Error(message),{status});}
function txt(x:unknown,max=500,required=false){if(typeof x!=='string'||x.length>max||(required&&!x.trim()))fail('Revisa los campos del formulario.');return x.trim();}
function int(x:unknown,min:number,max:number){if(!Number.isInteger(x)||Number(x)<min||Number(x)>max)fail('Número fuera de los límites permitidos.');return Number(x);}
function validDate(x:unknown){const v=txt(x,10,true);try{price(v,'morning',false,false);}catch{fail('Fecha incorrecta.');}return v;}
function phone(x:unknown){const v=txt(x,25,true).replace(/[\s()+.-]/g,'');if(!/^\d{9,15}$/.test(v))fail('Introduce un teléfono válido.');return v;}
async function body(r:Request){if(Number(r.headers.get('content-length'))>64000)fail('Formulario demasiado grande.',413);const raw=await r.text();if(raw.length>64000)fail('Formulario demasiado grande.',413);try{return JSON.parse(raw);}catch{fail('Formato incorrecto.');}}
function writeGuard(r:Request){if(r.headers.get('origin')!==new URL(r.url).origin||r.headers.get('x-diverdino-request')!=='1')fail('Solicitud no autorizada.',403);}
async function log(db:D1Database,actor:string,action:string){await db.prepare('INSERT INTO audit(id,actor,action,created) VALUES(?,?,?,?)').bind(crypto.randomUUID(),actor,action,new Date().toISOString()).run();}
async function member(r:Request,env:Env){
 const id=r.headers.get('oai-authenticated-user-id'),email=r.headers.get('oai-authenticated-user-email');if(!id||!email)fail('Inicia sesión para gestionar Diverdino.',401);
 const db=env.DB!;let m=await db.prepare('SELECT * FROM members WHERE id=?').bind(id).first<any>();
 if(!m&&env.ADMIN_EMAIL&&email.toLowerCase()===env.ADMIN_EMAIL.toLowerCase()){
  await db.prepare("INSERT OR IGNORE INTO members(id,email,role,name) VALUES(?,?,'admin',?)").bind(id,email,'Administrador').run();m=await db.prepare('SELECT * FROM members WHERE id=?').bind(id).first<any>();
 }
 if(m?.role!=='admin')fail('Esta cuenta no tiene permiso de administrador.',403);return m;
}
async function promoFor(db:D1Database,code:string,date:string,contact='',repeat=false,id=''){
 const p=await db.prepare('SELECT * FROM promotions WHERE code=? AND active=1').bind(code).first<any>();
 if(!p||date<p.start||date>p.end)fail('Código no disponible para esta fecha.');
 const count=await db.prepare("SELECT COUNT(*) n FROM bookings WHERE promo=? AND status<>'cancelled' AND id<>?").bind(code,id).first<any>();
 if(count.n>=p.use_limit)fail('Este código ha agotado sus usos.');
 if(p.kind==='referral'&&(!p.referrer||p.referrer===contact))fail('La recomendación debe proceder de otra persona.');
 if(p.kind==='repeat'&&!repeat)fail('Verifica el cumpleaños anterior para aplicar este código.');
 return p;
}
const kinds=['customers','social','events','mentions','tasks','holidays'];
function recordPayload(kind:string,b:any):any{
 if(kind==='customers')return {name:txt(b.name,120,true),phone:phone(b.phone),email:txt(b.email||'',160),notes:txt(b.notes||'',1000)};
 if(kind==='social')return {title:txt(b.title,150,true),date:validDate(b.date),time:txt(b.time||'',5),mediaId:txt(b.mediaId||'',100),platform:['Todas · Instagram, Facebook y TikTok','Instagram','Facebook','TikTok','WhatsApp'].includes(b.platform)?b.platform:'Instagram',text:txt(b.text,5000,true),status:['draft','ready','published'].includes(b.status)?b.status:'draft'};
 if(kind==='events')return {title:txt(b.title,150,true),date:validDate(b.date),text:txt(b.text,2000,true),mediaId:txt(b.mediaId||'',100),status:b.status==='published'?'published':'draft',permission:b.permission===true};
 if(kind==='mentions')return {title:txt(b.title,150,true),source:txt(b.source,120,true),topic:txt(b.topic,100,true),text:txt(b.text||'',2000),date:validDate(b.date)};
 if(kind==='tasks')return {title:txt(b.title,150,true),date:validDate(b.date),status:b.status==='done'?'done':'pending',text:txt(b.text||'',1000)};
 if(kind==='holidays')return {title:txt(b.title,150,true),date:validDate(b.date)};
 fail('Sección desconocida.');
}
function fileMime(bytes:Uint8Array,type:string){
 if(type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return true;
 if(type==='image/png'&&bytes.slice(0,8).join(',')==='137,80,78,71,13,10,26,10')return true;
 const ascii=(a:number,b:number)=>String.fromCharCode(...bytes.slice(a,b));
 if(type==='image/webp'&&ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP')return true;
 if(type==='video/mp4'&&ascii(4,8)==='ftyp')return true;
 if(type==='video/webm'&&bytes.slice(0,4).join(',')==='26,69,223,163')return true;
 return false;
}
export async function backend(r:Request,env:Env):Promise<Response|null>{
 const u=new URL(r.url),path=u.pathname;
 if(path==='/panel.html'||path==='/panel')return Response.redirect(new URL('/admin',u),302);
 if(path==='/propuesta'||path==='/propuesta.html')return Response.redirect(new URL('/admin#documents',u),302);
 if(!path.startsWith('/api/')&&path!=='/admin'&&!path.startsWith('/media/')&&!path.startsWith('/private-docs/'))return null;
 try{
  if(!env.DB)fail('El almacenamiento todavía no está configurado.',503);const db=env.DB;
  if(path.startsWith('/private-docs/')){await member(r,env);return null;}
  if(path.startsWith('/media/')){
   const id=path.slice(7);const events=await db.prepare("SELECT payload FROM records WHERE kind='events'").all<any>();
   const allowed=events.results.some(x=>{const e=JSON.parse(x.payload);return e.mediaId===id&&e.status==='published'&&e.permission;});
   if(!allowed)await member(r,env);
   const obj=await env.BUCKET?.get(id);if(!obj)fail('Archivo no encontrado.',404);
   return new Response(obj.body,{headers:{'Content-Type':obj.httpMetadata?.contentType||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':allowed?'public,max-age=300':'private,no-store','Content-Security-Policy':"default-src 'none'; sandbox"}});
  }
  if(path==='/admin'){
   if(!r.headers.get('oai-authenticated-user-id'))return new Response('<!doctype html><html lang="es"><meta name="viewport" content="width=device-width"><title>Acceso · Diverdino</title><link rel="stylesheet" href="/admin.css"><main class="login"><span class="wordmark">Diverdino<span>.</span></span><h1>Todo listo para<br>tu próxima fiesta.</h1><p>Acceso privado para el equipo de Diverdino.</p><a class="button" target="_top" href="/signin-with-chatgpt?return_to=%2Fadmin">Entrar con ChatGPT ↗</a><p><a href="/">Volver a la web</a></p></main></html>',{headers:{...headers,'Content-Type':'text/html;charset=utf-8'}});
   await member(r,env);return new Response(adminHTML,{headers:{...headers,'Content-Type':'text/html;charset=utf-8'}});
  }
  if(path==='/api/events'&&r.method==='GET'){
   const data=await db.prepare("SELECT id,payload FROM records WHERE kind='events' ORDER BY updated DESC LIMIT 30").all<any>();const items=data.results.map(x=>({id:x.id,...JSON.parse(x.payload)})).filter(x=>x.status==='published'&&x.permission);for(const item of items){if(item.mediaId){const meta=await db.prepare('SELECT mime FROM media WHERE id=?').bind(item.mediaId).first<any>();item.mime=meta?.mime||'';}}return json(items);
  }
  if(path==='/api/availability'&&r.method==='GET'){
   const date=validDate(u.searchParams.get('date'));const s=await db.prepare('SELECT slot FROM slots WHERE date=?').bind(date).all<any>();return json({date,occupied:s.results.map(x=>x.slot),note:'La confirmación final corresponde al equipo.'});
  }
  if(path==='/api/traffic'&&r.method==='POST'){
   writeGuard(r);const b=await body(r);
   if(!['/','/index.html'].includes(b.path)||!['view','quote','whatsapp','card'].includes(b.event)||!['direct','social','search','other'].includes(b.source))fail('Evento no válido.');
   await db.prepare('INSERT INTO visits(day,path,source,event,count) VALUES(?,?,?,?,1) ON CONFLICT(day,path,source,event) DO UPDATE SET count=MIN(count+1,100000)').bind(day(),b.path,b.source,b.event).run();return json({ok:true});
  }
  const m=await member(r,env);if(!['GET','HEAD'].includes(r.method))writeGuard(r);
  if(path==='/api/admin/state'&&r.method==='GET'){
   const [bookings,promos,recs,files,traffic,audit]=await Promise.all([
    db.prepare('SELECT * FROM bookings ORDER BY date DESC LIMIT 2000').all(),db.prepare("SELECT p.*,(SELECT COUNT(*) FROM bookings b WHERE b.promo=p.code AND b.status<>'cancelled') uses FROM promotions p ORDER BY code").all(),db.prepare('SELECT * FROM records ORDER BY updated DESC LIMIT 3000').all<any>(),db.prepare('SELECT * FROM media ORDER BY created DESC LIMIT 500').all(),db.prepare('SELECT * FROM visits ORDER BY day DESC LIMIT 5000').all(),db.prepare('SELECT action,created FROM audit ORDER BY created DESC LIMIT 100').all()]);
   return json({member:{name:m.name,email:m.email,role:m.role,settings:JSON.parse(m.settings)},bookings:bookings.results,promotions:promos.results,records:recs.results.map(x=>({...x,payload:JSON.parse(x.payload)})),media:files.results,traffic:traffic.results,audit:audit.results});
  }
  if(path==='/api/admin/profile'&&r.method==='POST'){
   const b=await body(r);const settings={repeatMode:b.repeatMode==='fixed'?'fixed':'percent',repeatValue:int(b.repeatValue,0,b.repeatMode==='fixed'?19000:100),referralMode:b.referralMode==='fixed'?'fixed':'percent',referralValue:int(b.referralValue,0,b.referralMode==='fixed'?19000:100),tiktok:txt(b.tiktok||'',80)};
   await db.prepare('UPDATE members SET name=?,settings=? WHERE id=?').bind(txt(b.name,100,true),JSON.stringify(settings),m.id).run();await log(db,m.id,'Perfil y preferencias de descuentos actualizados');return json({ok:true});
  }
  if(path==='/api/admin/promotions'&&r.method==='POST'){
   const b=await body(r),code=txt(b.code,30,true).toUpperCase();if(!/^[A-Z0-9-]{3,30}$/.test(code))fail('Código: 3–30 letras, números o guiones.');
   const kind=['promo','referral','repeat'].includes(b.kind)?b.kind:'promo',mode=b.mode==='fixed'?'fixed':'percent',start=validDate(b.start),end=validDate(b.end);if(end<start)fail('El final debe ser posterior al inicio.');
   const referrer=kind==='referral'?phone(b.referrer):'';
   await db.prepare('INSERT INTO promotions(code,kind,mode,value,start,end,use_limit,active,referrer) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET kind=excluded.kind,mode=excluded.mode,value=excluded.value,start=excluded.start,end=excluded.end,use_limit=excluded.use_limit,active=excluded.active,referrer=excluded.referrer').bind(code,kind,mode,int(b.value,1,mode==='percent'?100:19000),start,end,int(b.limit,1,10000),b.active?1:0,referrer).run();await log(db,m.id,'Código guardado: '+code);return json({ok:true});
  }
  if(path==='/api/admin/bookings'&&r.method==='POST'){
   const b=await body(r),id=b.id?txt(b.id,80):crypto.randomUUID(),date=validDate(b.date),slot=txt(b.slot,15,true),contact=phone(b.phone);
   const holidays=await db.prepare("SELECT payload FROM records WHERE kind='holidays'").all<any>();const holiday=b.holiday===true||holidays.results.some(x=>JSON.parse(x.payload).date===date);
   const q=price(date,slot,b.cleaning===true,holiday,int(b.hours??0,0,3)),code=txt(b.promo||'',30).toUpperCase();
   let reduction=0;if(code&&b.status!=='cancelled'){const p=await promoFor(db,code,date,contact,b.repeat===true,id);reduction=discount(q.base,p.mode,p.value);}
   const status=['pending','confirmed','done','cancelled'].includes(b.status)?b.status:'pending';
   const statements=[db.prepare('DELETE FROM slots WHERE booking=?').bind(id),db.prepare('INSERT INTO bookings(id,date,slot,status,name,phone,guests,type,base,extras,discount,total,promo,notes,updated) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET date=excluded.date,slot=excluded.slot,status=excluded.status,name=excluded.name,phone=excluded.phone,guests=excluded.guests,type=excluded.type,base=excluded.base,extras=excluded.extras,discount=excluded.discount,total=excluded.total,promo=excluded.promo,notes=excluded.notes,updated=excluded.updated').bind(id,date,slot,status,txt(b.name,120,true),contact,int(b.guests,1,75),txt(b.type,80,true),q.base,q.extras,reduction,q.base+q.extras-reduction,code,JSON.stringify({text:txt(b.notes||'',1500),cleaning:b.cleaning===true,holiday,hours:b.hours||0,repeat:b.repeat===true}),new Date().toISOString())];
   if(status!=='cancelled')for(const s of slot==='full'?['morning','afternoon']:[slot])statements.push(db.prepare('INSERT INTO slots(date,slot,booking) VALUES(?,?,?)').bind(date,s,id));
   try{await db.batch(statements);}catch(e){if(/UNIQUE|promo_limit/i.test(String(e)))fail('Ese turno está ocupado o el código ha agotado sus usos. No se ha guardado ningún cambio.',409);throw e;}
   await log(db,m.id,'Reserva guardada: '+date+' · '+status);return json({ok:true,id,total:q.base+q.extras-reduction,discount:reduction});
  }
  if(path.startsWith('/api/admin/records/')&&r.method==='POST'){
   const kind=path.split('/').pop()!;if(!kinds.includes(kind))fail('Sección desconocida.',404);const b=await body(r),id=b.id?txt(b.id,80):crypto.randomUUID(),data=recordPayload(kind,b);
   if(kind==='events'&&data.status==='published'&&!data.permission)fail('Confirma los permisos del contenido antes de publicarlo.');
   if(kind==='events'&&data.mediaId&&!await db.prepare('SELECT id FROM media WHERE id=?').bind(data.mediaId).first())fail('Archivo no encontrado.');
   const existing=await db.prepare('SELECT kind FROM records WHERE id=?').bind(id).first<any>();if(existing&&existing.kind!==kind)fail('Registro incorrecto.');
   await db.prepare('INSERT INTO records(id,kind,payload,updated) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated=excluded.updated').bind(id,kind,JSON.stringify(data),new Date().toISOString()).run();await log(db,m.id,'Contenido guardado: '+kind);return json({ok:true,id});
  }
  if(path==='/api/admin/upload'&&r.method==='POST'){
   if(!env.BUCKET)fail('Almacenamiento de archivos no configurado.',503);
   if(Number(r.headers.get('content-length'))>26*1024*1024)fail('El archivo supera 25 MB.',413);
   const form=await r.formData(),file=form.get('file');if(!(file instanceof File)||!file.size||file.size>25*1024*1024)fail('Selecciona una foto o vídeo de hasta 25 MB.');
   const bytes=new Uint8Array(await file.arrayBuffer());if(!fileMime(bytes,file.type))fail('Usa una imagen JPEG, PNG, WebP o un vídeo MP4/WebM válido.');
   const id=crypto.randomUUID(),name=file.name.replace(/[^\p{L}\p{N} ._-]/gu,'').slice(0,140)||'Archivo';
   await env.BUCKET.put(id,bytes,{httpMetadata:{contentType:file.type}});await db.prepare('INSERT INTO media(id,name,mime,size,created) VALUES(?,?,?,?,?)').bind(id,name,file.type,file.size,new Date().toISOString()).run();await log(db,m.id,'Archivo añadido: '+name);return json({ok:true,id});
  }
  fail('Ruta no encontrada.',404);
 }catch(e:any){if(e.status)return json({error:e.message},e.status);console.error('Diverdino backend:',e);return json({error:'No se ha podido completar la operación. Inténtalo de nuevo.'},500);}
}
