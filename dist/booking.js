import {TYPES,SLOTS,quote,slotHours,todayMadrid,formatDate,money} from './data.js';
const form=document.querySelector('#booking-form');
const result=document.querySelector('#booking-result');
form.elements.date.min=todayMadrid();form.elements.date.value=todayMadrid();
function clearResult(){result.replaceChildren();}
form.addEventListener('change',clearResult);form.addEventListener('input',clearResult);
document.querySelectorAll('.choose-plan').forEach(link=>link.addEventListener('click',()=>{form.elements.type.value=link.dataset.type;clearResult();}));
function addText(tag,text,parent,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const v={type:form.elements.type.value,date:form.elements.date.value,slot:form.elements.slot.value,guests:Number(form.elements.guests.value),cleaning:form.elements.cleaning.checked,holiday:form.elements.holiday.checked};clearResult();
 if(!v.date||v.date<todayMadrid()){addText('p','Elige una fecha de hoy o posterior.',result,'error');return;}
 const q=quote(v.date,v.slot,v.cleaning,v.holiday);
 addText('h4','Tu celebración empieza a tomar forma.',result);
 addText('p',`${formatDate(v.date)} · ${SLOTS[v.slot]} · ${slotHours(v.date,v.slot,v.holiday)} · ${v.guests} personas`,result);
 const dl=document.createElement('dl');dl.className='quote';
 for(const [label,value]of [['Alquiler del local',money(q.base)],['Limpieza elegida',money(q.cleaning)],['Total orientativo',money(q.total)]]){addText('dt',label,dl);addText('dd',value,dl);}result.append(dl);
 addText('p','El equipo comprobará la fecha y los detalles antes de confirmar. Reserva del día: 20 €. Hora extra: 20 €/h, sujeta a acuerdo. Comida, decoración y animación se contratan aparte.',result,'fineprint');
 if(v.holiday)addText('p','Has seleccionado tarifa de festivo. Confirmaremos el calendario aplicable contigo.',result,'fineprint');
 const message=`¡Hola, Diverdino! Quiero consultar una fecha.\nCelebración: ${TYPES[v.type]}.\nFecha: ${formatDate(v.date)}.\nTurno: ${SLOTS[v.slot]} (${slotHours(v.date,v.slot,v.holiday)}).\nAsistentes: ${v.guests}.\nLimpieza: ${v.cleaning?'Sí, 25 €':'No seleccionada'}.\nPrecio orientativo de alquiler y limpieza: ${money(q.total)}.\n¿Podéis confirmar disponibilidad y condiciones?`;
 const link=addText('a','Consultar esta fecha por WhatsApp ↗',result,'btn full');link.href=`https://wa.me/34644580495?text=${encodeURIComponent(message)}`;link.target='_blank';link.rel='noopener';
 addText('p','Se abrirá WhatsApp con tu consulta preparada. Enviarla no bloquea la fecha ni realiza un pago.',result,'fineprint');
});
