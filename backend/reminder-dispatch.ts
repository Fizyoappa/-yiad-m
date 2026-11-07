// Internal cron endpoint. Deploy verify_jwt=false: this handler authenticates with
// its separate server-only cron secret. No secret or service-role key is public.
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
import webpush from 'npm:web-push@3.6.7';

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const allowedEndpoint = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 8192) return false;
  try {
    const u = new URL(value);
    const h = u.hostname.toLowerCase();
    return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') &&
      (h === 'fcm.googleapis.com' || h === 'updates.push.services.mozilla.com' ||
       h === 'web.push.apple.com' || (h.endsWith('.notify.windows.com') && h.length > '.notify.windows.com'.length));
  } catch { return false; }
};
const sameSecret = async (left: string, right: string) => {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(left)), crypto.subtle.digest('SHA-256', enc.encode(right))]);
  const aa = new Uint8Array(a), bb = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < aa.length; i++) difference |= aa[i] ^ bb[i];
  return difference === 0;
};
const localTime = (now: Date, zone: string) => {
  try {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
    return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), minute: Number(parts.minute) };
  } catch { return null; }
};

Deno.serve(async (req: Request) => {
  try {
    const bearer = req.headers.get('authorization')?.match(/^Bearer (.{16,512})$/)?.[1] || '';
    if (!bearer) return json({ error: 'Unauthorized' }, 401);
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) return json({ error: 'Server configuration unavailable' }, 503);
    const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: config, error: configError } = await db.from('server_config').select('secret,public_key,private_key').eq('id', 'push').maybeSingle();
    if (configError || !config?.secret) return json({ error: 'Notification setup unavailable' }, 503);
    if (!await sameSecret(bearer, config.secret)) return json({ error: 'Unauthorized' }, 401);
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    if (!config.public_key || !config.private_key) return json({ error: 'Notification setup unavailable' }, 503);

    // One immutable invocation time. Missed doses are never replayed as new reminders.
    const now = new Date();
    let schedules: Array<{user_id: string; med_id: string; hour: number; minute: number; time_zone: string}> = [];
    for (let offset = 0; offset < 5000; offset += 500) {
      const { data, error } = await db.from('reminder_schedules').select('user_id,med_id,hour,minute,time_zone')
        .eq('enabled', true).order('user_id').order('med_id').range(offset, offset + 499);
      if (error) return json({ error: 'Schedule lookup failed' }, 503);
      schedules.push(...(data || []));
      if (!data || data.length < 500) break;
    }
    let due = 0, accepted = 0, expired = 0, failed = 0, duplicate = 0;
    const payload = JSON.stringify({ title: 'İyiAdım hatırlatması',
      body: 'Planına kaydettiğin ilaç saati geldi. Reçetendeki düzeni kontrol et.',
      url: './#meds', tag: 'iyiadim-reminder' });
    for (const schedule of schedules) {
      const current = localTime(now, schedule.time_zone);
      if (!current || current.hour !== schedule.hour || current.minute !== schedule.minute) continue;
      due++;
      const { data: subscriptions, error: lookupError } = await db.from('push_subscriptions')
        .select('endpoint,p256dh,auth').eq('user_id', schedule.user_id);
      if (lookupError) { failed++; continue; }
      if (!subscriptions?.length) continue;
      // Unique primary key reserves delivery across simultaneous cron invocations.
      const reservation = { user_id: schedule.user_id, med_id: schedule.med_id, local_day: current.day };
      const { error: reserveError } = await db.from('reminder_deliveries').insert(reservation);
      if (reserveError) { if (reserveError.code === '23505') duplicate++; else failed++; continue; }
      let anyAccepted = false;
      for (const subscription of subscriptions) {
        if (!allowedEndpoint(subscription.endpoint)) { failed++; continue; }
        try {
          const request = webpush.generateRequestDetails({ endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload, {
            TTL: 300, urgency: 'normal', vapidDetails: {
              subject: 'https://fizyoappa.github.io/-yiad-m/',
              publicKey: config.public_key, privateKey: config.private_key,
            },
          });
          // Use fetch rather than Node's https sender in the Edge Runtime.
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 10000);
          let response: Response;
          try { response = await fetch(request.endpoint, { method: request.method,
            headers: request.headers, body: request.body as BodyInit, signal: controller.signal, redirect: 'error' }); }
          finally { clearTimeout(timer); }
          if (response.ok) { accepted++; anyAccepted = true; }
          else if (response.status === 404 || response.status === 410) {
            expired++; await db.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint).eq('user_id', schedule.user_id);
          } else failed++;
          await response.body?.cancel();
        } catch { failed++; }
      }
      // Failure does not claim successful delivery. A later same-minute invocation can retry.
      if (!anyAccepted) await db.from('reminder_deliveries').delete()
        .eq('user_id', schedule.user_id).eq('med_id', schedule.med_id).eq('local_day', current.day);
    }
    // Accepted means the push provider accepted the encrypted message; actual display
    // depends on network, browser permission, installation and OS battery settings.
    return json({ ok: true, due, provider_accepted: accepted, expired, failed, duplicate,
      note: 'Provider acceptance does not guarantee device display.' });
  } catch { return json({ error: 'Dispatch failed' }, 500); }
});
