/* Educational exercise examples. Doses below are conservative prototype examples,
   not verbatim guideline prescriptions. A clinician must review suitability and progression. */
window.EXERCISE_LIBRARY = [
  {
    id: 'ankle', title: 'Oturarak ayak bileği pompalama', type: 'Hareketlilik', icon: '🦶',
    dose: 'Örnek başlangıç: her ayak 5 yavaş tekrar', frequency: 'Uygunluk varsa günlük', intensity: 'Rahat, ağrısız hareket aralığı',
    why: 'Ayağı yere yerleştirme ve yürüyüşe hazırlanma hareketini destekler.',
    steps: ['Kaymayan sağlam sandalyede, ayakların yere basacak şekilde otur.', 'Topuğunu yerde tutarak ayak ucunu kaldır, sonra indir.', 'Ayak ucun yerdeyken topuğunu hafif kaldır; sırayla tekrarla.'],
    easy: 'Her yönde daha küçük hareket ve daha az tekrar kullan.', hard: 'Yalnız uzman değerlendirmesi sonrası tekrar sayısını artır.',
    precaution: 'Yeni tek taraflı baldır ağrısı, kızarıklık veya şişlik varsa yapma; değerlendirme iste.', errors: 'Hızlı sallamak ve ağrılı aralığa zorlamak.', breathing: 'Normal nefes al, nefesini tutma.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','cardiac','copd','frailty'], sources: ['nhs-sitting']
  },
  {
    id: 'knee', title: 'Oturarak diz açma', type: 'Kuvvet', icon: '🪑',
    dose: 'Örnek başlangıç: her bacak 5 tekrar · 1 set', frequency: 'Haftada 2 ayrı gün; arada dinlenme', intensity: 'Hafif çaba, kontrollü hareket',
    why: 'Sandalyeden kalkma ve adım atmada kullanılan ön uyluk kaslarını çalıştırır.',
    steps: ['Sırtın destekli ve iki ayağın yerde olacak şekilde otur.', 'Bir dizini rahat olduğu kadar yavaşça aç, uyluğunu sandalyeden kaldırma.', 'Ayağını kontrollü indir; diğer bacakla sırayla uygula.'],
    easy: 'Dizi kısmen aç ve tekrarları azalt.', hard: 'Yalnız uzmanla tekrar veya direnç artışını planla.',
    precaution: 'Yeni ameliyat, sıcak-şiş eklem veya yeni şiddetli ağrıda önce uzmanına danış.', errors: 'Dizi hızla kilitlemek, gövdeyi geriye atmak.', breathing: 'Dizi açarken nefes ver, indirirken rahatça al.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','cardiac','copd','frailty'], sources: ['oa','who']
  },
  {
    id: 'rise', title: 'Kolçak destekli otur–kalk', type: 'Kuvvet', icon: '🪑',
    dose: 'Örnek başlangıç: 3–5 tekrar · 1 set', frequency: 'Haftada 2 ayrı gün; arada dinlenme', intensity: 'Hafif çaba, gerektiğinde mola',
    why: 'Tuvaletten ve sandalyeden güvenli kalkmaya hazırlanır.',
    steps: ['Duvara dayalı, kaymayan kolçaklı sandalyeye otur; ayaklarını sağlam bas.', 'Gövdeni kalçadan hafif öne getirip kolçaklardan gerektiği kadar destek al.', 'Yavaşça ayağa kalk; dizlerini kilitlemeden bekle ve kontrollü otur.'],
    easy: 'Daha yüksek oturma yüzeyi ve daha fazla kol desteği kullan.', hard: 'Uzman uygun görürse el desteğini kademeli azalt.',
    precaution: 'Baş dönmesi veya dizde boşalma varsa dur. Denge sorunu olanlarda yanında eğitimli destek bulunmalı.', errors: 'Sandalyeye düşer gibi oturmak veya sandalyeyi çekerek kalkmak.', breathing: 'Kalkarken nefes ver; nefesini tutma.', position: 'standing', supervised: true,
    conditions: ['oa','osteoporosis','parkinson','diabetes','hypertension','frailty'], sources: ['nhs-strength','falls']
  },
  {
    id: 'heel-raise', title: 'Destekli topuk yükseltme', type: 'Kuvvet', icon: '🦶',
    dose: 'Örnek başlangıç: 5 tekrar · 1 set', frequency: 'Haftada 2 ayrı gün', intensity: 'Hafif çaba; iki elle destek',
    why: 'Yürürken ayağın itişini ve ayakta günlük işleri destekler.',
    steps: ['Sabit tezgâh önünde dur ve iki elinle tutun.', 'İki topuğunu rahat olduğu kadar birlikte yükselt.', 'Topuklarını yavaşça yere indir; dengen bozulmadan tekrarla.'],
    easy: 'Aynı hareketi oturarak yap.', hard: 'Uzmanla tekrar sayısını artırmayı değerlendir; desteği kendiliğinden bırakma.',
    precaution: 'Ayak yarası, yeni baldır ağrısı veya belirgin dengesizlik varsa yapma.', errors: 'Öne savrulmak ve ayak bileğini dışa çevirmek.', breathing: 'Yükselirken nefes ver, inerken nefes al.', position: 'standing', supervised: true,
    conditions: ['oa','osteoporosis','parkinson','diabetes','frailty'], sources: ['nhs-strength']
  },
  {
    id: 'hip-side', title: 'Destekli yana bacak açma', type: 'Kuvvet', icon: '🌿',
    dose: 'Örnek başlangıç: her bacak 5 tekrar', frequency: 'Haftada 2 ayrı gün', intensity: 'Küçük hareket, hafif çaba',
    why: 'Yürürken kalçanın ve gövdenin dengeli kalmasını destekler.',
    steps: ['Sabit bir tezgâha iki elle tutun, gövdeni dik tut.', 'Bir bacağını ayak ucu karşıya bakarken az miktarda yana aç.', 'Gövdeni eğmeden ayağını geri getir, diğer tarafta tekrarla.'],
    easy: 'Hareket mesafesini ve tekrar sayısını azalt.', hard: 'Direnç eklemeyi yalnız uzmanla değerlendir.',
    precaution: 'Kalça protezi veya ameliyat sonrası hareket kısıtlamalarında kişisel protokol gerekir.', errors: 'Gövdeyi yana eğmek, ayağı dışa döndürmek.', breathing: 'Bacağını açarken nefes ver, dönerken al.', position: 'standing', supervised: true,
    conditions: ['oa','osteoporosis','parkinson','frailty'], sources: ['nhs-strength','oa']
  },
  {
    id: 'knee-bend', title: 'Destekli diz bükme', type: 'Kuvvet', icon: '🦵',
    dose: 'Örnek başlangıç: her bacak 5 tekrar', frequency: 'Haftada 2 ayrı gün', intensity: 'Hafif çaba, rahat hareket',
    why: 'Yürüyüşte ayağı yerden kaldıran kasların çalışmasına katkı sağlar.',
    steps: ['Sabit tezgâha iki elle tutun; dizlerin yan yana olsun.', 'Bir topuğunu geriye doğru, rahat olduğu kadar kaldır.', 'Dizini öne taşımadan ayağını yavaşça indir.'],
    easy: 'Topuğu daha az yükselt ve dinlenerek yap.', hard: 'Yalnız uzman önerirse tekrar veya direnç ekle.',
    precaution: 'Diz ameliyatı sonrası bükme sınırlarını ve eklem ağrısını dikkate al.', errors: 'Belden eğilmek, bacağı savurmak.', breathing: 'Bükerken nefes ver; nefesini tutma.', position: 'standing', supervised: true,
    conditions: ['oa','osteoporosis','frailty'], sources: ['nhs-strength']
  },
  {
    id: 'wall-press', title: 'Duvara hafif itme', type: 'Kuvvet', icon: '🤲',
    dose: 'Örnek başlangıç: 3–5 tekrar · 1 set', frequency: 'Haftada 2 ayrı gün', intensity: 'Hafif çaba, sığ hareket',
    why: 'Kapı açma ve günlük işlerde kollarla destek alma kapasitesini çalıştırır.',
    steps: ['Kaymayan zeminde duvara yakın dur, avuçlarını omuz seviyesinin altında duvara koy.', 'Dirseklerini az miktarda bükerek gövdeni bütün halinde duvara yaklaştır.', 'Duvarı hafifçe iterek başlangıca dön.'],
    easy: 'Duvara daha yakın dur ve hareketi küçült.', hard: 'Mesafe veya tekrar artışını uzmanla planla.',
    precaution: 'Omuz-bilek ağrısı, yeni göğüs ameliyatı veya kardiyak kısıtlamada uzman onayı gerekir.', errors: 'Beli çukurlaştırmak ve başı öne uzatmak.', breathing: 'İterken nefes ver; ıkınma.', position: 'standing', supervised: true,
    conditions: ['osteoporosis','hypertension','frailty'], sources: ['nhs-strength']
  },
  {
    id: 'elbow-bend', title: 'Oturarak dirsek bükme', type: 'Kuvvet', icon: '💪',
    dose: 'Örnek başlangıç: her kol 5 tekrar · ağırlıksız', frequency: 'Haftada 2 ayrı gün', intensity: 'Hafif çaba',
    why: 'Bardağı ağza götürme ve hafif nesneleri kendine yaklaştırmayı destekler.',
    steps: ['Sırtı destekli otur; üst kollarını gövdene yakın tut.', 'Dirseklerini yavaşça bükerek ellerini omuzlarına doğru getir.', 'Omuzlarını yükseltmeden kontrollü indir.'],
    easy: 'Tek kolu sırayla çalıştır ve hareketi küçült.', hard: 'Uzmanın uygun gördüğü hafif direnci kullan; kendi kendine yük artırma.',
    precaution: 'Omuz, dirsek veya el bileğinde yeni ağrı varsa dur.', errors: 'Gövdeyi sallamak ve omuzları yukarı çekmek.', breathing: 'Bükerken nefes ver, indirirken al.', position: 'seated', supervised: false,
    conditions: ['osteoporosis','hypertension','cardiac','copd','frailty'], sources: ['nhs-strength']
  },
  {
    id: 'weight-shift', title: 'Destekli ağırlık aktarma', type: 'Denge', icon: '⚖️',
    dose: 'Örnek başlangıç: her yöne 5 küçük aktarım', frequency: 'Uzman planına göre haftada 3 gün', intensity: 'Yavaş; iki el desteği korunur',
    why: 'Adım atmadan önce ağırlığı güvenle diğer bacağa taşımayı çalıştırır.',
    steps: ['Sabit tezgâha iki elle tutun, ayaklarını kalça genişliğinde yerleştir.', 'İki ayağın da yerde kalırken ağırlığını çok az sağa taşı.', 'Ortaya dön ve aynı küçük hareketi sola yap.'],
    easy: 'Aktarım mesafesini azalt ve daha sık mola ver.', hard: 'El desteği veya ayak aralığı değişikliğini yalnız fizyoterapist yönetmeli.',
    precaution: 'Düşme öyküsü veya dengesizlikte tek başına uygulanmaz.', errors: 'Ayağı yerden kaldırmak, gövdeyi ani savurmak.', breathing: 'Sakin ve kesintisiz nefes al.', position: 'standing', supervised: true,
    conditions: ['osteoporosis','parkinson','frailty'], sources: ['falls','who']
  },
  {
    id: 'side-step', title: 'Tezgâh boyunca yan adım', type: 'Denge', icon: '↔️',
    dose: 'Örnek başlangıç: her yöne 3–5 adım', frequency: 'Uzman planına göre haftada 3 gün', intensity: 'Yavaş, destekli',
    why: 'Mutfakta veya dar alanlarda yana yer değiştirme becerisini çalıştırır.',
    steps: ['Sabit tezgâha tutun, yanında yürüyüş alanı boş olsun.', 'Bir ayağını küçük bir adımla yana al.', 'Diğer ayağını çaprazlamadan yaklaştır; gerektiğinde durup dinlen.'],
    easy: 'Tek bir yan adım yapıp başlangıca dön.', hard: 'Adım sayısı artışını uzmanla belirle; çapraz adım ekleme.',
    precaution: 'Ayak takılması, baş dönmesi veya donma olursa dur ve destek al.', errors: 'Ayakları çaprazlamak, hızlanmak ve kalçayı düşürmek.', breathing: 'Rahat konuşabilecek şekilde nefes al.', position: 'walking', supervised: true,
    conditions: ['osteoporosis','parkinson','frailty'], sources: ['nhs-balance','falls']
  },
  {
    id: 'semi-tandem', title: 'Destekli kademeli ayakta duruş', type: 'Denge', icon: '👣',
    dose: 'Örnek başlangıç: her ayak önde 5 saniye · 2 kez', frequency: 'Uzman planına göre haftada 3 gün', intensity: 'İki elle destekli, kısa bekleme',
    why: 'Dar alanlarda ayakta durma kontrolünü çalıştırır.',
    steps: ['Sabit tezgâha iki elinle tutun; yanında destek sağlayacak biri bulunsun.', 'Bir ayağını diğerinin biraz önüne ve yanına koy; ayakları tek çizgiye dizme.', 'Dik durup kısa süre bekle, normal duruşa dön ve taraf değiştir.'],
    easy: 'Ayaklarını daha geniş ve birbirine daha yakın hizaya koy.', hard: 'Duruş süresi ve ayak konumunu yalnız fizyoterapist değiştirmeli.',
    precaution: 'Desteksiz yapılmaz. Sendeleme başladığında devam etme.', errors: 'Gözleri kapatmak ve desteği bırakmak.', breathing: 'Nefesini tutmadan sakin nefes al.', position: 'standing', supervised: true,
    conditions: ['osteoporosis','parkinson','frailty'], sources: ['falls','nhs-balance']
  },
  {
    id: 'toe-tap', title: 'Destekli hedefe ayak dokundurma', type: 'Denge', icon: '🎯',
    dose: 'Örnek başlangıç: her ayak 3–5 dokunuş', frequency: 'Uzman planına göre haftada 3 gün', intensity: 'Yavaş, kısa mesafe',
    why: 'Adım yerini seçme ve ayağı yerleştirme kontrolünü destekler.',
    steps: ['Sabit tezgâha iki elle tutun; düz zemine yakın bir hedef işareti koy.', 'Bir ayağının ucunu yakındaki işarete hafifçe dokundur.', 'Ayağını başlangıca getir; basamak veya engel kullanmadan taraf değiştir.'],
    easy: 'Hedefi ayağına yaklaştır ve daha az tekrar yap.', hard: 'Hedef mesafesini yalnız fizyoterapist ayarlasın.',
    precaution: 'Tek ayak üzerinde durmayı gerektirdiğinden eğitimli gözetim gerekir.', errors: 'Hedefe uzanırken gövdeyi öne düşürmek ve hızlı ayak değiştirmek.', breathing: 'Her dokunuş boyunca rahat nefes al.', position: 'standing', supervised: true,
    conditions: ['parkinson','frailty'], sources: ['falls','who']
  },
  {
    id: 'calf-seated', title: 'Oturarak ayak bileği esnetme', type: 'Esneklik', icon: '🦶',
    dose: 'Örnek başlangıç: her ayak 3 kez · 5 saniye', frequency: 'Haftada en az 2 gün, tolere edildikçe', intensity: 'Hafif gerilme; ağrı yok',
    why: 'Ayağın zemine rahat yerleşmesini ve ayakkabı kullanımını destekler.',
    steps: ['Sandalyede dik otur, bir topuğunu biraz öne yerleştir.', 'Topuğun yerdeyken ayak ucunu nazikçe kendine doğru kaldır.', 'Hafif gerilmeyi kısa süre koru, gevşe ve taraf değiştir.'],
    easy: 'Ayağı daha yakına koy, bekleme süresini azalt.', hard: 'Bekleme veya tekrar artışını uzmanla planla.',
    precaution: 'Akut baldır ağrısı veya yeni şişlikte uygulama.', errors: 'Öne kapanmak ve ayak ucunu zorla çekmek.', breathing: 'Gerilme sırasında sakin nefes al.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','frailty'], sources: ['nhs-sitting']
  },
  {
    id: 'calf-wall', title: 'Duvar destekli baldır esnetme', type: 'Esneklik', icon: '🧱',
    dose: 'Örnek başlangıç: her bacak 2 kez · 5–10 saniye', frequency: 'Haftada en az 2 gün', intensity: 'Hafif gerilme; ağrı yok',
    why: 'Ayak bileğinin yürüyüş sırasında rahat hareket etmesine yardımcı olur.',
    steps: ['İki elini duvara koy ve bir ayağını küçük bir adımla geriye al.', 'Arka topuğu yerde tutup öndeki dizi hafifçe bük.', 'Zorlamadan bekle, başlangıca dön ve diğer tarafı uygula.'],
    easy: 'Geri adımı küçült veya oturarak alternatifi kullan.', hard: 'Gerilme süresini uzmanla değerlendir; yaylanma ekleme.',
    precaution: 'Dengesizlik, ayak yarası veya yeni baldır ağrısında uygun değildir.', errors: 'Arka topuğu kaldırmak, ayakları dışa çevirmek, yaylanmak.', breathing: 'Yavaş nefes al ve ver.', position: 'standing', supervised: true,
    conditions: ['oa','osteoporosis','diabetes','frailty'], sources: ['nhs-flex']
  },
  {
    id: 'chest-open', title: 'Oturarak göğüs açma', type: 'Esneklik', icon: '🌤️',
    dose: 'Örnek başlangıç: 3 kez · 5 saniye', frequency: 'Haftada en az 2 gün', intensity: 'Hafif gerilme',
    why: 'Dik oturuş ve giyinmede gövde-omuz hareketini destekler.',
    steps: ['Sırtı destekli otur, omuzlarını rahat bırak.', 'Dirseklerin gövdeye yakınken omuzlarını hafifçe geriye ve aşağıya al.', 'Belini çukurlaştırmadan kısa süre bekle, sonra gevşe.'],
    easy: 'Kolları tamamen destekle ve hareketi küçült.', hard: 'Daha uzun beklemeyi yalnız uzmanla değerlendir.',
    precaution: 'Omuz ağrısı, omurga kırığı veya göğüs ameliyatı sonrası kişisel değerlendirme gerekir.', errors: 'Beli aşırı çukurlaştırmak ve başı geriye atmak.', breathing: 'Göğsü zorlamadan doğal nefes al.', position: 'seated', supervised: false,
    conditions: ['osteoporosis','parkinson','copd','frailty'], sources: ['nhs-sitting','osteoporosis']
  },
  {
    id: 'neck-turn', title: 'Nazik boyun çevirme', type: 'Esneklik', icon: '🌼',
    dose: 'Örnek başlangıç: her yöne 2–3 tekrar', frequency: 'Haftada en az 2 gün', intensity: 'Yalnız rahat aralıkta',
    why: 'Çevreye bakma ve otururken yönelme hareketini destekler.',
    steps: ['Sandalyede dik ve destekli otur, gözlerin karşıya baksın.', 'Başını rahat olduğu kadar yavaşça bir yana çevir.', 'Ortaya dön ve diğer tarafa tekrarla; başını tam daire çizdirme.'],
    easy: 'Çevirme aralığını azalt, beklemeden geri dön.', hard: 'Süre veya aralık artışını yalnız uzmanla planla.',
    precaution: 'Baş dönmesi, görme değişikliği, kola yayılan ağrı veya yeni boyun yaralanmasında dur.', errors: 'Başını zorla son noktaya götürmek ve omuzları kaldırmak.', breathing: 'Nefesini tutmadan sakin nefes al.', position: 'seated', supervised: false,
    conditions: ['parkinson','frailty'], sources: ['nhs-flex']
  },
  {
    id: 'wrist-mobility', title: 'El bileği ve parmak hareketleri', type: 'Hareketlilik', icon: '🖐️',
    dose: 'Örnek başlangıç: her el 5 yavaş aç–kapa', frequency: 'Uygunluk varsa günlük', intensity: 'Ağrısız, hafif hareket',
    why: 'Düğme ilikleme, çatal tutma ve küçük nesneleri kavrama hareketlerini destekler.',
    steps: ['Ön kollarını masa üzerinde destekle.', 'Parmaklarını nazikçe açıp kapat; sıkı yumruk yapma.', 'El bileğini küçük aralıkta yukarı-aşağı hareket ettir.'],
    easy: 'Tek eli sırayla çalıştır ve hareket mesafesini azalt.', hard: 'İşlevsel kavrama çalışmasını uzmanla ekle.',
    precaution: 'Yeni yaralanma, sıcak-şiş eklem veya ameliyat sonrası kısıtlamada önce uzmana danış.', errors: 'Parmakları zorla çekmek ve sert sıkmak.', breathing: 'Doğal nefes al; gereksiz kasılma yapma.', position: 'seated', supervised: false,
    conditions: ['oa','parkinson','frailty'], sources: ['who','oa']
  },
  {
    id: 'shoulder-roll', title: 'Küçük omuz gevşetme', type: 'Hareketlilik', icon: '🌿',
    dose: 'Örnek başlangıç: 3–5 küçük hareket', frequency: 'Uygunluk varsa günlük', intensity: 'Çok hafif ve ağrısız',
    why: 'Giyinme öncesi omuz kuşağını rahat hareket ettirmeye hazırlanır.',
    steps: ['Sandalyede otur, kollarını rahatça destekle.', 'Omuzlarını az miktarda yukarı ve geriye hareket ettir.', 'Gevşeterek başlangıca dön; büyük daireler çizme.'],
    easy: 'Kolları tamamen destekli tut ve yalnız gevşeme yap.', hard: 'Hareket aralığını yalnız uzman uygun görürse artır.',
    precaution: 'İnme sonrası etkilenmiş omuz veya ağrılı omuz için bu genel anlatım kullanılmaz.', errors: 'Ağrıya rağmen sürdürmek ve kolları zorla çekmek.', breathing: 'Gevşerken yavaşça nefes ver.', position: 'seated', supervised: false,
    conditions: ['parkinson','copd','frailty'], sources: ['who']
  },
  {
    id: 'march-seated', title: 'Oturarak sırayla ayak kaldırma', type: 'Hareketlilik', icon: '🪑',
    dose: 'Örnek başlangıç: her bacak 5 tekrar', frequency: 'Uygunluk varsa günlük', intensity: 'Rahat tempo ve küçük kaldırma',
    why: 'Pantolon giyme ve ayağı yerden kaldırma hareketlerine hazırlanır.',
    steps: ['Kaymayan sandalyeye otur, gerekirse yanlarından tutun.', 'Bir ayağını birkaç santimetre kaldır, kontrollü indir.', 'Diğer ayakla tekrarla; gövdeni geriye yatırma.'],
    easy: 'Ayağı kaldırmak yerine topuğu hafifçe kaydır.', hard: 'Tekrar artışını uzmanla planla.',
    precaution: 'Kalça ameliyatı sonrası kişisel hareket sınırlarını izle.', errors: 'Dizini göğse çekmek ve gövdeyi sallamak.', breathing: 'Ayağı kaldırırken nefes ver, indirirken al.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','frailty'], sources: ['nhs-sitting']
  },
  {
    id: 'walk', title: 'Kısa rahat yürüyüş', type: 'Dayanıklılık', icon: '👟',
    dose: 'Örnek başlangıç: 1–3 dakika, gerekirse bölerek', frequency: 'Uygunluk varsa günlük; kişisel plana göre', intensity: 'Rahat konuşabildiğin hafif tempo',
    why: 'Ev içinde odalar arası ve günlük ihtiyaçlara yönelik yürümeyi destekler.',
    steps: ['Düz, aydınlık ve engelsiz rota seç; verilmiş yardımcı cihazını kullan.', 'Yanında gerekli destek varken rahat tempoda yürü.', 'Belirtiler başlamadan dinlen ve dönüş için enerjini koru.'],
    easy: 'Daha kısa rota ve daha sık oturma molası kullan.', hard: 'Önce süreyi, sonra tempoyu artırmayı uzmanla planla.',
    precaution: 'Göğüs ağrısı, yeni belirgin nefes darlığı veya bayılma hissinde hemen dur. Ayak yarasında yük verme planı gerekir.', errors: 'Hız hedefi koymak, engelli alanda yürümek, yardımcı cihazı bırakmak.', breathing: 'Konuşmayı sürdürebileceğin tempoda doğal nefes al.', position: 'walking', supervised: true,
    conditions: ['oa','osteoporosis','parkinson','diabetes','hypertension','cardiac','copd','frailty'], sources: ['who','cardiac','copd']
  },
  {
    id: 'walk-interval', title: 'Dinlenmeli kısa yürüyüş', type: 'Dayanıklılık', icon: '⏱️',
    dose: 'Örnek başlangıç: 30–60 sn yürü + dinlen · 2 tur', frequency: 'Kişisel rehabilitasyon planına göre', intensity: 'Hafif, belirtiler artmadan',
    why: 'Günlük işleri kısa bölümlere ayırarak dayanıklılığı destekler.',
    steps: ['Dinlenme sandalyesi yakın olan düz bir rota seç.', 'Kısa bir süre rahat tempoda yürü, ardından oturarak toparlan.', 'Tam toparlandıysan ikinci kısa bölümü yap; tamamlamak zorunlu değildir.'],
    easy: 'Yürüme süresini kısalt ve dinlenmeyi uzat.', hard: 'Tur veya süre artışını kardiyak/pulmoner rehabilitasyon ekibi belirlemeli.',
    precaution: 'Kalp ve akciğer hastalıklarında belirtiler ve kişisel sınırlar değerlendirilmeden başlanmaz. Oksijen akışını değiştirme.', errors: 'Dinlenmeyi atlamak ve nefes darlığını zorlamak.', breathing: 'Rahat ritimde nefes al; sana öğretilmiş solunum tekniğini kullan.', position: 'walking', supervised: true,
    conditions: ['cardiac','copd','frailty'], sources: ['who','cardiac','copd']
  },
  {
    id: 'seated-endurance', title: 'Oturarak ritmik hareket molası', type: 'Dayanıklılık', icon: '🎵',
    dose: 'Örnek başlangıç: 20–30 saniye · 2 bölüm, arada dinlen', frequency: 'Uygunluk varsa günlük kısa molalar', intensity: 'Çok hafif, rahat konuşma',
    why: 'Uzun oturma süresini kısa hareketlerle bölmeye yardımcı olur.',
    steps: ['Sağlam sandalyede sırtını destekle; ayakların yere bassın.', 'Ayaklarını küçük ve sırayla kaldırıp indir veya topuklarını sırayla yükselt.', 'Kısa bölümden sonra tamamen dinlen ve iyi hissediyorsan tekrar et.'],
    easy: 'Sadece ayak bileği hareketi kullan ve bölümü kısalt.', hard: 'Hareket süresini yalnız uzmanla artır.',
    precaution: 'Yeni göğüs ağrısı, baş dönmesi veya olağandışı nefes darlığında dur.', errors: 'Çok hızlı başlamak ve gövdeyi sallamak.', breathing: 'Kesintisiz ve doğal nefes al.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','cardiac','copd','frailty'], sources: ['who','nhs-sitting']
  },
  {
    id: 'pursed-lip', title: 'Büzük dudakla nefes verme', type: 'Solunum', icon: '🌬️',
    dose: 'Örnek tanışma: 3–5 rahat nefes; zorlamadan', frequency: 'Solunum ekibinin öğrettiği plana göre', intensity: 'Sakin ve zorlamasız',
    why: 'KOAH olan bazı kişilerde hareket sonrası nefes kontrolünü destekleyebilir.',
    steps: ['Destekli otur, omuzlarını gevşet.', 'Burnundan rahat bir nefes al; derin nefes almaya zorlama.', 'Dudaklarını hafifçe büzerek nefesini yavaşça bırak, sonra doğal ritme dön.'],
    easy: 'Bir veya iki nefes dene, sonra normal solunuma dön.', hard: 'Hareketle birlikte kullanımını solunum fizyoterapistin öğretsin.',
    precaution: 'Yeni veya ciddi nefes darlığını bu teknikle tedavi etmeye çalışma; acil değerlendirme gerekebilir. Baş dönmesinde bırak.', errors: 'Nefesi tutmak, ciğerleri zorla doldurmak veya güçlü üflemek.', breathing: 'Nefes verme rahat ve alma süresinden biraz uzun olabilir; oranı zorlama.', position: 'seated', supervised: false,
    conditions: ['copd'], sources: ['copd']
  },
  {
    id: 'paced-breath', title: 'Hareketle nefesi eşleştirme', type: 'Solunum', icon: '🍃',
    dose: 'Örnek tanışma: 3 küçük hareket–nefes eşleştirmesi', frequency: 'Kişisel egzersiz planı sırasında', intensity: 'Sakin ve rahat',
    why: 'Günlük işlerde ve kuvvet hareketlerinde nefes tutmayı azaltmaya yardımcı olur.',
    steps: ['Destekli otur ve önce doğal nefes ritmini fark et.', 'Ellerini hafifçe açarken nefes ver; zorlayıcı hareket yapma.', 'Başlangıca dönerken rahatça nefes al; ritmini zorlamadan tekrar et.'],
    easy: 'Hareketi bırakıp yalnız doğal nefesi izle.', hard: 'Gerçek günlük işlere uyarlamayı uzmanla öğren.',
    precaution: 'Nefes egzersizi ilaç, oksijen veya acil tedavinin yerine geçmez.', errors: 'Zorunlu uzun nefes almak ve nefes tutmak.', breathing: 'Rahat al, zorlamadan ver; ıkınma.', position: 'seated', supervised: false,
    conditions: ['hypertension','cardiac','copd','frailty'], sources: ['who','cardiac','copd']
  },
  {
    id: 'posture', title: 'Destekli dik oturuş farkındalığı', type: 'Günlük yaşam', icon: '🌱',
    dose: 'Örnek başlangıç: 3 kez · 5–10 saniye', frequency: 'Gün içinde kısa, rahat molalar', intensity: 'Çok hafif, zorlamasız',
    why: 'Yemek yeme ve masa başı işlerde rahat oturuşu destekler.',
    steps: ['Ayakların yerde, sırtın destekli olacak şekilde yerleş.', 'Başını tavana uzatıyormuş gibi hafifçe dikleş; omuzlarını gevşet.', 'Zorlamadan kısa süre kal, sonra rahat pozisyonuna dön.'],
    easy: 'Sırt desteğini artır ve daha kısa bekle.', hard: 'Oturma süresini veya destek ihtiyacını uzmanla değerlendir.',
    precaution: 'Omurga kırığı veya yeni sırt ağrısında dikleşmeye zorlama; kişisel öneri al.', errors: 'Sırtı aşırı geriye yaylandırmak ve çeneyi kaldırmak.', breathing: 'Duruş boyunca normal nefes al.', position: 'seated', supervised: false,
    conditions: ['osteoporosis','parkinson','copd','frailty'], sources: ['osteoporosis','nhs-sitting']
  },
  {
    id: 'table-reach', title: 'Masa üzerinde kısa uzanma', type: 'Günlük yaşam', icon: '☕',
    dose: 'Örnek başlangıç: yakın hedefe her el 3 dokunuş', frequency: 'Uygunluk varsa günlük kısa çalışma', intensity: 'Hafif; gövde destekli',
    why: 'Masadaki bardak veya çatal gibi nesnelere güvenli ulaşmayı çalıştırır.',
    steps: ['Sağlam masanın önünde, ayakların yerde olacak şekilde otur.', 'Hafif bir nesneyi kol mesafesi içinde, gövdeni eğmeden erişebileceğin yere koy.', 'Elinle hedefe dokun ve başlangıca dön; sıcak veya kırılabilir eşya kullanma.'],
    easy: 'Hedefi yaklaştır ve ön kolunu masada destekle.', hard: 'Mesafeyi veya nesne kullanımını ergoterapist/fizyoterapistle ayarla.',
    precaution: 'İnme sonrası omuz etkileniminde genel anlatımı kullanma; kolu çekerek hareket ettirme.', errors: 'Hedefi çok uzağa koymak ve sandalyeden öne kaymak.', breathing: 'Uzanırken nefes ver, dönerken rahatça al.', position: 'seated', supervised: false,
    conditions: ['parkinson','frailty'], sources: ['who']
  },
  {
    id: 'turn-steps', title: 'Küçük adımlarla yön değiştirme', type: 'Günlük yaşam', icon: '↪️',
    dose: 'Örnek başlangıç: her yöne 1 kontrollü dönüş', frequency: 'Fizyoterapist planına göre', intensity: 'Yavaş; eğitimli kişi gözetiminde',
    why: 'Oda içinde dönme ve sandalyeye yaklaşma becerisini çalıştırır.',
    steps: ['Fizyoterapistin gösterdiği güvenli alanda, yardımcı cihazınla dur.', 'Ayakları yerde döndürmek yerine küçük adımlarla geniş bir yay çiz.', 'Dönüşü tamamlayınca durup dengenin yerleşmesini bekle.'],
    easy: 'Dönüş açısını küçült ve her adım arasında dur.', hard: 'Günlük ortama uyarlamayı yalnız fizyoterapistle yap.',
    precaution: 'Parkinson donması, düşme öyküsü veya belirgin dengesizlikte tek başına denenmez.', errors: 'Tek ayak üzerinde dönmek, hızlı dönmek, ayakları çaprazlamak.', breathing: 'Rahat nefes al; aynı anda başka görev ekleme.', position: 'walking', supervised: true,
    conditions: ['parkinson','frailty'], sources: ['parkinson','falls']
  },
  {
    id: 'grasp-release', title: 'Yumuşak nesneyi kavra–bırak', type: 'Günlük yaşam', icon: '🧺',
    dose: 'Örnek başlangıç: her el 3–5 tekrar', frequency: 'Kişisel rehabilitasyon planına göre', intensity: 'Çok hafif, sıkmadan',
    why: 'Yemek araçları ve hafif günlük nesneleri kullanmayı destekler.',
    steps: ['Ön kolunu masada destekle; hafif yumuşak bir bez kullan.', 'Bezi parmaklarınla hafifçe kavra, sıkmadan kısa süre tut.', 'Parmaklarını rahatça açarak bırak; gerektiğinde dinlen.'],
    easy: 'Daha büyük ve kolay kavranan hafif nesne seç.', hard: 'İşlevsel nesne ve tekrar değişimini ergoterapistle planla.',
    precaution: 'İnme sonrası spastisite, duyu kaybı veya ağrıda elin zorla açılması uygun değildir; uzman gözetimi gerekir.', errors: 'Sert sıkmak ve parmakları zorla açmak.', breathing: 'Kavrarken nefes ver, bırakırken normal nefes al.', position: 'seated', supervised: true,
    conditions: ['stroke','parkinson','oa','frailty'], sources: ['stroke','oa']
  },
  {
    id: 'stroke-slide', title: 'İnme sonrası destekli masa kaydırma', type: 'Günlük yaşam', icon: '🤝',
    dose: 'Yalnız uzmanın belirlediği aralık ve tekrar', frequency: 'Bireysel inme rehabilitasyon planına göre', intensity: 'Ağrısız; omuz tamamen korunarak',
    why: 'Etkilenen kolun masa üzerindeki işlevsel kullanımını çalıştırmak için bir örnektir.',
    steps: ['Önce fizyoterapist/ergoterapist kol ve omuz pozisyonunu değerlendirsin.', 'Gösterilen pozisyonda ön kolunu masa üzerinde tamamen destekle.', 'Yalnız öğretilen küçük aralıkta kaydır; diğer kişi kolunu elden çekmesin.'],
    easy: 'Hareket yerine uzmanın gösterdiği destekli pozisyonda kal.', hard: 'Hedef, mesafe ve tekrar değişimini yalnız rehabilitasyon ekibi yapmalı.',
    precaution: 'Ağrılı omuz, subluksasyon, duyu kaybı veya spastisite için kişisel değerlendirme olmadan uygulanmaz.', errors: 'Omzu zorla yukarı kaldırmak, koldan çekmek veya ağrıya rağmen sürdürmek.', breathing: 'Rahat nefes al; hareket için ıkınma.', position: 'seated', supervised: true,
    conditions: ['stroke'], sources: ['stroke']
  },
  {
    id: 'seated-heel-raise', title: 'Oturarak topuk yükseltme', type: 'Kuvvet', icon: '🦶',
    dose: 'Örnek başlangıç: 5 yavaş tekrar · 1 set', frequency: 'Haftada 2 ayrı gün', intensity: 'Hafif, ağırlıksız',
    why: 'Ayağın itiş hareketini ayakta durmaya gerek olmadan çalıştırır.',
    steps: ['Sırtın destekli ve ayakların yerde olacak şekilde otur.', 'Ayak uçların yerdeyken iki topuğunu rahatça yükselt.', 'Topuklarını yavaşça indir; dizlerinin üzerine ağırlık koyma.'],
    easy: 'Tek ayağı sırayla ve daha küçük aralıkta çalıştır.', hard: 'Ayakta alternatife geçmeyi yalnız uzman uygun görürse değerlendir.',
    precaution: 'Ayak yarası, yeni şişlik veya baldır ağrısında önce uzmana danış.', errors: 'Hızlı yaylanmak veya ayağın dış kenarına basmak.', breathing: 'Yükselirken nefes ver; nefesini tutma.', position: 'seated', supervised: false,
    conditions: ['oa','osteoporosis','diabetes','hypertension','cardiac','copd','frailty'], sources: ['nhs-sitting','nhs-strength']
  }
];
