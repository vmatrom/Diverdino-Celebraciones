import {TYPES,SLOTS,quote,slotHours,todayMadrid,formatDate,money,loadBookings,saveBookings,available} from './data.js';
const form=document.querySelector('#booking-form');
const dateInput=form.elements.date;
dateInput.min=todayMadrid();
dateInput.value=todayMadrid();
const result=document.querySelector('#booking-result');
let latest=null;
function values(){return {type:form.elements.type.value,date:form.elements.date.value,slot:form.elements.slot.value,guests:Number(form.elements.guests.value),cleaning:form.elements.cleaning.checked,holiday:form.elements.holiday.checked};}
function clearResult(){latest=null;result.replaceChildren();}
form.addEventListener('change',clearResult);
form.addEventListener('input',clearResult);
document.querySelectorAll('.choose-plan').forEach(link=>link.addEventListener('click',()=>{form.elements.type.value=link.dataset.type;clearResult();}));
function addText(tag,text,parent,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
form.addEventListener('submit',event=>{
  event.preventDefault(); if(!form.reportValidity())return;
  const v=values();if(!v.date||v.date<todayMadrid()){clearResult();addText('p','Elige una fecha de hoy o posterior.',result,'error');return;}
  clearResult();
  const review=v.type!=='kids';
  if(!available(loadBookings(),v.date,v.slot)){addText('h4','Este turno ya tiene una reserva demo.',result);addText('p','Prueba otra fecha o turno. Puedes revisar y cancelar registros de prueba desde el panel.',result);return;}
  const q=quote(v.date,v.slot,v.cleaning,v.holiday);latest={...v,...q};
  addText('h4',review?'Podemos preparar una solicitud demo.':'Hay hueco en tu agenda demo.',result);
  addText('p',`${formatDate(v.date)} · ${SLOTS[v.slot]} · ${slotHours(v.date,v.slot,v.holiday)} · ${v.guests} personas`,result);
  if(review){addText('p','El alquiler tiene esta tarifa base. Revisaremos el montaje y las condiciones de tu actividad antes de confirmar. Comida, decoración y animación no se presuponen incluidas.',result,'fineprint');}
  {
    const dl=document.createElement('dl');dl.className='quote';
    for(const [label,value]of [['Alquiler de referencia',money(q.base)],['Limpieza elegida',money(q.cleaning)],['Total de referencia',money(q.total)]]){addText('dt',label,dl);addText('dd',value,dl);}result.append(dl);
    addText('p','Para confirmar el día: 20 €. El tratamiento de ese importe y las condiciones se acordarán con el negocio. En esta demo no se paga ni se calcula saldo pendiente. Hora extra: 20 €/h, sujeta a aprobación.',result,'fineprint');
  }
  const button=addText('button',review?'Guardar solicitud de prueba':'Crear reserva de prueba',result,'btn full');button.type='button';button.addEventListener('click',createDemo);
});
function createDemo(){
 if(!latest)return;
 const v={...latest};if(v.date<todayMadrid()){clearResult();addText('p','La fecha ha pasado. Consulta de nuevo.',result);return;}
 const rows=loadBookings();if(!available(rows,v.date,v.slot)){clearResult();addText('p','El turno acaba de ocuparse en la agenda demo. Consulta otra franja.',result,'error');return;}
 const review=v.type!=='kids';
 const record={...v,total:review?0:v.total,deposit:review?0:20,id:crypto.randomUUID(),label:'Celebración de prueba',status:review?'review':'demo',createdAt:new Date().toISOString()};
 try{saveBookings([...rows,record]);}catch{addText('p','Tu navegador no permite guardar la prueba. Revisa el almacenamiento local.',result,'error');return;}
 latest=null;result.replaceChildren();addText('h4',review?'Solicitud de prueba guardada.':'Tu reserva de prueba está en la agenda.',result);addText('p',review?'No bloquea la agenda ni confirma un evento real.':'Este turno queda ocupado solo en la agenda de este navegador. No se ha enviado ningún mensaje ni cobrado ningún importe.',result);const a=addText('a','Ver en el panel de gestión ↗',result,'inline-link');a.href='panel.html';
}
window.addEventListener('storage',()=>{if(latest)clearResult();});
