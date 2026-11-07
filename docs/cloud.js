/* Signed-in records and public support posts use independent, RLS-protected tables.
   Existing guest health information is never uploaded by signing in. */
(function () {
  'use strict';
  let client = null, session = null, activeId = null, initialized = false;
  let syncTimer = null, syncBusy = false, sessionSequence = 0, switching = false, syncFailures = 0;
  let meta = { enabled: false, revision: 0, pending: false };
  let status = 'Bu cihazda misafir olarak kullanıyorsun.', conflict = false, authBusy = false;
  let group = 'general', communityBusy = false, communityMessage = '';
  let recoverySecret = null, loginHint = '', accountViewEpoch = 0;
  let posts = [], blockedUsers = new Set(), pollTimer = null;
  const GUEST_KEY = 'iyiadim-v1';
  const AUTH_KEY = 'iyiadim-auth-v1';
  const USER_KEY = id => `iyiadim-v1:user:${id}`;
  const META_KEY = id => `iyiadim-cloud-meta:${id}`;
  const aliasKey = id => `iyiadim-community-alias:${id}`;
  const groups = {general:'Günlük hareket ve motivasyon',joints:'Eklem sağlığı ve günlük yaşam',balance:'Denge ve düşme kaygısı',caregivers:'Bakım verenler'};
  const read = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key));return value === null ? fallback : value; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value));return true; } catch { return false; } };
  const route = () => location.hash.replace(/^#/, '');
  const online = () => navigator.onLine !== false;
  const loggedIn = () => !!(session?.user?.id && activeId === session.user.id);
  const snapshot = () => JSON.parse(JSON.stringify({profile:state.profile,meds:state.meds,days:state.days,progressPlanHistory:state.progressPlanHistory||[]}));
  const fresh = () => structuredClone(initial);
  function normalize(payload) {
    const result=fresh();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return result;
    if (payload.profile && typeof payload.profile === 'object' && !Array.isArray(payload.profile)) result.profile={...result.profile,...payload.profile};
    if (!Array.isArray(result.profile.diagnoses)) result.profile.diagnoses=[];
    result.meds=Array.isArray(payload.meds)?payload.meds:[];
    result.days=payload.days&&typeof payload.days==='object'&&!Array.isArray(payload.days)?payload.days:{};
    result.progressPlanHistory=Array.isArray(payload.progressPlanHistory)?payload.progressPlanHistory:[];
    // A downloaded record cannot carry another device's daily safety clearance.
    result.screen=null;result.posts=[];
    return result;
  }
  function errorText(error) {
    const code=String(error?.code||'');const message=String(error?.message||error||'');
    if (/email_not_confirmed|Email not confirmed/i.test(code+' '+message)) return 'Önce e-postana gelen doğrulama bağlantısını aç. Gerekiyorsa istenmeyen posta klasörünü kontrol et.';
    if (/invalid_credentials|Invalid login credentials/i.test(code+' '+message)) return 'Kullanıcı adı veya şifre doğrulanamadı. Bilgilerini kontrol et ya da kurtarma kodunu kullan.';
    if (/username_invalid/i.test(code)) return 'Kullanıcı adın 3–30 karakter olmalı. Yalnız küçük Latin harfleri, rakam ve alt çizgi kullan.';
    if (/username_taken|account_exists/i.test(code)) return 'Bu kullanıcı adı kullanılamıyor. Başka bir takma ad seç veya mevcut hesabına giriş yap.';
    if (/invalid_recovery|recovery_failed/i.test(code)) return 'Kullanıcı adı veya kurtarma kodu doğrulanamadı. Kayıt sırasında sakladığın kodu kontrol et.';
    if (/rate|over_email_send_rate_limit|too many/i.test(code+' '+message)) return 'Çok sık deneme yapıldı. Biraz bekleyip tekrar dene.';
    if (/weak_password|password.*least|password.*short/i.test(code+' '+message)) return 'En az 10 karakterli, kolay tahmin edilmeyen bir şifre kullan.';
    if (/fetch|network|offline|timeout/i.test(message)||!online()) return 'Bağlantı kurulamadı. Bu cihazdaki kayıtların korunuyor; internet gelince yeniden deneyebilirsin.';
    if (/40001|PT409|23505|revision_conflict|revision conflict/i.test(code+' '+message)) return 'Bu hesap başka bir cihazda güncellenmiş. Üzerine yazmadan önce hangi kaydı kullanacağını seç.';
    return 'İşlem tamamlanamadı. Bağlantını kontrol edip tekrar dene. Sorun sürerse daha sonra yeniden dene.';
  }
  function persistMeta() { if(activeId)write(META_KEY(activeId),meta); }
  function refreshView(full=false) {
    if (full || ['account','community'].includes(route())) render();
    const label=document.querySelector('[data-cloud-status]');
    if(label)label.textContent=loggedIn()?(meta.enabled?'● Hesaba bağlı':'● Hesap açık · yerel kayıt'):'● Bu cihazda kayıtlı';
  }
  function setStatus(value, redraw=true) {status=value;if(redraw)refreshView();}
  function currentMeta(id) {
    const m=read(META_KEY(id),{});
    return {enabled:m.enabled===true,revision:Number.isFinite(Number(m.revision))?Number(m.revision):0,pending:m.pending===true};
  }
  window.cloudStorageKey=()=>activeId?USER_KEY(activeId):GUEST_KEY;
  window.cloudClient=()=>client;
  window.cloudSession=()=>session;
  window.getCloudSession=async()=>session;
  window.cloudSyncStatus=()=>({signedIn:loggedIn(),enabled:meta.enabled,pending:meta.pending,conflict,status});

  async function loadRemote(sequence, preferRemote=false) {
    if(!loggedIn()||!online())return;
    const id=activeId;
    const {data,error}=await client.from('health_records').select('user_id,payload,revision,updated_at').eq('user_id',id).maybeSingle();
    if(sequence!==sessionSequence||id!==activeId)return;
    if(error){setStatus(errorText(error));return;}
    const remoteRevision=data?Number(data.revision):0;
    if(meta.pending && !preferRemote) {
      if(remoteRevision!==meta.revision){conflict=true;setStatus('Başka cihazda farklı bir kayıt var. Kayıtları birleştirmeden önce Hesabım bölümünden seçim yap.');return;}
      setStatus(!meta.enabled?'Bu cihazda hesaba ait gönderilmemiş değişiklikler var. Buluta aktarım kapalı.':online()?'Bu cihazdaki değişiklikler gönderilmeyi bekliyor.':'Çevrimdışısın; değişikliklerin bu cihazda bekliyor.');
      if(meta.enabled)window.syncCloudSoon();return;
    }
    if(data){state=normalize(data.payload);write(USER_KEY(id),state);meta.revision=remoteRevision;meta.pending=false;conflict=false;persistMeta();setStatus(`Hesabındaki kayıt yüklendi. Son bulut kaydı: ${new Date(data.updated_at).toLocaleString('tr-TR')}`);refreshView(true);}
    else {meta.revision=0;meta.pending=false;conflict=false;persistMeta();setStatus('Bu hesabın bulut kaydı henüz yok. İstersen açık onayla aktarımı başlatabilirsin.');}
  }
  async function switchSession(next,event) {
    const nextId=next?.user?.id||null;
    session=next;
    if(nextId===activeId){
      window.onCloudSessionChanged?.(session);return;
    }
    const seq=++sessionSequence;switching=true;clearTimeout(syncTimer);
    // Save only to the namespace belonging to the previous identity.
    write(activeId?USER_KEY(activeId):GUEST_KEY,state);
    activeId=nextId;conflict=false;posts=[];blockedUsers=new Set();communityMessage='';
    if(nextId)recoverySecret=null;
    meta=nextId?currentMeta(nextId):{enabled:false,revision:0,pending:false};
    state=normalize(read(nextId?USER_KEY(nextId):GUEST_KEY,null));
    switching=false;
    status=nextId?(online()?'Hesap kaydı kontrol ediliyor…':'Çevrimdışısın; yalnız bu hesaba ait cihaz kaydı gösteriliyor.'):'Çıkış yapıldı. Misafir kaydına dönüldü.';
    refreshView(true);window.onCloudSessionChanged?.(session);
    if(nextId&&online())await loadRemote(seq);
  }
  async function syncNow() {
    if(!client||!loggedIn()||switching||!meta.enabled||!meta.pending||conflict||syncBusy)return;
    if(!online()){setStatus('Çevrimdışısın; bu hesaba ait değişiklikler bu cihazda bekliyor.');return;}
    const id=activeId,seq=sessionSequence,payload=snapshot(),fingerprint=JSON.stringify(payload),expected=meta.revision;
    syncBusy=true;setStatus('Kayıtların hesabına aktarılıyor…');
    try {
      const {data,error}=await client.rpc('save_health_record',{p_payload:payload,p_expected:expected});
      if(id!==activeId||seq!==sessionSequence)return;
      if(error){
        if(/40001|PT409|23505|revision_conflict|revision conflict/i.test(String(error.code)+' '+String(error.message))){conflict=true;setStatus('Başka cihazda yeni kayıt var. Otomatik üzerine yazılmadı; aşağıdan hangi kaydı kullanacağını seç.');}
        else setStatus(errorText(error));
        return;
      }
      const row=Array.isArray(data)?data[0]:data;
      if(!row||!Number.isFinite(Number(row.revision)))throw Error('Missing revision');
      syncFailures=0;meta.revision=Number(row.revision);meta.pending=JSON.stringify(snapshot())!==fingerprint;persistMeta();
      setStatus(meta.pending?'Yeni değişiklikler gönderilmeyi bekliyor.':`Bulut kaydı tamamlandı · ${new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}`);
    } catch(error){if(id===activeId&&seq===sessionSequence)setStatus(errorText(error));}
    finally {syncBusy=false;if(id===activeId&&seq===sessionSequence&&meta.pending&&!conflict&&meta.enabled&&online()){syncFailures++;if(syncFailures<=3)syncTimer=setTimeout(syncNow,10000);else setStatus('Eşitleme bekliyor. Bağlantını kontrol edip Şimdi eşitle düğmesiyle yeniden dene.');}}
  }
  window.syncCloudSoon=function(){
    if(switching||!loggedIn())return;
    // Track local changes even with upload off so a later login cannot replace
    // them with an older cloud copy. Tracking pending data grants no consent.
    meta.pending=true;syncFailures=0;persistMeta();clearTimeout(syncTimer);
    if(meta.enabled)syncTimer=setTimeout(syncNow,1000);
  };
  function usernameField(value='') {return `<label>Kullanıcı adı<input name="username" required minlength="3" maxlength="30" pattern="[a-z0-9_]{3,30}" value="${esc(value)}" autocomplete="username" autocapitalize="none" spellcheck="false" aria-describedby="cloudUsernameHelp"></label>`;}
  function authForm(){
    const secret=recoverySecret?`<section class="card cloud-secret" aria-labelledby="cloudSecretTitle"><h2 id="cloudSecretTitle">Kurtarma kodunu şimdi kaydet</h2><p><b>${esc(recoverySecret.username)}</b> hesabın oluşturuldu. Bu kod şifreni unuttuğunda hesabını açmanın yoludur. Kodu güvenli bir yere yaz veya parola yöneticine kaydet; destek grubunda paylaşma.</p><label>Kurtarma kodun — yalnız bu kez gösterilir<textarea id="cloudRecoverySecret" readonly rows="3" autocomplete="off" spellcheck="false">${esc(recoverySecret.code)}</textarea></label><p>Bu ekrandan ayrılınca kod gösterilmez; uygulama kodu bu cihazda saklamaz ve e-postaya göndermez. Şifreni ve kodunu birlikte kaybedersen hesabını geri açamayabilirsin.</p><div class="form-actions"><button id="cloudCopyRecovery" class="secondary">Kodu kopyala</button><button id="cloudDismissRecovery">Kodu kaydettim, giriş yapacağım</button></div></section>`:'';
    return `${secret}<p id="cloudUsernameHelp" class="notice">E-posta gerekmez. Kullanıcı adın 3–30 karakter olabilir: küçük Latin harfleri (a–z), rakam ve alt çizgi (_). Bir takma ad seç; gerçek adını veya tanını yazman gerekmez. Bu hesap doğrulanmış kimlik anlamına gelmez.</p><div class="cloud-auth-grid"><form id="cloudLogin" class="card"><h2>Hesabıma giriş yap</h2>${usernameField(recoverySecret?.username||loginHint)}<label>Şifre<input name="password" type="password" required autocomplete="current-password"></label><button ${authBusy?'disabled':''}>Giriş yap</button></form><form id="cloudSignup" class="card"><h2>Yeni hesap oluştur</h2>${usernameField()}<label>Şifre<input name="password" type="password" minlength="10" maxlength="200" required autocomplete="new-password"><small>En az 10 karakter. Başka hesaplarında kullanmadığın bir şifre seç.</small></label><label class="check"><input name="understood" type="checkbox" required>Misafir sağlık kayıtlarının otomatik yüklenmeyeceğini ve kurtarma kodumu kendim saklamam gerektiğini anladım.</label><p class="muted">Hesabın açılırken bu ekranda kal; tek seferlik kurtarma kodun gösterilecek.</p><button ${authBusy?'disabled':''}>Hesap oluştur</button></form></div><form class="card cloud-recovery" id="cloudRecovery"><h2>Kurtarma koduyla şifremi yenile</h2>${usernameField()}<label>Kayıt sırasında sakladığın kurtarma kodu<input name="recoveryCode" required maxlength="256" autocomplete="off" spellcheck="false" autocapitalize="none"></label><label>Yeni şifre<input name="newPassword" type="password" minlength="10" maxlength="200" required autocomplete="new-password"></label><p class="muted">Kodun yoksa bu yolla şifre yenilenemez. Kurtarma kodunu başka kişilerle paylaşma.</p><button class="secondary" ${authBusy?'disabled':''}>Kodu doğrula ve şifremi yenile</button></form><details class="cloud-import"><summary>Önceden e-posta ile açılmış hesabım var</summary><form class="card cloud-recovery" id="cloudLegacyLogin"><h2>E-posta hesabına giriş</h2><label>E-posta<input name="email" type="email" required maxlength="254" autocomplete="username"></label><label>Şifre<input name="password" type="password" required autocomplete="current-password"></label><button ${authBusy?'disabled':''}>E-posta hesabıma giriş yap</button></form></details>`;
  }
  window.cloudAccount=function(){
    const top=header('Hesabım ve bulut kaydı','Kendi hesabınla cihazlar arasında devam et.');
    if(!client)return top+'<div class="notice">Hesap servisi yüklenemedi. İnternet bağlantını kontrol edip sayfayı yenile. Bu cihazdaki kullanım ve kayıtlar devam eder.</div>';
    if(!loggedIn())return top+`<p class="cloud-status" role="status">${esc(status)}</p><div class="notice">Misafir kullanımında kayıtlar yalnız bu tarayıcıda kalır. Giriş yaptıktan sonra hesabına ait ayrı bir kayıt alanı açılır; misafir verileri açık seçimin olmadan buluta aktarılmaz.</div>${authForm()}`;
    return top+`<div class="card"><div class="cloud-account-heading"><div><span class="tag">GİRİŞ YAPILDI</span><h2>${esc(session.user.user_metadata?.username||session.user.email||'İyiAdım hesabın')}</h2></div><button id="cloudSignout" class="secondary" ${authBusy?'disabled':''}>Çıkış yap</button></div><p class="cloud-status" role="status">${esc(status)}</p><label class="check"><input id="cloudConsent" type="checkbox" ${meta.enabled?'checked':''}>Bu hesaptaki sağlık kayıtlarını buluta aktar.</label><p class="muted">Açık olduğunda profil, ilaç listesi ve günlük kayıtlar bu hesabın özel alanına gönderilir. Destek grubuna aktarılmaz. Ortak cihaz kullanıyorsan işin bitince çıkış yap.</p><div class="form-actions"><button id="cloudRetry" ${syncBusy?'disabled':''}>Şimdi eşitle</button><button id="cloudLoad" class="secondary">Buluttaki kaydı yükle</button></div>${conflict?'<div class="notice cloud-conflict"><b>Kayıt çakışması:</b> Bu cihaz ve bulut farklı. “Buluttaki kaydı yükle” bu cihazdaki hesap verisini değiştirir. Bu cihazın kaydını kullanmak istiyorsan önce dışa aktararak yedekle, ardından aşağıdaki seçeneği kullan.<br><button id="cloudOverwrite" class="secondary">Bu cihazdaki kaydı bilinçli olarak buluta gönder</button></div>':''}<details class="cloud-import"><summary>Misafir kaydımı bu hesaba taşımak istiyorum</summary><p>Bu tarayıcıdaki misafir kayıtları başka bir kişiye ait olabilir. Yalnız kendi kayıtların olduğundan eminsen aktar. Bu işlem mevcut hesap kaydını bu cihazda değiştirir; buluta aktarım ayrıca yukarıdaki onaya bağlıdır.</p><button id="cloudImportGuest" class="secondary">Misafir kaydı benim; bu hesaba kopyala</button></details><details class="cloud-import"><summary>Buluttaki sağlık kaydımı sil</summary><p>Yalnız bu hesabın bulut sağlık kaydı silinir; üyeliğin ve destek grubunda yazdıkların ayrı tutulur. Bu cihazdaki kayıt korunur.</p><button id="cloudDelete" class="secondary">Bulut sağlık kaydımı sil</button></details></div><div class="notice" style="margin-top:22px">Bağlantı yokken yalnız bu hesaba ait cihaz kaydı kullanılabilir. Aynı anda iki cihazda değişiklik olduğunda uygulama sessizce üzerine yazmaz; seçim ister. Tarayıcı verilerini temizlemek henüz gönderilmemiş kayıtları silebilir.</div>`;
  };
  function authError(error){setStatus(errorText(error));}
  async function bounded(task,milliseconds){
    let timer;
    try{return await Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Network timeout')),milliseconds);})]);}
    finally{clearTimeout(timer);}
  }
  async function forgetSessionOnThisDevice(){
    // stopAutoRefresh is public API. A reload discards the client's in-memory
    // tokens after removing our configured persistent session key.
    try{await client?.auth.stopAutoRefresh();}catch{}
    try{localStorage.removeItem(AUTH_KEY);}catch{}
    recoverySecret=null;await switchSession(null,'SIGNED_OUT');
    setStatus('Bu cihazda çıkış yapıldı. Diğer cihazlardaki oturumların ayrı kalır.');
    location.reload();
  }
  async function accountAccess(payload){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch(`${CLOUD_CONFIG.url}/functions/v1/account-access`,{method:'POST',headers:{apikey:CLOUD_CONFIG.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.ok!==true){const error=new Error('Account request failed');error.code=result.code||(response.status===429?'rate_limited':response.status===409?'username_taken':payload.action==='recover'?'invalid_recovery':'account_request_failed');throw error;}
      return result;
    }finally{clearTimeout(timeout);}
  }
  async function runAuth(form,mode){
    if(authBusy||!client)return;
    const data=new FormData(form),username=String(data.get('username')||'').trim(),password=String(data.get('password')||''),epoch=accountViewEpoch;
    if(mode!=='legacy'&&!/^[a-z0-9_]{3,30}$/.test(username))return setStatus('Kullanıcı adın 3–30 karakter olmalı. Yalnız küçük Latin harfleri, rakam ve alt çizgi kullan.');
    authBusy=true;recoverySecret=null;setStatus('İşlem sürüyor…');
    try {
      if(mode==='signup'){
        if(password.length<10)return setStatus('En az 10 karakterli bir şifre seç.');
        const result=await accountAccess({action:'signup',username,password});
        if(typeof result.recoveryCode!=='string'||result.recoveryCode.length<32)throw Error('Recovery code missing');
        loginHint=username;
        if(epoch===accountViewEpoch&&route()==='account')recoverySecret={username,code:result.recoveryCode};
        setStatus('Hesabın oluşturuldu. Kurtarma kodunu güvenli bir yere kaydet, sonra kullanıcı adın ve şifrenle giriş yap.');
      }else if(mode==='recovery'){
        const recoveryCode=String(data.get('recoveryCode')||'').trim(),newPassword=String(data.get('newPassword')||'');
        if(newPassword.length<10)return setStatus('Yeni şifren en az 10 karakter olmalı.');
        await accountAccess({action:'recover',username,recoveryCode,newPassword});loginHint=username;setStatus('Şifren yenilendi. Kullanıcı adın ve yeni şifrenle giriş yapabilirsin.');
      }else{
        const email=mode==='legacy'?String(data.get('email')||'').trim():`${username}@accounts.iyiadim.invalid`;
        const result=await client.auth.signInWithPassword({email,password});if(result.error)throw result.error;
        await switchSession(result.data.session,'SIGNED_IN');setStatus('Giriş yapıldı. Misafir kayıtları otomatik aktarılmadı.');
      }
    }catch(error){authError(error);}finally{authBusy=false;refreshView();}
  }
  async function loadOnDemand(){
    if(!loggedIn())return;
    if(!online()){setStatus('Bulut kaydını yüklemek için internet gerekiyor.');return;}
    if(!confirm('Buluttaki sağlık kaydı bu cihazdaki hesap kaydının yerine yüklensin mi? Gönderilmemiş değişiklikler kaybolabilir.'))return;
    await loadRemote(sessionSequence,true);
  }
  async function overwriteOnDemand(){
    if(!loggedIn()||!online())return setStatus('Bu işlem için giriş ve internet gerekiyor.');
    if(!meta.enabled)return setStatus('Önce sağlık kayıtlarını buluta aktarma seçeneğini işaretle.');
    if(!confirm('Bu cihazdaki hesap kaydı buluttaki kaydın yerine gönderilsin mi? Önce dışa aktararak yedekleyebilirsin.'))return;
    const id=activeId,seq=sessionSequence;
    const {data,error}=await client.from('health_records').select('revision').eq('user_id',id).maybeSingle();
    if(id!==activeId||seq!==sessionSequence)return;
    if(error)return authError(error);
    meta.revision=data?Number(data.revision):0;conflict=false;meta.pending=true;persistMeta();await syncNow();
  }
  window.bindCloudAccount=function(){
    for(const [id,mode]of [['cloudLogin','login'],['cloudSignup','signup'],['cloudRecovery','recovery'],['cloudLegacyLogin','legacy']]){const form=document.getElementById(id);if(form)form.onsubmit=e=>{e.preventDefault();runAuth(e.currentTarget,mode)};}
    const consent=document.getElementById('cloudConsent');if(consent)consent.onchange=()=>{meta.enabled=consent.checked;persistMeta();if(meta.enabled){setStatus('Aktarım açık. Bu hesaba ait kayıtlar gönderilecek.');window.syncCloudSoon();}else{clearTimeout(syncTimer);setStatus('Bu cihazdan otomatik aktarım durduruldu. Buluttaki önceki kayıtlar silinmedi.');}};
  };
  window.realCommunity=function(){
    const top=header('Birlikte daha iyi','Deneyimini paylaş, birbirine saygıyla destek ol.');
    if(!client||!loggedIn())return top+'<div class="card"><h2>Destek grubuna hesabınla katıl</h2><p>Ortak mesajları görmek ve yazmak için giriş yap. Sağlık profilin gruba otomatik aktarılmaz; yalnız seçtiğin takma ad ve yazdığın mesaj görünür.</p><button data-page="account">Hesabıma git</button></div>';
    return top+`<div class="notice">Gerçek üyelerle ortak paylaşım alanı. Tıbbi öneri ve acil yardım hizmeti değildir. Tanı, ilaç listesi, telefon, adres ve kimlik bilgilerini paylaşma. Bildirme ve engelleme araçları var; insan tarafından anında moderasyon garantisi yok.</div><div class="community-layout"><section class="card"><label>Destek alanı<select id="communityGroup">${Object.entries(groups).map(([key,name])=>`<option value="${key}" ${key===group?'selected':''}>${name}</option>`).join('')}</select></label><p id="communityStatus" class="cloud-status" role="status">${esc(communityMessage||'Mesajlar yükleniyor…')}</p><button id="communityRefresh" class="secondary">Mesajları yenile</button><div id="communityPosts"></div></section><form class="card community-form" id="communityPostForm"><h2>Deneyimini paylaş</h2><label>Takma adın<input name="alias" required minlength="2" maxlength="40" value="${esc(read(aliasKey(activeId),''))}" autocomplete="off"></label><label>Mesajın<textarea name="body" required minlength="1" maxlength="1500" placeholder="Bugünkü küçük hedefin veya sana yardımcı olan bir deneyim…"></textarea></label><label class="check"><input name="agreed" type="checkbox" required>Mesajımın bu destek alanındaki diğer üyelerce görüleceğini biliyorum.</label><button ${!online()?'disabled':''}>Destek grubunda paylaş</button><p class="muted">Mesajın gönderilmeden önce internet gerekir. Profilindeki tanılar ve sağlık kayıtları bu forma eklenmez.</p></form></div>`;
  };
  function drawPosts(){
    const box=document.getElementById('communityPosts');if(!box)return;
    const visible=posts.filter(p=>!blockedUsers.has(p.user_id));
    box.innerHTML=visible.length?visible.map(p=>`<article class="community-post"><div class="community-post-head"><h3>${esc(p.alias)}</h3><time datetime="${esc(p.created_at)}">${new Date(p.created_at).toLocaleString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</time></div><p>${esc(p.body)}</p>${p.user_id===activeId?`<button class="text-btn" data-community-delete="${esc(p.id)}">Paylaşımımı sil</button>`:`<details><summary>Bildir veya engelle</summary><form class="community-report" data-community-report="${esc(p.id)}"><label>Bildirme nedeni<select name="reason"><option value="medical_advice">İlaç / tedavi tavsiyesi</option><option value="privacy">Kişisel bilgi paylaşımı</option><option value="harassment">Rahatsız edici / incitici içerik</option><option value="other">Diğer</option></select></label><button class="secondary">Bildir</button></form><button class="secondary" data-community-block="${esc(p.user_id)}">Bu kişiyi görünümümden engelle</button></details>`}</article>`).join(''):'<p class="empty">Bu alanda henüz görünür mesaj yok. İlk deneyimini paylaşabilir veya daha sonra yeniden bakabilirsin.</p>';
    const label=document.getElementById('communityStatus');if(label)label.textContent=communityMessage||`${visible.length} mesaj · Son 50 paylaşım gösteriliyor`;
    box.querySelectorAll('form[data-community-report]').forEach(form=>form.onsubmit=async e=>{e.preventDefault();await reportPost(form.dataset.communityReport,new FormData(form).get('reason'));});
  }
  async function fetchCommunity(){
    if(!client||!loggedIn()||communityBusy||route()!=='community')return;
    if(!online()){communityMessage='Çevrimdışısın. Görünen mesajlar bu oturumda daha önce yüklenenlerdir; yeni mesaj gönderilemez.';drawPosts();return;}
    const id=activeId,selected=group;communityBusy=true;
    try{
      const [messagesResult,blocksResult]=await Promise.all([client.from('community_posts').select('id,user_id,group_slug,alias,body,created_at,status').eq('group_slug',selected).eq('status','published').order('created_at',{ascending:false}).limit(50),client.from('user_blocks').select('blocked_id').eq('blocker_id',id)]);
      if(id!==activeId||selected!==group)return;
      if(messagesResult.error)throw messagesResult.error;if(blocksResult.error)throw blocksResult.error;
      posts=messagesResult.data||[];blockedUsers=new Set((blocksResult.data||[]).map(b=>b.blocked_id));communityMessage='';drawPosts();
    }catch(error){if(id===activeId&&selected===group){communityMessage=errorText(error);drawPosts();}}finally{communityBusy=false;if((id!==activeId||selected!==group)&&route()==='community')setTimeout(fetchCommunity,0);}
  }
  async function publishPost(form){
    if(!loggedIn()||!online())return toast('Paylaşmak için giriş ve internet gerekiyor.');
    const data=new FormData(form),alias=String(data.get('alias')||'').trim(),body=String(data.get('body')||'').trim(),id=activeId,selected=group;if(alias.length<2||!body)return;
    const button=form.querySelector('button');button.disabled=true;
    try{
      const {error}=await client.from('community_posts').insert({user_id:id,group_slug:selected,alias,body});if(error)throw error;if(id!==activeId)return;
      write(aliasKey(id),alias);form.elements.body.value='';communityMessage='Paylaşımın gönderildi.';toast('Paylaşımın destek grubuna gönderildi.');await fetchCommunity();
    }catch(error){if(id===activeId){communityMessage=errorText(error);drawPosts();}}finally{if(button.isConnected)button.disabled=false;}
  }
  async function reportPost(postId,reason){
    if(!loggedIn()||!online())return toast('Bildirmek için internet gerekiyor.');
    const id=activeId;const {error}=await client.from('reports').insert({user_id:id,post_id:postId,reason:String(reason)});if(id!==activeId)return;
    if(error)return toast(String(error.code)==='23505'?'Bu paylaşımı daha önce bildirdin.':errorText(error));toast('Bildirimin kaydedildi. Anında insan incelemesi garantisi yok; istersen kişiyi engelleyebilirsin.');
  }
  window.bindCommunity=function(){
    const groupSelect=document.getElementById('communityGroup');if(groupSelect)groupSelect.onchange=()=>{group=groupSelect.value;posts=[];communityMessage='Mesajlar yükleniyor…';drawPosts();fetchCommunity();};
    const form=document.getElementById('communityPostForm');if(form)form.onsubmit=e=>{e.preventDefault();publishPost(e.currentTarget);};
    if(document.getElementById('communityPosts')){drawPosts();fetchCommunity();}
  };
  document.addEventListener('click',async event=>{
    const b=event.target.closest('button');if(!b||!client)return;
    if(b.id==='cloudCopyRecovery'&&recoverySecret){
      try{await navigator.clipboard.writeText(recoverySecret.code);toast('Kurtarma kodu kopyalandı. Güvenli bir yere kaydet.');}
      catch{const field=document.getElementById('cloudRecoverySecret');field?.focus();field?.select();toast('Kod alanı seçildi. Kopyalayıp güvenli bir yere kaydedebilirsin.');}
    }
    if(b.id==='cloudDismissRecovery'){recoverySecret=null;setStatus('Kurtarma kodu artık bu ekranda gösterilmiyor. Kullanıcı adın ve şifrenle giriş yapabilirsin.');}
    if(b.id==='cloudSignout'){
      if(authBusy)return;authBusy=true;b.disabled=true;
      try{
        try{await bounded(Promise.resolve(window.disableReminderSubscription?.()),5000);}catch{}
        if(!online()){await forgetSessionOnThisDevice();return;}
        const {error}=await bounded(client.auth.signOut({scope:'local'}),8000);if(error)throw error;
        await switchSession(null,'SIGNED_OUT');recoverySecret=null;
      }catch{await forgetSessionOnThisDevice();}finally{authBusy=false;refreshView();}
    }
    if(b.id==='cloudRetry'){if(!meta.enabled)return setStatus('Önce aktarım tercihini aç.');if(conflict)return setStatus('Önce çakışan kayıtlardan hangisini kullanacağını seç.');window.syncCloudSoon();await syncNow();}
    if(b.id==='cloudLoad')await loadOnDemand();
    if(b.id==='cloudOverwrite')await overwriteOnDemand();
    if(b.id==='cloudImportGuest'&&loggedIn()){
      if(!confirm('Bu tarayıcıdaki misafir kaydının sana ait olduğunu onaylıyor musun? Bu cihazdaki hesap kaydının yerine kopyalanacak.'))return;
      state=normalize(read(GUEST_KEY,null));write(USER_KEY(activeId),state);setStatus('Misafir kaydı bu cihazdaki hesabına kopyalandı. Buluta aktarım tercihini ayrıca kontrol et.');if(meta.enabled)window.syncCloudSoon();refreshView(true);
    }
    if(b.id==='cloudDelete'&&loggedIn()){
      if(syncBusy)return setStatus('Eşitleme sürüyor. Tamamlandıktan sonra silmeyi yeniden dene.');if(!confirm('Bu hesabın buluttaki sağlık kaydı silinsin mi? Bu cihazdaki kayıt korunur.'))return;
      clearTimeout(syncTimer);meta.enabled=false;persistMeta();const id=activeId;const {error}=await client.from('health_records').delete().eq('user_id',id);
      if(error)return authError(error);if(id!==activeId)return;meta={enabled:false,pending:false,revision:0};conflict=false;persistMeta();setStatus('Bu hesabın bulut sağlık kaydı silindi. Bu cihazdaki kayıt korunuyor.');
    }
    if(b.id==='communityRefresh')await fetchCommunity();
    if(b.dataset.communityDelete&&loggedIn()){
      if(!confirm('Bu paylaşımın silinsin mi?'))return;
      const {error}=await client.from('community_posts').delete().eq('id',b.dataset.communityDelete).eq('user_id',activeId);if(error)return toast(errorText(error));await fetchCommunity();
    }
    if(b.dataset.communityBlock&&loggedIn()){
      if(!confirm('Bu kişinin paylaşımları senin görünümünden gizlensin mi?'))return;
      const id=activeId;const {error}=await client.from('user_blocks').upsert({blocker_id:id,blocked_id:b.dataset.communityBlock},{onConflict:'blocker_id,blocked_id'});if(id!==activeId)return;if(error)return toast(errorText(error));blockedUsers.add(b.dataset.communityBlock);drawPosts();toast('Bu kişinin paylaşımları senin görünümünden gizlendi.');
    }
  });
  window.addEventListener('hashchange',()=>{accountViewEpoch++;if(route()!=='account'){recoverySecret=null;loginHint='';}});
  window.addEventListener('pagehide',()=>{accountViewEpoch++;recoverySecret=null;document.querySelector('.cloud-secret')?.remove();});
  window.addEventListener('storage',event=>{if(event.key===AUTH_KEY&&event.newValue===null&&loggedIn())forgetSessionOnThisDevice();});
  window.initCloud=async function(){
    if(initialized)return;initialized=true;
    if(!window.supabase?.createClient||!window.CLOUD_CONFIG?.url||!window.CLOUD_CONFIG?.publishableKey)return;
    try{
      client=window.supabase.createClient(CLOUD_CONFIG.url,CLOUD_CONFIG.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:AUTH_KEY}});
      client.auth.onAuthStateChange((event,next)=>{setTimeout(()=>switchSession(next,event).catch(error=>setStatus(errorText(error))),0);});
      const {data,error}=await client.auth.getSession();if(error)throw error;await switchSession(data.session,'INITIAL_SESSION');
      if(location.hash.includes('access_token=')||location.hash.includes('refresh_token='))location.hash='account';
      pollTimer=setInterval(()=>{if(!document.hidden&&route()==='community')fetchCommunity();},20000);
      window.addEventListener('online',()=>{if(loggedIn()){if(meta.enabled&&meta.pending&&!conflict)syncNow();else loadRemote(sessionSequence);if(route()==='community')fetchCommunity();}});
      window.addEventListener('offline',()=>{if(loggedIn())setStatus('Çevrimdışısın. Bu hesaba ait değişiklikler bu cihazda korunuyor.');});
      refreshView();
    }catch(error){status=errorText(error);refreshView();}
  };
})();
