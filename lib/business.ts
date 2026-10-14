export function price(date:string,slot:string,cleaning:boolean,holiday:boolean,hours=0){
 const d=new Date(date+'T12:00:00Z');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(d.valueOf())||d.toISOString().slice(0,10)!==date)throw new Error('Fecha no válida.');
 if(!['morning','afternoon','full'].includes(slot))throw new Error('Elige un turno.');
 if(!Number.isInteger(hours)||hours<0||hours>3)throw new Error('Horas extra: entre 0 y 3, sujetas a acuerdo.');
 const peak=holiday||[0,5,6].includes(d.getUTCDay());
 const base=slot==='full'?19000:slot==='morning'?(peak?12000:8000):(peak?13000:10000);
 return {base,extras:(cleaning?2500:0)+hours*2000};
}
export function discount(base:number,mode:string,value:number){return Math.min(base,mode==='percent'?Math.round(base*value/100):value);}
export const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
