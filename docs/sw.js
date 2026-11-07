/* Bump the version whenever the shipped app shell changes. No user/API data is cached. */
const CACHE = 'iyiadim-shell-2026-11-07-v3';
const SCOPE = new URL('./', self.location.href);
const CORE = ['index.html','style.css','exercise-library.js','clinical.js','app.js','enhancements.js','offline.js','pwa.css','manifest.webmanifest','icons/icon.svg','icons/icon192.png','icons/icon512.png','demonstrations.js','demonstrations.css','progress.js','progress.css','cloud.js','cloud.css','notifications.js','notifications.css','prescription.js','startup.js','upgrade.css','vendor/supabase-2.119.0.js','cloud-config.js'];
const OPTIONAL = ['literatur-taramasi.md','review-protocol.md','sunum-metni.pdf'];
const FILES = new Set([...CORE,...OPTIONAL]);
const canonical = name => new URL(name,SCOPE).href;
// This separate cache stores one opt-in boolean, never identity or health data.
const REMINDER_PREFS = 'iyiadim-device-preferences-v1';
const REMINDER_KEY = canonical('__device-preferences__/reminders');
let reminderOverride = null;
let reminderTasks = Promise.resolve();
function queueReminderTask(task) {
  const current = reminderTasks.then(task,task);
  reminderTasks = current.catch(() => {});
  return current;
}
async function remindersEnabled() {
  if (reminderOverride !== null) return reminderOverride === true;
  try {
    const saved = await (await caches.open(REMINDER_PREFS)).match(REMINDER_KEY);
    return !!saved && (await saved.json()).enabled === true;
  } catch (_) { return false; }
}
function acknowledgeReminderState(event, enabled, persisted) {
  const message = {type:'REMINDER_STATE_ACK',enabled,persisted};
  if (event.ports?.[0]) event.ports[0].postMessage(message);
  else event.source?.postMessage(message);
}
async function closeReminderNotifications() {
  try { for (const notification of await self.registration.getNotifications({tag:'iyiadim-reminder'})) notification.close(); } catch (_) {}
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache=await caches.open(CACHE);
    await Promise.all(CORE.map(async name => { const response=await fetch(canonical(name),{cache:'reload'}); if(!response.ok) throw new Error('App shell unavailable'); await cache.put(canonical(name),response); }));
    await Promise.all(OPTIONAL.map(async name => { try { const response=await fetch(canonical(name),{cache:'reload'}); if(response.ok) await cache.put(canonical(name),response); } catch (_) {} }));
    // Updates remain waiting until the visitor explicitly chooses the new version.
  })());
});
self.addEventListener('activate', event => event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('iyiadim-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (event.data?.type !== 'REMINDER_STATE' || typeof event.data.enabled !== 'boolean') return;
  if (event.source?.url && !event.source.url.startsWith(SCOPE.href)) return;
  const enabled = event.data.enabled;
  // Set synchronously: a queued push cannot overtake an offline opt-out.
  reminderOverride = enabled;
  event.waitUntil(queueReminderTask(async () => {
    let persisted = false;
    try {
      const cache = await caches.open(REMINDER_PREFS);
      await cache.put(REMINDER_KEY,new Response(JSON.stringify({enabled}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}));
      persisted = true;
    } catch (_) {
      // Fail closed if storage fails, even following an explicit opt-in.
      reminderOverride = false;
      try { await (await caches.open(REMINDER_PREFS)).delete(REMINDER_KEY); } catch (_) {}
    }
    if (!enabled || !persisted) await closeReminderNotifications();
    acknowledgeReminderState(event,enabled && persisted,persisted);
  }));
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  let name=url.pathname.slice(SCOPE.pathname.length);
  if(name===''&&event.request.mode==='navigate')name='index.html';
  if(!FILES.has(name))return; // Session tokens, APIs and all third-party traffic pass through. cloud-config.js contains publishable static values only.
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE),key=canonical(name);
    try { const response=await fetch(event.request); if(response.ok&&response.type==='basic'){await cache.put(key,response.clone());return response;} if(response.ok)return response; const cached=await cache.match(key);return cached||response; }
    catch(error){const cached=await cache.match(key);if(cached)return cached;throw error;}
  })());
});
self.addEventListener('push', event => {
  event.waitUntil(queueReminderTask(async () => {
    // Default is denied. Persisted explicit opt-in must survive the storage read.
    if (!(await remindersEnabled()) || reminderOverride === false) return;
    // Generic lock-screen message: no medication, diagnosis or other health details.
    await self.registration.showNotification('İyiAdım hatırlatıcısı',{body:'Planındaki bir hatırlatmanın zamanı geldi. Ayrıntılar için uygulamayı aç.',icon:canonical('icons/icon.svg'),badge:canonical('icons/icon.svg'),tag:'iyiadim-reminder',data:{url:SCOPE.href+'#meds'}});
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url=event.notification.data?.url || SCOPE.href;
  event.waitUntil((async()=>{for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true})){if(client.url.startsWith(SCOPE.href)){await client.focus();if(client.navigate)await client.navigate(url);return;}}await self.clients.openWindow(url);})());
});
