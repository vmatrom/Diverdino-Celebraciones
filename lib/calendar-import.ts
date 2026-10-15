// Shifter -> Google Calendar -> ICS. No Shifter API or background sync is assumed.
export type CalendarHold = {uid:string; title:string; date:string; slots:string[]; cancelled:boolean; start:string; end:string};
function dateOK(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value)throw new Error('Fecha de calendario incorrecta.');return value;}
function stamp(line:string){
 const colon=line.indexOf(':'),head=line.slice(0,colon),raw=line.slice(colon+1);
 const match=/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(raw);
 if(!match)throw new Error('Fecha no compatible. Exporta en formato iCalendar (.ics).');
 const date=dateOK(match[1]+'-'+match[2]+'-'+match[3]);
 if(!match[4])return {date,time:'',allDay:true};
 if(+match[4]>23||+match[5]>59||+match[6]>59)throw new Error('Hora incorrecta.');
 const zone=/TZID=([^;:]+)/i.exec(head)?.[1]?.replaceAll('"','');
 if(zone&&!['Europe/Madrid','UTC','Etc/UTC'].includes(zone))throw new Error('Zona horaria no compatible: '+zone+'. Exporta en Europe/Madrid o UTC.');
 if(match[7]||zone==='UTC'||zone==='Etc/UTC'){
  const d=new Date(date+'T'+match[4]+':'+match[5]+':'+match[6]+'Z');
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d);
  const part=(type:string)=>parts.find(p=>p.type===type)!.value;
  return {date:part('year')+'-'+part('month')+'-'+part('day'),time:part('hour')+':'+part('minute'),allDay:false};
 }
 return {date,time:match[4]+':'+match[5],allDay:false};
}
function text(value:string){return value.replace(/\\[nN]/g,' ').replace(/\\([,;\\])/g,'$1').trim().slice(0,150);}
export function parseCalendar(ics:unknown):{events:CalendarHold[];warnings:string[]}{
 if(typeof ics!=='string'||ics.length>55000||!ics.includes('BEGIN:VCALENDAR'))throw new Error('Selecciona un calendario .ics de hasta 55 KB. Exporta por meses si es mayor.');
 const lines=ics.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\n[ \t]/g,'').split('\n');
 if(lines.filter(l=>l==='BEGIN:VCALENDAR').length!==1||lines.filter(l=>l==='END:VCALENDAR').length!==1||lines.find(l=>l.trim())!=='BEGIN:VCALENDAR'||[...lines].reverse().find(l=>l.trim())!=='END:VCALENDAR')throw new Error('El calendario está incompleto o contiene varios calendarios.');
 const blocks:string[][]=[];let current:string[]|null=null,depth=0;
 for(const line of lines){if(line==='BEGIN:VEVENT'){if(current)throw new Error('Calendario no válido.');current=[];depth=0;}else if(line==='END:VEVENT'){if(!current)throw new Error('Calendario no válido.');blocks.push(current);current=null;}else if(current){if(line.startsWith('BEGIN:'))depth++;if(!depth)current.push(line);if(line.startsWith('END:'))depth--;}}
 if(current||!blocks.length||blocks.length>100)throw new Error('El archivo debe contener entre 1 y 100 eventos completos.');
 const events:CalendarHold[]=[],warnings:string[]=[],seen=new Set<string>();
 for(let i=0;i<blocks.length;i++){
  const block=blocks[i],get=(key:string)=>block.filter(l=>l.split(/[;:]/,1)[0]===key),value=(key:string)=>get(key)[0]?.slice(get(key)[0].indexOf(':')+1)||'';
  const title=text(value('SUMMARY'))||'Ocupación de Shifter';
  try{
   if(['RRULE','RDATE','EXDATE','RECURRENCE-ID'].some(k=>get(k).length))throw new Error('Repetición: expande primero los eventos recurrentes o revísalos manualmente.');
   const uid=value('UID');if(get('UID').length!==1||!uid||uid.length>500)throw new Error('Falta un UID válido para evitar duplicados.');if(seen.has(uid))throw new Error('UID repetido dentro del archivo.');seen.add(uid);
   if(get('DTSTART').length!==1||get('DTEND').length!==1)throw new Error('Necesita fecha de inicio y fin explícitas.');
   const start=stamp(get('DTSTART')[0]),end=stamp(get('DTEND')[0]);let slots:string[]=[];
   if(start.allDay!==end.allDay)throw new Error('Inicio y fin tienen formatos distintos.');
   if(start.allDay){const next=new Date(start.date+'T12:00:00Z');next.setUTCDate(next.getUTCDate()+1);if(end.date!==next.toISOString().slice(0,10))throw new Error('Evento de varios días: revísalo manualmente.');slots=['morning','afternoon'];}
   else{
    if(start.date!==end.date||end.time<=start.time)throw new Error('Evento nocturno o de varios días: revísalo manualmente.');
    // A partial reservation blocks the whole corresponding rental shift.
    if(start.time<'14:00'&&end.time>'10:00')slots.push('morning');
    if(start.time<'23:59'&&end.time>'16:00')slots.push('afternoon');
    if(!slots.length)throw new Error('No coincide con los turnos del local: revísalo manualmente.');
   }
   events.push({uid,title,date:start.date,slots,cancelled:value('STATUS')==='CANCELLED',start:start.date+(start.time?' '+start.time:''),end:end.date+(end.time?' '+end.time:'')});
  }catch(e){warnings.push('Evento '+(i+1)+' · '+title+': '+(e as Error).message);}
 }
 return {events,warnings};
}
export async function holdId(uid:string){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(uid));return 'shifter-'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}
