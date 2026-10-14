import {vertexSource,shaderSources} from './vendor/hyperframes-shaders.js';
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const running=new Set();
function animate(el,frames,options){
 if(preference.matches||!el?.animate)return;
 const animation=el.animate(frames,{fill:'none',easing:'cubic-bezier(.22,1,.36,1)',...options});running.add(animation);
 animation.finished.catch(()=>{}).finally(()=>running.delete(animation));return animation;
}
preference.addEventListener('change',()=>{if(preference.matches)for(const animation of running)animation.cancel();});
document.addEventListener('click',event=>{
 const link=event.target.closest?.('a[href]');
 if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.download||link.matches('.skip-link,.proposal-skip'))return;
 const url=new URL(link.href,location.href);
 if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
 const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
 event.preventDefault();history.pushState(null,'',url.hash);target.scrollIntoView({behavior:preference.matches?'auto':'smooth',block:'start'});
});
export function animatePanelSwap(panel){
 if(!panel)return;
 [...panel.querySelectorAll('.view-heading,.panel-intro,.panel-stat,.panel-box,.marketing-card,.clients-empty')].slice(0,9).forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,delay:i*35}));
}
document.querySelectorAll('.hero-copy .title-line>span').forEach((el,i)=>animate(el,[{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:800,delay:i*85}));
document.querySelectorAll('.hero-copy>p,.hero-actions').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:240+i*80}));
animate(document.querySelector('.hero-art'),[{opacity:0,clipPath:'inset(8% 3% 8% 3% round 90px)',transform:'translateY(24px)'},{opacity:1,clipPath:'inset(0% 0% 0% 0% round 0px)',transform:'translateY(0)'}],{duration:1000,delay:100});
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;animate(entry.target,[{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:Number(entry.target.dataset.motionDelay||0)});observer.unobserve(entry.target);}},{threshold:.12});
 document.querySelectorAll('.experiences article').forEach((el,i)=>el.dataset.motionDelay=String(i*80));
 document.querySelectorAll('.section-intro,.experiences article,.facility-grid article,.included-layout,.rate-card,.location-invitation,.open-plans,.booking-story,.booking-widget,.proposal-section-heading,.proposal-poster-gallery figure,.proposal-document-list>a').forEach(el=>observer.observe(el));
}
document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)[...detail.children].filter(el=>el.tagName!=='SUMMARY').forEach(el=>animate(el,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300}));}));
const result=document.querySelector('#booking-result');
if(result)new MutationObserver(()=>{if(result.childElementCount)animate(result,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420});}).observe(result,{childList:true});

const sceneImage=document.querySelector('#hero-scene'),canvas=document.querySelector('#hero-transition');
const buttons=[...document.querySelectorAll('.scene-picker button[data-scene]')];
const scenes=[
 {src:'assets/dino-invitacion.webp',alt:'Ilustración de Dino con una invitación de cumpleaños',label:'Tu próxima aventura empieza aquí.',shader:'iris'},
 {src:'assets/familia-fiesta.webp',alt:'Ilustración de una celebración familiar con Dino y globos',label:'El mejor plan: estar juntos.',shader:'ripple'},
 {src:'assets/karaoke-celebracion.webp',alt:'Ilustración de una invitación y un micrófono de karaoke',label:'Tus 16. Tus 18. Tu manera de celebrar.',shader:'iris'}
];
if(sceneImage&&canvas&&buttons.length){
 let selected=0,busy=false,renderer=null,contextFailed=false;
 const images=new Map([[0,sceneImage]]);
 async function loadImage(index){if(images.has(index)){const image=images.get(index);if(!image.complete)await image.decode();return image;}const image=new Image();image.src=scenes[index].src;await image.decode();images.set(index,image);return image;}
 function makeRenderer(){
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false});if(!gl)return null;
  const programs=new Map(),shaders=[];
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Shader unavailable');}shaders.push(shader);return shader;}
  const vertex=compile(gl.VERTEX_SHADER,vertexSource);
  for(const [key,source]of Object.entries(shaderSources)){const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,compile(gl.FRAGMENT_SHADER,source));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Transition unavailable');programs.set(key,program);}
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const textures=[gl.createTexture(),gl.createTexture()];
  function upload(image,unit){
   const surface=document.createElement('canvas');surface.width=canvas.width;surface.height=canvas.height;const ctx=surface.getContext('2d');
   const scale=Math.max(surface.width/image.naturalWidth,surface.height/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;ctx.drawImage(image,(surface.width-w)/2,(surface.height-h)/2,w,h);
   gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[unit]);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,surface);
  }
  return {
   prepare(from,to,key){
    const rect=sceneImage.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,1.5,960/Math.max(rect.width,rect.height));canvas.width=Math.max(1,Math.round(rect.width*scale));canvas.height=Math.max(1,Math.round(rect.height*scale));gl.viewport(0,0,canvas.width,canvas.height);
    const program=programs.get(key);gl.useProgram(program);const position=gl.getAttribLocation(program,'a_pos');gl.enableVertexAttribArray(position);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);upload(from,0);upload(to,1);
    gl.uniform1i(gl.getUniformLocation(program,'u_from'),0);gl.uniform1i(gl.getUniformLocation(program,'u_to'),1);gl.uniform2f(gl.getUniformLocation(program,'u_resolution'),canvas.width,canvas.height);gl.uniform3f(gl.getUniformLocation(program,'u_accent_bright'),.31,.76,.86);this.progress=gl.getUniformLocation(program,'u_progress');
   },
   draw(progress){gl.uniform1f(this.progress,progress);gl.drawArrays(gl.TRIANGLES,0,6);},
   dispose(){textures.forEach(t=>gl.deleteTexture(t));programs.forEach(p=>gl.deleteProgram(p));shaders.forEach(s=>gl.deleteShader(s));gl.deleteBuffer(buffer);}
  };
 }
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();contextFailed=true;canvas.hidden=true;renderer=null;});
 async function selectScene(index){
  if(index===selected||busy)return;busy=true;buttons.forEach(button=>button.disabled=true);
  try{
   const [from,to]=await Promise.all([loadImage(selected),loadImage(index)]);
   if(!preference.matches&&!contextFailed){try{renderer ||= makeRenderer();if(renderer){
    renderer.prepare(from,to,scenes[index].shader);renderer.draw(0);canvas.hidden=false;canvas.dataset.transition=scenes[index].shader;
    await new Promise(resolve=>{let start;function frame(time){start??=time;const p=Math.min(1,(time-start)/780);if(!contextFailed)renderer?.draw(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2);if(p<1&&!preference.matches&&!contextFailed)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
   }}catch{contextFailed=true;canvas.hidden=true;renderer?.dispose();renderer=null;}}
   sceneImage.src=scenes[index].src;sceneImage.alt=scenes[index].alt;await sceneImage.decode();selected=index;
   document.querySelector('#scene-caption').textContent=scenes[index].label;buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));document.querySelector('.hero-stage').dataset.scene=String(index);
  }catch{document.querySelector('#scene-caption').textContent='Puedes ver más ideas en Celebraciones.';}
  finally{canvas.hidden=true;busy=false;buttons.forEach(button=>button.disabled=false);}
 }
 buttons.forEach((button,index)=>button.addEventListener('click',()=>selectScene(index)));
 window.addEventListener('pagehide',()=>{renderer?.dispose();renderer=null;});
}
