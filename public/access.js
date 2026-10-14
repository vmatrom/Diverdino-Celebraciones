// The public entrance uses normal top-level navigation; never fetch or embed sign-in.
if(['127.0.0.1','localhost'].includes(location.hostname)){
 document.querySelector('[data-login]').href='/signin-with-chatgpt?return_to=%2Fadmin';
 document.querySelector('[data-panel]').href='/admin';
 document.querySelector('[data-switch]').href='/signout-with-chatgpt?return_to=%2Fadmin';
}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.querySelector('.access-art')?.animate([{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
 document.querySelectorAll('.access-copy>*').forEach((element,i)=>element.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,delay:i*35,easing:'cubic-bezier(.16,1,.3,1)'}));
}
