export const VENUE = Object.freeze({capacity:75,cleaning:25,extraHour:20,deposit:20,calendar:'Shifter'});
export const TYPES = {kids:'Cumpleaños infantil',together:'Reunión familiar o de amigos',dinner:'Cena privada',social:'Fiesta de 16 / 18',talk:'Charla o taller',other:'Otro encuentro'};
export const SLOTS = {morning:'Mañana',afternoon:'Tarde',full:'Día completo'};
export const money = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
export function todayMadrid(){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return ['year','month','day'].map(k=>p.find(v=>v.type===k).value).join('-');}
export function formatDate(date){return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(new Date(date+'T12:00:00'));}
export function quote(date,slot,cleaning=false,holiday=false){const day=new Date(date+'T12:00:00').getDay();const premium=holiday||day===0||day>=5;const base=slot==='full'?190:slot==='morning'?(premium?120:80):(premium?130:100);return {base,cleaning:cleaning?VENUE.cleaning:0,total:base+(cleaning?VENUE.cleaning:0),deposit:VENUE.deposit};}
export function slotHours(date,slot,holiday=false){const day=new Date(date+'T12:00:00').getDay();return slot==='morning'?'10:00–14:00':slot==='full'?'10:00–21:00':holiday||day===0||day>=5?'16:00–21:30':'16:00–21:00';}
