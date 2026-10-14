import { loadBookings, saveBookings, todayMadrid, formatDate, money, TYPES, SLOTS, available } from './data.js';

const $ = (selector) => document.querySelector(selector);
const state = { bookings: [], status: 'all', selectedDate: '', month: todayMadrid().slice(0, 7) };
let toastTimer;
const STATUS = { demo: 'Demo activa', review: 'Por revisar', cancelled: 'Cancelada' };
const campaigns = [
  { title: 'TikTok · un cumple desde dentro', filename: 'tiktok-cumple.txt', copy: 'Guion vertical de 20 segundos: entrada del local → parque de bolas vacío → rocódromo y zona baby → mesa preparada.\nTexto: Un cumple para los peques. Un gran plan para toda la familia.\nCierre: Consulta tu fecha · 644 580 495.\nPropuesta para grabar con material real del espacio y personas autorizadas. No se publica desde esta demo.' },
  { title: 'Diverdino Kids', image: 'assets/cartel-kids.webp', original: 'assets/cartel-kids.png', filename: 'gran-plan-kids.png', copy: 'Un cumple a lo grande. Un plan muy tuyo.\nParque de bolas, juegos y un espacio para celebrar en Elche.\nDescubre Diverdino Kids por gran plan. y consulta tu fecha.\n#DiverdinoKids #GranPlanElche #CumpleañosElche' },
  { title: 'Gran Plan Social', image: 'assets/cartel-social.webp', original: 'assets/cartel-social.png', filename: 'gran-plan-social.png', copy: 'Tus 16. Tus 18. Tu manera de celebrar.\nUn gran plan empieza con tu gente: consulta las opciones de celebración, disponibilidad y condiciones.\nVamos a preparar algo muy tuyo.\n#GranPlanSocial #GranPlanElche #CelebracionesElche' },
  { title: 'Gran Plan Together', image: 'assets/cartel-together.webp', original: 'assets/cartel-together.png', filename: 'gran-plan-together.png', copy: 'La mejor excusa para juntarnos: estar juntos.\nCenas, encuentros y celebraciones con tu gente en Elche.\nCuéntanos tu idea y preparemos un gran plan.\n#GranPlanTogether #GranPlanElche #PlanesEnElche' },
  { title: 'Un local. Todos tus planes.', filename: 'gran-plan-borrador.txt', copy: 'Hay planes que merecen su propio lugar.\nCumpleaños, cenas y encuentros: cuéntanos qué quieres celebrar.\nGran plan. · casa de celebraciones en Elche.\nConsulta disponibilidad, opciones y condiciones antes de reservar.\n#GranPlanElche #CelebraEnElche' }
];

function notify(message) {
  const toast = $('#panel-toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5500);
}

function readBookings() {
  try { state.bookings = loadBookings(); }
  catch { state.bookings = []; notify('No se pueden leer las reservas de este navegador.'); }
}

function setTab(name, focus = false) {
  const tabs = [...document.querySelectorAll('[data-tab]')];
  if (!tabs.some((tab) => tab.dataset.tab === name)) name = 'agenda';
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    $(`#view-${tab.dataset.tab}`).hidden = !active;
    if (active && focus) tab.focus();
  });
  history.replaceState(null, '', `#${name}`);
}

function filteredBookings() {
  return state.bookings.filter((booking) => (state.status === 'all' || booking.status === state.status) && (!state.selectedDate || booking.date === state.selectedDate))
    .sort((a, b) => a.date.localeCompare(b.date) || ({ morning: 0, full: 1, afternoon: 2 }[a.slot] ?? 3) - ({ morning: 0, full: 1, afternoon: 2 }[b.slot] ?? 3));
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderBookings() {
  const rows = $('#booking-rows');
  rows.replaceChildren();
  const bookings = filteredBookings();
  for (const booking of bookings) {
    const row = document.createElement('tr');
    row.append(element('td', '', formatDate(booking.date)));
    const titleCell = document.createElement('td');
    titleCell.append(element('span', 'booking-title', TYPES[booking.type] || 'Celebración'));
    titleCell.append(element('span', 'booking-detail', booking.type === 'kids' ? `${booking.guests} asistentes · ${money(booking.total)} simulados` : `${booking.guests} asistentes · presupuesto pendiente`));
    row.append(titleCell, element('td', '', SLOTS[booking.slot] || booking.slot));
    const statusCell = document.createElement('td');
    statusCell.append(element('span', `booking-status is-${booking.status}`, STATUS[booking.status] || 'Por revisar'));
    row.append(statusCell);
    const actionCell = document.createElement('td');
    const button = element('button', 'row-action', booking.status === 'cancelled' ? 'Restaurar' : 'Cancelar');
    button.type = 'button';
    button.setAttribute('aria-label', `${booking.status === 'cancelled' ? 'Restaurar' : 'Cancelar'} ${TYPES[booking.type] || 'celebración'} del ${formatDate(booking.date)}`);
    button.addEventListener('click', () => changeStatus(booking.id));
    actionCell.append(button); row.append(actionCell); rows.append(row);
  }
  const empty = $('#agenda-empty');
  empty.hidden = bookings.length > 0;
  empty.querySelector('h3').textContent = state.bookings.length ? 'No hay celebraciones con este filtro.' : 'Tu agenda empieza con la primera celebración.';
  empty.querySelector('p').textContent = state.bookings.length ? 'Prueba otro estado o selecciona otra fecha en el calendario.' : 'Prueba una reserva desde la web y aparecerá aquí.';
  const dateFilter = $('#date-filter');
  dateFilter.hidden = !state.selectedDate;
  dateFilter.textContent = state.selectedDate ? `${formatDate(state.selectedDate)} · Quitar filtro` : '';
  const active = state.bookings.filter((booking) => booking.status === 'demo');
  $('#stat-bookings').textContent = String(active.length);
  $('#stat-deposits').textContent = money(active.reduce((sum, booking) => sum + Number(booking.deposit || 0), 0));
}

function changeStatus(id) {
  readBookings();
  const target = state.bookings.find((booking) => booking.id === id);
  if (!target) { renderAll(); notify('Esta reserva ya no está en el navegador.'); return; }
  const restoring = target.status === 'cancelled';
  if (restoring && !available(state.bookings, target.date, target.slot)) {
    notify('No se puede restaurar: ese turno ya tiene una reserva demo activa.');
    renderAll(); return;
  }
  const next = state.bookings.map((booking) => {
    if (booking.id !== id) return booking;
    if (restoring) {
      const { cancelledFrom, ...rest } = booking;
      return { ...rest, status: cancelledFrom === 'review' ? 'review' : 'demo' };
    }
    return { ...booking, cancelledFrom: booking.status, status: 'cancelled' };
  });
  try { saveBookings(next); state.bookings = next; renderAll(); notify(restoring ? 'Reserva de prueba restaurada.' : 'Reserva de prueba cancelada. Puedes restaurarla desde Canceladas.'); }
  catch { notify('No se pudo guardar el cambio en este navegador.'); }
}

function renderCalendar() {
  const [year, month] = state.month.split('-').map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const numberOfDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  $('#calendar-month').textContent = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const grid = $('#calendar-grid'); grid.replaceChildren();
  for (let i = 0; i < offset; i++) grid.append(element('span', 'calendar-blank'));
  for (let day = 1; day <= numberOfDays; day++) {
    const date = `${state.month}-${String(day).padStart(2, '0')}`;
    const occupied = state.bookings.filter((booking) => booking.date === date && booking.status === 'demo');
    const morning = occupied.some((booking) => booking.slot === 'morning' || booking.slot === 'full');
    const afternoon = occupied.some((booking) => booking.slot === 'afternoon' || booking.slot === 'full');
    const button = element('button', `calendar-day${date === todayMadrid() ? ' is-today' : ''}${date === state.selectedDate ? ' is-selected' : ''}${occupied.length ? ' is-busy' : ''}${morning && afternoon ? ' is-full' : ''}`, String(day));
    button.type = 'button';
    button.setAttribute('aria-label', `${formatDate(date)}. ${morning && afternoon ? 'Día ocupado' : morning ? 'Mañana ocupada' : afternoon ? 'Tarde ocupada' : 'Sin reservas demo activas'}`);
    button.setAttribute('aria-pressed', String(date === state.selectedDate));
    if (date === todayMadrid()) button.setAttribute('aria-current', 'date');
    button.addEventListener('click', () => { state.selectedDate = state.selectedDate === date ? '' : date; renderAll(); });
    grid.append(button);
  }
}

function moveMonth(delta) {
  const [year, month] = state.month.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  state.month = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
  renderCalendar();
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportAgenda() {
  const rows = [['ID', 'Fecha', 'Celebración', 'Turno', 'Asistentes', 'Limpieza', 'Total simulado EUR', 'Señal simulada EUR', 'Estado'], ...filteredBookings().map((booking) => [booking.id, booking.date, TYPES[booking.type] || booking.type, SLOTS[booking.slot] || booking.slot, booking.guests, booking.cleaning ? 'Sí' : 'No', booking.total, booking.deposit, STATUS[booking.status] || booking.status])];
  downloadBlob(new Blob(['\uFEFF' + rows.map((row) => row.map(csvCell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }), `gran-plan-agenda-demo-${todayMadrid()}.csv`);
  notify('CSV de la agenda filtrada descargado. Contiene datos de prueba.');
}

async function copyCampaign(text, button) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const textarea = document.createElement('textarea'); textarea.value = text; textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none'; document.body.append(textarea); textarea.focus(); textarea.select();
      const copied = document.execCommand('copy'); textarea.remove(); if (!copied) throw new Error('Copy unavailable');
    }
    button.textContent = 'Texto copiado'; notify('Borrador copiado. Revísalo antes de publicarlo.');
    setTimeout(() => { button.textContent = 'Copiar texto'; }, 2000);
  } catch { notify('El navegador no permite copiar. Selecciona el texto del borrador para copiarlo manualmente.'); }
}

function renderMarketing() {
  const grid = $('#marketing-grid');
  campaigns.forEach((campaign) => {
    const card = element('article', `marketing-card${campaign.image ? '' : ' no-poster'}`);
    if (campaign.image) {
      const image = document.createElement('img'); image.className = 'marketing-poster'; image.src = campaign.image; image.alt = `Propuesta de cartel ${campaign.title}`; image.loading = 'lazy'; card.append(image);
    }
    const content = element('div', 'marketing-content');
    content.append(element('p', 'draft-label', 'Borrador de campaña'), element('h2', '', campaign.title), element('p', 'marketing-copy', campaign.copy));
    const actions = element('div', 'marketing-actions');
    const copy = element('button', 'copy-button', 'Copiar texto'); copy.type = 'button'; copy.addEventListener('click', () => copyCampaign(campaign.copy, copy)); actions.append(copy);
    if (campaign.image) {
      const download = element('a', 'inline-link', 'Descargar cartel'); download.href = campaign.original || campaign.image; download.download = campaign.filename; actions.append(download);
    } else {
      const download = element('button', 'inline-link', 'Descargar texto'); download.type = 'button'; download.addEventListener('click', () => downloadBlob(new Blob([campaign.copy], { type: 'text/plain;charset=utf-8;' }), campaign.filename)); actions.append(download);
    }
    content.append(actions); card.append(content); grid.append(card);
  });
}

function renderAll() { renderBookings(); renderCalendar(); }
document.querySelectorAll('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => setTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    const tabs = [...document.querySelectorAll('[data-tab]')];
    const index = tabs.indexOf(tab);
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) { event.preventDefault(); setTab(tabs[next].dataset.tab, true); }
  });
});
document.querySelectorAll('[data-open-tab]').forEach((button) => button.addEventListener('click', () => setTab(button.dataset.openTab, true)));
$('#status-filter').addEventListener('change', (event) => { state.status = event.target.value; renderBookings(); });
$('#date-filter').addEventListener('click', () => { state.selectedDate = ''; renderAll(); });
$('#month-prev').addEventListener('click', () => moveMonth(-1));
$('#month-next').addEventListener('click', () => moveMonth(1));
$('#month-today').addEventListener('click', () => { state.month = todayMadrid().slice(0, 7); state.selectedDate = ''; renderAll(); });
$('#export-csv').addEventListener('click', exportAgenda);
window.addEventListener('storage', () => { readBookings(); renderAll(); });
window.addEventListener('focus', () => { readBookings(); renderAll(); });
window.addEventListener('hashchange', () => setTab(location.hash.slice(1)));
document.addEventListener('visibilitychange', () => { if (!document.hidden) { readBookings(); renderAll(); } });
readBookings(); renderAll(); renderMarketing(); setTab(location.hash.slice(1));
