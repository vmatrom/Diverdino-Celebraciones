import {readFile} from 'node:fs/promises';
export async function publicSettings(){const s=JSON.parse(await readFile('public/integrations.json','utf8'));
 if(!['https://vmatrom.github.io/Diverdino-Celebraciones/','https://www.diverdinoelche.com/','https://diverdinoelche.com/'].includes(s.publicUrl))throw new Error('Public URL must be the authorized Pages or Diverdino domain.');
 if(typeof s.ga4MeasurementId!=='string'||s.ga4MeasurementId&&!/^G-[A-Z0-9]{6,20}$/.test(s.ga4MeasurementId))throw new Error('Invalid GA4 measurement ID.');
 if(typeof s.googleSiteVerification!=='string'||!/^[a-zA-Z0-9_-]{0,200}$/.test(s.googleSiteVerification))throw new Error('Use only the content value from Google verification, not HTML.');
 if(Object.keys(s).some(k=>!['publicUrl','ga4MeasurementId','googleSiteVerification'].includes(k)))throw new Error('Only public identifiers belong in integrations.json. Never add credentials.');return s;
}
