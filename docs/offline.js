/* Device features are opt-in. Step estimates are not clinical measurements. */
(function () {
  'use strict';
  const ui = { ready: false, error: '', registration: null, installPrompt: null, installed: false, counter: 0, timer: null, elapsed: 0, sensor: false, estimate: 0, sensorText: '', gravity: 9.81, lastPeak: 0, events: 0, sensorTimeout: null };
  let started = false;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notify = text => { if (typeof toast === 'function') toast(text); else updateStatus(text); };
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const currentSeconds = () => Math.floor((ui.elapsed + (ui.timer ? Date.now() - ui.timer.since : 0)) / 1000);
  function statusText() {
    if (!navigator.onLine) return 'İnternet bağlantısı yok. Bu cihazdaki kayıtlarla çalışabilirsin; ortak grup ve hesap işlemleri için bağlantı gerekir.';
    if (ui.error) return ui.error;
    if (ui.ready) return 'Çevrimdışı kullanım hazır. Bu cihazdaki egzersiz kartları ve yerel kayıtlar internet olmadan açılabilir.';
    return 'Çevrimdışı kullanım hazırlanıyor. İlk açılışta internet bağlantısı gerekir.';
  }
  function updateStatus(override) {
    document.querySelectorAll('[data-device-status]').forEach(el => { el.textContent = override || statusText(); });
    document.querySelectorAll('[data-install-app]').forEach(el => { el.disabled = installed(); el.textContent = installed() ? 'Ana ekrana eklendi ✓' : 'Ana ekrana ekle'; });
    document.querySelectorAll('[data-apply-update]').forEach(el => { el.hidden = !ui.registration?.waiting; });
    document.querySelectorAll('[data-motion-status]').forEach(el => { el.textContent = ui.sensorText || 'Ölçüm kapalı. Telefon hareketini sayar; gerçek adım sayısıyla aynı olmayabilir.'; });
    document.querySelectorAll('[data-step-estimate]').forEach(el => { el.textContent = String(ui.estimate); });
    document.querySelectorAll('[data-motion-toggle]').forEach(el => { el.textContent = ui.sensor ? 'Telefon ölçümünü durdur' : 'Deneysel telefon ölçümünü aç'; });
    document.querySelectorAll('[data-movement-time]').forEach(el => { el.textContent = formatTime(currentSeconds()); });
    document.querySelectorAll('[data-timer-start]').forEach(el => { el.disabled = !!ui.timer; });
    document.querySelectorAll('[data-timer-pause]').forEach(el => { el.disabled = !ui.timer; });
  }
  function stopMotion(message) {
    window.removeEventListener('devicemotion', onMotion);
    clearTimeout(ui.sensorTimeout);
    ui.sensor = false;
    ui.sensorText = message || 'Ölçüm durdu. Tahmini sayıyı düzeltip kaydedebilirsin.';
    updateStatus();
  }
  function onMotion(event) {
    const a = event.accelerationIncludingGravity;
    if (!a || ![a.x, a.y, a.z].every(Number.isFinite)) return;
    ui.events += 1;
    const magnitude = Math.hypot(a.x, a.y, a.z);
    ui.gravity = ui.gravity * 0.9 + magnitude * 0.1;
    const now = performance.now();
    if (magnitude - ui.gravity > 1.2 && now - ui.lastPeak > 550) {
      ui.lastPeak = now;
      ui.estimate += 1;
      updateStatus();
    }
  }
  async function startMotion() {
    if (!('DeviceMotionEvent' in window)) { notify('Bu tarayıcı telefon hareketi ölçümünü desteklemiyor. Elle kayıt kullanabilirsin.'); return; }
    try {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') { notify('Hareket izni verilmedi. Elle kayıt kullanabilirsin.'); return; }
      }
      ui.events = 0; ui.estimate = 0; ui.gravity = 9.81; ui.lastPeak = 0; ui.sensor = true;
      ui.sensorText = 'Deneysel ölçüm açık. Telefonu normal taşırken kullan; sallama. Tahmini mutlaka kontrol et.';
      window.addEventListener('devicemotion', onMotion);
      ui.sensorTimeout = setTimeout(() => { if (ui.sensor && !ui.events) stopMotion('Bu cihaz hareket verisi sağlamadı. Elle adım kaydı kullanabilirsin.'); }, 7000);
      updateStatus();
    } catch (_) { stopMotion('Telefon ölçümü açılamadı. Elle kayıt kullanabilirsin.'); }
  }
  function pauseTimer() {
    if (!ui.timer) return;
    ui.elapsed += Date.now() - ui.timer.since;
    clearInterval(ui.timer.interval); ui.timer = null; updateStatus();
  }
  function saveSteps() {
    const input = document.querySelector('[data-manual-steps]');
    const count = Number(input?.value ?? ui.counter);
    if (!Number.isInteger(count) || count < 1 || count > 100000) { notify('Kaydetmek için 1–100000 arasında bir adım sayısı gir.'); return; }
    if (typeof day !== 'function' || typeof save !== 'function') return;
    const daily = day(); daily.steps = Math.min(100000, (Number(daily.steps) || 0) + count);
    save(); ui.counter = 0; if (input) input.value = '0';
    notify(`${count} adım bugünkü kaydına eklendi. Toplam: ${daily.steps}.`);
    window.dispatchEvent(new CustomEvent('iyiadim:device-record', {detail:{type:'steps',count}}));
  }
  function saveTimer() {
    pauseTimer(); const seconds = currentSeconds();
    if (seconds < 1) { notify('Henüz kaydedilecek süre yok.'); return; }
    if (typeof day !== 'function' || typeof save !== 'function') return;
    const daily = day();
    daily.movementSessions = Array.isArray(daily.movementSessions) ? daily.movementSessions : [];
    daily.movementSessions.push({endedAt:new Date().toISOString(),seconds,source:'manual-timer'});
    daily.movementMinutes = Math.round(((Number(daily.movementMinutes) || 0) + seconds / 60) * 10) / 10;
    save(); ui.elapsed = 0; updateStatus(); notify('Hareket süren bugünkü kaydına eklendi.');
    window.dispatchEvent(new CustomEvent('iyiadim:device-record', {detail:{type:'movement',seconds}}));
  }
  window.deviceTools = function () {
    return `<section class="device-tools" aria-labelledby="deviceToolsTitle"><div class="section-head"><div><h2 id="deviceToolsTitle">Telefonum ve çevrimdışı kullanım</h2><p>İzinler yalnız sen istediğinde açılır.</p></div></div>
      <div class="device-tools-grid"><article class="card device-card"><h3>Uygulamayı yanında taşı</h3><p data-device-status role="status">${escape(statusText())}</p><div class="device-actions"><button type="button" data-install-app ${installed()?'disabled':''}>${installed()?'Ana ekrana eklendi ✓':'Ana ekrana ekle'}</button><button type="button" class="secondary" data-apply-update ${ui.registration?.waiting?'':'hidden'}>Yeni sürümü aç</button><button type="button" class="text-btn" data-offline-retry>Çevrimdışı hazırlığı kontrol et</button></div><details><summary>Ana ekrana ekleme adımları</summary><p>iPhone veya iPad’de Safari: Paylaş → Ana Ekrana Ekle. Android’de destekleyen tarayıcının menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle”yi seç. Menü adı cihaza göre değişebilir.</p></details><p class="device-note">İlk hazırlık internetle tamamlanır. Çevrimdışı mod cihazlar arası eşitleme veya ortak mesajlaşma sağlamaz.</p></article>
      <article class="card device-card"><h3>Adımlarımı kaydet</h3><p>Adım sayacından gördüğün sayıyı yaz veya düğmelerle say. Bu miktar bugünün toplamına eklenir.</p><label>Eklemek istediğin adım sayısı<input type="number" min="0" max="100000" step="1" inputmode="numeric" value="${ui.counter}" data-manual-steps></label><div class="device-actions"><button type="button" class="secondary" data-step-minus aria-label="Bir adım azalt">−1</button><button type="button" class="secondary" data-step-plus aria-label="Bir adım ekle">+1</button><button type="button" data-save-steps>Bugüne ekle</button></div><details><summary>Deneysel telefon sayacı</summary><p>Bu seçenek telefonun hareketinden kaba bir tahmin üretir. Telefonu sallamak da sayılabilir; çok yavaş yürüyüşü kaçırabilir. Tıbbi ölçüm değildir. Destekleyen cihazlarda, yalnız bu ekran açıkken çalışır. İzin vermek zorunda değilsin.</p><p class="device-estimate"><strong data-step-estimate>${ui.estimate}</strong> tahmini hareket</p><p data-motion-status role="status">${escape(ui.sensorText || 'Ölçüm kapalı. Telefon hareketini sayar; gerçek adım sayısıyla aynı olmayabilir.')}</p><div class="device-actions"><button type="button" class="secondary" data-motion-toggle>${ui.sensor?'Telefon ölçümünü durdur':'Deneysel telefon ölçümünü aç'}</button><button type="button" class="secondary" data-use-estimate>Tahmini düzeltme alanına al</button></div></details></article>
      <article class="card device-card"><h3>Hareket sürem</h3><p>Yalnız uzmanın uygun gördüğü hareketin süresini kaydet. Bu sayaç bir egzersiz veya süre önerisi değildir.</p><output class="device-timer" data-movement-time aria-label="Geçen süre">${formatTime(currentSeconds())}</output><div class="device-actions"><button type="button" data-timer-start ${ui.timer?'disabled':''}>Başlat</button><button type="button" class="secondary" data-timer-pause ${ui.timer?'':'disabled'}>Duraklat</button><button type="button" class="secondary" data-timer-save>Süreyi kaydet</button><button type="button" class="text-btn" data-timer-reset>Sıfırla</button></div><p class="device-note">Ekran kapanınca sayaç ve telefon ölçümü duraklatılır. Yeni ağrı, baş dönmesi veya nefes darlığında dur ve yardım al.</p></article></div></section>`;
  };
  window.bindDeviceTools = function () { updateStatus(); };
  window.initOffline = async function () {
    if (!started) {
      started = true;
      window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); ui.installPrompt = event; updateStatus(); });
      window.addEventListener('appinstalled', () => { ui.installPrompt = null; ui.installed = true; updateStatus(); });
      window.addEventListener('online', () => updateStatus()); window.addEventListener('offline', () => updateStatus());
      document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseTimer(); if (ui.sensor) stopMotion('Ekran arka plana geçtiği için telefon ölçümü durdu.'); } });
      window.addEventListener('pagehide', () => { pauseTimer(); if (ui.sensor) stopMotion(); });
      document.addEventListener('input', event => { if (event.target.matches('[data-manual-steps]')) ui.counter = Math.max(0, Math.min(100000, Number(event.target.value) || 0)); });
      document.addEventListener('click', async event => {
        const button = event.target.closest('button'); if (!button) return;
        if (button.hasAttribute('data-install-app')) {
          if (ui.installPrompt) { await ui.installPrompt.prompt(); await ui.installPrompt.userChoice; ui.installPrompt = null; updateStatus(); }
          else { document.querySelector('.device-card details')?.setAttribute('open', ''); notify('Ana ekrana ekleme adımları aşağıda. Menü adları cihaza göre değişebilir.'); }
        }
        if (button.hasAttribute('data-offline-retry')) { ui.error = ''; await window.initOffline(); }
        if (button.hasAttribute('data-apply-update') && ui.registration?.waiting) {
          if (confirm('Yeni sürüm sayfayı yenileyecek. Girişlerini kaydettiysen devam edebilirsin.')) { const onChange = () => location.reload(); navigator.serviceWorker.addEventListener('controllerchange', onChange, {once:true}); ui.registration.waiting.postMessage({type:'SKIP_WAITING'}); }
        }
        if (button.hasAttribute('data-step-plus') || button.hasAttribute('data-step-minus')) { ui.counter = Math.max(0, Math.min(100000, ui.counter + (button.hasAttribute('data-step-plus') ? 1 : -1))); document.querySelectorAll('[data-manual-steps]').forEach(el => { el.value = String(ui.counter); }); }
        if (button.hasAttribute('data-save-steps')) saveSteps();
        if (button.hasAttribute('data-motion-toggle')) { if (ui.sensor) stopMotion(); else await startMotion(); }
        if (button.hasAttribute('data-use-estimate')) { stopMotion(); ui.counter = ui.estimate; document.querySelectorAll('[data-manual-steps]').forEach(el => { el.value = String(ui.counter); }); notify('Tahmini sayıyı kontrol et. Gerekirse düzeltip “Bugüne ekle”ye dokun.'); }
        if (button.hasAttribute('data-timer-start') && !ui.timer) {
          if (typeof blocked === 'function' && blocked()) { notify('Önce profil ve günlük güvenlik koşullarını tamamla.'); return; }
          ui.timer = {since:Date.now(),interval:setInterval(updateStatus,1000)}; updateStatus();
        }
        if (button.hasAttribute('data-timer-pause')) pauseTimer();
        if (button.hasAttribute('data-timer-save')) saveTimer();
        if (button.hasAttribute('data-timer-reset')) { pauseTimer(); ui.elapsed=0; updateStatus(); }
      });
    }
    if (!('serviceWorker' in navigator) || !window.isSecureContext) { ui.error='Bu tarayıcı çevrimdışı kurulum desteği sunmuyor. İnternetle kullanmaya devam edebilirsin.'; updateStatus(); return; }
    try {
      ui.registration = await navigator.serviceWorker.register(new URL('sw.js', document.baseURI), {scope:new URL('./', document.baseURI).pathname});
      ui.registration.addEventListener('updatefound', () => { const worker=ui.registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed') { ui.ready=true; updateStatus(); } }); });
      let readyTimeout;
      try { await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>{readyTimeout=setTimeout(()=>reject(new Error('Offline preparation timed out')),15000);})]); } finally { clearTimeout(readyTimeout); }
      ui.ready=true; ui.error=''; updateStatus();
      ui.registration.update().catch(() => {});
    } catch (_) { ui.error='Çevrimdışı hazırlık tamamlanamadı. İnternete bağlıyken yeniden deneyebilirsin.'; updateStatus(); }
  };
})();
