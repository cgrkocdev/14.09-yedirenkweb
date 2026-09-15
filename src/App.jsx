import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Beef,
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleUserRound,
  Copy,
  Droplets,
  Download,
  Facebook,
  FileText,
  Globe2,
  HandHeart,
  HeartHandshake,
  House,
  Instagram,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Minus,
  LoaderCircle,
  PackageCheck,
  Pause,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  UtensilsCrossed,
  UsersRound,
  Volume2,
  VolumeX,
  Wheat,
  X,
  Youtube,
} from "lucide-react";
import { CmsProvider, useCms } from "./cms";
import { pageContent } from "./siteData";
import {
  createMetaEventId,
  track,
  trackMetaDonationStart,
  trackMetaInitiateCheckout,
  trackMetaPageView,
} from "./analytics";
import generatedTranslations from "./translations.generated.json";
import statuteText from "./content/yedirenk-tuzugu.txt?raw";
import kvkkText from "./content/yedirenk-kvkk.txt?raw";
import cookiePolicyText from "./content/legal/cerez-politikasi.txt?raw";
import donationRefundText from "./content/legal/bagis-iptal-iade.txt?raw";
import distanceSalesText from "./content/legal/mesafeli-satis-on-bilgilendirme.txt?raw";
import usageTermsText from "./content/legal/kullanim-kosullari-iletisim.txt?raw";
import activityCertificateText from "./content/legal/faaliyet-belgesi.txt?raw";

const AdminPanel = lazy(() => import("./AdminPanel"));

const socialMediaLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/yedirenkdernegi/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61593270698708#",
    icon: Facebook,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCI-22JZLJyb3WqJ4QLTkTZA",
    icon: Youtube,
  },
  {
    label: "X",
    href: "https://x.com/yedirenkdernek?s=11",
    icon: X,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/yedirenk-derne%C4%9Fi?trk=blended-typeahead",
    icon: Linkedin,
  },
];

const legalDocuments = [
  {
    label: "Gizlilik Politikası ve KVKK",
    path: "/kurumsal/kvkk",
  },
  {
    label: "Çerez Politikası",
    path: "/belgeler/cerez-politikasi",
  },
  {
    label: "Bağış İptal ve İade Politikası",
    path: "/belgeler/bagis-iptal-iade",
  },
  {
    label: "Mesafeli Satış Ön Bilgilendirme",
    path: "/belgeler/mesafeli-satis-on-bilgilendirme",
  },
  {
    label: "Kullanım Koşulları ve İletişim",
    path: "/belgeler/kullanim-kosullari-iletisim",
  },
  {
    label: "Dernek Faaliyet Belgesi",
    path: "/belgeler/faaliyet-belgesi",
  },
];

const legalDocumentPages = {
  "cerez-politikasi": {
    title: "Çerez Politikası ve Çerez Envanteri",
    lead: "Web sitesi ziyaretçileri için",
    text: cookiePolicyText,
  },
  "bagis-iptal-iade": {
    title: "Bağış İptal ve İade Politikası",
    lead: "Hatalı, mükerrer, yetkisiz veya teknik sorunlu işlemler için",
    text: donationRefundText,
  },
  "mesafeli-satis-on-bilgilendirme": {
    title: "Mesafeli Satış Ön Bilgilendirme Formu",
    lead: "Ürün veya hizmet satışı yapılacaksa kullanılacak bilgilendirme metni",
    text: distanceSalesText,
  },
  "kullanim-kosullari-iletisim": {
    title: "Web Sitesi Kullanım Koşulları ve İletişim",
    lead: "Genel site kullanımı ve yasal kimlik bilgileri",
    text: usageTermsText,
  },
  "faaliyet-belgesi": {
    title: "Dernek Faaliyet Belgesi",
    lead: "Yedirenk Eğitim Kültür ve Yardımlaşma Derneği kuruluş ve faaliyet bilgileri",
    text: activityCertificateText,
  },
};

const slides = [
  {
    slug: "turkiye-fatura-destegi",
    label: "Fatura Desteği",
    image: "/assets/home-banner-turkiye-fatura-v1.webp",
    tag: "FATURA DESTEĞİ",
    title: "Bir Ev Işıksız Kalmasın",
    titleLines: ["Bir Ev", "Işıksız Kalmasın"],
    text: "Bağışınızla bir ailenin elektrik faturası ödensin, bir çocuğun evi karanlıkta kalmasın.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=0",
    color: "#06b2aa",
  },
  {
    slug: "turkiye-yetim-destegi",
    label: "Yetim Desteği",
    image: "/assets/home-banner-turkiye-yetim-v1.webp",
    tag: "YETİM DESTEĞİ",
    title: "Yetim Bir Çocuk Yalnız Büyümemeli",
    titleLines: ["Yetim Bir Çocuk", "Yalnız Büyümemeli"],
    text: "Eğitimden giyime, beslenmeden günlük ihtiyaçlarına kadar desteğinizle bir yetimin yanında olun.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=3",
    color: "#06b2aa",
  },
  {
    slug: "turkiye-zimem-defteri",
    label: "Zimem Defteri",
    image: "/assets/home-banner-turkiye-zimem-v1.webp",
    tag: "ZİMEM DEFTERİ",
    title: "Veresiye Borcu Kalmasın",
    titleLines: ["Veresiye Borcu", "Kalmasın"],
    text: "Desteğinizle bir ailenin veresiye borcu kapanırken onuru korunsun, hayatındaki yük biraz olsun hafiflesin.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=1",
    color: "#06b2aa",
  },
  {
    slug: "turkiye-nakdi-yardim",
    label: "Nakdi Yardım",
    image: "/assets/home-banner-turkiye-nakdi-v1.webp",
    tag: "NAKDİ YARDIM",
    title: "Bazı İhtiyaçlar Beklemez",
    titleLines: ["Bazı İhtiyaçlar", "Beklemez"],
    text: "İhtiyaç sahibi ailelerin temel ihtiyaçlarını karşılayabilmeleri için siz de katkı sunun.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=2",
    color: "#06b2aa",
  },
  {
    slug: "turkiye-akulu-sandalye",
    label: "Akülü Tekerlekli Sandalye",
    image: "/assets/home-banner-turkiye-akulu-sandalye-v1.webp",
    tag: "AKÜLÜ TEKERLEKLİ SANDALYE",
    title: "Bir Engeli Daha Birlikte Aşalım",
    titleLines: ["Bir Engeli Daha", "Birlikte Aşalım"],
    text: "Desteğiniz; hareket özgürlüğü, bağımsızlık ve sosyal hayata katılım imkânı sağlayabilir.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=6",
    color: "#06b2aa",
  },
  {
    slug: "turkiye-gida-kolisi",
    label: "Gıda Kolisi",
    image: "/assets/home-banner-turkiye-gida-kolisi-v1.webp",
    tag: "GIDA KOLİSİ",
    title: "Bir Koli Dolusu İyilik",
    titleLines: ["Bir Koli Dolusu", "İyilik"],
    text: "Gıda kolisi desteğinizle bir ailenin sofrasına bereket ve gönlüne umut taşıyın.",
    cta: "Bağış Yap",
    path: "/projeler/turkiye-projeleri/detay?secim=5",
    color: "#06b2aa",
  },
  {
    slug: "adak-akika-nafile-kurban",
    label: "Kurban",
    image: "/assets/home-banner-kurban-v2.webp",
    mobileImage: "/assets/home-banner-mobile-kurban-v2.webp",
    tag: "KURBAN",
    title: "Kurbanın İkram Olsun",
    titleLines: ["Kurbanın", "İkram Olsun"],
    text: "Kurban bağışınızla ihtiyaç sahibi ailelerin sofralarına bereket taşıyın.",
    cta: "Kurbanını Bağışla",
    path: "/projeler/adak-akika-nafile-kurban",
    color: "#f49e0c",
  },
  {
    slug: "su-kuyusu",
    label: "Su Kuyusu",
    image: "/assets/home-banner-su-kuyusu-v2.webp",
    mobileImage: "/assets/home-banner-mobile-su-kuyusu-v2.webp",
    tag: "SU KUYUSU",
    title: "Derinden Gelen Hayat",
    titleLines: ["Derinden Gelen", "Hayat"],
    text: "Bir su kuyusuna destek olun, temiz suya hasret hayatlara umut olun.",
    cta: "Bağış Yap",
    path: "/projeler/su-kuyusu",
    color: "#06b2aa",
  },
  {
    slug: "gida-kolisi",
    label: "Gıda Kolisi",
    image: "/assets/home-banner-gida-kolisi-v2.webp",
    mobileImage: "/assets/home-banner-mobile-gida-kolisi-v2.webp",
    tag: "GIDA KOLİSİ",
    title: "Rızkı Paylaş",
    text: "Gıda desteğinizle ihtiyaç sahibi ailelerin sofralarına iyilik ulaştırın.",
    cta: "Koli Bağışla",
    path: "/projeler/gida-kolisi",
    color: "#f49e0c",
  },
  {
    slug: "zekat",
    label: "Zekât",
    image: "/assets/home-banner-zekat-v2.webp",
    mobileImage: "/assets/home-banner-mobile-zekat-v2.webp",
    tag: "ZEKÂT",
    title: "Zekâtınla Hayatlara Dokun",
    titleLines: ["Zekâtınla", "Hayatlara Dokun"],
    text: "Zekâtınızı, Afrika, Asya, Gazze ve ülkemizdeki ihtiyaç sahiplerine özenle ve güvenle ulaştırın.",
    cta: "Bağış Yap",
    path: "/projeler/zekat",
    color: "#f49e0c",
  },
  {
    slug: "yetim-hamiligi",
    label: "Yetim Hamiliği",
    image: "/assets/home-banner-yetim-hamiligi-v2.webp",
    mobileImage: "/assets/home-banner-mobile-yetim-hamiligi-v2.webp",
    tag: "YETİM HAMİLİĞİ",
    title: "Yetime Yoldaş Ol",
    text: "Bir yetimin eğitimine, ihtiyaçlarına ve geleceğine düzenli destek olun.",
    cta: "Yetim Hamisi Ol",
    path: "/projeler/yetim-hamiligi",
    color: "#06b2aa",
  },
  {
    slug: "yetim-giydirme",
    label: "Yetim Giydirme",
    image: "/assets/home-banner-yetim-giydirme-v2.webp",
    mobileImage: "/assets/home-banner-mobile-yetim-giydirme-v2.webp",
    tag: "YETİM GİYDİRME",
    title: "Desteğin Yetimin Üstünde Olsun",
    titleLines: ["Desteğin Yetimin", "Üstünde Olsun"],
    text: "Kıyafet desteğinizle bir yetimin yüzündeki tebessüme vesile olun.",
    cta: "Bağış Yap",
    path: "/projeler/yetim-giydirme",
    color: "#f49e0c",
  },
  {
    slug: "toplu-yemek",
    label: "Toplu Yemek",
    image: "/assets/home-banner-toplu-yemek-v2.webp",
    mobileImage: "/assets/home-banner-mobile-toplu-yemek-v2.webp",
    tag: "TOPLU YEMEK",
    title: "Bu Sofrada İyilik Var",
    titleLines: ["Bu Sofrada", "İyilik Var"],
    text: "Bir sıcak yemek bağışıyla ihtiyaç sahiplerinin sofrasına umut ve bereket taşıyın.",
    cta: "Bağış Yap",
    path: "/projeler/toplu-yemek",
    color: "#f49e0c",
  },
  {
    slug: "medrese",
    label: "Medrese",
    image: "/assets/home-banner-medrese-v2.webp",
    mobileImage: "/assets/home-banner-mobile-medrese-v2.webp",
    tag: "MEDRESE PROJESİ",
    title: "İlim Çatısı",
    text: "Bir medreseye destek olun, nesiller boyu sürecek ilme vesile olun.",
    cta: "Bağış Yap",
    path: "/projeler/medrese",
    color: "#f49e0c",
  },
  {
    slug: "cami",
    label: "Cami & Mescid",
    image: "/assets/home-banner-cami-mescid-v2.webp",
    mobileImage: "/assets/home-banner-mobile-cami-mescid-v2.webp",
    tag: "CAMİ & MESCİD",
    title: "Bir Saf Daha",
    text: "Bir cami veya mescide destek olun, yükselen her duada payınız olsun.",
    cta: "Bağış Yap",
    path: "/projeler/cami",
    color: "#06b2aa",
  },
  {
    slug: "gazze-yardim",
    label: "Gazze",
    image: "/assets/home-banner-gazze-v2.webp",
    mobileImage: "/assets/home-banner-mobile-gazze-v2.webp",
    tag: "GAZZE YARDIM",
    title: "Gazze’de Hayat Sürsün",
    titleLines: ["Gazze’de", "Hayat Sürsün"],
    text: "Desteğinizle Gazze’de temel ihtiyaçlara ulaşmakta zorlanan ailelerin yanında olun.",
    cta: "Bağış Yap",
    path: "/projeler/gazze-yardim",
    color: "#f49e0c",
  },
];
const heroProjectLinks = [
  {
    slug: "turkiye-projeleri",
    label: "Türkiye",
    path: "/projeler/turkiye-projeleri",
  },
  {
    slug: "gazze-yardim",
    label: "Gazze Yardım",
    path: "/projeler/gazze-yardim",
  },
  {
    slug: "adak-akika-nafile-kurban",
    label: "Kurban",
    path: "/projeler/adak-akika-nafile-kurban",
  },
  { slug: "su-kuyusu", label: "Su Kuyusu", path: "/projeler/su-kuyusu" },
  {
    slug: "gida-kolisi",
    label: "Gıda Kolisi",
    path: "/projeler/gida-kolisi",
  },
  {
    slug: "toplu-yemek",
    label: "Toplu Yemek",
    path: "/projeler/toplu-yemek",
  },
  {
    slug: "yetim-hamiligi",
    label: "Yetim",
    path: "/projeler/yetim-hamiligi",
  },
  { slug: "zekat", label: "Zekât", path: "/projeler/zekat" },
  { slug: "medrese", label: "Medrese", path: "/projeler/medrese" },
  { slug: "cami", label: "Cami & Mescid", path: "/projeler/cami" },
];
const projectCatalog = [
  {
    slug: "adak-akika-nafile-kurban",
    category: "Kurban",
    title: "Kurban",
    short:
      "Yurt içinde, Afrika’da, Asya’da ve birçok mazlum coğrafyada adak, akika ve nafile kurbanlarınızı İslami usullere göre keserek ihtiyaç sahibi ailelere ulaştırıyoruz. Siz de kurban bağışında bulunarak birçok ailenin yüzünde tebessüm oluşturabilirsiniz.",
    image: "/assets/project-sofrada-payin-olsun-yedirenk-v1.webp",
    description:
      "Adak, akika ve nafile kurban bağışlarınız; veteriner kontrolü, uygun kesim şartları ve ihtiyaç tespiti gözetilerek gerçekleştirilir. Etler insan onurunu koruyan bir dağıtım planıyla ailelere ulaştırılır.",
    variants: [
      ["Afrika", 4800, "TRY"],
      ["Bangladeş", 6900, "TRY"],
      ["Yemen", 6900, "TRY"],
      ["Afganistan", 6900, "TRY"],
      ["Türkiye", 20000, "TRY"],
    ],
  },
  {
    slug: "su-kuyusu",
    category: "Su Kuyusu",
    title: "Su Kuyusu",
    short:
      "Dünyada temiz suya ulaşılamamasından dolayı binlerce insan her gün hayatını kaybediyor. Siz kıymetli bağışçılarımızın desteğiyle su sıkıntısı yaşanan bölgelerde su kuyuları açarak insanların temiz suya erişimini sağlıyoruz.",
    image: "/assets/project-derinden-gelen-hayat-yedirenk-v1.webp",
    description:
      "Dünyanın birçok bölgesinde aileler temiz suya ulaşmak için her gün uzun mesafeler kat ediyor. Güvenli olmayan kaynaklar özellikle çocuklarda ciddi sağlık sorunlarına, eğitim kaybına ve ailelerin günlük yükünün artmasına neden oluyor. Yedirenk Derneği olarak yeraltı suyu, nüfus yoğunluğu ve yerel ihtiyaç incelenerek belirlenen yerleşimlerde dayanıklı tulumbalı kuyular açıyoruz. Her proje; zemin incelemesi, sondaj, pompa kurulumu, su kalitesi kontrolü, teslim tutanağı ve sürdürülebilir bakım planını kapsıyor. Desteğiniz yalnızca bir su kaynağı açmıyor; çocukların okula ayırabildiği zamanı artırıyor, sağlık risklerini azaltıyor ve bütün bir yerleşimin hayatını kolaylaştırıyor.",
    variants: [
      ["Bangladeş · Tulumbalı Kuyu", 500, "USD"],
      ["Bangladeş · 12 Musluklu Kuyu", 1500, "USD"],
    ],
  },
  {
    slug: "gida-kolisi",
    category: "Gıda Kolisi",
    title: "Gıda Kolisi",
    short:
      "Afrika, Asya ve Türkiye’de temel gıdaya erişmekte güçlük yaşayan ailelere gıda kolisi ulaştırıyoruz.",
    image: "/assets/project-rizki-paylas-yedirenk-v1.webp",
    description:
      "Yardıma muhtaç olan tüm ülkelerde kuraklık, zorunlu göç, yoksulluk ve işsizlik gibi sorunlar milyonlarca insanın gıdaya erişimini zorlaştırmaktadır.",
    variants: [
      ["Afrika", 2000, "TRY"],
      ["Asya", 2000, "TRY"],
      ["Türkiye", 2000, "TRY"],
    ],
  },
  {
    slug: "toplu-yemek",
    category: "Toplu Yemek",
    title: "Toplu Yemek",
    short:
      "Yurt dışında ihtiyaç sahibi ailelere ve mazlum kardeşlerimize toplu sıcak yemek ikramları ulaştırıyoruz. Siz de yapacağınız bağışla bir sofranın kurulmasına, ihtiyaç sahibi insanların sıcak bir öğünle buluşmasına vesile olabilirsiniz.",
    image: "/assets/project-toplu-yemek-user-v2.jpg",
    description:
      "Dünyanın birçok bölgesinde insanlar yoksulluk ve açlık nedeniyle temel gıda ihtiyaçlarını karşılamakta güçlük çekiyor. Toplu yemek çalışmalarımızla ihtiyaç sahibi insanlara sıcak yemek ikram ediyor; bağışçılarımızın desteğini paylaşılmış bir sofraya dönüştürüyoruz.",
    variants: [
      ["Uganda", 150, "TRY"],
      ["Somali", 150, "TRY"],
      ["Bangladeş", 150, "TRY"],
      ["Çad", 150, "TRY"],
      ["Afganistan", 150, "TRY"],
      ["Yemen", 150, "TRY"],
      ["Tanzanya", 180, "TRY"],
      ["Etiyopya", 180, "TRY"],
    ],
  },
  {
    slug: "gazze-yardim",
    category: "Gazze Yardım",
    title: "Gazze Yardım",
    short:
      "Gazze’de su, gıda, sağlık ve eğitim alanlarında yürütülen dokuz ayrı çalışmaya destek olun.",
    image: "/assets/gazze-yardim-main-cover-v1.webp",
    description:
      "Gazze’deki çalışmalar; saha ihtiyacına göre su, temel gıda, sıcak yemek, sağlık ve eğitim başlıklarında planlanır. Seçtiğiniz proje için yapılan bağışlar doğrulanmış ihtiyaç sahiplerine ulaştırılır ve uygulama kayıt altına alınır.",
    variants: [
      [
        "Su Tankeri",
        12000,
        "TRY",
        "/assets/project-gazze-su-tankeri-yedirenk-v1.webp",
        "Gazze’de temiz suya ulaşmak, binlerce aile için hâlâ büyük bir sorun. Yedirenk Derneği olarak Gazze’de mahallelerde su tankerleri ile su dağıtımı yapıyoruz.",
      ],
      [
        "Ekmek Dağıtımı",
        200,
        "TRY",
        "/assets/project-gazze-ekmek-dagitimi-yedirenk-v1.webp",
        "Gazze’de yaşayan, kriz nedeniyle temel gıdaya erişimde ciddi sıkıntılar yaşayan ihtiyaç sahibi ailelere destek olmak amacıyla ekmek dağıtımı gerçekleştiriyoruz.",
      ],
      [
        "Gıda Kolisi",
        3000,
        "TRY",
        "/assets/project-gazze-gida-kolisi-yedirenk-v1.webp",
        "Gazze’de yaşanan kriz nedeniyle binlerce aile temel gıda ihtiyaçlarına ulaşmakta büyük zorluk yaşamaktadır.",
      ],
      [
        "Sebze Kolisi",
        2500,
        "TRY",
        "/assets/project-gazze-sebze-meyve-kolisi-yedirenk-v1.webp",
        "Gazze’de hazırladığımız sebze kolilerini ihtiyaç sahibi ailelerin sofralarına ulaştırıyoruz.",
      ],
      [
        "Toplu Yemek Dağıtımı",
        200,
        "TRY",
        "/assets/project-gazze-toplu-yemek-dagitimi-yedirenk-v1.webp",
        "Saha mutfaklarında hazırlanan sıcak öğünleri ihtiyaç sahiplerine düzenli olarak ulaştırıyoruz.",
      ],
      [
        "Un Dağıtımı",
        1500,
        "TRY",
        "/assets/project-gazze-un-dagitimi-yedirenk-v1.webp",
        "Yerel ekmek üretiminin ve ailelerin temel gıda ihtiyacının sürmesi için un desteği sağlıyoruz.",
      ],
      [
        "Ameliyat Projesi",
        11500,
        "TRY",
        "/assets/project-gazze-ameliyat-yedirenk-v1.webp",
        "Gazze halkı için gerçekleştirilecek ameliyatlara ve tıbbi malzeme tedariğine destek oluyoruz.",
      ],
      [
        "Bebek Maması Yardımı",
        1150,
        "TRY",
        "/assets/project-gazze-bebek-mamasi-yardimi-yedirenk-v1.webp",
        "Gazze’deki çocukların temel beslenme ihtiyacına destek olmak için bebek maması ulaştırıyoruz.",
      ],
      [
        "Eğitim Çadırı",
        13800,
        "USD",
        "/assets/project-gazze-egitim-cadiri-yedirenk-v1.webp",
        "Gazze’de çocukların yeniden öğrenebilmeleri, arkadaşlarıyla buluşabilmeleri ve geleceğe umutla bakabilmeleri için güvenli eğitim çadırları kuruyoruz.",
      ],
    ],
  },
  {
    slug: "turkiye-projeleri",
    category: "Türkiye Projeleri",
    title: "Türkiye",
    short:
      "Türkiye’de fatura, borç, nakdi yardım, yetim, gıda ve erişilebilirlik alanlarında yürüttüğümüz altı projeye destek olun.",
    image: "/assets/project-card-turkiye-brush-v2.webp",
    description:
      "Türkiye’de yürüttüğümüz yardım çalışmaları; ihtiyaç tespiti yapılan ailelere gıda, barınma, eğitim ve acil destek ulaştırmak amacıyla planlanır. Bağışlarınız güncel saha ihtiyaçlarına göre değerlendirilir.",
    variants: [
      [
        "Fatura Desteği",
        0,
        "TRY",
        "/assets/turkiye-fatura-destegi.webp",
        "Elektrik, su ve doğalgaz faturalarını ödemekte zorlanan ihtiyaç sahibi ailelerin yükünü hafifletin.",
      ],
      [
        "Zimem Defteri",
        0,
        "TRY",
        "/assets/turkiye-zimem-defteri.webp",
        "Mahalle bakkallarındaki veresiye borçlarını kimseyi mahcup etmeden kapatmaya destek olun.",
      ],
      [
        "Nakdi Yardım",
        0,
        "TRY",
        "/assets/turkiye-nakdi-yardim.webp",
        "İhtiyaç sahibi ailelerin temel giderlerini kendi önceliklerine göre karşılayabilmelerine katkıda bulunun.",
      ],
      [
        "Yetim Hamiliği",
        1000,
        "TRY",
        "/assets/turkiye-yetim-destegi.webp",
        "Bir yetim çocuğun eğitim, beslenme ve günlük ihtiyaçlarına düzenli destek olun.",
      ],
      [
        "Yetim Giyim",
        1500,
        "TRY",
        "/assets/turkiye-yetim-destegi.webp",
        "Bir yetim çocuğun mevsime uygun yeni kıyafet ihtiyaçlarına destek olun.",
      ],
      [
        "Gıda Kolisi",
        2000,
        "TRY",
        "/assets/turkiye-gida-kolisi.webp",
        "Bir gıda kolisiyle ihtiyaç sahibi bir ailenin sofrasına bereket taşıyın.",
      ],
      [
        "Akülü Tekerlekli Sandalye",
        20000,
        "TRY",
        "/assets/turkiye-akulu-tekerlekli-sandalye.webp",
        "Hareket kısıtlılığı yaşayan bir kişinin daha bağımsız bir hayata kavuşmasına destek olun.",
      ],
    ],
  },
  {
    slug: "yetim-hamiligi",
    category: "Yetim",
    title: "Yetim Hamiliği",
    short:
      "Afrika, Asya ve Türkiye’deki yetim çocukların temel ihtiyaçlarına, eğitimlerine ve sağlıklı gelişimlerine düzenli destek oluyoruz.",
    image: "/assets/project-yetime-yoldas-ol-yedirenk-v1.webp",
    description:
      "Bağış sırasında Afrika, Asya ve Türkiye bölgesini seçebilirsiniz. Yetim hamiliği yalnızca maddi destek değil, çocuğun eğitim ve gelişiminin düzenli takip edildiği uzun soluklu bir dayanışma programıdır.",
    variants: [
      ["Afrika", 1000, "TRY"],
      ["Asya", 1000, "TRY"],
      ["Türkiye", 1000, "TRY"],
    ],
  },
  {
    slug: "yetim-giydirme",
    category: "Yetim",
    title: "Yetim Giyim",
    short:
      "Afrika, Asya ve Türkiye’deki ihtiyaç sahibi yetim çocukların yeni kıyafetlere kavuşmasına ve kendilerini değerli hissetmelerine destek oluyoruz.",
    image: "/assets/project-destegin-yetimin-ustunde-olsun-yedirenk-v1.webp",
    description:
      "Bağış sırasında Afrika, Asya ve Türkiye bölgesini seçebilirsiniz. Çocukların yaş, beden ve mevsim şartlarına uygun kıyafet ihtiyaçları yerel ekiplerle belirlenir; alışveriş ve teslim süreci mahremiyet gözetilerek yürütülür.",
    variants: [
      ["Afrika", 1500, "TRY"],
      ["Asya", 1500, "TRY"],
      ["Türkiye", 1500, "TRY"],
    ],
  },
  {
    slug: "zekat",
    category: "Zekât",
    title: "Zekât",
    short:
      "İslamın beş şartından biri olan zekatlarınızı yılın her döneminde hem yurtiçinde hem yurtdışında ihtiyaç sahibi ailelere ulaştırıyoruz.",
    image: "/assets/project-zakat-user-provided-v4.webp",
    description:
      "İslamın beş şartından biri olan zekatlarınızı yılın her döneminde hem yurtiçinde hem yurtdışında ihtiyaç sahibi ailelere ulaştırıyoruz.",
    calculator: false,
    variants: [
      ["Zekât Bağışı", 0, "TRY", "/assets/project-zakat-user-provided-v4.webp"],
    ],
  },
  {
    slug: "medrese",
    category: "Medrese",
    title: "Medrese",
    short:
      "Medrese bağışlarınızla eğitim imkânlarının sınırlı olduğu bölgelerde çocukların ve gençlerin düzenli bir öğrenme ortamına kavuşmasına destek oluyoruz.",
    image: "/assets/project-medrese-banglades-v2.webp",
    description:
      "Medrese projeleri yerel ihtiyaç, öğrenci kapasitesi ve sürdürülebilir işletme planına göre hazırlanır. İnşaat aşamaları belgelenerek bağışçıyla paylaşılır.",
    variants: [
      [
        "Bangladeş Medrese",
        12000,
        "USD",
        "/assets/project-medrese-banglades-v2.webp",
        "İlim, irfan ve güzel ahlakın buluştuğu medresemizde yetim ve öğrencilerimize bilgiyle birlikte Kur’an-ı Kerim, temel dini bilgiler ve değerler eğitimi kazandırmaya çalışıyoruz.",
      ],
      [
        "Somali Medrese",
        12000,
        "USD",
        "/assets/project-medrese-somali-v2.webp",
        "Afrika’nın en yoksul ülkelerinden biri olan Somali’de yapacağımız medresemiz; ilim, ahlak ve manevi değerleri bir arada sunan bir eğitim yuvasıdır. Siz kıymetli bağışçılarımızla gelecek nesilleri birlikte inşa ediyoruz.",
      ],
      [
        "Etiyopya Medrese",
        12000,
        "USD",
        "/assets/project-medrese-etiyopya-v2.webp",
        "Ümmet coğrafyasında yapacağımız bu medresemizde öğrencilerimizin sağlam bir bilgi birikimi edinmelerini, manevi yönlerini geliştirmelerini ve geleceğe yön veren bireyler olarak yetişmelerini amaçlıyoruz.",
      ],
    ],
  },
  {
    slug: "cami",
    category: "Cami",
    title: "Cami",
    short:
      "Cami ve mescit bağışlarınızla ibadethaneye ihtiyaç duyulan bölgelerde insanların namazlarını, dualarını ve ibadetlerini huzur içinde gerçekleştirebilecekleri kalıcı mekânların inşa edilmesine destek oluyoruz.",
    image: "/assets/project-mosque-yedirenk-v1.webp",
    description:
      "Cami projelerinde arsa uygunluğu, yerel izinler, kapasite ve bölgenin mimari ihtiyaçları değerlendirilir; yapım süreci aşamalı olarak raporlanır.",
    variants: [
      [
        "Bangladeş",
        25000,
        "USD",
        "/assets/project-mosque-yedirenk-v1.webp",
        "Asya ülkesi Bangladeş’te yapacağımız cami, huzur ve manevi güzelliklerin yaşandığı bir ibadet merkezidir. Yedirenk Derneği olarak siz kıymetli bağışçılarımızla birlikte bölgede İslami değerleri yaşatmayı hedefliyoruz.",
      ],
      [
        "Uganda",
        28000,
        "USD",
        "/assets/project-mosque-uganda-yedirenk-v1.webp",
        "Uganda’da yapılacak camimizde bölge halkının ibadetlerini huzur içinde yerine getirmesi için siz kıymetli bağışçılarımızla kalıcı bir eser bırakmak istiyoruz. Yapacağımız bu güzel eserle toplumun manevi hayatına katkı sunmayı ve İslami değerleri yaşatmayı hedefliyoruz.",
      ],
      [
        "Somali",
        27000,
        "USD",
        "/assets/project-bir-saf-daha-somali-v1.webp",
        "Afrika’nın en yoksul ülkelerinden biri olan Somali’de yapacağımız cami, gönüllerin buluştuğu, kardeşlik ve dayanışmanın güçlendiği sıcak bir ibadet yuvası olacaktır. Yedirenk Derneği olarak siz kıymetli bağışçılarımızla birlikte İslam’ın güzel değerlerini yaşatmayı hedefliyoruz.",
      ],
    ],
  },
  {
    slug: "mescid",
    category: "Mescid",
    title: "Mescid",
    short:
      "Cami ve mescit bağışlarınızla ibadethaneye ihtiyaç duyulan bölgelerde insanların namazlarını, dualarını ve ibadetlerini huzur içinde gerçekleştirebilecekleri kalıcı mekânların inşa edilmesine destek oluyoruz.",
    image: "/assets/project-masjid-yedirenk-v1.webp",
    description:
      "Mescid projesi nüfusu daha az olan yerleşimlerde temel ibadet alanı ihtiyacını karşılar. Yer seçimi, inşa, tefriş ve teslim süreçleri projeye dahildir.",
    variants: [
      [
        "Tanzanya",
        25000,
        "USD",
        "/assets/project-masjid-yedirenk-v1.webp",
        "Afrika’daki bu mescidimiz, ibadet ve kardeşliğin buluştuğu, gönüllere huzur veren manevi bir mekândır. Siz kıymetli bağışçılarımızla birlikte İslam’ın güzel değerlerini yaşatmayı, birlik ve beraberliği güçlendirmeyi amaçlıyoruz.",
      ],
    ],
  },
];
function PalestineFlagIcon() {
  return (
    <svg viewBox="0 0 36 24" aria-hidden="true" focusable="false">
      <rect x="2" y="4" width="32" height="5.34" fill="#111" />
      <rect x="2" y="9.33" width="32" height="5.34" fill="#fff" />
      <rect x="2" y="14.66" width="32" height="5.34" fill="#149954" />
      <path d="M2 4 15 12 2 20Z" fill="#e4312b" />
      <rect
        x="2"
        y="4"
        width="32"
        height="16"
        fill="none"
        stroke="#6f7f87"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function TurkishFlagIcon() {
  return (
    <svg viewBox="0 0 36 24" aria-hidden="true" focusable="false">
      <rect x="2" y="4" width="32" height="16" rx="1" fill="#e30a17" />
      <circle cx="16" cy="12" r="5" fill="#fff" />
      <circle cx="17.7" cy="12" r="4" fill="#e30a17" />
      <path d="m21.1 12 4.2-1.35-2.6 3.55v-4.4l2.6 3.55Z" fill="#fff" />
      <rect x="2" y="4" width="32" height="16" rx="1" fill="none" stroke="#a60812" strokeWidth="0.7" />
    </svg>
  );
}

function CattleHeadIcon() {
  return (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 8.5C9.3 8.2 6.3 6.4 5 3.5c-.5 4.2 1.2 7.2 5.5 8.2" />
      <path d="M23 8.5c3.7-.3 6.7-2.1 8-5 .5 4.2-1.2 7.2-5.5 8.2" />
      <path d="M12 11c-3.6-1.8-6.8-.4-8 2.3 2 2 5 2.7 7.4 1.7" />
      <path d="M24 11c3.6-1.8 6.8-.4 8 2.3-2 2-5 2.7-7.4 1.7" />
      <path d="M12.5 8.8C14 7.4 16 6.8 18 6.8s4 .6 5.5 2l2 12.2c.8 5-2.6 9.2-7.5 9.2S9.7 26 10.5 21Z" />
      <path d="M14 17.5h.1M21.9 17.5h.1" />
      <path d="M13.1 23.5c0-2 2.2-3.2 4.9-3.2s4.9 1.2 4.9 3.2v2.1c0 1.8-2.2 3.1-4.9 3.1s-4.9-1.3-4.9-3.1Z" />
      <path d="M16 24.5h.1M19.9 24.5h.1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

function WhatsAppButton() {
  const { content } = useCms();
  const number = String(content.settings.whatsapp || "").replace(/\D/g, "");
  const message = encodeURIComponent(
    "Merhaba, Yedirenk Derneği hakkında bilgi almak istiyorum.",
  );
  const href = number
    ? `https://wa.me/${number}?text=${message}`
    : `https://wa.me/?text=${message}`;
  return (
    <a
      className="floating-whatsapp"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      title="WhatsApp ile iletişime geç"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}

const qurbaniImpactItems = [
  {
    title: "Ete Erişim",
    text: "Yoksulluk ve yaşam koşulları nedeniyle birçok aile ete düzenli olarak ulaşamıyor.",
    icon: Beef,
  },
  {
    title: "Uzun Süreli Fayda",
    text: "Bazı aileler kendilerine ulaşan kurban etlerini muhafaza ederek daha uzun süre tüketiyor.",
    icon: UsersRound,
  },
  {
    title: "Paylaşılan Sofralar",
    text: "Kurban bağışları, ihtiyaç sahibi ailelerin sofralarına et ulaştırılmasına vesile oluyor.",
    icon: UtensilsCrossed,
  },
];

function QurbaniImpactCards() {
  return (
    <div
      className="qurbani-impact-cards"
      aria-label="Kurban bağışının faydaları"
    >
      {qurbaniImpactItems.map((item) => {
        const ImpactIcon = item.icon;
        return (
          <article key={item.title}>
            <div>
              <ImpactIcon />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <i aria-hidden="true" />
          </article>
        );
      })}
    </div>
  );
}

const qurbaniProcessItems = [
  {
    title: "Bağışınızı Gerçekleştirin",
    text: "Web sitemiz veya banka hesaplarımız üzerinden kurban bağışınızı gerçekleştirin.",
    image: "/assets/qurbani-process/bagis.webp",
    alt: "İnternet üzerinden kurban bağışı yapan bağışçı",
  },
  {
    title: "Bilgilerinizi Teyit Edelim",
    text: "Bağışınızın ardından sizinle iletişime geçerek kurbanın kimin adına, nerede ve hangi niyetle kesileceğine ilişkin bilgileri teyit edelim.",
    image: "/assets/qurbani-process/teyit.webp",
    alt: "Bağış bilgilerini telefonla teyit eden görevli",
  },
  {
    title: "Afişinizi Hazırlayalım",
    text: "Kurbanınıza ait bilgiler doğrultusunda hazırlanan afişi onayınız için sizinle paylaşalım.",
    image: "/assets/qurbani-process/afis.webp",
    alt: "Kurban projesi için afiş hazırlayan tasarımcı",
  },
  {
    title: "Kurbanınız Kesilsin",
    text: "Onayınızın ardından kurbanınızı 5 gün içinde uygun şartlarda keserek ihtiyaç sahiplerine ulaştıralım.",
    image: "/assets/qurbani-process/saha.webp",
    alt: "Kurbanlık hayvanın saha kontrollerini yapan görevliler",
  },
  {
    title: "Sizi Bilgilendirelim",
    text: "Kesim sürecine ait video ve görselleri hazırlayarak tarafınıza ulaştıralım.",
    image: "/assets/qurbani-process/bilgilendirme.webp",
    alt: "Saha görsellerini inceleyerek bağışçı raporu hazırlayan görevli",
  },
];

function QurbaniProcessCards() {
  return (
    <section
      className="qurbani-process-section"
      aria-labelledby="qurbani-process-title"
    >
      <header>
        <span>KURBAN SÜRECİ</span>
        <h2 id="qurbani-process-title">Kurbanınız Nasıl Ulaştırılıyor?</h2>
        <p>
          Bağışınızın alınmasından ihtiyaç sahiplerine ulaştırılmasına kadar
          geçen süreci özenle ve düzenli şekilde takip ediyoruz.
        </p>
      </header>
      <div className="qurbani-process-cards">
        {qurbaniProcessItems.map((item, index) => (
          <div className="qurbani-process-card" key={item.title}>
            <span className="qurbani-process-number" aria-hidden="true">
              {index + 1}
            </span>
            <div className="qurbani-process-image">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <div className="qurbani-process-copy">
              <small>{index + 1}. ADIM</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const waterWellFeatures = [
  {
    title: "El Pompalı Sistem",
    text: "Tulumbalı su kuyumuz el pompasıyla kullanılacak şekilde hazırlanır.",
    image: "/assets/water-well-features/hand-pump.webp",
    alt: "El pompalı tulumbalı su kuyusu illüstrasyonu",
  },
  {
    title: "20–25 Metre",
    text: "Kuyuların derinliği ortalama 20‑25 metre arasında değişmektedir.",
    image: "/assets/water-well-features/depth.webp",
    alt: "Su kuyusunun yer altındaki derinliğini gösteren illüstrasyon",
  },
  {
    title: "Ortalama 40 Aile",
    text: "Bir su kuyusundan günlük ortalama 40 ailenin faydalanması öngörülmektedir.",
    image: "/assets/water-well-features/families.webp",
    alt: "Su kuyusundan faydalanan ailelerin illüstrasyonu",
  },
  {
    title: "Bağışçıya Özel",
    text: "Bağışçımızın istediği isim ve afiş hazırlanarak su kuyusuna uygulanır.",
    image: "/assets/water-well-features/personalized.webp",
    alt: "Bağışçıya özel afiş alanı bulunan su kuyusu illüstrasyonu",
  },
];

function WaterWellFeatures() {
  return (
    <section className="water-well-features" aria-label="Kuyu özellikleri">
      <header>
        <span>KUYU ÖZELLİKLERİ</span>
        <h2>Su Kuyusunun Özellikleri</h2>
        <p>
          Kuyu türüne ve bölgenin şartlarına göre özellikler değişebilse de,
          tulumbalı su kuyularımızın temel yapısı aşağıdaki gibidir.
        </p>
      </header>
      <div className="water-well-feature-grid">
        {waterWellFeatures.map((feature) => (
          <div className="water-well-feature-card" key={feature.title}>
            <div className="water-well-feature-visual">
              <img src={feature.image} alt={feature.alt} loading="lazy" />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Kuyu türüne ve bölgenin şartlarına göre derinlik, maliyet ve
          faydalanıcı sayısı değişiklik gösterebilir.
        </p>
      </aside>
    </section>
  );
}

const gazaWaterTankerImpactItems = [
  {
    title: "Temiz Su Desteğine",
    text: "Gazze’de temiz suya erişmekte zorlanan ailelere su ulaştırılmasına vesile olur.",
    image: "/assets/gaza-water-tanker/clean-water-support.webp",
    alt: "Gazze’de bir aileye temiz su teslim eden yardım görevlisi illüstrasyonu",
  },
  {
    title: "5 Tonluk Tedariğe",
    text: "Bir su tankeri yaklaşık 5 ton su taşıma kapasitesine sahiptir.",
    image: "/assets/gaza-water-tanker/five-ton-tanker.webp",
    alt: "Gazze’de su dağıtımı için kullanılan tanker illüstrasyonu",
  },
  {
    title: "Mahallelere Ulaşan Yardıma",
    text: "Tedarik edilen su, ihtiyaç duyulan mahallelerde ailelere ulaştırılır.",
    image: "/assets/gaza-water-tanker/neighborhood-delivery.webp",
    alt: "Gazze’de tankerle mahalle sakinlerine su dağıtımı illüstrasyonu",
  },
  {
    title: "Susuzluğun Azalmasına",
    text: "Bağışınız, ailelerin günlük su ihtiyacının karşılanmasına katkı sağlar.",
    image: "/assets/gaza-water-tanker/daily-water-relief.webp",
    alt: "Temiz suya ulaşan Gazze’deki bir aile illüstrasyonu",
  },
];

function GazaWaterTankerImpactCards() {
  return (
    <section
      className="water-well-features gaza-water-tanker-features"
      aria-label="Su tankeri desteğinin etkileri"
    >
      <header>
        <h2>Bir Su Tankeri Neye Dönüşür?</h2>
        <p>
          Gazze’de temiz suya ulaşmak binlerce aile için hâlâ büyük bir sorun.
          Yedirenk Derneği olarak mahallelerde su tankerleriyle su dağıtımı
          yapıyor, ailelerin susuzluğunu gidermeye destek oluyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid">
        {gazaWaterTankerImpactItems.map((item) => (
          <article className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <aside>
        <HeartHandshake aria-hidden="true" />
        <p>
          <strong>Not:</strong> Bir su tankerinin bedeli 12.000 TL’dir. 12.000
          TL altında veya üstünde yapılacak bağışlarla da destek olunabilir.
          Toplam 10 ton su tedarik edildiğinde bölgeye dağıtım yapılır.
        </p>
      </aside>
    </section>
  );
}

const foodParcelImpactItems = [
  {
    title: "Bir Ailenin Sofrasına",
    text: "Gıda kolisi bağışınız, temel gıdaya ihtiyaç duyan bir ailenin sofrasına doğrudan destek olur.",
    image: "/assets/food-parcel-illustrations/family-table.webp",
    alt: "Temel gıda desteğiyle sofrasını paylaşan bir aile illüstrasyonu",
  },
  {
    title: "Temel Gıda Desteğine",
    text: "İhtiyaç sahibi ailelerin günlük yaşamlarında ihtiyaç duydukları temel gıda ürünlerinin karşılanmasına katkı sağlar.",
    image: "/assets/food-parcel-illustrations/essential-food.webp",
    alt: "Temel gıda ürünleriyle hazırlanmış gıda kolisi illüstrasyonu",
  },
  {
    title: "Yalnız Olmadıklarını Hissettirmeye",
    text: "Ulaştırılan her koli yalnızca gıda desteği değil; zor zamanlardan geçen bir aileye yanında olduğumuzu hissettiren bir dayanışma vesilesidir.",
    image: "/assets/food-parcel-illustrations/solidarity-delivery.webp",
    alt: "İhtiyaç sahibi bir aileye gıda kolisi ulaştıran gönüllü illüstrasyonu",
  },
  {
    title: "Umuda",
    text: "Küçük görünen bir destek, ihtiyaç sahibi bir aile için daha güvenli bir sofraya ve yarına dair yeni bir umuda dönüşebilir.",
    image: "/assets/food-parcel-illustrations/hope.webp",
    alt: "Gıda kolisiyle geleceğe umutla bakan bir aile illüstrasyonu",
  },
];

function FoodParcelImpactCards() {
  return (
    <section
      className="water-well-features food-parcel-features"
      aria-label="Bir gıda kolisinin dönüştüğü destekler"
    >
      <header>
        <span>GIDA KOLİSİ DESTEĞİ</span>
        <h2>Bir Gıda Kolisi Neye Dönüşür?</h2>
        <p>
          Gıda kolisi bağışlarınızla temel gıdaya erişmekte güçlük yaşayan
          ailelerin sofralarına destek oluyor, ihtiyaç duydukları temel gıda
          ürünlerini ulaştırıyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid food-parcel-feature-grid">
        {foodParcelImpactItems.map((item) => (
          <div className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Gıda kolileri, bölgenin ihtiyaçlarına göre temel ürünlerle
          hazırlanmaktadır.
        </p>
      </aside>
    </section>
  );
}

const orphanSupportImpactItems = [
  {
    title: "Temel İhtiyaç Desteğine",
    text: "Bir yetimin günlük yaşamında ihtiyaç duyduğu temel ihtiyaçların karşılanmasına katkı sağlayabilirsiniz.",
    image: "/assets/orphan-support-illustrations/basic-needs.webp",
    alt: "Bir çocuğa temel ihtiyaç desteği ulaştıran gönüllü illüstrasyonu",
  },
  {
    title: "Eğitim Desteğine",
    text: "Eğitim hayatını sürdürebilmesi için gerekli ihtiyaçlarına destek olabilir, geleceğine katkıda bulunabilirsiniz.",
    image: "/assets/orphan-support-illustrations/education.webp",
    alt: "Eğitim hayatı desteklenen bir çocuk illüstrasyonu",
  },
  {
    title: "Sağlıklı Beslenmeye",
    text: "Düzenli ve sağlıklı beslenmesine destek olarak fiziksel gelişimine katkı sağlayabilirsiniz.",
    image: "/assets/orphan-support-illustrations/nutrition.webp",
    alt: "Sağlıklı bir öğün ulaştırılan çocuk illüstrasyonu",
  },
  {
    title: "Yalnız Olmadığını Hissettirmeye",
    text: "Yapılan destek yalnızca maddi bir yardım değildir; bir çocuğa yanında insanların olduğunu ve yalnız olmadığını hissettiren güçlü bir dayanışmadır.",
    image: "/assets/orphan-support-illustrations/not-alone.webp",
    alt: "Bir çocuğun yanında olduğunu hissettiren gönüllü illüstrasyonu",
  },
];

function OrphanSupportImpactCards() {
  return (
    <section
      className="water-well-features food-parcel-features orphan-support-features"
      aria-label="Yetim desteğinin dönüştüğü destekler"
    >
      <header>
        <span>YETİM DESTEĞİ</span>
        <h2>Yetim Desteğiniz Neye Dönüşür?</h2>
        <p>
          Yetim desteği bağışlarınızla çocukların temel ihtiyaçlarına,
          eğitimlerine ve sağlıklı gelişimlerine katkı sağlıyor; onlara yalnız
          olmadıklarını hissettirmeyi amaçlıyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid orphan-support-feature-grid">
        {orphanSupportImpactItems.map((item) => (
          <div className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Yetim destekleri, çocukların öncelikli ihtiyaçları dikkate alınarak
          planlanmaktadır.
        </p>
      </aside>
    </section>
  );
}

const orphanClothingImpactItems = [
  {
    title: "Yeni Kıyafetlere",
    text: "Bir çocuğun ihtiyaç duyduğu yeni kıyafetlere kavuşmasına vesile olur.",
    image: "/assets/orphan-clothing-illustrations/new-clothes.webp",
    alt: "Bir çocuğa yeni kıyafetler teslim eden yardım görevlisi illüstrasyonu",
  },
  {
    title: "Bir Tebessüme",
    text: "Ulaştırılan destek, çocuğun yüzünde sevinç ve tebessüm oluşturur.",
    image: "/assets/orphan-clothing-illustrations/smile.webp",
    alt: "Yeni kıyafetleriyle tebessüm eden bir çocuk illüstrasyonu",
  },
  {
    title: "Değerli Hissetmeye",
    text: "Çocuğun kendisini değerli ve hatırlanmış hissetmesine katkı sağlar.",
    image: "/assets/orphan-clothing-illustrations/feel-valued.webp",
    alt: "Yeni montunu giyen çocuğa destek olan görevli illüstrasyonu",
  },
  {
    title: "Yalnız Olmadığını Hissettirmeye",
    text: "Yetim çocuklara yanlarında olduklarını hissettiren bir dayanışma vesilesidir.",
    image: "/assets/orphan-clothing-illustrations/not-alone.webp",
    alt: "Bir çocuğa yalnız olmadığını hissettiren yardım görevlisi illüstrasyonu",
  },
];

function OrphanClothingImpactCards() {
  return (
    <section
      className="water-well-features food-parcel-features orphan-clothing-features"
      aria-label="Yetim giydirme desteğinin etkileri"
    >
      <header>
        <h2>Bir Yetimi Giydirmek Neye Dönüşür?</h2>
        <p>
          Yetim giydirme bağışlarınızla ihtiyaç sahibi çocukların yeni
          kıyafetlere kavuşmasına, yüzlerinde tebessüm oluşmasına ve kendilerini
          değerli hissetmelerine destek oluyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid orphan-clothing-feature-grid">
        {orphanClothingImpactItems.map((item) => (
          <article className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <aside>
        <Sparkles aria-hidden="true" />
        <p>
          <strong>Not:</strong> Bir yetimi giydirme bedeli 1.500 TL’dir. 1.500
          TL altında veya üstünde bağış yaparak da destek olabilirsiniz.
        </p>
      </aside>
    </section>
  );
}

const mosqueImpactItems = [
  {
    title: "Güvenli Bir İbadet Alanına",
    text: "İnsanların namazlarını, dualarını ve ibadetlerini düzenli ve güvenli bir ortamda gerçekleştirebilmelerine imkân sağlar.",
    image: "/assets/mosque-impact-illustrations/safe-worship.webp",
    alt: "Güvenli ve huzurlu bir camiye yönelen insanların illüstrasyonu",
  },
  {
    title: "Birlikte Tutulan Saflara",
    text: "Aynı bölgede yaşayan insanların bir araya gelmesine ve ortak bir ibadet ortamında buluşmasına vesile olur.",
    image: "/assets/mosque-impact-illustrations/prayer-rows.webp",
    alt: "Cami içinde birlikte saf tutan cemaat illüstrasyonu",
  },
  {
    title: "Dayanışmanın Güçlenmesine",
    text: "Cami ve mescitler; yardımlaşma, paylaşma ve dayanışma duygularının geliştiği ortak yaşam alanlarına dönüşür.",
    image: "/assets/mosque-impact-illustrations/community-solidarity.webp",
    alt: "Cami çevresinde dayanışan bir topluluğun illüstrasyonu",
  },
  {
    title: "Kalıcı Bir Esere",
    text: "İbadethanesi bulunmayan bir bölgede inşa edilen cami veya mescit, uzun yıllar boyunca toplumun faydalanabileceği kalıcı bir eser olur.",
    image: "/assets/mosque-impact-illustrations/lasting-legacy.webp",
    alt: "Nesiller boyunca hizmet veren kalıcı bir cami illüstrasyonu",
  },
];

const worshipProjectDetails = {
  "cami:Bangladeş": [
    "Cami 100 m² büyüklüğünde olacaktır.",
    "Camide yaklaşık 120 kişi ibadet edebilecektir.",
    "Camide Kur’an-ı Kerim ve değerler eğitimi verilecektir.",
    "Cami, bölge halkının sosyal ihtiyaçları için de kullanılacaktır.",
    "Caminin minaresi olacaktır.",
    "WC ve abdest alma alanları yapılacaktır.",
  ],
  "cami:Uganda": [
    "Cami 100 m² büyüklüğünde olacaktır.",
    "Caminin ses sistemi olacaktır.",
    "24 m² büyüklüğünde imam evi yapılacaktır.",
    "Caminin bir adet minaresi olacaktır.",
    "Bay ve bayan lavaboları yapılacaktır.",
  ],
  "mescid:Tanzanya": [
    "Mescit 100 m² büyüklüğünde olacaktır.",
    "Mescitte yaklaşık 120 kişi ibadet edebilecektir.",
    "Mescitte 10 m² halı olacaktır.",
    "Mescidin ses sistemi olacaktır.",
    "Depolu su kuyusu yapılacaktır.",
    "Üç adet bay ve üç adet bayan WC yapılacaktır.",
  ],
  "cami:Somali": [
    "Cami 100 m² büyüklüğünde olacaktır.",
    "Caminin bir adet minaresi olacaktır.",
    "Caminin 100 m² zemini seramik yapılacaktır.",
    "Caminin zemin halısı olacaktır.",
    "Caminin mihrap ve minberi olacaktır.",
    "Caminin abdesthanesi olacaktır.",
  ],
};

function WorshipProjectDetails({ projectSlug, country, price, currency }) {
  const countryLabel = String(country || "");
  const isMasjid = /\s+Mescid$/i.test(countryLabel) || projectSlug === "mescid";
  const countryName = countryLabel.replace(/\s+(?:Cami|Mescid)$/i, "");
  const detailSlug = isMasjid ? "mescid" : "cami";
  const items = worshipProjectDetails[`${detailSlug}:${countryName}`];
  if (!items) return null;
  const projectType = isMasjid ? "Mescidi" : "Camisi";
  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
        numericPrice,
      )
    : null;
  const currencyLabel = currency === "USD" ? "$" : String(currency || "");
  return (
    <>
      <section className="madrasa-project-specs worship-project-specs">
        <header>
          <span>PROJE AYRINTILARI</span>
          <h3>
            {countryName} {projectType}
          </h3>
        </header>
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      {formattedPrice && (
        <p className="madrasa-donation-note worship-donation-note">
          <strong>NOT:</strong> {formattedPrice} {currencyLabel} altında veya
          üstünde bağışta bulunabilirsiniz.
        </p>
      )}
    </>
  );
}

function MosqueImpactCards() {
  return (
    <section
      className="water-well-features food-parcel-features mosque-impact-features"
      aria-label="Cami veya mescit desteğinin dönüştüğü kalıcı faydalar"
    >
      <header>
        <span>CAMİ VE MESCİT DESTEĞİ</span>
        <h2>Bir Cami veya Mescit Neye Dönüşür?</h2>
        <p>
          Cami ve mescit bağışlarınızla ibadethaneye ihtiyaç duyulan bölgelerde
          insanların namazlarını, dualarını ve ibadetlerini huzur içinde
          gerçekleştirebilecekleri kalıcı mekânların inşa edilmesine destek
          oluyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid mosque-impact-feature-grid">
        {mosqueImpactItems.map((item) => (
          <div className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Cami ve mescit projeleri, bölgenin ihtiyaçları ve yerel şartlar
          doğrultusunda planlanmaktadır.
        </p>
      </aside>
    </section>
  );
}

const madrasaImpactItems = [
  {
    title: "Düzenli Bir Eğitim Ortamına",
    text: "Eğitim imkânlarının sınırlı olduğu bölgelerde çocukların güvenli ve düzenli bir ortamda öğrenim görmesine katkı sağlar.",
    image: "/assets/madrasa-impact-illustrations/regular-learning.webp",
    alt: "Güvenli ve düzenli bir medrese sınıfında eğitim gören çocukların illüstrasyonu",
  },
  {
    title: "Kur’an ve Temel Dini Eğitime",
    text: "Öğrencilerin Kur’an-ı Kerim, temel dini bilgiler ve güzel ahlak eğitimi almasına imkân sunar.",
    image: "/assets/madrasa-impact-illustrations/quran-education.webp",
    alt: "Kur’an-ı Kerim ve temel dini bilgiler eğitimi alan öğrencilerin illüstrasyonu",
  },
  {
    title: "Değerlerle Yetişen Nesillere",
    text: "Sorumluluk, dayanışma ve güzel ahlak gibi değerlerin küçük yaşlardan itibaren öğrenilmesine katkı sağlar.",
    image: "/assets/madrasa-impact-illustrations/values.webp",
    alt: "Dayanışma ve güzel ahlak değerlerini öğrenen öğrencilerin illüstrasyonu",
  },
  {
    title: "Topluma Katkı Sağlayan Bireylere",
    text: "Medresede eğitim alan öğrenciler ilerleyen yıllarda öğretmen, imam veya hafız olarak yetişebilir ve bulundukları topluma katkı sağlayabilir.",
    image: "/assets/madrasa-impact-illustrations/community-contribution.webp",
    alt: "Öğretmen, imam ve hafız olarak topluma katkı sağlayan medrese mezunlarının illüstrasyonu",
  },
];

const madrasaProjectDetails = {
  Bangladeş: {
    items: [
      "Medrese 80 m² büyüklüğünde olacaktır.",
      "Medrese 75 öğrenci kapasitesine sahip olacaktır.",
      "Öğrencilerin %50’sini yetim, %50’sini diğer öğrenciler oluşturacaktır.",
      "Kur’an-ı Kerim eğitimi verilecektir.",
      "Temel dini bilgiler öğretilecektir.",
    ],
  },
  Somali: {
    items: [
      "Medrese 50 m² büyüklüğünde olacaktır.",
      "Vardiyalı eğitim sistemiyle 200 öğrenci eğitim görecektir.",
      "Kur’an-ı Kerim eğitimi verilecektir.",
      "Temel dini bilgiler eğitimi verilecektir.",
      "Ahlak eğitimi verilecektir.",
      "Öğrencilerin %80’ini yetim, %20’sini diğer öğrenciler oluşturacaktır.",
    ],
  },
  Etiyopya: {
    items: [
      "Medrese 40 m² büyüklüğünde olacaktır.",
      "Vardiyalı eğitim sistemiyle 100 öğrenci eğitim görecektir.",
      "Kur’an-ı Kerim eğitimi verilecektir.",
      "Hadis eğitimi verilecektir.",
      "Temel dini bilgiler eğitimi verilecektir.",
      "Yetim öğrencilerle birlikte diğer öğrenciler de eğitim görecektir.",
    ],
    note: "Bu medresenin 1 m² bedeli 300 $’dır. Bağışçılarımız talep etmeleri hâlinde daha büyük bir medrese yaptırabilir.",
  },
};

function MadrasaProjectDetails({ country, price, currency }) {
  const countryName = String(country || "").replace(/\s+Medrese$/i, "");
  const details = madrasaProjectDetails[countryName];
  if (!details) return null;
  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
        numericPrice,
      )
    : null;
  const currencyLabel = currency === "USD" ? "$" : String(currency || "");
  return (
    <>
      <section className="madrasa-project-specs">
        <header>
          <span>PROJE AYRINTILARI</span>
          <h3>{countryName} Medresesi</h3>
        </header>
        <ul>
          {details.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {details.note && (
          <aside>
            <strong>Not:</strong> {details.note}
          </aside>
        )}
      </section>
      {formattedPrice && (
        <p className="madrasa-donation-note">
          <strong>NOT:</strong> {formattedPrice} {currencyLabel} altında veya
          üstünde de bağışta bulunabilirsiniz.
        </p>
      )}
    </>
  );
}

function MadrasaImpactCards() {
  return (
    <section
      className="water-well-features food-parcel-features madrasa-impact-features"
      aria-label="Medrese desteğinin dönüştüğü kalıcı faydalar"
    >
      <header>
        <span>MEDRESE DESTEĞİ</span>
        <h2>Bir Medrese Neye Dönüşür?</h2>
        <p>
          Medrese bağışlarınızla eğitim imkânlarının sınırlı olduğu bölgelerde
          çocukların ve gençlerin düzenli bir öğrenme ortamına kavuşmasına
          destek oluyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid madrasa-impact-feature-grid">
        {madrasaImpactItems.map((item) => (
          <div className="water-well-feature-card" key={item.title}>
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Medrese projeleri, bölgenin eğitim ihtiyacı ve yerel imkânlar
          doğrultusunda şekillenmektedir.
        </p>
      </aside>
    </section>
  );
}

const waterWellProcessItems = [
  {
    title: "İhtiyaç ve Yer Tespiti",
    text: "Saha ekiplerimiz tarafından su kuyusuna ihtiyaç duyulan bölgeler belirlenir ve uygun yer tespiti yapılır.",
    image: "/assets/water-well-process/site-survey.webp",
    alt: "Su kuyusu için sahada ihtiyaç ve yer tespiti yapan ekip",
  },
  {
    title: "Sizinle İletişime Geçilir",
    text: "Kuyu bağışınızın ardından sizinle iletişime geçilerek ülke, kuyu türü ve süreçle ilgili detaylar paylaşılır.",
    image: "/assets/water-well-process/donor-contact.webp",
    alt: "Su kuyusu bağışçısıyla proje detaylarını görüşen görevli",
  },
  {
    title: "İsim ve Afiş Hazırlanır",
    text: "Kuyunuza vermek istediğiniz isim doğrultusunda afiş hazırlanır ve onayınıza sunulur.",
    image: "/assets/water-well-process/poster-preparation.webp",
    alt: "Su kuyusu için bağışçıya özel afiş hazırlayan görevli",
  },
  {
    title: "Kuyu Çalışması Başlatılır",
    text: "Onayınızın ardından ilgili saha ekibine kuyu siparişi iletilir ve belirlenen bölgede çalışmalar başlatılır.",
    image: "/assets/water-well-process/well-construction.webp",
    alt: "Su kuyusu yapım çalışmasını başlatan saha ekibi",
  },
  {
    title: "Kuyu Tamamlanır",
    text: "Bölgenin şartlarına ve kuyu türüne göre çalışmalar tamamlanarak su kuyusu kullanıma açılır.",
    image: "/assets/water-well-process/completed-well.webp",
    alt: "Tamamlanarak kullanıma açılan el pompalı su kuyusu",
  },
  {
    title: "Video ve Görseller Ulaştırılır",
    text: "Tamamlanan su kuyusuna ait video ve görseller hazırlanarak tarafınıza ulaştırılır.",
    image: "/assets/water-well-process/visual-report.webp",
    alt: "Tamamlanan su kuyusunun video ve görsellerini hazırlayan görevli",
  },
];

function WaterWellProcess() {
  return (
    <section
      className="water-well-process"
      aria-label="Su kuyusu açılış aşamaları"
    >
      <header>
        <h2>Su Kuyunuz Nasıl Açılıyor?</h2>
        <p>
          Bağışınızın planlanmasından kuyunun tamamlanmasına kadar geçen süreci
          adım adım takip ediyoruz.
        </p>
      </header>
      <div className="water-well-process-grid">
        {waterWellProcessItems.map((item, index) => (
          <div className="water-well-process-card" key={item.title}>
            <span className="water-well-process-number" aria-hidden="true">
              {index + 1}
            </span>
            <div className="water-well-process-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const zakatImpactSteps = [
  {
    title: "İhtiyaç Sahibi Ailelere",
    text: "Geçim sıkıntısı yaşayan ihtiyaç sahibi ailelere destek ulaştırıyoruz.",
    image: "/assets/zakat-temel-ihtiyac-v1.webp",
    alt: "İhtiyaç sahibi ailelere ulaştırılan zekât desteği",
  },
  {
    title: "Yetim ve Çocukların İhtiyaçlarına",
    text: "Zekât almaya ehil yetim ve çocukların ihtiyaçlarının karşılanmasına katkı sağlıyoruz.",
    image: "/assets/zakat-yetim-destegi-v1.webp",
    alt: "Yetim ve çocuklara ulaştırılan ihtiyaç desteği",
  },
  {
    title: "Öğrencilerin Eğitim İhtiyaçlarına",
    text: "İhtiyaç sahibi öğrencilerin eğitim ihtiyaçlarına destek oluyoruz.",
    image: "/assets/zakat-egitim-destegi-v1.webp",
    alt: "İhtiyaç sahibi öğrencilere ulaştırılan eğitim desteği",
  },
  {
    title: "Borçların Hafifletilmesine",
    text: "Borç yükü altında bulunan ve zekât almaya ehil kişilerin borçlarının hafifletilmesine katkıda bulunuyoruz.",
    image: "/assets/zakat-debt-relief-v1.webp",
    alt: "Zekât almaya ehil ihtiyaç sahiplerine ulaştırılan destek",
  },
  {
    title: "Afetlerden Etkilenenlere",
    text: "Afetlerden etkilenen ve zekât almaya ehil ihtiyaç sahiplerine destek sağlıyoruz.",
    image: "/assets/program-emergency.webp",
    alt: "Afet bölgesinde ihtiyaç sahiplerine ulaştırılan yardım",
  },
  {
    title: "Savaş ve İnsani Krizlerden Etkilenenlere",
    text: "Savaş ve insani krizlerden etkilenen, zekât almaya ehil ihtiyaç sahiplerine destek ulaştırıyoruz.",
    image: "/assets/zakat-war-crisis-support-v1.webp",
    alt: "Savaş ve insani krizlerden etkilenen ihtiyaç sahipleri",
  },
  {
    title: "Yurt Dışındaki İhtiyaç Sahiplerine",
    text: "Yurt dışında farklı bölgelerde bulunan zekât almaya ehil ihtiyaç sahiplerine ulaşıyoruz.",
    image: "/assets/zakat-international-aid-v1.webp",
    alt: "Yurt dışındaki ihtiyaç sahiplerine ulaştırılan insani yardım",
  },
  {
    title: "Ulaşılması Güç Bölgelerdeki İhtiyaç Sahiplerine",
    text: "Bağışçılarımızın tek başına ulaşamayacağı bölgelerdeki ihtiyaç sahiplerine ulaşılmasına vesile oluyoruz.",
    image: "/assets/zakat-remote-region-aid-v1.webp",
    alt: "Ulaşılması güç bölgelerde ihtiyaç sahiplerine ulaştırılan yardım",
  },
  {
    title: "Mahremiyet ve Onuru Gözeten Dağıtımla",
    text: "Zekât çalışmalarımızı ihtiyaç sahiplerinin mahremiyetini ve onurunu gözeterek gerçekleştiriyoruz.",
    image: "/assets/zakat-gida-destegi-v1.webp",
    alt: "İnsan onuru ve mahremiyeti gözetilerek ulaştırılan zekât desteği",
  },
];

function ZakatImpactSteps() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`zakat-impact-steps${visible ? " is-visible" : ""}`}
      aria-labelledby="zakat-impact-title"
    >
      <header>
        <span>ADIM ADIM İYİLİK</span>
        <h2 id="zakat-impact-title">Zekâtlarınızla Neler Yapılıyor?</h2>
        <p>
          Zekâtlarınız, zekât almaya ehil ihtiyaç sahiplerinin ihtiyaçlarının
          karşılanmasına yönelik çalışmalarda değerlendirilmektedir.
        </p>
      </header>
      <div className="zakat-impact-step-grid">
        {zakatImpactSteps.map((item, index) => {
          return (
            <article
              className="zakat-impact-step"
              key={item.title}
              style={{ "--zakat-step-delay": `${index * 110}ms` }}
            >
              <span className="zakat-impact-number">{index + 1}</span>
              <div className="zakat-impact-visual">
                <img src={item.image} alt={item.alt} loading="lazy" />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="zakat-impact-note">
        <strong>Not:</strong> Zekât çalışmalarımız, zekâtın verilebileceği
        kimseler gözetilerek; ihtiyaç sahiplerinin mahremiyeti ve insan onuru
        korunarak yürütülmektedir.
      </p>
    </section>
  );
}

function ZakatDetailInformation() {
  return (
    <>
      <span className="zakat-section-kicker">ZEKÂT NEDİR?</span>
      <h2>Zekât Nedir?</h2>
      <p>
        Zekât, İslam’ın temel ibadetlerinden biridir. Maddi imkânları belirli
        bir ölçünün (nisap) üzerinde olan Müslümanların, sahip oldukları zekâta
        tabi mallarının belirli bir kısmını, dinen zekât almaya hak kazanan
        kimselere vermesidir.
      </p>
      <p>
        Zekât yalnızca maddi bir yardım değil, aynı zamanda farz bir{" "}
        <strong>ibadettir</strong>. Müslüman, zekâtını vererek Allah’ın emrini
        yerine getirir, malındaki zekât hakkını sahiplerine ulaştırır ve
        toplumdaki dayanışmaya katkıda bulunur.
      </p>
      <p>
        Zekâtınızı <strong>Yedirenk Derneğimiz</strong> aracılığıyla{" "}
        <strong>
          yurt içinde ve yurt dışında zekât almaya ehil ihtiyaç sahiplerine
        </strong>{" "}
        ulaştırabilirsiniz.
      </p>

      <section className="zakat-copy-section">
        <span className="zakat-section-kicker">EMANETİNİZİ ULAŞTIRIYORUZ</span>
        <h2>Zekâtınızla İyiliği Uzaklara Ulaştırıyoruz</h2>
        <p>
          Her insanın ihtiyaç sahibine bizzat ulaşması mümkün olmayabilir.
          Bizler, bağışçılarımızın emanet ettiği zekâtları ihtiyaç sahiplerine
          ulaştırmak için yurt içinde ve yurt dışında çalışmalar yürütüyoruz.
        </p>
        <p>
          Yurt içinde farklı şehirlerde bulunan ihtiyaç sahibi ailelere; yurt
          dışında ise yoksulluk, afet, savaş ve insani krizlerden etkilenen,
          zekât almaya ehil ihtiyaç sahiplerine ulaşmayı hedefliyoruz.
        </p>
        <p>
          Zekâtlarınızı emanet olarak kabul ediyor, zekâtın verilebileceği
          kimselere ulaştırılması konusunda gerekli hassasiyeti gözetiyoruz.
        </p>
      </section>

      <section className="zakat-trust-section">
        <span className="zakat-section-kicker">HASSASİYETLE VE GÜVENLE</span>
        <h2>Zekâtınız Bir Emanettir</h2>
        <p>
          Bize emanet ettiğiniz her zekât, ihtiyaç sahibine ulaştırılması
          gereken bir emanettir.
        </p>
        <p>
          Bizim görevimiz; bu emaneti hassasiyetle teslim almak, zekâtın
          verilebileceği kimseleri gözetmek ve bağışçılarımızın zekâtlarını
          ihtiyaç sahiplerine ulaştırmaktır.
        </p>
        <p className="zakat-trust-callout">
          <strong>
            Zekâtınızla bir sofraya, bir aileye, bir öğrenciye ve bir ihtiyaç
            sahibine umut olabilirsiniz.
          </strong>
          <span>Zekâtınızı emanet edin, iyilik ihtiyaç sahibine ulaşsın.</span>
        </p>
        <blockquote className="zakat-verse">
          <p>
            “Sadakalar (zekâtlar) Allah’tan bir farz olarak ancak fakirler,
            miskinler, zekât toplayan görevliler, kalpleri İslâm’a ısındırılacak
            olanlar, esaretten kurtulacak olanlar, borçlular, Allah yolunda
            olanlar ve yolda kalmışlar içindir. Allah hakkıyla bilendir, hüküm
            ve hikmet sahibidir.”
          </p>
          <cite>Tevbe Suresi, 60. Ayet</cite>
        </blockquote>
      </section>
      <ZakatImpactSteps />
    </>
  );
}

const communityMealSupportItems = [
  {
    title: "Sıcak Bir Öğün",
    text: "İhtiyaç sahibi insanların günlük yemek ihtiyacına destek olarak sıcak yemek ulaştırılmasına vesile olursunuz.",
    image: "/assets/community-meal-illustrations/warm-meal.webp",
    alt: "İhtiyaç sahiplerine sıcak yemek sunan gönüllülerin illüstrasyonu",
  },
  {
    title: "Paylaşılan Bir Sofra",
    text: "Hazırlanan yemekler ihtiyaç sahipleriyle paylaşılır; bağışınız aynı sofrada birçok insana ulaşır.",
    image: "/assets/community-meal-illustrations/shared-table.webp",
    alt: "Aynı sofrada sıcak yemek paylaşan ailelerin illüstrasyonu",
  },
  {
    title: "Dayanışmaya Destek",
    text: "Toplu yemek bağışınızla temel gıda ihtiyacı yaşayan insanların yanında olabilir, yardımlaşma ve paylaşmaya katkı sağlayabilirsiniz.",
    image: "/assets/community-meal-illustrations/solidarity.webp",
    alt: "Toplu yemek desteğini ailelere ulaştıran gönüllülerin illüstrasyonu",
  },
];

function CommunityMealSupportCards() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`water-well-features community-meal-features${
        visible ? " is-visible" : ""
      }`}
      aria-labelledby="community-meal-support-title"
    >
      <header>
        <span>TOPLU YEMEK DESTEĞİ</span>
        <h2 id="community-meal-support-title">
          Toplu Yemek Bağışınız Neye Dönüşüyor?
        </h2>
        <p>
          Toplu yemek bağışlarınızla ihtiyaç sahibi insanların sofralarına sıcak
          yemek ulaştırıyor, paylaşmanın bereketini birlikte büyütüyoruz.
        </p>
      </header>
      <div className="water-well-feature-grid community-meal-feature-grid">
        {communityMealSupportItems.map((item, index) => (
          <article
            className="water-well-feature-card"
            key={item.title}
            style={{ "--community-meal-delay": `${index * 140}ms` }}
          >
            <div className="water-well-feature-visual">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <aside>
        <strong>Not:</strong>
        <p>
          Toplu yemek çalışmaları, ihtiyaç duyulan bölgelerde planlı şekilde
          gerçekleştirilmektedir.
        </p>
      </aside>
    </section>
  );
}

function GoldCoinsIcon() {
  return (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      focusable="false"
      style={{ color: "#a86f00" }}
    >
      <ellipse
        cx="14"
        cy="10"
        rx="8"
        ry="3.5"
        fill="#ffd45a"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 10v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-5"
        fill="#f4b82e"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="22"
        cy="20"
        rx="8"
        ry="3.5"
        fill="#ffe184"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 20v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-5"
        fill="#f4b82e"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M22 18.5v10"
        fill="none"
        stroke="#fff2b5"
        strokeWidth="1"
        opacity=".8"
      />
    </svg>
  );
}

const projectIcons = {
  "adak-akika-nafile-kurban": CattleHeadIcon,
  "su-kuyusu": Droplets,
  "gida-kolisi": PackageCheck,
  "toplu-yemek": UtensilsCrossed,
  "gazze-yardim": PalestineFlagIcon,
  "turkiye-projeleri": TurkishFlagIcon,
  "yetim-hamiligi": UsersRound,
  "yetim-giydirme": Sparkles,
  zekat: GoldCoinsIcon,
  medrese: BookOpen,
  cami: Landmark,
  mescid: Globe2,
};

function projectGroupKey(project) {
  if (project.category === "Yetim") return "yetim";
  if (["cami", "mescid"].includes(project.slug)) return "cami-mescid";
  return project.slug;
}

function projectGroupLabel(project) {
  const labels = {
    "gazze-yardim": "Gazze Yardım",
    "turkiye-projeleri": "Türkiye",
    "adak-akika-nafile-kurban": "Kurban",
    "su-kuyusu": "Su Kuyusu",
    "gida-kolisi": "Gıda Kolisi",
    "toplu-yemek": "Toplu Yemek",
    zekat: "Zekat",
    medrese: "Medrese",
  };
  if (projectGroupKey(project) === "yetim") return "Yetim";
  if (projectGroupKey(project) === "cami-mescid") return "Cami & Mescit";
  return labels[project.slug] || project.title;
}

const countryVariantProjectSlugs = new Set([
  "adak-akika-nafile-kurban",
  "su-kuyusu",
  "gida-kolisi",
  "toplu-yemek",
  "yetim-hamiligi",
  "yetim-giydirme",
  "medrese",
  "cami",
  "mescid",
]);

function projectDetailCategoryLabel(project) {
  if (project.slug === "su-kuyusu") return "Su Kuyusu";
  return project.category;
}

function projectDetailVariantLabel(project, variant) {
  const variantName = variant?.[0] || "";
  if (!countryVariantProjectSlugs.has(project.slug))
    return variantName || project.title;
  if (project.slug === "su-kuyusu")
    return variantName.split(" · ").slice(1).join(" · ") || project.title;
  return project.title;
}

function projectDetailBadgeLabel(project, variant) {
  if (project.slug === "gazze-yardim") return variant?.[0] || project.title;
  if (countryVariantProjectSlugs.has(project.slug)) return project.title;
  return projectDetailCategoryLabel(project);
}

function uniqueProjectGroups(projects) {
  const projectOrder = [
    "gazze-yardim",
    "adak-akika-nafile-kurban",
    "su-kuyusu",
    "gida-kolisi",
    "yetim",
    "zekat",
    "medrese",
    "cami-mescid",
    "toplu-yemek",
  ];
  return projects
    .filter(
      (project, index, list) =>
        list.findIndex(
          (candidate) =>
            projectGroupKey(candidate) === projectGroupKey(project),
        ) === index,
    )
    .sort(
      (a, b) =>
        projectOrder.indexOf(projectGroupKey(a)) -
        projectOrder.indexOf(projectGroupKey(b)),
    );
}

function visibleProjectCardCount(project, projects) {
  const groupKey = projectGroupKey(project);
  const groupedProjects = projects.filter(
    (candidate) => projectGroupKey(candidate) === groupKey,
  );

  if (groupKey === "yetim") return groupedProjects.length;
  if (groupKey === "cami-mescid")
    return groupedProjects.reduce(
      (total, candidate) =>
        total + Math.max(1, candidate.variants?.length || 0),
      0,
    );
  if (
    project.calculator ||
    ["adak-akika-nafile-kurban", "gida-kolisi", "toplu-yemek"].includes(
      project.slug,
    )
  )
    return 1;
  if (project.slug === "su-kuyusu")
    return new Set(
      (project.variants || []).map(
        (variant) => String(variant?.[0] || "").split(" · ")[0],
      ),
    ).size;
  if (project.slug === "turkiye-projeleri")
    return Math.max(1, (project.variants?.length || 0) - 1);
  return Math.max(1, project.variants?.length || 0);
}

function projectGroupIcon(project) {
  const iconSlug =
    projectGroupKey(project) === "cami-mescid" ? "cami" : project.slug;
  return projectIcons[iconSlug] || HandHeart;
}
const submenuIcons = {
  Hakkımızda: CircleUserRound,
  "Biz Kimiz?": CircleUserRound,
  "Başkanın Mesajı": UsersRound,
  "Kurumsal Kimlik": BadgeCheck,
  Tüzük: BookOpen,
  KVKK: ShieldCheck,
  "İlham Kaynağımız": CalendarDays,
  "Misyon & Vizyon": Target,
  Kurumsal: UsersRound,
  "Etik Değerler": HeartHandshake,
  "Bağışçı Hakları": HandHeart,
  Şeffaflık: BadgeCheck,
  "Bilgi Güvenliği": ShieldCheck,
  Gazze: Globe2,
  "İnsani Yardım": HandHeart,
  "Afet ve Kriz Yardımı": PackageCheck,
  Yetim: UsersRound,
  Su: Droplets,
  Katarakt: CircleUserRound,
  Eğitim: BookOpen,
  Kültür: Sparkles,
  Yardımlaşma: HandHeart,
  "Arama Kurtarma": ShieldCheck,
  "Bağış Yap": HandHeart,
  "Sponsor Ol": HeartHandshake,
  "Su Kuyusu Açtır": Droplets,
  "Gönüllü Ol": UsersRound,
  "Zekât Hesapla": Calculator,
  "Hesap Numaraları": Banknote,
  "Bültene Katıl": Mail,
  Yayınlar: BookOpen,
};
const currencySymbols = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" };
const EXCHANGE_RATE_CACHE_KEY = "yedirenk-exchange-rates-v1";
const EXCHANGE_RATE_ENDPOINT =
  "https://api.frankfurter.dev/v2/rate/USD/TRY?providers=TCMB";
const defaultExchangeRateState = {
  rates: { TRY: 1, USD: 47.8724, EUR: 55, GBP: 65 },
  date: "2026-08-19",
  source: "TCMB",
  status: "fallback",
};
const cachedExchangeRateState = (() => {
  try {
    if (typeof window === "undefined") return null;
    const cached = JSON.parse(
      window.localStorage.getItem(EXCHANGE_RATE_CACHE_KEY) || "null",
    );
    return Number(cached?.rates?.USD) > 0 ? cached : null;
  } catch {
    return null;
  }
})();
let exchangeRateState = cachedExchangeRateState || defaultExchangeRateState;
let exchangeRates = exchangeRateState.rates;

function useLiveExchangeRates() {
  const [state, setState] = useState(exchangeRateState);
  useEffect(() => {
    const controller = new AbortController();
    const loadCurrentRate = async () => {
      try {
        const response = await fetch(EXCHANGE_RATE_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Kur bilgisi alınamadı.");
        const payload = await response.json();
        const usdRate = Number(payload?.rate);
        if (!Number.isFinite(usdRate) || usdRate <= 0)
          throw new Error("Geçersiz kur bilgisi.");
        exchangeRateState = {
          rates: { ...exchangeRates, TRY: 1, USD: usdRate },
          date: payload.date || new Date().toISOString().slice(0, 10),
          source: "TCMB",
          status: "live",
          updatedAt: Date.now(),
        };
        exchangeRates = exchangeRateState.rates;
        window.localStorage.setItem(
          EXCHANGE_RATE_CACHE_KEY,
          JSON.stringify(exchangeRateState),
        );
        setState(exchangeRateState);
      } catch (error) {
        if (error?.name !== "AbortError") setState(exchangeRateState);
      }
    };
    loadCurrentRate();
    return () => controller.abort();
  }, []);
  return state;
}

const money = (price, currency = "TRY") =>
  `${Number(price).toLocaleString("tr-TR")} ${currencySymbols[currency] || currency}`;
const toTRY = (price, currency = "TRY") => {
  const amount = Number(price) * (exchangeRates[currency] || 1);
  return currency === "TRY" ? amount : Math.round(amount * 100) / 100;
};
const projectVariantImage = (project, index = 0) =>
  project.variants?.[index]?.[3] || project.image;
const projectCategoryCoverImage = (project, variant, index = 0) => {
  const projectCovers = {
    "adak-akika-nafile-kurban": "/assets/project-cover-kurban-user-v1.webp",
    "su-kuyusu": "/assets/project-cover-su-kuyusu-user-v1.webp",
    "gida-kolisi": "/assets/project-cover-gida-kolisi-user-v1.webp",
    zekat: "/assets/project-cover-zekat-user-v1.webp",
    "yetim-hamiligi": "/assets/project-cover-yetim-hamiligi-user-v1.webp",
    "yetim-giydirme": "/assets/project-cover-yetim-giyim-user-v1.webp",
    "toplu-yemek": "/assets/project-cover-toplu-yemek-user-v1.webp",
  };
  if (project.slug === "gazze-yardim") {
    const gazzeCovers = {
      "Su Tankeri": "/assets/gazze-cover-su-tankeri-v3.webp",
      "Ekmek Dağıtımı": "/assets/gazze-cover-ekmek-dagitimi-v3.webp",
      "Gıda Kolisi": "/assets/gazze-cover-gida-kolisi-v3.webp",
      "Sebze Kolisi": "/assets/gazze-cover-sebze-kolisi-v3.webp",
      "Toplu Yemek Dağıtımı": "/assets/gazze-cover-toplu-yemek-v3.webp",
      "Un Dağıtımı": "/assets/gazze-cover-un-dagitimi-v3.webp",
      "Ameliyat Projesi": "/assets/gazze-cover-ameliyat-v3.webp",
      "Bebek Maması Yardımı": "/assets/gazze-cover-bebek-mamasi-v3.webp",
      "Eğitim Çadırı": "/assets/gazze-cover-egitim-cadiri-v3.webp",
    };
    return gazzeCovers[variant?.[0]] || projectVariantImage(project, index);
  }
  if (project.slug === "turkiye-projeleri") {
    return variant?.[3] || project.image;
  }
  if (project.slug === "medrese") {
    const country = String(variant?.[0] || "").replace(/\s+Medrese$/i, "");
    const madrasaCovers = {
      Bangladeş: "/assets/project-cover-medrese-banglades-user-v1.webp",
      Somali: "/assets/project-cover-medrese-somali-user-v1.webp",
      Etiyopya: "/assets/project-cover-medrese-etiyopya-user-v1.webp",
    };
    return madrasaCovers[country] || projectVariantImage(project, index);
  }
  if (["cami", "mescid"].includes(project.slug)) {
    const country = String(variant?.[0] || "").replace(
      /\s+(Cami|Mescid)$/i,
      "",
    );
    const worshipCovers = {
      Bangladeş: "/assets/project-bir-saf-daha-banglades-v2.webp",
      Uganda: "/assets/project-bir-saf-daha-uganda-v2.webp",
      Somali: "/assets/project-bir-saf-daha-somali-v2.webp",
      Tanzanya: "/assets/project-bir-saf-daha-tanzanya-v2.webp",
    };
    return worshipCovers[country] || projectVariantImage(project, index);
  }
  return (
    project.cardImage ||
    projectCovers[project.slug] ||
    projectVariantImage(project, index)
  );
};
const isVideoMedia = (src = "") =>
  typeof src === "string" &&
  (src.startsWith("data:video/") || /\.(mp4|webm|ogg)(\?|$)/i.test(src));
function Media({ src, alt = "", className = "", background = false }) {
  return isVideoMedia(src) ? (
    <video
      className={className}
      src={src}
      controls={!background}
      autoPlay={background}
      muted={background}
      loop={background}
      playsInline
      preload="metadata"
    />
  ) : (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

const waterWellVideoSources = {
  low: "/assets/video/su-kuyusu-480.mp4",
  medium: "/assets/video/su-kuyusu-720.mp4",
  high: "/assets/video/su-kuyusu-720.mp4",
};

function preferredWaterWellVideoQuality() {
  if (typeof navigator === "undefined") return "medium";
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return "medium";

  if (
    connection?.saveData ||
    ["slow-2g", "2g"].includes(connection?.effectiveType)
  ) {
    return "low";
  }
  if (connection?.effectiveType === "3g") return "medium";
  return "high";
}

function WaterWellDetailVideo() {
  const location = useLocation();
  const checkoutOpen = Boolean(location.state?.checkoutOpen);
  const [quality, setQuality] = useState(preferredWaterWellVideoQuality);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const autoplayAttempted = useRef(false);
  const resumeAfterCheckout = useRef(false);

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (!connection?.addEventListener) return undefined;

    const updateQuality = () => setQuality(preferredWaterWellVideoQuality());
    connection.addEventListener("change", updateQuality);
    return () => connection.removeEventListener("change", updateQuality);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (checkoutOpen) {
      resumeAfterCheckout.current = !video.paused;
      video.pause();
      return;
    }
    if (resumeAfterCheckout.current) {
      resumeAfterCheckout.current = false;
      video.play().catch(() => {});
    }
  }, [checkoutOpen, quality]);

  const startPlayback = (video) => {
    if (checkoutOpen) {
      video.pause();
      return;
    }
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;
    video.muted = false;
    video
      .play()
      .then(() => setIsMuted(false))
      .catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video || checkoutOpen) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    video.play().catch(() => {});
  };

  return (
    <div className="water-well-video-shell">
      <video
        key={quality}
        ref={videoRef}
        className="water-well-detail-video"
        src={waterWellVideoSources[quality]}
        poster="/assets/project-derinden-gelen-hayat-yedirenk-v1.webp"
        aria-label="Yedirenk Su Kuyusu projesi tanıtım videosu"
        autoPlay={!checkoutOpen}
        muted={isMuted}
        loop
        playsInline
        controls
        preload="metadata"
        onCanPlay={(event) => startPlayback(event.currentTarget)}
      />
      <button
        type="button"
        className="water-well-sound-toggle"
        onClick={toggleSound}
        aria-label={isMuted ? "Videonun sesini aç" : "Videonun sesini kapat"}
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
        <span>Ses</span>
      </button>
    </div>
  );
}

function usePageSeo({ title, description, image, type = "website", exactTitle = false, canonicalPath }) {
  const location = useLocation();
  useEffect(() => {
    const fullTitle = exactTitle ? title : `${title} | Yedirenk Derneği`;
    const canonical = `${window.location.origin}${canonicalPath ?? location.pathname}`;
    const absoluteImage = image
      ? new URL(image, window.location.origin).href
      : undefined;
    document.title = fullTitle;
    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const [key, name] = attribute.split("=");
        element.setAttribute(key, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name=description", description);
    setMeta('meta[property="og:title"]', "property=og:title", fullTitle);
    setMeta(
      'meta[property="og:description"]',
      "property=og:description",
      description,
    );
    setMeta('meta[property="og:type"]', "property=og:type", type);
    setMeta('meta[property="og:url"]', "property=og:url", canonical);
    setMeta(
      'meta[name="twitter:card"]',
      "name=twitter:card",
      "summary_large_image",
    );
    if (absoluteImage) {
      setMeta('meta[property="og:image"]', "property=og:image", absoluteImage);
      setMeta(
        'meta[name="twitter:image"]',
        "name=twitter:image",
        absoluteImage,
      );
    }
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [canonicalPath, description, exactTitle, image, location.pathname, title, type]);
}
const projectLongCopy = {
  "adak-akika-nafile-kurban": [
    "Kurban bağışınızı Afrika 4.800 TL, Bangladeş 6.900 TL, Yemen 6.900 TL, Afganistan 6.900 TL veya Türkiye 20.000 TL seçeneklerinden biriyle gerçekleştirebilirsiniz. Bedel; kurbanlığın temini, veteriner kontrolü, kesim, parçalama ve ihtiyaç sahiplerine dağıtım giderlerini kapsar.",
    "Dağıtımlarda düzenli geliri olmayan ailelere, yetim ve öksüz çocukların bulunduğu hanelere, yaşlılara, engellilere ve çatışma ya da afet nedeniyle yerinden edilmiş kişilere öncelik verilir. Bir kurban hissesi, bölgedeki hane büyüklüğüne göre birden fazla ailenin et ihtiyacına katkı sağlar.",
    "Kurbanlıklar sağlık ve yaş uygunluğu kontrol edilerek seçilir. Kesim, bağışçı vekâleti ve dini usuller gözetilerek saha ekiplerinin denetiminde yapılır; etler aynı bölgede önceden tespit edilen hak sahiplerine ulaştırılır. Uygulama sonrasında ülke, kesim ve dağıtım bilgileri kayıt altına alınır.",
    "Tutarlar ülkeye göre hayvan tedariki, ulaşım ve saha maliyetleri değiştiği için farklıdır. Seçtiğiniz ülke ve sabit varyant tutarı ödeme özetinde açıkça gösterilir; bağış yalnızca seçilen Kurban projesi kapsamında değerlendirilir.",
    "Afrika, Bangladeş, Yemen, Afganistan ve Türkiye seçeneklerinde ihtiyaç tespiti yapılan ailelere öncelik verilir. Dağıtım planı hane büyüklüğü ve kırılganlık durumu dikkate alınarak hazırlanır.",
    "Bağış sürecinde seçtiğiniz ülke, kurban bedeli ve adet bilgisi sepette korunur. Saha organizasyonu tamamlandığında kesim ve dağıtım süreci uygulama kayıtlarına işlenir; vekâletle yürütülen kurban çalışmasının başından sonuna kadar izlenebilir olması amaçlanır.",
  ],
  "su-kuyusu": [
    "Temiz suya erişemeyen topluluklarda çocuklar ve aileler her gün uzak mesafelerden su taşımak zorunda kalıyor. Güvenli olmayan kaynaklar; bulaşıcı hastalıklara, eğitim kaybına ve ailelerin günlük yaşam yükünün artmasına neden oluyor.",
    "Yedirenk Su Kuyusu Projesi’nde yeraltı suyu, nüfus yoğunluğu ve yerleşimin mevcut su kaynakları incelenir. Uygun nokta belirlendikten sonra sondaj veya tulumbalı kuyu kurulumu gerçekleştirilir; suyun kullanıma uygunluğu kontrol edilir ve yerel bakım sorumluluğu oluşturulur.",
    "Desteğiniz yalnızca bir yapı inşa etmez. Çocukların okula ayırabildiği zamanı artırır, ailelerin sağlık riskini azaltır ve bütün bir yerleşimin temiz suya sürdürülebilir biçimde ulaşmasına katkı sağlar.",
    "Bangladeş Tulumbalı Kuyu seçeneği 500 USD, 12 Musluklu Kuyu seçeneği 1.500 USD’dir. Bedel; yer tespiti, sondaj, kuyu ekipmanı, platform, su testi, kurulum ve ilk bakım organizasyonunu kapsar. Seçilen kuyu tipi ve güncel tutar ödeme özetinde ayrıca gösterilir.",
    "Tulumbalı kuyu daha küçük yerleşimlerin günlük içme ve kullanım suyu ihtiyacına yöneliktir. 12 musluklu sistem ise okul, ibadethane veya nüfusu daha yoğun ortak kullanım noktalarında aynı anda daha fazla kişinin güvenli suya erişebilmesi için planlanır.",
    "Uygulama tamamlandığında kuyu konumu, tamamlanma durumu ve saha teslim bilgileri kayıt altına alınır. Yerel bir bakım sorumlusu belirlenerek küçük arızaların takibi ve sürdürülebilir kullanım için bilgilendirme yapılır.",
  ],
  "gida-kolisi": [
    "Gıda kolisi desteği, Afrika, Asya ve Türkiye’de temel gıdaya erişmekte zorlanan ailelerin belirli bir dönem boyunca mutfak ihtiyaçlarını karşılamayı amaçlar. Bağış sırasında dağıtım bölgesini Afrika, Asya ve Türkiye olarak seçebilirsiniz.",
    "Pirinç, un, yağ, bakliyat, şeker ve benzeri dayanıklı temel ürünler yerel tedarikçilerden temin edilir. Hak sahipleri saha ekiplerince doğrulanır; teslimler mahremiyeti ve insan onurunu koruyan bir yöntemle gerçekleştirilir.",
    "Tek koliyle bir aileye destek olabilir veya manuel tutar alanını kullanarak daha fazla hanenin gıda ihtiyacına katkıda bulunabilirsiniz.",
    "Afrika, Asya ve Türkiye Gıda Kolisi seçeneklerinin her birinin bedeli 2.000 TL’dir. Tutar; ürünlerin tedariki, paketlenmesi, saha lojistiği ve seçilen bölgede doğrulanmış hak sahibine teslimini kapsar. Ürün içeriği uygulama bölgesindeki temel tüketim alışkanlıklarına ve erişilebilir tedarik koşullarına göre dengelenir.",
    "Öncelik; düzenli geliri bulunmayan hanelere, çocuklu ailelere, yaşlı veya engelli bireylerin yaşadığı evlere ve afet ya da çatışmadan etkilenen kişilere verilir. Dağıtım listeleri yerel saha ekipleri tarafından ihtiyaç düzeyine göre kontrol edilir.",
    "Teslim sırasında insan onurunu koruyan, kalabalık ve teşhir oluşturmayan yöntemler tercih edilir. Tedarik ve dağıtım adetleri kayıt altına alınarak bağışın seçilen yardım alanında kullanılması güvenceye alınır.",
  ],
  "toplu-yemek": [
    "Dünyanın birçok bölgesinde insanlar yoksulluk ve açlık nedeniyle temel gıda ihtiyaçlarını karşılamakta güçlük çekiyor. Günlük bir öğün yemek dahi bazı aileler için önemli bir ihtiyaç hâline gelebiliyor.",
    "Toplu yemek çalışmalarımızla ihtiyaç sahibi insanlara sıcak yemek ikram ediyor; bağışçılarımızın desteğini paylaşılmış bir sofraya dönüştürüyoruz.",
  ],
  "gazze-yardim": [
    "Gazze Yardım çalışmaları, sahadan doğrulanan güncel ihtiyaçlara göre dokuz ayrı proje başlığında yürütülür. Su Tankeri, Ekmek Dağıtımı, Gıda Kolisi, Sebze Kolisi, Toplu Yemek Dağıtımı ve Un Dağıtımı temel yaşam ihtiyaçlarına doğrudan destek sağlar.",
    "Su Tankeri projesi güvenli içme ve kullanım suyunu toplu yaşam alanlarına ulaştırır. Ekmek, un ve toplu yemek çalışmaları günlük gıdaya erişimi destekler; dağıtım noktaları erişilebilirlik ve nüfus yoğunluğu dikkate alınarak belirlenir.",
    "Gıda Kolisi ile Sebze Kolisi projelerinde içerikler hane büyüklüğü, yerel beslenme alışkanlıkları ve sahadaki tedarik koşullarına göre hazırlanır. Teslimler doğrulanmış ailelere, insan onurunu koruyan bir düzen içinde yapılır.",
    "Ameliyat Projesi; uygunluğu sağlık ekiplerince değerlendirilen hastaların ameliyat, tıbbi malzeme ve ilgili tedavi giderlerine katkı sağlar. Hasta mahremiyeti ve tıbbi önceliklendirme esas alınır.",
    "Bebek Maması Yardımı projesi çocukların temel beslenme ihtiyacına destek olur. Eğitim Çadırı projesi ise çocukların güvenli öğrenme alanlarına, temel eğitim materyallerine ve düzenli ders desteğine erişmesini amaçlar. Çocukların kimlik ve mahremiyet bilgileri korunur.",
    "Bağışınız seçtiğiniz proje için kullanılır. Uygulamalarda ihtiyaç önceliği, hane büyüklüğü, çocuk, yaşlı, engelli veya hasta bireylerin durumu dikkate alınır; tedarik ve teslim süreçleri kayıt altına alınır.",
  ],
  "turkiye-projeleri": [
    "Türkiye’deki ihtiyaç sahibi aileler",
    "Gıda, barınma, eğitim ve acil ihtiyaç desteği",
  ],
  "yetim-hamiligi": [
    "Yetim hamiliği, Afrika, Asya ve Türkiye’deki bir çocuğun yalnızca bugünkü ihtiyacını değil; eğitim, sağlık ve güvenli gelişim sürecini düzenli biçimde destekleyen uzun vadeli bir dayanışma modelidir. Bağış sırasında destek bölgesini seçebilirsiniz.",
    "Programa dahil edilen çocukların aile ve yaşam koşulları uzman ekipler tarafından değerlendirilir. Düzenli destek; okul ihtiyaçları, temel yaşam giderleri, sağlık hizmetleri ve sosyal gelişim faaliyetlerinde kullanılır.",
    "Aylık veya yıllık hamilik seçeneklerinden birini tercih edebilirsiniz. Süreklilik sağlayan her katkı, çocuğun eğitimine güvenle devam edebilmesine yardımcı olur.",
    "Afrika, Asya ve Türkiye seçeneklerinde aylık hamilik bedeli 1.000 TL’dir. Detay sayfasında bölgeyle birlikte aylık veya yıllık hamilik planını seçebilirsiniz. Aylık plan 1.000 TL, yıllık plan ise 12 aylık destek karşılığı 12.000 TL olarak hesaplanır.",
    "Destek; çocuğun okul araçları, temel giyim, gıda, sağlık ve güvenli gelişim ihtiyaçlarına katkı sağlar. Kullanım öncelikleri çocuğun yaşı, eğitim durumu ve hanenin güncel ihtiyaç değerlendirmesine göre belirlenir.",
    "Programa kabul öncesinde çocuğun ve bakım veren hanenin durumu doğrulanır. Düzenli takip, desteğin yalnızca tek seferlik bir yardım olarak kalmamasını ve çocuğun eğitim sürecindeki değişimlerin izlenebilmesini amaçlar.",
  ],
  "yetim-giydirme": [
    "Her çocuk yeni bir kıyafetin sevincini yaşamayı, arkadaşları gibi güzel giyinmeyi ve kendisini değerli hissetmeyi hak eder. Ancak Afrika, Asya ve Türkiye’de yaşayan birçok yetim çocuk, en temel ihtiyaçlarını dahi karşılamakta zorlanıyor. Bağış sırasında destek bölgesini seçebilirsiniz.",
    "Yedirenk Derneği olarak Afrika, Asya ve Türkiye’deki ihtiyaç sahibi yetim çocuklara kıyafet ulaştırarak onların yeni kıyafetlere kavuşmasına ve yüzlerinde küçük de olsa bir tebessüm oluşmasına vesile olmayı amaçlıyoruz. Her bölge için yetim giydirme bedeli 1.500 TL’dir. Yapılan her destek yalnızca bir kıyafet yardımı değil; aynı zamanda bir çocuğa hatırlandığını, değerli olduğunu ve yalnız olmadığını hissettiren bir iyiliktir.",
    "Bir yetimin sevincine ortak olun.",
  ],
  zekat: [
    "Zekât, toplumda dayanışmayı güçlendiren ve ihtiyaç sahibinin temel yaşam koşullarına katkı sağlayan önemli bir ibadettir. Yedirenk’e bağışlanan zekâtlar, zekât almaya uygunluğu doğrulanan kişilere ulaştırılır.",
    "Kaynaklar gıda, barınma, sağlık, eğitim ve acil temel ihtiyaçlar için değerlendirilir. Hak sahipliği incelemesi ve dağıtım kayıtları, yardımın doğru kişiye ulaşmasını sağlayacak biçimde yürütülür.",
    "Zekât desteği Türkiye, Filistin (Gazze), Sudan, Yemen, Somali ve Afganistan başta olmak üzere saha ihtiyacının yüksek olduğu bölgelerde ulaştırılır. Uygulama bölgesi güncel ihtiyaç ve güvenli erişim imkânına göre belirlenir.",
    "Bağışlar gıda paketleri, sıcak yemek, güvenli barınma, temel sağlık giderleri, eğitim ihtiyaçları ve ailelerin öncelikli zaruri harcamaları için değerlendirilir.",
    "Bağış tutarınızı serbestçe belirleyebilir ve Zekât projesi adıyla sepetinize ekleyebilirsiniz. Tutar ve bağış amacı ödeme aşamasına kadar açıkça gösterilir.",
    "Zekât bağışları hak sahipliği doğrulanmış yoksul ailelerin gıda, barınma, sağlık, eğitim ve zaruri yaşam ihtiyaçlarında değerlendirilir. Hesaplama aracı genel bilgilendirme sağlar; nisap, borç türleri veya özel mali durumlar için yetkin bir uzmana danışılması önerilir.",
  ],
  medrese: [
    "Medrese projesi, çocukların ve gençlerin güvenli, düzenli ve sürdürülebilir bir eğitim ortamına kavuşmasını amaçlar. Proje yalnızca bina yapımını değil, bölgenin öğrenci kapasitesine uygun bir öğrenme alanının kurulmasını kapsar.",
    "Arsa ve izin uygunluğu doğrulandıktan sonra mimari plan, derslik ihtiyacı, sanitasyon alanları ve temel tefriş belirlenir. İnşaat süreci aşamalı olarak kontrol edilir ve tamamlanan yapı yerel eğitim sorumlularına teslim edilir.",
    "Bangladeş ve Somali için güncel proje bedellerini seçebilir; Etiyopya alternatifi fiyat kesinleştiğinde aktif hale gelecektir.",
    "Bangladeş ve Somali Medrese seçeneklerinin her biri 12.000 USD’dir. Etiyopya seçeneği maliyet kesinleşene kadar fiyat bekliyor olarak gösterilir ve ödeme için aktif edilmez. Güncel tutar seçilen ülke kartında ve ödeme özetinde görünür.",
    "Proje bedeli; yerel izin ve hazırlık çalışmaları, temel yapı, derslik alanları, çatı, kapı-pencere, elektrik, sanitasyon ve temel eğitim tefrişini kapsayacak şekilde planlanır. Bölgesel şartlara göre kapsam saha keşfinden sonra kesinleştirilir.",
    "Yararlanıcılar güvenli ve düzenli eğitim alanına erişimi sınırlı çocuklar ve gençlerdir. İnşaat aşamaları saha kontrolüyle izlenir; tamamlanma ve teslim bilgileri kayıt altına alınarak yerel işletme sorumluluğu belirlenir.",
  ],
  cami: [
    "Cami projesi, ibadet ihtiyacının yanında eğitim, buluşma ve toplumsal dayanışma için güvenli bir merkez oluşturur. Projeler nüfus, erişim ve mevcut ibadet alanlarının yeterliliği değerlendirilerek planlanır.",
    "Yerel izinler, zemin şartları, kapasite, abdest alanları ve temel tefriş proje kapsamına dahil edilir. İnşaat aşamaları saha ekiplerince takip edilir; tamamlanan yapı kayıt ve teslim süreciyle hizmete açılır.",
    "Bangladeş veya Uganda varyantını seçebilir, proje bedeline kısmi katkı sağlamak için manuel bağış tutarı girebilirsiniz.",
    "Bangladeş Cami bedeli 25.000 USD, Uganda Cami bedeli 28.000 USD’dir. Ülkeler arasındaki fiyat farkı yerel malzeme, işçilik, ulaşım ve uygulama şartlarından kaynaklanır. Seçilen ülke ve tutar sepette ayrıca gösterilir.",
    "Bedel; saha uygunluğu, temel, taşıyıcı yapı, çatı, zemin, kapı-pencere, elektrik, abdest alanı ve temel tefriş kalemlerini kapsayacak biçimde hazırlanır. Nihai teknik kapsam bölgenin iklimi, kapasitesi ve yerel izinlerine göre doğrulanır.",
    "Cami yalnızca namaz vakitlerinde kullanılan bir yapı değil; çocukların eğitimi, topluluk buluşmaları ve dayanışma organizasyonları için güvenli bir ortak alan olarak planlanır. Yapım süreci aşamalı kontrol ve teslim kaydıyla tamamlanır.",
  ],
  mescid: [
    "Mescid projesi, nüfusu daha az olan veya yakınında ibadet alanı bulunmayan yerleşimler için erişilebilir bir çözüm sunar. Ölçek, yerel nüfusun günlük kullanım ihtiyacına göre belirlenir.",
    "Yer seçimi ve izinlerden sonra temel inşaat, çatı, zemin, aydınlatma ve gerekli tefriş tamamlanır. Yapı güvenlik kontrolünün ardından yerel topluluğa teslim edilir.",
    "Tanzanya mescid projesinin tamamına destek olabilir veya manuel tutar alanıyla projenin belirli bir bölümüne katkı sağlayabilirsiniz.",
    "Tanzanya Mescid bedeli 25.000 USD’dir. Tutar; saha hazırlığı, temel yapı, çatı, zemin, kapı-pencere, aydınlatma, abdest imkânı ve temel tefriş giderlerini kapsayacak biçimde hesaplanır.",
    "Mescid, yakınında güvenli ibadet alanı bulunmayan küçük yerleşimlere hizmet eder. Kapasite ve yer seçimi günlük kullanıcı sayısı, ulaşılabilirlik ve mevcut yapıların durumu değerlendirilerek belirlenir.",
    "İnşaat boyunca malzeme ve uygulama kontrolleri yapılır. Tamamlanan yapı yerel sorumlulara teslim edilir; kullanım ve temel bakım sorumluluğu belirlenir. Proje aşamaları ve teslim durumu kayıt altına alınır.",
  ],
};

const managedNews = [
  {
    id: "1",
    category: "Çocuk",
    date: "27 Ağustos 2026",
    published: "2026-08-27",
    title: "Dünyada 150 Milyondan Fazla Çocuk Ebeveyn Kaybıyla Yaşıyor",
    summary:
      "Dünyanın farklı coğrafyalarında 150 milyondan fazla çocuk, anne veya babasından en az birini kaybetmiş durumda.",
    body: "Dünyanın farklı coğrafyalarında 150 milyondan fazla çocuk, anne veya babasından en az birini kaybetmiş durumda. Bu büyük sayı, yetimliğin yalnızca belirli bölgelerin değil, tüm insanlığın ortak meselelerinden biri olduğunu gösteriyor.\n\nBir çocuk için ebeveyn kaybı yalnızca sevdiği bir insanın yokluğu anlamına gelmiyor. Beslenme, eğitim, barınma, sağlık ve güvenli bir çevrede büyüme gibi hayatın en temel alanları da bu süreçten etkilenebiliyor. Özellikle savaş, yoksulluk ve zorunlu göçün yaşandığı bölgelerde çocukların karşılaştığı güçlükler daha da artıyor.\n\nYetim çocukların ihtiyaçları yalnızca maddi destekle sınırlı değil. Düzenli eğitimlerine devam edebilmeleri, yeterli beslenmeleri, sağlık hizmetlerine ulaşmaları ve kendilerini güvende hissedecekleri bir ortamda büyümeleri büyük önem taşıyor.\n\nBir çocuğun hayatında süreklilik sağlayan küçük bir destek bile eğitimden kopmamasına, temel ihtiyaçlarının karşılanmasına ve geleceğe daha güvenle bakmasına katkı sağlayabiliyor.",
    image: "/assets/news-parental-loss-v1.jpg",
    active: true,
  },
  {
    id: "2",
    category: "Temiz Su",
    date: "26 Ağustos 2026",
    published: "2026-08-26",
    title: "Dünyada Milyarlarca İnsan Temiz Suya Ulaşamıyor",
    summary:
      "Su, insan yaşamının en temel ihtiyaçlarından biri olmasına rağmen temiz ve güvenli suya erişim hâlâ ciddi bir sorun.",
    body: "Su, insan yaşamının en temel ihtiyaçlarından biri olmasına rağmen dünyanın önemli bir bölümünde temiz ve güvenli suya erişim hâlâ ciddi bir sorun.\n\nBugün 2 milyardan fazla insan güvenli içme suyu hizmetlerine tam olarak ulaşamıyor. Milyonlarca insan ise günlük su ihtiyacını nehir, göl ve güvenilirliği sınırlı açık su kaynaklarından karşılamak zorunda kalıyor.\n\nSorunun en yoğun hissedildiği yerlerin başında kırsal bölgeler geliyor. Özellikle Sahra Altı Afrika'da yaklaşık her üç kişiden biri temel seviyede içme suyu hizmetine dahi erişmekte güçlük çekiyor.\n\nTemiz suya ulaşmak yalnızca susuzluğu gidermiyor. Güvenli su; yemek hazırlanması, kişisel temizlik, çocuk sağlığı ve bulaşıcı hastalıkların önlenmesi açısından da hayati önem taşıyor.\n\nBir bölgede güvenilir bir su kaynağının bulunması, günlük hayatın neredeyse bütün alanlarını doğrudan etkileyebiliyor.",
    image: "/assets/news-clean-water-access-v1.jpg",
    active: true,
  },
  {
    id: "3",
    category: "Gıda",
    date: "25 Ağustos 2026",
    published: "2026-08-25",
    title: "Açlık Yüz Milyonlarca İnsanın Günlük Hayatını Etkiliyor",
    summary:
      "Küresel ölçekte 700 milyondan fazla insanın açlıkla karşı karşıya olduğu tahmin ediliyor.",
    body: "Dünyada her gün milyonlarca insan sofraya yeterli miktarda yemek koymakta zorlanıyor. Küresel ölçekte 700 milyondan fazla insanın açlıkla karşı karşıya olduğu tahmin ediliyor.\n\nAçlığın nedenleri yalnızca gıda üretiminin yetersiz olması değil. Savaşlar, kuraklık, ekonomik krizler, işsizlik, yüksek gıda fiyatları ve zorunlu göç insanların temel besinlere erişimini güçleştirebiliyor.\n\nÖzellikle çocukluk döneminde yeterli beslenememek, fiziksel ve zihinsel gelişimi doğrudan etkiliyor. Uzun süre devam eden beslenme eksikliği çocukların büyümesini yavaşlatabiliyor ve hastalıklara karşı direncini azaltabiliyor.\n\nBu nedenle bir sofranın kurulması yalnızca o günün açlığını gidermek anlamına gelmiyor. Düzenli ve sağlıklı beslenme, insanın yaşamını sürdürebilmesinin en temel şartlarından birini oluşturuyor.",
    image: "/assets/news-global-hunger-v1.jpg",
    active: true,
  },
  {
    id: "4",
    category: "Eğitim",
    date: "24 Ağustos 2026",
    published: "2026-08-24",
    title: "250 Milyondan Fazla Çocuk ve Genç Eğitimden Uzak",
    summary:
      "Dünyanın birçok ülkesinde 250 milyondan fazla çocuk ve genç eğitim hayatının dışında bulunuyor.",
    body: "Dünyanın birçok ülkesinde çocuklar her sabah okula giderken, 250 milyondan fazla çocuk ve genç eğitim hayatının dışında bulunuyor.\n\nYoksulluk, savaş, göç, okul yetersizliği ve ailelerin ekonomik koşulları çocukların eğitimden uzaklaşmasının başlıca nedenleri arasında yer alıyor. Bazı bölgelerde çocukların en yakın okula ulaşmak için uzun mesafeler katetmesi bile eğitime devam etmelerini zorlaştırabiliyor.\n\nEğitimden uzak kalan bir çocuk yalnızca derslerinden geri kalmıyor. İlerleyen yıllarda meslek edinme, ekonomik bağımsızlık kazanma ve kendisine daha güvenli bir gelecek kurma fırsatları da azalabiliyor.\n\nBir sınıf, bir öğretmen, bir kitap veya güvenli bir eğitim ortamı; bir çocuğun geleceğinin yönünü tamamen değiştirebilecek kadar değerli olabiliyor.",
    image: "/assets/news-education-access-v1.jpg",
    active: true,
  },
  {
    id: "5",
    category: "Çocuk Sağlığı",
    date: "23 Ağustos 2026",
    published: "2026-08-23",
    title: "Milyonlarca Çocuk Yetersiz Beslenmenin Etkileriyle Büyüyor",
    summary:
      "Dünya genelinde 40 milyondan fazla 5 yaş altı çocuk akut yetersiz beslenmeyle karşı karşıya.",
    body: "Çocukların sağlıklı gelişebilmesi için yalnızca karınlarının doyması yeterli değil. Büyüme çağında protein, vitamin, mineral ve diğer temel besinlerin düzenli şekilde alınması gerekiyor.\n\nDünya genelinde 40 milyondan fazla 5 yaş altı çocuk akut yetersiz beslenmeyle karşı karşıya. Bunların yaklaşık 12 milyonu ağır seviyede yetersiz beslenme yaşıyor.\n\nUzun süre devam eden yetersiz beslenme çocukların boy ve kilo gelişimini etkileyebildiği gibi öğrenme kapasitesi ve bağışıklık sistemi üzerinde de kalıcı sonuçlar oluşturabiliyor.\n\nÇocukluk döneminde düzenli ve dengeli beslenmeye ulaşmak, gelecekte daha sağlıklı bir yaşamın temelini oluşturuyor.",
    image: "/assets/news-child-malnutrition-v1.jpg",
    active: true,
  },
  {
    id: "6",
    category: "Göç",
    date: "22 Ağustos 2026",
    published: "2026-08-22",
    title: "Savaşlar Milyonlarca İnsanı Evinden Uzaklaştırıyor",
    summary:
      "Savaşlar ve güvensizlik nedeniyle bugün 100 milyondan fazla insan yaşadığı yerden ayrılmak zorunda kalmış durumda.",
    body: "Bir insanın yaşadığı evi geride bırakması çoğu zaman kendi tercihi olmuyor. Savaşlar, silahlı çatışmalar, şiddet ve güvensizlik nedeniyle bugün 100 milyondan fazla insan yaşadığı yerden ayrılmak zorunda kalmış durumda.\n\nBu insanların on milyonlarcasını çocuklar oluşturuyor. Yerinden edilen bir çocuk için hayat çoğu zaman yalnızca ev değiştirmekten ibaret değil; okulunun, arkadaşlarının ve alıştığı düzenin geride kalması anlamına geliyor.\n\nGöç sonrasında güvenli barınma, temiz su, gıda, sağlık hizmetleri ve çocukların eğitimlerine devam edebilmesi en temel ihtiyaçların başında geliyor.\n\nUzun süreli belirsizlik ise ailelerin yeniden düzenli bir hayat kurmasını daha da zorlaştırabiliyor.",
    image: "/assets/news-forced-displacement-v1.jpg",
    active: true,
  },
  {
    id: "7",
    category: "Hijyen",
    date: "21 Ağustos 2026",
    published: "2026-08-21",
    title: "Temiz Su Olmadan Hijyen de Sağlanamıyor",
    summary:
      "Dünyada 3 milyardan fazla insan güvenli sanitasyon hizmetlerinden yararlanamıyor.",
    body: "Dünyada temiz içme suyuna ulaşmak kadar güvenli tuvalet ve hijyen imkânlarına erişmek de önemli bir sorun.\n\nBugün 3 milyardan fazla insan güvenli sanitasyon hizmetlerinden yararlanamıyor. Yüz milyonlarca insan ise uygun tuvalet imkânının bulunmadığı koşullarda yaşamını sürdürüyor.\n\nHijyen altyapısının yetersiz olması özellikle kalabalık yaşam alanlarında hastalıkların yayılmasını kolaylaştırıyor. Kirli suyla temas ve güvenli olmayan atık sistemleri, önlenebilir hastalıkların önemli nedenleri arasında yer alıyor.\n\nTemiz su, güvenli tuvalet ve el yıkama imkânı birlikte düşünüldüğünde toplum sağlığında çok büyük fark oluşturabiliyor.",
    image: "/assets/news-water-sanitation-hygiene-v1.jpg",
    active: true,
  },
  {
    id: "8",
    category: "Çocuk",
    date: "20 Ağustos 2026",
    published: "2026-08-20",
    title: "Yüz Milyonlarca Çocuk Yoksulluğun Birden Fazla Yüzüyle Karşılaşıyor",
    summary:
      "Çocuk yoksulluğu yalnızca gelir düşüklüğü değil; beslenme, su, eğitim ve güvenli barınma gibi çok sayıda ihtiyacı kapsıyor.",
    body: "Çocuk yoksulluğu yalnızca bir ailenin gelirinin düşük olması anlamına gelmiyor. Bir çocuk yeterince beslenemiyorsa, temiz suya ulaşamıyorsa, okula gidemiyorsa veya güvenli bir evde yaşamıyorsa yoksulluğun farklı sonuçlarıyla karşı karşıya kalıyor.\n\nDünya genelinde yüz milyonlarca çocuk aynı anda birden fazla temel ihtiyaçtan mahrum şekilde büyüyor. Çok boyutlu değerlendirmelerde bu sayının 900 milyona yaklaştığı görülüyor.\n\nÇocukluk çağında yaşanan yoksunlukların etkileri yetişkinlik dönemine kadar devam edebiliyor. Eğitimden uzaklaşma, sağlık sorunları ve iş imkânlarının azalması bu döngünün nesiller boyunca sürmesine neden olabiliyor.\n\nBu nedenle çocukların temel ihtiyaçlarına erişebilmesi yalnızca bugünü değil, geleceklerini de doğrudan ilgilendiriyor.",
    image: "/assets/news-child-poverty-v1.jpg",
    active: true,
  },
  {
    id: "9",
    category: "Barınma",
    date: "19 Ağustos 2026",
    published: "2026-08-19",
    title: "Güvenli Bir Ev Milyarlarca İnsan İçin Hâlâ Ulaşılamayan Bir İhtiyaç",
    summary:
      "Dünya genelinde 1,6 milyardan fazla insanın yeterli barınma koşullarına sahip olmadığı tahmin ediliyor.",
    body: "Ev yalnızca dört duvardan oluşmuyor. Güvenlik, temiz su, elektrik, hijyen ve kötü hava koşullarından korunma gibi ihtiyaçların tamamı sağlıklı barınmanın bir parçası.\n\nDünya genelinde 1,6 milyardan fazla insanın yeterli barınma koşullarına sahip olmadığı tahmin ediliyor.\n\nSavaş ve doğal afetler barınma problemini bir anda büyütebilirken; yoksulluk, hızlı nüfus artışı ve yüksek konut maliyetleri de uzun vadeli sorunlara yol açabiliyor.\n\nÖzellikle çocuklu aileler açısından güvenli bir ev; sağlıklı yaşam, düzenli eğitim ve aile bütünlüğünün korunması için temel şartlardan biri.",
    image: "/assets/news-safe-housing-v1.jpg",
    active: true,
  },
  {
    id: "10",
    category: "Sıcak Yemek",
    date: "18 Ağustos 2026",
    published: "2026-08-18",
    title: "Bir Tabak Sıcak Yemek Neden Önemli?",
    summary:
      "Dünyanın farklı bölgelerinde milyonlarca insan her gün düzenli ve dengeli bir sıcak öğüne ulaşamıyor.",
    body: "Sıcak bir yemek günlük hayatın sıradan bir parçası gibi görünebilir. Ancak dünyanın farklı bölgelerinde milyonlarca insan her gün düzenli bir öğüne ulaşamıyor.\n\nAçlık ve yetersiz beslenme, özellikle kriz dönemlerinde daha hızlı büyüyor. Savaşlar, kuraklık, ekonomik sıkıntılar ve zorunlu göç ailelerin düzenli yemek hazırlayabilmesini zorlaştırabiliyor.\n\nSıcak yemek yalnızca enerji ihtiyacının karşılanmasını sağlamıyor. Protein, karbonhidrat ve diğer besinlerin dengeli biçimde sunulması özellikle çocuklar, yaşlılar ve zor koşullarda yaşayan insanlar için önemli.\n\nBu nedenle toplu yemek çalışmaları, gıdaya erişimin zor olduğu dönemlerde insanların en temel günlük ihtiyaçlarından birinin karşılanmasına katkı sağlayan yöntemlerden biri olarak öne çıkıyor.",
    image: "/assets/news-hot-meal-v1.jpg",
    active: true,
  },
];

const fundingProjects = [
  {
    slug: "halep-genclik-merkezi",
    country: "Suriye",
    title: "Halep Gençlik Merkezi",
    summary:
      "Gençlerin güvenli bir ortamda eğitim, teknoloji ve sosyal gelişim programlarına erişebilmesi için kalıcı bir merkez kuruyoruz.",
    description:
      "Halep Gençlik Merkezi; gençlerin ders destek programlarına, mesleki atölyelere, bilgisayar eğitimlerine ve rehberlik çalışmalarına ücretsiz ulaşacağı çok amaçlı bir yaşam alanı olarak planlandı. Yapının eğitim salonları, kütüphane, teknoloji atölyesi ve güvenli etkinlik alanlarıyla bölgedeki gençlere uzun vadeli destek sunması hedefleniyor.",
    image: "/assets/news-children-academy-ai-v1.webp",
    target: 4500000,
    raised: 2603700,
    supporters: 1917,
  },
  {
    slug: "gazze-saglik-merkezi",
    country: "Filistin",
    title: "Gazze Sağlık Merkezi",
    summary:
      "Temel muayene, göz sağlığı ve anne-çocuk hizmetlerinin kesintisiz sunulacağı erişilebilir bir sağlık merkezi oluşturuyoruz.",
    description:
      "Gazze Sağlık Merkezi projesi, temel sağlık hizmetlerine erişimde güçlük yaşayan aileler için düzenli ve güvenli bir başvuru noktası oluşturmayı amaçlıyor. Merkezde genel muayene, göz sağlığı taraması, anne-çocuk takibi ve sağlık danışmanlığı birimleri planlanıyor. Bağışlar yapı hazırlığı, tıbbi donanım ve temel işletme ihtiyaçlarında kullanılacak.",
    image: "/assets/news-cataract-ai-v1.webp",
    target: 6200000,
    raised: 1245580,
    supporters: 3016,
  },
];

const FUNDING_PROGRESS_KEY = "yedirenk-funding-progress-v1";
const readFundingProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(FUNDING_PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
};
function useFundingProgress() {
  const [progress, setProgress] = useState(readFundingProgress);
  useEffect(() => {
    const refresh = () => setProgress(readFundingProgress());
    window.addEventListener("yedirenk-funding-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("yedirenk-funding-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return progress;
}

const fundingStats = (project, progress) => {
  const added = progress[project.slug] || {};
  const raised = Math.min(
    project.target,
    project.raised + Math.max(0, Number(added.amount) || 0),
  );
  return {
    raised,
    supporters: project.supporters + Math.max(0, Number(added.supporters) || 0),
    percent: Math.min(100, (raised / project.target) * 100),
  };
};

const recordFundingDonations = (items) => {
  const contributions = items.filter((item) => item.fundingProjectSlug);
  if (!contributions.length) return;
  const progress = readFundingProgress();
  const supported = new Set();
  contributions.forEach((item) => {
    const slug = item.fundingProjectSlug;
    const current = progress[slug] || { amount: 0, supporters: 0 };
    progress[slug] = {
      amount:
        Math.max(0, Number(current.amount) || 0) +
        toTRY(item.price * item.qty, item.currency || "TRY"),
      supporters: Math.max(0, Number(current.supporters) || 0),
    };
    supported.add(slug);
  });
  supported.forEach((slug) => {
    progress[slug].supporters += 1;
  });
  localStorage.setItem(FUNDING_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("yedirenk-funding-updated"));
};
const cmsDefaults = {
  campaigns: [],
  slides,
  news: managedNews,
  settings: {
    logo: "/assets/yedirenk-logo-official-pdf.webp",
    logoWidth: 360,
    logoHeight: 96,
    typographyVersion: 4,
    projectsVersion: 65,
    wordingVersion: 3,
    navigationVersion: 7,
    donationRouteVersion: 2,
    projectHomepageVersion: 2,
    footerVolunteerVersion: 1,
    footerContentVersion: 1,
    newsImageVersion: 2,
    contactVersion: 4,
    corporatePagesVersion: 6,
    legalPagesVersion: 1,
    phone: "0533 640 77 65",
    whatsapp: "905336407765",
    email: "iletisim@yedirenkdernegi.org",
    address: "Kızılırmak Mah. 1450. Sok. 16/6 Çankaya/Ankara",
    alert: "İyiliğin yedi rengi, ortak bir amaçta buluşuyor.",
    footerText:
      "İnsanı, bilgiyi, kültürü, güveni ve yardımlaşmayı temel değerlerimiz biliriz.",
    typography: {
      body: 16,
      nav: 15,
      heroTitle: 62,
      heroText: 18,
      sectionTitle: 40,
      bodyText: 16,
      cardTitle: 21,
      cardText: 15,
      pageTitle: 54,
      button: 15,
      footer: 14,
      lineHeight: 1.7,
    },
  },
  home: {
    introEyebrow: "BİZ KİMİZ?",
    introTitle: "Farklı renkler, aynı iyilikte buluşur.",
    introText:
      "Yedirenk; insanı, bilgiyi, kültürü, güveni ve yardımlaşmayı temel değerleri olarak görür. Gücün büyüklüğüne değil, niyetin samimiyetine inanır.",
    campaignEyebrow: "PROJELERİMİZ",
    campaignTitle: "Destek olabileceğiniz çalışmalar",
    campaignText:
      "Güncel projelerimizi inceleyin, size uygun bağış seçeneğini belirleyin.",
    impactEyebrow: "ETKİMİZ",
    impactTitle: "Her iyilik, bir hayatın rengini değiştirir.",
    storyEyebrow: "BİR KUYU, BİR KÖY",
    storyTitle: "Artık sabahlar okul için.",
    storyQuote:
      "Suyu uzaktan taşımak yerine dersime hazırlanıyorum. Kuyudan sadece su değil, zaman da akıyor.",
    storyText:
      "Kalıcı bir su projesi; çocukların eğitimine, ailelerin sağlığına ve yerel üretime aynı anda dokunur.",
    storyImage: "/assets/hero-water-branded-v3.webp",
    stats: [
      { value: "27", label: "Aktif proje" },
      { value: "18K+", label: "İyiliğe erişen" },
      { value: "640+", label: "Gönüllü" },
      { value: "14", label: "Saha noktası" },
    ],
  },
  trust: [
    { title: "Şeffaflık", text: "Her bağış izlenebilir" },
    { title: "Güven", text: "Doğrulanmış saha süreçleri" },
    { title: "Etki", text: "Yerel ve sürdürülebilir" },
    { title: "Raporlama", text: "Sonuç odaklı bildirim" },
  ],
  footer: {
    newsletterTitle: "İyilik için gönüllü ol",
    newsletterText: "Bilginizi, zamanınızı ve emeğinizi iyilik için paylaşın.",
    newsletterPlaceholder: "",
    newsletterButton: "Gönüllü Ol",
    successText: "Kaydınız alındı, teşekkürler.",
    brandText:
      "İnsanı, bilgiyi, kültürü, güveni ve yardımlaşmayı temel değerlerimiz biliriz.",
    columns: [
      {
        title: "YEDİRENK",
        links: [
          { label: "Hakkımızda", path: "/kurumsal/hakkimizda" },
          {
            label: "Özenle ve Güvenle",
            path: "/kurumsal/ozenle-ve-guvenle",
          },
          { label: "Haberler", path: "/haberler" },
          { label: "İletişim", path: "/iletisim" },
        ],
      },
      {
        title: "DESTEK OL",
        links: [
          { label: "Bağış Yap", path: "/projeler" },
          { label: "Gönüllü Ol", path: "/katil/gonullu-ol" },
          { label: "Sponsor Ol", path: "/katil/sponsor-ol" },
          { label: "Zekât Hesapla", path: "/zekat-hesapla" },
        ],
      },
    ],
    social: {
      instagram: "https://www.instagram.com/yedirenkdernegi/",
      facebook: "https://www.facebook.com/profile.php?id=61593270698708#",
      youtube: "https://www.youtube.com/channel/UCI-22JZLJyb3WqJ4QLTkTZA",
      x: "https://x.com/yedirenkdernek?s=11",
    },
    copyright: "© 2026 Yedirenk Derneği. Tüm hakları saklıdır.",
    legal: [
      { label: "KVKK", path: "/kurumsal/kvkk" },
      { label: "Çerez Politikası", path: "/kurumsal/cerez-politikasi" },
    ],
  },
};
const safePath = (value) => {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  // The former donation landing page was retired. Keep CMS-managed links from
  // reopening it even if an old value is restored or entered in the admin panel.
  if (/^\/bagis(?:[/?#]|$)/i.test(value)) return "/projeler";

  return value;
};
const safeExternal = (value) =>
  typeof value === "string" && (value === "#" || /^https:\/\//i.test(value))
    ? value
    : "#";

const workAreas = [
  [
    "İnsani Yardım",
    "İhtiyacı yerinde tespit eder, bağışı insan onurunu koruyarak ulaştırırız.",
    "/assets/program-humanitarian.webp",
    "/calismalarimiz/insani-yardim",
    HandHeart,
  ],
  [
    "Eğitim",
    "Bilgiyi paylaşarak çoğaltır, çocukların geleceğini güçlendiririz.",
    "/assets/hero-education-branded-v3.webp",
    "/calismalarimiz/farkindalik",
    BookOpen,
  ],
  [
    "Su ve Sağlık",
    "Kalıcı su çözümleri ve sağlık programlarıyla yaşamı destekleriz.",
    "/assets/program-water.webp",
    "/calismalarimiz/su",
    Droplets,
  ],
  [
    "Afet Yönetimi",
    "Hazırlık, arama kurtarma ve acil yardım kapasitesi oluştururuz.",
    "/assets/program-rescue.webp",
    "/calismalarimiz/arama-kurtarma",
    ShieldCheck,
  ],
];

const menu = [
  {
    label: "Kurumsal",
    path: "/kurumsal",
    cols: [
      [
        "Kurumsal",
        ["Biz Kimiz?", "Başkanın Mesajı", "Kurumsal Kimlik", "Tüzük", "KVKK"],
      ],
    ],
  },
  {
    label: "Faaliyetler",
    path: "/calismalarimiz",
    cols: [["Faaliyetler", ["Eğitim", "Kültür", "Yardımlaşma"]]],
  },
];

cmsDefaults.workAreas = workAreas.map(([title, description, image, path]) => ({
  title,
  description,
  image,
  path,
}));
const projectImpact = {
  "adak-akika-nafile-kurban": [
    "İhtiyaç sahibi aileler",
    "Et dağıtımı ve saha kaydı",
  ],
  "su-kuyusu": ["Bir köy veya yerleşim", "Temiz su, test ve bakım planı"],
  "gida-kolisi": ["Bir ihtiyaç sahibi hane", "Temel kuru gıda paketi"],
  "toplu-yemek": ["İhtiyaç sahibi aileler", "Sıcak öğün hazırlığı ve dağıtımı"],
  "gazze-yardim": [
    "Gazze’deki ihtiyaç sahibi aileler",
    "Temiz su temini ve tankerle dağıtım",
  ],
  "yetim-hamiligi": ["Bir yetim çocuk", "Eğitim, sağlık ve temel ihtiyaç"],
  "yetim-giydirme": ["Bir yetim çocuk", "Mevsimlik yeni kıyafet paketi"],
  zekat: ["Zekât almaya uygun kişiler", "Doğrulanmış temel ihtiyaçlar"],
  medrese: ["Çocuklar ve gençler", "Eğitim yapısı ve temel tefriş"],
  cami: ["Yerel topluluk", "İbadet alanı ve temel tefriş"],
  mescid: ["Küçük yerleşim topluluğu", "İbadet alanı ve temel tefriş"],
};
const projectCardImages = {
  "gazze-yardim": "/assets/project-card-gazze.webp",
  "turkiye-projeleri": "/assets/project-card-turkiye-brush-v2.webp",
  "adak-akika-nafile-kurban": "/assets/project-card-kurban.webp",
  "su-kuyusu": "/assets/project-card-su-kuyusu.webp",
  "gida-kolisi": "/assets/project-card-gida-kolisi.webp",
  "yetim-hamiligi": "/assets/project-card-yetim.webp",
  "yetim-giydirme": "/assets/project-card-yetim.webp",
  zekat: "/assets/project-card-zekat.webp",
  medrese: "/assets/project-card-medrese.webp",
  cami: "/assets/project-card-cami-mescit.webp",
  mescid: "/assets/project-card-cami-mescit.webp",
  "toplu-yemek": "/assets/project-card-toplu-yemek.webp",
};
const projectOptionCoverImages = {
  "adak-akika-nafile-kurban": "/assets/project-cover-kurban-user-v1.webp",
  "su-kuyusu": "/assets/project-cover-su-kuyusu-user-v1.webp",
  "gida-kolisi": "/assets/project-cover-gida-kolisi-user-v1.webp",
  zekat: "/assets/project-cover-zekat-user-v1.webp",
  "yetim-hamiligi": "/assets/project-cover-yetim-hamiligi-user-v1.webp",
  "yetim-giydirme": "/assets/project-cover-yetim-giyim-user-v1.webp",
  "toplu-yemek": "/assets/project-cover-toplu-yemek-user-v1.webp",
};
cmsDefaults.projects = projectCatalog.map((project) => ({
  ...project,
  cardImage:
    project.cardImage || projectOptionCoverImages[project.slug] || project.image,
  details: projectLongCopy[project.slug] || [project.description],
  beneficiaries: projectImpact[project.slug]?.[0],
  scope: projectImpact[project.slug]?.[1],
}));
cmsDefaults.projectCategories = [
  ...new Set(projectCatalog.map((project) => project.category)),
];
cmsDefaults.sitePages = {
  search: {
    name: "Arama",
    tag: "ARAMA",
    title: "Site içinde ara",
    text: "Projeler, çalışmalar ve haberler arasında arama yapın.",
    image: "/assets/news-hero-logo-v5.webp",
    sectionTitle: "Aramak istediğiniz kelimeyi yazın",
    emptyTitle: "Sonuç bulunamadı",
    emptyText: "Başka bir kelime veya daha kısa bir ifade deneyin.",
  },
  donate: {
    name: "Bağış",
    tag: "BAĞIŞ",
    title: "Desteğin iyiliğe dönüşsün.",
    text: "Bağış alanını seçin, tutarı belirleyin ve güvenli ödeme adımına ilerleyin.",
    image: "/assets/hero-solidarity-branded-v3.webp",
  },
  news: {
    name: "Haberler",
    tag: "YEDİRENK’TEN",
    title: "Haberler ve duyurular",
    text: "Sahadan doğrulanmış gelişmeler, proje sonuçları ve gönüllülük çağrıları.",
    image: "/assets/news-hero-logo-v5.webp",
    sectionTitle: "Sahadan doğrulanmış haberler.",
    sectionText:
      "Her içerik saha kayıtları, proje sorumlusu bilgileri ve görsel belgeler karşılaştırılarak hazırlanır.",
  },
  projects: {
    name: "Projeler",
    tag: "YEDİRENK PROJELERİ",
    title: "Bir iyilik seçin, detaylarını kolayca inceleyin.",
    text: "Proje adına dokunarak doğrudan açıklama ve bağış seçeneklerine ulaşabilir, bütün çalışmalarımızı karşılaştırabilirsiniz.",
    image: "/assets/projects-hero-yedirenk-v1.webp",
    sectionTitle: "Destek olabileceğiniz çalışmalar",
  },
  zakat: {
    name: "Zekât Hesapla",
    tag: "HESAPLAMA ARACI",
    title: "Zekâtını kolayca hesapla.",
    text: "Zekâta tabi varlıklarınızı girerek yaklaşık tutarı görün.",
    image: "/assets/program-awareness.webp",
    sectionTitle: "Varlık bilgileri",
    note: "Bu araç bilgilendirme amaçlıdır. Özel durumlarınız için yetkin bir uzmana danışınız.",
  },
  account: {
    name: "Giriş / Kayıt",
    tag: "BAĞIŞÇI HESABI",
    title: "Giriş Yap veya Kayıt Ol",
    userTitle: "Hesabım",
    text: "Bağış bilgilerinizi güvenle yönetin ve işlemlerinizi kolaylaştırın.",
    image: "/assets/program-rights.webp",
    sectionTitle: "İyiliğinizi tek hesapta takip edin.",
    sectionText:
      "Kayıt olarak ödeme sırasında bilgilerinizi daha hızlı doldurabilir ve bağış geçmişinize güvenli biçimde erişebilirsiniz.",
  },
  contact: {
    name: "İletişim",
    tag: "BİZE ULAŞIN",
    title: "İletişim ve Destek",
    text: "Sorularınız ve destek talepleriniz için bize ulaşın.",
    image: "/assets/program-humanitarian.webp",
  },
  volunteer: {
    name: "Gönüllülük",
    tag: "BİRLİKTE İYİLİK",
    title: "Gönüllü Başvurusu",
    text: "Bilginiz, zamanınız ve emeğinizle iyiliğe ortak olun.",
    image: "/assets/program-volunteer.webp",
  },
  sponsor: {
    name: "Kurumsal İş Birliği",
    tag: "BİRLİKTE ETKİ",
    title: "Kurumsal İş Birliği",
    text: "Sürdürülebilir sosyal etki için birlikte çalışalım.",
    image: "/assets/program-diplomacy.webp",
  },
};
cmsDefaults.overrides = { text: {}, media: {} };
cmsDefaults.languages = {
  tr: {
    label: "Türkçe",
    code: "TR",
    dir: "ltr",
    published: true,
    text: {},
    media: {},
  },
  en: {
    label: "English",
    code: "EN",
    dir: "ltr",
    published: true,
    text: {
      ...generatedTranslations.en,
      Kurban: "Qurbani",
      "Sofrada Payın Olsun": "Have a Share at the Table",
      "Kurban bağışınızla ihtiyaç sahibi ailelerin sofralarına bereket taşıyın.":
        "Bring abundance to families in need with your qurbani donation.",
      "Kurbanını Bağışla": "Donate Your Qurbani",
      "Derinden Gelen Hayat": "Life from the Depths",
      "Bir su kuyusuna destek olun, temiz suya hasret hayatlara umut olun.":
        "Support a water well and bring hope to lives longing for clean water.",
      "Rızkı Paylaş": "Share Your Provision",
      "Gıda desteğinizle ihtiyaç sahibi ailelerin sofralarına iyilik ulaştırın.":
        "Deliver kindness to the tables of families in need with your food support.",
      "Koli Bağışla": "Donate a Food Parcel",
      "Yetime Yoldaş Ol": "Stand by an Orphan",
      "Bir yetimin eğitimine, ihtiyaçlarına ve geleceğine düzenli destek olun.":
        "Provide regular support for an orphan's education, needs, and future.",
      "Yetim Hamisi Ol": "Sponsor an Orphan",
      "Desteğin Yetimin Üstüne Olsun": "Let Your Support Clothe an Orphan",
      "Kıyafet desteğinizle bir yetimin yüzündeki tebessüme vesile olun.":
        "Help bring a smile to an orphan's face with your clothing support.",
      "Zekâtınla Hayatlara Dokun": "Touch Lives with Your Zakat",
      "Zekâtınızı ihtiyaç sahiplerine ulaştırarak hayatlarına umut katın.":
        "Bring hope to people in need by delivering your zakat to them.",
      "İlim Çatısı": "A Home for Knowledge",
      "Bir medreseye destek olun, nesiller boyu sürecek ilme vesile olun.":
        "Support a madrasa and help knowledge flourish for generations.",
      "Bir Saf Daha": "One More Row",
      "Bir cami veya mescide destek olun, yükselen her duada payınız olsun.":
        "Support a mosque or masjid and share in every prayer offered there.",
      "Cami & Mescid": "Mosque & Masjid",
      "Yedirenk'te ara...": "Search Yedirenk...",
      "’den başlayan": " starting from",
      "Hedefin %": "Target progress: %",
      "’ine ulaşıldı": " reached",
      "Hesaplanan net varlık:": "Calculated net assets:",
      Türkiye: "Turkey",
      "İstanbul, Türkiye": "Istanbul, Turkey",
      "Bangladeş · Tulumbalı Kuyu": "Bangladesh · Pump Well",
      "Tulumbalı Kuyu": "Pump Well",
      Tulumbalı: "Pump",
      Haberler: "News",
      Projeler: "Projects",
      "Bağış Yap": "Donate",
      İletişim: "Contact",
      "Hesap Numaraları": "Bank Accounts",
      "Zekât Hesapla": "Calculate Zakat",
      "Giriş Yap": "Log In",
      "Kayıt Ol": "Register",
      "Ana Sayfa": "Home",
      "Detaylı Bilgi": "Detailed Information",
      "Sepetin henüz boş.": "Your cart is empty.",
      Toplam: "Total",
      Ödeme: "Payment",
      "Kişisel Bilgiler": "Personal Information",
      "Bağış Özeti": "Donation Summary",
      "Güvenli ödeme": "Secure payment",
      "Kart bilgileriniz saklanmaz.": "Your card details are not stored.",
      "Bunlar da ilginizi çekebilir": "You may also be interested in",
      "PROJE SEÇENEKLERİ": "PROJECT OPTIONS",
    },
    media: {},
  },
  ar: {
    label: "العربية",
    code: "AR",
    dir: "rtl",
    published: true,
    text: {
      ...generatedTranslations.ar,
      Kurban: "الأضحية",
      "Sofrada Payın Olsun": "شارك في المائدة",
      "Kurban bağışınızla ihtiyaç sahibi ailelerin sofralarına bereket taşıyın.":
        "بتبرعك بالأضحية، احمل البركة إلى موائد الأسر المحتاجة.",
      "Kurbanını Bağışla": "تبرع بأضحيتك",
      "Derinden Gelen Hayat": "حياة من الأعماق",
      "Bir su kuyusuna destek olun, temiz suya hasret hayatlara umut olun.":
        "ساهم في إنشاء بئر ماء وامنح الأمل لمن يشتاقون إلى الماء النظيف.",
      "Rızkı Paylaş": "شارك الرزق",
      "Gıda desteğinizle ihtiyaç sahibi ailelerin sofralarına iyilik ulaştırın.":
        "أوصل الخير إلى موائد الأسر المحتاجة بدعمك الغذائي.",
      "Koli Bağışla": "تبرع بسلة غذائية",
      "Yetime Yoldaş Ol": "كن رفيقًا ليتيم",
      "Bir yetimin eğitimine, ihtiyaçlarına ve geleceğine düzenli destek olun.":
        "قدّم دعمًا منتظمًا لتعليم يتيم واحتياجاته ومستقبله.",
      "Yetim Hamisi Ol": "اكفل يتيمًا",
      "Desteğin Yetimin Üstüne Olsun": "ليكسُ دعمك يتيمًا",
      "Kıyafet desteğinizle bir yetimin yüzündeki tebessüme vesile olun.":
        "ساهم بدعم الملابس في رسم ابتسامة على وجه يتيم.",
      "Zekâtınla Hayatlara Dokun": "المس حياة الناس بزكاتك",
      "Zekâtınızı ihtiyaç sahiplerine ulaştırarak hayatlarına umut katın.":
        "أضف الأمل إلى حياة المحتاجين بإيصال زكاتك إليهم.",
      "İlim Çatısı": "صرح للعلم",
      "Bir medreseye destek olun, nesiller boyu sürecek ilme vesile olun.":
        "ادعم مدرسة وساهم في علم يمتد أثره عبر الأجيال.",
      "Bir Saf Daha": "صفّ آخر",
      "Bir cami veya mescide destek olun, yükselen her duada payınız olsun.":
        "ادعم جامعًا أو مسجدًا وليكن لك نصيب في كل دعاء يُرفع فيه.",
      "Cami & Mescid": "جامع ومسجد",
      "Yedirenk'te ara...": "ابحث في يدي رنك...",
      "’den başlayan": " ابتداءً من",
      "Hedefin %": "نسبة تحقيق الهدف: %",
      "’ine ulaşıldı": " تم تحقيقها",
      "Hesaplanan net varlık:": "صافي الأصول المحسوب:",
      Türkiye: "تركيا",
      "İstanbul, Türkiye": "إسطنبول، تركيا",
      "Bangladeş · Tulumbalı Kuyu": "بنغلاديش · بئر بمضخة",
      "Tulumbalı Kuyu": "بئر بمضخة",
      Tulumbalı: "بمضخة",
      Haberler: "الأخبار",
      Projeler: "المشاريع",
      "Bağış Yap": "تبرع",
      İletişim: "اتصل بنا",
      "Hesap Numaraları": "الحسابات البنكية",
      "Zekât Hesapla": "احسب الزكاة",
      "Giriş Yap": "تسجيل الدخول",
      "Kayıt Ol": "إنشاء حساب",
      "Ana Sayfa": "الرئيسية",
      "Detaylı Bilgi": "معلومات تفصيلية",
      "Sepetin henüz boş.": "سلة التبرعات فارغة.",
      Toplam: "المجموع",
      Ödeme: "الدفع",
      "Kişisel Bilgiler": "المعلومات الشخصية",
      "Bağış Özeti": "ملخص التبرع",
      "Güvenli ödeme": "دفع آمن",
      "Kart bilgileriniz saklanmaz.": "لا يتم حفظ بيانات بطاقتك.",
      "Bunlar da ilginizi çekebilir": "قد يهمك أيضاً",
      "PROJE SEÇENEKLERİ": "خيارات المشروع",
    },
    media: {},
  },
};
const getProjects = (content) => {
  const currentCardCopySlugs = ["adak-akika-nafile-kurban", "su-kuyusu"];
  const syncedProjectSlugs = [
    "su-kuyusu",
    "gida-kolisi",
    "zekat",
    "gazze-yardim",
    "medrese",
    "toplu-yemek",
    "cami",
    "mescid",
  ];
  const currentProjects = new Map(
    cmsDefaults.projects
      .filter((project) => syncedProjectSlugs.includes(project.slug))
      .map((project) => [project.slug, project]),
  );
  return (content.projects || cmsDefaults.projects)
    .filter((project) => project.active !== false)
    .map((project) => {
      const currentProject = currentProjects.get(project.slug);
      if (currentProject) {
        return {
          ...currentProject,
          ...project,
          title: project.title || currentProject.title,
          category: project.category || currentProject.category,
          short: project.short || currentProject.short,
          image: project.image || currentProject.image,
          description: project.description || currentProject.description,
          details: project.details || currentProject.details,
          variants: project.variants?.length
            ? project.variants
            : currentProject.variants,
        };
      }
      if (currentCardCopySlugs.includes(project.slug)) {
        return {
          ...project,
          short:
            cmsDefaults.projects.find(
              (current) => current.slug === project.slug,
            )?.short || project.short,
        };
      }
      return project;
    });
};
const getSitePage = (content, key) =>
  content.sitePages?.[key] || cmsDefaults.sitePages[key];
cmsDefaults.navigation = menu;

const slugMap = {
  hakkimizda: "Biz Kimiz?",
  "ozenle-ve-guvenle": "Özenle ve Güvenle",
  "yonetim-kurulu-mesaji": "Başkanın Mesajı",
  "kurumsal-kimlik": "Kurumsal Kimlik",
  tuzuk: "Tüzük",
  kvkk: "Kişisel Verilerin Korunması",
  "cerez-politikasi": "Çerez Politikası",
  "ilham-kaynagimiz": "İlham Kaynağımız",
  "misyon-vizyon": "Misyon & Vizyon",
  kurumsal: "Kurumsal",
  "etik-degerler": "Etik Değerler",
  "bagisci-haklari": "Bağışçı Hakları",
  seffaflik: "Şeffaflık",
  "bilgi-guvenligi": "Bilgi Güvenliği",
  "filistin-gazze": "Gazze",
  "insani-yardim": "İnsani Yardım",
  "acil-yardim": "Afet ve Kriz Yardımı",
  yetim: "Yetim",
  su: "Su",
  katarakt: "Katarakt",
  farkindalik: "Eğitim",
  "arama-kurtarma": "Arama Kurtarma",
  egitim: "Eğitim",
  kultur: "Kültür",
  yardimlasma: "Yardımlaşma",
  "sponsor-ol": "Sponsor Ol",
  "su-kuyusu": "Su Kuyusu Açtır",
  "gonullu-ol": "Gönüllü Ol",
  bulten: "Bültene Katıl",
  haberler: "Haberler",
};

const pageProfiles = {
  haberler: {
    image: "/assets/news-hero-logo-v5.webp",
    lead: "Sahadan doğrulanmış gelişmeler, proje sonuçları, gönüllülük çağrıları ve Yedirenk’ten güncel duyurular.",
    qas: [
      [
        "Haber içerikleri nasıl doğrulanıyor?",
        "Saha notları, görsel kayıtlar ve proje sorumlusunun teslim verileri iletişim ekibi tarafından karşılaştırılır. Teyit edilmeyen sayı, konum veya yararlanıcı bilgisi yayımlanmaz.",
      ],
      [
        "Haberlerde neden bazı kişilerin kimliği gizleniyor?",
        "Çocuk koruma, kişisel güvenlik ve mahremiyet ilkeleri gereği isim, yüz veya konum bilgisi risk oluşturduğunda açık rıza olsa bile içerik anonimleştirilebilir.",
      ],
      [
        "Basın ve röportaj talepleri nereye iletilir?",
        "Basın, görsel kullanım ve röportaj talepleri iletişim formunda “Basın ve medya” konusu seçilerek iletilebilir. Talep, ilgili program ve iletişim sorumlusuna yönlendirilir.",
      ],
    ],
  },
  hakkimizda: {
    image: "/assets/program-volunteer.webp",
    lead: "Güvenle uzanan her yardım eli, umutla kanatlanan bir iyiliğe dönüşür.",
    qas: [
      [
        "Yedirenk hangi alanlarda çalışır?",
        "Yedirenk; eğitim, kültür ve yardımlaşmayı temel çalışma alanları olarak görür. Eğitimle bilgi, ahlak, değer ve sorumluluk bilincini güçlendirmeyi; kültürle ortak hafızayı ve medeniyet değerlerini geleceğe taşımayı; yardımlaşmayla ise ihtiyaç sahiplerinin yanında olmayı amaçlar.",
      ],
      [
        "Yedirenk için iyilik ne ifade eder?",
        "Yedirenk için iyilik yalnızca bir yardım ulaştırmak değildir; paylaşmak, destek olmak, yanında durmak ve bir insanın hayatına umut olabilmektir. İyiliğin büyüklüğünden çok samimiyetine inanır; merhametle atılan her adımı hayata dokunan bir sorumluluk olarak görür.",
      ],
      [
        "Yedirenk nasıl bir çalışma anlayışı benimser?",
        "Yedirenk; insanı merkeze alan, ihtiyaçları gören ve çözüm üretmek için harekete geçen bir çalışma anlayışını benimser. Üstlendiği her sorumlulukta gayret göstermeyi, sahada etkin olmayı ve yapılan her işi özenle ve güvenle gerçekleştirmeyi esas alır.",
      ],
    ],
  },
  "ozenle-ve-guvenle": {
    image: "/assets/program-volunteer.webp",
    lead: "Özenle ve Güvenle; Yedirenk’in her insana, her bağışa ve üstlendiği her sorumluluğa gösterdiği dikkati anlatan çalışma sözüdür.",
    qas: [
      [
        "Özenle neyi ifade ediyor?",
        "İhtiyacı doğru anlamayı, insan onurunu korumayı ve her çalışmayı bulunduğu yerin şartlarına göre dikkatle planlamayı ifade eder. Küçük görünen hiçbir ayrıntıyı önemsiz saymayız.",
      ],
      [
        "Güvenle neyi ifade ediyor?",
        "Bağışları kayıtlı ve doğrulanmış süreçlerle doğru yere ulaştırmayı; sorumlulukları açıkça üstlenmeyi ve elde edilen sonucu paylaşmayı ifade eder.",
      ],
      [
        "Sloganımız çalışmalarımıza nasıl yansıyor?",
        "Karar verirken özenle dinler, planlar ve uygularız; bağışçı, gönüllü ve ihtiyaç sahibiyle kurduğumuz ilişkiyi güvenle sürdürürüz. Böylece iyiliği yalnızca ulaştırmakla kalmaz, ona kalıcı bir değer kazandırırız.",
      ],
    ],
  },
  egitim: {
    image: "/assets/hero-education-branded-v3.webp",
    lead: "Çocukların ve gençlerin bilgiye erişimini güçlendiren, gelişimlerini destekleyen eğitim çalışmaları yürütüyoruz.",
    qas: [
      [
        "Eğitim çalışmalarımızın amacı",
        "Bilgiyi erişilebilir kılmak, öğrenme imkânlarını çoğaltmak ve çocuklarla gençlerin kendilerini güvenle geliştirebilecekleri ortamlar oluşturmaktır.",
      ],
      [
        "Nasıl çalışıyoruz?",
        "İhtiyacı yerinde belirliyor; içerikleri yaş grubuna, yerel koşullara ve katılımcıların gelişim ihtiyaçlarına göre eğitimcilerle birlikte hazırlıyoruz.",
      ],
      [
        "Çalışmalarımıza nasıl destek olabilirsiniz?",
        "Eğitim materyali, uzmanlık, gönüllülük veya proje desteğiyle daha fazla çocuğun nitelikli öğrenme imkânlarına ulaşmasına katkı sağlayabilirsiniz.",
      ],
    ],
  },
  kultur: {
    image: "/assets/program-awareness.webp",
    lead: "Kültürel değerleri yaşatan, ortak hafızayı koruyan ve toplumsal bağı güçlendiren çalışmalar gerçekleştiriyoruz.",
    qas: [
      [
        "Kültür çalışmalarımızın amacı",
        "Farklı kuşakları ortak değerler etrafında buluşturmak, kültürel birikimi görünür kılmak ve üretken katılımı desteklemektir.",
      ],
      [
        "Hangi çalışmalar yürütülüyor?",
        "Atölyeler, söyleşiler, yayınlar ve kültür-sanat buluşmalarıyla katılımcıların öğrenmesine, üretmesine ve paylaşmasına alan açıyoruz.",
      ],
      [
        "Kimler katılabilir?",
        "Programın kapsamına göre çocuklar, gençler, aileler, gönüllüler ve yerel paydaşlar kültür çalışmalarımıza katılabilir.",
      ],
    ],
  },
  yardimlasma: {
    image: "/assets/program-humanitarian.webp",
    lead: "İhtiyaç sahipleriyle dayanışmayı büyüten, insan onurunu ve adaleti gözeten yardımlaşma çalışmaları yürütüyoruz.",
    qas: [
      [
        "Yardımlaşma yaklaşımımız",
        "Desteği yalnızca ulaştırmakla yetinmiyor; ihtiyacı doğruluyor, mahremiyeti koruyor ve süreci kayıt altına alarak takip ediyoruz.",
      ],
      [
        "Kimlere destek ulaştırılıyor?",
        "Gelir yetersizliği, afet, çatışma, sağlık veya barınma sorunu nedeniyle desteğe ihtiyaç duyan kişi ve ailelere öncelik veriyoruz.",
      ],
      [
        "Bağışlar nasıl değerlendiriliyor?",
        "Bağışlar belirtilen amaç doğrultusunda planlanır; tedarik, teslim ve raporlama adımları proje kayıtlarıyla izlenir.",
      ],
    ],
  },
  "yonetim-kurulu-mesaji": {
    title: "Başkanın Mesajı",
    image: "/assets/program-diplomacy.webp",
    lead: "İyiliği özenle ve güvenle büyütme yolculuğumuza yön veren anlayışımızı ve geleceğe dair hedeflerimizi paylaşıyoruz.",
    body: [
      "Yedirenk Derneği olarak çıktığımız bu yolun temelinde, yirmi yıllık bilgi, birikim ve saha tecrübesi bulunuyor. Geçmişten bugüne edindiğimiz her tecrübeyi yeni bir sorumluluğun başlangıcı olarak görüyor; eğitim, kültür ve yardımlaşma alanlarında insana dokunan çalışmalar ortaya koymak için gayret ediyoruz.",
      "Bizim için önemli olan yalnızca ne kadar büyük işler yaptığımız değil, üstlendiğimiz her vazifeyi ne kadar samimiyetle ve sorumlulukla yerine getirdiğimizdir. Bu anlayışımızın en güçlü sembollerinden biri, logomuza da ilham veren Ebabil kuşudur. Küçük olmasına rağmen büyük bir vazifenin sembolü olan Ebabil gibi, biz de imkânların büyüklüğünden önce niyete, gayrete ve sorumluluk bilincine inanıyoruz.",
      "İnsanı bütün çalışmalarımızın merkezinde tutuyoruz. Eğitimde yalnızca bilgi aktarmayı değil; ahlakı, değerleri ve sorumluluk bilincini güçlendirmeyi önemsiyoruz. Kültürü geçmişten geleceğe taşınan ortak bir miras olarak görüyor; yardımlaşmayı ise yalnızca maddi bir desteğin ötesinde, paylaşmanın, yanında durmanın ve umut olmanın bir ifadesi olarak kabul ediyoruz.",
      "Hedefimiz, yerel değerlerden beslenen bu anlayışı dünyanın farklı coğrafyalarına taşıyarak 7 kıtada tüm insanlığa ulaşabilmektir. İhtiyaçları doğru tespit eden, sahaya inen, çözüm üreten ve yaptığı çalışmanın kalıcı bir faydaya dönüşmesini önemseyen bir yapı oluşturmak için çalışıyoruz.",
      "Bu yolculukta bize emanet edilen her desteğin büyük bir sorumluluk olduğunun bilincindeyiz. Bağışçılarımızın güvenini, gönüllülerimizin emeğini ve ihtiyaç sahiplerinin beklentilerini aynı hassasiyetle taşıyor; gerçekleştirdiğimiz her çalışmayı özenle ve güvenle yerine getirmeyi esas alıyoruz.",
      "İnanıyoruz ki büyük değişimler her zaman büyük imkânlarla başlamaz. Bazen bir adımla, bir iyilikle, bir uzanan elle başlar. Yedirenk olarak biz de iyiliğin ulaşması gereken her yere, gayretle ve sorumlulukla ulaşmaya devam edeceğiz.",
    ],
    qas: [],
  },
  "kurumsal-kimlik": {
    image: "/assets/yedirenk-logo.webp",
    lead: "Yedirenk’in logo, renk, tipografi ve kurumsal kullanım standartlarına buradan ulaşabilirsiniz.",
    files: [],
    qas: [],
  },
  tuzuk: {
    image: "/assets/program-rights.webp",
    lead: "Yedirenk Derneği’nin amaçlarını, faaliyet alanlarını, üyelik esaslarını ve yönetim yapısını belirleyen resmi kuruluş belgesidir.",
    body: [
      "Dernek tüzüğümüz; amaçlarımızı, faaliyet alanlarımızı, üyelik yapımızı ve yönetim organlarımızın görevlerini tanımlar.",
    ],
    qas: [],
  },
  kvkk: {
    image: "/assets/volunteer.webp",
    lead: "Yedirenk Derneği’nin kişisel veri işleme süreçlerine ilişkin bilgilendirme metinlerine, haklarınıza ve başvuru kanallarına bu alandan ulaşabilirsiniz.",
    body: [
      "Kişisel verilerin gizliliğini ve güvenliğini gözetiyor; verileri yalnızca belirtilen amaçlar ve yasal yükümlülükler doğrultusunda işliyoruz.",
    ],
    qas: [],
  },
  "cerez-politikasi": {
    image: "/assets/program-rights.webp",
    lead: "Web sitemizde kullanılan çerezlerin amaçları, türleri, saklama süreleri ve tercihlerinizi nasıl yönetebileceğiniz hakkında bilgi edinin.",
    qas: [
      [
        "Çerez nedir?",
        "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.",
      ],
      [
        "Hangi çerezleri kullanıyoruz?",
        "Sitenin güvenli ve doğru çalışması için zorunlu çerezler; açık tercihiniz bulunması hâlinde ölçüm ve kullanıcı deneyimi çerezleri kullanılabilir.",
      ],
      [
        "Çerez tercihleri nasıl yönetilir?",
        "Çerezleri tarayıcı ayarlarınızdan silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin kapatılması bazı site özelliklerinin çalışmasını etkileyebilir.",
      ],
    ],
  },
  "ilham-kaynagimiz": {
    image: "/assets/history-logo-v2.webp",
    lead: "Yedirenk’in iyilik anlayışına yön veren değerleri, sembolleri ve ortak sorumluluk düşüncesi.",
    qas: [
      [
        "Yedirenk ne zaman kuruldu?",
        "Derneğin resmî kuruluş ve tescil bilgileri, ilgili kamu kayıtları tamamlandığında tarih ve sicil numarasıyla bu sayfada yayımlanacaktır.",
      ],
      [
        "Ebabil sembolü neden seçildi?",
        "Ebabil; büyüklüğüyle değil, üstlendiği göreve sadakatiyle anılır. Yedirenk için gayreti, sorumluluğu ve desteği doğru kişiye ulaştırma bilincini temsil eder.",
      ],
      [
        "“Yedi renk” neyi ifade eder?",
        "Farklı yaşların, kültürlerin ve imkânların aynı iyilik çatısı altında oluşturduğu zenginliği ve bütünlüğü ifade eder.",
      ],
    ],
  },
  "misyon-vizyon": {
    image: "/assets/program-awareness.webp",
    lead: "İnsan onurunu koruyan yardım, bilgiyi çoğaltan eğitim ve nesilleri buluşturan kültür çalışmaları.",
    qas: [
      [
        "Misyon nasıl sahaya yansır?",
        "Her proje ihtiyaç analiziyle başlar, ölçülebilir hedeflerle uygulanır ve teslim kayıtları ile sonuç göstergeleri üzerinden değerlendirilir.",
      ],
      [
        "Vizyonun zaman hedefi var mı?",
        "Stratejik hedefler yıllık çalışma planlarına ve üç yıllık program dönemlerine ayrılır; gerçekleşmeler dönemsel etki göstergeleriyle izlenir.",
      ],
      [
        "Başarı neye göre ölçülür?",
        "Yalnızca ulaşılan kişi sayısına değil; erişim sürekliliği, eğitim devamlılığı, sağlık sonucu ve yerel sürdürülebilirlik gibi proje özelindeki göstergelere bakılır.",
      ],
    ],
  },
  kurumsal: {
    image: "/assets/program-diplomacy.webp",
    lead: "Yetki, sorumluluk ve denetimin açık biçimde tanımlandığı katılımcı yönetim yapısı.",
    qas: [
      [
        "Yönetim kurulu nasıl belirlenir?",
        "Yönetim kurulu, dernek tüzüğünde belirtilen usule göre genel kurul tarafından belirlenen süre için seçilir. Güncel görev dağılımı resmî süreç tamamlandığında yayımlanır.",
      ],
      [
        "Çıkar çatışması nasıl önlenir?",
        "Yöneticiler ilgili karar öncesinde çıkar ilişkisini beyan eder; ilişkili işlemlerde oylamaya katılmaz. Satın alma ve ödeme süreçlerinde görevler ayrılığı uygulanır.",
      ],
      [
        "Gönüllüler karar süreçlerine katılabilir mi?",
        "Program değerlendirme toplantıları, saha geri bildirimleri ve gönüllü çalışma grupları aracılığıyla öneriler kayıt altına alınır ve ilgili komitelere taşınır.",
      ],
    ],
  },
  "etik-degerler": {
    image: "/assets/program-rights.webp",
    lead: "İnsan onuru, tarafsızlık, zarar vermeme, mahremiyet ve hesap verebilirlik ilkeleri.",
    qas: [
      [
        "Yardımda ayrımcılık yapılır mı?",
        "Hayır. İhtiyaç değerlendirmesi; dil, din, etnik köken, cinsiyet veya siyasi görüş ayrımı yapılmadan, kırılganlık ve aciliyet ölçütleriyle gerçekleştirilir.",
      ],
      [
        "Etik ihlal nasıl bildirilir?",
        "İletişim sayfasındaki etik bildirim konusu seçilerek gizli bildirim yapılabilir. Bildirimler operasyon ekibinden bağımsız değerlendirilir ve misillemeye karşı korunur.",
      ],
      [
        "Fotoğraf ve hikâye paylaşımında izin alınıyor mu?",
        "Evet. Açık rıza, çocuklar için veli onayı ve zarar vermeme ilkesi esastır. Kişinin güvenliğini veya mahremiyetini riske atan içerik yayımlanmaz.",
      ],
    ],
  },
  "bagisci-haklari": {
    image: "/assets/aid.webp",
    lead: "Bağışçının bilgi edinme, tercih belirtme, mahremiyet ve geri bildirim hakları.",
    qas: [
      [
        "Bağışım hangi alanda kullanılır?",
        "Bağış sırasında seçtiğiniz kampanya veya fon için kullanılır. İlgili çalışma tamamlanır ya da ihtiyaç ortadan kalkarsa, şartlı bağış kuralları gereği sizin onayınız alınır veya aynı amaca en yakın programa yönlendirme bilgisi paylaşılır.",
      ],
      [
        "Bağış makbuzuma nasıl ulaşırım?",
        "Çevrim içi bağışın ardından makbuz e-posta adresinize gönderilir. Bağışçı hesabınız aktif olduğunda geçmiş işlemler ve makbuzlar hesabınızdan da indirilebilir.",
      ],
      [
        "İletişim tercihlerimi değiştirebilir miyim?",
        "Evet. E-posta ve SMS izinlerinizi her iletideki tercih bağlantısından veya iletişim formu üzerinden dilediğiniz zaman güncelleyebilirsiniz.",
      ],
    ],
  },
  seffaflik: {
    image: "/assets/program-mavi.webp",
    lead: "Kaynağın kabulünden sahadaki teslimine kadar izlenebilir kayıt ve açık raporlama.",
    qas: [
      [
        "Çalışmalar nasıl doğrulanır?",
        "İhtiyaç listeleri saha ekibi ve yerel paydaşlarca çapraz kontrol edilir. Satın alma belgeleri, teslim tutanakları, konum kayıtları ve uygun durumlarda yararlanıcı teyitleri aynı proje dosyasında eşleştirilir.",
      ],
      [
        "Etki raporlarına nasıl ulaşırım?",
        "Yıllık faaliyet raporları “Yayınlar” bölümünde PDF olarak yayımlanır. Kampanya özelindeki sonuç özeti ise proje kapandıktan sonra bağışçılara e-posta ile gönderilir ve ilgili proje sayfasına eklenir.",
      ],
      [
        "İdari giderler nasıl açıklanır?",
        "Program, kaynak geliştirme ve yönetim giderleri mali tablolarda ayrı başlıklarla gösterilir. Ortak giderler, belgelenmiş ve önceden tanımlanmış dağıtım anahtarlarına göre projelere paylaştırılır.",
      ],
    ],
  },
  "bilgi-guvenligi": {
    image: "/assets/volunteer.webp",
    lead: "Bağışçı, gönüllü ve yararlanıcı verilerini yaşam döngüsü boyunca koruyan güvenlik yaklaşımı.",
    qas: [
      [
        "Kart bilgilerim Yedirenk’te saklanır mı?",
        "Hayır. Ödeme altyapısı aktif olduğunda kart verileri PCI DSS uyumlu ödeme kuruluşu tarafından işlenir; Yedirenk sistemlerinde tam kart numarası tutulmaz.",
      ],
      [
        "Kişisel veriler ne kadar saklanır?",
        "Veriler, ilgili mevzuat ve işleme amacı için gerekli süre boyunca saklanır; süre sonunda güvenli biçimde silinir, yok edilir veya anonimleştirilir.",
      ],
      [
        "Veri talebimi nasıl iletirim?",
        "Kimliğinizi doğrulayabileceğimiz bir başvuruyu iletişim kanalından KVKK konusu ile iletebilirsiniz. Talep yasal süre içinde veri sorumlusu prosedürüne göre yanıtlanır.",
      ],
    ],
  },
  "filistin-gazze": {
    image: "/assets/program-gaza.webp",
    lead: "Gıda, sağlık, barınma ve eğitim ihtiyaçlarına güvenli erişim koşullarına göre öncelik veriyoruz.",
    qas: [
      [
        "Gazze bağışım hangi ihtiyaçta kullanılır?",
        "Bağışınız gıda, içme suyu, sağlık malzemesi veya geçici barınma kalemlerinden sahada doğrulanmış en acil ihtiyaca tahsis edilir. Şartlı bağışlar yalnızca belirtilen kalemde kullanılır.",
      ],
      [
        "Yardımlar bölgeye nasıl ulaştırılıyor?",
        "Erişim koşullarına göre yerel tedarik, güvenilir uygulama ortakları ve izinli lojistik kanalları birlikte kullanılır. Sevkiyat ve teslim belgeleri proje dosyasında tutulur.",
      ],
      [
        "Dağıtım güvenliği nasıl sağlanıyor?",
        "Dağıtım noktaları kalabalık ve güvenlik riski değerlendirilerek seçilir; hane listeleri önceden doğrulanır, mümkün olduğunda zaman aralıklı teslim uygulanır.",
      ],
    ],
  },
  "insani-yardim": {
    image: "/assets/program-humanitarian.webp",
    lead: "Bağışı doğru kişiye, doğru zamanda ve insan onurunu koruyan yöntemle ulaştırıyoruz.",
    qas: [
      [
        "Yararlanıcılar nasıl belirlenir?",
        "Başvurular hane büyüklüğü, gelir durumu, sağlık, engellilik ve afet etkisi gibi ölçütlerle değerlendirilir; bilgiler saha ziyareti veya güvenilir kurum teyidiyle doğrulanır.",
      ],
      [
        "Nakdi yardım mı, ayni yardım mı yapılır?",
        "Piyasanın çalıştığı ve güvenli ödeme imkânının bulunduğu yerlerde nakit veya kupon; erişimin sınırlı olduğu durumlarda ayni yardım tercih edilir. Karar, ihtiyaç analizine göre verilir.",
      ],
      [
        "Aynı haneye mükerrer yardım nasıl önlenir?",
        "Rıza kapsamında tutulan hane kayıtları, proje kodu ve teslim tarihi üzerinden kontrol edilir; yerel koordinasyon mekanizmalarıyla çakışmalar azaltılır.",
      ],
    ],
  },
  "acil-yardim": {
    image: "/assets/program-emergency.webp",
    lead: "Afet ve kriz anlarında hız, güvenlik ve doğru ihtiyaç tespitini birlikte yönetiyoruz.",
    qas: [
      [
        "Acil durumda ilk 24 saatte ne yapılır?",
        "Ekip güvenliği ve erişim doğrulanır, hızlı ihtiyaç değerlendirmesi yapılır; temiz su, sıcak yemek, hijyen ve barınma gibi hayat kurtaran kalemler önceliklendirilir.",
      ],
      [
        "Acil yardım fonu neden önceden toplanır?",
        "İlk müdahalede tedarik ve ulaşım için zaman kaybetmemeyi sağlar. Fon yalnızca doğrulanmış krizlerde, yetkili aktivasyon kararıyla kullanılır.",
      ],
      [
        "Gönüllüler doğrudan afet bölgesine gidebilir mi?",
        "Hayır. Yalnızca eğitimi, sağlık uygunluğu ve görev ataması tamamlanan gönüllüler koordinasyon içinde sahaya yönlendirilir. Kontrolsüz katılım güvenlik ve lojistik riski doğurur.",
      ],
    ],
  },
  yetim: {
    image: "/assets/program-orphan.webp",
    lead: "Çocuğun eğitim, sağlık ve sosyal gelişimini aile temelli ve düzenli biçimde destekliyoruz.",
    qas: [
      [
        "Sponsorluk yalnızca nakit destek midir?",
        "Hayır. Düzenli katkı; eğitim takibi, temel sağlık ihtiyacı, kırtasiye ve sosyal gelişim programlarını içeren çocuk odaklı destek planına aktarılır.",
      ],
      [
        "Çocuklarla doğrudan iletişim kurulabilir mi?",
        "Çocuğun korunması ilkeleri nedeniyle kişisel iletişim bilgileri paylaşılmaz. Uygun iletişim ve hediye süreçleri saha ekibinin gözetiminde yürütülür.",
      ],
      [
        "Sponsorluk ne zaman sona erer?",
        "Yaş, eğitim durumu, aile koşullarındaki değişim veya program ölçütlerine göre düzenli değerlendirme yapılır; sona erme halinde sponsor önceden bilgilendirilir.",
      ],
    ],
  },
  su: {
    image: "/assets/hero-water-branded-v3.webp",
    lead: "Temiz suyu sağlık, eğitim ve güvenli yaşamın başlangıcı olarak görüyoruz.",
    qas: [
      [
        "Kuyu yeri nasıl seçilir?",
        "Nüfus, mevcut su kaynakları, erişim mesafesi ve zemin koşulları incelenir. Teknik uygunluk, yerel yönetim ve topluluk görüşüyle birlikte değerlendirilir.",
      ],
      [
        "Suyun içilebilir olduğu nasıl doğrulanır?",
        "Kuyu açıldıktan sonra fiziksel, kimyasal ve mikrobiyolojik su analizi yapılır. Uygun olmayan kaynak teslim edilmez; arıtma veya alternatif nokta değerlendirilir.",
      ],
      [
        "Kuyunun bakımı kime aittir?",
        "Teslim sırasında yerel su komitesi oluşturulur, temel bakım eğitimi verilir ve sorumlular belirlenir. Periyodik takipte pompa durumu ve su kalitesi kontrol edilir.",
      ],
    ],
  },
  katarakt: {
    image: "/assets/program-cataract.webp",
    lead: "Muayene, ameliyat ve kontrol sürecini kapsayan bütüncül bir sağlık programı.",
    qas: [
      [
        "Hastalar nasıl seçilir?",
        "Yerel sağlık taramalarında görme kaybı tespit edilen kişiler uzman hekimce muayene edilir; ameliyata uygunluk ve tıbbi öncelik hekim kararıyla belirlenir.",
      ],
      [
        "Bağış ameliyatın hangi giderlerini karşılar?",
        "Program bütçesine göre muayene, cerrahi sarf, göz içi lens, operasyon, ilaç ve ameliyat sonrası kontrol giderlerine katkı sağlar.",
      ],
      [
        "Ameliyat sonrası takip yapılıyor mu?",
        "Evet. Kontrol tarihi hastaya bildirilir; iyileşme, enfeksiyon riski ve görme sonucu yerel sağlık ekibi tarafından takip edilir.",
      ],
    ],
  },
  farkindalik: {
    image: "/assets/hero-education-branded-v3.webp",
    lead: "Bilgiyi davranışa, davranışı ortak iyilik kültürüne dönüştüren eğitim programları.",
    qas: [
      [
        "Eğitim içeriklerini kim hazırlıyor?",
        "İçerikler konu uzmanı, eğitimci ve çocuk koruma sorumlusunun katkısıyla hazırlanır; hedef yaş grubuna uygunluk ve anlaşılabilirlik açısından gözden geçirilir.",
      ],
      [
        "Okullar programa nasıl başvurabilir?",
        "Kurum adı, öğrenci yaş grubu, tahmini katılımcı sayısı ve talep edilen tema iletişim formundan iletilir; takvim ve eğitmen uygunluğuna göre planlama yapılır.",
      ],
      [
        "Programın etkisi nasıl ölçülür?",
        "Katılım, ön-son değerlendirme, öğretmen gözlemi ve uygun programlarda davranış değişikliği göstergeleri birlikte kullanılır.",
      ],
    ],
  },
  "arama-kurtarma": {
    image: "/assets/program-rescue.webp",
    lead: "Eğitim, disiplin, ekipman ve düzenli tatbikatla afetlere hazırlık kapasitesi kuruyoruz.",
    qas: [
      [
        "Ekibe katılmak için deneyim gerekir mi?",
        "Başlangıç seviyesinde deneyim şart değildir; ancak sağlık uygunluğu, temel eğitimlere devam ve ekip disiplinine uzun vadeli bağlılık beklenir.",
      ],
      [
        "Ekip hangi eğitimleri alır?",
        "Afet bilinci, saha güvenliği, temel ilk yardım, enkaz yaklaşımı, haberleşme, lojistik ve görev seviyesine uygun teknik eğitimler verilir.",
      ],
      [
        "Ekipmanlar nasıl kontrol edilir?",
        "Her ekipman zimmet ve bakım kaydıyla izlenir; tatbikat öncesi ve sonrası kontrol edilir, üretici periyotlarına göre bakım veya yenileme yapılır.",
      ],
    ],
  },
  "su-kuyusu": {
    image: "/assets/water-well-logo-v2.webp",
    lead: "Bir kuyudan fazlası: teknik etüt, güvenli su analizi, yerel bakım eğitimi ve uzun vadeli takip.",
    qas: [
      [
        "Su kuyusu açtırma süreci nasıl başlar?",
        "Bölge seçimi nüfus, mevcut su kaynağı, yürüme mesafesi ve zemin verileriyle yapılır. Teknik ön inceleme olumluysa proje bütçesi, tahmini süre ve kuyu tipi bağışçıyla paylaşılır.",
      ],
      [
        "Kuyunun üzerine isim yazılabilir mi?",
        "Yerel mevzuat ve saha güvenliği uygun olduğunda, kurumsal standartlara uygun bir proje plakası hazırlanabilir. Kişisel mesajlar insan onurunu ve yerel hassasiyetleri gözeten kurallara tabidir.",
      ],
      [
        "Açılıştan sonra kuyu takip ediliyor mu?",
        "Evet. Yerel su komitesi bakım konusunda eğitilir; pompa, drenaj ve su kalitesi belirlenen takip dönemlerinde kontrol edilir. Arıza bildirimleri yerel sorumlu üzerinden kayıt altına alınır.",
      ],
    ],
  },
};

cmsDefaults.pages = Object.fromEntries(
  Object.entries(pageContent).map(([path, value]) => {
    const slug = path.split("/").filter(Boolean).pop() || "anasayfa";
    const special = pageProfiles[slug] || {};
    return [
      slug,
      {
        title: value.title || slugMap[slug] || slug,
        category: value.category || "",
        lead: special.lead || value.summary || "",
        image: special.image || "/assets/hero-solidarity-branded-v3.webp",
        qas: special.qas || [],
        path,
        active: true,
      },
    ];
  }),
);
Object.entries(pageProfiles).forEach(([slug, value]) => {
  cmsDefaults.pages[slug] = {
    title: slugMap[slug] || slug,
    category: "",
    ...value,
    path: cmsDefaults.pages[slug]?.path || `/${slug}`,
    active: true,
  };
});

function Logo({ light = false }) {
  const { content } = useCms();
  const settings = content.settings;
  return (
    <Link to="/" className={`logo ${light ? "light" : ""}`}>
      <img
        style={{ width: settings.logoWidth, height: settings.logoHeight }}
        src={settings.logo}
        alt="Yedirenk Derneği"
      />
    </Link>
  );
}

function Header({ language, setLanguage }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const projectMenuItems = uniqueProjectGroups(projects);
  const permanentProjectSlugs = new Set([
    "su-kuyusu",
    "medrese",
    "cami",
    "mescid",
  ]);
  const projectMenuColumns = [
    projectMenuItems.filter(
      (project) => !permanentProjectSlugs.has(project.slug),
    ),
    projectMenuItems.filter((project) =>
      permanentProjectSlugs.has(project.slug),
    ),
  ];
  const activeMenu = content.navigation || menu;
  const [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false),
    [mobileSection, setMobileSection] = useState(""),
    [dismissedMenu, setDismissedMenu] = useState("");
  const nav = useNavigate();
  const closeMenu = (menuName) => {
    setDismissedMenu(menuName);
    setMobileSection("");
    setMobile(false);
  };
  useEffect(() => {
    document.body.classList.toggle("mobile-navigation-open", mobile);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobile(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("mobile-navigation-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobile]);
  return (
    <>
      <div className="alertbar">
        <div className="container">
          <div>
            <Link to="/hesap-numaralari">Hesap Numaraları</Link>
            <Link to="/zekat-hesapla">Zekât Hesapla</Link>
            <Link to="/iletisim">İletişim</Link>
            <label className="language-select" aria-label="Dil seçimi">
              <Globe2 />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(content.languages || {})
                  .filter(([key, item]) => key === "tr" && item.published)
                  .map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.code} · {item.label}
                    </option>
                  ))}
              </select>
              <ChevronDown />
            </label>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={mobile ? "open" : ""}>
            {activeMenu.map((m) => (
              <div
                className={`nav-group ${
                  dismissedMenu === m.label ? "menu-dismissed" : ""
                }`}
                key={m.label}
                onMouseEnter={() => setDismissedMenu("")}
              >
                <Link to={safePath(m.path)} onClick={() => closeMenu(m.label)}>
                  {m.label}
                  <ChevronDown />
                </Link>
                <button
                  className="mobile-nav-toggle"
                  type="button"
                  aria-label={`${m.label} alt menüsünü aç`}
                  aria-expanded={mobileSection === m.label}
                  onClick={() =>
                    setMobileSection((current) =>
                      current === m.label ? "" : m.label,
                    )
                  }
                >
                  <ChevronDown />
                </button>
                <div
                  className={`mega ${
                    mobileSection === m.label ? "mobile-open" : ""
                  }`}
                >
                  <div className="mega-brand">
                    <span>ÖZENLE VE GÜVENLE</span>
                    <h3>{m.label}</h3>
                    <p>
                      İyiliği kalıcı etkiye dönüştüren Yedirenk yaklaşımını
                      keşfedin.
                    </p>
                    <Link
                      to={safePath(m.path)}
                      onClick={() => closeMenu(m.label)}
                    >
                      Tümünü gör <ArrowRight />
                    </Link>
                  </div>
                  {m.cols.map((c) => (
                    <div className="mega-col" key={c[0]}>
                      <b>{c[0]}</b>
                      {c[1].map((x) => {
                        const Icon = submenuIcons[x] || Sparkles;
                        return (
                          <Link
                            className="submenu-icon-link"
                            key={x}
                            to={findPath(x)}
                            onClick={() => closeMenu(m.label)}
                          >
                            <Icon />
                            <span>{x}</span>
                            <ArrowRight />
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div
              className={`nav-group projects-nav-group ${
                dismissedMenu === "Projeler" ? "menu-dismissed" : ""
              }`}
              onMouseEnter={() => setDismissedMenu("")}
            >
              <Link to="/projeler" onClick={() => closeMenu("Projeler")}>
                Projeler
                <ChevronDown />
              </Link>
              <button
                className="mobile-nav-toggle"
                type="button"
                aria-label="Projeler alt menüsünü aç"
                aria-expanded={mobileSection === "Projeler"}
                onClick={() =>
                  setMobileSection((current) =>
                    current === "Projeler" ? "" : "Projeler",
                  )
                }
              >
                <ChevronDown />
              </button>
              <div
                className={`mega projects-mega ${
                  mobileSection === "Projeler" ? "mobile-open" : ""
                }`}
              >
                <div className="mega-brand">
                  <span>YEDİRENK PROJELERİ</span>
                  <h3>İyiliğe ortak olun</h3>
                  <p>
                    Destek olmak istediğiniz projeyi seçerek açıklamasına ve
                    bağış seçeneklerine doğrudan ulaşın.
                  </p>
                  <Link to="/projeler" onClick={() => closeMenu("Projeler")}>
                    Proje sayfasına git <ArrowRight />
                  </Link>
                </div>
                {projectMenuColumns.map((items, index) => (
                  <div className="mega-col project-mega-col" key={index}>
                    <b>
                      {index === 0 ? "YARDIM PROJELERİ" : "KALICI PROJELER"}
                    </b>
                    {items.map((project) => {
                      const Icon = projectGroupIcon(project);
                      return (
                        <Link
                          className="project-mega-link"
                          key={project.slug}
                          to={`/projeler/${project.slug}`}
                          onClick={() => closeMenu("Projeler")}
                        >
                          <Icon />
                          <span>{projectGroupLabel(project)}</span>
                          <ArrowRight />
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mobile-nav-shortcuts">
              <Link className="mobile-donate-link" to="/projeler" onClick={() => closeMenu("Projeler")}>
                Bağış Yap <ArrowRight />
              </Link>
              <Link to="/hesap-numaralari" onClick={() => closeMenu("")}>
                <Landmark /> Hesap Numaraları
              </Link>
              <Link to="/zekat-hesapla" onClick={() => closeMenu("")}>
                <Calculator /> Zekât Hesapla
              </Link>
              <Link to="/iletisim" onClick={() => closeMenu("")}>
                <Mail /> İletişim
              </Link>
              <Link to="/arama" onClick={() => closeMenu("")}>
                <Search /> Site İçinde Ara
              </Link>
              <Link to="/giris" onClick={() => closeMenu("")}>
                <CircleUserRound /> Hesabım
              </Link>
            </div>
            <button
              className="mobile-x"
              aria-label="Menüyü kapat"
              onClick={() => setMobile(false)}
            >
              <X />
            </button>
          </nav>
          <div className="header-actions">
            <button onClick={() => setSearch(!search)}>
              <Search />
            </button>
            <Link to="/giris">
              <CircleUserRound />
            </Link>
            <Link className="btn orange" to="/projeler">
              Bağış Yap <ArrowRight />
            </Link>
            <button
              className="mobile-menu"
              aria-label="Menüyü aç"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
        {search && (
          <form
            className="searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              nav(
                "/arama?q=" +
                  encodeURIComponent(new FormData(e.currentTarget).get("q")),
              );
              setSearch(false);
            }}
          >
            <div className="container">
              <button type="submit" aria-label="Ara">
                <Search />
              </button>
              <input name="q" autoFocus placeholder="Yedirenk'te ara..." />
              <button
                type="button"
                aria-label="Aramayı kapat"
                onClick={() => setSearch(false)}
              >
                <X />
              </button>
            </div>
          </form>
        )}
      </header>
    </>
  );
}

function findPath(label) {
  const map = {
    Hakkımızda: "/kurumsal/hakkimizda",
    "Biz Kimiz?": "/kurumsal/hakkimizda",
    "Başkanın Mesajı": "/kurumsal/yonetim-kurulu-mesaji",
    "Yönetim Kurulu Mesajı": "/kurumsal/yonetim-kurulu-mesaji",
    "Kurumsal Kimlik": "/kurumsal/kurumsal-kimlik",
    Tüzük: "/kurumsal/tuzuk",
    KVKK: "/kurumsal/kvkk",
    "İlham Kaynağımız": "/kurumsal/ilham-kaynagimiz",
    "Misyon & Vizyon": "/kurumsal/misyon-vizyon",
    Kurumsal: "/kurumsal/kurumsal",
    "Etik Değerler": "/kurumsal/etik-degerler",
    "Bağışçı Hakları": "/kurumsal/bagisci-haklari",
    Şeffaflık: "/kurumsal/seffaflik",
    "Bilgi Güvenliği": "/kurumsal/bilgi-guvenligi",
    Gazze: "/calismalarimiz/filistin-gazze",
    "İnsani Yardım": "/calismalarimiz/insani-yardim",
    "Afet ve Kriz Yardımı": "/calismalarimiz/acil-yardim",
    Yetim: "/calismalarimiz/yetim",
    Su: "/calismalarimiz/su",
    Katarakt: "/calismalarimiz/katarakt",
    Eğitim: "/calismalarimiz/egitim",
    Kültür: "/calismalarimiz/kultur",
    Yardımlaşma: "/calismalarimiz/yardimlasma",
    "Arama Kurtarma": "/calismalarimiz/arama-kurtarma",
    "Bağış Yap": "/projeler",
    "Sponsor Ol": "/katil/sponsor-ol",
    "Su Kuyusu Açtır": "/katil/su-kuyusu",
    "Gönüllü Ol": "/katil/gonullu-ol",
    "Zekât Hesapla": "/zekat-hesapla",
    "Hesap Numaraları": "/hesap-numaralari",
    "Bültene Katıl": "/katil/bulten",
    Yayınlar: "/yayinlar",
  };
  return map[label] || "/";
}

function SearchPage() {
  const { content } = useCms();
  const page = getSitePage(content, "search");
  const projects = getProjects(content);
  const [params] = useSearchParams();
  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]');
    const created = !robots;
    const previous = robots?.getAttribute("content");
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, follow";
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${window.location.origin}/`;
    return () => {
      if (created) robots.remove();
      else if (previous) robots.content = previous;
      else robots.removeAttribute("content");
    };
  }, []);
  const query = (params.get("q") || "").trim(),
    normalized = query.toLocaleLowerCase("tr-TR");
  const entries = [
    ...projects.map((x) => ({
      title: x.title,
      text: `${x.category} ${x.short} ${x.description}`,
      path: `/projeler/${x.slug}`,
    })),
    ...(content.news || [])
      .filter((x) => x.active !== false)
      .map((x) => ({
        title: x.title,
        text: `${x.category} ${x.summary} ${x.body || ""}`,
        path: `/haberler/${x.id}`,
      })),
    ...Object.entries(content.pages || {})
      .filter(([, x]) => x.active !== false)
      .map(([slug, x]) => ({
        title: x.title || slug,
        text: `${x.category || ""} ${x.intro || ""} ${x.body || ""}`,
        path: x.path || `/${slug}`,
      })),
    ...(content.workAreas || []).map((x) => ({
      title: x.title,
      text: x.description,
      path: x.path,
    })),
  ];
  const results = normalized
    ? entries
        .filter((x) =>
          `${x.title} ${x.text}`
            .toLocaleLowerCase("tr-TR")
            .includes(normalized),
        )
        .filter((x, i, list) => list.findIndex((y) => y.path === x.path) === i)
    : [];
  return (
    <main>
      <PageHero
        tag={page.tag}
        title={page.title}
        text={page.text}
        image={page.image}
      />
      <section className="section search-results-section">
        <div className="container">
          <form className="search-results-form">
            <Search />
            <input
              name="q"
              defaultValue={query}
              required
              autoFocus
              placeholder={page.sectionTitle}
            />
            <button className="btn navy">Ara</button>
          </form>
          {query && (
            <p className="search-results-count">
              <b>{query}</b> için {results.length} sonuç bulundu.
            </p>
          )}
          <div className="search-results-list">
            {results.map((x) => (
              <Link key={x.path} to={safePath(x.path)}>
                <span>
                  <b>{x.title}</b>
                  <small>{x.text}</small>
                </span>
                <ArrowRight />
              </Link>
            ))}
            {query && !results.length && (
              <div className="search-empty">
                <Search />
                <h2>{page.emptyTitle}</h2>
                <p>{page.emptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  const activeSlides = slides;
  const [active, setActive] = useState(0),
    [categoryTabsPaused, setCategoryTabsPaused] = useState(false),
    categoryTabsRef = useRef(null),
    categoryResumeTimerRef = useRef(null),
    categoryManualPausedRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(
      () => setActive((x) => (x + 1) % activeSlides.length),
      6500,
    );
    return () => clearTimeout(t);
  }, [active, activeSlides.length]);
  useEffect(() => {
    const track = categoryTabsRef.current;
    if (!track || categoryTabsPaused) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    let frame,
      previousTime = performance.now();
    const move = (time) => {
      const cycleWidth = track.firstElementChild?.offsetWidth || 0;
      if (
        cycleWidth &&
        track.scrollWidth > track.clientWidth &&
        !categoryManualPausedRef.current
      ) {
        const elapsed = Math.min(40, time - previousTime);
        if (track.scrollLeft <= 0.5) track.scrollLeft += cycleWidth;
        if (track.scrollLeft > cycleWidth * 2 + 0.5)
          track.scrollLeft -= cycleWidth;
        track.scrollLeft -= elapsed * 0.035;
      }
      previousTime = time;
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [categoryTabsPaused]);
  useEffect(() => {
    return () => {
      categoryManualPausedRef.current = false;
      window.clearTimeout(categoryResumeTimerRef.current);
    };
  }, []);
  const scrollCategoryTabs = (direction) => {
    const track = categoryTabsRef.current;
    if (!track) return;
    const group = track.firstElementChild;
    const cycleWidth = group?.offsetWidth || 0;
    const firstItem = group?.querySelector("a");
    const gap = group
      ? Number.parseFloat(window.getComputedStyle(group).columnGap) || 0
      : 0;
    const twoProjectDistance =
      ((firstItem?.getBoundingClientRect().width || 136) + gap) * 2;
    const distance = direction * twoProjectDistance;

    categoryManualPausedRef.current = true;
    setCategoryTabsPaused(true);
    window.clearTimeout(categoryResumeTimerRef.current);
    if (distance < 0 && track.scrollLeft < Math.abs(distance) && cycleWidth)
      track.scrollLeft += cycleWidth;
    if (
      distance > 0 &&
      track.scrollLeft + distance > cycleWidth * 2 &&
      cycleWidth
    )
      track.scrollLeft -= cycleWidth;
    track.scrollBy({ left: distance, behavior: "smooth" });
    categoryResumeTimerRef.current = window.setTimeout(() => {
      categoryManualPausedRef.current = false;
      setCategoryTabsPaused(false);
    }, 700);
  };
  return (
    <section className="hero-slider">
      <div className="container hero-stage">
        {activeSlides.map((s, i) => (
          <article
            key={s.slug}
            className={i === active ? "active" : ""}
            style={
              i === active
                ? {
                    "--hero-desktop-image": `url(${s.image})`,
                    "--hero-mobile-image": `url(${s.mobileImage || s.image})`,
                  }
                : undefined
            }
          >
            <Link
              className="hero-mobile-link"
              to={s.path}
              aria-label={`${s.label} projesine git`}
            />
            <div className="hero-copy">
              <span>
                <i style={{ background: s.color }} />
                {s.tag}
              </span>
              <h1 aria-label={s.title}>
                {(s.titleLines || [s.title]).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p>{s.text}</p>
              <div>
                <Link className="btn orange" to={s.path}>
                  {s.cta}
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </article>
        ))}
        <button
          className="hero-arrow hero-arrow-prev"
          aria-label="Önceki proje"
          onClick={() =>
            setActive((active + activeSlides.length - 1) % activeSlides.length)
          }
        >
          <ChevronLeft />
        </button>
        <button
          className="hero-arrow hero-arrow-next"
          aria-label="Sonraki proje"
          onClick={() => setActive((active + 1) % activeSlides.length)}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="container hero-category-shell">
        <button
          type="button"
          className="hero-category-control previous"
          aria-label="Proje seçeneklerini sola kaydır"
          onClick={() => scrollCategoryTabs(-1)}
        >
          <ChevronLeft />
        </button>
        <nav
          ref={categoryTabsRef}
          className="hero-category-tabs"
          aria-label="Projeler"
          onWheel={(event) => {
            const track = event.currentTarget;
            if (track.scrollWidth <= track.clientWidth) return;
            event.preventDefault();
            const cycleWidth = track.firstElementChild?.offsetWidth || 0;
            let nextPosition =
              track.scrollLeft + (event.deltaX || event.deltaY);
            if (cycleWidth) {
              if (nextPosition < 0) nextPosition += cycleWidth;
              if (nextPosition >= cycleWidth) nextPosition -= cycleWidth;
            }
            track.scrollLeft = nextPosition;
          }}
          onPointerDown={() => setCategoryTabsPaused(true)}
          onPointerUp={() => setCategoryTabsPaused(false)}
          onPointerCancel={() => setCategoryTabsPaused(false)}
          onFocus={() => setCategoryTabsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setCategoryTabsPaused(false);
          }}
        >
          {["preceding", "primary", "duplicate"].map((groupName) => (
            <div
              className="hero-category-group"
              key={groupName}
              aria-hidden={groupName !== "primary" ? "true" : undefined}
            >
              {heroProjectLinks.map((project) => {
                const Icon = projectIcons[project.slug] || HandHeart;
                return (
                  <Link
                    to={project.path}
                    key={`${groupName}-${project.slug}`}
                    aria-label={`${project.label} projesine git`}
                    tabIndex={groupName !== "primary" ? -1 : undefined}
                  >
                    <Icon />
                    <span>{project.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <button
          type="button"
          className="hero-category-control next"
          aria-label="Proje seçeneklerini sağa kaydır"
          onClick={() => scrollCategoryTabs(1)}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function Heading({ eyebrow, title, side }) {
  return (
    <div className="section-head">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {side && <p>{side}</p>}
    </div>
  );
}

const getPrimaryProjectVariant = (project) =>
  project.slug === "adak-akika-nafile-kurban"
    ? project.variants.find((variant) => variant[0] === "Afrika") ||
      project.variants[0]
    : project.variants[0];

const getSlideProjectPath = (slide, projects) => {
  const searchable = [slide.image, slide.tag, slide.title, slide.text]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("tr-TR");
  const rules = [
    ["adak-akika-nafile-kurban", /kurban|qurbani/],
    ["su-kuyusu", /su\b|kuyu|water|well/],
    ["gida-kolisi", /gıda|gida|food|acil|insani|humanitarian|solidarity|aid/],
    ["yetim-giydirme", /giydir|kıyafet|kiyafet|clothing/],
    ["yetim-hamiligi", /yetim|orphan|hamili/],
    ["zekat", /zek[aâ]t|zakat/],
    ["medrese", /eğitim|egitim|education|medrese|school|academy|çocuk|cocuk/],
    ["mescid", /mescid|masjid/],
    ["cami", /cami|mosque/],
  ];
  const matchedSlug = rules.find(
    ([slug, pattern]) =>
      projects.some((project) => project.slug === slug) &&
      pattern.test(searchable),
  )?.[0];
  if (matchedSlug) return `/projeler/${matchedSlug}`;

  const savedSlug = String(slide.path || "").match(
    /^\/projeler\/([^/?#]+)/,
  )?.[1];
  return projects.some((project) => project.slug === savedSlug)
    ? `/projeler/${savedSlug}`
    : "/projeler";
};

function ProjectCard({ project, add, grouped = false }) {
  const Icon = projectGroupIcon(project);
  const variant = getPrimaryProjectVariant(project);
  const projectPath = `/projeler/${project.slug}`;
  const isOrphanGroup = grouped && project.category === "Yetim";
  const isWorshipGroup = grouped && projectGroupKey(project) === "cami-mescid";
  const displayTitle = projectGroupLabel(project);
  const displayShort = isOrphanGroup
    ? "Yetim çocukların düzenli ihtiyaçlarına hamilik veya giydirme desteğiyle katkı sağlayın."
    : isWorshipGroup
      ? "Cami ve mescid projeleriyle güvenli, erişilebilir ve kalıcı ibadet alanlarına destek olun."
      : project.short;
  return (
    <article
      className={`project-card${
        project.slug === "gazze-yardim" ? " gazze-main-project-card" : ""
      }`}
    >
      <Link
        className="project-image"
        to={projectPath}
        aria-label={`${displayTitle} detaylarını gör`}
      >
        <Media
          src={projectCardImages[project.slug] || project.image}
          alt={`${displayTitle} bağış projesi`}
        />
        <span className="project-category-badge">
          {projectGroupLabel(project)}
        </span>
      </Link>
      <div className="project-copy">
        <Link className="project-card-title" to={projectPath}>
          <h3>
            <Icon />
            {displayTitle}
          </h3>
        </Link>
        <p>{displayShort}</p>
        <div>
          <Link
            className="project-detail-link project-donate-link"
            to={projectPath}
          >
            {project.calculator ? "ZEKÂTINIZI HESAPLAYIN" : "BAĞIŞ YAP"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function FundingProgress({ project, stats }) {
  return (
    <div className="funding-progress">
      <div>
        <b>{money(stats.raised)}</b>
        <strong>%{stats.percent.toFixed(1).replace(".", ",")}</strong>
      </div>
      <div
        className="funding-progress-track"
        role="progressbar"
        aria-label={`${project.title} fonlanma oranı`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(stats.percent)}
      >
        <i style={{ width: `${stats.percent}%` }} />
      </div>
      <small>
        <UsersRound /> {stats.supporters.toLocaleString("tr-TR")} kişi bu
        projeyi destekledi
      </small>
    </div>
  );
}

function HomeFundingProjects() {
  const progress = useFundingProgress();
  return (
    <section className="home-funding-section">
      <div className="container">
        <div className="home-funding-heading">
          <span>PROJE FONLAYIN</span>
          <h2>Destekleyin, hayat bulsun.</h2>
          <p>
            Hedefe doğru ilerleyen özel projelerden birini seçin, katkınızın
            oluşturduğu etkiyi anlık olarak takip edin.
          </p>
        </div>
        <div className="home-funding-grid">
          {fundingProjects.map((project) => {
            const stats = fundingStats(project, progress);
            return (
              <article key={project.slug}>
                <div className="home-funding-image">
                  <img src={project.image} alt={project.title} loading="lazy" />
                </div>
                <div className="home-funding-copy">
                  <span>{project.country}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <FundingProgress project={project} stats={stats} />
                  <Link
                    className="btn turquoise"
                    to={`/fon-projeleri/${project.slug}`}
                  >
                    Projeyi Destekle <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FundingProjectDetail({ add }) {
  const { slug } = useParams();
  const matchedProject = fundingProjects.find((item) => item.slug === slug);
  const project = matchedProject || fundingProjects[0];
  const progress = useFundingProgress();
  const [amount, setAmount] = useState(500);
  const stats = fundingStats(project, progress);
  usePageSeo({
    title: project.title,
    description: project.summary,
    image: project.image,
  });
  if (!matchedProject) return <Navigate to="/" replace />;
  const donate = (event) => {
    event.preventDefault();
    const value = Math.round(Number(amount));
    if (!Number.isFinite(value) || value < 50) return;
    add({
      slug: `fon-${project.slug}`,
      fundingProjectSlug: project.slug,
      title: project.title,
      price: value,
      currency: "TRY",
      image: project.image,
    });
  };
  return (
    <main className="funding-detail-page">
      <section className="container funding-detail-heading">
        <span>{project.country}</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </section>
      <section className="container funding-detail-layout">
        <article>
          <img src={project.image} alt={project.title} />
          <FundingProgress project={project} stats={stats} />
          <div className="funding-target">
            <span>Hedeflenen toplam</span>
            <b>{money(project.target)}</b>
          </div>
          {project.description.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="callout">
            <ShieldCheck />
            <div>
              <h3>Şeffaf proje takibi</h3>
              <p>
                Başarıyla tamamlanan her bağış toplanan tutara eklenir ve
                ilerleme yüzdesi hedef tutara göre otomatik hesaplanır.
              </p>
            </div>
          </div>
        </article>
        <aside>
          <span>PROJEYE KATKI SAĞLA</span>
          <h2>Bağışınızı Belirleyin</h2>
          <form onSubmit={donate}>
            <label htmlFor="funding-amount">Bağış tutarı</label>
            <div className="funding-amount-input">
              <b>₺</b>
              <input
                id="funding-amount"
                type="number"
                min="50"
                step="50"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="funding-presets">
              {[250, 500, 1000, 2500].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAmount(value)}
                >
                  {money(value)}
                </button>
              ))}
            </div>
            <button className="btn turquoise">
              Hemen Bağış Yap <ArrowRight />
            </button>
          </form>
          <small>En az 50 ₺ ile projeye destek olabilirsiniz.</small>
        </aside>
      </section>
    </main>
  );
}

function HomeVideo() {
  const frameRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const sendCommand = (func, args = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com",
    );
  };

  useEffect(() => {
    const configurePlayer = () => {
      sendCommand("setOption", ["captions", "track", {}]);
      sendCommand("setOption", ["cc", "track", {}]);
      sendCommand("unMute");
      sendCommand("playVideo");
    };
    const firstAttempt = window.setTimeout(configurePlayer, 700);
    const secondAttempt = window.setTimeout(configurePlayer, 1800);
    return () => {
      window.clearTimeout(firstAttempt);
      window.clearTimeout(secondAttempt);
    };
  }, []);

  const togglePlayback = () => {
    const nextPlaying = !playing;
    sendCommand(nextPlaying ? "playVideo" : "pauseVideo");
    setPlaying(nextPlaying);
  };
  const toggleSound = () => {
    const nextMuted = !muted;
    sendCommand(nextMuted ? "mute" : "unMute");
    if (!nextMuted) sendCommand("playVideo");
    setMuted(nextMuted);
    if (!nextMuted) setPlaying(true);
  };

  return (
    <section
      className="home-video-section"
      aria-label="Yedirenk Derneği tanıtım videosu"
    >
      <div className="container">
        <div className="home-video-frame">
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/6oEyPMHsNFc?autoplay=1&mute=0&controls=0&loop=1&playlist=6oEyPMHsNFc&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="Yedirenk Derneği tanıtım videosu"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={false}
          />
          <div className="home-video-brand" aria-hidden="true">
            <img src="/assets/yedirenk-logo-official-pdf.webp" alt="" />
          </div>
          <div className="home-video-controls">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={playing ? "Videoyu durdur" : "Videoyu oynat"}
              title={playing ? "Durdur" : "Oynat"}
            >
              {playing ? <Pause /> : <Play />}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? "Sesi aç" : "Sesi kapat"}
              title={muted ? "Sesi aç" : "Sesi kapat"}
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { content } = useCms();
  const h = content.home;
  const activeNews = content.news.filter((x) => x.active !== false);
  usePageSeo({
    title: "Yedirenk Derneği | Özenle ve Güvenle",
    exactTitle: true,
    canonicalPath: "/",
    description:
      "Yedirenk Derneği; eğitim, kültür ve yardımlaşma çalışmalarında bağışlarınızı ihtiyaç sahiplerine özenle ve güvenle ulaştırır.",
    image: "/assets/yedirenk-logo.webp",
  });
  return (
    <main>
      <Hero />
      <HomeVideo />
      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-mark">
            <img
              src="/assets/yedirenk-mark-transparent.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <span className="kicker">{h.introEyebrow}</span>
            <h2>{h.introTitle}</h2>
          </div>
          <div>
            <p>{h.introText}</p>
            <Link className="text-link" to="/kurumsal/hakkimizda">
              Yedirenk’i yakından tanı <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="section news">
        <div className="container">
          <Heading
            eyebrow="YEDİRENK’TEN"
            title={
              <>
                Haberler ve <em>duyurular.</em>
              </>
            }
          />
          <div className="news-grid">
            {activeNews.slice(0, 3).map((n) => (
              <Link to={`/haberler/${n.id}`} key={n.id}>
                <img
                  src={n.image}
                  alt={n.title}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <span>{n.category}</span>
                  <small>
                    <CalendarDays />
                    <time dateTime={n.published}>{n.date}</time>
                  </small>
                  <h3>{n.title}</h3>
                  <b>
                    Haberi oku <ArrowRight />
                  </b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-volunteer-section">
        <div className="container home-volunteer-grid">
          <div className="home-volunteer-mark">
            <HeartHandshake />
          </div>
          <div>
            <span className="kicker">GÖNÜLLÜ OL</span>
            <h2>İyiliğe zamanınla ve emeğinle katıl.</h2>
          </div>
          <div>
            <p>
              Bilgini, zamanını ve yeteneklerini paylaş; eğitim, kültür ve
              yardımlaşma çalışmalarımızda iyiliği birlikte büyütelim.
            </p>
            <Link className="text-link" to="/katil/gonullu-ol">
              Gönüllü başvurusu yap <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function NewsPage() {
  const { content } = useCms();
  const page = getSitePage(content, "news");
  usePageSeo({
    title: "Haberler ve Güncel Çalışmalar",
    description:
      "Yedirenk Derneğinin insani yardım, eğitim, sağlık, temiz su, yetim desteği ve gönüllülük çalışmalarından güncel haberleri inceleyin.",
    image: "/assets/news-parental-loss-v1.jpg",
  });
  const [category, setCategory] = useState("Tümü");
  const items = content.news.filter((x) => x.active !== false);
  const categories = ["Tümü", ...new Set(items.map((x) => x.category))];
  const visible =
    category === "Tümü" ? items : items.filter((x) => x.category === category);
  return (
    <main className="simple-news-page">
      <section className="container simple-news-heading">
        <span>{page.tag || "YEDİRENK’TEN"}</span>
        <h1>{page.title}</h1>
        <p>{page.text}</p>
      </section>
      <section className="news-listing">
        <div className="container">
          <div className="section-head">
            <div>
              <span>GÜNCEL GELİŞMELER</span>
              <h2>{page.sectionTitle}</h2>
            </div>
            <p>{page.sectionText}</p>
          </div>
          <div className="filters">
            {categories.map((x) => (
              <button
                className={category === x ? "active" : ""}
                onClick={() => setCategory(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="news-list-grid">
            {visible.map((n, i) => (
              <article
                key={n.title}
                className={i === 0 && category === "Tümü" ? "featured" : ""}
              >
                <Link
                  to={`/haberler/${n.id || i + 1}`}
                  className="news-list-image"
                >
                  <img src={n.image} alt={n.title} loading="lazy" />
                  <span>{n.category}</span>
                </Link>
                <div>
                  <small>
                    <CalendarDays /> {n.date}
                  </small>
                  <h3>{n.title}</h3>
                  <p>{n.summary}</p>
                  <Link className="text-link" to={`/haberler/${n.id || i + 1}`}>
                    Haberi oku <ArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function NewsDetail() {
  const { content } = useCms();
  const { id } = useParams();
  const stories = Object.fromEntries(
    managedNews.map((item) => [item.id, { ...item, lead: item.summary }]),
  );
  const managed = content.news.find((x) => String(x.id) === String(id));
  const story = managed
    ? { ...managed, lead: managed.summary }
    : stories[id] || stories["1"];
  usePageSeo({
    title: story.title,
    description: story.lead,
    image: story.image,
    type: "article",
  });
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.newsSchema = "true";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: story.title,
      description: story.lead,
      image: [new URL(story.image, window.location.origin).href],
      datePublished: story.published || story.date,
      author: { "@type": "Organization", name: "Yedirenk Derneği" },
      publisher: { "@type": "Organization", name: "Yedirenk Derneği" },
      mainEntityOfPage: window.location.href,
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [story.date, story.image, story.lead, story.published, story.title]);
  return (
    <main className="simple-news-detail-page">
      <section className="container simple-news-detail-heading">
        <span>{story.category}</span>
        <small>
          <CalendarDays />
          <time dateTime={story.published}>{story.date}</time>
        </small>
        <h1>{story.title}</h1>
        <p>{story.lead}</p>
      </section>
      <section className="article-page">
        <article className="container">
          <div className="article-news-image">
            <Media src={story.image} alt={story.title} />
          </div>
          <p className="lead">{story.lead}</p>
          {(
            story.body ||
            "Çalışma öncesinde ihtiyaç, erişim koşulları ve yerel kapasite saha ekibi tarafından değerlendirildi."
          )
            .split("\n")
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          <Link className="text-link" to="/haberler">
            <ChevronLeft /> Tüm haberlere dön
          </Link>
        </article>
      </section>
    </main>
  );
}

function PageHero({ tag, title, text, image }) {
  const video = isVideoMedia(image);
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: video
          ? "none"
          : `url(${image || "/assets/hero-solidarity-branded-v3.webp"})`,
      }}
    >
      {video && <Media className="page-hero-video" src={image} background />}
      <div className="container">
        <span>{tag}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <div>
          <Link to="/">Ana Sayfa</Link>
          <ChevronRight />
          {title}
        </div>
      </div>
    </section>
  );
}

function PageReturnNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null;

  const goBack = () => {
    const historyIndex = Number(window.history.state?.idx);
    if (Number.isFinite(historyIndex) && historyIndex > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <nav className="page-return-nav" aria-label="Sayfa dönüş bağlantıları">
      <div className="container">
        <button type="button" onClick={goBack}>
          <span className="page-return-icon">
            <ChevronLeft />
          </span>
          <span className="page-return-label">
            <small>GERİ DÖN</small>
            Önceki Sayfa
          </span>
        </button>
        <i aria-hidden="true" />
        <Link to="/">
          <span className="page-return-icon">
            <House />
          </span>
          <span className="page-return-label">
            <small>BAŞLANGIÇ</small>
            Ana Sayfa
          </span>
        </Link>
      </div>
    </nav>
  );
}

function ContentPage() {
  const { content } = useCms();
  const loc = useLocation();
  const slug = loc.pathname.split("/").filter(Boolean).pop();
  const isWork = loc.pathname.includes("calismalarimiz");
  const fixedCorporateProfile = [
    "hakkimizda",
    "yonetim-kurulu-mesaji",
  ].includes(slug);
  const profile = fixedCorporateProfile
    ? pageProfiles[slug]
    : content.pages?.[slug] ||
      pageProfiles[slug] ||
      pageProfiles[isWork ? "insani-yardim" : "hakkimizda"];
  const title = profile.title || slugMap[slug] || "Yedirenk";
  const img = profile.image;
  if (slug === "kurumsal-kimlik")
    return <CorporateIdentityPage profile={profile} />;
  if (slug === "tuzuk") return <StatutePage profile={profile} />;
  if (slug === "kvkk") return <PrivacyPage profile={profile} />;
  if (
    [
      "hakkimizda",
      "ozenle-ve-guvenle",
      "yonetim-kurulu-mesaji",
      "kurumsal-kimlik",
      "tuzuk",
      "kvkk",
      "cerez-politikasi",
      "ilham-kaynagimiz",
      "misyon-vizyon",
      "kurumsal",
      "egitim",
      "kultur",
      "yardimlasma",
    ].includes(slug)
  ) {
    return <SimpleCorporatePage profile={profile} title={title} slug={slug} />;
  }
  return (
    <main>
      <PageHero
        tag={profile.category || (isWork ? "ÇALIŞMA ALANIMIZ" : "KURUMSAL")}
        title={title}
        text={profile.lead}
        image={img}
      />
      <section className="section detail">
        <div className="container detail-grid">
          <aside>
            <b>BU SAYFADA</b>
            {[
              "Yaklaşımımız",
              "Nasıl çalışıyoruz?",
              "Etki ve şeffaflık",
              "Sık sorulanlar",
            ].map((x) => (
              <a href={"#" + x} key={x}>
                {x}
                <ArrowRight />
              </a>
            ))}
          </aside>
          <article>
            <span className="kicker">YEDİRENK YAKLAŞIMI</span>
            <h2 id="Yaklaşımımız">Yaklaşımımız</h2>
            <p className="lead">
              {profile.lead} Her uygulama açık sorumluluklar, kayıtlı süreçler
              ve ölçülebilir sonuçlarla yönetilir.
            </p>
            <h3 id="Nasıl çalışıyoruz?">Nasıl çalışıyoruz?</h3>
            <div className="steps">
              {[
                "İhtiyacı dinler ve doğrularız",
                "Çözümü yerel paydaşlarla tasarlarız",
                "Bağışı güvenle ulaştırırız",
                "Sonucu ölçer ve raporlarız",
              ].map((x, i) => (
                <div key={x}>
                  <span>0{i + 1}</span>
                  <b>{x}</b>
                  <Check />
                </div>
              ))}
            </div>
            <div className="callout" id="Etki ve şeffaflık">
              <ShieldCheck />
              <div>
                <h3>Şeffaflık tüm bağış süreçlerinin gereğidir.</h3>
                <p>
                  Kaynakların hangi amaçla ve nasıl kullanıldığını anlaşılır
                  raporlarla paylaşırız.
                </p>
              </div>
            </div>
            <h3 id="Sık sorulanlar">Sık sorulanlar</h3>
            {(profile.qas || []).map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}

const activityChoices = [
  {
    title: "Eğitim",
    text: "Çocukların ve gençlerin bilgiye, gelişime ve nitelikli öğrenme imkânlarına erişimini destekliyoruz.",
    path: "/calismalarimiz/egitim",
    icon: BookOpen,
  },
  {
    title: "Kültür",
    text: "Kültürel değerleri yaşatan, ortak hafızayı ve toplumsal bağı güçlendiren çalışmalar yürütüyoruz.",
    path: "/calismalarimiz/kultur",
    icon: Sparkles,
  },
  {
    title: "Yardımlaşma",
    text: "İhtiyaç sahipleriyle dayanışmayı büyüten ve insan onurunu gözeten yardım çalışmaları gerçekleştiriyoruz.",
    path: "/calismalarimiz/yardimlasma",
    icon: HandHeart,
  },
];

const corporateChoices = [
  {
    title: "Biz Kimiz?",
    text: "Yedirenk’in kuruluş fikrini, değerlerini ve iyiliğe yaklaşımını yakından tanıyın.",
    path: "/kurumsal/hakkimizda",
    icon: CircleUserRound,
  },
  {
    title: "Başkanın Mesajı",
    text: "Yönetim Kurulumuzun sorumluluk, ortak akıl ve kalıcı etki anlayışını okuyun.",
    path: "/kurumsal/yonetim-kurulu-mesaji",
    icon: UsersRound,
  },
  {
    title: "Kurumsal Kimlik",
    text: "Yedirenk’in görsel dilini, iletişim yaklaşımını ve kurumsal kimlik esaslarını inceleyin.",
    path: "/kurumsal/kurumsal-kimlik",
    icon: BadgeCheck,
  },
  {
    title: "Tüzük",
    text: "Derneğimizin amaçlarını, çalışma esaslarını ve yönetim yapısını belirleyen tüzük metnini okuyun.",
    path: "/kurumsal/tuzuk",
    icon: BookOpen,
  },
  {
    title: "Kişisel Verilerin Korunması",
    text: "Kişisel veri işleme süreçlerine ilişkin bilgilendirmelere, haklarınıza ve başvuru kanallarına ulaşın.",
    path: "/kurumsal/kvkk",
    icon: ShieldCheck,
  },
];

function CorporatePageHeading({ title, lead }) {
  return (
    <section className="container simple-corporate-heading">
      <span>KURUMSAL</span>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
  );
}

function CorporateIdentityPage({ profile }) {
  const files = Array.isArray(profile.files) ? profile.files : [];
  const groups = [
    ["Kurumsal Kimlik Dosyaları", "kurumsal-kimlik"],
    ["Proje Afiş Dosyaları", "proje-afisi"],
  ];
  return (
    <main className="simple-corporate-page corporate-files-page">
      <CorporatePageHeading
        title="Kurumsal Kimlik"
        lead="Yedirenk’in logo, renk, tipografi ve kurumsal kullanım standartlarına buradan ulaşabilirsiniz."
      />
      <section className="container corporate-file-library">
        {groups.map(([title, type]) => {
          const items = files.filter((file) => file.type === type);
          return (
            <article key={type}>
              <header>
                <FileText />
                <h2>{title}</h2>
              </header>
              {items.length ? (
                <div className="corporate-file-grid">
                  {items.map((file) => (
                    <a
                      href={file.path}
                      key={file.path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <b>{file.title}</b>
                        <small>PDF</small>
                      </span>
                      <Download />
                    </a>
                  ))}
                </div>
              ) : (
                <p>PDF dosyaları eklendiğinde bu alanda listelenecektir.</p>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

function StatutePage({ profile }) {
  const blocks = statuteText
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

  const articles = [];
  let currentArticle = null;

  blocks.forEach((block, index) => {
    if (index === 0) return;
    if (/^MADDE\s+\d+\s*:/i.test(block)) {
      currentArticle = { title: block, content: [] };
      articles.push(currentArticle);
      return;
    }
    if (!currentArticle) return;
    currentArticle.content.push(block);
  });

  const isSubheading = (text) =>
    /^[a-zçğıöşüı]\)\s+\S/i.test(text) ||
    (/^[A-ZÇĞİÖŞÜ0-9\s]+$/.test(text) && text.length < 90);

  return (
    <main className="simple-corporate-page statute-page">
      <CorporatePageHeading title="Tüzük" lead={profile.lead} />
      <section className="container statute-text-content">
        <header className="statute-document-heading">
          <span>TÜZÜK METNİ</span>
          <h2>{blocks[0]}</h2>
        </header>
        <div className="statute-article-list">
          {articles.map((article) => {
            const isEmblemArticle = /^MADDE\s+5\s*:/i.test(article.title);
            return (
              <article key={article.title} className="statute-article">
                <h3>{article.title}</h3>
                {isEmblemArticle && (
                  <figure className="statute-emblem">
                    <img
                      src="/assets/yedirenk-dikey-turkuaz-logo-v1.webp"
                      alt="Yedirenk Eğitim, Kültür ve Yardımlaşma Derneği logosu"
                    />
                  </figure>
                )}
                {article.content.map((paragraph, paragraphIndex) =>
                  isSubheading(paragraph) ? (
                    <h4 key={`${article.title}-${paragraphIndex}`}>
                      {paragraph}
                    </h4>
                  ) : (
                    <p key={`${article.title}-${paragraphIndex}`}>
                      {paragraph}
                    </p>
                  ),
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PrivacyPage({ profile }) {
  const blocks = kvkkText
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  const documentTitle = blocks.shift();
  const documentLead = blocks.shift();
  const sections = [];
  let currentSection = null;

  blocks.forEach((block) => {
    if (/^\d+\.\s/.test(block) || block === "Kullanım notu") {
      currentSection = { title: block, content: [] };
      sections.push(currentSection);
      return;
    }
    if (!currentSection) {
      currentSection = { title: "Bilgilendirme", content: [] };
      sections.push(currentSection);
    }
    currentSection.content.push(block);
  });

  const renderPrivacyParagraph = (paragraph, index) => {
    if (paragraph.startsWith("• ")) {
      return <li key={`${paragraph}-${index}`}>{paragraph.slice(2)}</li>;
    }
    return <p key={`${paragraph}-${index}`}>{paragraph}</p>;
  };

  return (
    <main className="simple-corporate-page statute-page privacy-text-page">
      <CorporatePageHeading
        title="Kişisel Verilerin Korunması"
        lead="Yedirenk Derneği’nin kişisel veri işleme süreçlerine ilişkin bilgilendirme metinlerine, haklarınıza ve başvuru kanallarına bu alandan ulaşabilirsiniz."
      />
      <section className="container statute-text-content">
        <header className="statute-document-heading privacy-document-heading">
          <span>KVKK METNİ</span>
          <h2>{documentTitle}</h2>
          <p>{documentLead}</p>
        </header>
        <div className="statute-article-list privacy-article-list">
          {sections.map((section) => {
            const bulletItems = section.content.filter((item) =>
              item.startsWith("• "),
            );
            const paragraphs = section.content.filter(
              (item) => !item.startsWith("• "),
            );
            return (
              <article className="statute-article" key={section.title}>
                <h3>{section.title}</h3>
                {paragraphs.map(renderPrivacyParagraph)}
                {bulletItems.length > 0 && (
                  <ul>{bulletItems.map(renderPrivacyParagraph)}</ul>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function buildLegalDocumentBlocks(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];
  let current = null;
  const flush = () => {
    if (current?.text) blocks.push(current);
    current = null;
  };

  lines.forEach((line) => {
    const isNumberedItem =
      /^\d+\.\s+\S/.test(line) &&
      (line.length > 80 || /[,;]/.test(line));
    const isHeading =
      (!isNumberedItem && /^(?:\d+\.|[A-ZÇĞİÖŞÜ]\.)\s*\S/.test(line)) ||
      (/^[A-ZÇĞİÖŞÜ0-9\s&/():.-]+$/.test(line) && line.length < 95);
    const isBullet = /^[•☐]/.test(line);

    if (isHeading) {
      flush();
      blocks.push({ type: "heading", text: line });
      return;
    }
    if (isNumberedItem) {
      flush();
      current = { type: "numbered", text: line };
      return;
    }
    if (isBullet) {
      flush();
      current = {
        type: "bullet",
        text: line.replace(/^[•☐]\s*/, "").trim(),
      };
      return;
    }
    if (current) {
      current.text = `${current.text} ${line}`;
      return;
    }
    current = { type: "paragraph", text: line };
  });
  flush();
  return blocks;
}

function LegalDocumentPage() {
  const { slug } = useParams();
  const document = legalDocumentPages[slug];
  if (!document) return <Navigate to="/" replace />;
  const blocks = buildLegalDocumentBlocks(document.text);

  return (
    <main className="simple-corporate-page legal-document-page">
      <CorporatePageHeading title={document.title} lead={document.lead} />
      <section className="container legal-document-content">
        <header>
          <FileText />
          <div>
            <span>YASAL VE KURUMSAL BELGE</span>
            <h2>{document.title}</h2>
          </div>
        </header>
        <article>
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              return <h3 key={`${block.text}-${index}`}>{block.text}</h3>;
            }
            if (block.type === "bullet") {
              return (
                <div className="legal-document-bullet" key={`${block.text}-${index}`}>
                  <Check />
                  <p>{block.text}</p>
                </div>
              );
            }
            if (block.type === "numbered") {
              return (
                <p
                  className="legal-document-numbered"
                  key={`${block.text}-${index}`}
                >
                  {block.text}
                </p>
              );
            }
            return <p key={`${block.text}-${index}`}>{block.text}</p>;
          })}
        </article>
      </section>
    </main>
  );
}

function CorporateLandingPage() {
  return (
    <main className="activities-choice-page corporate-choice-page">
      <section className="container activities-choice-heading">
        <span>KURUMSAL</span>
        <h1>Kurumsal bölümü seçin</h1>
        <p>
          Yedirenk’in yapısını, değerlerini ve çalışma esaslarını incelemek
          istediğiniz başlığı seçin.
        </p>
      </section>
      <section className="container activities-choice-grid corporate-choice-grid">
        {corporateChoices.map((item) => {
          const CorporateIcon = item.icon;
          return (
            <Link to={item.path} key={item.path}>
              <CorporateIcon />
              <span>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </span>
              <ArrowRight />
            </Link>
          );
        })}
      </section>
    </main>
  );
}

function ActivitiesLandingPage() {
  return (
    <main className="activities-choice-page">
      <section className="container activities-choice-heading">
        <span>FAALİYETLERİMİZ</span>
        <h1>Faaliyet alanını seçin</h1>
        <p>
          Eğitim, kültür ve yardımlaşma alanlarındaki yaklaşımımızı ve
          çalışmalarımızı inceleyin.
        </p>
      </section>
      <section className="container activities-choice-grid">
        {activityChoices.map((activity) => {
          const ActivityIcon = activity.icon;
          return (
            <Link to={activity.path} key={activity.path}>
              <ActivityIcon />
              <span>
                <b>{activity.title}</b>
                <p>{activity.text}</p>
              </span>
              <ArrowRight />
            </Link>
          );
        })}
      </section>
    </main>
  );
}

function EducationActivityPage() {
  return (
    <main className="education-activity-page">
      <section className="container education-activity-hero">
        <h1>EĞİTİM</h1>
        <p>
          <strong>
            BİLGİYLE DONANAN, DEĞERLERİYLE GÜÇLENEN, SORUMLULUK BİLİNCİYLE
            GELECEĞE YÜRÜYEN BİR NESİL…
          </strong>
        </p>
      </section>

      <section className="container education-manifesto-card">
        <div className="education-manifesto-copy">
          <p>
            YEDİRENK OLARAK EĞİTİMİ, SADECE BİLGİ AKTARIMI OLARAK DEĞİL; İNSANIN
            KENDİNİ TANIMASI, YETENEKLERİNİ GELİŞTİRMESİ, DEĞERLERİNİ ÖZÜMSEMESİ
            VE YAŞADIĞI TOPLUMA FAYDA SAĞLAYAN BİR ŞAHSİYET OLARAK YETİŞMESİ
            SÜRECİ OLARAK GÖRÜYORUZ.
          </p>
          <p>
            EĞİTİM ANLAYIŞIMIZIN MERKEZİNDE{" "}
            <strong>BİLGİ, AHLAK, DEĞER VE SORUMLULUK</strong> BULUNMAKTADIR.
            ÇOCUKLARIMIZIN VE GENÇLERİMİZİN SADECE AKADEMİK BAŞARIYA DEĞİL; AYNI
            ZAMANDA KARAKTER, MERHAMET, VEFA, GAYRET VE HİZMET ŞUURUNA SAHİP
            BİREYLER OLARAK YETİŞMELERİNİ ÖNEMSİYORUZ.
          </p>
          <p>
            ÇÜNKÜ BİZCE{" "}
            <strong>
              GELECEĞİ İNŞA ETMEK, ÖNCE İNSANI İNŞA ETMEKLE BAŞLAR.
            </strong>
          </p>
        </div>
      </section>

      <section className="container education-content-sections">
        <article>
          <div>
            <h2>ÇOCUKLAR VE GENÇLER İÇİN EĞİTİM</h2>
            <p>
              YEDİRENK, ÇOCUKLARIN VE GENÇLERİN SAĞLAM BİR KARAKTER VE DEĞER
              DÜNYASIYLA YETİŞMELERİNE KATKI SUNMAYI ÖNEMLİ BİR SORUMLULUK
              OLARAK GÖRÜR.
            </p>
            <p>
              BU DOĞRULTUDA ÇOCUKLARIN VE GENÇLERİN İLGİ, YETENEK VE
              İHTİYAÇLARINA YÖNELİK EĞİTİM ÇALIŞMALARI, ATÖLYELER, KONFERANSLAR,
              GENÇLİK BULUŞMALARI VE MANEVİ EĞİTİM PROGRAMLARI GERÇEKLEŞTİRMEYİ
              HEDEFLİYORUZ. YEDİRENK'İN GELECEK PERSPEKTİFİNDE ATÖLYELER, EĞİTİM
              KURUMLARI VE MANEVİ EĞİTİM ODAKLI PROJELER ÖNEMLİ BİR YER
              TUTMAKTADIR.
            </p>
          </div>
        </article>
        <article>
          <div>
            <h2>GENÇLİK VE NESLİN İHYASI</h2>
            <p>
              GENÇLERİN SADECE BUGÜNÜN DEĞİL, YARININ DA İNŞA EDİCİLERİ OLDUĞUNA
              İNANIYORUZ.
            </p>
            <p>
              ONLARIN KENDİ YETENEKLERİNİ KEŞFETMELERİNE, BİLGİ VE TECRÜBELERİNİ
              GELİŞTİRMELERİNE, DEĞERLERİYLE BARIŞIK BİR HAYAT KURMALARINA VE
              TOPLUMA FAYDA SAĞLAYAN BİREYLER OLMALARINA YÖNELİK ÇALIŞMALAR
              GELİŞTİRMEYİ AMAÇLIYORUZ.
            </p>
            <p>
              <strong>
                ÇÜNKÜ BİZİM İÇİN NESLİN İHYASI, GELECEĞİN İNŞASIDIR.
              </strong>
            </p>
          </div>
        </article>
        <article>
          <div>
            <h2>EĞİTİMDEN MEDENİYETE</h2>
            <p>
              YEDİRENK'İN EĞİTİM ANLAYIŞI, BUGÜNÜN İHTİYAÇLARINI KARŞILAMAKLA
              SINIRLI DEĞİLDİR.
            </p>
            <p>
              İDEALİMİZ;{" "}
              <strong>
                BİLGİYLE DONANMIŞ, AHLAKLA GÜÇLENMİŞ, DEĞERLERİNE BAĞLI,
                SORUMLULUK SAHİBİ VE İNSANLIĞA FAYDA SUNMAYI GÖREV EDİNMİŞ BİR
                NESLİN
              </strong>{" "}
              YETİŞMESİNE KATKI SAĞLAMAKTIR.
            </p>
            <p>
              BU YOLCULUKTA İMKÂNLARIN BÜYÜKLÜĞÜNDEN ÖNCE{" "}
              <strong>SAMİMİYETE VE GAYRETE</strong> İNANIYORUZ.
            </p>
          </div>
        </article>
      </section>

      <section className="container education-closing-quote">
        <small>ÇÜNKÜ BİLİYORUZ Kİ;</small>
        <p>
          <strong>BİR ÇOCUĞA KAZANDIRILAN DOĞRU BİR DEĞER,</strong>
          <br />
          <strong>BİR GENCE VERİLEN GÜZEL BİR İDEAL,</strong>
          <br />
          <strong>BİR NESLE SUNULAN SAĞLAM BİR EĞİTİM,</strong>
          <br />
          <strong>GELECEĞE BIRAKILAN EN KIYMETLİ MİRASTIR.</strong>
        </p>
      </section>
    </main>
  );
}

function CultureActivityPage() {
  return (
    <main className="education-activity-page">
      <section className="container education-activity-hero">
        <h1>KÜLTÜR</h1>
        <p>
          <strong>
            KÜLTÜR; BİR MİLLETİN HAFIZASI, BİR MEDENİYETİN GELECEĞE BIRAKTIĞI
            MİRASTIR.
          </strong>
        </p>
      </section>

      <section className="container education-manifesto-card">
        <div className="education-manifesto-copy">
          <p>
            YEDİRENK OLARAK KÜLTÜRÜ; BİZİ BİZ YAPAN DEĞERLERİN, TARİHİN,
            GELENEĞİN, SANATIN VE MEDENİYET BİRİKİMİNİN GELECEK NESİLLERE
            AKTARILMASI OLARAK GÖRÜYORUZ.
          </p>
          <p>
            GEÇMİŞİ SADECE HATIRLAMAK DEĞİL, GEÇMİŞTEN ALDIĞIMIZ İLHAMLA
            GELECEĞE YÖN VERMEK İSTİYORUZ.
          </p>
          <p>
            BU ANLAYIŞLA MİLLİ VE MANEVİ DEĞERLERİMİZİ, MEDENİYET BİRİKİMİMİZİ
            VE ORTAK HAFIZAMIZI ÇOCUKLARIMIZLA VE GENÇLERİMİZLE BULUŞTURMAYI
            ÖNEMSİYORUZ.
          </p>
        </div>
      </section>

      <section className="container education-content-sections">
        <article>
          <div>
            <h2>KÜLTÜR VE MEDENİYET ŞUURU</h2>
            <p>
              BİR TOPLUMUN GELECEĞİ, SADECE EKONOMİK VE TEKNOLOJİK GELİŞMELERLE
              DEĞİL; KENDİ DEĞERLERİNİ, TARİHİNİ VE MEDENİYET ŞUURUNU
              YAŞATMASIYLA DA ŞEKİLLENİR.
            </p>
            <p>
              BU SEBEPLE ÇALIŞMALARIMIZDA GENÇ NESİLLERİN KENDİ KÜLTÜREL
              KÖKLERİNİ TANIMALARINA, MEDENİYET BİRİKİMİMİZİ ANLAMALARINA VE BU
              BİRİKİMİ GELECEĞE TAŞIYABİLECEK BİR ŞUUR KAZANMALARINA KATKI
              SUNMAYI HEDEFLİYORUZ.
            </p>
            <p>
              YEDİRENK'İN MEFKÛRESİNDE YER ALAN{" "}
              <strong>“YENİ BİR MEDENİYET”</strong> İDEALİ, KÜLTÜR
              ÇALIŞMALARIMIZIN DA TEMEL UFUKLARINDAN BİRİDİR.
            </p>
          </div>
        </article>

        <article>
          <div>
            <h2>KÜLTÜRÜ YAŞATAN BULUŞMALAR</h2>
            <p>
              KÜLTÜRÜN YAŞAMASININ, İNSANLARIN BİRBİRLERİYLE BULUŞMASI VE ORTAK
              DEĞERLER ETRAFINDA BİR ARAYA GELMESİYLE MÜMKÜN OLDUĞUNA
              İNANIYORUZ.
            </p>
            <p>BU ÇERÇEVEDE;</p>
            <p className="document-emphasis-list">
              <strong>
                KONFERANSLAR,
                <br />
                GENÇLİK ŞÖLENLERİ,
                <br />
                ÇOCUK ŞENLİKLERİ,
                <br />
                ATÖLYELER,
                <br />
                KÜLTÜREL BULUŞMALAR
                <br />
                VE MANEVİ PROGRAMLAR
              </strong>
            </p>
            <p>
              GİBİ ÇALIŞMALARLA TOPLUMUN FARKLI KESİMLERİNE ULAŞMAYI
              HEDEFLİYORUZ. DOSYADA DA KONFERANSLAR, GENÇLİK ŞÖLENLERİ, ÇOCUK
              ŞENLİKLERİ VE ÇEŞİTLİ WORKSHOPLAR GELECEK PERSPEKTİFİNİN PARÇALARI
              OLARAK YER ALIYOR.
            </p>
          </div>
        </article>

        <article>
          <div>
            <h2>GEÇMİŞTEN GELECEĞE</h2>
            <p>
              BİZİM İÇİN KÜLTÜR, SADECE GEÇMİŞE AİT BİR MİRAS DEĞİL; GELECEĞİ
              İNŞA ETMEK İÇİN BİR REHBERDİR.
            </p>
            <p>
              GEÇMİŞİMİZİN BİRİKİMİNDEN İLHAM ALARAK ÇOCUKLARIMIZA VE
              GENÇLERİMİZE DAHA GÜÇLÜ BİR DEĞER DÜNYASI, DAHA SAĞLAM BİR
              MEDENİYET ŞUURU VE DAHA BÜYÜK BİR İDEAL KAZANDIRMAK İSTİYORUZ.
            </p>
          </div>
        </article>
      </section>

      <section className="container education-closing-quote culture-closing-quote">
        <p>
          <strong>ÇÜNKÜ BİLİYORUZ Kİ;</strong>
        </p>
        <p>
          <strong>
            BİR MİLLETİN KÜLTÜRÜ YAŞARSA,
            <br />
            HAFIZASI YAŞAR.
          </strong>
        </p>
        <p>
          <strong>
            HAFIZASI YAŞARSA,
            <br />
            MEDENİYETİ YAŞAR.
          </strong>
        </p>
        <p>
          <strong>
            MEDENİYETİ YAŞARSA,
            <br />
            GELECEĞE SÖYLEYECEK SÖZÜ OLUR.
          </strong>
        </p>
        <p className="document-closing-copy">
          YEDİRENK OLARAK KÜLTÜRÜ BİR MİRAS, GENÇLİĞİ BU MİRASIN EMANETÇİSİ,
          MEDENİYETİ İSE GELECEĞE TAŞINMASI GEREKEN BÜYÜK BİR İDEAL OLARAK
          GÖRÜYORUZ.
        </p>
      </section>
    </main>
  );
}

function ChairmanMessagePage() {
  return (
    <main className="education-activity-page chairman-message-page">
      <section className="container education-activity-hero">
        <h1>Başkandan Mesaj</h1>
        <p>
          <strong>Değerli dostlar, kıymetli gönüldaşlar,</strong>
        </p>
      </section>

      <section className="container education-manifesto-card">
        <div className="education-manifesto-copy">
          <p>
            Hayat, insana verilmiş en büyük emanettir. Bu emaneti anlamlı kılan
            ise sadece kendimiz için yaşamak değil; insana, topluma ve geleceğe
            fayda sağlayacak izler bırakabilmektir.
          </p>
          <p>
            Yedirenk olarak biz, böyle bir sorumluluğun içinde olduğumuza
            inanıyoruz.
          </p>
          <p>
            Bizim için yola çıkmak, sadece bir dernek kurmak veya bir faaliyet
            gerçekleştirmek değildir. Asıl mesele;{" "}
            <strong>
              insana dokunmak, bir gönüle umut olmak, bir çocuğun geleceğine
              ışık tutmak, bir gencin hayatına güzel bir ideal kazandırmak ve
              iyiliği çoğaltmaktır.
            </strong>
          </p>
          <p>
            Yedirenk'in temelinde <strong>samimiyet ve gayret</strong> vardır.
            İmkânlarımızın büyüklüğüne değil, niyetimizin samimiyetine ve
            gayretimizin sürekliliğine inanıyoruz. Çünkü biliyoruz ki büyük
            değişimler, bazen küçük ama samimi bir adımla başlar.
          </p>
        </div>
      </section>

      <section className="container education-content-sections">
        <article>
          <div>
            <h2>Bizim İçin İnsan, Merkezdedir</h2>
            <p>
              Eğitimde çocuğu ve genci, kültürde geçmişi ve geleceği,
              yardımlaşmada ihtiyaç sahibini merkeze alıyoruz.
            </p>
            <p>
              Çünkü bizce hizmetin ölçüsü, yapılan işin büyüklüğünden çok{" "}
              <strong>dokunduğu hayatın değişimidir.</strong>
            </p>
            <p>
              Bir çocuğun gülümsemesi, bir gencin umutlanması, bir ailenin
              yükünün hafiflemesi ve bir insanın kendisini yalnız hissetmemesi
              bizim için çok kıymetlidir.
            </p>
            <p>
              Bu nedenle eğitimden kültüre, gençlikten insani yardıma kadar
              insana dokunan her alanı bir hizmet ve sorumluluk sahası olarak
              görüyoruz.
            </p>
          </div>
        </article>

        <article>
          <div>
            <h2>Geleceğe Dair Bir İdealimiz Var</h2>
            <p>Biz sadece bugünün sorunlarına çözüm üretmek istemiyoruz.</p>
            <p>Bugünü inşa ederken yarını da düşünüyoruz.</p>
            <p>
              Çünkü bir çocuğa verdiğimiz eğitimin, bir gence kazandırdığımız
              değerin ve bir nesle aktardığımız kültürün yıllar sonra toplumun
              geleceğini şekillendireceğine inanıyoruz.
            </p>
            <p>
              Bu sebeple gençliğe ayrı bir önem veriyoruz. Konferanslar, gençlik
              buluşmaları, atölyeler ve manevi eğitim çalışmalarıyla
              gençlerimizin hayatına dokunmayı ve onlara büyük bir idealin
              parçası olma şuuru kazandırmayı hedefliyoruz.
            </p>
            <p>
              Çünkü <strong>neslin ihyasını, geleceğin inşası</strong> olarak
              görüyoruz.
            </p>
          </div>
        </article>

        <article>
          <div>
            <h2>Yedirenk'in Ufuktaki Hedefi</h2>
            <p>Bizim ufukta bir idealimiz var:</p>
            <p>
              <strong>Yeni bir medeniyet.</strong>
            </p>
            <p>
              Köklerinden beslenen, değerlerini koruyan; bilgiyi, ahlakı,
              merhameti, adaleti ve hizmeti önceleyen bir medeniyet anlayışına
              katkı sunmak istiyoruz.
            </p>
            <p>
              Bu büyük hedefin bizim tek başımıza gerçekleştirebileceğimiz bir
              hedef olmadığının farkındayız.
            </p>
            <p>
              Bizim ihtiyacımız;{" "}
              <strong>
                birlikte düşünmek, birlikte üretmek, birlikte gayret etmek ve
                birlikte iyiliği çoğaltmaktır.
              </strong>
            </p>
            <p>
              Yedirenk'i sadece bir dernek değil; aynı ideal etrafında buluşan,
              insana ve geleceğe dair sözü olan bir gönül hareketi olarak
              büyütmek istiyoruz.
            </p>
          </div>
        </article>

        <article>
          <div>
            <h2>Birlikte Daha Güçlüyüz</h2>
            <p>Önümüzde uzun bir yol olduğunu biliyoruz.</p>
            <p>
              Bu yolda bazen zorluklarla karşılaşacağız. Ama biz, zorluklardan
              korkan değil; zorluklar karşısında gayretini artıran bir anlayışı
              benimsiyoruz.
            </p>
            <p>
              Çünkü bizim için hizmet, kolay zamanda yapılan bir iş değil;{" "}
              <strong>
                zor zamanlarda da yolda kalabilmek, emanete sahip çıkabilmek ve
                ümidi kaybetmemektir.
              </strong>
            </p>
            <p>
              Yedirenk'in her çalışmasında, her gönülde ve her adımında
              samimiyetin, gayretin ve vefa duygusunun hâkim olmasını istiyoruz.
            </p>
            <p>
              Bu vesileyle Yedirenk'in yolculuğuna destek olan, dualarıyla,
              fikirleriyle, emeğiyle ve zamanlarıyla yanımızda bulunan herkese
              teşekkür ediyorum.
            </p>
            <p>
              <strong>
                Birlikte yürüyeceğimiz, birlikte büyüteceğimiz ve geleceğe
                birlikte bırakacağımız çok güzel bir hikâyemiz olacağına
                inanıyorum.
              </strong>
            </p>
            <p>
              Rabbim niyetlerimizi hayra, gayretlerimizi hizmete, hizmetlerimizi
              ise insanlığın hayrına vesile eylesin.
            </p>
            <p>
              <strong>Sevgi ve muhabbetlerimle…</strong>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

function SimpleCorporatePage({ profile, title, slug }) {
  if (slug === "egitim") return <EducationActivityPage />;
  if (slug === "kultur") return <CultureActivityPage />;
  if (slug === "yonetim-kurulu-mesaji") return <ChairmanMessagePage />;
  const isActivity = ["egitim", "kultur", "yardimlasma"].includes(slug);
  const PageIcon =
    slug === "ozenle-ve-guvenle"
      ? BadgeCheck
      : slug === "egitim"
        ? BookOpen
        : slug === "kultur"
          ? Sparkles
          : slug === "yardimlasma"
            ? HandHeart
            : Landmark;
  const introductions = {
    hakkimizda: (
      <>
        Yedirenk Derneği; 20 yıllık bilgi, birikim ve saha tecrübesini eğitim,
        kültür ve yardımlaşma çalışmalarına taşıyan bir sivil toplum
        kuruluşudur. 7 kıtada tüm insanlığa hizmet etmeyi hedefleyen Yedirenk;
        samimiyet, sorumluluk ve güven anlayışıyla hareket eder, çalışmalarını
        doğrudan ihtiyaçlara yönelik ve kalıcı fayda oluşturacak şekilde
        yürütür.
        <br />
        <br />
        Yedirenk’in bu anlayışına, logosunda yer alan Ebabil kuşunun taşıdığı
        anlam da ilham verir. Küçük bir kuş olmasına rağmen Kur’an’da büyük bir
        vazifenin sembolü olarak anılan Ebabil, gücünü büyüklüğünden değil,
        üstlendiği vazifeye olan teslimiyetinden alır. Yedirenk de iyiliğin
        büyüklüğünden çok samimiyetine inanır; eğitimde bilgiyi, kültürde ortak
        değerleri ve yardımlaşmada merhameti kanatlandırarak ihtiyaç duyulan her
        yere ulaşmayı amaçlar.
      </>
    ),
    "ozenle-ve-guvenle":
      "Özenle ve Güvenle, yaptığımız her işte insanı ve sorumluluğu merkeze aldığımızı anlatır. İhtiyacı dikkatle dinler, doğru çözümü titizlikle planlar ve desteği güvenilir süreçlerle yerine ulaştırırız.",
    "yonetim-kurulu-mesaji":
      "İyiliği kalıcı etkiye dönüştürme hedefiyle çalışmalarımızı şeffaflık, ortak akıl ve hesap verebilirlik ilkeleri doğrultusunda sürdürüyoruz.",
    "kurumsal-kimlik":
      "Kurumsal kimliğimiz; Yedirenk’in değerlerini bütün iletişim kanallarında tutarlı, güvenilir ve anlaşılır biçimde temsil eder.",
    tuzuk:
      "Dernek tüzüğümüz; amaçlarımızı, faaliyet alanlarımızı, üyelik yapımızı ve yönetim organlarımızın görevlerini tanımlar.",
    kvkk: "Kişisel verilerin gizliliğini ve güvenliğini gözetiyor; verileri yalnızca belirtilen amaçlar ve yasal yükümlülükler doğrultusunda işliyoruz.",
    "cerez-politikasi":
      "Çerezleri yalnızca sitenin güvenli ve verimli çalışması, tercihlerin hatırlanması ve izin verilen ölçüm süreçleri için kullanıyoruz.",
    "ilham-kaynagimiz":
      "Farklı imkânlara sahip insanların aynı iyilik düşüncesinde buluşmasından ilham alıyoruz. Ebabil sembolü bizim için gayreti, sorumluluğu ve iyiliği doğru yere ulaştırma bilincini temsil eder.",
    "misyon-vizyon":
      "Misyonumuz insan onurunu koruyan yardımı, bilgiyi çoğaltan eğitimi ve toplumsal dayanışmayı sürdürülebilir çalışmalara dönüştürmektir. Vizyonumuz güvenilir ve kalıcı etki üreten bir iyilik modeli oluşturmaktır.",
    kurumsal:
      "Kurumsal yapımızda yetki, sorumluluk ve denetim açık biçimde tanımlanır. Kararlar kayıtlı süreçlerle alınır; kaynak kullanımı ve proje sonuçları hesap verebilirlik ilkesiyle takip edilir.",
    egitim:
      "Eğitimi kalıcı gelişimin temel taşı olarak görüyoruz. Çalışmalarımızı çocukların ve gençlerin merakını, özgüvenini ve üretme becerisini destekleyecek biçimde planlıyoruz.",
    kultur:
      "Kültürün insanları birbirine yaklaştıran ve ortak hafızayı canlı tutan gücüne inanıyoruz. Yerel değerleri korurken yeni üretimlere ve kuşaklar arası paylaşıma alan açıyoruz.",
    yardimlasma:
      "Yardımlaşmayı ihtiyaç sahibiyle destek veren arasında kurulan güvenli ve onurlu bir dayanışma bağı olarak görüyoruz. Her desteği doğrulanmış ihtiyaç ve şeffaf süreçlerle ulaştırıyoruz.",
  };
  const sectionLabels = {
    hakkimizda: "YEDİRENK’İ TANIYIN",
    "ozenle-ve-guvenle": "SLOGANIMIZIN ANLAMI",
    "yonetim-kurulu-mesaji": "BAŞKANIN MESAJI",
    "kurumsal-kimlik": "MARKA VE İLETİŞİM",
    tuzuk: "KURUMSAL METİN",
    kvkk: "KİŞİSEL VERİLERİN KORUNMASI",
    "cerez-politikasi": "WEB SİTESİ VE ÇEREZLER",
    "ilham-kaynagimiz": "BİZE YÖN VEREN DEĞERLER",
    "misyon-vizyon": "AMAÇ VE GELECEK YAKLAŞIMI",
    kurumsal: "YAPI VE SORUMLULUK",
    egitim: "BİLGİYLE GÜÇLENEN GELECEK",
    kultur: "ORTAK HAFIZA VE DEĞERLER",
    yardimlasma: "DAYANIŞMAYI BÜYÜTÜYORUZ",
  };
  const contentHeadings = {
    hakkimizda: "Yedirenk’i Yakından Tanıyın",
    "ozenle-ve-guvenle": "Çalışma Sözümüz",
    "yonetim-kurulu-mesaji": "Başkanın Mesajı",
    "cerez-politikasi": "Çerezleri Nasıl Kullanıyoruz?",
    "ilham-kaynagimiz": "Bize Yön Veren İlham",
    "misyon-vizyon": "Bugünden Geleceğe",
    kurumsal: "Yapımız ve Sorumluluklarımız",
    egitim: "Bilgiyle Güçlenen Gelecek",
    kultur: "Ortak Hafızayı Yaşatmak",
    yardimlasma: "Dayanışmayı Büyütmek",
  };
  return (
    <main className="simple-corporate-page">
      <section className="container simple-corporate-heading">
        <span>{isActivity ? "FAALİYETLER" : "KURUMSAL"}</span>
        <h1>{title}</h1>
        <p
          className={[
            slug === "yonetim-kurulu-mesaji" ? "corporate-message-lead" : "",
            slug === "hakkimizda" ? "content-locked" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {profile.lead}
        </p>
      </section>
      <section className="container simple-corporate-content">
        <article
          className={`corporate-intro-card${
            slug === "yonetim-kurulu-mesaji" ? " corporate-message-card" : ""
          }`}
        >
          <div>
            <PageIcon />
            <span>
              {!["hakkimizda", "tuzuk"].includes(slug) && (
                <small>{sectionLabels[slug]}</small>
              )}
              <h2>{contentHeadings[slug] || "Yedirenk Yaklaşımı"}</h2>
            </span>
          </div>
          {profile.body?.length ? (
            <div className="corporate-message-copy">
              {profile.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p>{introductions[slug]}</p>
          )}
        </article>
        {!!profile.qas?.length && (
          <div className="corporate-question-grid">
            {profile.qas.map(([question, answer], index) => (
              <article key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        )}
        {slug !== "yonetim-kurulu-mesaji" && (
          <div className="corporate-contact-strip">
            <span>
              <b>Daha fazla bilgiye mi ihtiyacınız var?</b>
              {isActivity
                ? `${title} çalışmalarımız hakkında bizimle iletişime geçebilirsiniz.`
                : "Kurumsal yapımız ve çalışmalarımız hakkında bizimle iletişime geçebilirsiniz."}
            </span>
            <Link className="btn navy" to="/iletisim">
              İletişime geç <ArrowRight />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

const bankAccounts = [
  {
    bank: "Ziraat Bankası",
    branch: "743 - Gölbaşı / Ankara Şubesi",
    owner: "Yedirenk Eğitim Kültür ve Yardımlaşma Derneği",
    accountNumber: "98439614-5001",
    currency: "Türk Lirası",
    code: "TRY",
    iban: "TR26 0001 0007 4398 4396 1450 01",
  },
  {
    bank: "Ziraat Bankası",
    branch: "743 - Gölbaşı / Ankara Şubesi",
    owner: "Yedirenk Eğitim Kültür ve Yardımlaşma Derneği",
    accountNumber: "98439614-5002",
    currency: "Amerikan Doları",
    code: "USD",
    iban: "TR96 0001 0007 4398 4396 1450 02",
  },
  {
    bank: "Ziraat Bankası",
    branch: "743 - Gölbaşı / Ankara Şubesi",
    owner: "Yedirenk Eğitim Kültür ve Yardımlaşma Derneği",
    accountNumber: "98439614-5003",
    currency: "Euro",
    code: "EUR",
    iban: "TR69 0001 0007 4398 4396 1450 03",
  },
];

function BankAccountsPage() {
  const [copied, setCopied] = useState("");
  const copyIban = async (iban) => {
    try {
      await navigator.clipboard?.writeText(iban.replace(/\s/g, ""));
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = iban.replace(/\s/g, "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopied(iban);
    setTimeout(() => setCopied(""), 1800);
  };
  return (
    <main className="bank-accounts-page">
      <section className="container bank-accounts-heading">
        <span>BAĞIŞ BİLGİLERİ</span>
        <h1>Hesap Numaraları</h1>
        <p>
          Bağışınızı gerçekleştirirken işlem para birimine uygun hesabı
          seçebilirsiniz.
        </p>
      </section>
      <section className="container bank-accounts-content">
        <div className="verified-account-note">
          <BadgeCheck />
          <span>
            <b>Ziraat Bankası hesaplarımız</b>
            Havale veya EFT işleminizde bağış para birimine uygun IBAN'ı
            kullanınız.
          </span>
        </div>
        <div className="bank-account-grid">
          {bankAccounts.map((account) => (
            <article className="bank-account-card" key={account.code}>
              <div className="bank-account-card-head">
                <Landmark />
                <span>
                  <small>{account.code} HESABI</small>
                  <h2>{account.bank}</h2>
                </span>
              </div>
              <dl>
                <div>
                  <dt>Hesap sahibi</dt>
                  <dd>{account.owner}</dd>
                </div>
                <div>
                  <dt>Şube</dt>
                  <dd>{account.branch}</dd>
                </div>
                <div>
                  <dt>Hesap numarası</dt>
                  <dd>{account.accountNumber}</dd>
                </div>
                <div>
                  <dt>Para birimi</dt>
                  <dd>{account.currency}</dd>
                </div>
              </dl>
              <div className="bank-account-iban">
                <span>
                  <small>IBAN</small>
                  <b>{account.iban}</b>
                </span>
                <button type="button" onClick={() => copyIban(account.iban)}>
                  {copied === account.iban ? <Check /> : <Copy />}
                  {copied === account.iban ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Zakat({ add }) {
  const { content } = useCms();
  const page = getSitePage(content, "zakat");
  const [activeCategory, setActiveCategory] = useState("try");
  const [yearType, setYearType] = useState("lunar");
  const [agriRate, setAgriRate] = useState(10);
  const [values, setValues] = useState({
    try: "",
    usd: "",
    eur: "",
    gbp: "",
    gold24: "",
    gold22: "",
    gold18: "",
    silver: "",
    ticari: "",
    yatirim: "",
    alacak: "",
    borc: "",
    zirai: "",
  });
  const [units, setUnits] = useState({
    ticari: "TRY",
    yatirim: "TRY",
    alacak: "TRY",
    borc: "TRY",
  });
  const [rates, setRates] = useState({
    USD: 47.695,
    EUR: 55.11,
    GBP: 64.41,
    gold24: 6729,
    silver: 82.5,
  });
  const [rateState, setRateState] = useState({
    loading: true,
    live: false,
    updated: "",
  });
  const numeric = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };
  const loadRates = async () => {
    setRateState((s) => ({ ...s, loading: true }));
    try {
      const [fxResponse, goldResponse, silverResponse] = await Promise.all([
        fetch(
          "https://api.frankfurter.dev/v1/latest?base=USD&symbols=TRY,EUR,GBP",
        ),
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://api.gold-api.com/price/XAG"),
      ]);
      if (!fxResponse.ok || !goldResponse.ok || !silverResponse.ok)
        throw new Error("rate-fetch");
      const [fx, gold, silver] = await Promise.all([
        fxResponse.json(),
        goldResponse.json(),
        silverResponse.json(),
      ]);
      const usdTry = Number(fx.rates.TRY);
      const next = {
        USD: usdTry,
        EUR: usdTry / Number(fx.rates.EUR),
        GBP: usdTry / Number(fx.rates.GBP),
        gold24: (Number(gold.price) * usdTry) / 31.1034768,
        silver: (Number(silver.price) * usdTry) / 31.1034768,
      };
      if (Object.values(next).some((x) => !Number.isFinite(x) || x <= 0))
        throw new Error("invalid-rate");
      setRates(next);
      setRateState({
        loading: false,
        live: true,
        updated: gold.updatedAt || new Date().toISOString(),
      });
    } catch {
      setRateState({ loading: false, live: false, updated: "" });
    }
  };
  useEffect(() => {
    loadRates();
  }, []);
  const asTry = (value, unit = "TRY") =>
    numeric(value) * (unit === "TRY" ? 1 : rates[unit]);
  const goldTotal =
    numeric(values.gold24) * rates.gold24 +
    numeric(values.gold22) * rates.gold24 * (22 / 24) +
    numeric(values.gold18) * rates.gold24 * (18 / 24);
  const currencyTotal =
    numeric(values.try) +
    asTry(values.usd, "USD") +
    asTry(values.eur, "EUR") +
    asTry(values.gbp, "GBP");
  const otherTotal =
    asTry(values.ticari, units.ticari) +
    asTry(values.yatirim, units.yatirim) +
    asTry(values.alacak, units.alacak);
  const total = Math.max(
    0,
    goldTotal +
      numeric(values.silver) * rates.silver +
      currencyTotal +
      otherTotal -
      asTry(values.borc, units.borc),
  );
  const nisab = rates.gold24 * 80.18;
  const isAboveNisab = total >= nisab;
  const standardRate = yearType === "lunar" ? 0.025 : 0.02577;
  const standardZakat = isAboveNisab ? total * standardRate : 0;
  const agricultureTotal = numeric(values.zirai);
  const agricultureZakat = agricultureTotal * (agriRate / 100);
  const zakat = Math.round((standardZakat + agricultureZakat) * 100) / 100;
  const setValue = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));
  const amountInput = (key, suffix) => (
    <span className="zakat-input">
      <input
        aria-label={suffix}
        type="number"
        inputMode="decimal"
        min="0"
        value={values[key]}
        step="0.01"
        placeholder="0"
        onChange={(e) => setValue(key, e.target.value)}
      />
      <em>{suffix}</em>
    </span>
  );
  const moneyInput = (key) => (
    <span className="zakat-input zakat-money-input">
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={values[key]}
        step="0.01"
        placeholder="0"
        onChange={(e) => setValue(key, e.target.value)}
      />
      <select
        aria-label="Para birimi"
        value={units[key]}
        onChange={(e) =>
          setUnits((current) => ({ ...current, [key]: e.target.value }))
        }
      >
        {["TRY", "USD", "EUR", "GBP"].map((unit) => (
          <option key={unit}>{unit}</option>
        ))}
      </select>
    </span>
  );
  const addZakat = () => {
    if (zakat <= 0) return;
    add({
      slug: `zekat-hesaplama-${zakat}`,
      tag: "Zekât",
      title: "Hesaplanan Zekât",
      desc: `${money(total)} net zekâta tabi varlık üzerinden %${yearType === "lunar" ? "2,5" : "2,577"} oranı ve varsa zirai ürün öşrüyle hesaplandı.`,
      price: zakat,
      currency: "TRY",
      raised: 0,
      image: "/assets/project-zakat-user-provided-v4.webp",
      active: true,
    });
  };
  const categories = [
    {
      id: "try",
      label: "Türk Lirası",
      description: "Nakit ve banka hesaplarınızdaki Türk lirası varlıklarınız.",
      icon: Banknote,
    },
    {
      id: "doviz",
      label: "Döviz",
      description: "Dolar, euro ve sterlin cinsinden birikimleriniz.",
      icon: Globe2,
    },
    {
      id: "altin",
      label: "Altın",
      description: "Farklı ayarlardaki altın ve ziynet eşyalarınız.",
      icon: Sparkles,
    },
    {
      id: "gumus",
      label: "Gümüş",
      description: "Gram cinsinden sahip olduğunuz gümüş miktarı.",
      icon: CircleDollarSign,
    },
    {
      id: "ticari",
      label: "Ticari Mallar",
      description: "Satış amacıyla elde tutulan ticari malların güncel değeri.",
      icon: ShoppingBag,
    },
    {
      id: "diger",
      label: "Diğer",
      description: "Hisse senedi, fon ve zekâta tabi diğer yatırımlarınız.",
      icon: Landmark,
    },
    {
      id: "alacak",
      label: "Alacaklar",
      description:
        "Tahsil edilmesi beklenen ve geri ödeneceği kesin alacaklarınız.",
      icon: HandHeart,
    },
    {
      id: "borc",
      label: "Borçlar",
      description: "Zekâta tabi toplamdan düşülecek kısa vadeli borçlarınız.",
      icon: CreditCard,
    },
    {
      id: "zirai",
      label: "Zirai Ürünler",
      description: "Hasadınızın öşür hesabına esas güncel toplam değeri.",
      icon: Wheat,
    },
  ];
  const active = categories.find((category) => category.id === activeCategory);
  const ActiveIcon = active?.icon || Banknote;
  const enteredItems = [
    { label: "Türk Lirası", value: numeric(values.try) },
    { label: "Amerikan Doları", value: asTry(values.usd, "USD") },
    { label: "Euro", value: asTry(values.eur, "EUR") },
    { label: "İngiliz Sterlini", value: asTry(values.gbp, "GBP") },
    {
      label: "Altın",
      value: goldTotal,
    },
    {
      label: "Gümüş",
      value: numeric(values.silver) * rates.silver,
    },
    { label: "Ticari Mallar", value: asTry(values.ticari, units.ticari) },
    { label: "Diğer Varlıklar", value: asTry(values.yatirim, units.yatirim) },
    { label: "Alacaklar", value: asTry(values.alacak, units.alacak) },
    {
      label: "Borçlar",
      value: asTry(values.borc, units.borc),
      debt: true,
    },
    {
      label: `Zirai Ürünler (%${agriRate})`,
      value: agricultureTotal,
      agriculture: true,
    },
  ].filter((item) => item.value > 0);
  const clearCalculation = () => {
    setValues({
      try: "",
      usd: "",
      eur: "",
      gbp: "",
      gold24: "",
      gold22: "",
      gold18: "",
      silver: "",
      ticari: "",
      yatirim: "",
      alacak: "",
      borc: "",
      zirai: "",
    });
    setActiveCategory("try");
  };
  const categoryFields = {
    try: [["try", "Türk Lirası", "₺"]],
    doviz: [
      ["usd", "Amerikan Doları", "$"],
      ["eur", "Euro", "€"],
      ["gbp", "İngiliz Sterlini", "£"],
    ],
    altin: [
      ["gold24", "24 Ayar Altın", "gram"],
      ["gold22", "22 Ayar Altın / Bilezik", "gram"],
      ["gold18", "18 Ayar Altın", "gram"],
    ],
    gumus: [["silver", "Gümüş", "gram"]],
  };
  const renderActiveFields = () => {
    if (categoryFields[activeCategory]) {
      return categoryFields[activeCategory].map(([key, label, suffix]) => (
        <label className="zakat-category-field" key={key}>
          <span>{label}</span>
          {amountInput(key, suffix)}
        </label>
      ));
    }
    if (["ticari", "diger", "alacak", "borc"].includes(activeCategory)) {
      const fieldKey = activeCategory === "diger" ? "yatirim" : activeCategory;
      return (
        <label
          className={`zakat-category-field${activeCategory === "borc" ? " is-debt" : ""}`}
        >
          <span>
            {activeCategory === "ticari"
              ? "Ticari Malların Güncel Değeri"
              : activeCategory === "diger"
                ? "Diğer Varlıkların Güncel Değeri"
                : activeCategory === "alacak"
                  ? "Tahsil Edilebilir Alacaklar"
                  : "Kısa Vadeli Borçlar"}
          </span>
          {moneyInput(fieldKey)}
        </label>
      );
    }
    return (
      <>
        <label className="zakat-category-field">
          <span>Zirai Ürünlerin Güncel Değeri</span>
          {amountInput("zirai", "₺")}
        </label>
        <div className="zakat-agri-choice">
          <span>Sulama yöntemi</span>
          <button
            type="button"
            className={agriRate === 10 ? "active" : ""}
            onClick={() => setAgriRate(10)}
          >
            Masrafsız sulama <b>%10</b>
          </button>
          <button
            type="button"
            className={agriRate === 5 ? "active" : ""}
            onClick={() => setAgriRate(5)}
          >
            Masraflı sulama <b>%5</b>
          </button>
        </div>
      </>
    );
  };
  return (
    <main className="zakat-page">
      <section
        className="zakat-hero"
        style={{ "--zakat-hero-image": `url(${page.image})` }}
      >
        <div className="container zakat-hero-inner">
          <div className="zakat-hero-copy">
            <span className="zakat-kicker">
              <Sparkles /> YEDİRENK DERNEĞİ
            </span>
            <h1>
              Zekât
              <br />
              <em>Hesaplama</em>
            </h1>
            <p>
              <strong>Varlığını hesapla, iyiliğini paylaş.</strong> Altın, döviz
              ve tüm birikimlerinizi güncel piyasa değerleriyle tek ekranda
              hesaplayın.
            </p>
            <div className="zakat-hero-trust">
              <span>
                <Check /> Güncel kurlar
              </span>
              <span>
                <Check /> Güvenli hesaplama
              </span>
              <span>
                <Check /> Ücretsiz
              </span>
            </div>
          </div>
          <div className="zakat-hero-badge">
            <span>%</span>
            <b>2,5</b>
            <small>Zekât oranı</small>
          </div>
        </div>
      </section>
      <section className="section zakat-section">
        <div className="container zakat-calculator-head">
          <div>
            <span>ZEKÂTINIZI HESAPLAYIN</span>
            <h2>Hesaplama Yapın</h2>
            <p>
              Zekâtınız tüm mal varlıklarınızın bütününden hesaplanır. Soldan
              kategorileri seçerek tutarlarınızı ekleyin.
            </p>
          </div>
          <div className="zakat-year-switch" aria-label="Zekât yılı seçimi">
            <button
              type="button"
              className={yearType === "solar" ? "active" : ""}
              onClick={() => setYearType("solar")}
            >
              Güneş Yılı <small>%2,577</small>
            </button>
            <button
              type="button"
              className={yearType === "lunar" ? "active" : ""}
              onClick={() => setYearType("lunar")}
            >
              Ay Yılı <small>%2,5</small>
            </button>
          </div>
        </div>
        <div className="container zakat-tdv-shell">
          <aside className="zakat-category-nav">
            <div className="zakat-category-nav-title">
              <small>
                {yearType === "lunar" ? "AY YILI İLE" : "GÜNEŞ YILI İLE"}
              </small>
              <strong>Zekât Hesapla</strong>
            </div>
            <nav aria-label="Zekât kategorileri">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    type="button"
                    key={category.id}
                    className={activeCategory === category.id ? "active" : ""}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <CategoryIcon />
                    <span>{category.label}</span>
                    <ChevronRight />
                  </button>
                );
              })}
            </nav>
          </aside>
          <section className="zakat-category-panel">
            <div className="zakat-category-panel-head">
              <span>
                <ActiveIcon />
              </span>
              <div>
                <small>SEÇİLİ KATEGORİ</small>
                <h3>{active?.label}</h3>
                <p>{active?.description}</p>
              </div>
            </div>
            <div className="zakat-active-fields">{renderActiveFields()}</div>
            <div className="zakat-panel-note">
              <BadgeCheck />
              <span>
                Girdiğiniz bilgiler yalnızca hesaplama amacıyla tarayıcınızda
                işlenir ve kaydedilmez.
              </span>
            </div>
            <div className="zakat-rates-head">
              <div>
                <b>Güncel piyasa değerleri</b>
                <small>
                  {rateState.live
                    ? `Canlı veri · ${new Date(rateState.updated).toLocaleString("tr-TR")}`
                    : "Geçici olarak yedek fiyatlar kullanılıyor"}
                </small>
              </div>
              <button
                type="button"
                onClick={loadRates}
                disabled={rateState.loading}
                aria-label="Fiyatları yenile"
              >
                <RefreshCw className={rateState.loading ? "spin" : ""} />
              </button>
            </div>
            <div className="zakat-rates">
              {[
                ["USD", "Dolar"],
                ["EUR", "Euro"],
                ["GBP", "Sterlin"],
                ["gold24", "Gram altın"],
                ["silver", "Gram gümüş"],
              ].map(([key, label]) => (
                <div key={key}>
                  <span>{label}</span>
                  <b>
                    {rates[key].toLocaleString("tr-TR", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </b>
                </div>
              ))}
            </div>
          </section>
          <aside className="zakat-products-panel">
            <div className="zakat-products-heading">
              <span>
                <ShoppingBag />
              </span>
              <div>
                <small>HESAP ÖZETİ</small>
                <h3>Ürünlerim</h3>
              </div>
              {enteredItems.length > 0 && (
                <button type="button" onClick={clearCalculation}>
                  Temizle
                </button>
              )}
            </div>
            {enteredItems.length === 0 ? (
              <div className="zakat-empty-cart">
                <Calculator />
                <strong>Sepetiniz boş</strong>
                <p>
                  Soldan bir kategori seçip varlıklarınızı girdiğinizde hesap
                  özetiniz burada görünecek.
                </p>
              </div>
            ) : (
              <div className="zakat-product-list">
                {enteredItems.map((item) => (
                  <div key={item.label} className={item.debt ? "is-debt" : ""}>
                    <span>{item.label}</span>
                    <b>
                      {item.debt ? "− " : ""}
                      {money(item.value)}
                    </b>
                  </div>
                ))}
              </div>
            )}
            <div className="zakat-products-totals">
              <div>
                <span>Toplam varlık</span>
                <b>
                  {money(
                    goldTotal +
                      numeric(values.silver) * rates.silver +
                      currencyTotal +
                      otherTotal,
                  )}
                </b>
              </div>
              <div>
                <span>Düşülen borç</span>
                <b>− {money(asTry(values.borc, units.borc))}</b>
              </div>
              <div>
                <span>Net zekâta tabi varlık</span>
                <b>{money(total)}</b>
              </div>
            </div>
            <div
              className={`zakat-products-nisab ${isAboveNisab ? "met" : "below"}`}
            >
              <span>{isAboveNisab ? <Check /> : <Minus />}</span>
              <div>
                <b>
                  {isAboveNisab
                    ? "Nisap eşiği aşıldı"
                    : "Nisap eşiğinin altında"}
                </b>
                <small>80,18 gram altın: {money(nisab)}</small>
              </div>
            </div>
            <div className="zakat-products-result">
              <span>HESAPLANAN ZEKÂT</span>
              <b>
                {zakat.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺
              </b>
              {agricultureZakat > 0 && (
                <small>Öşür dahil: {money(agricultureZakat)}</small>
              )}
            </div>
            <button
              disabled={zakat <= 0}
              className="btn orange zakat-products-donate"
              onClick={addZakat}
            >
              Zekâtımı Bağışla <ArrowRight />
            </button>
            <small className="zakat-disclaimer">{page.note}</small>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FormPage({ kind = "İletişim" }) {
  const { content } = useCms();
  const settings = content.settings;
  const pageKey = kind.includes("Gönüllü")
    ? "volunteer"
    : kind.includes("İş Birliği")
      ? "sponsor"
      : "contact";
  const page = getSitePage(content, pageKey);
  const isVolunteer = pageKey === "volunteer";
  const isContact = pageKey === "contact";
  const [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState("");
  const submitApplication = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      type: pageKey,
      name: String(data.name || "").trim(),
      email: String(data.email || "").trim(),
      phone: String(data.phone || "").trim(),
      subject: String(data.subject || kind).trim(),
      message: String(data.message || "").trim(),
      consent: data.consent === "on",
    };
    try {
      if (import.meta.env.DEV) {
        const key = "yedirenk-applications-v1";
        const current = JSON.parse(localStorage.getItem(key) || "[]");
        current.push({
          ...payload,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        });
        localStorage.setItem(key, JSON.stringify(current.slice(-500)));
      } else {
        const response = await fetch("/api/public/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok)
          throw new Error(
            (await response.json().catch(() => null))?.message ||
              "Başvuru kaydedilemedi.",
          );
      }
      setSent(true);
    } catch (reason) {
      setFormError(
        reason instanceof Error ? reason.message : "Başvuru kaydedilemedi.",
      );
    } finally {
      setBusy(false);
    }
  };
  const applicationPanel = sent ? (
    <div className="success">
      <BadgeCheck />
      <h3>Mesajınız alındı.</h3>
      <p>Teşekkür ederiz. Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
    </div>
  ) : (
    <form className="contact-form" onSubmit={submitApplication}>
      {formError && <p className="payment-error">{formError}</p>}
      <div>
        <label>
          Ad Soyad
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          E-posta
          <input name="email" autoComplete="email" type="email" required />
        </label>
      </div>
      <div>
        <label>
          Telefon
          <input name="phone" autoComplete="tel" required />
        </label>
        <label>
          Konu
          <select name="subject">
            <option>{kind}</option>
            <option>Bağış</option>
            <option>Kurumsal iş birliği</option>
          </select>
        </label>
      </div>
      <label>
        Mesajınız
        <textarea name="message" rows="5" required />
      </label>
      <label className="check">
        <input name="consent" type="checkbox" required /> Kişisel verilerimin bu
        başvuru kapsamında işlenmesini kabul ediyorum.
      </label>
      <button className="btn navy" disabled={busy}>
        {busy ? "Gönderiliyor…" : "Mesajı Gönder"} <ArrowRight />
      </button>
    </form>
  );
  if (isContact) {
    const compactPhone = String(settings.phone || "").replace(/[^+\d]/g, "");
    const mapQuery = encodeURIComponent(settings.address || "Ankara, Türkiye");
    return (
      <main className="contact-page">
        <section className="contact-page-hero">
          <div className="container">
            <span>{page.tag}</span>
            <h1>{page.title}</h1>
            <p>
              Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.
              Ekibimiz size yardımcı olmaktan memnuniyet duyar.
            </p>
          </div>
        </section>

        <section
          className="container contact-info-grid"
          aria-label="İletişim bilgileri"
        >
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin />
            <span>
              <small>ADRES</small>
              <b>{settings.address}</b>
            </span>
          </a>
          <a href={`tel:${compactPhone}`}>
            <Phone />
            <span>
              <small>TELEFON</small>
              <b>{settings.phone}</b>
            </span>
          </a>
          <a href={`mailto:${settings.email}`}>
            <Mail />
            <span>
              <small>E-POSTA</small>
              <b>{settings.email}</b>
            </span>
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <Globe2 />
            <span>
              <small>KONUM</small>
              <b>Yol tarifi alın</b>
            </span>
            <ArrowRight />
          </a>
        </section>

        <section
          className="container contact-social-links"
          aria-label="Sosyal medya hesapları"
        >
          {socialMediaLinks.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              <Icon />
              <span>{label}</span>
              <ArrowRight />
            </a>
          ))}
        </section>

        <section className="container contact-page-main">
          <article className="contact-map-card">
            <div className="contact-section-heading">
              <span>KONUMUMUZ</span>
              <h2>Bizi ziyaret edin</h2>
              <p>{settings.address}</p>
            </div>
            <iframe
              title="Yedirenk Derneği konumu"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
          <article className="contact-message-card">
            <div className="contact-section-heading">
              <span>BİZE YAZIN</span>
              <h2>Mesajınızı iletin</h2>
              <p>Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.</p>
            </div>
            {applicationPanel}
          </article>
        </section>
      </main>
    );
  }
  return (
    <main className={isVolunteer ? "volunteer-form-page" : ""}>
      {isVolunteer ? (
        <section className="container volunteer-form-heading">
          <span>GÖNÜLLÜLÜK</span>
          <h1>{page.title}</h1>
          <p>{page.text}</p>
        </section>
      ) : (
        <PageHero
          tag={page.tag}
          title={page.title}
          text={page.text}
          image={page.image}
        />
      )}
      <section className="section">
        <div className="container form-layout">
          <div>
            <span className="kicker">YEDİRENK</span>
            <h2>
              Birlikte daha <em>fazlası mümkün.</em>
            </h2>
            <p>
              Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
            </p>
            <ul>
              {pageKey === "contact" && (
                <li>
                  <MapPin /> {settings.address}
                </li>
              )}
              <li>
                <Check /> Güvenli veri işleme
              </li>
              <li>
                <Check /> İhtiyaca uygun yönlendirme
              </li>
              <li>
                <Check /> Hızlı geri dönüş
              </li>
            </ul>
          </div>
          {applicationPanel}
        </div>
      </section>
    </main>
  );
}

async function localPasswordHash(value) {
  const bytes = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`yedirenk-dev:${value}`),
    ),
  );
  return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function ProjectsPage({ add }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const page = getSitePage(content, "projects");
  const projectMenuItems = uniqueProjectGroups(projects);
  return (
    <main>
      <section className="projects-hero">
        <div className="container">
          <span>{page.tag}</span>
          <h1>{page.title}</h1>
          <p>{page.text}</p>
        </div>
      </section>
      <section className="section projects-catalog">
        <div className="container">
          <nav
            className="project-categories project-name-menu"
            aria-label="Proje listesi"
          >
            {projectMenuItems.map((p) => {
              const Icon = projectGroupIcon(p);
              return (
                <Link key={p.slug} to={`/projeler/${p.slug}`}>
                  <Icon />
                  <span>{projectGroupLabel(p)}</span>
                </Link>
              );
            })}
          </nav>
          <div className="project-result-head">
            <div>
              <span>PROJELERİMİZ</span>
              <h2>{page.sectionTitle}</h2>
            </div>
            <div className="projects-result-meta">
              <PageReturnNavigation />
              <p>{projectMenuItems.length} proje</p>
            </div>
          </div>
          <div className="project-grid">
            {projectMenuItems.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                add={add}
                grouped
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
function FoodPackageQuickDonation({ project, variant, add }) {
  const [amount, setAmount] = useState(String(variant?.[1] || ""));
  const submit = (event) => {
    event.preventDefault();
    const price = Number(amount);
    if (!Number.isFinite(price) || price < 1) return;
    add({
      slug: `${project.slug}-hizli-${price}`,
      tag: project.category,
      title: project.title,
      desc: project.short,
      price,
      currency: variant?.[2] || "TRY",
      raised: 0,
      image: project.image,
      active: true,
    });
  };
  return (
    <div className="food-card-actions">
      <form onSubmit={submit}>
        <label>
          <span className="sr-only">Gıda Kolisi bağış tutarı</span>
          <b>₺</b>
          <input
            type="number"
            min="0"
            step="50"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Gıda Kolisi bağış tutarı"
            required
          />
        </label>
        <button type="submit">Bağış Yap</button>
      </form>
      <Link to={`/projeler/${project.slug}/detay?secim=0`}>
        Detayları gör <ArrowRight />
      </Link>
    </div>
  );
}

function ProjectGroupPage({ add }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const { slug } = useParams(),
    project = projects.find((x) => x.slug === slug);
  if (!project)
    return (
      <main className="section">
        <div className="container">
          <h1>Proje bulunamadı</h1>
          <Link to="/projeler">Projelere dön</Link>
        </div>
      </main>
    );
  const groupKey = projectGroupKey(project);
  const Icon = projectGroupIcon(project);
  const isOrphanGroup = groupKey === "yetim";
  const isWorshipGroup = groupKey === "cami-mescid";
  const isCombinedGroup = isOrphanGroup || isWorshipGroup;
  const groupedProjects = projects.filter(
    (candidate) => projectGroupKey(candidate) === groupKey,
  );
  const projectMenuItems = uniqueProjectGroups(projects);
  const qurbaniDefaultIndex = Math.max(
    0,
    project.variants.findIndex((variant) => variant[0] === "Afrika"),
  );
  const qurbaniDefault = project.variants[qurbaniDefaultIndex];
  const rawCards = isOrphanGroup
    ? groupedProjects.map((item) => ({
        variant: getPrimaryProjectVariant(item),
        index: 0,
        cardProject: item,
      }))
    : isWorshipGroup
      ? groupedProjects.flatMap((item) =>
          item.variants.map((variant, index) => ({
            variant,
            index,
            cardProject: item,
          })),
        )
      : project.calculator
        ? [["Zekâtını Hesapla", 0, "TRY"]]
        : project.slug === "adak-akika-nafile-kurban"
          ? [
              [
                "Kurban",
                qurbaniDefault?.[1] || 0,
                qurbaniDefault?.[2] || "TRY",
                project.image,
              ],
            ]
          : ["gida-kolisi", "toplu-yemek"].includes(project.slug)
            ? [project.variants[0]]
            : project.variants;
  const cards = (
    isCombinedGroup
      ? rawCards
      : rawCards.map((variant, index) => ({
          variant,
          index:
            project.slug === "adak-akika-nafile-kurban"
              ? qurbaniDefaultIndex
              : index,
          cardProject: project,
        }))
  ).filter(({ variant }, index, list) => {
    if (
      project.slug === "turkiye-projeleri" &&
      variant[0] === "Yetim Giyim"
    )
      return false;
    if (project.slug === "su-kuyusu")
      return (
        list.findIndex(
          (item) =>
            item.variant[0].split(" · ")[0] === variant[0].split(" · ")[0],
        ) === index
      );
    return true;
  });
  const isHorizontalShowcase =
    [
      "su-kuyusu",
      "adak-akika-nafile-kurban",
      "gida-kolisi",
      "zekat",
      "toplu-yemek",
      "medrese",
    ].includes(project.slug) ||
    isOrphanGroup ||
    isWorshipGroup;
  return (
    <main className="project-group-page">
      <section
        className="container project-group-tabs"
        aria-label="Proje grupları"
      >
        {projectMenuItems.map((item) => {
          const ItemIcon = projectGroupIcon(item);
          const itemGroupKey = projectGroupKey(item);
          const projectCount = visibleProjectCardCount(item, projects);
          return (
            <Link
              className={itemGroupKey === groupKey ? "active" : ""}
              key={item.slug}
              to={`/projeler/${item.slug}`}
            >
              <ItemIcon />
              <span>{projectGroupLabel(item)}</span>
              <small>{projectCount}</small>
            </Link>
          );
        })}
      </section>
      {project.slug === "gazze-yardim" && (
        <div className="container gazze-projects-banner">
          <img
            src="/assets/gazze-projects-banner-v1.webp"
            alt="Gazze’de hayat sürsün yardım projeleri"
          />
        </div>
      )}
      <section className="container project-group-heading">
        <h1>{projectGroupLabel(project)}</h1>
      </section>
      <section className="container project-group-results">
        <div className="project-group-title">
          <div>
            <Icon />
            <span>
              <small>PROJE SEÇENEKLERİ</small>
              <h2>Bağış Seçenekleri</h2>
            </span>
          </div>
          <div className="project-group-meta">
            <PageReturnNavigation />
            <b>{cards.length} seçenek</b>
          </div>
        </div>
        <div
          className={`project-variant-grid${
            isHorizontalShowcase ? " water-well-showcase-grid" : ""
          }`}
        >
          {cards.map(({ variant, index, cardProject }) => (
            <article
              className={`project-variant-card ${
                cardProject.slug === "gida-kolisi" ? "food-package-card" : ""
              } ${
                ["yetim-hamiligi", "yetim-giydirme"].includes(cardProject.slug)
                  ? "orphan-banner-card"
                  : ""
              } ${
                [
                  "su-kuyusu",
                  "adak-akika-nafile-kurban",
                  "gida-kolisi",
                  "zekat",
                  "toplu-yemek",
                  "yetim-hamiligi",
                  "yetim-giydirme",
                  "medrese",
                ].includes(cardProject.slug) || isWorshipGroup
                  ? "water-well-horizontal-card"
                  : ""
              } ${
                cardProject.slug === "adak-akika-nafile-kurban"
                  ? "qurbani-horizontal-card"
                  : ""
              } ${
                ["gazze-yardim", "turkiye-projeleri"].includes(cardProject.slug)
                  ? "gazze-project-card"
                  : ""
              }`}
              key={`${cardProject.slug}-${variant[0]}`}
            >
              <div className="project-variant-image">
                <Media
                  src={projectCategoryCoverImage(cardProject, variant, index)}
                  alt={cardProject.title + " " + variant[0]}
                />
              </div>
              <div className="project-variant-copy">
                <h3>
                  {isOrphanGroup
                    ? cardProject.slug === "yetim-hamiligi"
                      ? "Yetim Hamiliği"
                      : cardProject.slug === "yetim-giydirme"
                        ? "Yetim Giyim"
                        : cardProject.title
                    : isWorshipGroup
                      ? `${variant[0]} ${
                          cardProject.slug === "mescid" ? "Mescid" : "Cami"
                        }`
                      : cardProject.slug === "adak-akika-nafile-kurban"
                        ? "Adak Akika Nafile Kurban"
                        : cardProject.slug === "su-kuyusu"
                          ? "Su Kuyusu"
                          : cardProject.slug === "gida-kolisi"
                            ? "Gıda Kolisi"
                            : cardProject.slug === "toplu-yemek"
                              ? "Toplu Yemek"
                              : cardProject.slug === "zekat"
                                ? "Zekât"
                                : project.slug === "su-kuyusu"
                                  ? variant[0].split(" · ")[0]
                                  : cardProject.slug === "turkiye-projeleri" &&
                                      variant[0] === "Yetim Hamiliği"
                                    ? "Yetim"
                                    : variant[0]}
                </h3>
                <p>
                  {cardProject.slug === "turkiye-projeleri" &&
                  variant[0] === "Yetim Hamiliği"
                    ? "Yetim çocukların eğitim, giyim, beslenme ve günlük ihtiyaçlarına destek olun."
                    : variant[4] ||
                    (["gida-kolisi", "zekat"].includes(cardProject.slug)
                      ? cardProject.description
                      : cardProject.short)}
                </p>
                <div
                  className={
                    cardProject.calculator
                      ? "project-variant-actions"
                      : "project-variant-actions project-variant-donate-actions"
                  }
                >
                  {cardProject.calculator ? (
                    <>
                      <b>Tutarınızı hesaplayın</b>
                      <Link to="/zekat-hesapla">
                        HESAPLA <ArrowRight />
                      </Link>
                    </>
                  ) : (
                    <Link
                      to={`/projeler/${cardProject.slug}/detay?secim=${index}`}
                    >
                      BAĞIŞ YAP
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
function ProjectDetail({ add }) {
  const { slug } = useParams(),
    navigate = useNavigate(),
    project = projectCatalog.find((x) => x.slug === slug);
  const [choice, setChoice] = useState(0);
  if (!project)
    return (
      <main className="section">
        <div className="container">
          <h1>Proje bulunamadı</h1>
          <Link to="/projeler">Projelere dön</Link>
        </div>
      </main>
    );
  const variant = project.variants[choice];
  return (
    <main>
      <section className="project-detail-hero">
        <Media src={projectVariantImage(project, choice)} alt="" />
        <div className="project-detail-shade" />
        <div className="container">
          {project.slug !== "toplu-yemek" && <span>{project.category}</span>}
          <h1>{project.title}</h1>
          <p>{project.short}</p>
        </div>
      </section>
      <section className="section">
        <div className="container project-detail-layout">
          <article>
            <Link className="project-back" to="/projeler">
              <ChevronLeft /> Tüm projeler
            </Link>
            <h2>Proje hakkında</h2>
            <p className="project-lead">{project.description}</p>
            <div className="project-assurance">
              <div>
                <ShieldCheck />
                <b>Şeffaf süreç</b>
                <span>Uygulama aşamaları kayıt altına alınır.</span>
              </div>
              <div>
                <UsersRound />
                <b>Yerinde ihtiyaç tespiti</b>
                <span>Projeler saha verisine göre planlanır.</span>
              </div>
              <div>
                <PackageCheck />
                <b>Teslim ve raporlama</b>
                <span>Proje sonucu bağışçıyla paylaşılır.</span>
              </div>
            </div>
            <h3>Nasıl uygulanır?</h3>
            <ol className="project-steps">
              <li>
                <b>01</b>
                <span>İhtiyaç ve bölge doğrulaması</span>
              </li>
              <li>
                <b>02</b>
                <span>Yerel paydaş ve teknik planlama</span>
              </li>
              <li>
                <b>03</b>
                <span>Uygulama ve kalite kontrolü</span>
              </li>
              <li>
                <b>04</b>
                <span>Teslim, kayıt ve etki takibi</span>
              </li>
            </ol>
          </article>
          <aside className="project-donate-box">
            <span>PROJEYE DESTEK OL</span>
            <h3>Bağış Yap</h3>
            {project.calculator ? (
              <>
                <p>
                  Zekâta tabi varlıklarınızı hesaplayarak bağış tutarınızı
                  belirleyin.
                </p>
                <Link className="btn orange" to="/zekat-hesapla">
                  Zekâtını hesapla <Calculator />
                </Link>
              </>
            ) : (
              <>
                <label>
                  Proje alternatifi
                  <select
                    value={choice}
                    onChange={(e) => setChoice(Number(e.target.value))}
                  >
                    {project.variants.map((v, i) => (
                      <option key={v[0]} value={i}>
                        {v[0]} {v[1] ? `— ${money(v[1], v[2])}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                {variant[1] > 0 ? (
                  <>
                    <div className="project-price">
                      <small>Bağış tutarı</small>
                      <b>{money(variant[1], variant[2])}</b>
                    </div>
                    <button
                      className="btn orange"
                      onClick={() => {
                        add({
                          slug: `${project.slug}-${choice}`,
                          tag: project.category,
                          title: `${project.title} · ${variant[0]}`,
                          desc: project.short,
                          price: variant[1],
                          currency: variant[2],
                          raised: 0,
                          image: projectVariantImage(project, choice),
                          active: true,
                        });
                        navigate("/projeler/" + project.slug);
                      }}
                    >
                      Hemen Bağış Yap <ArrowRight />
                    </button>
                  </>
                ) : (
                  <div className="project-coming">
                    Bu alternatifin fiyatı yakında açıklanacaktır.
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
function ProjectDetailSimple({ add }) {
  const { slug } = useParams(),
    project = projectCatalog.find((x) => x.slug === slug),
    [choice, setChoice] = useState(0),
    [donorType, setDonorType] = useState("Bireysel");
  if (!project)
    return (
      <main className="section">
        <div className="container">
          <h1>Proje bulunamadı</h1>
          <Link to="/projeler">Projelere dön</Link>
        </div>
      </main>
    );
  const variant = project.variants[choice];
  const addSelected = () =>
    add({
      slug: `${project.slug}-${choice}`,
      tag: project.category,
      title: `${project.title} · ${variant[0]}`,
      desc: project.short,
      price: variant[1],
      currency: variant[2],
      raised: 0,
      image: projectVariantImage(project, choice),
      active: true,
    });
  return (
    <main className="simple-project-page">
      <div className="container simple-breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <ChevronRight />
        <Link to="/projeler">Projeler</Link>
        <ChevronRight />
        <span>{project.title}</span>
      </div>
      <section className="container simple-project-top">
        <div className="simple-project-visual">
          <Media
            src={projectVariantImage(project, choice)}
            alt={project.title}
          />
          {project.slug !== "toplu-yemek" && (
            <div className="simple-image-brand">
              <span>{project.category}</span>
            </div>
          )}
        </div>
        <aside className="simple-donation-form">
          <span className="kicker">YEDİRENK BAĞIŞ PROJESİ</span>
          <h1>{project.title}</h1>
          <p>{project.short}</p>
          {project.calculator ? (
            <Link className="btn orange" to="/zekat-hesapla">
              Zekâtını hesapla <Calculator />
            </Link>
          ) : (
            <>
              <label>
                Proje alternatifi
                <select
                  value={choice}
                  onChange={(e) => setChoice(Number(e.target.value))}
                >
                  {project.variants.map((v, i) => (
                    <option key={v[0]} value={i}>
                      {v[0]} {v[1] ? `— ${money(v[1], v[2])}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <div className="simple-amount">
                <span>Bağış Tutarı</span>
                <b>
                  {variant[1] ? money(variant[1], variant[2]) : "Fiyat yakında"}
                </b>
              </div>
              <div className="donor-types">
                {["Bireysel", "Grup", "Kurumsal"].map((x) => (
                  <button
                    type="button"
                    className={donorType === x ? "active" : ""}
                    onClick={() => setDonorType(x)}
                    key={x}
                  >
                    {x}
                  </button>
                ))}
              </div>
              {variant[1] > 0 && (
                <button className="btn orange" onClick={addSelected}>
                  Hemen Bağış Yap <ArrowRight />
                </button>
              )}
            </>
          )}
        </aside>
      </section>
      <section className="container simple-project-description">
        <article>
          <h2>Proje Hakkında</h2>
          <p className="lead-copy">{project.description}</p>
          {project.slug === "su-kuyusu" && (
            <>
              <h3>Temiz su neden önemli?</h3>
              <p>
                Temiz su olmadığında içme, yemek hazırlama ve hijyen gibi en
                temel ihtiyaçlar ciddi bir sağlık riskine dönüşür. Özellikle
                çocuklar güvenli olmayan sulardan kaynaklanan hastalıklara karşı
                daha savunmasızdır.
              </p>
              <p>
                Yedirenk’in tulumbalı su kuyusu çalışmaları, ailelerin güvenli
                suya daha kısa sürede ulaşmasını ve çocukların eğitimlerine daha
                düzenli devam edebilmesini hedefler. Kuyu tamamlandıktan sonra
                su kalitesi kontrol edilir ve yerel bakım sorumluluğu
                belirlenir.
              </p>
            </>
          )}
          <h3>Proje nasıl uygulanıyor?</h3>
          <div className="simple-process">
            <div>
              <b>01</b>
              <span>İhtiyaç ve bölge doğrulaması</span>
            </div>
            <div>
              <b>02</b>
              <span>Teknik inceleme ve planlama</span>
            </div>
            <div>
              <b>03</b>
              <span>Uygulama ve kalite kontrolü</span>
            </div>
            <div>
              <b>04</b>
              <span>Teslim ve bağışçı raporlaması</span>
            </div>
          </div>
        </article>
        <aside>
          <ShieldCheck />
          <h3>Bağışınız güvende</h3>
          <p>
            Bağışınız seçtiğiniz proje ve varyant kapsamında değerlendirilir.
            Uygulama süreci kayıt altına alınır.
          </p>
        </aside>
      </section>
      {project.slug === "su-kuyusu" && choice === 0 && (
        <section className="container simple-project-description">
          <article>
            <h2>Derinden Gelen Hayat</h2>
            <p>
              Su, hayatın en temel ihtiyaçlarından biri. Yedirenk Derneği olarak su
              kuyusu çalışmalarımızı, sahada yapılan ihtiyaç ve yer tespitleri
              doğrultusunda gerçekleştiriyoruz.
            </p>
            <p>
              Bağışçımızın tercih ettiği ülke ve kuyu türüne göre süreç
              planlanıyor; kuyuya verilecek isim ve afiş hazırlanarak onaya
              sunuluyor. Çalışma tamamlandığında kuyunun video ve görselleri
              bağışçımızla paylaşılıyor.
            </p>
            <WaterWellFeatures />
            <WaterWellProcess />
          </article>
        </section>
      )}
      {project.slug === "zekat" && choice === 0 && (
        <section className="container simple-project-description">
          <article className="zakat-detail-content">
            <ZakatDetailInformation />
          </article>
        </section>
      )}
      {isQurbani && choice === 3 && (
        <section className="container simple-project-description">
          <article>
            <h2>Bir Lokma Et Neden Bu Kadar Kıymetli?</h2>
            <p>
              Kuraklık, yoksulluk ve geçim imkânlarının sınırlı olması nedeniyle
              dünyanın birçok bölgesinde aileler ete düzenli olarak ulaşmakta
              güçlük çekiyor. Bazı aileler için et, günlük sofranın bir parçası
              değil; uzun süre beklenen kıymetli bir gıda.
            </p>
            <p>
              Bu nedenle ulaştırılan kurban etleri yalnızca bir öğünlük destek
              olarak görülmüyor. Bazı aileler kendilerine ulaşan etleri
              kurutarak veya farklı yöntemlerle muhafaza ederek daha uzun süre
              tüketiyor.
            </p>
            <p>
              Dünyanın bir tarafında zaman zaman israf edilen et, başka bir
              coğrafyada bir ailenin uzun zamandır beklediği sofraya
              dönüşebiliyor.
            </p>
            <QurbaniImpactCards />
            <QurbaniProcessCards />
          </article>
        </section>
      )}
      <section className="simple-related">
        <div className="container">
          <h2>Bunlar da ilginizi çekebilir</h2>
          <div>
            {projectCatalog
              .filter((x) => x.slug !== project.slug)
              .slice(0, 3)
              .map((x) => (
                <Link to={`/projeler/${x.slug}`} key={x.slug}>
                  <img src={x.image} alt="" />
                  <b>{x.title}</b>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectDetailEnhanced({ add }) {
  const { slug } = useParams(),
    project = projectCatalog.find((x) => x.slug === slug),
    [choice, setChoice] = useState(0),
    [manual, setManual] = useState(false),
    [amount, setAmount] = useState(""),
    [donorType, setDonorType] = useState("Bireysel");
  if (!project)
    return (
      <main className="section">
        <div className="container">
          <h1>Proje bulunamadı</h1>
          <Link to="/projeler">Projelere dön</Link>
        </div>
      </main>
    );
  const variant = project.variants[choice],
    currency = variant?.[2] || "TRY",
    finalAmount = manual ? Number(amount) : Number(variant?.[1] || 0),
    copy = projectLongCopy[project.slug] || [project.description];
  const addSelected = () => {
    if (!Number.isFinite(finalAmount) || finalAmount < 1) return;
    add({
      slug: `${project.slug}-${choice}-${manual ? "ozel" : "hazir"}`,
      tag: project.category,
      title: `${project.title} · ${manual ? "Özel Tutar" : variant[0]}`,
      desc: project.short,
      price: finalAmount,
      currency,
      raised: 0,
      image: projectVariantImage(project, choice),
      active: true,
    });
  };
  return (
    <main className="simple-project-page">
      <div className="container simple-breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <ChevronRight />
        <Link to="/projeler">Projeler</Link>
        <ChevronRight />
        <span>{project.title}</span>
      </div>
      <section className="container simple-project-top">
        <div className="simple-project-visual">
          <Media
            src={projectVariantImage(project, choice)}
            alt={project.title}
          />
          {project.slug !== "toplu-yemek" && (
            <div className="simple-image-brand">
              <span>{project.category}</span>
            </div>
          )}
        </div>
        <aside className="simple-donation-form">
          <span className="kicker">YEDİRENK BAĞIŞ PROJESİ</span>
          <h1>{project.title}</h1>
          <p>{project.short}</p>
          {project.calculator ? (
            <>
              <Link className="btn outline" to="/zekat-hesapla">
                Önce zekâtını hesapla <Calculator />
              </Link>
              <div className="amount-mode">
                <button type="button" className="active">
                  Tutarımı gireceğim
                </button>
              </div>
              <label>
                Bağış tutarı
                <input
                  className="manual-amount"
                  type="number"
                  min="0"
                  step="50"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <i>₺</i>
              </label>
            </>
          ) : (
            <>
              <div className="amount-mode">
                <button
                  type="button"
                  className={!manual ? "active" : ""}
                  onClick={() => setManual(false)}
                >
                  Hazır tutar
                </button>
                <button
                  type="button"
                  className={manual ? "active" : ""}
                  onClick={() => setManual(true)}
                >
                  Tutarımı gireceğim
                </button>
              </div>
              {!manual ? (
                <label>
                  Proje alternatifi
                  <select
                    value={choice}
                    onChange={(e) => setChoice(Number(e.target.value))}
                  >
                    {project.variants.map((v, i) => (
                      <option key={v[0]} value={i} disabled={!v[1]}>
                        {v[0]}{" "}
                        {v[1] ? `— ${money(v[1], v[2])}` : "— Fiyat yakında"}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label>
                  Bağış tutarı
                  <input
                    className="manual-amount"
                    type="number"
                    min="0"
                    step="50"
                    inputMode="decimal"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <i>{currency === "USD" ? "$" : "₺"}</i>
                </label>
              )}
            </>
          )}
          <div className="simple-amount">
            <span>Bağış tutarı</span>
            <b>
              {finalAmount > 0 ? money(finalAmount, currency) : "Tutar giriniz"}
            </b>
          </div>
          <div className="donor-types">
            {["Bireysel", "Grup", "Kurumsal"].map((x) => (
              <button
                type="button"
                className={donorType === x ? "active" : ""}
                onClick={() => setDonorType(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <button
            disabled={finalAmount < 1}
            className="btn orange"
            onClick={addSelected}
          >
            Hemen Bağış Yap <ArrowRight />
          </button>
        </aside>
      </section>
      <section className="container simple-project-description">
        <article>
          <h2>Proje Hakkında</h2>
          {copy.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      </section>
      <section className="simple-related">
        <div className="container">
          <h2>Bunlar da ilginizi çekebilir</h2>
          <div>
            {projectCatalog
              .filter((x) => x.slug !== project.slug)
              .slice(0, 3)
              .map((x) => (
                <Link to={`/projeler/${x.slug}`} key={x.slug}>
                  <img src={x.image} alt="" />
                  <b>{x.title}</b>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const turkeyProjectDescriptions = [
  {
    title: "Bir Fatura, Bir Ailenin Yükünü Hafifletebilir",
    paragraphs: [
      "Kimi evlerde biriken faturalar, yalnızca ödenmesi gereken borçlar değil; bir ailenin her gün taşıdığı ağır bir yük.",
      "Yedirenk Derneği olarak elektrik, su ve doğalgaz faturalarını ödemekte zorlanan ihtiyaç sahibi ailelerin yanında olmak için “Fatura Desteği” çalışmamızı sürdürüyoruz.",
      "Sizlerin desteğiyle bir ailenin elektriği kesilmesin, bir ev soğukta kalmasın, bir anne-baba çocuklarının temel ihtiyaçlarını düşünürken bir de faturaların yükünü taşımasın.",
      "Bir ailenin yükünü birlikte hafifletelim.",
      "Siz de bağışınızla bir ailenin faturasına destek olabilir, onların yanında olduğumuzu hissettirebilirsiniz.",
    ],
  },
  {
    title: "Bir Borcu Değil, Bir Gönlü Hafifletelim",
    paragraphs: [
      "Bazı insanların borcu, yalnızca bir rakam değildir. Bir ailenin geçim mücadelesi, bir annenin kaygısı, bir babanın taşıdığı sessiz bir yük olabilir.",
      "Yedirenk Derneği olarak Zimem Defteri Projemiz ile mahalle bakkallarında ihtiyaç sahibi ailelerin veresiye borçlarını kapatarak, kimseyi mahcup etmeden ve kimsenin kim olduğunu bilmeden destek oluyoruz.",
      "Siz kıymetli bağışçılarımızın desteği ile bir ailenin borcu kapanıyor, bir esnafın alacağı yerine ulaşıyor ve bir evin üzerindeki yük biraz olsun hafifliyor.",
      "İyilik bazen bir borcu kapatmak, bazen de bir insanın onurunu incitmeden yanında olmaktır.",
      "Siz de Zimem Defteri Projemize destek olun; bir ailenin borcuna değil, hayatına dokunun.",
    ],
  },
  {
    title: "Bir El Uzat, Bir Yük Hafiflesin",
    paragraphs: [
      "Bazı ihtiyaçlar ertelenemez… Bir annenin mutfak masrafı, bir babanın ev kirası, bir öğrencinin okul ihtiyacı veya bir ailenin günlük geçimi beklemez.",
      "Yedirenk Derneği olarak ihtiyaç sahibi ailelerin temel ihtiyaçlarını karşılayabilmeleri için nakdi yardım çalışmamızı sürdürüyoruz.",
      "Siz kıymetli bağışçılarımızın desteğiyle, ihtiyaç sahiplerine doğrudan ulaşarak zor zamanlarında yanlarında oluyor; onların kendi ihtiyaçlarını önceliklerine göre karşılayabilmelerine imkân sağlıyoruz.",
      "Bazen küçük görünen bir destek, bir ailenin o ayını rahat geçirmesine vesile olabilir.",
      "İyilik, ihtiyaç sahibine gerçekten ihtiyaç duyduğu anda ulaşabilmektir.",
      "Siz de nakdi yardımınızla bir ailenin yükünü hafifletmeye, zor günlerinde yanında olmaya vesile olun.",
    ],
  },
  {
    title: "Bir Yetimin Elinden Tut, Yalnız Olmadığını Hissettir",
    paragraphs: [
      "Bir çocuğun hayatında eksilen sadece bir anne ya da baba değildir. Bazen bir evin sıcaklığı, bazen güven duygusu, bazen de geleceğe dair ihtiyaçlar daha ağır hissedilir.",
      "Yedirenk Derneği olarak yetim çocuklarımızın yanında olmak, onların temel ihtiyaçlarına katkı sunmak ve hayat yolculuklarında kendilerini yalnız hissetmemeleri için Yetim Desteği Projemizi sürdürüyoruz.",
      "Siz kıymetli bağışçılarımızın desteğiyle; eğitimden giyime, beslenmeden günlük ihtiyaçlara kadar yetim çocuklarımızın ihtiyaçlarına katkı sağlıyor, onların yüzlerinde bir tebessüme vesile olmaya çalışıyoruz.",
      "Her çocuk sevgiyle büyümeyi, güvende olmayı ve güzel bir geleceğe hazırlanmayı hak eder.",
      "Bir yetimin ihtiyacını karşılamak, onun hayatında unutulmayacak bir iyilik bırakmaktır.",
      "Siz de Yetim Desteği Projemize katkıda bulunarak bir çocuğun yanında olduğunuzu hissettirebilir, onun hayatına dokunabilirsiniz.",
    ],
  },
  {
    title: "Bir Yetimin Elinden Tut, Yalnız Olmadığını Hissettir",
    paragraphs: [
      "Bir çocuğun hayatında eksilen sadece bir anne ya da baba değildir. Bazen bir evin sıcaklığı, bazen güven duygusu, bazen de geleceğe dair ihtiyaçlar daha ağır hissedilir.",
      "Yedirenk Derneği olarak yetim çocuklarımızın yanında olmak, onların temel ihtiyaçlarına katkı sunmak ve hayat yolculuklarında kendilerini yalnız hissetmemeleri için Yetim Desteği Projemizi sürdürüyoruz.",
      "Siz kıymetli bağışçılarımızın desteğiyle; eğitimden giyime, beslenmeden günlük ihtiyaçlara kadar yetim çocuklarımızın ihtiyaçlarına katkı sağlıyor, onların yüzlerinde bir tebessüme vesile olmaya çalışıyoruz.",
      "Her çocuk sevgiyle büyümeyi, güvende olmayı ve güzel bir geleceğe hazırlanmayı hak eder.",
      "Bir yetimin ihtiyacını karşılamak, onun hayatında unutulmayacak bir iyilik bırakmaktır.",
      "Siz de Yetim Giyim desteğiyle bir çocuğun yanında olduğunuzu hissettirebilir, onun hayatına dokunabilirsiniz.",
    ],
  },
  {
    title: "Bir Sofraya Bereket, Bir Aileye Destek",
    paragraphs: [
      "Bazı sofralarda eksilen yalnızca yemek değildir; bir ailenin geçim mücadelesi, çocukların ihtiyaçları ve yarının kaygısı da o sofraya yansır.",
      "Yedirenk Derneği olarak temel gıda ihtiyaçlarını karşılamakta zorlanan ailelerin yanında olmak için Gıda Kolisi Projemizi sürdürüyoruz.",
      "Siz kıymetli bağışçılarımızın desteğiyle hazırlanan gıda kolileri; ihtiyaç sahibi ailelerin mutfaklarına ulaşıyor, sofralarına katkı oluyor ve zor zamanlarında yalnız olmadıklarını hissettiriyor.",
      "Bir koli; bir ailenin mutfağındaki eksikleri tamamlayabilir, bir annenin alışveriş kaygısını azaltabilir, bir çocuğun sofrasına katkı olabilir.",
      "Bir Gıda Kolisi destek bedeli: 2.000 TL",
      "Paylaştıkça çoğalan iyiliğe siz de ortak olun.",
      "Siz de Gıda Kolisi Projemize destek olarak bir ailenin sofrasına katkıda bulunabilir, ihtiyaç sahiplerinin yanında olduğumuzu birlikte gösterebilirsiniz.",
    ],
  },
  {
    title: "Bir Sandalye Değil, Özgürlüğe Açılan Bir Yol",
    paragraphs: [
      "Hareket etmek, dışarı çıkmak, kendi ihtiyaçlarını karşılamak ve hayata daha bağımsız bir şekilde devam edebilmek… Bunlar herkes için sıradan görünen ama bazı kardeşlerimiz için büyük bir imkân anlamına gelen ihtiyaçlardır.",
      "Yedirenk Derneği olarak hareket kısıtlılığı yaşayan ihtiyaç sahibi kardeşlerimizin günlük hayatlarını kolaylaştırmak ve sosyal yaşama daha aktif katılabilmelerine destek olmak amacıyla Akülü Tekerlekli Sandalye Projemizi sürdürüyoruz.",
      "Siz kıymetli bağışçılarımızın desteğiyle temin edilen akülü tekerlekli sandalyeler, ihtiyaç sahiplerinin hayatına yalnızca hareket kolaylığı değil; bağımsızlık, özgüven ve yeniden hayata karışabilme imkânı kazandırıyor.",
      "Bazen bir destek, bir insanın kendi başına dışarı çıkabilmesi; ailesine, dostlarına ve hayata daha yakın olabilmesi demektir.",
      "Bir adet Akülü Tekerlekli Sandalye destek bedeli: 20.000 TL",
      "Bir sandalye hediye etmeyin sadece; bir insanın kendi yolunda yürüyebilmesine vesile olun.",
      "Siz de Akülü Tekerlekli Sandalye Projemize destek olarak bir kardeşimizin hayatına dokunabilir, onun hayatını kolaylaştırabilirsiniz.",
    ],
  },
];

function TurkeySelectedProjectDescription({ choice }) {
  const content = turkeyProjectDescriptions[choice] || turkeyProjectDescriptions[0];
  const presentation = [
    {
      checks: [
        "Elektrik, su ve doğalgaz faturalarına destek sağlanır.",
        "Destek, ihtiyaç tespiti yapılan ailelerin doğrulanmış faturalarına ulaştırılır.",
        "Bağış tutarını bütçenize göre kendiniz belirleyebilirsiniz.",
      ],
      note: "Fatura Desteği için dilediğiniz tutarda bağış yapabilirsiniz.",
    },
    {
      checks: [
        "Mahalle bakkallarındaki ihtiyaç sahibi ailelere ait veresiye borçları kapatılır.",
        "Ailelerin kimliği açıklanmaz; mahremiyet ve insan onuru korunur.",
        "Bağış tutarını bütçenize göre kendiniz belirleyebilirsiniz.",
      ],
      note: "Zimem Defteri Projesi için dilediğiniz tutarda destek olabilirsiniz.",
    },
    {
      checks: [
        "Destek, ihtiyaç tespiti yapılan ailelere doğrudan ulaştırılır.",
        "Aileler yardımı kira, mutfak, eğitim veya öncelikli günlük ihtiyaçlarında kullanabilir.",
        "Bağış tutarını bütçenize göre kendiniz belirleyebilirsiniz.",
      ],
      note: "Nakdi Yardım için dilediğiniz tutarda bağış yapabilirsiniz.",
    },
    {
      checks: [
        "Bir aylık Yetim Hamiliği destek bedeli: 1.000 TL",
        "Destek; eğitim, beslenme, sağlık ve günlük ihtiyaçlara katkı sağlar.",
        "Programa alınan çocukların ihtiyaç durumu düzenli olarak takip edilir.",
      ],
      note: "Yetim Hamiliği desteğine 1.000 TL'nin altında veya üstünde de katkıda bulunabilirsiniz.",
    },
    {
      checks: [
        "Bir Yetim Giyim destek bedeli: 1.500 TL",
        "Kıyafetler çocuğun yaşına, bedenine ve mevsim şartlarına uygun hazırlanır.",
        "Teslim sürecinde çocuğun mahremiyeti ve insan onuru korunur.",
      ],
      note: "Yetim Giyim desteğine 1.500 TL'nin altında veya üstünde de katkıda bulunabilirsiniz.",
    },
    {
      checks: [
        "Bir Gıda Kolisi destek bedeli: 2.000 TL",
        "Koliler temel ve dayanıklı gıda ürünlerinden hazırlanır.",
        "Teslimler ihtiyaç tespiti yapılan ailelere ulaştırılır.",
      ],
      note: "Gıda Kolisi için 2.000 TL'nin altında veya üstünde de bağış yapabilirsiniz.",
    },
    {
      checks: [
        "Bir Akülü Tekerlekli Sandalye destek bedeli: 20.000 TL",
        "Sandalye, ihtiyaç sahibinin fiziksel durumuna ve kullanım ihtiyacına göre temin edilir.",
        "Destek; hareket özgürlüğüne ve sosyal yaşama daha bağımsız katılıma katkı sağlar.",
      ],
      note: "Akülü Tekerlekli Sandalye için 20.000 TL'nin altında veya üstünde de destek olabilirsiniz.",
    },
  ][choice] || {};
  const body = content.paragraphs.filter(
    (paragraph, index) =>
      index !== content.paragraphs.length - 1 &&
      !paragraph.toLocaleLowerCase("tr-TR").includes("destek bedeli"),
  );
  const closing = content.paragraphs[content.paragraphs.length - 1];
  return (
    <article className="gaza-selected-project-copy turkey-selected-project-copy">
      <h2>{content.title.toLocaleUpperCase("tr-TR")}</h2>
      {body.map((paragraph, index) => (
        <p key={paragraph}>
          {index === 1 ? <strong>Yedirenk Derneği </strong> : null}
          {index === 1
            ? paragraph.replace(/^Yedirenk Derneği olarak\s*/i, "olarak ")
            : paragraph}
        </p>
      ))}
      <ul>
        {presentation.checks.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>Not:</strong> {presentation.note}
      </p>
      <p>
        <strong>{closing}</strong>
      </p>
    </article>
  );
}

function GazaSelectedProjectDescription({ choice }) {
  if (choice === 0) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>SU TANKERİ</h2>
        <p>
          Gazze’de temiz suya ulaşmak, binlerce aile için hâlâ büyük bir sorun.
        </p>
        <p>
          <strong>Yedirenk Derneği</strong> olarak Gazze’de mahallelerde su
          tankerleri ile su dağıtımı yapıyoruz.
        </p>
        <p>
          Gazze’deki ailelerin susuzluğunu gidermek için sizler de bir tanker su
          bağışında bulunabilirsiniz.
        </p>
        <ul>
          <li>
            Bir su tankerinin kapasitesi: <strong>5 ton = 5.000 litre</strong>
          </li>
          <li>
            5 tonluk 1 su tankeri: <strong>12.000 TL</strong>
          </li>
          <li>
            Toplam <strong>10 ton</strong> tedarik edildikten sonra bölgeye su
            dağıtımı yapılacaktır.
          </li>
        </ul>
        <p>
          <strong>Not:</strong> Su tankeri için 12.000 TL'nin altında yada
          üstünde bağış yaparakta destek olabilirsiniz.
        </p>
        <p>
          <strong>Gazze için birlikte su olalım.</strong>
        </p>
      </article>
    );
  }

  if (choice === 1) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>EKMEK DAĞITIMI</h2>
        <p>
          Gazze’de yaşayan, kriz nedeniyle temel gıdaya erişimde ciddi
          sıkıntılar yaşayan ihtiyaç sahibi ailelere destek olmak amacıyla ekmek
          dağıtımı gerçekleştiriyoruz.
        </p>
        <p>
          Sizlerin emanet ettiği bağışlarla temin edilen ekmeklerin, bölgede
          yürütülen yardım çalışmaları kapsamında ihtiyaç sahibi ailelere
          ulaştırılmasına katkı sağlıyoruz.
        </p>
        <ul>
          <li>
            Bir pakette <strong>10 adet ekmek</strong> bulunmaktadır.
          </li>
          <li>
            Bir paket: <strong>200 TL</strong>
          </li>
          <li>
            Kendi adınıza afiş için en az <strong>200 paket sipariş</strong>{" "}
            verilmelidir.
          </li>
        </ul>
        <p>
          <strong>Bir ekmek, Gazzeli bir ailenin sofrasına umut demek.</strong>
        </p>
      </article>
    );
  }

  if (choice === 2) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>GAZZE GIDA KOLİSİ</h2>
        <p>
          Gazze’de yaşanan insani kriz nedeniyle binlerce aile temel gıda
          ihtiyaçlarına ulaşmakta büyük zorluk yaşamaktadır.
        </p>
        <p>
          Savaşın en ağır yaşam koşullarının etkisiyle özellikle çocuklar,
          kadınlar ve yaşlılar başta olmak üzere birçok insan günlük temel gıda
          ihtiyacını karşılamakta zorlanmaktadır.
        </p>
        <p>
          <strong>Yedirenk Derneği</strong> olarak siz değerli bağışçılarımızın
          desteği ile{" "}
          <strong>
            Gazze’de ihtiyaç sahibi ailelere gıda kolileri ulaştırmayı
            hedefliyoruz.
          </strong>
        </p>
        <p>
          Gelin, hep birlikte Gazze’de bir ailenin sofrasına umut olalım. Bir
          gıda kolisine siz de vesile olun.
        </p>
        <ul>
          <li>
            <strong>1 adet gıda kolisi bedeli: 3.000 TL</strong>
          </li>
          <li>
            <strong>
              Video ve görsel için en az 50 adet sipariş verilmelidir.
            </strong>
          </li>
          <li>
            <strong>
              3.000 TL altında veya üstünde de bağışta bulunabilirsiniz.
            </strong>
          </li>
        </ul>
        <p>
          <strong>
            “Bir annenin yüreğindeki yükü, bir gıda kolisi hafifletsin.”
          </strong>
        </p>
      </article>
    );
  }

  if (choice === 3) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>SEBZE KOLİSİ</h2>
        <p>
          Gazze’de bugün bir anne, çocuklarına ne hazırlayacağını düşünürken
          yalnız bir yemek değil, yarının ne getireceğini de düşünüyor.
        </p>
        <p>
          Bir baba, ailesinin sofrasında bugün ne bulabileceğinin hesabını
          yapıyor.
        </p>
        <p>
          İşte tam da bu yüzden, hazırladığımız her sebze kolisi sadece bir koli
          değil;
        </p>
        <ul>
          <li>Bir evin mutfağına ulaşan bereket,</li>
          <li>
            Bir annenin içindeki endişeyi bir nebze olsun hafifleten destek,
          </li>
          <li>
            Yediden yetmişe sofraya emanet ettiğiniz bağışlarla hazırladığımız
            sebze kolilerini Gazze’deki ailelere ulaştırıyoruz.
          </li>
        </ul>
        <ul>
          <li>
            Bir adet sebze kolisi fiyatı: <strong>2.500 TL</strong>
          </li>
          <li>
            Görsel ve video için en az{" "}
            <strong>20 adet sipariş verilmelidir.</strong>
          </li>
          <li>
            2.500 TL’nin altında veya üstünde de bağışta bulunabilirsiniz.
          </li>
        </ul>
        <p>
          Gazze’de bir sofranın eksik kalmaması için, bir çocuğun önüne sıcak ve
          sağlıklı bir yemek konabilmesi için, iyiliğin sınır tanımadığını
          göstermek için...
        </p>
        <p>
          <strong>Siz de bir ailenin sofrasına umut olun.</strong>
        </p>
      </article>
    );
  }

  if (choice === 6) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>AMELİYAT PROJESİ</h2>
        <p>Savaş yalnızca binaları yıkmıyor...</p>
        <p>İnsanların hayatlarını, hayallerini ve yarınlarını da yaralıyor.</p>
        <p>
          Gazze’de savaş neticesinde yaşanan ağır şartlar nedeniyle sağlık
          hizmetlerine ulaşmakta ciddi sorunlar yaşanmakta.
        </p>
        <p>
          Bu süreç neticesinde sakat kalan, kolunu kaybeden, bacağını kaybeden
          ve birçok acıya maruz kalan Gazze halkının her birinin yeniden
          iyileşmeye, yeniden hayata tutunmaya ihtiyacı var.
        </p>
        <p>
          Bizler de Yedirenk Derneği olarak Gazze halkı için yapılacak
          ameliyatlar ve tıbbi malzeme tedariği noktasında siz kıymetli
          bağışçılarımızla birlikte yaraları sarmak istiyoruz.
        </p>
        <p>
          <strong>Bir ameliyatın destek bedeli: 11.500 TL</strong>
        </p>
        <p>
          <strong>
            Not: Ameliyat projesi için 11.500 TL’nin altında ya da üstünde
            bağış yapabilirsiniz.
          </strong>
        </p>
      </article>
    );
  }

  if (choice === 4) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>TOPLU YEMEK DAĞITIMI</h2>
        <p>Gazze’de bir sofraya misafir olun.</p>
        <p>Bazen bir iyilik büyük şeylerle başlamaz.</p>
        <p>Bir tabak yemek ile başlar...</p>
        <p>
          <strong>Yedirenk Derneği</strong> olarak bizler, bağışınızı sadece bir
          yardım olarak görmüyoruz.
        </p>
        <p>
          Sizler bir öğünün, bir sofranın ve bir duanın parçası oluyorsunuz.
        </p>
        <p>Çünkü bazen bir insana verebileceğimiz en güzel şey:</p>
        <p>
          <strong>“Sen yalnız değilsin.” diyebilmektir.</strong>
        </p>
        <ul>
          <li>
            Bir kişi yemek bedeli: <strong>200 TL</strong>
          </li>
          <li>
            Toplu yemeğinizin video ve görselleri için en az{" "}
            <strong>100 kişilik sipariş vermelisiniz.</strong> Video afişinde
            sizinle birlikte 5 isim daha yer alacaktır.
          </li>
          <li>
            Kendi şahsınıza ait bir video istiyorsanız en az{" "}
            <strong>500 kişilik yemek siparişi vermelisiniz.</strong>
          </li>
          <li>
            200 TL’nin altında ya da üstünde de bağışta bulunabilirsiniz.
          </li>
        </ul>
        <p>
          <strong>
            “Belki sizin için bir öğün; onlar için bugün sofraya konan tek yemek
            olabilir.”
          </strong>
        </p>
      </article>
    );
  }

  if (choice === 5) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>UN DAĞITIMI</h2>
        <p>Bazen bir ailenin ihtiyacı çok büyük değildir.</p>
        <p>Bir çuval un...</p>
        <p>
          Ama o un, bir evde hamurun ekmeğe, ekmek ise bir ailenin sofrasına
          dönüşür.
        </p>
        <p>
          <strong>Yedirenk Derneği</strong> olarak temel gıdaya ulaşmakta
          zorlanan Gazze halkının yanında sizlerle birlikte olmak istiyoruz.
        </p>
        <p>
          Sizlerin desteği ile temin edeceğimiz unları Gazzeli ailelere
          ulaştırmak, onların kendi ekmeklerini hazırlayabilmelerine katkı
          sunmak istiyoruz.
        </p>
        <p>
          Çünkü <strong>Yedirenk Derneği</strong> olarak sadece bir çuval un
          dağıtmıyoruz.
        </p>
        <p>
          <strong>
            Bir ailenin sofrasına ekmek olabilmenin yolunu açıyoruz.
          </strong>
        </p>
        <ul>
          <li>
            Bir çuval un bedeli: <strong>1.500 TL</strong>
          </li>
          <li>
            Afiş ve video istenir ise en az{" "}
            <strong>50 adet sipariş verilmelidir.</strong>
          </li>
          <li>
            Un dağıtımı için 1.500 TL’nin altında ya da üstünde bağış
            yapabilirsiniz.
          </li>
        </ul>
      </article>
    );
  }

  if (choice === 7) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>BEBEK MAMASI YARDIMI</h2>
        <p>
          Bir çocuk için dünya, güvenli bir evden ve sevgi dolu bir aileden
          ibaret olmalı...
        </p>
        <p>
          Ama Gazze’de savaşın ağır şartları altında büyümeye çalışan çocuklar,
          hayatlarının en temel ihtiyaçlarına dahi ulaşmakta zorlanabiliyor.
        </p>
        <p>
          Onların savaşın yükünü taşıması, açlıkla mücadele etmek zorunda
          kalması kabul edilemez.
        </p>
        <p>
          Bu nedenle <strong>Yedirenk Derneği</strong> olarak Gazze’deki
          çocuklara mama desteği sağlıyoruz.
        </p>
        <p>Siz kıymetli bağışçılarımızın desteğini bekliyoruz.</p>
        <ul>
          <li>
            <strong>1 adet 350 gr bebek maması: 1.150 TL</strong>
          </li>
          <li>
            Afiş ve video istenir ise en az{" "}
            <strong>50 adet sipariş verilmelidir.</strong>
          </li>
          <li>
            Destek için 1.150 TL’nin altında ya da üstünde de bağış
            yapabilirsiniz.
          </li>
        </ul>
        <p>
          <strong>
            Gazzeli çocukların savaşın değil, sevgimizin ve umudun içinde
            büyümesine vesile olalım.
          </strong>
        </p>
      </article>
    );
  }

  if (choice === 8) {
    return (
      <article className="gaza-selected-project-copy">
        <h2>GAZZE EĞİTİM ÇADIRI</h2>
        <p>
          Gazze’de yaşanan insani kriz, savaş ve yıkım maalesef çocukların
          eğitim hayatını da derinden etkiledi. Okulların zarar görmesi ve
          eğitim imkânlarının kısıtlıya uğraması,{" "}
          <strong>
            700–755 bin civarında çocuğun eğitimden uzak kalmasına neden oldu.
          </strong>
        </p>
        <p>
          Ancak çocukların{" "}
          <strong>öğrenme, hayal kurma ve geleceğe umutla bakma hakları</strong>{" "}
          devam ediyor.
        </p>
        <p>
          <strong>Yedirenk Derneği</strong> olarak Gazze’de çocukların yeniden
          eğitim görebilmeleri için <strong>eğitim çadırları kuruyoruz.</strong>
        </p>
        <p>
          Bu eğitim çadırı yalnızca bir derslik değil; çocukların yeniden kalem
          tutacağı, öğreneceği, arkadaşlarıyla bir araya geleceği ve geleceğe
          dair umutlarını canlı tutacağı bir eğitim yuvası olacak.
        </p>
        <h3>Eğitim Çadırı İçeriği</h3>
        <ul>
          <li>
            1 adet <strong>24 m² çadır</strong>
          </li>
          <li>
            10 adet <strong>öğrenci sıra ve masası</strong>
          </li>
          <li>
            1 adet <strong>yazı tahtası</strong>
          </li>
          <li>
            1 adet <strong>öğretmen masa ve sandalyesi</strong>
          </li>
          <li>
            Toplam <strong>30 öğrenci eğitim görebilecektir.</strong>
          </li>
        </ul>
        <p>
          <strong>1 adet eğitim çadırı bedeli: 13.800 $</strong>
        </p>
        <p>Bağışcının ismi eğitim çadırına verilecektir.</p>
        <p>Video ve görseller bağışcımıza ulaştırılacaktır.</p>
        <p>
          <strong>Not:</strong> Bu rakamın altında veya üstünde bağışta
          bulunabilirsiniz.
        </p>
        <p>
          <strong>
            “Bir çadır kurmak sadece bir alan oluşturmak değildir. Bir çocuğun
            yarınlarına ışık tutmaktır.”
          </strong>
        </p>
      </article>
    );
  }

  return (
    <article>
      <span className="zakat-section-kicker">GAZZE YARDIM PROJELERİ</span>
      <h2>Gazze’de İhtiyaçlara Birlikte Ulaşıyoruz</h2>
      {projectLongCopy["gazze-yardim"].map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  );
}

const gazzeQuantityDonationUnits = {
  "Ekmek Dağıtımı": {
    label: "Paket Adedi",
    title: "Paket",
    description: "paket ekmek",
  },
  "Gıda Kolisi": {
    label: "Koli Adedi",
    title: "Koli",
    description: "gıda kolisi",
  },
  "Sebze Kolisi": {
    label: "Koli Adedi",
    title: "Koli",
    description: "sebze kolisi",
  },
  "Toplu Yemek Dağıtımı": {
    label: "Yemek Adedi",
    title: "Kişilik Yemek",
    description: "kişilik sıcak yemek",
  },
  "Un Dağıtımı": {
    label: "Çuval Adedi",
    title: "Çuval",
    description: "çuval un",
  },
  "Bebek Maması Yardımı": {
    label: "Mama Adedi",
    title: "Adet Mama",
    description: "adet bebek maması",
  },
};

function ProjectDetailVerenel({ add }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const { slug } = useParams();
  const [params] = useSearchParams();
  const routeProject = projects.find((item) => item.slug === slug);
  const isWorshipDetail = ["cami", "mescid"].includes(slug);
  const camiProject = projects.find((item) => item.slug === "cami");
  const mescidProject = projects.find((item) => item.slug === "mescid");
  const worshipVariants = [
    ...(camiProject?.variants || []).map((variant) => [
      `${variant[0]} Cami`,
      ...variant.slice(1),
    ]),
    ...(mescidProject?.variants || []).map((variant) => [
      `${variant[0]} Mescid`,
      ...variant.slice(1),
    ]),
  ];
  const project =
    isWorshipDetail && routeProject
      ? {
          ...routeProject,
          category: "Cami & Mescid",
          title: "Cami & Mescid",
          variants: worshipVariants,
        }
      : routeProject;
  const routeRequestedChoice = Number(
    params.get("secim") ??
      (project?.slug === "adak-akika-nafile-kurban"
        ? Math.max(
            0,
            project.variants.findIndex((variant) => variant[0] === "Afrika"),
          )
        : 0),
  );
  const requestedChoice =
    isWorshipDetail && slug === "mescid"
      ? (camiProject?.variants?.length || 0) + routeRequestedChoice
      : routeRequestedChoice;
  const initialChoice =
      Number.isInteger(requestedChoice) &&
      requestedChoice >= 0 &&
      requestedChoice < (project?.variants?.length || 0)
        ? requestedChoice
        : 0,
    [choice, setChoice] = useState(initialChoice),
    first = project?.variants?.[initialChoice],
    [amount, setAmount] = useState(first?.[1] ? String(first[1]) : ""),
    [sponsorshipPeriod, setSponsorshipPeriod] = useState("monthly"),
    [customSponsorshipPeriod, setCustomSponsorshipPeriod] = useState("monthly"),
    [clothingQuantityMode, setClothingQuantityMode] = useState("single"),
    [sponsorshipCount, setSponsorshipCount] = useState(1),
    [donationQuantity, setDonationQuantity] = useState(1),
    [manualAmountOverride, setManualAmountOverride] = useState(false);
  if (!project)
    return (
      <main className="section">
        <div className="container">
          <h1>Proje bulunamadı</h1>
          <Link to="/projeler">Projelere dön</Link>
        </div>
      </main>
    );
  const variant = project.variants[choice],
    detailImage =
      ["gazze-yardim", "turkiye-projeleri"].includes(project.slug)
        ? projectCategoryCoverImage(project, variant, choice)
        : projectVariantImage(project, choice),
    currency = variant?.[2] || "TRY",
    monthlySponsorship = project.slug === "yetim-hamiligi",
    orphanClothing = project.slug === "yetim-giydirme",
    manualAmountProject = [
      "gazze-yardim",
      "turkiye-projeleri",
      "gida-kolisi",
      "toplu-yemek",
      "yetim-hamiligi",
      "yetim-giydirme",
    ].includes(project.slug),
    isQurbani = project.slug === "adak-akika-nafile-kurban",
    gazzeQuantityUnit =
      project.slug === "gazze-yardim"
        ? gazzeQuantityDonationUnits[variant?.[0]]
        : null,
    quantityDonation =
      ["gida-kolisi", "toplu-yemek"].includes(project.slug) ||
      Boolean(gazzeQuantityUnit),
    quantityUnit = gazzeQuantityUnit ||
      (project.slug === "gida-kolisi"
        ? {
            label: "Koli Sayısı",
            title: "Koli",
            description: "gıda kolisi",
          }
        : {
            label: "Kişi Sayısı",
            title: "Kişi",
            description: "kişilik sıcak yemek",
          }),
    hasRegionSelection = [
      "gida-kolisi",
      "toplu-yemek",
      "yetim-hamiligi",
      "yetim-giydirme",
    ].includes(project.slug),
    customSponsorship = sponsorshipPeriod === "other",
    effectiveSponsorshipPeriod = customSponsorship
      ? customSponsorshipPeriod
      : sponsorshipPeriod,
    sponsorshipMonths = effectiveSponsorshipPeriod === "yearly" ? 12 : 1,
    sponsorshipQuantity = customSponsorship
      ? Math.max(1, Math.floor(sponsorshipCount))
      : 1,
    customClothingQuantity = clothingQuantityMode === "other",
    clothingQuantity = customClothingQuantity
      ? Math.max(1, Math.floor(sponsorshipCount))
      : 1,
    sponsorshipUnitAmount = Number(variant?.[1] || 0) * sponsorshipMonths,
    donationUnitAmount = Number(variant?.[1] || 0),
    minimumAmount = 1,
    calculatedAmount = monthlySponsorship
      ? sponsorshipUnitAmount * sponsorshipQuantity
      : orphanClothing
        ? Number(variant?.[1] || 0) * clothingQuantity
        : quantityDonation
          ? donationUnitAmount * donationQuantity
          : isQurbani
            ? Number(variant?.[1] || 0)
            : Number(amount),
    finalAmount =
      manualAmountProject && manualAmountOverride
        ? Number(amount)
        : calculatedAmount,
    presets =
      manualAmountProject
        ? [50, 100, 250, 500]
        : project.slug === "su-kuyusu"
        ? [10, 25, 50, 125]
        : project.slug === "gida-kolisi"
          ? [100, 250, 500, 1000]
          : currency === "USD"
            ? [100, 250, 500, 1000]
            : [500, 1000, 2000, 5000];
  const breadcrumbCategory = projectDetailCategoryLabel(project);
  const breadcrumbVariant = projectDetailVariantLabel(project, variant);
  const showBreadcrumbVariant = breadcrumbCategory !== breadcrumbVariant;
  const selectVariant = (i) => {
    const index = Number(i);
    setChoice(index);
    setDonationQuantity(1);
    setManualAmountOverride(false);
    setAmount(
      project.variants[index]?.[1] ? String(project.variants[index][1]) : "",
    );
  };
  const donate = () => {
    if (!Number.isFinite(finalAmount) || finalAmount < minimumAmount) return;
    if (isQurbani && finalAmount !== Number(variant?.[1])) return;
    add({
      slug: `${project.slug}-${choice}-${finalAmount}-${monthlySponsorship ? sponsorshipQuantity : orphanClothing ? clothingQuantity : quantityDonation ? donationQuantity : 1}`,
      tag: project.category,
      title: quantityDonation
        ? `${project.title} · ${variant[0]} · ${donationQuantity} ${quantityUnit.title}`
        : isQurbani
          ? `${project.title} · ${variant[0]}`
          : monthlySponsorship
            ? `${project.title} · ${variant[0]} · ${
                sponsorshipPeriod === "yearly"
                  ? "Yıllık"
                  : customSponsorship
                    ? `Diğer · ${effectiveSponsorshipPeriod === "yearly" ? "Yıllık" : "Aylık"}`
                    : "Aylık"
              } · ${sponsorshipQuantity} Kişi`
            : orphanClothing
              ? `${project.title} · ${variant[0]} · ${clothingQuantity} Kişi`
              : `${project.title} · ${variant[0]}`,
      desc: quantityDonation
        ? `${donationQuantity} ${quantityUnit.description} desteği.`
        : monthlySponsorship
          ? `${sponsorshipQuantity} yetim için ${effectiveSponsorshipPeriod === "yearly" ? "yıllık" : "aylık"} hamilik desteği.`
          : orphanClothing
            ? `${clothingQuantity} yetim için giyim desteği.`
            : project.short,
      price: quantityDonation
        ? finalAmount / donationQuantity
        : monthlySponsorship
          ? finalAmount / sponsorshipQuantity
          : orphanClothing
            ? finalAmount / clothingQuantity
            : finalAmount,
      qty: quantityDonation
        ? donationQuantity
        : monthlySponsorship
          ? sponsorshipQuantity
          : orphanClothing
            ? clothingQuantity
            : 1,
      currency,
      raised: 0,
      image: detailImage,
      active: true,
    });
  };
  return (
    <main className="simple-project-page">
      <div className="container verenel-title">
        <div className="verenel-title-copy">
          <h1>{project.title}</h1>
          <div>
            <Link to={`/projeler/${project.slug}`}>{breadcrumbCategory}</Link>
            {showBreadcrumbVariant && (
              <>
                <ChevronRight />
                <span>{breadcrumbVariant}</span>
              </>
            )}
          </div>
        </div>
        <PageReturnNavigation />
      </div>
      <section
        className={`container simple-project-top verenel-project-top${
          project.slug === "su-kuyusu" ? " water-well-project-top" : ""
        }${["gazze-yardim", "turkiye-projeleri"].includes(project.slug) ? " gazze-poster-project-top" : ""}`}
      >
        <div className="simple-project-visual">
          <Media
            src={
              project.slug === "su-kuyusu"
                ? project.image
                : detailImage
            }
            alt={project.title}
          />
          {!["gazze-yardim", "turkiye-projeleri"].includes(project.slug) && (
            <div className="simple-image-brand">
              <span>{projectDetailBadgeLabel(project, variant)}</span>
            </div>
          )}
        </div>
        <aside className="simple-donation-form verenel-donation-form">
          {project.slug === "zekat" && (
            <Link className="zakat-calc-link" to="/zekat-hesapla">
              Zekâtını Hesapla <Calculator />
            </Link>
          )}
          <h3>Bağış Yap</h3>
          {(project.variants.length > 1 || project.slug === "gida-kolisi") && (
            <label>
              {hasRegionSelection ? "Bölge Seçimi" : "Seçenekler"}{" "}
              <em>*</em>
              <select
                required
                value={choice}
                onChange={(e) => selectVariant(e.target.value)}
              >
                {(["gazze-yardim", "turkiye-projeleri"].includes(project.slug)
                  ? project.slug === "turkiye-projeleri" &&
                    ["Yetim Hamiliği", "Yetim Giyim"].includes(variant?.[0])
                    ? project.variants
                        .map((v, i) => [v, i])
                        .filter(([v]) =>
                          ["Yetim Hamiliği", "Yetim Giyim"].includes(v[0]),
                        )
                    : [[variant, choice]]
                  : project.variants.map((v, i) => [v, i])
                ).map(([v, i]) => (
                  <option
                    key={v[0]}
                    value={i}
                    disabled={
                      !v[1] &&
                      !["gazze-yardim", "turkiye-projeleri"].includes(project.slug)
                    }
                  >
                    {v[0]}
                    {project.slug !== "gazze-yardim" &&
                      (v[1]
                        ? ` — ${money(v[1], v[2])}`
                        : project.slug !== "turkiye-projeleri"
                          ? " — Fiyat yakında"
                          : "")}
                  </option>
                ))}
              </select>
            </label>
          )}
          {quantityDonation && (
            <label>
              {quantityUnit.label} <em>*</em>
              <div className="donation-quantity-counter">
                <button
                  type="button"
                  aria-label="Sayacı azalt"
                  disabled={donationQuantity <= 1}
                  onClick={() => {
                    setDonationQuantity((current) => Math.max(1, current - 1));
                    setManualAmountOverride(false);
                  }}
                >
                  <Minus />
                </button>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  aria-label={quantityUnit.label}
                  value={donationQuantity}
                  onChange={(event) => {
                    setDonationQuantity(
                      Math.max(1, Math.floor(Number(event.target.value) || 1)),
                    );
                    setManualAmountOverride(false);
                  }}
                />
                <button
                  type="button"
                  aria-label="Sayacı artır"
                  onClick={() => {
                    setDonationQuantity((current) => current + 1);
                    setManualAmountOverride(false);
                  }}
                >
                  <Plus />
                </button>
              </div>
            </label>
          )}
          {monthlySponsorship && (
            <>
              <label>
                Hamilik Planı <em>*</em>
                <div
                  className="sponsorship-plan-options"
                  role="radiogroup"
                  aria-label="Hamilik Planı"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={sponsorshipPeriod === "monthly"}
                    className={sponsorshipPeriod === "monthly" ? "active" : ""}
                    onClick={() => {
                      setSponsorshipPeriod("monthly");
                      setManualAmountOverride(false);
                    }}
                  >
                    <strong>Aylık</strong>
                    <span>{money(Number(variant?.[1] || 0), currency)}</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={sponsorshipPeriod === "yearly"}
                    className={sponsorshipPeriod === "yearly" ? "active" : ""}
                    onClick={() => {
                      setSponsorshipPeriod("yearly");
                      setManualAmountOverride(false);
                    }}
                  >
                    <strong>Yıllık</strong>
                    <span>
                      {money(Number(variant?.[1] || 0) * 12, currency)}
                    </span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={customSponsorship}
                    className={customSponsorship ? "active" : ""}
                    onClick={() => {
                      setSponsorshipPeriod("other");
                      setManualAmountOverride(false);
                    }}
                  >
                    <strong>Diğer</strong>
                    <span>Kişi seç</span>
                  </button>
                </div>
              </label>
              {customSponsorship && (
                <>
                  <label>
                    Kişi Sayısı <em>*</em>
                    <div className="donation-amount-input sponsorship-count-input">
                      <input
                        aria-label="Kişi Sayısı"
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={sponsorshipCount}
                        onChange={(e) => {
                          setSponsorshipCount(
                            Math.max(
                              1,
                              Math.floor(Number(e.target.value) || 1),
                            ),
                          );
                          setManualAmountOverride(false);
                        }}
                      />
                      <i>Kişi</i>
                    </div>
                  </label>
                  <label>
                    Hamilik Süresi <em>*</em>
                    <select
                      aria-label="Hamilik Süresi"
                      value={customSponsorshipPeriod}
                      onChange={(e) => {
                        setCustomSponsorshipPeriod(e.target.value)
                        setManualAmountOverride(false);
                      }}
                    >
                      <option value="monthly">Aylık</option>
                      <option value="yearly">Yıllık</option>
                    </select>
                  </label>
                </>
              )}
            </>
          )}
          {orphanClothing && (
            <>
              <label>
                Destek Adedi <em>*</em>
                <div
                  className="sponsorship-plan-options orphan-clothing-quantity-options"
                  role="radiogroup"
                  aria-label="Yetim Giyim Destek Adedi"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={clothingQuantityMode === "single"}
                    className={
                      clothingQuantityMode === "single" ? "active" : ""
                    }
                    onClick={() => {
                      setClothingQuantityMode("single");
                      setManualAmountOverride(false);
                    }}
                  >
                    <strong>1 Kişi</strong>
                    <span>{money(Number(variant?.[1] || 0), currency)}</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={customClothingQuantity}
                    className={customClothingQuantity ? "active" : ""}
                    onClick={() => {
                      setClothingQuantityMode("other");
                      setManualAmountOverride(false);
                    }}
                  >
                    <strong>Diğer</strong>
                    <span>Kişi seç</span>
                  </button>
                </div>
              </label>
              {customClothingQuantity && (
                <label>
                  Kişi Sayısı <em>*</em>
                  <div className="donation-amount-input sponsorship-count-input">
                    <input
                      aria-label="Kişi Sayısı"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={sponsorshipCount}
                      onChange={(e) => {
                        setSponsorshipCount(
                          Math.max(1, Math.floor(Number(e.target.value) || 1)),
                        );
                        setManualAmountOverride(false);
                      }}
                    />
                    <i>Kişi</i>
                  </div>
                </label>
              )}
            </>
          )}
          <label>
            {monthlySponsorship
              ? "Toplam Hamilik Tutarı"
              : orphanClothing
                ? "Toplam Giyim Tutarı"
                : quantityDonation
                  ? "Toplam Bağış Tutarı"
                  : "Bağış Tutarı"}
            <div className="donation-amount-input">
              <input
                aria-label="Bağış Tutarı"
                type="number"
                min="0"
                step="50"
                inputMode="decimal"
                placeholder="0,00"
                value={
                  manualAmountProject && manualAmountOverride
                    ? amount
                    : monthlySponsorship || orphanClothing || quantityDonation
                    ? finalAmount
                    : amount
                }
                readOnly={
                  isQurbani ||
                  ((monthlySponsorship || orphanClothing || quantityDonation) &&
                    !manualAmountProject)
                }
                onChange={(e) => {
                  if (manualAmountProject) {
                    setManualAmountOverride(true);
                    setAmount(e.target.value);
                  } else if (
                    !monthlySponsorship &&
                    !orphanClothing &&
                    !quantityDonation &&
                    !isQurbani
                  ) {
                    setAmount(e.target.value);
                  }
                }}
              />
              <i>{currency === "USD" ? "$" : "₺"}</i>
            </div>
          </label>
          {(manualAmountProject ||
            (!monthlySponsorship &&
              !orphanClothing &&
              !quantityDonation &&
              !isQurbani)) && (
              <div className="quick-amounts">
                {presets.map((x) => (
                  <button
                    type="button"
                    className={finalAmount === x ? "active" : ""}
                    onClick={() => {
                      setAmount(String(x));
                      if (manualAmountProject) setManualAmountOverride(true);
                    }}
                    key={x}
                  >
                    {money(x, currency)}
                  </button>
                ))}
              </div>
            )}
          <button
            disabled={finalAmount < minimumAmount}
            className="donate-now"
            onClick={donate}
          >
            BAĞIŞ YAP
          </button>
        </aside>
      </section>
      {isQurbani && (
        <section className="container simple-project-description">
          <article>
            <h2>Bir Lokma Et Neden Bu Kadar Kıymetli?</h2>
            <p>
              Kuraklık, yoksulluk ve geçim imkânlarının sınırlı olması nedeniyle
              dünyanın birçok bölgesinde aileler ete düzenli olarak ulaşmakta
              güçlük çekiyor. Bazı aileler için et, günlük sofranın bir parçası
              değil; uzun süre beklenen kıymetli bir gıda.
            </p>
            <p>
              Bu nedenle ulaştırılan kurban etleri yalnızca bir öğünlük destek
              olarak görülmüyor. Bazı aileler kendilerine ulaşan etleri
              kurutarak veya farklı yöntemlerle muhafaza ederek daha uzun süre
              tüketiyor.
            </p>
            <p>
              Dünyanın bir tarafında zaman zaman israf edilen et, başka bir
              coğrafyada bir ailenin uzun zamandır beklediği sofraya
              dönüşebiliyor.
            </p>
            <QurbaniImpactCards />
            <QurbaniProcessCards />
          </article>
        </section>
      )}
      {project.slug === "zekat" && choice === 0 && (
        <section className="container simple-project-description">
          <article className="zakat-detail-content">
            <ZakatDetailInformation />
          </article>
        </section>
      )}
      {project.slug === "su-kuyusu" && (
        <section className="container simple-project-description">
          <article>
            <h2>Derinden Gelen Hayat</h2>
            <p>
              Su, hayatın en temel ihtiyaçlarından biri. Yedirenk Derneği olarak su
              kuyusu çalışmalarımızı, sahada yapılan ihtiyaç ve yer tespitleri
              doğrultusunda gerçekleştiriyoruz.
            </p>
            <p>
              Bağışçımızın tercih ettiği ülke ve kuyu türüne göre süreç
              planlanıyor; kuyuya verilecek isim ve afiş hazırlanarak onaya
              sunuluyor. Çalışma tamamlandığında kuyunun video ve görselleri
              bağışçımızla paylaşılıyor.
            </p>
            <WaterWellFeatures />
            <WaterWellProcess />
          </article>
        </section>
      )}
      {project.slug === "gazze-yardim" && (
        <section className="container simple-project-description">
          <GazaSelectedProjectDescription choice={choice} />
        </section>
      )}
      {project.slug === "turkiye-projeleri" && (
        <section className="container simple-project-description">
          <TurkeySelectedProjectDescription choice={choice} />
        </section>
      )}
      {project.slug === "gida-kolisi" && (
        <section className="container simple-project-description">
          <article>
            <span className="zakat-section-kicker">
              NEDEN GIDA KOLİSİ YARDIMINA İHTİYAÇ VAR?
            </span>
            <h2>Bir Sofranın Temel İhtiyacına Destek</h2>
            <p>
              Yardıma muhtaç olan tüm ülkelerde kuraklık, zorunlu göç,
              yoksulluk ve işsizlik gibi sorunlar milyonlarca insanın gıdaya
              erişimini zorlaştırmaktadır.
            </p>
            <p>
              Düzenli geliri veya yeterli imkânı bulunmayan aileler için günlük
              gıda ihtiyacını karşılamak dahi büyük bir mücadeleye
              dönüşebiliyor. Gıda kolisi yardımlarıyla ihtiyaç sahibi ailelerin
              temel gıda ihtiyaçlarına destek oluyor, sofralarına paylaşmanın ve
              dayanışmanın bereketini taşıyoruz.
            </p>
            <p>
              Bağışınızı yaparken dağıtım bölgesini <strong>Afrika</strong>,{" "}
              <strong>Asya</strong> ve <strong>Türkiye</strong> olarak
              seçebilirsiniz. Seçiminiz ödeme özetinde açıkça gösterilir ve
              koliniz tercih ettiğiniz bölgede ihtiyaç sahibi bir aileye
              ulaştırılır.
            </p>
            <ul>
              <li>
                Bir adet gıda kolisi <strong>2.000 TL’dir.</strong>
              </li>
              <li>
                Video ve görseller için en az{" "}
                <strong>50 adet sipariş verilmelidir.</strong>
              </li>
              <li>
                2.000 TL’nin altında veya üstünde de bağışta bulunabilirsiniz.
              </li>
            </ul>
            <FoodParcelImpactCards />
          </article>
        </section>
      )}
      {project.slug === "yetim-hamiligi" && (
        <section className="container simple-project-description">
          <article>
            <span className="zakat-section-kicker">
              NEDEN YETİM DESTEĞİNE İHTİYAÇ VAR?
            </span>
            <h2>Bir Çocuğun Yanında Olmak</h2>
            <p>
              Dünya üzerinde yaklaşık 152 milyon yetim çocuk bulunuyor. Birçoğu,
              henüz çocukluğunu yaşarken hayatın ağır sorumluluklarıyla karşı
              karşıya kalıyor.
            </p>
            <p>
              Yedirenk Derneği olarak yetim çocukların güvenli, mutlu ve umut dolu bir
              yaşam sürmelerine destek olmayı; temel ihtiyaçlarından
              eğitimlerine kadar hayatlarının farklı alanlarında yanlarında
              olmayı önemsiyoruz.
            </p>
            <p>
              Yetim hamiliği bağışınızda destek bölgesini{" "}
              <strong>Afrika</strong>, <strong>Asya</strong> veya{" "}
              <strong>Türkiye</strong> olarak seçebilirsiniz. Seçilen bölge
              ödeme özetinde açıkça gösterilir.
            </p>
            <OrphanSupportImpactCards />
          </article>
        </section>
      )}
      {project.slug === "yetim-giydirme" && (
        <section className="container simple-project-description">
          <article>
            <span className="zakat-section-kicker">
              NEDEN YETİM GİYDİRME DESTEĞİNE İHTİYAÇ VAR?
            </span>
            <h2>Bir Çocuğun Yüzünde Tebessüm Olmak</h2>
            <p>
              Her çocuk yeni bir kıyafetin sevincini yaşamayı, arkadaşları gibi
              güzel giyinmeyi ve kendisini değerli hissetmeyi hak eder. Ancak
              dünyanın farklı bölgelerinde yaşayan birçok yetim çocuk, en temel
              ihtiyaçlarını dahi karşılamakta zorlanıyor.
            </p>
            <p>
              Yedirenk Derneği olarak ihtiyaç sahibi yetim çocuklara kıyafet
              ulaştırarak onların yeni kıyafetlere kavuşmasına ve yüzlerinde
              küçük de olsa bir tebessüm oluşmasına vesile olmayı amaçlıyoruz.
              Yapılan her destek yalnızca bir kıyafet yardımı değil; aynı
              zamanda bir çocuğa hatırlandığını, değerli olduğunu ve yalnız
              olmadığını hissettiren bir iyiliktir.
            </p>
            <p>
              Yetim giydirme bağışınızda destek bölgesini{" "}
              <strong>Afrika</strong>, <strong>Asya</strong> veya{" "}
              <strong>Türkiye</strong> olarak seçebilirsiniz. Seçilen bölge
              ödeme özetinde açıkça gösterilir.
            </p>
            <p className="orphan-clothing-callout">
              <em>Bir yetimin sevincine ortak olun.</em>
            </p>
            <blockquote className="orphan-clothing-hadith">
              <p>
                “Ben ve yetime kol kanat geren kimse cennette şöyle yan yana
                olacağız.”
              </p>
              <p>
                Hz.Peygamber (sav) işaret parmağı ile orta parmağını göstererek
                bu iki parmağın yakınlığını ifade etmiştir.
              </p>
              <cite>Buhari,Talak:25 Lideb:24</cite>
            </blockquote>
            <OrphanClothingImpactCards />
          </article>
        </section>
      )}
      {project.slug === "medrese" && (
        <section className="container simple-project-description">
          <article>
            <span className="zakat-section-kicker">
              NEDEN MEDRESEYE İHTİYAÇ VAR?
            </span>
            <h2>İlimle Güçlenen Nesiller</h2>
            <p>
              Afrika ve Asya’nın birçok bölgesinde medreseler yalnızca dini
              eğitimin verildiği yapılar değildir. Eğitim imkânlarının sınırlı
              olduğu yerlerde çocukların düzenli bir öğrenme ortamına
              kavuşmasına ve temel değerlerle yetişmesine katkı sağlar.
            </p>
            <p>
              Medreselerde Kur’an-ı Kerim, temel dini bilgiler, güzel ahlak,
              sorumluluk ve dayanışma gibi değerler öğretilir. Böylece
              öğrencilerin hem bilgiyle hem de değerleriyle güçlenen bireyler
              olarak yetişmeleri hedeflenir.
            </p>
            <MadrasaProjectDetails
              country={variant?.[0]}
              price={variant?.[1]}
              currency={variant?.[2]}
            />
            <MadrasaImpactCards />
          </article>
        </section>
      )}
      {["cami", "mescid"].includes(project.slug) && (
        <section className="container simple-project-description">
          <article>
            <span className="zakat-section-kicker">
              NEDEN CAMİ VE MESCİDE İHTİYAÇ VAR?
            </span>
            <h2>Bir Saf Daha</h2>
            <p>
              Cami ve mescitler yalnızca ibadet edilen yapılar değil; aynı
              zamanda insanların bir araya geldiği, dayanışmanın güçlendiği ve
              ortak değerlerin yaşatıldığı önemli merkezlerdir.
            </p>
            <p>
              Afrika başta olmak üzere dünyanın farklı bölgelerinde, özellikle
              kırsal yerleşimlerde ibadetlerini düzenli ve güvenli bir ortamda
              gerçekleştirebilecekleri cami veya mescidi bulunmayan topluluklar
              yaşamaktadır.
            </p>
            <p>
              Cami ve mescit çalışmalarıyla bu bölgelerde kalıcı bir ibadet
              alanı oluşturulmasına ve insanların ortak bir mekânda buluşmasına
              vesile oluyoruz.
            </p>
            <WorshipProjectDetails
              projectSlug={project.slug}
              country={variant?.[0]}
              price={variant?.[1]}
              currency={variant?.[2]}
            />
            <div
              className="mosque-hadith-grid"
              aria-label="Cami ve mescitlerle ilgili hadisler"
            >
              <blockquote>
                <p>
                  “Kim Allah'ın rızasını talep ederek bir mescit inşa ederse,
                  Allah ona cennette bir köşk inşa eder.”
                </p>
                <cite>Müslim, Mesâcid 24</cite>
              </blockquote>
              <blockquote>
                <p>
                  “Allah'ın beldelerinde Allah'a en sevimli yerler
                  mescitlerdir.”
                </p>
                <cite>Müslim, Mesâcid 288</cite>
              </blockquote>
            </div>
            <MosqueImpactCards />
          </article>
        </section>
      )}
      {project.slug === "toplu-yemek" && (
        <section className="container simple-project-description">
          <article className="community-meal-story">
            <span className="zakat-section-kicker">TOPLU YEMEK</span>
            <h2>Bir Sofra, Binlerce Dua</h2>
            <p>
              Uzaklarda bir yerde, belki de bugün bir anne çocuklarına ne
              yedireceğini düşünüyor. Bir baba, ailesinin sofrasına sıcak bir
              yemek koyabilmenin çaresini arıyor. Bir çocuk ise belki de uzun
              zamandır doyasıya bir öğün bekliyor.
            </p>
            <p>
              Biz, <strong>iyiliğin mesafesi olmaz</strong> diyerek yurt
              dışındaki ihtiyaç sahibi kardeşlerimize sıcak yemek sofraları
              kuruyoruz.
            </p>
            <p>
              Siz de bir bağışla bu sofralardan birine ortak olun. Belki sizin
              bağışınız bir çocuğun karnını doyuracak, bir annenin yüzünü
              güldürecek, bir babanın yüreğine umut olacak.
            </p>
            <ul>
              <li>
                Bir adet toplu yemek; Somali, Bangladeş, Çad, Afganistan ve
                Yemen için <strong>150 TL’dir.</strong>
              </li>
              <li>
                Tanzanya ve Etiyopya için <strong>180 TL’dir.</strong>
              </li>
              <li>
                Video ve görseller için en az{" "}
                <strong>100 kişilik sipariş verilmelidir.</strong>
              </li>
              <li>
                180 TL’nin altında veya üstünde de bağışta bulunabilirsiniz.
              </li>
            </ul>
            <blockquote className="community-meal-quote">
              Siz bir sofraya vesile olun, onlar size dualarıyla karşılık
              versin.
            </blockquote>
            <div className="community-meal-promises">
              <p>🤲 Bir öğün yemek ikramına destek olun.</p>
              <p>❤️ Bir sofrada sizin de payınız olsun.</p>
            </div>
            <p className="community-meal-final-line">
              Bir tabak yemek, bir tebessüm, binlerce dua…
            </p>
            <CommunityMealSupportCards />
          </article>
        </section>
      )}
      <section className="simple-related">
        <div className="container">
          <h2>Bunlar da ilginizi çekebilir</h2>
          <div>
            {projects
              .filter((x) => x.slug !== project.slug)
              .slice(0, 3)
              .map((x) => (
                <Link to={`/projeler/${x.slug}`} key={x.slug}>
                  <img src={x.image} alt="" />
                  <b>{x.title}</b>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function AccountPage() {
  const { content } = useCms();
  const page = getSitePage(content, "account");
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(
      location.pathname === "/kayit" ? "register" : "login",
    ),
    [busy, setBusy] = useState(false),
    [sessionLoading, setSessionLoading] = useState(import.meta.env.PROD),
    [showPassword, setShowPassword] = useState(false),
    [message, setMessage] = useState(""),
    [user, setUser] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("yedirenk-user-session"));
      } catch {
        return null;
      }
    });
  useEffect(() => {
    setMode(location.pathname === "/kayit" ? "register" : "login");
    setMessage("");
    setShowPassword(false);
  }, [location.pathname]);
  useEffect(() => {
    if (import.meta.env.DEV) return;
    let active = true;
    fetch("/api/account/me", { credentials: "same-origin" })
      .then(async (response) =>
        response.ok ? (await response.json()).user : null,
      )
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setSessionLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (
        mode === "register" &&
        String(data.password) !== String(data.confirmPassword)
      )
        throw new Error("Şifreler birbiriyle eşleşmiyor.");
      if (import.meta.env.DEV) {
        const users = JSON.parse(
            localStorage.getItem("yedirenk-dev-users") || "[]",
          ),
          email = String(data.email).trim().toLowerCase(),
          hash = await localPasswordHash(String(data.password));
        if (mode === "register") {
          if (users.some((x) => x.email === email))
            throw new Error("Bu e-posta adresiyle daha önce kayıt olunmuş.");
          if (String(data.password).length < 8)
            throw new Error("Şifre en az 8 karakter olmalıdır.");
          const next = {
            id: crypto.randomUUID(),
            email,
            firstName: String(data.firstName).trim(),
            lastName: String(data.lastName).trim(),
            phone: String(data.phone).trim(),
            passwordHash: hash,
            createdAt: Date.now(),
            lastLoginAt: Date.now(),
            active: true,
          };
          localStorage.setItem(
            "yedirenk-dev-users",
            JSON.stringify([...users, next]),
          );
          const safe = { ...next };
          delete safe.passwordHash;
          localStorage.setItem("yedirenk-user-session", JSON.stringify(safe));
          setUser(safe);
          setMessage("Kaydınız oluşturuldu ve giriş yaptınız.");
        } else {
          const found = users.find(
            (x) => x.email === email && x.passwordHash === hash && x.active,
          );
          if (!found) throw new Error("E-posta veya şifre hatalı.");
          found.lastLoginAt = Date.now();
          localStorage.setItem("yedirenk-dev-users", JSON.stringify(users));
          const safe = { ...found };
          delete safe.passwordHash;
          localStorage.setItem("yedirenk-user-session", JSON.stringify(safe));
          setUser(safe);
          setMessage("Başarıyla giriş yaptınız.");
        }
      } else {
        const r = await fetch(`/api/account/${mode}`, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }),
          body = await r.json();
        if (!r.ok) throw new Error(body.message || "İşlem tamamlanamadı.");
        setUser(body.user);
        setMessage(
          mode === "register"
            ? "Kaydınız oluşturuldu ve giriş yaptınız."
            : "Başarıyla giriş yaptınız.",
        );
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    if (import.meta.env.PROD)
      await fetch("/api/account/logout", {
        method: "POST",
        credentials: "same-origin",
      }).catch(() => {});
    localStorage.removeItem("yedirenk-user-session");
    setUser(null);
    setMode("login");
    setMessage("Çıkış yapıldı.");
    navigate("/giris", { replace: true });
  };
  return (
    <main className="account-page-v2">
      <section className="container account-layout-v2">
        <aside className="account-showcase">
          <div className="account-showcase-mark">
            <HeartHandshake />
          </div>
          <span>YEDİRENK HESABIM</span>
          <h1>
            İyiliğinizi tek hesapta <em>kolayca yönetin.</em>
          </h1>
          <p>{page.sectionText}</p>
          <ul>
            <li>
              <ShieldCheck />
              <span>
                <b>Güvenli oturum</b>
                Şifreniz korumalı olarak saklanır.
              </span>
            </li>
            <li>
              <Check />
              <span>
                <b>Daha hızlı bağış</b>
                İletişim bilgileriniz ödeme formuna aktarılır.
              </span>
            </li>
            <li>
              <CircleUserRound />
              <span>
                <b>Tek noktadan erişim</b>
                Hesap bilgileriniz oturumunuz boyunca korunur.
              </span>
            </li>
          </ul>
        </aside>

        <section className="account-card-v2">
          {sessionLoading ? (
            <div className="account-session-loading">
              <LoaderCircle />
              <p>Oturumunuz kontrol ediliyor…</p>
            </div>
          ) : user ? (
            <div className="account-dashboard">
              <div className="account-avatar">
                <CircleUserRound />
              </div>
              <span>HOŞ GELDİNİZ</span>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              {message && (
                <p className="account-dashboard-message">{message}</p>
              )}
              <dl>
                <div>
                  <dt>E-posta</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>{user.phone}</dd>
                </div>
              </dl>
              <Link className="btn orange" to="/projeler">
                Bağış projelerine git <ArrowRight />
              </Link>
              <button type="button" className="account-logout" onClick={logout}>
                Güvenli çıkış yap
              </button>
            </div>
          ) : (
            <>
              <header className="account-card-heading">
                <span>
                  {mode === "login" ? "TEKRAR HOŞ GELDİNİZ" : "ARAMIZA KATILIN"}
                </span>
                <h2>
                  {mode === "login"
                    ? "Hesabınıza giriş yapın"
                    : "Yeni hesap oluşturun"}
                </h2>
                <p>
                  {mode === "login"
                    ? "Bilgilerinizi girerek hesabınıza güvenle erişin."
                    : "Birkaç adımda hesabınızı oluşturup bağış yapmaya başlayın."}
                </p>
              </header>
              <nav className="account-tabs-v2" aria-label="Hesap işlemleri">
                <Link className={mode === "login" ? "active" : ""} to="/giris">
                  Giriş Yap
                </Link>
                <Link
                  className={mode === "register" ? "active" : ""}
                  to="/kayit"
                >
                  Kayıt Ol
                </Link>
              </nav>
              <form className="account-form-v2" onSubmit={submit}>
                {mode === "register" && (
                  <div className="account-field-grid">
                    <label>
                      <span>Ad</span>
                      <input
                        name="firstName"
                        required
                        maxLength="80"
                        autoComplete="given-name"
                        placeholder="Adınız"
                      />
                    </label>
                    <label>
                      <span>Soyad</span>
                      <input
                        name="lastName"
                        required
                        maxLength="80"
                        autoComplete="family-name"
                        placeholder="Soyadınız"
                      />
                    </label>
                    <label className="wide">
                      <span>Telefon</span>
                      <input
                        name="phone"
                        type="tel"
                        required
                        maxLength="30"
                        autoComplete="tel"
                        placeholder="05XX XXX XX XX"
                      />
                    </label>
                  </div>
                )}
                <label>
                  <span>E-posta adresi</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength="254"
                    autoComplete="email"
                    placeholder="ornek@eposta.com"
                  />
                </label>
                <label>
                  <span>Şifre</span>
                  <div className="account-password-field">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength="8"
                      maxLength="128"
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                      placeholder="En az 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </label>
                {mode === "register" && (
                  <>
                    <label>
                      <span>Şifre tekrar</span>
                      <input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        maxLength="128"
                        autoComplete="new-password"
                        placeholder="Şifrenizi tekrar girin"
                      />
                    </label>
                    <label className="account-consent">
                      <input name="accountConsent" type="checkbox" required />
                      <span>
                        Kişisel verilerimin hesap oluşturma amacıyla işlenmesini
                        kabul ediyorum.
                      </span>
                    </label>
                  </>
                )}
                {message && (
                  <p className="account-message" role="alert">
                    {message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="account-submit"
                >
                  {busy
                    ? "İşleniyor…"
                    : mode === "login"
                      ? "Giriş Yap"
                      : "Hesabımı Oluştur"}
                  <ArrowRight />
                </button>
              </form>
              <p className="account-switch-copy">
                {mode === "login"
                  ? "Henüz hesabınız yok mu?"
                  : "Zaten hesabınız var mı?"}{" "}
                <Link to={mode === "login" ? "/kayit" : "/giris"}>
                  {mode === "login" ? "Kayıt olun" : "Giriş yapın"}
                </Link>
              </p>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

const panelDonationCodes = {
  "adak-akika-nafile-kurban": ["KURBAN", null],
  cami: ["CAMI", "CAMI_STANDART"],
  medrese: ["MEDRESE", "MEDRESE_STANDART"],
  mescid: ["MESCID", "MESCID_STANDART"],
  "su-kuyusu": ["SU_KUYUSU", "SU_KUYUSU_STANDART"],
  "gida-kolisi": ["GIDA_KOLISI", "GIDA_KOLISI_STANDART"],
  "toplu-yemek": ["TOPLU_YEMEK", "TOPLU_YEMEK_STANDART"],
  "gazze-yardim": ["GAZZE_YARDIM", "GAZZE_YARDIM_STANDART"],
  "yetim-giydirme": ["YETIM_GIYDIRME", "YETIM_GIYDIRME_STANDART"],
  "yetim-hamiligi": ["YETIM_HAMILIGI", "YETIM_HAMILIGI_STANDART"],
  zekat: ["ZEKAT", "ZEKAT_STANDART"],
};

function panelDonationItem(item) {
  const campaignCode =
    Object.keys(panelDonationCodes).find(
      (code) => item.slug === code || item.slug.startsWith(`${code}-`),
    ) || "genel";
  const [donationTypeCode, donationGroupCode] = panelDonationCodes[
    campaignCode
  ] || ["GENEL_BAGIS", "GENEL_BAGIS_STANDART"];
  return {
    campaignCode,
    donationTypeCode,
    donationGroupCode,
    title: item.title,
    quantity: item.qty,
    unitPrice: toTRY(item.price, item.currency || "TRY"),
  };
}

function Cart({ items, setItems, onClose, onNavigate, exchangeRateInfo }) {
  const total = items.reduce(
      (n, x) => n + toTRY(x.price * x.qty, x.currency || "TRY"),
      0,
    ),
    totalLabel = money(total, "TRY");
  const qurbaniItem = items.find((item) =>
      item.slug.startsWith("adak-akika-nafile-kurban"),
    ),
    qurbaniCountry = qurbaniItem?.title.split("·").at(-1)?.trim(),
    descriptionPlaceholder = qurbaniItem
      ? `Kurban türünü (Adak, Akika veya Nafile) ve gönderilmesini istediğiniz ülkeyi belirtin. Örn: Akika — ${qurbaniCountry || "Yemen"}`
      : "Bağışınızla ilgili açıklamanızı yazın";
  const [checkout] = useState(true),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(""),
    [receiptFile, setReceiptFile] = useState(null),
    [selectedAccountCode, setSelectedAccountCode] = useState("TRY"),
    [copiedIban, setCopiedIban] = useState(""),
    [copiedOwner, setCopiedOwner] = useState(false),
    [copiedAccountNumber, setCopiedAccountNumber] = useState(false),
    [kvkkOpen, setKvkkOpen] = useState(false);
  const selectedAccount =
    bankAccounts.find((account) => account.code === selectedAccountCode) ||
    bankAccounts[0];
  const transferAmount = total / (exchangeRates[selectedAccount.code] || 1);
  const transferAmountLabel = money(transferAmount, selectedAccount.code);
  const transferDescription = `${items[0]?.title || "Bağış"} - Adınız Soyadınız - Telefon Numaranız`;
  const copyTransferIban = async () => {
    const compactIban = selectedAccount.iban.replace(/\s/g, "");
    try {
      await navigator.clipboard?.writeText(compactIban);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = compactIban;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopiedIban(selectedAccount.code);
    setTimeout(() => setCopiedIban(""), 1800);
  };
  const copyTransferOwner = async () => {
    try {
      await navigator.clipboard?.writeText(selectedAccount.owner);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = selectedAccount.owner;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopiedOwner(true);
    setTimeout(() => setCopiedOwner(false), 1800);
  };
  const copyTransferAccountNumber = async () => {
    try {
      await navigator.clipboard?.writeText(selectedAccount.accountNumber);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = selectedAccount.accountNumber;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopiedAccountNumber(true);
    setTimeout(() => setCopiedAccountNumber(false), 1800);
  };
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    description: "",
    consent: false,
    website: "",
  });
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    const apply = (user) =>
      user &&
      setForm((current) => ({
        ...current,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    if (import.meta.env.DEV) {
      try {
        apply(JSON.parse(localStorage.getItem("yedirenk-user-session")));
      } catch {}
    } else
      fetch("/api/account/me", { credentials: "same-origin" })
        .then((r) => (r.ok ? r.json() : null))
        .then((x) => apply(x?.user))
        .catch(() => {});
  }, []);
  const districts = {
    İstanbul: [
      "Adalar",
      "Ataşehir",
      "Bağcılar",
      "Bakırköy",
      "Başakşehir",
      "Beşiktaş",
      "Beykoz",
      "Beyoğlu",
      "Esenler",
      "Eyüpsultan",
      "Fatih",
      "Kadıköy",
      "Kartal",
      "Maltepe",
      "Pendik",
      "Sarıyer",
      "Şişli",
      "Üsküdar",
      "Zeytinburnu",
    ],
    Ankara: [
      "Altındağ",
      "Çankaya",
      "Etimesgut",
      "Gölbaşı",
      "Keçiören",
      "Mamak",
      "Sincan",
      "Yenimahalle",
    ],
    İzmir: [
      "Balçova",
      "Bayraklı",
      "Bornova",
      "Buca",
      "Çiğli",
      "Gaziemir",
      "Karşıyaka",
      "Konak",
    ],
    Bursa: ["Gemlik", "İnegöl", "Mudanya", "Nilüfer", "Osmangazi", "Yıldırım"],
    Antalya: [
      "Alanya",
      "Döşemealtı",
      "Kepez",
      "Konyaaltı",
      "Manavgat",
      "Muratpaşa",
    ],
  };
  const pay = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!Number.isFinite(total) || total < 1 || total > 10000000)
        throw new Error("Bağış tutarı geçerli değil.");
      if (!form.description.trim())
        throw new Error("Açıklama alanı zorunludur.");
      if (!receiptFile)
        throw new Error("Bağışı tamamlamak için dekont yüklemelisiniz.");
      if (receiptFile.size > 8 * 1024 * 1024)
        throw new Error("Dekont dosyası en fazla 8 MB olabilir.");
      if (
        form.firstName.length > 80 ||
        form.lastName.length > 80 ||
        form.email.length > 254 ||
        form.phone.length > 30 ||
        form.description.length > 500
      )
        throw new Error("Girilen bilgiler izin verilen uzunluğu aşıyor.");
      const configuredBase = (
        import.meta.env.VITE_PANEL_API_URL ||
        import.meta.env.VITE_VEFA_API_URL ||
        ""
      ).replace(/\/$/, "");
      if (
        configuredBase &&
        !/^https:\/\//i.test(configuredBase) &&
        !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBase)
      )
        throw new Error("Güvenli ödeme bağlantısı yapılandırılmamış.");
      const endpoint = `${configuredBase}/api/public/online-donations`;
      const donationPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        description: form.description.trim(),
        amount: total,
        paymentMethod: "EFT_HAVALE",
        bankAccountCode: selectedAccount.code,
        bankAccountIban: selectedAccount.iban.replace(/\s/g, ""),
        transferAmount,
        campaign: items
          .map((item) => `${item.title} (${item.qty} adet)`)
          .join(", ")
          .slice(0, 500),
        items: items.map(panelDonationItem),
        consent: form.consent,
        website: form.website,
      };
      const requestBody = new FormData();
      requestBody.append("payload", JSON.stringify(donationPayload));
      requestBody.append("receipt", receiptFile, receiptFile.name);
      const response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
        body: requestBody,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Ödeme tamamlanamadı.");
      track("donation_success", {
        amount: total,
        campaigns: items.map((x) => x.slug),
        reference: String(data.referenceNumber || "").slice(0, 80),
      });
      recordFundingDonations(items);
      setReceipt(data.referenceNumber);
      setItems([]);
    } catch (reason) {
      setError(
        reason instanceof TypeError
          ? "Bağış servisine ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin."
          : reason instanceof Error
            ? reason.message
            : "Ödeme tamamlanamadı.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`drawer-wrap ${checkout ? "checkout-wrap" : ""}`}>
      <button className="drawer-backdrop" onClick={onClose} />
      <aside className={`drawer ${checkout ? "payment-drawer" : ""}`}>
        <div className="drawer-head">
          <div>
            <span>{checkout ? "GÜVENLİ BAĞIŞ" : "BAĞIŞ SEPETİ"}</span>
            <h3>{checkout ? "Ödeme" : "Bağışların"}</h3>
          </div>
          {checkout && (
            <nav className="payment-return-actions" aria-label="Ödeme gezinme">
              <button type="button" onClick={onClose}>
                <ChevronLeft /> Geri Dön
              </button>
              <Link to="/" onClick={onNavigate}>
                <House /> Ana Sayfa
              </Link>
            </nav>
          )}
          <button aria-label="Kapat" onClick={onClose}>
            <X />
          </button>
        </div>
        {receipt ? (
          <div className="payment-success">
            <BadgeCheck />
            <span>DEKONTUNUZ ALINDI</span>
            <h3>Bağışınız için teşekkür ederiz.</h3>
            <p>
              EFT/Havale bildiriminiz kaydedildi. Dekontunuz kontrol edildikten
              sonra bağışınız onaylanacaktır.
            </p>
            <button className="btn navy" onClick={onClose}>
              Tamam
            </button>
          </div>
        ) : checkout ? (
          <>
            <div className="checkout-layout checkout-layout-simple">
              <div className="checkout-main">
                <p className="eft-only-notice">
                  <strong aria-hidden="true">!</strong>
                  Bağışınızı EFT/Havale ile yapabilirsiniz. Kredi kartıyla ödeme
                  seçeneğimiz yakında hizmetinizde olacaktır.
                </p>
                <section className="checkout-card eft-payment-card">
                  <h4>Ödeme Yöntemi</h4>
                  <div className="eft-method-selected">
                    <Landmark />
                    <span>
                      <b>EFT / Havale</b>
                      <small>
                        Banka hesabımıza EFT veya havale yaparak bağışınızı
                        tamamlayın.
                      </small>
                    </span>
                    <Check />
                  </div>
                  <h5>Banka Hesap Bilgileri</h5>
                  <div
                    className="eft-currency-tabs"
                    role="tablist"
                    aria-label="Hesap para birimi"
                  >
                    {bankAccounts.map((account) => (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selectedAccount.code === account.code}
                        className={
                          selectedAccount.code === account.code ? "active" : ""
                        }
                        key={account.code}
                        onClick={() => setSelectedAccountCode(account.code)}
                      >
                        <b>{account.code}</b>
                        <span>{account.currency}</span>
                      </button>
                    ))}
                  </div>
                  <div className="eft-account-panel">
                    <div className="eft-bank-title">
                      <Landmark />
                      <span>
                        <b>{selectedAccount.bank}</b>
                        <small>{selectedAccount.currency} hesabı</small>
                      </span>
                    </div>
                    <dl>
                      <div>
                        <dt>Hesap Sahibi</dt>
                        <dd>
                          <b>{selectedAccount.owner}</b>
                          <button type="button" onClick={copyTransferOwner}>
                            {copiedOwner ? <Check /> : <Copy />}
                            {copiedOwner ? "Kopyalandı" : "Kopyala"}
                          </button>
                        </dd>
                      </div>
                      <div>
                        <dt>IBAN</dt>
                        <dd>
                          <b>{selectedAccount.iban}</b>
                          <button type="button" onClick={copyTransferIban}>
                            {copiedIban === selectedAccount.code ? (
                              <Check />
                            ) : (
                              <Copy />
                            )}
                            {copiedIban === selectedAccount.code
                              ? "Kopyalandı"
                              : "Kopyala"}
                          </button>
                        </dd>
                      </div>
                      <div>
                        <dt>Şube</dt>
                        <dd>{selectedAccount.branch}</dd>
                      </div>
                      <div>
                        <dt>Hesap Numarası</dt>
                        <dd>
                          <b>{selectedAccount.accountNumber}</b>
                          <button
                            type="button"
                            onClick={copyTransferAccountNumber}
                          >
                            {copiedAccountNumber ? <Check /> : <Copy />}
                            {copiedAccountNumber ? "Kopyalandı" : "Kopyala"}
                          </button>
                        </dd>
                      </div>
                      <div>
                        <dt>Gönderilecek Tutar</dt>
                        <dd>
                          <strong>{transferAmountLabel}</strong>
                        </dd>
                      </div>
                      <div>
                        <dt>Açıklama Örneği</dt>
                        <dd>{transferDescription}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="eft-reminder">
                    <strong aria-hidden="true">!</strong>
                    EFT/Havale açıklamasına bağış türünü, adınızı, soyadınızı ve
                    telefon numaranızı yazmayı unutmayın.
                  </p>
                </section>
                {false && <section className="checkout-card personal-card">
                  <h4>Kişisel Bilgiler</h4>
                  <div className="payment-grid">
                    <label>
                      Bağışçı Adı
                      <input
                        required
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                      />
                    </label>
                    <label>
                      Bağışçı Soyadı
                      <input
                        required
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                      />
                    </label>
                    <label>
                      Telefon
                      <input
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="05xx xxx xx xx"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </label>
                    <label>
                      E-posta
                      <input
                        required
                        autoComplete="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="payment-description">
                    Açıklama <em>*</em>
                    <textarea
                      required
                      maxLength="500"
                      rows="4"
                      placeholder={descriptionPlaceholder}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </label>
                  <div className="receipt-upload-field">
                    <span>Dekont Yükle <em>*</em></span>
                    <label>
                      <FileText />
                      <span>
                        <b>
                          {receiptFile
                            ? receiptFile.name
                            : "Dekont dosyanızı seçin"}
                        </b>
                        <small>PDF, JPG veya PNG · En fazla 8 MB</small>
                      </span>
                      <input
                        required
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        onChange={(event) =>
                          setReceiptFile(event.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>
                  <div className="receipt-info-note">
                    <BadgeCheck />
                    Ödemenizi yaptıktan sonra dekontunuzu yükleyerek bağışınızı
                    tamamlayabilirsiniz.
                  </div>
                  <input
                    className="payment-honeypot"
                    tabIndex="-1"
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                  />
                  <div className="payment-consent-block">
                    <label className="payment-consent">
                      <input
                        type="checkbox"
                        required
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                      />
                      <span>
                        <button
                          type="button"
                          className="kvkk-trigger"
                          aria-expanded={kvkkOpen}
                          aria-controls="checkout-kvkk-text"
                          onClick={() => setKvkkOpen((current) => !current)}
                        >
                          KVKK aydınlatma metnini
                        </button>{" "}
                        okudum ve kişisel verilerimin bu bağış işlemi kapsamında
                        işlenmesini kabul ediyorum.
                      </span>
                    </label>
                    {kvkkOpen && (
                      <div
                        className="checkout-kvkk-text"
                        id="checkout-kvkk-text"
                        role="region"
                        aria-label="KVKK aydınlatma metni"
                      >
                        <div>
                          <b>KVKK Aydınlatma Metni</b>
                          <button
                            type="button"
                            aria-label="KVKK metnini kapat"
                            onClick={() => setKvkkOpen(false)}
                          >
                            <X />
                          </button>
                        </div>
                        <p>
                          Bu formda paylaştığınız kimlik, iletişim, bağış ve
                          işlem bilgileri; bağış işleminizin yürütülmesi,
                          muhasebeleştirilmesi, makbuz düzenlenmesi, yasal
                          yükümlülüklerin yerine getirilmesi ve talep hâlinde
                          sizinle iletişim kurulması amaçlarıyla işlenir.
                        </p>
                        <p>
                          Verileriniz yalnızca mevzuatın gerektirdiği yetkili
                          kurumlar ile ödeme ve operasyon süreçlerinde görevli
                          hizmet sağlayıcılarla, gerekli güvenlik önlemleri
                          alınarak paylaşılabilir. Kanuni saklama süreleri sona
                          erdiğinde veriler silinir, yok edilir veya anonim hâle
                          getirilir.
                        </p>
                        <p>
                          Kişisel verilerinize erişme, düzeltme, silme,
                          işlenmesini sınırlandırma ve ilgili mevzuat
                          kapsamındaki diğer haklarınıza ilişkin taleplerinizi
                          derneğin iletişim kanallarından iletebilirsiniz.
                        </p>
                        <Link to="/kurumsal/kvkk" replace onClick={onNavigate}>
                          Ayrıntılı bilgi sayfasını aç <ArrowRight />
                        </Link>
                      </div>
                    )}
                  </div>
                </section>}
              </div>
              {false && <aside className="checkout-summary">
                <h4>Bağış Özeti</h4>
                {items.map((item) => (
                  <div className="summary-item" key={item.slug}>
                    <span>
                      <b>{item.title}</b>
                      <small>{item.qty} adet</small>
                    </span>
                    <div className="summary-price">
                      <strong>
                        {money(item.price * item.qty, item.currency || "TRY")}
                      </strong>
                      {(item.currency || "TRY") !== "TRY" && (
                        <small>
                          TL karşılığı:{" "}
                          {money(
                            toTRY(item.price * item.qty, item.currency),
                            "TRY",
                          )}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Toplam</span>
                  <b>{totalLabel}</b>
                </div>
                {items.some((item) => item.currency === "USD") && (
                  <div className="exchange-rate-note">
                    <RefreshCw />
                    <span>
                      <b>
                        1 USD ={" "}
                        {Number(exchangeRates.USD).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}{" "}
                        ₺
                      </b>
                      <small>
                        TCMB gösterge kuru ·{" "}
                        {exchangeRateInfo?.date || "güncel kur"}
                      </small>
                    </span>
                  </div>
                )}
                <div className="secure-payment">
                  <Landmark />
                  <span>
                    <b>EFT / Havale ile güvenli bağış</b>
                    <small>
                      Seçtiğiniz para birimine ait resmi banka hesabını
                      kullanın.
                    </small>
                  </span>
                </div>
                <button disabled={loading} className="payment-submit">
                  {loading ? (
                    <>
                      <LoaderCircle className="spin" /> İşleniyor...
                    </>
                  ) : (
                    <>
                      <FileText /> Dekont Yükle ve Bağışı Tamamla
                    </>
                  )}
                </button>
                <small className="demo-note">
                  Bağışınız, banka transferi ve dekont kontrolü sonrasında
                  onaylanır.
                </small>
              </aside>}
            </div>
          </>
        ) : !items.length ? (
          <div className="empty">
            <ShoppingBag />
            <h3>Sepetin henüz boş.</h3>
            <p>Bir kampanya seçerek iyiliğe ortak olabilirsin.</p>
            <Link
              to="/projeler"
              replace
              onClick={onNavigate}
              className="btn orange"
            >
              Kampanyaları gör
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((x) => (
                <div key={x.slug}>
                  <img src={x.image} />
                  <div>
                    <b>{x.title}</b>
                    <span>{money(x.price, x.currency || "TRY")}</span>
                    <div>
                      <button
                        onClick={() =>
                          setItems(
                            items.map((i) =>
                              i.slug === x.slug
                                ? { ...i, qty: Math.max(1, i.qty - 1) }
                                : i,
                            ),
                          )
                        }
                      >
                        <Minus />
                      </button>
                      <b>{x.qty}</b>
                      <button
                        onClick={() =>
                          setItems(
                            items.map((i) =>
                              i.slug === x.slug ? { ...i, qty: i.qty + 1 } : i,
                            ),
                          )
                        }
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setItems(items.filter((i) => i.slug !== x.slug))
                    }
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Toplam bağış</span>
              <b>{totalLabel}</b>
              <div className="cart-actions">
                <Link
                  className="btn outline"
                  to="/projeler"
                  replace
                  onClick={onNavigate}
                >
                  Bağışa devam et
                </Link>
                <button
                  className="btn orange"
                  onClick={() => setCheckout(true)}
                >
                  Ödemeye geç <ArrowRight />
                </button>
              </div>
              <small>
                <ShieldCheck /> Demo güvenli ödeme
              </small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Footer() {
  const { content } = useCms();
  const s = content.settings,
    f = content.footer;
  return (
    <>
      <footer>
        <div className="container footer-grid">
          <div>
            <Logo light />
            <p>{f.brandText}</p>
            <div className="social">
              {socialMediaLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          {f.columns.map((column, i) => (
            <div key={i}>
              <b>{column.title}</b>
              {column.links.map((link, j) => (
                <Link key={j} to={safePath(link.path)}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <b>İLETİŞİM</b>
            <span>
              <Phone /> {s.phone}
            </span>
            <span>
              <Mail /> {s.email}
            </span>
            <span>
              <Landmark /> {s.address}
            </span>
          </div>
        </div>
        <section
          className="container footer-documents"
          aria-labelledby="footer-documents-title"
        >
          <div className="footer-documents-heading">
            <FileText />
            <div>
              <b id="footer-documents-title">YASAL VE KURUMSAL BELGELER</b>
              <span>
                Belgelerin tam metinlerini site içinde okuyabilirsiniz.
              </span>
            </div>
          </div>
          <div className="footer-document-links">
            {legalDocuments.map((document) => (
              <Link key={document.path} to={document.path}>
                <span>{document.label}</span>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
        <div className="container footer-bottom">
          <span>{f.copyright}</span>
          <div>
            {f.legal.map((link, i) => (
              <Link key={i} to={safePath(link.path)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

const originalTextNodes = new WeakMap();
const originalMediaNodes = new WeakMap();
const originalAttributes = new WeakMap();
const appliedTextNodes = new WeakMap();
const appliedMediaNodes = new WeakMap();
const appliedAttributes = new WeakMap();
function GlobalContentOverrides({ language }) {
  const { content } = useCms();
  const locale = content.languages?.[language] || content.languages?.tr || {};
  const textOverrides = useMemo(
      () => ({
        ...(content.overrides?.text || {}),
        ...(locale.text || {}),
      }),
      [content.overrides?.text, locale.text],
    ),
    mediaOverrides = useMemo(
      () => ({
        ...(content.overrides?.media || {}),
        ...(locale.media || {}),
      }),
      [content.overrides?.media, locale.media],
    );
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = locale.dir || "ltr";
    const apply = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (
          node.parentElement?.closest("script,style,.admin-v2,.content-locked")
        )
          continue;
        if (
          !originalTextNodes.has(node) ||
          (appliedTextNodes.has(node) &&
            node.nodeValue !== appliedTextNodes.get(node))
        )
          originalTextNodes.set(node, node.nodeValue);
        const original = originalTextNodes.get(node),
          trimmed = original.trim(),
          normalized = trimmed.replace(/\s+/g, " "),
          replacement = textOverrides[normalized];
        let translated = replacement || normalized;
        if (!replacement)
          for (const [source, target] of Object.entries(textOverrides).sort(
            (a, b) => b[0].length - a[0].length,
          ))
            if (source.length > 2 && translated.includes(source))
              translated = translated.split(source).join(target);
        const next =
          translated !== normalized
            ? original.replace(trimmed, translated)
            : original;
        appliedTextNodes.set(node, next);
        if (node.nodeValue !== next) node.nodeValue = next;
      }
      root.querySelectorAll?.("img,video,source").forEach((element) => {
        const current = element.getAttribute("src") || "";
        if (
          !originalMediaNodes.has(element) ||
          (appliedMediaNodes.has(element) &&
            current !== appliedMediaNodes.get(element))
        )
          originalMediaNodes.set(element, element.getAttribute("src") || "");
        const original = originalMediaNodes.get(element),
          next = mediaOverrides[original] || original;
        appliedMediaNodes.set(element, next);
        if (element.getAttribute("src") !== next)
          element.setAttribute("src", next);
      });
      root
        .querySelectorAll?.("[placeholder],[title],[aria-label]")
        .forEach((element) => {
          if (!originalAttributes.has(element))
            originalAttributes.set(element, {});
          if (!appliedAttributes.has(element))
            appliedAttributes.set(element, {});
          const saved = originalAttributes.get(element);
          const applied = appliedAttributes.get(element);
          ["placeholder", "title", "aria-label"].forEach((name) => {
            if (!element.hasAttribute(name)) return;
            const current = element.getAttribute(name);
            if (
              !(name in saved) ||
              (name in applied && current !== applied[name])
            )
              saved[name] = current;
            const next = textOverrides[saved[name]] || saved[name];
            applied[name] = next;
            if (element.getAttribute(name) !== next)
              element.setAttribute(name, next);
          });
        });
      root.querySelectorAll?.("[style]").forEach((element) => {
        for (const [original, replacement] of Object.entries(mediaOverrides)) {
          if (element.style.backgroundImage.includes(original))
            element.style.backgroundImage =
              element.style.backgroundImage.replace(original, replacement);
        }
      });
    };
    apply(document.body);
    const observer = new MutationObserver(() => apply(document.body));
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["src", "style", "placeholder", "title", "aria-label"],
    });
    return () => observer.disconnect();
  }, [textOverrides, mediaOverrides, language, locale.dir]);
  return null;
}

function SiteApp() {
  const exchangeRateInfo = useLiveExchangeRates();
  const [cart, setCart] = useState([]),
    [drawer, setDrawer] = useState(false),
    [language, setLanguageState] = useState(() => {
      localStorage.setItem("yedirenk-language", "tr");
      return "tr";
    });
  const loc = useLocation(),
    navigate = useNavigate();
  const { content } = useCms();
  const setLanguage = (value) => {
    if (value !== "tr" || !content.languages?.tr?.published) return;
    localStorage.setItem("yedirenk-language", value);
    setLanguageState(value);
  };
  useEffect(() => {
    if (!content.languages?.[language]?.published) setLanguage("tr");
  }, [content.languages, language]);
  useEffect(() => {
    const t = content.settings.typography || {};
    const ranges = {
      body: [12, 20],
      nav: [11, 20],
      heroTitle: [32, 80],
      heroText: [13, 24],
      sectionTitle: [24, 56],
      bodyText: [12, 22],
      cardTitle: [14, 30],
      cardText: [11, 20],
      pageTitle: [30, 68],
      button: [11, 20],
      footer: [10, 18],
      lineHeight: [1.2, 2.2],
    };
    const root = document.documentElement;
    Object.entries(ranges).forEach(([key, [min, max]]) => {
      const raw = Number(t[key]);
      const value = Number.isFinite(raw)
        ? Math.min(max, Math.max(min, raw))
        : Number(cmsDefaults.settings.typography[key]);
      root.style.setProperty(
        `--type-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
        key === "lineHeight" ? String(value) : `${value}px`,
      );
    });
    return () =>
      Object.keys(ranges).forEach((key) =>
        root.style.removeProperty(
          `--type-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
        ),
      );
  }, [content.settings.typography]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  useEffect(() => {
    if (!loc.state?.checkoutOpen) setDrawer(false);
  }, [loc.key, loc.state?.checkoutOpen]);
  useEffect(() => {
    if (loc.pathname.startsWith("/admin")) return undefined;
    const started = Date.now();
    let durationSent = false;
    const sendDuration = () => {
      if (durationSent) return;
      durationSent = true;
      track("page_duration", {
        seconds: Math.max(1, Math.round((Date.now() - started) / 1000)),
      });
    };
    trackMetaPageView();
    if (/^\/projeler\/[^/]+\/detay$/.test(loc.pathname))
      trackMetaDonationStart();
    track("page_view");
    window.addEventListener("pagehide", sendDuration);
    return () => {
      window.removeEventListener("pagehide", sendDuration);
      sendDuration();
    };
  }, [loc.pathname, loc.search]);
  useEffect(() => {
    const onClick = (event) => {
      const target = event.target instanceof Element ? event.target.closest("a,button,[role='button']") : null;
      if (!target || target.closest(".cms-admin")) return;
      const href = target instanceof HTMLAnchorElement ? target.getAttribute("href") || "" : "";
      track("click", {
        element: target.tagName.toLowerCase(),
        destination: href.startsWith("/") ? href.split("?")[0].slice(0, 200) : "",
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  const add = (c) => {
    const item = { ...c, qty: Math.max(1, Number(c.qty) || 1) };
    const checkoutValue = toTRY(
      Number(item.price) * item.qty,
      item.currency || "TRY",
    );
    const metaEventId = createMetaEventId("checkout");
    trackMetaInitiateCheckout({
      value: checkoutValue,
      numItems: item.qty,
      eventId: metaEventId,
    });
    track("checkout_start", {
      amount: checkoutValue,
      currency: "TRY",
      numItems: item.qty,
      metaEventId,
    });
    navigate(`${loc.pathname}${loc.search}`, {
      state: { ...(loc.state || {}), checkoutOpen: true },
    });
    setCart([item]);
    setDrawer(true);
  };
  const closeDrawer = () => {
    if (loc.state?.checkoutOpen) navigate(-1);
    else setDrawer(false);
  };
  if (loc.pathname === "/admin")
    return (
      <Suspense
        fallback={
          <main className="admin-loading">
            <LoaderCircle /> Yönetim paneli yükleniyor…
          </main>
        }
      >
        <AdminPanel />
      </Suspense>
    );
  const routeKey = `${loc.pathname}${loc.search}`;
  return (
    <>
      <GlobalContentOverrides language={language} />
      <Header language={language} setLanguage={setLanguage} />
      <Routes key={routeKey} location={loc}>
        <Route path="/" element={<Home add={add} />} />
        <Route path="/hakkimizda" element={<Navigate to="/" replace />} />
        <Route path="/bagis/*" element={<Navigate to="/projeler" replace />} />
        <Route
          path="/kurumsal/tarihcemiz"
          element={<Navigate to="/kurumsal/ilham-kaynagimiz" replace />}
        />
        <Route
          path="/kurumsal/yonetim"
          element={<Navigate to="/kurumsal/kurumsal" replace />}
        />
        <Route
          path="/kurumsal/ilkelerimiz"
          element={<Navigate to="/kurumsal/hakkimizda" replace />}
        />
        <Route path="/projeler" element={<ProjectsPage add={add} />} />
        <Route path="/kurumsal" element={<CorporateLandingPage />} />
        <Route path="/calismalarimiz" element={<ActivitiesLandingPage />} />
        <Route
          path="/fon-projeleri/:slug"
          element={<FundingProjectDetail add={add} />}
        />
        <Route
          path="/projeler/:slug"
          element={<ProjectGroupPage add={add} />}
        />
        <Route
          path="/projeler/:slug/detay"
          element={<ProjectDetailVerenel add={add} />}
        />
        <Route path="/haberler" element={<NewsPage />} />
        <Route path="/haberler/:id" element={<NewsDetail />} />
        <Route path="/arama" element={<SearchPage />} />
        <Route path="/zekat-hesapla" element={<Zakat add={add} />} />
        <Route path="/hesap-numaralari" element={<BankAccountsPage />} />
        <Route path="/belgeler/:slug" element={<LegalDocumentPage />} />
        <Route
          path="/iletisim"
          element={<FormPage kind="İletişim ve Destek" />}
        />
        <Route
          path="/katil/gonullu-ol"
          element={<FormPage kind="Gönüllü Başvurusu" />}
        />
        <Route
          path="/katil/sponsor-ol"
          element={<FormPage kind="Kurumsal İş Birliği" />}
        />
        <Route path="/giris" element={<AccountPage />} />
        <Route path="/kayit" element={<AccountPage />} />
        <Route path="*" element={<ContentPage />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      {drawer && (
        <Cart
          items={cart}
          setItems={setCart}
          onClose={closeDrawer}
          onNavigate={() => setDrawer(false)}
          exchangeRateInfo={exchangeRateInfo}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <CmsProvider defaults={cmsDefaults}>
      <SiteApp />
    </CmsProvider>
  );
}
