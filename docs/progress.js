/* Local, user-reported progress and print reports. No health data leaves this module. */
(function () {
  'use strict';
  const E = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const weekdays = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  const dateOf = key => new Date(`${key}T12:00:00`);
  const keyOf = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const today = () => keyOf(new Date());
  const shift = (key, n) => { const d=dateOf(key); d.setDate(d.getDate()+n); return keyOf(d); };
  const display = key => dateOf(key).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});
  const numeric = n => typeof n === 'number' && Number.isFinite(n);
  let range = {from:shift(today(),-29),to:today()};
  const store = () => (typeof state !== 'undefined' ? state : {profile:{},days:{},meds:[]});
  const symptomRecorded = d => !!(d && (d.trackedAt || d.trackingSavedAt || Object.hasOwn(d,'functionalDifficulty')));
  const exerciseIds = d => [...new Set(Array.isArray(d?.done)?d.done.filter(id=>typeof id==='string'):[])];
  function daysBetween(from,to) { let out=[];for(let d=from; d<=to&&out.length<367;d=shift(d,1))out.push(d);return out; }
  function latestPlan(date) {
    return (store().progressPlanHistory || []).filter(p=>p.effectiveFrom<=date).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).at(-1);
  }
  function plannedDay(date) { const p=latestPlan(date);return !!(p && p.weekdays.includes((dateOf(date).getDay()+6)%7)); }
  function summarize(from,to) {
    const keys=daysBetween(from,to).filter(k=>k<=today()), records=store().days||{};
    const scheduled=keys.filter(plannedDay), covered=scheduled.filter(k=>exerciseIds(records[k]).length>0);
    const active=keys.filter(k=>exerciseIds(records[k]).length>0);
    const symptomDays=keys.filter(k=>symptomRecorded(records[k]));
    const field = name => symptomDays.filter(k=>numeric(records[k][name])).map(k=>({date:k,value:records[k][name]}));
    const mean = name => {const v=field(name);return v.length?v.reduce((n,x)=>n+x.value,0)/v.length:null;};
    return {keys,scheduled,covered,active,symptomDays,field,mean,
      completionCount:keys.reduce((n,k)=>n+exerciseIds(records[k]).length,0),
      coverage:scheduled.length?Math.round(covered.length/scheduled.length*100):null};
  }
  const valueText = n => n===null||n===undefined?'Kayıt yok':Number(n).toLocaleString('tr-TR',{maximumFractionDigits:1});
  function coverageText(s) {return s.scheduled.length?`${s.covered.length} / ${s.scheduled.length} planlı günde kayıt (%${s.coverage})`:'Bu dönemde kayıtlı gün planı yok';}
  function goalComparison(s) {
    const values=s.field('functionalDifficulty');
    if(!values.length)return '<p>Günlük hedefte zorlanma kaydı yok. Takibim ekranında 0–10 aralığında kaydettiğinde değişim burada görünür.</p>';
    const first=values[0],last=values.at(-1);
    let text=`İlk kayıt: <b>${first.value}/10</b> (${display(first.date)}). Son kayıt: <b>${last.value}/10</b> (${display(last.date)}).`;
    if(values.length>1){let change=last.value-first.value;text+=` Kayıt farkı: <b>${change>0?'+':''}${change.toLocaleString('tr-TR')} puan</b>. Daha düşük değer, daha az bildirilen zorlanmayı gösterir.`;}
    else text+=' Karşılaştırma için en az iki farklı gün kaydı gerekir.';
    return `<p>${text}</p><p class="progress-caption">Bu, kişinin kendi bildirimidir; standart bir fonksiyon testi veya uygulamanın etkisinin kanıtı değildir.</p>`;
  }
  function symptomChart(s) {
    const fields=[['pain','Ağrı','#a45d39'],['fatigue','Yorgunluk','#6475a7'],['functionalDifficulty','Hedefte zorlanma','#287354']];
    const left=35, top=20, w=540,h=150,total=Math.max(s.keys.length-1,1);
    let content=fields.map(([field,label,color])=>s.field(field).map(({date,value})=>{
      const x=left+(s.keys.indexOf(date)/total)*w,y=top+h-(Math.max(0,Math.min(10,value))/10)*h;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${color}"><title>${E(label)} · ${E(display(date))}: ${value}/10</title></circle>`;
    }).join('')).join('');
    if(!content)return '<div class="progress-empty">Bu aralıkta açıkça kaydedilmiş ağrı, yorgunluk veya hedefte zorlanma ölçümü yok. Sayfa açıldığında oluşan varsayılan sıfırlar ölçüm sayılmaz.</div>';
    return `<div class="progress-plot"><svg viewBox="0 0 610 220" role="img" aria-label="Seçili dönemde kaydedilen ağrı, yorgunluk ve hedefte zorlanma değerleri. Eksik günlerde nokta gösterilmez; aşağıdaki tabloda sayısal değerler bulunur.">${[0,5,10].map(n=>`<line x1="35" x2="575" y1="${top+h-n/10*h}" y2="${top+h-n/10*h}" stroke="#d9e3d5"/><text x="15" y="${top+h-n/10*h+4}" font-size="12" fill="#4b6258">${n}</text>`).join('')}${content}<text x="35" y="204" font-size="12" fill="#4b6258">${E(display(range.from))}</text><text x="575" y="204" text-anchor="end" font-size="12" fill="#4b6258">${E(display(range.to))}</text></svg></div><div class="progress-legend">${fields.map(([,label,color])=>`<span><i style="background:${color}"></i>${label}</span>`).join('')}</div><p class="progress-caption">0–10 ölçeği. Noktalar gerçek kayıtlardır; eksik günler sıfır kabul edilmez ve araları çizgiyle doldurulmaz.</p>`;
  }
  function tableRows(s, report=false) {
    const data=store().days||{};
    return s.keys.map(k=>{
      const d=data[k],entered=symptomRecorded(d),done=exerciseIds(d);
      const m=field=>entered&&numeric(d[field])?E(d[field]):'—';
      return `<tr><td>${E(display(k))}</td><td>${plannedDay(k)?'Planlı':'—'}</td><td>${done.length?report?done.map(id=>E((window.EXERCISE_LIBRARY||[]).find(e=>e.id===id)?.title||id)).join('; '):done.length:'Kayıt yok'}</td><td>${m('pain')}</td><td>${m('fatigue')}</td><td>${m('functionalDifficulty')}</td>${report?`<td>${entered&&numeric(d?.steps)?d.steps:'—'}</td><td>${entered&&numeric(d?.water)?d.water:'—'}</td><td>${m('breathlessness')}</td><td>${m('glucose')}</td><td>${entered&&numeric(d?.bpSystolic)&&numeric(d?.bpDiastolic)?`${d.bpSystolic}/${d.bpDiastolic}`:'—'}</td>`:''}</tr>`;
    }).join('');
  }
  function periodCard(title,s) {return `<article class="progress-stat"><h3>${title}</h3><strong>${s.active.length}</strong><span>günde egzersiz tamamlama kaydı</span><p>${coverageText(s)}</p><small>${s.symptomDays.length} günde belirti kaydı</small></article>`;}
  function dashboard() {
    const s=summarize(range.from,range.to),current=(store().progressPlanHistory||[]).at(-1),checkdays=current?.weekdays||[];
    return `<section id="progress-dashboard" class="card progress-dashboard"><div class="section-head"><div><span class="tag">UZUN DÖNEM TAKİP</span><h2>Gelişimim ve uzman özeti</h2></div><button id="progressPrint" class="secondary">PDF kaydet / yazdır</button></div><p>Kaydettiklerini karşılaştır; egzersiz günlerini uzmanınla belirlediğin programa göre takip et.</p><div class="progress-range"><label>Başlangıç<input id="progressFrom" type="date" value="${range.from}" max="${today()}"></label><label>Bitiş<input id="progressTo" type="date" value="${range.to}" max="${today()}"></label><label>Ay seç<input id="progressMonth" type="month" max="${today().slice(0,7)}"></label><button id="progressApply">Dönemi göster</button></div><div class="progress-shortcuts"><button data-progress-days="7" class="secondary">Son 7 gün</button><button data-progress-days="30" class="secondary">Son 30 gün</button><button data-progress-days="90" class="secondary">Son 90 gün</button></div><div class="progress-stats">${periodCard('Son 7 gün',summarize(shift(today(),-6),today()))}${periodCard('Son 30 gün',summarize(shift(today(),-29),today()))}</div><p class="progress-caption">Devamlılık, planlı günlerde egzersiz tamamlandığına dair kayıt oranıdır. Kaydı olmayan gün, egzersiz yapılmadığını kanıtlamaz. Her egzersizi her gün tamamlama hedefi yoktur.</p><details class="progress-plan"><summary>Uzmanımla belirlediğim hareket günlerini kaydet</summary><p>Bu seçim klinik program oluşturmaz. Hangi gün ne çalışacağını ve dinlenme aralarını uzmanın belirler. Yeni kayıt bugün itibarıyla geçerlidir; geçmiş günler sonradan planlanmış sayılmaz.</p><form id="progressPlanForm"><fieldset><legend>Haftalık hareket günlerim</legend><div class="progress-weekdays">${weekdays.map((n,i)=>`<label><input type="checkbox" name="weekday" value="${i}" ${checkdays.includes(i)?'checked':''}>${n}</label>`).join('')}</div></fieldset><button>Gün planını kaydet</button></form>${current?`<p class="progress-caption">Son plan: ${E(display(current.effectiveFrom))} itibarıyla ${current.weekdays.length?current.weekdays.map(i=>weekdays[i]).join(', '):'gün seçilmedi'}. Önceki plan kayıtları korunur.</p>`:'<p class="progress-caption">Henüz kaydedilmiş gün planı yok; devamlılık yüzdesi hesaplanmaz.</p>'}</details><h3 class="progress-subtitle">Seçili dönem: ${E(display(range.from))} – ${E(display(range.to))}</h3><div class="progress-period-summary"><span>${s.completionCount} hareket tamamlama kaydı</span><span>${s.symptomDays.length} / ${s.keys.length} günde belirti kaydı</span><span>${coverageText(s)}</span></div><h3>Belirti ve hedef takibi</h3>${symptomChart(s)}<div class="progress-goal"><h3>${E(store().profile?.goal||'Günlük yaşam hedefim')}</h3>${goalComparison(s)}</div><div class="table-scroll"><table><caption>Seçili dönemin kullanıcı beyanına dayalı kayıtları</caption><thead><tr><th>Gün</th><th>Gün planı</th><th>Tamamlanan hareket</th><th>Ağrı / 10</th><th>Yorgunluk / 10</th><th>Hedefte zorlanma / 10</th></tr></thead><tbody>${tableRows(s)}</tbody></table></div><p class="progress-caption">—: ölçüm yok veya doğrulanmış kayıt bulunmuyor. Eksik günler otomatik doldurulmaz. Eski kayıtlar açıkça kaydedildiği anlaşılmadığında belirti analizi dışında tutulur.</p><label class="check"><input id="progressIncludeMeds" type="checkbox">PDF raporuna mevcut ilaç listemi de ekle.</label><p class="progress-caption">Rapor cihazında hazırlanır. Yazdır penceresinde “PDF olarak kaydet” seçebilirsin. Dosyayı paylaşacağın kişiyi sen belirlersin.</p></section>`;
  }
  function refresh() {const el=document.getElementById('progress-dashboard');if(el){el.outerHTML=dashboard();bind();}}
  function tell(message){if(typeof toast==='function')toast(message);else window.alert(message);}
  function validRange(from,to){if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)||from>to||to>today()||daysBetween(from,to).length>366){tell('Geçmişteki geçerli bir tarih aralığı seç. En fazla 366 gün gösterilebilir.');return false;}return true;}
  function bind() {
    const root=document.getElementById('progress-dashboard');if(!root||root.dataset.bound)return;root.dataset.bound='1';
    root.querySelector('#progressApply')?.addEventListener('click',()=>{const from=root.querySelector('#progressFrom').value,to=root.querySelector('#progressTo').value;if(validRange(from,to)){range={from,to};refresh();}});
    root.querySelector('#progressMonth')?.addEventListener('change',event=>{let month=event.target.value;if(!/^\d{4}-\d{2}$/.test(month))return;const first=`${month}-01`,d=dateOf(first);d.setMonth(d.getMonth()+1,0);const last=keyOf(d)>today()?today():keyOf(d);if(validRange(first,last)){range={from:first,to:last};refresh();}});
    root.querySelectorAll('[data-progress-days]').forEach(button=>button.addEventListener('click',()=>{range={from:shift(today(),1-Number(button.dataset.progressDays)),to:today()};refresh();}));
    root.querySelector('#progressPlanForm')?.addEventListener('submit',event=>{event.preventDefault();const chosen=new FormData(event.currentTarget).getAll('weekday').map(Number);const app=store();app.progressPlanHistory=Array.isArray(app.progressPlanHistory)?app.progressPlanHistory:[];app.progressPlanHistory.push({createdAt:new Date().toISOString(),effectiveFrom:today(),weekdays:chosen});if(typeof save==='function')save();refresh();tell('Hareket günlerin bugün itibarıyla kaydedildi. Uzmanının egzersiz ve dinlenme düzenini izle.');});
    root.querySelector('#progressPrint')?.addEventListener('click',()=>printReport({includeMeds:root.querySelector('#progressIncludeMeds')?.checked}));
  }
  function exerciseName(id) {return (window.EXERCISE_LIBRARY||[]).find(e=>e.id===id)?.title||id;}
  function recordDate(value) {const n=typeof value==='string'?Date.parse(value):NaN;return Number.isFinite(n)?new Date(n).toLocaleString('tr-TR'):'Tarih belirtilmedi';}
  function enteredNumber(value) {return numeric(value)?E(value):'—';}
  function enteredPlanSection(app) {
    const entries=Object.entries(app.profile?.prescriptions||{}).filter(([,p])=>p&&typeof p==='object'&&!Array.isArray(p));
    return `<h2>Kullanıcının uzman planından aktardığı kişisel dozlar</h2><p>Rapor anındaki kayıtlar gösterilir. Bu alan uzman imzası veya doğrulanmış reçete değildir; kullanıcı beyanıdır. Güncel dozlar geçmişteki seansların dozu olarak yorumlanamaz. Haftalık gün sayısı, hareket günleri takviminden ayrı bir bilgidir.</p>${entries.length?`<table><thead><tr><th>Hareket</th><th>Tekrar</th><th>Set</th><th>Süre · dk</th><th>Haftada gün</th><th>Şiddet / direnç / sınır notu</th><th>Kayıt kaynağı ve zamanı</th></tr></thead><tbody>${entries.map(([id,p])=>`<tr><td>${E(exerciseName(id))}</td><td>${enteredNumber(p.reps)}</td><td>${enteredNumber(p.sets)}</td><td>${enteredNumber(p.minutes)}</td><td>${enteredNumber(p.days)}</td><td>${E(p.notes||'Belirtilmedi')}</td><td>${E(p.source||'Kullanıcı beyanı')}<br>${E(recordDate(p.recordedAt))}</td></tr>`).join('')}</tbody></table>`:'<p>Aktarılmış kişisel egzersiz dozu kaydı yok.</p>'}`;
  }
  function performanceSection(app,summary) {
    const rows=summary.keys.flatMap(date=>Object.entries(app.days?.[date]?.performance||{}).filter(([,r])=>r&&typeof r==='object'&&!Array.isArray(r)).map(([id,r])=>({date,id,r})));
    return `<h2>Hareket başına kaydedilen performans</h2><p>Seçili tarih aralığındaki kayıtlı tekrar, süre ve hareket sonrası ağrı değerleri gösterilir. Bir gün ve hareket için saklanan mevcut kayıt kullanılır; tekrarlar ve süreler seans toplamı varsayılarak toplanmaz. Boş değerler sıfır değildir. Bu kayıt, tekniğin veya fiilî uygulamanın uzman tarafından doğrulandığı anlamına gelmez.</p>${rows.length?`<table><thead><tr><th>Gün</th><th>Hareket</th><th>Kaydedilen tekrar</th><th>Kaydedilen süre · dk</th><th>Hareket sonrası ağrı / 10</th><th>Kayıt zamanı</th></tr></thead><tbody>${rows.map(({date,id,r})=>`<tr><td>${E(display(date))}</td><td>${E(exerciseName(id))}</td><td>${enteredNumber(r.reps)}</td><td>${enteredNumber(r.minutes)}</td><td>${enteredNumber(r.painAfter)}</td><td>${E(recordDate(r.recordedAt))}</td></tr>`).join('')}</tbody></table>`:'<p>Bu dönemde hareket başına performans kaydı yok.</p>'}`;
  }
  function printReport(options={}) {
    const includeMeds=options.includeMeds??!!document.getElementById('progressIncludeMeds')?.checked;
    const report=window.open('','_blank');if(!report){tell('Rapor penceresi açılamadı. Bu site için açılır pencereye izin verip tekrar dene.');return null;}
    const app=store(),p=app.profile||{},s=summarize(range.from,range.to),names=(p.diagnoses||[]).map(id=>(window.CONDITIONS||[]).find(c=>c.id===id)?.name||id);
    const medSection=includeMeds?`<h2>Mevcut ilaç listesi · kullanıcı beyanı</h2><p>Bu liste reçete veya doz önerisi değildir; rapor tarihindeki uygulama kayıtlarını gösterir.</p><table><thead><tr><th>İlaç</th><th>Kayıtlı kullanım notu</th><th>Saat</th></tr></thead><tbody>${(app.meds||[]).map(m=>`<tr><td>${E(m.name)}</td><td>${E(m.dose)}</td><td>${E(m.time)}</td></tr>`).join('')||'<tr><td colspan="3">İlaç kaydı yok.</td></tr>'}</tbody></table>`:'';
    const personalPlan=enteredPlanSection(app), performance=performanceSection(app,s);
    let html=`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>İyiAdım Sağlık Özeti ${today()}</title><style>body{font-family:Arial,sans-serif;color:#203c32;margin:35px;font-size:13px;line-height:1.65}h1{font-size:27px;margin-bottom:3px}h2{font-size:18px;margin-top:28px}h3{font-size:15px}p{margin:8px 0}.subtitle{color:#566a5f}.report-facts{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:18px;background:#eef3e8;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:10px;margin:14px 0}th,td{text-align:left;vertical-align:top;border:1px solid #cedacd;padding:7px;overflow-wrap:anywhere}th{background:#eef3e8}caption{text-align:left;font-weight:bold;margin-bottom:8px}.notice{border-left:4px solid #899a61;padding:10px 15px;background:#f3f4eb}.controls{padding:18px;background:#eef3e8;display:flex;gap:15px;align-items:center;flex-wrap:wrap}button{font:inherit;padding:13px 18px;background:#246851;color:white;border:0;border-radius:10px;cursor:pointer;font-weight:bold}.support{margin-top:15px;color:#405d4d}@page{size:A4 landscape;margin:15mm}@media print{body{margin:0;font-size:11px}.controls{display:none}thead{display:table-header-group}tr{break-inside:avoid}h2,h3{break-after:avoid}.report-facts{break-inside:avoid}a{color:inherit}footer{font-size:9px;margin-top:22px}}</style></head><body><div class="controls"><button id="printReport">Yazdır / PDF olarak kaydet</button><span>PDF için yazdırma penceresindeki hedefi “PDF olarak kaydet” seç.</span></div><h1>İyiAdım · Sağlık ve hareket özeti</h1><p class="subtitle">Kullanıcı beyanına dayalı kayıtlar · Hazırlanma: ${E(new Date().toLocaleString('tr-TR'))}</p><div class="report-facts"><div><b>Ad:</b> ${E(p.name||'Belirtilmedi')}<br><b>Yaş:</b> ${E(p.age||'Belirtilmedi')}<br><b>Tanılar:</b> ${names.map(E).join(', ')||'Belirtilmedi'}</div><div><b>Hedef:</b> ${E(p.goal||'Belirtilmedi')}<br><b>Dönem:</b> ${E(display(range.from))} – ${E(display(range.to))}<br><b>Kayıtlı kısıtlamalar:</b> ${E(p.limits||'Belirtilmedi')}</div></div><h2>Dönem özeti</h2><p>${s.active.length} günde ${s.completionCount} hareket tamamlama kaydı; ${s.symptomDays.length} / ${s.keys.length} günde belirti kaydı.</p><p><b>Planlı günlerde kayıt:</b> ${coverageText(s)}.</p><p>Ağrı ortalaması: ${valueText(s.mean('pain'))}/10; yorgunluk ortalaması: ${valueText(s.mean('fatigue'))}/10. Yalnız açıkça kaydedilmiş değerler kullanılır; kayıt yoksa ortalama üretilmez.</p><h2>Günlük yaşam hedefinde bildirilen değişim</h2><h3>${E(p.goal||'Hedef belirtilmedi')}</h3>${goalComparison(s)}<div class="notice">Bu rapor tanı, reçete, klinik onay veya etkinlik kanıtı değildir. Tamamlama kaydı egzersiz tekniğini ve fiili uygulamayı doğrulamaz. Gün planı, kişinin uzmanınla belirlediğini beyan ettiği günlerden oluşur; tüm kuvvet hareketlerinin her gün yapılması hedeflenmez. Eksik kayıtlar başarısızlık veya sıfır belirti olarak yorumlanmaz.</div><h2>Günlük kayıtlar</h2><table><thead><tr><th>Gün</th><th>Planlı</th><th>Tamamlanan hareketler</th><th>Ağrı /10</th><th>Yorgunluk /10</th><th>Hedefte zorlanma /10</th><th>Adım</th><th>Su, bardak</th><th>Nefes darlığı /10</th><th>Şeker mg/dL</th><th>Tansiyon mmHg</th></tr></thead><tbody>${tableRows(s,true)}</tbody></table><p>—: ölçüm yok veya açıkça kaydedildiği doğrulanamayan değer. Egzersiz adları mevcut kütüphaneden eşlenir; dozun kişisel uygunluğunu uzman belirler.</p>${personalPlan}${performance}${medSection}<h2>Uzman görüşmesinde değerlendirilebilecek noktalar</h2><p>Belirtilerdeki değişim, günlük yaşam hedefindeki zorlanma, egzersiz ve dinlenme düzeni, güvenli teknik, düşme/yaralanma öyküsü ve kişisel programın ilerletilmesi veya kolaylaştırılması.</p><footer>İyiAdım eğitim prototipi · Veriler bu cihazda işlenerek raporlandı; bu işlem verileri otomatik olarak bir uzmana göndermez. Raporu paylaşma kararı kullanıcıya aittir.</footer></body></html>`;
    report.document.open();report.document.write(html);report.document.close();report.document.getElementById('printReport').addEventListener('click',()=>report.print());return report;
  }
  window.progressDashboard=dashboard;
  window.bindProgress=bind;
  window.printClinicalReport=printReport;
  window.IyiAdimProgress={summarize,symptomRecorded,plannedDay,latestPlan,daysBetween};
})();
