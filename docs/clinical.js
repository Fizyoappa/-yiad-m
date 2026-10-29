/* Guideline-informed educational selection rules. Not a validated clinical decision system. */
window.CLINICAL_SOURCES={
 who:{title:'WHO · Physical activity and sedentary behaviour (2020)',url:'https://www.who.int/publications/i/item/9789240015128',note:'Yaşlılarda kapasiteye uyarlanmış aerobik, kuvvet ve çok bileşenli denge çalışmaları. Genel hedefler başlangıç reçetesi değildir.'},
 'nhs-strength':{title:'NHS · Strength exercises',url:'https://www.nhs.uk/live-well/exercise/strength-exercises/',note:'Sandalyeden kalkma, destekli kuvvet hareketlerinin öğretim çerçevesi.'},
 'nhs-balance':{title:'NHS · Balance exercises',url:'https://www.nhs.uk/live-well/exercise/balance-exercises/',note:'Güvenli destek ve bireye uygun denge çalışmaları.'},
 'nhs-sitting':{title:'NHS · Sitting exercises',url:'https://www.nhs.uk/live-well/exercise/sitting-exercises/',note:'Sağlam sandalyede oturarak hareket seçenekleri.'},
 'nhs-flex':{title:'NHS · Flexibility exercises',url:'https://www.nhs.uk/live-well/exercise/flexibility-exercises/',note:'Rahat aralıkta, zorlamadan esneklik çalışmaları.'},
 hypertension:{title:'AHA · Getting active to control high blood pressure',url:'https://www.heart.org/en/health-topics/high-blood-pressure/changes-you-can-make-to-manage-high-blood-pressure/getting-active-to-control-high-blood-pressure',note:'Kademeli aktivite, ısınma/soğuma ve nefes tutmadan hareket.'},
 frailty:{title:'ICFSR · Physical frailty guidelines (2019)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6800406/',note:'Kırılganlıkta direnç içeren çok bileşenli aktivite; tek bir evrensel başlangıç dozu belirlenmez.'},
 oa:{title:'NICE NG226 · Osteoarthritis (2022)',url:'https://www.nice.org.uk/guidance/ng226/chapter/Recommendations',note:'İhtiyaca göre yerel kas kuvvetlendirme ve aerobik aktivite; gerektiğinde gözetim.'},
 osteoporosis:{title:'Strong, Steady and Straight · UK consensus (2022)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9304091/',note:'Direnç, denge ve omurga dostu hareket; kırık ve yüksek riskte uzman uyarlaması.'},
 parkinson:{title:'Parkinson’s Foundation / ACSM · Exercise recommendations (2025)',url:'https://www.parkinson.org/sites/default/files/documents/Parkinsons-Exercise-Guidelines-1025.pdf',note:'Aerobik, kuvvet, denge ve esneklik; fizik tedavi değerlendirmesi ve ilaçların etkili olduğu dönem.'},
 stroke:{title:'NICE NG236 · Stroke rehabilitation (2023)',url:'https://www.nice.org.uk/guidance/ng236/chapter/Recommendations',note:'Fonksiyonel, tekrarlı görev ve fizyoterapist değerlendirmesine dayanan egzersiz.'},
 diabetes:{title:'ADA · Standards of Care in Diabetes—2026, section 5',url:'https://doi.org/10.2337/dc26-S005',note:'Aerobik/direnç aktivitesi, hipoglisemi ve komplikasyona göre önlem; aktif ayak yarasında yük vermeyen seçenekler.'},
 cardiac:{title:'AHA/ACC/HFSA · Heart failure guideline (2022)',url:'https://doi.org/10.1161/CIR.0000000000001063',note:'Uygun ve stabil hastada egzersiz ve kardiyak rehabilitasyon; bireysel klinik değerlendirme.'},
 copd:{title:'ATS · Pulmonary rehabilitation guideline (2023)',url:'https://doi.org/10.1164/rccm.202306-1066ST',note:'KOAH için pulmoner rehabilitasyon ve kişiselleştirilmiş değerlendirme.'},
 falls:{title:'NICE NG249 · Falls assessment and prevention (2025)',url:'https://www.nice.org.uk/guidance/ng249/chapter/Recommendations',note:'Düşme öyküsü ve yürüme/denge değerlendirmesi; kişiye özel, gözden geçirilen program. Uygulama geçerli bir düşme skoru üretmez.'}
};
window.CONDITIONS=[
 {id:'oa',name:'Diz / kalça osteoartriti (kireçlenme)',focus:['knee','rise','quad','hip','walk'],source:'oa',advice:'Ağrısız veya tolere edilen aralıkta yerel kuvvet ve düşük etkili hareket. Yeni şiddetli ağrı veya şişlikte dur.'},
 {id:'osteoporosis',name:'Osteoporoz / kemik erimesi',focus:['posture','heel','rise','balance'],source:'osteoporosis',advice:'Omurga hizasını koru; yüksek dereceli ve yüklü öne eğilme/dönmeyi uzmanla uyarla. Kırık öyküsünde bireysel değerlendirme gerekir.'},
 {id:'parkinson',name:'Parkinson hastalığı',focus:['march','reach','step','posture'],source:'parkinson',review:true,advice:'Fizyoterapi değerlendirmesiyle çalış. İlaçlarının etkili olduğu güvenli zamanda hareket et; donma ve denge sorununda yardım al.'},
 {id:'stroke',name:'İnme sonrası durum',focus:['stroke','reach','transfer'],source:'stroke',review:true,advice:'Fizyoterapistin belirlediği görevleri uygula; etkilenen kolu çekme veya omuzu zorlayarak kaldırma. Yanında eğitimli destek bulunmalı.'},
 {id:'diabetes',name:'Tip 2 diyabet',focus:['walk','march','heel'],source:'diabetes',advice:'Ayaklarını ve ayakkabılarını kontrol et. İnsülin / hipoglisemi riski varsa uzmanınla belirlediğin ölçüm ve müdahale planını kullan.'},
 {id:'hypertension',name:'Hipertansiyon',focus:['walk','march'],source:'hypertension',advice:'Nefes tutma ve ıkınmadan kaçın. Tansiyon hedeflerini uzmanın belirlesin; ilaçlarını değiştirme.'},
 {id:'cardiac',name:'Stabil kalp hastalığı / kalp yetersizliği',focus:['walk','breath','march'],source:'cardiac',review:true,advice:'Kardiyak değerlendirme ve kişisel aktivite planı gerekli. Göğüs ağrısı, yeni nefes darlığı veya bayılma hissinde dur.'},
 {id:'copd',name:'KOAH',focus:['breath','walk','march'],source:'copd',review:true,advice:'Pulmoner rehabilitasyon planına göre aralıklı hareket ve dinlenme. Oksijen akışını kendin değiştirme; alevlenmede değerlendirme al.'},
 {id:'frailty',name:'Kırılganlık / kas güçsüzlüğü / denge sorunu',focus:['rise','heel','knee','balance'],source:'frailty',advice:'Kısa, destekli ve çok bileşenli hareket. Düşme öyküsünde profesyonel denge ve ev güvenliği değerlendirmesi al.'},
 {id:'other',name:'Diğer tanı / yakın dönem ameliyat',focus:[],source:'who',advice:'Bu durum için otomatik seçim kapsamımız yeterli değil; bireysel egzersiz planını uzmanın belirlemeli.'}
];
window.buildClinicalPlan=function(p,screen,d,date){
 const diagnoses=Array.isArray(p.diagnoses)?p.diagnoses:[],selected=CONDITIONS.filter(c=>diagnoses.includes(c.id));
 let locks=[],notes=selected.map(c=>({text:c.advice,source:c.source}));
 if(!p.name||!p.age)locks.push('Profil bilgilerini tamamla.');
 if(p.diagnosisStatus==='unknown'||!p.diagnosisStatus)locks.push('Tanı durumunu ve egzersize uygunluğunu sağlık uzmanınla netleştir.');
 if(p.diagnosisStatus==='selected'&&!diagnoses.length)locks.push('En az bir tanı seç veya tanı durumunu düzelt.');
 if(!p.clearance)locks.push('Egzersize uygunluk için sağlık uzmanının değerlendirmesi gerekli.');
 if(p.stability!=='stable')locks.push(p.stability==='unstable'?'Yeni / kötüleşen sağlık durumunda egzersizi durdur ve değerlendirme al.':'Sağlık durumunun stabil olduğunu uzmanla netleştir.');
 if(!screen||screen.date!==date)locks.push('Bugünkü güvenlik kontrolünü tamamla.');
 if(screen?.date===date){if(screen.red)locks.push('Acil belirti bildirildi. Egzersiz yapma; Türkiye’de 112’yi ara.');if(screen.fall||screen.restrict||screen.hypo)locks.push('Günlük kontrolde risk bildirildi. Egzersiz öncesi sağlık uzmanına danış.');}
 if(d.pain>=7||d.fatigue>=7||d.breathlessness>=7)locks.push('Bugün yüksek ağrı / yorgunluk / nefes darlığı kaydı var. Egzersize ara ver ve değerlendirme al.');
 if(p.fragilityFracture&&!p.rehabReviewed)locks.push('Omurga / düşük travmalı kırık öyküsünde kişisel hareket planını uzmanın gözden geçirmeli.');
 if(p.recentFracture)locks.push('Yeni kırık / ameliyat için kişiye özel rehabilitasyon planı gerekli.');
 if(diagnoses.includes('other'))locks.push('Kapsam dışı tanı için uzmanın kişisel planı gerekli.');
 const complex=selected.some(c=>c.review);
 if(complex&&!p.rehabReviewed)locks.push('Seçtiğin kalp / akciğer / nörolojik durum için kişisel rehabilitasyon planı uzman tarafından gözden geçirilmeli.');
 if(diagnoses.includes('stroke')&&!p.supervision)locks.push('İnme sonrası hareketler için eğitimli destek / gözetim gerekli.');
 if(diagnoses.includes('diabetes')&&(p.footUlcer||p.retinopathy))locks.push('Ayak yarası / göz komplikasyonu için uygun aktiviteyi sağlık ekibin belirlemeli.');
 if(p.fallsHistory&&!p.fallsReviewed)locks.push('Son yıldaki düşme / denge sorunu için yürüme ve denge değerlendirmesi gerekli.');
 if(p.fluidRestricted)notes.push({text:'Sıvı hedefin tanıya göre artırılmaz. Uzmanının belirlediği hedefi Profilim bölümüne gir.',source:'who'});
 if(diagnoses.includes('diabetes')&&p.hypoRisk)notes.push({text:'Egzersiz ve öğün / ilaç zamanlaması için kişisel hipoglisemi planını izle. Uygulama ilaç veya karbonhidrat dozu hesaplamaz.',source:'diabetes'});
 let exclusions=[];
 let available=(window.EXERCISE_LIBRARY||[]).filter(e=>{
  let reason='';
  if(p.level==='low'&&e.position!=='seated')reason='Hareket düzeyinde oturarak seçenek öncelikli.';
  if(e.supervised&&!p.supervision)reason='Yanında güvenli destek / gözetim gerekiyor.';
  if(diagnoses.includes('diabetes')&&p.footUlcer&&e.position!=='seated')reason='Aktif ayak yarasında yük veren hareket çıkarıldı.';
  if(e.conditions.includes('stroke')&&!diagnoses.includes('stroke')&&e.id==='stroke-slide')reason='İnme sonrası özel görev.';
  if(diagnoses.includes('stroke')&&!e.conditions.includes('stroke'))reason='İnme sonrası genel hareket yerine yalnız uzman yönlendirmeli görev önizlemesi.';
  if(p.recentFracture&&e.position!=='seated')reason='Kırık / ameliyat önlemi.';
  if(reason){exclusions.push({title:e.title,reason});return false}return true;
 });
 let goalTypes=/kalkmak/.test(p.goal)?['Günlük yaşam','Kuvvet']:/yürümek/.test(p.goal)?['Dayanıklılık','Denge']:['Kuvvet','Hareketlilik','Esneklik'];
 available=available.map(e=>({e,score:selected.reduce((n,c)=>n+(e.conditions.includes(c.id)?3:0)+c.focus.filter(f=>e.id.includes(f)).length*2,0)+(goalTypes.includes(e.type)?4:0)})).sort((a,b)=>b.score-a.score).map(x=>x.e);
 let chosen=[],types=new Set();for(const e of available){if(!types.has(e.type)&&chosen.length<5){chosen.push(e);types.add(e.type)}}for(const e of available){if(chosen.length>=6)break;if(!chosen.includes(e))chosen.push(e)}
 if(p.level==='low')chosen=chosen.slice(0,4);
 const reduced=d.pain>=4||d.fatigue>=4||d.breathlessness>=4;
 if(reduced){chosen=chosen.filter(e=>e.position==='seated').slice(0,3);notes.push({text:'Belirti kaydına göre oturarak, daha kısa seçenekler önceliklendirildi. Bu eşikler uygulamanın ihtiyatlı tasarım kuralıdır; doğrulanmış klinik karar eşiği değildir.',source:'who'});}
 if(!chosen.length)locks.push('Bu bilgilerle uygun başlangıç seçeneği bulunamadı. Uzmanınla plan oluştur.');
 return {selected,locks:[...new Set(locks)],notes,available,chosen,exclusions,reduced,reason:`${selected.length?selected.map(c=>c.name).join(' + '):'Genel hareket'}; ${p.level==='low'?'oturarak başlangıç':'bağımsız hareket düzeyi'}; hedef: ${p.goal}. Gözetim ve güvenlik kısıtları önce uygulanır, hedef ve tanı uygunluğu sıralamayı değiştirir.`};
};
