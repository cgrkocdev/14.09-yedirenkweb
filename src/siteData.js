export const menuGroups = [
  {
    label: "Kurumsal",
    path: "/kurumsal/hakkimizda",
    intro:
      "Yedirenk’in değerlerini, yönetim anlayışını ve şeffaflık yaklaşımını keşfedin.",
    items: [
      ["Biz Kimiz?", "/kurumsal/hakkimizda"],
      ["Başkanın Mesajı", "/kurumsal/yonetim-kurulu-mesaji"],
      ["Kurumsal Kimlik", "/kurumsal/kurumsal-kimlik"],
      ["Tüzük", "/kurumsal/tuzuk"],
      ["KVKK", "/kurumsal/kvkk"],
    ],
  },
  {
    label: "Faaliyetler",
    path: "/calismalarimiz",
    intro:
      "Eğitim, kültür ve yardımlaşmayı sahada sürdürülebilir projelere dönüştürüyoruz.",
    items: [
      ["Eğitim", "/calismalarimiz/egitim"],
      ["Kültür", "/calismalarimiz/kultur"],
      ["Yardımlaşma", "/calismalarimiz/yardimlasma"],
    ],
  },
  {
    label: "Neler Yapabilirsiniz",
    path: "/katil",
    intro:
      "Bağışın, zamanın veya uzmanlığınla iyilik hareketine katılmanın yolunu seç.",
    items: [
      ["Bağış Yap", "/projeler"],
      ["Sponsor Ol", "/katil/sponsor-ol"],
      ["Su Kuyusu Açtır", "/katil/su-kuyusu"],
      ["Uygulamamızı İndir", "/katil/mobil-uygulama"],
      ["Gönüllü Ol", "/katil/gonullu-ol"],
      ["Bültene Katıl", "/katil/bulten"],
      ["Bağışçı ve Sponsor Girişi", "/giris"],
      ["Gönüllü Girişi", "/giris?tip=gonullu"],
      ["İnsan Kaynakları", "/kurumsal/insan-kaynaklari"],
    ],
  },
];

const page = (title, category, summary, accent = "teal") => ({
  title,
  category,
  summary,
  accent,
});

export const pageContent = {
  "/kurumsal/hakkimizda": page(
    "Biz Kimiz?",
    "Kurumsal",
    "İnsanı, bilgiyi, kültürü ve iyiliği temel değerleri kabul eden; samimiyetle çalışan bir dayanışma hareketiyiz.",
  ),
  "/kurumsal/yonetim-kurulu-mesaji": page(
    "Başkanın Mesajı",
    "Kurumsal",
    "İyiliği özenle ve güvenle büyütme yolculuğumuza yön veren anlayışımızı ve geleceğe dair hedeflerimizi paylaşıyoruz.",
  ),
  "/kurumsal/kurumsal-kimlik": page(
    "Kurumsal Kimlik",
    "Kurumsal",
    "Yedirenk’in logo, renk, tipografi ve kurumsal kullanım standartlarına buradan ulaşabilirsiniz.",
  ),
  "/kurumsal/tuzuk": page(
    "Tüzük",
    "Kurumsal",
    "Yedirenk Derneği’nin amaçlarını, faaliyet alanlarını, üyelik esaslarını ve yönetim yapısını belirleyen resmi kuruluş belgesidir.",
  ),
  "/kurumsal/kvkk": page(
    "Kişisel Verilerin Korunması",
    "Kurumsal",
    "Yedirenk Derneği’nin kişisel veri işleme süreçlerine ilişkin bilgilendirme metinlerine, haklarınıza ve başvuru kanallarına bu alandan ulaşabilirsiniz.",
  ),
  "/kurumsal/cerez-politikasi": page(
    "Çerez Politikası",
    "Yasal",
    "Web sitemizde kullanılan çerezlerin amaçları, türleri ve tercihlerinizi nasıl yönetebileceğiniz hakkında bilgilendirme.",
  ),
  "/kurumsal/ilham-kaynagimiz": page(
    "İlham Kaynağımız",
    "Biz Kimiz",
    "Yedirenk’in iyilik anlayışına yön veren değerleri, sembolleri ve ortak sorumluluk düşüncesi.",
  ),
  "/kurumsal/yetkili-kurullar": page(
    "Yetkili Kurullar",
    "Kurumsal Yapı",
    "Üstlenilen sorumluluğu ortak akıl, hesap verebilirlik ve etkin denetimle taşıyoruz.",
  ),
  "/kurumsal/dernek-tuzugu": page(
    "Dernek Tüzüğü",
    "Kurumsal Belgeler",
    "Yedirenk’in amaçlarını, çalışma esaslarını ve yönetim yapısını belirleyen temel belge.",
  ),
  "/kurumsal/denetim": page(
    "Denetim",
    "Şeffaflık",
    "Kaynaklarımızın amacı doğrultusunda, ölçülebilir ve denetlenebilir biçimde kullanılmasını esas alıyoruz.",
  ),
  "/kurumsal/etik-degerler": page(
    "Etik Değerler",
    "Kurumsal",
    "İnsan onuru, tarafsızlık, mahremiyet, adalet ve güven tüm çalışmalarımıza yön verir.",
  ),
  "/kurumsal/uyum-ve-risk": page(
    "Uyum ve Risk",
    "Şeffaflık",
    "Faaliyetlerimizi mevzuata uygun ve riskleri önceden yöneten bir kurumsal çerçevede yürütüyoruz.",
  ),
  "/kurumsal/basin-odasi": page(
    "Basın Odası",
    "Medya",
    "Yedirenk’in güncel duyuruları, kurumsal görselleri ve basın iletişim kaynakları.",
  ),
  "/kurumsal/insan-kaynaklari": page(
    "İnsan Kaynakları",
    "Kariyer",
    "İyiliği mesleki yetkinlikle buluşturmak isteyen ekip arkadaşlarımızı arıyoruz.",
  ),
  "/kurumsal/bilgi-guvenligi": page(
    "Bilgi Güvenliği Politikası",
    "Yasal",
    "Bilginin gizliliğini, bütünlüğünü ve erişilebilirliğini korumayı taahhüt ediyoruz.",
  ),
  "/kurumsal/yolsuzlukla-mucadele": page(
    "Yolsuzluk ve Rüşvetle Mücadele",
    "Etik",
    "Her türlü yolsuzluk ve çıkar çatışmasına karşı sıfır tolerans yaklaşımını benimsiyoruz.",
  ),
  "/kurumsal/bagisci-haklari": page(
    "Bağışçı Hakları",
    "Bağışçı İlişkileri",
    "Bağışçılarımızın bilgi edinme, mahremiyet ve şeffaf raporlama haklarını güvence altına alıyoruz.",
  ),
  "/kurumsal/vergi-muafiyeti": page(
    "Vergi Muafiyeti",
    "Kurumsal Belgeler",
    "Derneğin güncel hukuki ve mali statüsüne ilişkin belgeler bu alanda yayımlanacaktır.",
  ),
  "/kurumsal/mali-tablolar": page(
    "Mali Tablolar",
    "Şeffaflık",
    "Gelir, gider ve proje bazlı kaynak kullanımını anlaşılır raporlarla paylaşmayı hedefliyoruz.",
  ),
  "/kurumsal/bagimsiz-denetim": page(
    "Bağımsız Denetim Raporu",
    "Şeffaflık",
    "Bağımsız denetim raporları tamamlandıkça kamuoyuyla bu sayfada paylaşılacaktır.",
  ),
  "/calismalarimiz": page(
    "Çalışmalarımız",
    "Çalışmalarımız",
    "Eğitim, kültür, insani yardım ve dayanışma alanlarında kalıcı etki üretiyoruz.",
    "orange",
  ),
  "/calismalarimiz/egitim": page(
    "Eğitim",
    "Faaliyetler",
    "Bilgiyi paylaşan, çocukların ve gençlerin gelişimini destekleyen eğitim çalışmaları yürütüyoruz.",
    "orange",
  ),
  "/calismalarimiz/kultur": page(
    "Kültür",
    "Faaliyetler",
    "Kültürel değerleri yaşatan, ortak hafızayı ve toplumsal bağı güçlendiren çalışmalar yürütüyoruz.",
    "orange",
  ),
  "/calismalarimiz/yardimlasma": page(
    "Yardımlaşma",
    "Faaliyetler",
    "İhtiyaç sahipleriyle dayanışmayı güçlendiren, insan onurunu gözeten yardım çalışmaları yürütüyoruz.",
    "orange",
  ),
  "/calismalarimiz/filistin-gazze": page(
    "Filistin / Gazze",
    "Gazze Yardım",
    "Gıda, sağlık, barınma ve eğitim ihtiyaçlarına yönelik sürdürülebilir yardım çalışmaları.",
    "orange",
  ),
  "/calismalarimiz/katarakt": page(
    "Katarakt",
    "Sağlık",
    "Önlenebilir görme kayıplarına karşı muayene ve ameliyat destekleri.",
    "orange",
  ),
  "/calismalarimiz/yetim": page(
    "Yetim",
    "Çocuk",
    "Yetim çocukların eğitim, sağlık ve sosyal gelişimini düzenli olarak destekliyoruz.",
    "orange",
  ),
  "/calismalarimiz/suriye": page(
    "Suriye",
    "Bölgesel Çalışmalar",
    "Savaştan etkilenen aileler için insani yardım ve eğitim programları.",
    "orange",
  ),
  "/calismalarimiz/su": page(
    "Su",
    "Su Kuyusu",
    "Temiz suya erişimin kısıtlı olduğu bölgelerde sürdürülebilir su çözümleri.",
    "orange",
  ),
  "/calismalarimiz/mavi-marmara": page(
    "Mavi Marmara",
    "İnsani Hafıza",
    "İnsani yardım tarihinin önemli dönüm noktalarından biri hakkında bilgi ve farkındalık çalışmaları.",
    "orange",
  ),
  "/calismalarimiz/insani-yardim": page(
    "İnsani Yardım",
    "Yardımlaşma",
    "İhtiyacı yerinde tespit ediyor, bağışı insan onurunu gözeterek ulaştırıyoruz.",
    "orange",
  ),
  "/calismalarimiz/insan-haklari": page(
    "İnsan Hakları",
    "Savunuculuk",
    "İnsan onurunu ve temel hakları koruyan farkındalık ve savunuculuk çalışmaları.",
    "orange",
  ),
  "/calismalarimiz/insani-diplomasi": page(
    "İnsani Diplomasi",
    "Savunuculuk",
    "Krizlerin çözümünde diyalog, arabuluculuk ve insani erişim için çalışıyoruz.",
    "orange",
  ),
  "/calismalarimiz/acil-yardim": page(
    "Afet ve Kriz Yardımı",
    "Afet ve Kriz",
    "Afet ve kriz anlarında hızlı değerlendirme, koordinasyon ve yardım ulaştırma.",
    "orange",
  ),
  "/calismalarimiz/arama-kurtarma": page(
    "Arama Kurtarma",
    "Afet Yönetimi",
    "Eğitimli ekipler ve doğru ekipmanla afetlere hazırlık kapasitesi oluşturuyoruz.",
    "orange",
  ),
  "/calismalarimiz/gonullu-calismalar": page(
    "Gönüllü Çalışmalar",
    "Gönüllülük",
    "Gönüllülerimizin yeteneklerini sahadaki gerçek ihtiyaçlarla buluşturuyoruz.",
    "orange",
  ),
  "/calismalarimiz/farkindalik": page(
    "Farkındalık Çalışmaları",
    "Eğitim",
    "Toplumsal sorumluluk ve dayanışma bilincini güçlendiren etkinlikler düzenliyoruz.",
    "orange",
  ),
  "/katil": page(
    "Ne Yapabilirsin?",
    "İyiliğe Katıl",
    "Bağışın, zamanın, uzmanlığın ya da kurumunla Yedirenk’e katkı sağlayabilirsin.",
  ),
  "/katil/sponsor-ol": page(
    "Sponsor Ol",
    "Kurumsal İş Birliği",
    "Sosyal etki hedeflerinize uygun, ölçülebilir ve şeffaf bir proje ortaklığı kuralım.",
  ),
  "/katil/su-kuyusu": page(
    "Su Kuyusu Açtır",
    "Su Kuyusu",
    "Bir topluluğun temiz suya sürdürülebilir biçimde erişmesine destek olun.",
  ),
  "/katil/mobil-uygulama": page(
    "Mobil Uygulama",
    "Dijital Yedirenk",
    "Bağış, gönüllülük ve faaliyet takibini tek yerde buluşturan uygulamamız hazırlanıyor.",
  ),
  "/katil/gonullu-ol": page(
    "Gönüllü Ol",
    "Aramıza Katıl",
    "Yeteneğini ve zamanını iyilik için paylaş; sana uygun gönüllülük alanını birlikte bulalım.",
  ),
  "/katil/bulten": page(
    "Bültene Katıl",
    "Haberdar Ol",
    "Yedirenk’in çalışmalarından ve gönüllülük çağrılarından düzenli haberdar olun.",
  ),
  "/hesap-numaralari": page(
    "Hesap Numaraları",
    "Bağış",
    "Yedirenk Derneği’nin Ziraat Bankası Türk lirası, Amerikan doları ve euro hesap bilgileri.",
  ),
  "/zekat-hesapla": page(
    "Zekât Hesaplama",
    "Hesaplama Aracı",
    "Zekâta tabi varlıklarınızı girerek yaklaşık zekât tutarınızı hesaplayın.",
  ),
  "/iletisim": page(
    "İletişim ve Destek",
    "Bize Ulaşın",
    "Sorularınız, önerileriniz ve iş birliği talepleriniz için bizimle iletişime geçin.",
  ),
  "/haberler": page(
    "Haberler",
    "Yedirenk’ten",
    "Faaliyetlerimiz, saha gelişmeleri ve güncel duyurular.",
  ),
  "/projeler": page(
    "Projeler",
    "Kalıcı İyilik",
    "Eğitimden kültüre ve yardımlaşmaya kadar desteğinizi bekleyen projeler.",
  ),
  "/yayinlar": page(
    "Yayınlarımız",
    "Bilgi ve Şeffaflık",
    "Faaliyet raporları, rehberler ve araştırmalar.",
  ),
  "/arama": page(
    "Arama Sonuçları",
    "Site İçi Arama",
    "Yedirenk’in çalışma alanları, kurumsal sayfaları, haberleri ve projeleri içinde arama yapın.",
  ),
};

export const programDetails = {
  "/calismalarimiz/filistin-gazze": {
    lead: "Hayatın devam edebilmesi için acil ihtiyaçları, çocukların yarını için kalıcı desteği birlikte ulaştırıyoruz.",
    image: "/assets/program-gaza.webp",
    focus: [
      [
        "Gıda Güvencesi",
        "Ailelerin temel beslenme ihtiyacına uygun gıda ve sıcak yemek desteği.",
      ],
      [
        "Sağlık Desteği",
        "İlaç, tıbbi sarf malzemesi ve temel sağlık hizmetlerine erişim.",
      ],
      [
        "Barınma",
        "Yerinden edilmiş aileler için geçici barınma ve temel yaşam malzemeleri.",
      ],
      [
        "Çocuk ve Eğitim",
        "Eğitim materyali, güvenli öğrenme alanı ve psikososyal destek.",
      ],
    ],
    steps: [
      "İhtiyaç ve erişim doğrulaması",
      "Yerel paydaşlarla tedarik",
      "Hane bazlı güvenli dağıtım",
      "Teslim ve etki raporlaması",
    ],
    callout:
      "Gazze için desteğiniz; gıda, sağlık, barınma ve eğitim çalışmalarında güncel ihtiyaç önceliğine göre değerlendirilir.",
  },
  "/calismalarimiz/yetim": {
    lead: "Bir çocuğun yalnızca bugünkü ihtiyacını değil, güvenle büyüyebileceği bütün bir geleceği destekliyoruz.",
    image: "/assets/program-orphan.webp",
    focus: [
      [
        "Düzenli Sponsorluk",
        "Eğitim, sağlık, giyim ve temel yaşam ihtiyaçlarına düzenli katkı.",
      ],
      [
        "Eğitim Takibi",
        "Okul devamlılığı, kırtasiye, rehberlik ve gelişim desteği.",
      ],
      [
        "Aile Güçlendirme",
        "Çocuğun kendi ailesi ve sosyal çevresi içinde desteklenmesi.",
      ],
      [
        "Sosyal Gelişim",
        "Atölyeler, kültür programları ve güvenli çocuk etkinlikleri.",
      ],
    ],
    steps: [
      "Çocuk ve aile durum tespiti",
      "Koruma odaklı değerlendirme",
      "Düzenli destek planı",
      "Gelişim ve eğitim takibi",
    ],
    callout:
      "Yetim sponsorluğu bir kerelik yardım değil; çocuğun eğitim ve gelişimini düzenli takip eden uzun soluklu bir destek programıdır.",
  },
  "/calismalarimiz/katarakt": {
    lead: "Kısa süren bir operasyonun, bir insanın bağımsızlığına ve ailesine yeniden kavuşmasına vesile olmasını sağlıyoruz.",
    image: "/assets/program-cataract.webp",
    focus: [
      [
        "Saha Taraması",
        "Görme kaybı yaşayan kişilerin uzman ekiplerce belirlenmesi.",
      ],
      [
        "Uzman Muayene",
        "Ameliyat uygunluğu ve eşlik eden sağlık risklerinin değerlendirilmesi.",
      ],
      ["Cerrahi Destek", "Operasyon, ilaç ve gerekli tıbbi malzeme desteği."],
      ["Kontrol Süreci", "Ameliyat sonrası kontrol ve iyileşme takibi."],
    ],
    steps: [
      "Hasta başvurusu ve tarama",
      "Uzman hekim değerlendirmesi",
      "Güvenli ameliyat süreci",
      "Ameliyat sonrası kontrol",
    ],
    callout:
      "Katarakt desteği; muayene, operasyon ve takip sürecini kapsayan bütüncül bir sağlık çalışmasıdır.",
  },
  "/calismalarimiz/suriye": {
    lead: "Uzun süreli krizin etkilediği ailelerin temel ihtiyaçlarını karşılarken eğitim ve sosyal uyumu da güçlendiriyoruz.",
    image: "/assets/program-syria.webp",
    focus: [
      ["Temel İhtiyaç", "Gıda, hijyen, giyim ve mevsimlik yardım programları."],
      ["Eğitim", "Okul materyali, öğrenme desteği ve çocuk atölyeleri."],
      [
        "Geçim Desteği",
        "Ailelerin kendi gelirlerini oluşturmasına yardımcı olan araçlar.",
      ],
      [
        "Sosyal Uyum",
        "Çocuklar, gençler ve aileler için ortak yaşam programları.",
      ],
    ],
    steps: [
      "Bölgesel ihtiyaç analizi",
      "Hane ve kurum doğrulaması",
      "Program bazlı uygulama",
      "Dönemsel izleme",
    ],
    callout:
      "Suriye çalışmalarımız acil yardımla sınırlı değildir; ailelerin yeniden güçlenmesini hedefleyen programları kapsar.",
  },
  "/calismalarimiz/su": {
    lead: "Temiz suya erişimi yalnızca bir yapı projesi değil; sağlık, eğitim ve güvenli yaşamın başlangıcı olarak görüyoruz.",
    image: "/assets/program-water.webp",
    focus: [
      [
        "Su Kuyusu",
        "Jeolojik koşullara uygun, güvenli ve erişilebilir kuyu projeleri.",
      ],
      [
        "Şebeke ve Depolama",
        "İhtiyaca göre depo, pompa ve yerel dağıtım çözümleri.",
      ],
      [
        "Su Kalitesi",
        "Açılış öncesi analiz ve düzenli kalite kontrol yaklaşımı.",
      ],
      [
        "Yerel Sürdürülebilirlik",
        "Bakım sorumluluğu ve yerel kullanıcı komitesi oluşturulması.",
      ],
    ],
    steps: [
      "Bölge ve zemin etüdü",
      "Teknik proje ve tedarik",
      "İnşa ve su analizi",
      "Teslim, eğitim ve bakım takibi",
    ],
    callout:
      "Her su projesi coğrafyanın teknik şartlarına göre ayrı planlanır; açılış sonrası sürdürülebilirlik gözetilir.",
  },
  "/calismalarimiz/insani-yardim": {
    lead: "Bağışı doğru kişiye, doğru zamanda ve insan onurunu koruyan bir yöntemle ulaştırıyoruz.",
    image: "/assets/program-humanitarian.webp",
    focus: [
      ["Gıda", "İhtiyaca ve yerel beslenme alışkanlıklarına uygun destek."],
      ["Barınma", "Temel ev eşyası, kira ve geçici barınma çözümleri."],
      ["Sağlık", "İlaç, tedavi, medikal malzeme ve erişim desteği."],
      ["Geçim", "Ailelerin yeniden kendi ayakları üzerinde durmasına katkı."],
    ],
    steps: [
      "Başvuru ve saha tespiti",
      "İhtiyaç önceliklendirme",
      "Teslim veya hizmet sağlama",
      "Kayıt ve geri bildirim",
    ],
    callout:
      "Yardım alan her kişi değerlidir; bütün süreç mahremiyet ve insan onuru esasıyla yürütülür.",
  },
  "/calismalarimiz/insan-haklari": {
    lead: "İnsan onurunun korunması için ihlalleri görünür kılıyor, bilgi üretiyor ve dayanışma zemini oluşturuyoruz.",
    image: "/assets/program-rights.webp",
    focus: [
      [
        "İzleme",
        "Hak ihlallerine ilişkin doğrulanabilir bilgi ve saha gözlemi.",
      ],
      ["Raporlama", "Bulguları anlaşılır ve sorumlu yayınlara dönüştürme."],
      [
        "Farkındalık",
        "Toplumun farklı kesimlerine yönelik eğitim ve etkinlikler.",
      ],
      ["Dayanışma", "Hak temelli çalışan kurum ve uzmanlarla iş birliği."],
    ],
    steps: [
      "Bilgi toplama",
      "Kaynak doğrulama",
      "Etik değerlendirme",
      "Rapor ve savunuculuk",
    ],
    callout:
      "Hak temelli çalışmalarımızda doğruluk, zarar vermeme, mahremiyet ve tarafsızlık ilkeleri esastır.",
  },
  "/calismalarimiz/insani-diplomasi": {
    lead: "İnsani erişimin zorlaştığı durumlarda diyaloğu, ortak zemini ve çözüm odaklı iletişimi güçlendiriyoruz.",
    image: "/assets/program-diplomacy.webp",
    focus: [
      [
        "İnsani Erişim",
        "Yardıma ihtiyaç duyan topluluklara güvenli erişim için temas.",
      ],
      [
        "Diyalog",
        "Farklı taraflar arasında insani meseleler için iletişim zemini.",
      ],
      [
        "Arabuluculuk Desteği",
        "Uzmanlık ve yerel bilgiyle çözüm süreçlerine katkı.",
      ],
      [
        "Bilgi Paylaşımı",
        "Sahadan doğrulanmış insani ihtiyaçların karar alıcılara aktarılması.",
      ],
    ],
    steps: [
      "Paydaş ve sorun analizi",
      "Güvenli temas kurulması",
      "İnsani çözüm zemini",
      "Takip ve değerlendirme",
    ],
    callout:
      "İnsani diplomasi siyasi pozisyon değil; hayatı ve insan onurunu koruyan çözüm alanı oluşturma çabasıdır.",
  },
  "/calismalarimiz/acil-yardim": {
    lead: "Afet ve kriz anlarında hızlı hareket ederken güvenliği, koordinasyonu ve doğru ihtiyaç tespitini önceliklendiriyoruz.",
    image: "/assets/program-emergency.webp",
    focus: [
      [
        "Hızlı Değerlendirme",
        "Afetin etkisi, erişim durumu ve öncelikli ihtiyaçların tespiti.",
      ],
      ["Temel Yaşam Desteği", "Gıda, su, hijyen, barınma ve koruyucu malzeme."],
      ["Lojistik", "Tedarik, depolama ve güvenli dağıtım organizasyonu."],
      ["İyileşme", "Acil dönem sonrasında eğitim ve geçim odaklı destek."],
    ],
    steps: [
      "Alarm ve ekip aktivasyonu",
      "Saha değerlendirmesi",
      "Koordineli yardım ulaştırma",
      "İyileşme planına geçiş",
    ],
    callout:
      "Acil yardım fonu, meydana gelen krizin doğrulanmış ve en öncelikli ihtiyaçlarında kullanılmak üzere hazır tutulur.",
  },
  "/calismalarimiz/arama-kurtarma": {
    lead: "Afetlere hazırlığı yalnızca ekipman değil; eğitim, disiplin ve düzenli tatbikatla oluşan bir kapasite olarak görüyoruz.",
    image: "/assets/program-rescue.webp",
    focus: [
      [
        "Ekip Eğitimi",
        "Temel afet bilinci, saha güvenliği ve arama kurtarma becerileri.",
      ],
      [
        "Tatbikat",
        "Gerçek senaryolara dayalı düzenli ekip ve koordinasyon çalışmaları.",
      ],
      ["Ekipman", "Göreve uygun, kayıtlı ve bakımı düzenli teknik malzeme."],
      [
        "Toplum Hazırlığı",
        "Aile ve kurumlar için afet öncesi hazırlık eğitimleri.",
      ],
    ],
    steps: [
      "Gönüllü seçimi",
      "Temel ve ileri eğitim",
      "Tatbikat ve yeterlilik",
      "Görev ve performans takibi",
    ],
    callout:
      "Arama kurtarma gönüllülüğü düzenli eğitim, sağlık uygunluğu ve ekip disiplinine uzun vadeli bağlılık gerektirir.",
  },
  "/calismalarimiz/gonullu-calismalar": {
    lead: "Her gönüllünün yeteneğini, zamanını ve ilgisini sahadaki gerçek bir ihtiyaçla buluşturuyoruz.",
    image: "/assets/program-volunteer.webp",
    focus: [
      [
        "Saha Gönüllülüğü",
        "Dağıtım, etkinlik ve proje uygulamalarında görev alma.",
      ],
      [
        "Uzman Gönüllülük",
        "Mesleki bilgiyle eğitim, hukuk, iletişim veya teknik destek.",
      ],
      [
        "Dijital Gönüllülük",
        "İçerik, tasarım, çeviri ve uzaktan çalışma desteği.",
      ],
      [
        "Genç Gönüllülük",
        "Gençlerin sosyal sorumluluk ve proje üretme kapasitesini geliştirme.",
      ],
    ],
    steps: [
      "Başvuru ve yetenek eşleştirme",
      "Oryantasyon",
      "Görev ve ekip ataması",
      "Geri bildirim ve gelişim",
    ],
    callout:
      "Gönüllülük yalnızca destek olmak değil; temsil edilen değerleri koruma sorumluluğudur.",
  },
  "/calismalarimiz/farkindalik": {
    lead: "İyiliğin kalıcı olması için yalnızca yardım ulaştırmıyor; toplumsal sorumluluk ve dayanışma bilincini güçlendiriyoruz.",
    image: "/assets/program-awareness.webp",
    focus: [
      [
        "Okul Programları",
        "Çocuk ve gençler için yaşa uygun sosyal sorumluluk etkinlikleri.",
      ],
      [
        "Atölyeler",
        "Kültür, dayanışma, çevre ve insan hakları temalı buluşmalar.",
      ],
      [
        "Kampanyalar",
        "Toplumsal meseleleri görünür kılan yaratıcı iletişim çalışmaları.",
      ],
      [
        "Yayınlar",
        "Bilgiyi erişilebilir kılan rehber, rapor ve dijital içerikler.",
      ],
    ],
    steps: [
      "Konu ve hedef kitle analizi",
      "Uzman içerik geliştirme",
      "Program uygulaması",
      "Katılım ve etki ölçümü",
    ],
    callout:
      "Farkındalık çalışmaları bilgiyi davranışa, davranışı ortak iyilik kültürüne dönüştürmeyi hedefler.",
  },
  "/calismalarimiz/mavi-marmara": {
    lead: "İnsani yardım hafızasını, tanıklıkları ve dayanışma bilincini gelecek nesillere doğru kaynaklarla aktarıyoruz.",
    image: "/assets/program-mavi.webp",
    focus: [
      [
        "Hafıza",
        "İnsani yardım tarihine ilişkin güvenilir belge ve tanıklıkların korunması.",
      ],
      [
        "Eğitim",
        "Gençler için insan hakları ve insani yardım odaklı programlar.",
      ],
      [
        "Yayın",
        "Araştırma, söyleşi ve arşiv içeriklerinin erişilebilir hale getirilmesi.",
      ],
      [
        "Farkındalık",
        "İnsanlık onuru ve insani erişim üzerine kamusal etkinlikler.",
      ],
    ],
    steps: [
      "Kaynak ve tanıklık toplama",
      "Akademik ve etik inceleme",
      "İçerik üretimi",
      "Eğitim ve paylaşım",
    ],
    callout:
      "Bu alan, tarihsel hafızayı Yedirenk’in eğitim ve insan hakları yaklaşımıyla ele alan bir farkındalık çalışmasıdır.",
  },
};
