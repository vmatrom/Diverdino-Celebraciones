export const STORAGE_KEY = 'granplan.demo.bookings.v1';
export const TYPES = {kids:'Cumpleaños infantil',social:'Fiesta de 16 / 18',together:'Cena o encuentro'};
export const SLOTS = {morning:'Mañana',afternoon:'Tarde',full:'Día completo'};
export const money = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
export function todayMadrid(){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return ['year','month','day'].map(k=>p.find(v=>v.type===k).value).join('-');}
export function formatDate(date){return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(new Date(date+'T12:00:00'));}
export function loadBookings(){try{const a=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(a)?a.filter(b=>b&&typeof b.id==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(b.date)&&Object.hasOwn(TYPES,b.type)&&Object.hasOwn(SLOTS,b.slot)&&['demo','review','cancelled'].includes(b.status)&&Number.isFinite(b.total)):[];}catch{return [];}}
export function saveBookings(a){localStorage.setItem(STORAGE_KEY,JSON.stringify(a));}
export function available(a,date,slot){return !a.some(b=>b.date===date&&b.status==='demo'&&(b.slot===slot||b.slot==='full'||slot==='full'));}
export function quote(date,slot,cleaning=false,holiday=false){const day=new Date(date+'T12:00:00').getDay();const premium=holiday||day===0||day>=5;const base=slot==='full'?190:slot==='morning'?(premium?120:80):(premium?130:100);return {base,cleaning:cleaning?20:0,total:base+(cleaning?20:0),deposit:20};}
export function slotHours(date,slot,holiday=false){const day=new Date(date+'T12:00:00').getDay();return slot==='morning'?'10:00–14:00':slot==='full'?'10:00–21:00':holiday||day===0||day>=5?'16:00–21:30':'16:00–21:00';}
