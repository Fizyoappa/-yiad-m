function devicePage(){return header('Cihazım ve hatırlatmalar','Çevrimdışı kullanım, hareket kaydı ve bildirim tercihlerin.')+deviceTools()+notificationTools()}
function updateTopStatus(){let el=document.querySelector('[data-cloud-status]');let st=window.cloudSyncStatus?.();if(el)el.textContent=st?.signedIn?(st.enabled?'● Hesaba bağlı':'● Hesap · yerel kayıt'):'● Bu cihazda kayıtlı';}
window.onCloudSessionChanged=function(s){window.onReminderSessionChanged?.(s);updateTopStatus()};
const originalTracking=tracking;
tracking=function(){return originalTracking()+`<div class="card" style="margin-top:22px"><h2>Hareket süresi, adım ve bildirimler</h2><p>İsteğe bağlı adım tahmini, manuel sayaç, hareket süresi ve bildirim tercihleri için cihaz araçlarını aç.</p><button data-page="devices">Cihaz araçlarını aç ↗</button></div>`};
render();initOffline();initCloud().catch(()=>toast('Hesap servisine ulaşılamadı; yerel kayıtlarla devam edebilirsin.'));
