const CONSENT_KEY='yedirenk-analytics-consent';
const SESSION_KEY='yedirenk-session-id';
const DEV_EVENTS_KEY='yedirenk-dev-analytics';
export const hasAnalyticsConsent=()=>localStorage.getItem(CONSENT_KEY)==='accepted';
export const setAnalyticsConsent=value=>localStorage.setItem(CONSENT_KEY,value?'accepted':'rejected');
export function sessionId(){let id=sessionStorage.getItem(SESSION_KEY);if(!id){id=crypto.randomUUID();sessionStorage.setItem(SESSION_KEY,id)}return id}
export async function track(event,data={}){
  if(!hasAnalyticsConsent())return;
  const payload={event,sessionId:sessionId(),path:location.pathname,referrer:document.referrer.slice(0,500),data};
  try{await fetch('/api/analytics',{method:'POST',keepalive:true,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})}catch{/* analytics must never break the site */}
}

export function getLocalAnalytics(){try{return JSON.parse(localStorage.getItem(DEV_EVENTS_KEY)||'[]')}catch{return[]}}
