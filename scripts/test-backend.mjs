import assert from 'node:assert/strict';
const base=process.env.TEST_ORIGIN||'http://127.0.0.1:43167';
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))throw new Error('Run against a local test database only.');
const login=await fetch(base+'/signin-with-chatgpt?return_to=%2Fadmin',{redirect:'manual'}),cookie=login.headers.get('set-cookie')?.split(';')[0];
assert.ok(cookie,'Local sign-in cookie');
let passed=0;
async function request(path,data,options={}){const response=await fetch(base+path,{method:data?'POST':'GET',headers:{Cookie:cookie,...(data?{'Content-Type':'application/json',Origin:base,'X-Diverdino-Request':'1'}:{}),...options.headers},body:data?JSON.stringify(data):undefined});let body;try{body=await response.json();}catch{body={};}return {status:response.status,body};}
function check(name,actual,expected){assert.deepEqual(actual,expected,name);passed++;console.log('PASS '+name);}
const unique=Date.now().toString(36).toUpperCase(),code='QA-'+unique,date='2034-06-08',next='2034-06-09';
check('Anonymous admin denied',(await fetch(base+'/api/admin/state')).status,401);
const entrance=await fetch(base+'/admin',{redirect:'manual'});check('Anonymous panel leads to login entrance',entrance.status,302);check('Panel login destination is correct',new URL(entrance.headers.get('location')).pathname,'/gestion.html');
check('Public login entrance loads',(await fetch(base+'/gestion.html')).status,200);
check('Forged identity headers stripped',(await fetch(base+'/api/admin/state',{headers:{'oai-authenticated-user-id':'spoof','oai-authenticated-user-email':'seedy@sites.test'}})).status,401);
check('CSRF rejected',(await request('/api/admin/profile',{name:'test'},{headers:{Origin:'https://untrusted.invalid'}})).status,403);
const old=await request('/api/admin/state');check('Authenticated admin reads state',old.status,200);
// Re-runnable local tests cancel prior QA reservations without changing hosted data.
for(const b of old.body.bookings.filter(b=>b.name.startsWith('QA E2E'))){const notes=JSON.parse(b.notes);await request('/api/admin/bookings',{...b,...notes,notes:notes.text,status:'cancelled',promo:''});}
check('Create limited promotion',(await request('/api/admin/promotions',{code,kind:'promo',mode:'percent',value:10,start:'2034-01-01',end:'2034-12-31',limit:1,active:true})).status,200);
const booking={name:'QA E2E '+unique,phone:'600000001',date,slot:'morning',type:'Cumpleaños infantil',guests:75,status:'confirmed',cleaning:true,hours:0,promo:code,notes:'Automated local test'};
const a=await request('/api/admin/bookings',booking);check('Create reservation with discount',a.status,200);check('Discount applies only to rental',a.body.total,9700); // Thursday 80 - 8 + 25
check('Overlapping slot rejected',(await request('/api/admin/bookings',{...booking,promo:''})).status,409);
check('Full day conflicts with morning',(await request('/api/admin/bookings',{...booking,promo:'',slot:'full'})).status,409);
check('Maximum capacity enforced',(await request('/api/admin/bookings',{...booking,date:next,guests:76,promo:''})).status,400);
check('Promotion usage limit enforced',(await request('/api/admin/bookings',{...booking,date:next})).status,400);
check('Date validity enforced',(await request('/api/admin/bookings',{...booking,date:'2034-02-30',promo:''})).status,400);
check('Cancel reservation',(await request('/api/admin/bookings',{...booking,id:a.body.id,status:'cancelled'})).status,200);
const b=await request('/api/admin/bookings',{...booking,date:next});check('Cancellation releases promotion use',b.status,200);
const avail=await request('/api/availability?date='+date);check('Cancellation releases slot',avail.body.occupied,[]);
const collision=await Promise.all(['morning','morning'].map(slot=>request('/api/admin/bookings',{...booking,date,slot,promo:''})));check('Concurrent reservations cannot double-book',collision.map(x=>x.status).sort(),[200,409]);
const repeat=code+'-R';await request('/api/admin/promotions',{code:repeat,kind:'repeat',mode:'fixed',value:500,start:'2034-01-01',end:'2034-12-31',limit:5,active:true});
check('Repeat birthday requires verification',(await request('/api/admin/bookings',{...booking,date:'2034-06-10',promo:repeat})).status,400);
const ref=code+'-F';await request('/api/admin/promotions',{code:ref,kind:'referral',mode:'fixed',value:500,start:'2034-01-01',end:'2034-12-31',limit:5,active:true,referrer:'600000001'});
check('Self referral rejected',(await request('/api/admin/bookings',{...booking,date:'2034-06-10',promo:ref})).status,400);
check('Self referral cannot bypass country prefix',(await request('/api/admin/bookings',{...booking,phone:'+34 600 000 001',date:'2034-06-10',promo:ref})).status,400);
const extended=await request('/api/admin/bookings',{...booking,date:'2034-06-11',promo:'',hours:3});check('Extended morning reservation saved',extended.status,200);
check('Morning extension blocks overlapping afternoon',(await request('/api/admin/bookings',{...booking,date:'2034-06-11',slot:'afternoon',promo:''})).status,409);
const draft=await request('/api/admin/records/events',{title:'QA E2E event',date,text:'Private draft',permission:false,status:'draft'});check('Save private draft',draft.status,200);
const publicEvents=await (await fetch(base+'/api/events')).json();check('Draft not exposed',publicEvents.some(x=>x.id===draft.body.id),false);
check('Publishing requires permission',(await request('/api/admin/records/events',{id:draft.body.id,title:'QA E2E event',date,text:'private',permission:false,status:'published'})).status,400);
const invalid=new FormData();invalid.append('file',new File(['<svg onload="alert(1)"></svg>'],'unsafe.svg',{type:'image/svg+xml'}));
const upload=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Cookie:cookie,Origin:base,'X-Diverdino-Request':'1'},body:invalid});check('Executable uploads rejected',upload.status,400);
const png=new FormData();png.append('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZ1kAAAAASUVORK5CYII=','base64')],'qa-pixel.png',{type:'image/png'}));
const mediaResponse=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Cookie:cookie,Origin:base,'X-Diverdino-Request':'1'},body:png});const media=await mediaResponse.json();check('Valid image upload',mediaResponse.status,200);
check('Unpublished media stays private',(await fetch(base+'/media/'+media.id)).status,401);
check('Owner can read uploaded media',(await fetch(base+'/media/'+media.id,{headers:{Cookie:cookie}})).status,200);
const state=await request('/api/admin/state');check('State survives separate request',state.body.bookings.some(x=>x.id===b.body.id),true);
check('Old proposal redirects to private area',(await fetch(base+'/propuesta.html',{redirect:'manual'})).status,302);
console.log(`\n${passed} backend E2E assertions passed against local D1 and R2.`);
