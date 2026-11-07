/* Optional Web Push medication-time reminders. No medication names/doses are uploaded. */
(() => {
  'use strict';
  let currentSession = null, enabled = false, busy = false, syncing = false, rerun = false;
  let syncTimer = null, subscription = null, statusText = '', lastScheduleSignature = '';
  const html = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const session = () => window.cloudSession?.() || currentSession;
  const client = () => window.cloudClient?.();
  const storageKey = userId => `iyiadim-push-enabled:${userId}`;
  const pendingKey = userId => `iyiadim-push-cleanup:${userId}`;
  const markWorker = (value, reg) => { const worker = navigator.serviceWorker?.controller || reg?.active; worker?.postMessage?.({ type: 'REMINDER_STATE', enabled: value }); };
  const bounded = (promise, fallback, ms = 1800) => Promise.race([promise.catch(() => fallback), new Promise(resolve => setTimeout(() => resolve(fallback), ms))]);
  const capable = () => window.isSecureContext && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const getEnabled = id => { try { return localStorage.getItem(storageKey(id)) === '1'; } catch { return false; } };
  const setEnabled = (id, value) => { try { value ? localStorage.setItem(storageKey(id), '1') : localStorage.removeItem(storageKey(id)); } catch {} };
  const feedback = text => { statusText = text; drawStatus(); if (window.toast) window.toast(text); };
  const asKey = base64 => {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  };
  async function readyRegistration() {
    let reg = await navigator.serviceWorker.getRegistration(new URL('./', location.href));
    if (!reg) reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    if (!reg.active) {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('SERVICE_WORKER_WAIT')), 15000));
      reg = await Promise.race([navigator.serviceWorker.ready, timeout]);
    }
    return reg;
  }
  function drawStatus() {
    const box = document.querySelector('#notificationStatus');
    if (box) box.textContent = statusText || (enabled ? 'Bu cihazda bildirim aboneliğin kayıtlı. İlaç saatleri sunucuyla eşitlenir.' : 'Bildirimler bu cihazda kapalı.');
    const enableButton = document.querySelector('#enablePushReminders');
    if (enableButton) { enableButton.disabled = busy || !session()?.user || !capable(); enableButton.textContent = busy ? 'İşlem sürüyor…' : enabled ? 'Aboneliği ve saatleri yenile' : 'Bu cihazda bildirimleri aç'; }
    const disableButton = document.querySelector('#disablePushReminders');
    if (disableButton) disableButton.disabled = busy || !enabled;
  }
  window.notificationTools = () => {
    const loggedIn = Boolean(session()?.user), supported = capable();
    return `<section class="card notification-tools" aria-labelledby="notificationHeading"><h2 id="notificationHeading">İlaç saati bildirimleri</h2><p>İzin verirsen, bu cihazda uygulama açık değilken de ilaç saati hatırlatması alınabilir. Bildirimde ilaç adı ve doz gösterilmez.</p>${!loggedIn?'<p class="notice">Önce Hesabım bölümünden giriş yap. Üyelik, farklı cihazların bildirim saatlerini aynı hesaba bağlar.</p>':''}${!supported?'<p class="notice">Bu tarayıcıda Web Push kullanılamıyor. iPhone/iPad’de desteklenen sürümde Safari’den “Ana Ekrana Ekle” ile yüklenen uygulamayı açmak gerekebilir. Sayfa açıkken mevcut hatırlatıcılar kullanılabilir.</p>':''}<p id="notificationStatus" role="status" aria-live="polite">${html(statusText || (enabled?'Bu cihazdaki aboneliğin kayıtlı.':'Bu cihazdaki bildirimler kapalı.'))}</p><div class="form-actions"><button id="enablePushReminders" ${busy||!loggedIn||!supported?'disabled':''}>${enabled?'Aboneliği ve saatleri yenile':'Bu cihazda bildirimleri aç'}</button><button class="secondary" id="disablePushReminders" ${busy||!enabled?'disabled':''}>Bu cihazda kapat</button></div><p class="notification-limits">Hatırlatmalar için internet, tarayıcı izni ve cihaz desteği gerekir. Pil tasarrufu veya sistem ayarları teslimi geciktirebilir; bildirim ilaç alındığının kanıtı değildir. Unutulan dozda çift doz alma; reçeteni ve sağlık ekibinin önerisini izle.</p></section>`;
  };
  async function enable() {
    const s = session(), db = client(), key = window.CLOUD_CONFIG?.vapidPublicKey;
    if (!s?.user || !db) return feedback('Önce Hesabım bölümünden giriş yap.');
    if (!capable()) return feedback('Bu tarayıcı Web Push bildirimlerini desteklemiyor.');
    if (!key) return feedback('Bildirim hizmeti henüz yapılandırılmamış.');
    if (busy) return;
    busy = true; drawStatus();
    try {
      // Permission is requested only from this explicit button press.
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { feedback(permission === 'denied' ? 'Bildirim izni kapalı. Açmak istersen tarayıcı ayarlarından değiştirebilirsin.' : 'İzin verilmedi; bildirimler kapalı kaldı.'); return; }
      const reg = await readyRegistration();
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: asKey(key) });
      const value = sub.toJSON();
      if (!value.keys?.p256dh || !value.keys?.auth) throw new Error('INVALID_SUBSCRIPTION');
      if (session()?.user?.id !== s.user.id) throw new Error('ACCOUNT_CHANGED');
      const { error } = await db.from('push_subscriptions').upsert({ user_id: s.user.id, endpoint: sub.endpoint,
        p256dh: value.keys.p256dh, auth: value.keys.auth }, { onConflict: 'endpoint' });
      if (error) throw error;
      markWorker(true, reg); subscription = sub; enabled = true; setEnabled(s.user.id, true); lastScheduleSignature = '';
      const synced = await syncNow();
      feedback(synced ? 'Bu cihazdaki bildirim aboneliğin ve ilaç saatlerin kaydedildi.' : 'Aboneliğin kaydedildi fakat ilaç saatleri henüz eşitlenemedi. Bağlantını kontrol edip yenileyebilirsin.');
    } catch (e) {
      const name = e?.name || '';
      feedback(name === 'NotAllowedError' ? 'Tarayıcı aboneliğe izin vermedi. Ana ekrana yükleme ve bildirim ayarlarını kontrol et.' : 'Bildirim aboneliği tamamlanamadı. İnternetini ve hesabını kontrol edip yeniden deneyebilirsin.');
    } finally { busy = false; drawStatus(); }
  }
  async function syncNow() {
    const s = session(), db = client();
    if (!s?.user || !db || !enabled || !navigator.onLine) return false;
    if (syncing) { rerun = true; return false; }
    syncing = true;
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
      const meds = typeof state !== 'undefined' && Array.isArray(state.meds) ? state.meds : [];
      const rows = meds.filter(m => typeof m.id === 'string' && /^\d{2}:\d{2}$/.test(m.time || ''))
        .map(m => ({ user_id: s.user.id, med_id: m.id, hour: Number(m.time.slice(0, 2)), minute: Number(m.time.slice(3, 5)), time_zone: timeZone, enabled: true }))
        .filter(m => m.hour >= 0 && m.hour < 24 && m.minute >= 0 && m.minute < 60);
      const signature = JSON.stringify(rows);
      if (signature === lastScheduleSignature) return true;
      if (session()?.user?.id !== s.user.id) return false;
      const { data: existing, error: listError } = await db.from('reminder_schedules').select('med_id').eq('user_id', s.user.id);
      if (listError) throw listError;
      if (rows.length) { const { error } = await db.from('reminder_schedules').upsert(rows, { onConflict: 'user_id,med_id' }); if (error) throw error; }
      const ids = new Set(rows.map(r => r.med_id));
      const removed = (existing || []).filter(r => !ids.has(r.med_id)).map(r => r.med_id);
      if (removed.length) { const { error } = await db.from('reminder_schedules').delete().eq('user_id', s.user.id).in('med_id', removed); if (error) throw error; }
      lastScheduleSignature = signature;
      statusText = rows.length ? `Bu cihazda abonelik kayıtlı; ${rows.length} ilaç saati ${timeZone} saat dilimiyle eşitlendi.` : 'Aboneliğin kayıtlı. İlaçlarım ekranından bir saat eklediğinde hatırlatma planlanır.';
      drawStatus(); return true;
    } catch { statusText = 'Bildirim saatleri eşitlenemedi. İnternete bağlanınca veya “Aboneliği ve saatleri yenile” ile yeniden deneyebilirsin.'; drawStatus(); return false; }
    finally { syncing = false; if (rerun) { rerun = false; window.syncReminderSchedules(); } }
  }
  window.syncReminderSchedules = () => { clearTimeout(syncTimer); syncTimer = setTimeout(() => { void syncNow(); }, 650); };
  window.disableReminderSubscription = async () => {
    const s = session(), db = client();
    clearTimeout(syncTimer);
    // Suppress queued notifications immediately, independently of network cleanup.
    if ('serviceWorker' in navigator) markWorker(false);
    enabled = false; lastScheduleSignature = '';
    if (s?.user) setEnabled(s.user.id, false);
    const reg = capable() ? await bounded(navigator.serviceWorker.getRegistration(new URL('./', location.href)), null) : null;
    markWorker(false, reg);
    const sub = subscription || await bounded(Promise.resolve(reg?.pushManager.getSubscription()), null);
    subscription = null;
    if (!s?.user || !db || !navigator.onLine) {
      if (sub) {
        if (s?.user) { try { localStorage.setItem(pendingKey(s.user.id), sub.endpoint); } catch {} }
        await bounded(sub.unsubscribe(), false);
      }
      statusText = 'Bu cihazdaki bildirim tercihi kapatıldı. Sunucu kaydının temizlenmesi için yeniden internet bağlantısı gerekebilir.';
      drawStatus();
      return true;
    }
    if (sub) {
      try { localStorage.setItem(pendingKey(s.user.id), sub.endpoint); } catch {}
      const { error } = await db.from('push_subscriptions').delete().eq('user_id', s.user.id).eq('endpoint', sub.endpoint);
      if (error) throw new Error('NOTIFICATION_SIGNOUT_CLEANUP_FAILED');
      await bounded(sub.unsubscribe(), false);
      try { localStorage.removeItem(pendingKey(s.user.id)); } catch {}
    }
    const { data: remaining, error: lookupError } = await db.from('push_subscriptions').select('endpoint').eq('user_id', s.user.id).limit(1);
    if (lookupError) throw new Error('NOTIFICATION_SIGNOUT_CLEANUP_FAILED');
    if (!remaining?.length) {
      const { error } = await db.from('reminder_schedules').update({ enabled: false }).eq('user_id', s.user.id);
      if (error) throw new Error('NOTIFICATION_SIGNOUT_CLEANUP_FAILED');
    }
    statusText = 'Bu cihazda bildirimler kapatıldı.'; drawStatus();
    return true;
  };
  window.disableReminderBeforeSignOut = window.disableReminderSubscription;
  window.onReminderSessionChanged = async s => {
    currentSession = s; enabled = Boolean(s?.user && getEnabled(s.user.id)); subscription = null; lastScheduleSignature = '';
    statusText = '';
    if (!enabled && 'serviceWorker' in navigator) {
      markWorker(false);
      void navigator.serviceWorker.getRegistration(new URL('./', location.href)).then(reg => markWorker(false, reg)).catch(() => {});
    }
    if (s?.user && navigator.onLine && client()) {
      let pending; try { pending = localStorage.getItem(pendingKey(s.user.id)); } catch {}
      if (pending) {
        try { const { error } = await client().from('push_subscriptions').delete().eq('user_id', s.user.id).eq('endpoint', pending); if (!error) localStorage.removeItem(pendingKey(s.user.id)); } catch {}
      }
    }
    if (enabled && capable()) {
      try {
        const reg = await navigator.serviceWorker.getRegistration(new URL('./', location.href));
        subscription = await reg?.pushManager.getSubscription() || null;
        if (!subscription || Notification.permission !== 'granted') { enabled = false; setEnabled(s.user.id, false); markWorker(false, reg); }
      } catch { enabled = false; }
    }
    drawStatus();
    if (enabled) window.syncReminderSchedules();
  };
  window.bindNotificationTools = () => {
    const enableButton = document.querySelector('#enablePushReminders');
    if (enableButton && !enableButton.dataset.bound) { enableButton.dataset.bound = '1'; enableButton.addEventListener('click', () => { void enable(); }); }
    const disableButton = document.querySelector('#disablePushReminders');
    if (disableButton && !disableButton.dataset.bound) {
      disableButton.dataset.bound = '1'; disableButton.addEventListener('click', async () => {
        if (busy) return; busy = true; drawStatus();
        try { await window.disableReminderSubscription(); feedback(statusText || 'Bu cihazda bildirimler kapatıldı.'); }
        catch { feedback('Bildirim kaydı sunucudan kaldırılamadı. Bağlantını kontrol edip yeniden dene.'); }
        finally { busy = false; drawStatus(); }
      });
    }
    drawStatus();
  };
  window.addEventListener('online', () => { if (enabled) window.syncReminderSchedules(); });
})();
