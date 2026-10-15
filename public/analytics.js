// Basic consent: Google is not contacted until the visitor explicitly opts in.
let measurementId='',enabled=false,loaded=false,configured=false;
export async function analyticsConfig(){
 try{const r=await fetch(new URL('integrations.json',import.meta.url),{cache:'no-store'});if(!r.ok)return false;const config=await r.json();measurementId=/^G-[A-Z0-9]{6,20}$/.test(config.ga4MeasurementId)?config.ga4MeasurementId:'';}catch{}
 return !!measurementId;
}
export function analyticsConsent(accept){
 enabled=accept;if(!measurementId)return;
 window['ga-disable-'+measurementId]=!accept;
 if(!accept){
  if(window.gtag)window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  const domains=['',location.hostname,'.'+location.hostname];
  for(const cookie of document.cookie.split(';')){const name=cookie.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of domains)document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax';}
  return;
 }
 window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 if(!loaded){const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;document.head.append(script);loaded=true;window.gtag('js',new Date());}
 if(!configured){window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_referrer:safeReferrer()});configured=true;}
}
function safeReferrer(){try{return new URL(document.referrer).origin;}catch{return '';}}
export function analyticsEvent(event){if(!enabled||!measurementId||!window.gtag)return;const names={view:'page_view',quote:'calculate_price',whatsapp:'contact_whatsapp',card:'open_celebration'};if(!names[event])return;window.gtag('event',names[event],{send_to:measurementId,page_location:location.origin+location.pathname,page_referrer:safeReferrer(),page_title:document.title});}
