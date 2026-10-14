// The public entrance uses normal top-level navigation; never fetch or embed sign-in.
if(['127.0.0.1','localhost'].includes(location.hostname)){
 document.querySelector('[data-login]').href='/signin-with-chatgpt?return_to=%2Fadmin';
 document.querySelector('[data-panel]').href='/admin';
 document.querySelector('[data-switch]').href='/signout-with-chatgpt?return_to=%2Fadmin';
}
