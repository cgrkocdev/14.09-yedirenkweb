import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
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
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Copy,
  Droplets,
  Facebook,
  Globe2,
  HandHeart,
  HeartHandshake,
  Instagram,
  Landmark,
  Mail,
  Menu,
  Minus,
  LoaderCircle,
  PackageCheck,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import { CmsProvider, useCms } from "./cms";
import { pageContent } from "./siteData";
import { track } from "./analytics";
import generatedTranslations from "./translations.generated.json";

const AdminPanel = lazy(() => import("./AdminPanel"));

const slides = [
  {
    slug: "adak-akika-nafile-kurban",
    label: "Kurban",
    image: "/assets/hero-category-qurbani.png",
    tag: "KURBAN BAĞIŞI",
    title: "Paylaştıkça bereket çoğalır.",
    text: "Kurban bağışınızı güvenilir saha ekiplerimizle ihtiyaç sahibi ailelere ulaştırıyoruz.",
    cta: "Bağış Yap",
    path: "/projeler/adak-akika-nafile-kurban",
    color: "#f49e0c",
  },
  {
    slug: "su-kuyusu",
    label: "Su Kuyusu",
    image: "/assets/hero-category-water.png",
    tag: "KALICI ESER",
    title: "Temiz su, yeni bir başlangıçtır.",
    text: "Bir su kuyusu; sağlığı, eğitimi ve bütün bir köyün yarınını değiştirir.",
    cta: "Bağış Yap",
    path: "/projeler/su-kuyusu",
    color: "#06b2aa",
  },
  {
    slug: "gida-kolisi",
    label: "Gıda Kolisi",
    image: "/assets/hero-category-food.png",
    tag: "GIDA DESTEĞİ",
    title: "Bir koli, bir sofraya umut olur.",
    text: "Temel gıda desteğinizi ihtiyaç tespiti yapılan ailelere özenle teslim ediyoruz.",
    cta: "Bağış Yap",
    path: "/projeler/gida-kolisi",
    color: "#f49e0c",
  },
  {
    slug: "yetim-hamiligi",
    label: "Yetim",
    image: "/assets/hero-category-orphan.png",
    tag: "YETİM DESTEĞİ",
    title: "Bir çocuğun yarınına eşlik edin.",
    text: "Eğitim, sağlık ve temel ihtiyaç desteğiyle çocukların güvenle büyümesine katkı sağlayın.",
    cta: "Destek Ol",
    path: "/projeler/yetim-hamiligi",
    color: "#06b2aa",
  },
  {
    slug: "zekat",
    label: "Zekât",
    image: "/assets/hero-category-zakat.png",
    tag: "ZEKÂT",
    title: "Zekâtınız doğru ihtiyaca ulaşsın.",
    text: "Zekâtınızı hesaplayın; doğrulanmış ihtiyaç sahiplerine güvenle ulaştırın.",
    cta: "Zekâtını Hesapla",
    path: "/zekat-hesapla",
    color: "#f49e0c",
  },
  {
    slug: "medrese",
    label: "Medrese",
    image: "/assets/hero-category-medrese.png",
    tag: "EĞİTİM",
    title: "Bilgiyle güçlenen nesiller.",
    text: "Çocukların güvenli ve nitelikli eğitim ortamlarına kavuşmasına destek olun.",
    cta: "Projeyi İncele",
    path: "/projeler/medrese",
    color: "#f49e0c",
  },
  {
    slug: "cami",
    label: "Cami",
    image: "/assets/hero-category-cami.png",
    tag: "KALICI ESER",
    title: "Birlikte kalıcı bir eser bırakın.",
    text: "İbadet, eğitim ve dayanışmaya ev sahipliği yapacak camilerin inşasına ortak olun.",
    cta: "Projeyi İncele",
    path: "/projeler/cami",
    color: "#06b2aa",
  },
  {
    slug: "mescid",
    label: "Mescid",
    image: "/assets/hero-category-mescid.png",
    tag: "KALICI ESER",
    title: "Küçük bir mekân, büyük bir buluşma.",
    text: "Yerel toplulukların ibadet ve dayanışma ihtiyacına kalıcı bir mescidle cevap verin.",
    cta: "Projeyi İncele",
    path: "/projeler/mescid",
    color: "#06b2aa",
  },
];
const projectCatalog = [
  {
    slug: "adak-akika-nafile-kurban",
    category: "Kurban",
    title: "Kurban",
    short:
      "Sudan, Yemen, Afganistan ve Afrika’da kurban bağışlarınızı güvenilir saha ekipleriyle ihtiyaç sahiplerine ulaştırıyoruz.",
    image: "/assets/project-qurbani-yedirenk-v1.png",
    description:
      "Adak, akika ve nafile kurban bağışlarınız; veteriner kontrolü, uygun kesim şartları ve ihtiyaç tespiti gözetilerek gerçekleştirilir. Etler insan onurunu koruyan bir dağıtım planıyla ailelere ulaştırılır.",
    variants: [
      ["Sudan", 5200, "TRY"],
      ["Yemen", 5600, "TRY"],
      ["Afganistan", 5400, "TRY"],
      ["Afrika", 4800, "TRY"],
    ],
  },
  {
    slug: "su-kuyusu",
    category: "Su",
    title: "Su Kuyusu",
    short:
      "Bangladeş’te temiz suya erişim için dayanıklı, tek tulumbalı su kuyusu.",
    image: "/assets/project-water-well-yedirenk-v1.png",
    description:
      "Dünyanın birçok bölgesinde aileler temiz suya ulaşmak için her gün uzun mesafeler kat ediyor. Güvenli olmayan kaynaklar özellikle çocuklarda ciddi sağlık sorunlarına, eğitim kaybına ve ailelerin günlük yükünün artmasına neden oluyor. Yedirenk olarak yeraltı suyu, nüfus yoğunluğu ve yerel ihtiyaç incelenerek belirlenen yerleşimlerde dayanıklı tulumbalı kuyular açıyoruz. Her proje; zemin incelemesi, sondaj, pompa kurulumu, su kalitesi kontrolü, teslim tutanağı ve sürdürülebilir bakım planını kapsıyor. Desteğiniz yalnızca bir su kaynağı açmıyor; çocukların okula ayırabildiği zamanı artırıyor, sağlık risklerini azaltıyor ve bütün bir yerleşimin hayatını kolaylaştırıyor.",
    variants: [
      ["Bangladeş · Tulumbalı Kuyu", 500, "USD"],
      ["Bangladeş · 12 Musluklu Kuyu", 1500, "USD"],
    ],
  },
  {
    slug: "gida-kolisi",
    category: "Acil Yardım",
    title: "Gıda Kolisi",
    short: "Bir ailenin temel mutfak ihtiyacına uygun, dengeli gıda desteği.",
    image: "/assets/project-food-parcel-yedirenk-v1.png",
    description:
      "Yerel beslenme alışkanlıklarına göre hazırlanan koliler temel kuru gıda ürünlerini içerir. Hak sahipliği saha ekiplerince doğrulanır ve dağıtımlar kayıt altına alınır.",
    variants: [["Gıda Kolisi", 2000, "TRY"]],
  },
  {
    slug: "yetim-hamiligi",
    category: "Yetim",
    title: "Yetim Hamiliği",
    short:
      "Bir çocuğun eğitim, sağlık ve temel ihtiyaçlarına aylık düzenli destek.",
    image: "/assets/project-orphan-sponsorship-yedirenk-v1.png",
    description:
      "Yetim hamiliği yalnızca maddi destek değil, çocuğun eğitim ve gelişiminin düzenli takip edildiği uzun soluklu bir dayanışma programıdır.",
    variants: [["Aylık Hamilik", 1000, "TRY"]],
  },
  {
    slug: "yetim-giydirme",
    category: "Yetim",
    title: "Yetim Giydirme",
    short:
      "Çocuklara mevsime uygun, yeni ve ihtiyaçlarına göre seçilen kıyafetler.",
    image: "/assets/project-orphan-clothing-yedirenk-v1.png",
    description:
      "Çocukların yaş, beden ve mevsim şartlarına uygun kıyafet ihtiyaçları yerel ekiplerle belirlenir; alışveriş ve teslim süreci mahremiyet gözetilerek yürütülür.",
    variants: [["Yetim Giydirme", 1500, "TRY"]],
  },
  {
    slug: "zekat",
    category: "Zekât",
    title: "Zekât",
    short:
      "Sabit tutar yok; zekâtınızı hesaplayın ve doğrulanmış ihtiyaç sahiplerine ulaştırın.",
    image: "/assets/project-zakat-yedirenk-v1.png",
    description:
      "Zekât bağışınız, zekât almaya uygunluğu doğrulanan ihtiyaç sahiplerinin gıda, barınma, sağlık ve temel yaşam gereksinimlerinde değerlendirilir.",
    calculator: true,
    variants: [],
  },
  {
    slug: "medrese",
    category: "Kalıcı Eser",
    title: "Medrese",
    short: "Çocuklar ve gençler için güvenli, sürdürülebilir eğitim mekânları.",
    image: "/assets/project-medrese-yedirenk-v1.png",
    description:
      "Medrese projeleri yerel ihtiyaç, öğrenci kapasitesi ve sürdürülebilir işletme planına göre hazırlanır. İnşaat aşamaları belgelenerek bağışçıyla paylaşılır.",
    variants: [
      ["Bangladeş", 12000, "USD", "/assets/project-medrese-yedirenk-v1.png"],
      [
        "Somali",
        12000,
        "USD",
        "/assets/project-medrese-somalia-yedirenk-v1.png",
      ],
      [
        "Etiyopya",
        0,
        "USD",
        "/assets/project-medrese-ethiopia-yedirenk-v1.png",
      ],
    ],
  },
  {
    slug: "cami",
    category: "Kalıcı Eser",
    title: "Cami",
    short:
      "İbadet, eğitim ve dayanışmayı buluşturan kalıcı bir topluluk merkezi.",
    image: "/assets/project-mosque-yedirenk-v1.png",
    description:
      "Cami projelerinde arsa uygunluğu, yerel izinler, kapasite ve bölgenin mimari ihtiyaçları değerlendirilir; yapım süreci aşamalı olarak raporlanır.",
    variants: [
      ["Bangladeş", 25000, "USD", "/assets/project-mosque-yedirenk-v1.png"],
      ["Uganda", 28000, "USD", "/assets/project-mosque-uganda-yedirenk-v1.png"],
    ],
  },
  {
    slug: "mescid",
    category: "Kalıcı Eser",
    title: "Mescid",
    short: "Küçük yerleşimler için erişilebilir ve güvenli ibadet alanı.",
    image: "/assets/project-masjid-yedirenk-v1.png",
    description:
      "Mescid projesi nüfusu daha az olan yerleşimlerde temel ibadet alanı ihtiyacını karşılar. Yer seçimi, inşa, tefriş ve teslim süreçleri projeye dahildir.",
    variants: [["Tanzanya", 25000, "USD"]],
  },
];
const projectIcons = {
  "adak-akika-nafile-kurban": HeartHandshake,
  "su-kuyusu": Droplets,
  "gida-kolisi": PackageCheck,
  "yetim-hamiligi": UsersRound,
  "yetim-giydirme": Sparkles,
  zekat: Calculator,
  medrese: BookOpen,
  cami: Landmark,
  mescid: Globe2,
};
const submenuIcons = {
  Hakkımızda: CircleUserRound,
  "İlham Kaynağımız": CalendarDays,
  "Misyon & Vizyon": Target,
  Kurumsal: UsersRound,
  "Etik Değerler": HeartHandshake,
  "Bağışçı Hakları": HandHeart,
  Şeffaflık: BadgeCheck,
  "Bilgi Güvenliği": ShieldCheck,
  Gazze: Globe2,
  "İnsani Yardım": HandHeart,
  "Acil Yardım": PackageCheck,
  Yetim: UsersRound,
  Su: Droplets,
  Katarakt: CircleUserRound,
  Eğitim: BookOpen,
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
const exchangeRates = { TRY: 1, USD: 50, EUR: 55, GBP: 65 };
const money = (price, currency = "TRY") =>
  `${Number(price).toLocaleString("tr-TR")} ${currencySymbols[currency] || currency}`;
const toTRY = (price, currency = "TRY") =>
  Number(price) * (exchangeRates[currency] || 1);
const projectVariantImage = (project, index = 0) =>
  project.variants?.[index]?.[3] || project.image;
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
    <img className={className} src={src} alt={alt} />
  );
}

function usePageSeo({ title, description, image, type = "website" }) {
  const location = useLocation();
  useEffect(() => {
    const fullTitle = `${title} | Yedirenk Derneği`;
    const canonical = `${window.location.origin}${location.pathname}`;
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
  }, [description, image, location.pathname, title, type]);
}
const projectLongCopy = {
  "adak-akika-nafile-kurban": [
    "Kurban bağışınızı Sudan 5.200 TL, Yemen 5.600 TL, Afganistan 5.400 TL veya Afrika 4.800 TL seçeneklerinden biriyle gerçekleştirebilirsiniz. Bedel; kurbanlığın temini, veteriner kontrolü, kesim, parçalama ve ihtiyaç sahiplerine dağıtım giderlerini kapsar.",
    "Dağıtımlarda düzenli geliri olmayan ailelere, yetim ve öksüz çocukların bulunduğu hanelere, yaşlılara, engellilere ve çatışma ya da afet nedeniyle yerinden edilmiş kişilere öncelik verilir. Bir kurban hissesi, bölgedeki hane büyüklüğüne göre birden fazla ailenin et ihtiyacına katkı sağlar.",
    "Kurbanlıklar sağlık ve yaş uygunluğu kontrol edilerek seçilir. Kesim, bağışçı vekâleti ve dini usuller gözetilerek saha ekiplerinin denetiminde yapılır; etler aynı bölgede önceden tespit edilen hak sahiplerine ulaştırılır. Uygulama sonrasında ülke, kesim ve dağıtım bilgileri kayıt altına alınır.",
    "Tutarlar ülkeye göre hayvan tedariki, ulaşım ve saha maliyetleri değiştiği için farklıdır. Seçtiğiniz ülke ve sabit varyant tutarı ödeme özetinde açıkça gösterilir; bağış yalnızca seçilen Kurban projesi kapsamında değerlendirilir.",
    "Sudan, Yemen ve Afganistan seçeneklerinde çatışma, göç ve ekonomik yetersizliklerden etkilenen topluluklara; Afrika seçeneğinde ise saha ihtiyacının en yüksek olduğu uygulama bölgelerine öncelik verilir. Dağıtım planı hane büyüklüğü ve kırılganlık durumu dikkate alınarak hazırlanır.",
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
    "Gıda kolisi desteği, temel gıdaya erişmekte zorlanan ailelerin belirli bir dönem boyunca mutfak ihtiyaçlarını karşılamayı amaçlar. Koliler bölgenin beslenme alışkanlıkları ve hane büyüklüğü dikkate alınarak hazırlanır.",
    "Pirinç, un, yağ, bakliyat, şeker ve benzeri dayanıklı temel ürünler yerel tedarikçilerden temin edilir. Hak sahipleri saha ekiplerince doğrulanır; teslimler mahremiyeti ve insan onurunu koruyan bir yöntemle gerçekleştirilir.",
    "Tek koliyle bir aileye destek olabilir veya manuel tutar alanını kullanarak daha fazla hanenin gıda ihtiyacına katkıda bulunabilirsiniz.",
    "Bir Gıda Kolisi bedeli 2.000 TL’dir. Tutar; ürünlerin tedariki, paketlenmesi, saha lojistiği ve doğrulanmış hak sahibine teslimini kapsar. Ürün içeriği uygulama bölgesindeki temel tüketim alışkanlıklarına ve erişilebilir tedarik koşullarına göre dengelenir.",
    "Öncelik; düzenli geliri bulunmayan hanelere, çocuklu ailelere, yaşlı veya engelli bireylerin yaşadığı evlere ve afet ya da çatışmadan etkilenen kişilere verilir. Dağıtım listeleri yerel saha ekipleri tarafından ihtiyaç düzeyine göre kontrol edilir.",
    "Teslim sırasında insan onurunu koruyan, kalabalık ve teşhir oluşturmayan yöntemler tercih edilir. Tedarik ve dağıtım adetleri kayıt altına alınarak bağışın seçilen yardım alanında kullanılması güvenceye alınır.",
  ],
  "yetim-hamiligi": [
    "Yetim hamiliği, bir çocuğun yalnızca bugünkü ihtiyacını değil; eğitim, sağlık ve güvenli gelişim sürecini düzenli biçimde destekleyen uzun vadeli bir dayanışma modelidir.",
    "Programa dahil edilen çocukların aile ve yaşam koşulları uzman ekipler tarafından değerlendirilir. Düzenli destek; okul ihtiyaçları, temel yaşam giderleri, sağlık hizmetleri ve sosyal gelişim faaliyetlerinde kullanılır.",
    "Aylık, altı aylık veya yıllık hamilik seçeneklerinden birini tercih edebilirsiniz. Süreklilik sağlayan her katkı, çocuğun eğitimine güvenle devam edebilmesine yardımcı olur.",
    "Aylık hamilik bedeli 1.000 TL’dir. Detay sayfasında 1 ile 12 ay arasında süre seçebilir; toplam tutarı aylık bedelin seçilen ay sayısıyla çarpılmış hâliyle ödeme öncesinde görebilirsiniz. Örneğin 6 ay 6.000 TL, 12 ay 12.000 TL olarak hesaplanır.",
    "Destek; çocuğun okul araçları, temel giyim, gıda, sağlık ve güvenli gelişim ihtiyaçlarına katkı sağlar. Kullanım öncelikleri çocuğun yaşı, eğitim durumu ve hanenin güncel ihtiyaç değerlendirmesine göre belirlenir.",
    "Programa kabul öncesinde çocuğun ve bakım veren hanenin durumu doğrulanır. Düzenli takip, desteğin yalnızca tek seferlik bir yardım olarak kalmamasını ve çocuğun eğitim sürecindeki değişimlerin izlenebilmesini amaçlar.",
  ],
  "yetim-giydirme": [
    "Yetim giydirme projesi, çocukların mevsime uygun, yeni ve beden ölçülerine göre seçilmiş kıyafetlere erişmesini sağlar. Destek yalnızca bir kıyafet paketi değil, çocuğun kendisini değerli hissettiği özenli bir süreç olarak planlanır.",
    "Yaş, beden ve mevsim bilgileri yerel ekiplerce belirlenir. Mümkün olan bölgelerde çocukların seçim sürecine katılması sağlanır; teslimler fotoğraf zorunluluğu olmadan mahremiyet esasına göre gerçekleştirilir.",
    "Bir veya birden fazla çocuğa destek olabilir, özel tutar seçeneğiyle bütçenize uygun katkıyı sepete ekleyebilirsiniz.",
    "Bir çocuk için Yetim Giydirme bedeli 1.500 TL’dir. Paket; mevsime ve bölge şartlarına uygun temel üst-alt giyim, ayakkabı ve ihtiyaç durumuna göre tamamlayıcı parçalardan oluşturulur. Tedarik, beden kontrolü ve teslim giderleri bu bedele dahildir.",
    "Destekten yararlanacak çocuklar saha ekiplerinin sosyal incelemesiyle belirlenir. Öncelik kıyafet ihtiyacı acil olan, düzenli aile geliri bulunmayan veya afet ve çatışma koşullarından etkilenen çocuklara verilir.",
    "Çocuğun mahremiyetini korumak esastır; yardımın belgelenmesi çocuğun teşhir edilmesi anlamına gelmez. Tedarik ve teslim bilgileri proje kayıtlarında tutulur, bağış seçilen amaç dışında kullanılmaz.",
  ],
  zekat: [
    "Zekât, toplumda dayanışmayı güçlendiren ve ihtiyaç sahibinin temel yaşam koşullarına katkı sağlayan önemli bir ibadettir. Yedirenk’e bağışlanan zekâtlar, zekât almaya uygunluğu doğrulanan kişilere ulaştırılır.",
    "Kaynaklar gıda, barınma, sağlık, eğitim ve acil temel ihtiyaçlar için değerlendirilir. Hak sahipliği incelemesi ve dağıtım kayıtları, yardımın doğru kişiye ulaşmasını sağlayacak biçimde yürütülür.",
    "Zekât hesaplama aracını kullanarak yaklaşık yükümlülüğünüzü görebilir ve belirlediğiniz tutarla bağış sürecine devam edebilirsiniz.",
    "Hesaplama aracında altın ve kıymetli madenler, nakit ve banka varlıkları, ticari mallar, döviz ve yatırımlar ile tahsil edilebilir alacaklar toplanır; kısa vadeli borçlar düşülür. Ortaya çıkan net tutarın %2,5’i tahmini zekât olarak gösterilir.",
    "Hesaplanan tutar tek düğmeyle Zekât adıyla sepete eklenebilir. Sepette görünen tutar TL cinsindedir ve ödeme aşamasına kadar açıkça gösterilir; istenirse sepetten çıkarılabilir veya hesaplama yeniden yapılabilir.",
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
    category: "Saha",
    date: "28 Temmuz 2026",
    published: "2026-07-28",
    title: "Yeni dayanışma merkezi hizmete açıldı",
    summary:
      "Yerel gönüllüler ve uzman ekiplerin birlikte yürüteceği merkez eğitim ve sosyal destek çalışmalarına ev sahipliği yapacak.",
    body: "Çalışma öncesinde ihtiyaç ve erişim koşulları saha ekibi tarafından değerlendirildi. Uygulama planı yerel paydaşlarla birlikte oluşturuldu.",
    image: "/assets/news-solidarity-center-ai-v1.webp",
    active: true,
  },
  {
    id: "2",
    category: "Eğitim",
    date: "24 Temmuz 2026",
    published: "2026-07-24",
    title: "Çocuk akademilerinde yaz dönemi başladı",
    summary:
      "Bilim, sanat ve sosyal sorumluluk atölyeleriyle çocukların üretme cesaretini destekliyoruz.",
    body: "Yaz dönemi programı çocukların güvenli ve üretken zaman geçirmesi amacıyla hazırlandı.",
    image: "/assets/news-children-academy-ai-v1.webp",
    active: true,
  },
  {
    id: "3",
    category: "Su",
    date: "21 Temmuz 2026",
    published: "2026-07-21",
    title: "Yeni kuyumuz 1.200 kişiye temiz su ulaştırıyor",
    summary:
      "Su analizi ve bakım eğitimi tamamlanan proje günlük temiz su ihtiyacını karşılamaya başladı.",
    body: "Teknik kontroller tamamlandı ve yerel bakım ekibine eğitim verildi.",
    image: "/assets/news-water-well-ai-v1.webp",
    active: true,
  },
  {
    id: "4",
    category: "Acil Yardım",
    date: "18 Temmuz 2026",
    published: "2026-07-18",
    title: "Ailelere temel gıda desteği ulaştırıldı",
    summary:
      "İhtiyaç analizi tamamlanan ailelere temel mutfak ürünlerinden oluşan gıda paketleri düzenli ve güvenli biçimde teslim edildi.",
    body: "Saha ekiplerinin hane bazlı değerlendirmesiyle belirlenen aileler için hazırlanan paketlerde temel mutfak ihtiyaçlarına yer verildi.\n\nDağıtım sürecinde insan onuru, düzenli kayıt ve adil erişim ilkeleri gözetildi. Teslim bilgileri saha sorumluları tarafından doğrulandı.",
    image: "/assets/news-food-aid-ai-v1.webp",
    active: true,
  },
  {
    id: "5",
    category: "Sağlık",
    date: "15 Temmuz 2026",
    published: "2026-07-15",
    title: "Katarakt taramalarında yeni dönem tamamlandı",
    summary:
      "Uzman sağlık ekibi, görme kaybı riski taşıyan hastaların muayenelerini tamamlayarak tedavi planlarını oluşturdu.",
    body: "Mobil sağlık ekibinin yürüttüğü taramalarda hastaların göz muayeneleri gerçekleştirildi ve cerrahi değerlendirme gerektiren kişiler belirlendi.\n\nUygun bulunan hastalar için ameliyat ve kontrol takvimi oluşturuldu. Hasta güvenliği ve düzenli takip sürecin temel öncelikleri arasında yer aldı.",
    image: "/assets/news-cataract-ai-v1.webp",
    active: true,
  },
  {
    id: "6",
    category: "Gönüllülük",
    date: "12 Temmuz 2026",
    published: "2026-07-12",
    title: "Yeni gönüllüler saha oryantasyonunu tamamladı",
    summary:
      "Gönüllüler görev güvenliği, iletişim, çocuk koruma ve saha etiği başlıklarında uygulamalı eğitim aldı.",
    body: "Oryantasyon programında gönüllülere görev sınırları, ekip içi koordinasyon, veri güvenliği ve ihtiyaç sahipleriyle doğru iletişim konularında bilgi verildi.\n\nUygulamalı çalışmanın ardından katılımcılar yetkinlik ve ilgi alanlarına göre ekiplerle eşleştirildi.",
    image: "/assets/news-volunteer-training-ai-v1.webp",
    active: true,
  },
  {
    id: "7",
    category: "Yetim",
    date: "9 Temmuz 2026",
    published: "2026-07-09",
    title: "Yetim hamiliği aile ziyaretleri sürdürüldü",
    summary:
      "Sosyal çalışma ekibi çocukların eğitim, sağlık ve temel yaşam koşullarını ailelerle birlikte değerlendirdi.",
    body: "Düzenli izleme programı kapsamında gerçekleştirilen ziyaretlerde çocukların okula devamı, eğitim ihtiyaçları ve ailelerin güncel koşulları ele alındı.\n\nGörüşmeler çocuk koruma ilkelerine uygun ve mahremiyet gözetilerek yürütüldü. Gerekli yönlendirmeler kayıt altına alındı.",
    image: "/assets/news-orphan-support-ai-v1.webp",
    active: true,
  },
  {
    id: "8",
    category: "Kalıcı Eser",
    date: "6 Temmuz 2026",
    published: "2026-07-06",
    title: "Yeni köy camisi ibadete açıldı",
    summary:
      "Yerel topluluğun ibadet ve buluşma ihtiyacına cevap verecek yapı, kontrollerin ardından hizmete açıldı.",
    body: "Nüfus, erişim ve mevcut ibadet alanlarının yeterliliği değerlendirilerek planlanan caminin yapım süreci tamamlandı.\n\nYapı güvenliği ve temel donanım kontrollerinin ardından cami yerel sorumlulara teslim edildi. Alan aynı zamanda eğitim ve topluluk buluşmalarına hizmet edecek.",
    image: "/assets/news-mosque-ai-v1.webp",
    active: true,
  },
  {
    id: "9",
    category: "Afet",
    date: "3 Temmuz 2026",
    published: "2026-07-03",
    title: "Arama kurtarma ekibi bölgesel tatbikata katıldı",
    summary:
      "Ekipler güvenli tahliye, sedye taşıma, haberleşme ve olay yeri koordinasyonu üzerine uygulamalı çalışma yaptı.",
    body: "Kontrollü eğitim sahasında gerçekleştirilen tatbikatta ekiplerin görev dağılımı, güvenli yaklaşım ve haberleşme kapasitesi sınandı.\n\nTatbikat sonrasında gözlemler değerlendirilerek ekipman ve eğitim ihtiyaçları güncellendi.",
    image: "/assets/news-rescue-drill-ai-v1.webp",
    active: true,
  },
  {
    id: "10",
    category: "Kalkınma",
    date: "30 Haziran 2026",
    published: "2026-06-30",
    title: "Kadınlara yönelik üretim atölyesi başladı",
    summary:
      "Katılımcılar dikiş, ürün geliştirme ve temel gelir planlaması eğitimleriyle üretim becerilerini güçlendiriyor.",
    body: "Yerel eğitmenlerin yürüttüğü atölyede katılımcılar üretim tekniklerini uygulamalı olarak öğreniyor. Programda malzeme kullanımı, kalite kontrolü ve sürdürülebilir gelir planlaması ele alınıyor.\n\nAtölye, kadınların üretim kapasitesini ve ekonomik hayata katılımını uzun vadeli olarak desteklemeyi amaçlıyor.",
    image: "/assets/news-women-workshop-ai-v1.webp",
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
    logo: "/assets/yedirenk-logo-official-pdf.png",
    logoWidth: 360,
    logoHeight: 96,
    typographyVersion: 4,
    projectsVersion: 6,
    wordingVersion: 2,
    navigationVersion: 3,
    donationRouteVersion: 2,
    projectHomepageVersion: 2,
    footerVolunteerVersion: 1,
    newsImageVersion: 2,
    phone: "0 (212) 000 00 00",
    email: "bilgi@yedirenk.org.tr",
    address: "İstanbul, Türkiye",
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
    storyImage: "/assets/hero-water-branded-v3.png",
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
          { label: "Şeffaflık", path: "/kurumsal/seffaflik" },
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
    social: { instagram: "#", facebook: "#", youtube: "#" },
    copyright: "© 2026 Yedirenk Derneği. Tüm hakları saklıdır.",
    legal: [
      { label: "KVKK", path: "/kurumsal/bilgi-guvenligi" },
      { label: "Çerez Politikası", path: "/kurumsal/etik-degerler" },
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
    "/assets/program-humanitarian.jpg",
    "/calismalarimiz/insani-yardim",
    HandHeart,
  ],
  [
    "Eğitim",
    "Bilgiyi paylaşarak çoğaltır, çocukların geleceğini güçlendiririz.",
    "/assets/hero-education-branded-v3.png",
    "/calismalarimiz/farkindalik",
    BookOpen,
  ],
  [
    "Su ve Sağlık",
    "Kalıcı su çözümleri ve sağlık programlarıyla yaşamı destekleriz.",
    "/assets/program-water.jpg",
    "/calismalarimiz/su",
    Droplets,
  ],
  [
    "Afet Yönetimi",
    "Hazırlık, arama kurtarma ve acil yardım kapasitesi oluştururuz.",
    "/assets/program-rescue.jpg",
    "/calismalarimiz/arama-kurtarma",
    ShieldCheck,
  ],
];

const menu = [
  {
    label: "Biz Kimiz?",
    path: "/kurumsal/hakkimizda",
    cols: [
      [
        "Kurumsal",
        ["Hakkımızda", "İlham Kaynağımız", "Misyon & Vizyon", "Kurumsal"],
      ],
    ],
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
  "yetim-hamiligi": ["Bir yetim çocuk", "Eğitim, sağlık ve temel ihtiyaç"],
  "yetim-giydirme": ["Bir yetim çocuk", "Mevsimlik yeni kıyafet paketi"],
  zekat: ["Zekât almaya uygun kişiler", "Doğrulanmış temel ihtiyaçlar"],
  medrese: ["Çocuklar ve gençler", "Eğitim yapısı ve temel tefriş"],
  cami: ["Yerel topluluk", "İbadet alanı ve temel tefriş"],
  mescid: ["Küçük yerleşim topluluğu", "İbadet alanı ve temel tefriş"],
};
cmsDefaults.projects = projectCatalog.map((project) => ({
  ...project,
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
    image: "/assets/news-hero-logo-v5.png",
    sectionTitle: "Aramak istediğiniz kelimeyi yazın",
    emptyTitle: "Sonuç bulunamadı",
    emptyText: "Başka bir kelime veya daha kısa bir ifade deneyin.",
  },
  donate: {
    name: "Bağış",
    tag: "BAĞIŞ",
    title: "Desteğin iyiliğe dönüşsün.",
    text: "Bağış alanını seçin, tutarı belirleyin ve güvenli ödeme adımına ilerleyin.",
    image: "/assets/hero-solidarity-branded-v3.png",
  },
  news: {
    name: "Haberler",
    tag: "YEDİRENK’TEN",
    title: "Haberler ve duyurular",
    text: "Sahadan doğrulanmış gelişmeler, proje sonuçları ve gönüllülük çağrıları.",
    image: "/assets/news-hero-logo-v5.png",
    sectionTitle: "Sahadan doğrulanmış haberler.",
    sectionText:
      "Her içerik saha kayıtları, proje sorumlusu bilgileri ve görsel belgeler karşılaştırılarak hazırlanır.",
  },
  projects: {
    name: "Projeler",
    tag: "YEDİRENK PROJELERİ",
    title: "Bir iyilik seçin, detaylarını kolayca inceleyin.",
    text: "Proje adına dokunarak doğrudan açıklama ve bağış seçeneklerine ulaşabilir, bütün çalışmalarımızı karşılaştırabilirsiniz.",
    image: "/assets/projects-hero-yedirenk-v1.png",
    sectionTitle: "Destek olabileceğiniz çalışmalar",
  },
  zakat: {
    name: "Zekât Hesapla",
    tag: "HESAPLAMA ARACI",
    title: "Zekâtını kolayca hesapla.",
    text: "Zekâta tabi varlıklarınızı girerek yaklaşık tutarı görün.",
    image: "/assets/program-awareness.jpg",
    sectionTitle: "Varlık bilgileri",
    note: "Bu araç bilgilendirme amaçlıdır. Özel durumlarınız için yetkin bir uzmana danışınız.",
  },
  account: {
    name: "Giriş / Kayıt",
    tag: "BAĞIŞÇI HESABI",
    title: "Giriş Yap veya Kayıt Ol",
    userTitle: "Hesabım",
    text: "Bağış bilgilerinizi güvenle yönetin ve işlemlerinizi kolaylaştırın.",
    image: "/assets/program-rights.jpg",
    sectionTitle: "İyiliğinizi tek hesapta takip edin.",
    sectionText:
      "Kayıt olarak ödeme sırasında bilgilerinizi daha hızlı doldurabilir ve bağış geçmişinize güvenli biçimde erişebilirsiniz.",
  },
  contact: {
    name: "İletişim",
    tag: "BİZE ULAŞIN",
    title: "İletişim ve Destek",
    text: "Sorularınız ve destek talepleriniz için bize ulaşın.",
    image: "/assets/program-humanitarian.jpg",
  },
  volunteer: {
    name: "Gönüllülük",
    tag: "BİRLİKTE İYİLİK",
    title: "Gönüllü Başvurusu",
    text: "Bilginiz, zamanınız ve emeğinizle iyiliğe ortak olun.",
    image: "/assets/program-volunteer.jpg",
  },
  sponsor: {
    name: "Kurumsal İş Birliği",
    tag: "BİRLİKTE ETKİ",
    title: "Kurumsal İş Birliği",
    text: "Sürdürülebilir sosyal etki için birlikte çalışalım.",
    image: "/assets/program-diplomacy.jpg",
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
const getProjects = (content) =>
  (content.projects || cmsDefaults.projects).filter(
    (project) => project.active !== false,
  );
const getSitePage = (content, key) =>
  content.sitePages?.[key] || cmsDefaults.sitePages[key];
cmsDefaults.navigation = menu;

const slugMap = {
  hakkimizda: "Hakkımızda",
  "ilham-kaynagimiz": "İlham Kaynağımız",
  "misyon-vizyon": "Misyon & Vizyon",
  kurumsal: "Kurumsal",
  "etik-degerler": "Etik Değerler",
  "bagisci-haklari": "Bağışçı Hakları",
  seffaflik: "Şeffaflık",
  "bilgi-guvenligi": "Bilgi Güvenliği",
  "filistin-gazze": "Gazze",
  "insani-yardim": "İnsani Yardım",
  "acil-yardim": "Acil Yardım",
  yetim: "Yetim",
  su: "Su",
  katarakt: "Katarakt",
  farkindalik: "Eğitim",
  "arama-kurtarma": "Arama Kurtarma",
  "sponsor-ol": "Sponsor Ol",
  "su-kuyusu": "Su Kuyusu Açtır",
  "gonullu-ol": "Gönüllü Ol",
  bulten: "Bültene Katıl",
  haberler: "Haberler",
};

const pageProfiles = {
  haberler: {
    image: "/assets/news-hero-logo-v5.png",
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
    image: "/assets/program-volunteer.jpg",
    lead: "Yedirenk’in kuruluş fikrini, sorumluluk anlayışını ve iyiliği kalıcı etkiye dönüştüren çalışma modelini anlatır.",
    qas: [
      [
        "Yedirenk hangi alanlarda çalışır?",
        "Eğitim, kültür, insani yardım, sağlık, temiz su, afet yönetimi ve gönüllülük alanlarında çalışır. Programlar yalnızca yardım ulaştırmayı değil, yerel kapasiteyi güçlendirmeyi ve kalıcı etki üretmeyi hedefler.",
      ],
      [
        "Yedirenk’in diğer kuruluşlardan farkı nedir?",
        "Her çalışmayı sorumluluk yaklaşımıyla ele alır; ihtiyaç sahibinin onurunu, bağışçının iradesini ve kaynağın izlenebilirliğini aynı sürecin ayrılmaz parçaları kabul eder.",
      ],
      [
        "Faaliyetleri kim denetler?",
        "Projeler yönetim ve mali kontrol süreçlerinden geçer; harcama belgeleri proje kodlarıyla kayıt altına alınır. Dönemsel faaliyet ve mali tablolar şeffaflık sayfasında yayımlanır.",
      ],
    ],
  },
  "ilham-kaynagimiz": {
    image: "/assets/history-logo-v2.png",
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
    image: "/assets/program-awareness.jpg",
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
    image: "/assets/program-diplomacy.jpg",
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
    image: "/assets/program-rights.jpg",
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
    image: "/assets/aid.jpg",
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
    image: "/assets/program-mavi.jpg",
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
    image: "/assets/volunteer.jpg",
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
    image: "/assets/program-gaza.jpg",
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
    image: "/assets/program-humanitarian.jpg",
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
    image: "/assets/program-emergency.jpg",
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
    image: "/assets/program-orphan.jpg",
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
    image: "/assets/hero-water-branded-v3.png",
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
    image: "/assets/program-cataract.jpg",
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
    image: "/assets/hero-education-branded-v3.png",
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
    image: "/assets/program-rescue.jpg",
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
    image: "/assets/water-well-logo-v2.png",
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
        image: special.image || "/assets/hero-solidarity-branded-v3.png",
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

function Header({ cart, onCart, language, setLanguage }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const projectMenuItems = projects.filter(
    (project, index, list) =>
      project.category !== "Yetim" ||
      list.findIndex((item) => item.category === "Yetim") === index,
  );
  const activeMenu = content.navigation || menu;
  const [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false);
  const nav = useNavigate();
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
                  .filter(([, item]) => item.published)
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
              <div className="nav-group" key={m.label}>
                <Link to={safePath(m.path)}>
                  {m.label}
                  <ChevronDown />
                </Link>
                <div className="mega">
                  <div className="mega-brand">
                    <span>İYİLİĞİN İZİNDE</span>
                    <h3>{m.label}</h3>
                    <p>
                      İyiliği kalıcı etkiye dönüştüren Yedirenk yaklaşımını
                      keşfedin.
                    </p>
                    <Link to={safePath(m.path)}>
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
            <Link to="/haberler">Haberler</Link>
            <div className="nav-group projects-nav-group">
              <Link to="/projeler">
                Projeler
                <ChevronDown />
              </Link>
              <div className="mega projects-mega">
                <div className="mega-brand">
                  <span>YEDİRENK PROJELERİ</span>
                  <h3>İyiliğe ortak olun</h3>
                  <p>
                    Destek olmak istediğiniz projeyi seçerek açıklamasına ve
                    bağış seçeneklerine doğrudan ulaşın.
                  </p>
                  <Link to="/projeler">
                    Proje sayfasına git <ArrowRight />
                  </Link>
                </div>
                {[projectMenuItems.slice(0, 5), projectMenuItems.slice(5)].map(
                  (items, index) => (
                    <div className="mega-col project-mega-col" key={index}>
                      <b>
                        {index === 0 ? "YARDIM PROJELERİ" : "KALICI PROJELER"}
                      </b>
                      {items.map((project) => {
                        const Icon = projectIcons[project.slug] || HandHeart;
                        const isOrphanGroup = project.category === "Yetim";
                        return (
                          <Link
                            className="project-mega-link"
                            key={project.slug}
                            to={`/projeler/${project.slug}`}
                          >
                            <Icon />
                            <span>{isOrphanGroup ? "Yetim" : project.title}</span>
                            <ArrowRight />
                          </Link>
                        );
                      })}
                    </div>
                  ),
                )}
              </div>
            </div>
            <button className="mobile-x" onClick={() => setMobile(false)}>
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
            <button className="basket" onClick={onCart}>
              <ShoppingBag />
              <i>{cart.reduce((n, x) => n + x.qty, 0)}</i>
            </button>
            <Link className="btn orange" to="/projeler">
              Bağış Yap <ArrowRight />
            </Link>
            <button className="mobile-menu" onClick={() => setMobile(true)}>
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
    "İlham Kaynağımız": "/kurumsal/ilham-kaynagimiz",
    "Misyon & Vizyon": "/kurumsal/misyon-vizyon",
    Kurumsal: "/kurumsal/kurumsal",
    "Etik Değerler": "/kurumsal/etik-degerler",
    "Bağışçı Hakları": "/kurumsal/bagisci-haklari",
    Şeffaflık: "/kurumsal/seffaflik",
    "Bilgi Güvenliği": "/kurumsal/bilgi-guvenligi",
    Gazze: "/calismalarimiz/filistin-gazze",
    "İnsani Yardım": "/calismalarimiz/insani-yardim",
    "Acil Yardım": "/calismalarimiz/acil-yardim",
    Yetim: "/calismalarimiz/yetim",
    Su: "/calismalarimiz/su",
    Katarakt: "/calismalarimiz/katarakt",
    Eğitim: "/calismalarimiz/farkindalik",
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
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => setActive((x) => (x + 1) % activeSlides.length),
      6500,
    );
    return () => clearTimeout(t);
  }, [active, activeSlides.length]);
  return (
    <section className="hero-slider">
      <div className="container hero-stage">
        {activeSlides.map((s, i) => (
          <article
            key={s.slug}
            className={i === active ? "active" : ""}
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="hero-copy">
              <span>
                <i style={{ background: s.color }} />
                {s.tag}
              </span>
              <h1>{s.title}</h1>
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
      <div className="container hero-category-tabs" aria-label="Proje sliderı">
        {activeSlides.map((slide, index) => {
          const Icon = projectIcons[slide.slug] || HandHeart;
          return (
            <button
              type="button"
              className={index === active ? "active" : ""}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              key={slide.slug}
            >
              <Icon />
              <span>{slide.label}</span>
            </button>
          );
        })}
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

function ProjectCard({ project, add }) {
  const Icon = projectIcons[project.slug] || HandHeart;
  const variant = getPrimaryProjectVariant(project);
  return (
    <article className="project-card">
      <Link
        className="project-image"
        to={`/projeler/${project.slug}`}
        aria-label={`${project.title} detaylarını gör`}
      >
        <Media src={project.image} alt={`${project.title} bağış projesi`} />
      </Link>
      <div className="project-copy">
        <Link className="project-card-title" to={`/projeler/${project.slug}`}>
          <h3>
            <Icon />
            {project.title}
          </h3>
        </Link>
        <p>{project.short}</p>
        {project.slug === "gida-kolisi" ? (
          <FoodPackageQuickDonation
            project={project}
            variant={variant}
            add={add}
          />
        ) : (
          <div>
            <Link
              className="project-detail-link"
              to={
                project.calculator
                  ? "/zekat-hesapla"
                  : `/projeler/${project.slug}`
              }
            >
              {project.calculator ? "Zekâtınızı Hesaplayın" : "Detayları gör"}{" "}
              <ArrowRight />
            </Link>
          </div>
        )}
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
          <h2>{project.title}</h2>
          <form onSubmit={donate}>
            <label htmlFor="funding-amount">Bağış tutarı</label>
            <div className="funding-amount-input">
              <b>₺</b>
              <input
                id="funding-amount"
                type="number"
                min="50"
                step="1"
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
              Sepete Ekle <ShoppingBag />
            </button>
          </form>
          <small>En az 50 ₺ ile projeye destek olabilirsiniz.</small>
        </aside>
      </section>
    </main>
  );
}

function Home({ add }) {
  const { content } = useCms();
  const h = content.home;
  const activeProjects = getProjects(content);
  const projectCount = Math.max(1, activeProjects.length);
  const activeNews = content.news.filter((x) => x.active !== false);
  const [campaignIndex, setCampaignIndex] = useState(0);
  const visible = [0, 1, 2]
    .map((x) => activeProjects[(campaignIndex + x) % projectCount])
    .filter(Boolean);
  return (
    <main>
      <Hero />
      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-mark">
            <img src="/assets/yedirenk-mark-transparent.png" alt="" />
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
      <section className="section campaign-section">
        <div className="container">
          <Heading eyebrow={h.campaignEyebrow} title={h.campaignTitle} />
          <div className="carousel-top">
            <p>{h.campaignText}</p>
            <div>
              <button
                onClick={() =>
                  setCampaignIndex(
                    (campaignIndex + projectCount - 1) % projectCount,
                  )
                }
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() =>
                  setCampaignIndex((campaignIndex + 1) % projectCount)
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="project-grid home-project-grid">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} add={add} />
            ))}
          </div>
          <Link className="btn outline center-btn" to="/projeler">
            Tüm projeleri gör <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="impact">
        <div className="container impact-grid">
          <div>
            <span>{h.impactEyebrow}</span>
            <h2>{h.impactTitle}</h2>
          </div>
          <div className="impact-stats">
            {h.stats.map((x) => (
              <div key={x.label}>
                <b>{x.value}</b>
                <span>{x.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section story">
        <div className="container story-grid">
          <div className="story-photo">
            <img src={h.storyImage} />
            <button>
              <Play />
            </button>
            <span>SAHADAN HİKÂYELER</span>
          </div>
          <div>
            <span className="kicker">{h.storyEyebrow}</span>
            <h2>{h.storyTitle}</h2>
            <blockquote>“{h.storyQuote}”</blockquote>
            <p>{h.storyText}</p>
            <Link className="text-link" to="/haberler">
              Hikâyeyi oku <ArrowRight />
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
                <img src={n.image} />
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
      <section className="trust-strip home-bottom-trust">
        <div className="container">
          {content.trust.map((x, i) => {
            const I =
              [ShieldCheck, BadgeCheck, Globe2, PackageCheck][i] || ShieldCheck;
            return (
              <div key={i}>
                <I />
                <span>
                  <b>{x.title}</b>
                  <small>{x.text}</small>
                </span>
              </div>
            );
          })}
        </div>
      </section>
      <HomeFundingProjects />
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
    image: "/assets/news-solidarity-center-ai-v1.webp",
  });
  const [category, setCategory] = useState("Tümü");
  const fallbackItems = [
    {
      category: "Saha",
      date: "28 Temmuz 2026",
      title: "Yeni dayanışma merkezi hizmete açıldı",
      summary:
        "Yerel gönüllüler ve uzman ekiplerin birlikte yürüteceği merkez; eğitim, sosyal destek ve ihtiyaç yönlendirme çalışmalarına ev sahipliği yapacak.",
      image: "/assets/news-solidarity-center-ai-v1.webp",
    },
    {
      category: "Eğitim",
      date: "24 Temmuz 2026",
      title: "Çocuk akademilerinde yaz dönemi başladı",
      summary:
        "Bilim, sanat, kültür ve sosyal sorumluluk atölyeleriyle çocukların merakını ve üretme cesaretini destekliyoruz.",
      image: "/assets/news-children-academy-ai-v1.webp",
    },
    {
      category: "Su",
      date: "21 Temmuz 2026",
      title: "Yeni kuyumuz 1.200 kişiye temiz su ulaştırıyor",
      summary:
        "Su analizi ve bakım eğitimi tamamlanan proje, köyün günlük temiz su ihtiyacını güvenli biçimde karşılamaya başladı.",
      image: "/assets/news-water-well-ai-v1.webp",
    },
    {
      category: "Afet",
      date: "17 Temmuz 2026",
      title: "Arama kurtarma ekibimiz bölgesel tatbikattaydı",
      summary:
        "Saha güvenliği, haberleşme ve ekip koordinasyonu başlıklarında iki gün süren uygulamalı eğitim tamamlandı.",
      image: "/assets/program-rescue.jpg",
    },
    {
      category: "Sağlık",
      date: "12 Temmuz 2026",
      title: "Katarakt programında yeni dönem muayeneleri tamamlandı",
      summary:
        "Uzman hekim değerlendirmesinden geçen hastalar için ameliyat ve kontrol takvimi oluşturuldu.",
      image: "/assets/program-cataract.jpg",
    },
    {
      category: "Gönüllülük",
      date: "08 Temmuz 2026",
      title: "Yeni gönüllülerimiz oryantasyon programında buluştu",
      summary:
        "Sorumluluk bilinci, çocuk koruma, saha etiği ve görev güvenliği eğitimlerinin ardından ekip eşleştirmeleri yapıldı.",
      image: "/assets/program-volunteer.jpg",
    },
  ];
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
  const stories = {
    1: {
      category: "Saha",
      date: "28 Temmuz 2026",
      title: "Yeni dayanışma merkezi hizmete açıldı",
      image: "/assets/news-solidarity-center-ai-v1.webp",
      lead: "Yerel gönüllüler ve uzman ekiplerin birlikte yürüteceği merkez; eğitim, sosyal destek ve ihtiyaç yönlendirme çalışmalarına ev sahipliği yapacak.",
    },
    2: {
      category: "Eğitim",
      date: "24 Temmuz 2026",
      title: "Çocuk akademilerinde yaz dönemi başladı",
      image: "/assets/news-children-academy-ai-v1.webp",
      lead: "Bilim, sanat, kültür ve sosyal sorumluluk atölyeleriyle çocukların merakını ve üretme cesaretini destekliyoruz.",
    },
    3: {
      category: "Su",
      date: "21 Temmuz 2026",
      title: "Yeni kuyumuz 1.200 kişiye temiz su ulaştırıyor",
      image: "/assets/news-water-well-ai-v1.webp",
      lead: "Su analizi ve bakım eğitimi tamamlanan proje, köyün günlük temiz su ihtiyacını güvenli biçimde karşılamaya başladı.",
    },
  };
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
          <div className="callout">
            <ShieldCheck />
            <div>
              <h3>Doğrulanmış saha bilgisi</h3>
              <p>
                Bu haber proje sorumlusu kayıtları, saha notları ve görsel
                belgeler karşılaştırılarak hazırlanmıştır.
              </p>
            </div>
          </div>
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
          : `url(${image || "/assets/hero-solidarity-branded-v3.png"})`,
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

function ContentPage() {
  const { content } = useCms();
  const loc = useLocation();
  const slug = loc.pathname.split("/").filter(Boolean).pop();
  const isWork = loc.pathname.includes("calismalarimiz");
  const profile =
    content.pages?.[slug] ||
    pageProfiles[slug] ||
    pageProfiles[isWork ? "insani-yardim" : "hakkimizda"];
  const title = profile.title || slugMap[slug] || "Yedirenk";
  const img = profile.image;
  if (
    ["hakkimizda", "ilham-kaynagimiz", "misyon-vizyon", "kurumsal"].includes(
      slug,
    )
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
            <h2 id="Yaklaşımımız">{title}</h2>
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

function SimpleCorporatePage({ profile, title, slug }) {
  const introductions = {
    hakkimizda:
      "Yedirenk; insanı, bilgiyi, kültürü, güveni ve yardımlaşmayı merkeze alan bir dayanışma hareketidir. Çalışmalarımızı ihtiyaç analizi, açık sorumluluklar ve ölçülebilir sonuçlarla yürütürüz.",
    "ilham-kaynagimiz":
      "Farklı imkânlara sahip insanların aynı iyilik düşüncesinde buluşmasından ilham alıyoruz. Ebabil sembolü bizim için gayreti, sorumluluğu ve iyiliği doğru yere ulaştırma bilincini temsil eder.",
    "misyon-vizyon":
      "Misyonumuz insan onurunu koruyan yardımı, bilgiyi çoğaltan eğitimi ve toplumsal dayanışmayı sürdürülebilir çalışmalara dönüştürmektir. Vizyonumuz güvenilir ve kalıcı etki üreten bir iyilik modeli oluşturmaktır.",
    kurumsal:
      "Kurumsal yapımızda yetki, sorumluluk ve denetim açık biçimde tanımlanır. Kararlar kayıtlı süreçlerle alınır; kaynak kullanımı ve proje sonuçları hesap verebilirlik ilkesiyle takip edilir.",
  };
  const sectionLabels = {
    hakkimizda: "YEDİRENK’İ TANIYIN",
    "ilham-kaynagimiz": "BİZE YÖN VEREN DEĞERLER",
    "misyon-vizyon": "AMAÇ VE GELECEK YAKLAŞIMI",
    kurumsal: "YAPI VE SORUMLULUK",
  };
  return (
    <main className="simple-corporate-page">
      <section className="container simple-corporate-heading">
        <span>KURUMSAL</span>
        <h1>{title}</h1>
        <p>{profile.lead}</p>
      </section>
      <section className="container simple-corporate-content">
        <article className="corporate-intro-card">
          <div>
            <Landmark />
            <span>
              <small>{sectionLabels[slug]}</small>
              <h2>{title}</h2>
            </span>
          </div>
          <p>{introductions[slug]}</p>
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
        <div className="corporate-contact-strip">
          <span>
            <b>Daha fazla bilgiye mi ihtiyacınız var?</b>
            Kurumsal yapımız ve çalışmalarımız hakkında bizimle iletişime
            geçebilirsiniz.
          </span>
          <Link className="btn navy" to="/iletisim">
            İletişime geç <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}

const temporaryBankAccounts = [
  {
    bank: "Türkiye Katılım Bankası",
    branch: "İstanbul Merkez Şubesi",
    currency: "Türk Lirası",
    code: "TRY",
    iban: "TR00 0000 0000 0000 0000 0000 00",
  },
  {
    bank: "Bereket Katılım Bankası",
    branch: "Fatih Şubesi",
    currency: "Amerikan Doları",
    code: "USD",
    iban: "TR00 0000 0000 0000 0000 0000 01",
  },
  {
    bank: "Birlik Katılım Bankası",
    branch: "Üsküdar Şubesi",
    currency: "Euro",
    code: "EUR",
    iban: "TR00 0000 0000 0000 0000 0000 02",
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
          Bağışlarınızı banka hesaplarımız üzerinden güvenli biçimde
          ulaştırabilirsiniz.
        </p>
      </section>
      <section className="container bank-accounts-content">
        <div className="temporary-account-note">
          <BadgeCheck />
          <span>
            <b>Geçici örnek bilgiler</b>
            Aşağıdaki hesap numaraları tasarım gösterimi içindir; gerçek para
            transferinde kullanılamaz.
          </span>
        </div>
        <div className="bank-account-grid">
          {temporaryBankAccounts.map((account) => (
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
                  <dd>Yedirenk Derneği</dd>
                </div>
                <div>
                  <dt>Şube</dt>
                  <dd>{account.branch}</dd>
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
  const [values, setValues] = useState({ try: "", usd: "", eur: "", gbp: "", gold24: "", gold22: "", gold18: "", silver: "", ticari: "", yatirim: "", alacak: "", borc: "" });
  const [units, setUnits] = useState({ ticari: "TRY", yatirim: "TRY", alacak: "TRY", borc: "TRY" });
  const [rates, setRates] = useState({ USD: 47.695, EUR: 55.11, GBP: 64.41, gold24: 6729, silver: 82.5 });
  const [rateState, setRateState] = useState({ loading: true, live: false, updated: "" });
  const numeric = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };
  const loadRates = async () => {
    setRateState((s) => ({ ...s, loading: true }));
    try {
      const [fxResponse, goldResponse, silverResponse] = await Promise.all([
        fetch("https://api.frankfurter.app/latest?from=USD&to=TRY,EUR,GBP"),
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://api.gold-api.com/price/XAG"),
      ]);
      if (!fxResponse.ok || !goldResponse.ok || !silverResponse.ok) throw new Error("rate-fetch");
      const [fx, gold, silver] = await Promise.all([fxResponse.json(), goldResponse.json(), silverResponse.json()]);
      const usdTry = Number(fx.rates.TRY);
      const next = {
        USD: usdTry,
        EUR: usdTry / Number(fx.rates.EUR),
        GBP: usdTry / Number(fx.rates.GBP),
        gold24: (Number(gold.price) * usdTry) / 31.1034768,
        silver: (Number(silver.price) * usdTry) / 31.1034768,
      };
      if (Object.values(next).some((x) => !Number.isFinite(x) || x <= 0)) throw new Error("invalid-rate");
      setRates(next);
      setRateState({ loading: false, live: true, updated: gold.updatedAt || new Date().toISOString() });
    } catch {
      setRateState({ loading: false, live: false, updated: "" });
    }
  };
  useEffect(() => { loadRates(); }, []);
  const asTry = (value, unit = "TRY") => numeric(value) * (unit === "TRY" ? 1 : rates[unit]);
  const goldTotal = numeric(values.gold24) * rates.gold24 + numeric(values.gold22) * rates.gold24 * (22 / 24) + numeric(values.gold18) * rates.gold24 * (18 / 24);
  const currencyTotal = numeric(values.try) + asTry(values.usd, "USD") + asTry(values.eur, "EUR") + asTry(values.gbp, "GBP");
  const otherTotal = asTry(values.ticari, units.ticari) + asTry(values.yatirim, units.yatirim) + asTry(values.alacak, units.alacak);
  const total = Math.max(0, goldTotal + numeric(values.silver) * rates.silver + currencyTotal + otherTotal - asTry(values.borc, units.borc));
  const nisab = rates.gold24 * 80.18;
  const isAboveNisab = total >= nisab;
  const zakat = isAboveNisab ? Math.round(total * 0.025 * 100) / 100 : 0;
  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const amountInput = (key, suffix) => (
    <span className="zakat-input"><input aria-label={suffix} type="number" inputMode="decimal" min="0" value={values[key]} step="0.01" placeholder="0" onChange={(e) => setValue(key, e.target.value)} /><em>{suffix}</em></span>
  );
  const moneyInput = (key) => (
    <span className="zakat-input zakat-money-input"><input type="number" inputMode="decimal" min="0" value={values[key]} step="0.01" placeholder="0" onChange={(e) => setValue(key, e.target.value)} /><select aria-label="Para birimi" value={units[key]} onChange={(e) => setUnits((current) => ({ ...current, [key]: e.target.value }))}>{["TRY", "USD", "EUR", "GBP"].map((unit) => <option key={unit}>{unit}</option>)}</select></span>
  );
  const addZakat = () => {
    if (zakat <= 0) return;
    add({
      slug: `zekat-hesaplama-${zakat}`,
      tag: "Zekât",
      title: "Hesaplanan Zekât",
      desc: `${money(total)} net zekâta tabi varlık üzerinden %2,5 oranında hesaplandı.`,
      price: zakat,
      currency: "TRY",
      raised: 0,
      image: "/assets/project-zakat-yedirenk-v1.png",
      active: true,
    });
  };
  return (
    <main className="zakat-page">
      <section className="zakat-hero" style={{ "--zakat-hero-image": `url(${page.image})` }}>
        <div className="container zakat-hero-inner">
          <div className="zakat-hero-copy">
            <span className="zakat-kicker"><Sparkles /> YEDİRENK DERNEĞİ</span>
            <h1>Zekât<br /><em>Hesaplama</em></h1>
            <p><strong>Varlığını hesapla, iyiliğini paylaş.</strong> Altın, döviz ve tüm birikimlerinizi güncel piyasa değerleriyle tek ekranda hesaplayın.</p>
            <div className="zakat-hero-trust"><span><Check /> Güncel kurlar</span><span><Check /> Güvenli hesaplama</span><span><Check /> Ücretsiz</span></div>
          </div>
          <div className="zakat-hero-badge"><span>%</span><b>2,5</b><small>Zekât oranı</small></div>
        </div>
      </section>
      <section className="section zakat-section">
        <div className="container zakat-shell">
          <div className="zakat-main">
            <div className="zakat-step-title"><span>01</span><div><small>VARLIKLARINIZ</small><h2>{page.sectionTitle}</h2></div></div>
            <p className="zakat-lead">Varlıklarınızı kendi birimiyle girin; tüm tutarlar güncel fiyatlarla otomatik olarak TL karşılığına çevrilir.</p>
            <div className="zakat-rates-head"><div><b>Güncel piyasa değerleri</b><small>{rateState.live ? `Canlı veri · ${new Date(rateState.updated).toLocaleString("tr-TR")}` : "Geçici olarak yedek fiyatlar kullanılıyor"}</small></div><button type="button" onClick={loadRates} disabled={rateState.loading} aria-label="Fiyatları yenile"><RefreshCw className={rateState.loading ? "spin" : ""} /></button></div>
            <div className="zakat-rates">
              {[["USD", "Dolar"], ["EUR", "Euro"], ["GBP", "Sterlin"], ["gold24", "Gram altın"], ["silver", "Gram gümüş"]].map(([key, label]) => <div key={key}><span>{label}</span><b>{rates[key].toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺</b></div>)}
            </div>
            <div className="zakat-group"><h3>Altın ve kıymetli madenler <small>Gram olarak girin</small></h3>{[["gold24", "24 ayar altın", "gram"], ["gold22", "22 ayar / bilezik", "gram"], ["gold18", "18 ayar altın", "gram"], ["silver", "Gümüş", "gram"]].map(([k,l,s]) => <label key={k}><span>{l}</span>{amountInput(k,s)}</label>)}</div>
            <div className="zakat-group"><h3>Nakit ve döviz <small>Kendi para biriminde girin</small></h3>{[["try", "Türk lirası", "₺"], ["usd", "Amerikan doları", "$"], ["eur", "Euro", "€"], ["gbp", "İngiliz sterlini", "£"]].map(([k,l,s]) => <label key={k}><span>{l}</span>{amountInput(k,s)}</label>)}</div>
            <div className="zakat-group"><h3>Diğer varlıklar ve borçlar</h3>{[["ticari", "Ticari mallar"], ["yatirim", "Hisse ve yatırımlar"], ["alacak", "Tahsil edilebilir alacaklar"], ["borc", "Kısa vadeli borçlar (düşülür)"]].map(([k,l]) => <label key={k} className={k === "borc" ? "is-debt" : ""}><span>{l}</span>{moneyInput(k)}</label>)}</div>
          </div>
          <div className="calc-result">
            <div className="zakat-result-icon"><Calculator /></div>
            <span>TAHMİNİ ZEKÂT TUTARI</span>
            <b>
              {zakat.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺
            </b>
            <p>Hesaplanan net varlık: {money(total)}</p>
            <div className="zakat-result-breakdown"><span><small>Toplam varlık</small><b>{money(goldTotal + numeric(values.silver) * rates.silver + currencyTotal + otherTotal)}</b></span><span><small>Düşülen borç</small><b>− {money(asTry(values.borc, units.borc))}</b></span></div>
            <div className={`nisab-status ${isAboveNisab ? "met" : "below"}`}><b>{isAboveNisab ? "Nisap eşiği aşıldı" : "Nisap eşiğinin altında"}</b><span>80,18 gram altın karşılığı: {money(nisab)}</span></div>
            <p className="zakat-formula">
              Net varlığın %2,5’i esas alınmıştır.
            </p>
            <button
              disabled={zakat <= 0}
              className="btn orange"
              onClick={addZakat}
            >
              Zekâtımı sepete ekle <ShoppingBag />
            </button>
            <small>{page.note}</small>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormPage({ kind = "İletişim" }) {
  const { content } = useCms();
  const pageKey = kind.includes("Gönüllü")
    ? "volunteer"
    : kind.includes("İş Birliği")
      ? "sponsor"
      : "contact";
  const page = getSitePage(content, pageKey);
  const isVolunteer = pageKey === "volunteer";
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
          {sent ? (
            <div className="success">
              <BadgeCheck />
              <h3>Başvurunuz alındı.</h3>
              <p>Teşekkür ederiz. Ekibimiz sizinle iletişime geçecek.</p>
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
                  <input
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                  />
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
                <input name="consent" type="checkbox" required /> Kişisel
                verilerimin bu başvuru kapsamında işlenmesini kabul ediyorum.
              </label>
              <button className="btn navy" disabled={busy}>
                {busy ? "Kaydediliyor…" : "Başvuruyu Gönder"} <ArrowRight />
              </button>
            </form>
          )}
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
  const projectMenuItems = projects.filter(
    (project, index, list) =>
      project.category !== "Yetim" ||
      list.findIndex((item) => item.category === "Yetim") === index,
  );
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
              const Icon = projectIcons[p.slug] || HandHeart;
              const isOrphanGroup = p.category === "Yetim";
              return (
                <Link key={p.slug} to={`/projeler/${p.slug}`}>
                  <Icon />
                  <span>{isOrphanGroup ? "Yetim" : p.title}</span>
                </Link>
              );
            })}
          </nav>
          <div className="project-result-head">
            <div>
              <span>PROJELERİMİZ</span>
              <h2>{page.sectionTitle}</h2>
            </div>
            <p>{projects.length} proje</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} add={add} />
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
            min="1"
            step="1"
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
  const Icon = projectIcons[project.slug] || HandHeart;
  const isOrphanGroup = project.category === "Yetim";
  const projectMenuItems = projects.filter(
    (item, index, list) =>
      item.category !== "Yetim" ||
      list.findIndex((candidate) => candidate.category === "Yetim") === index,
  );
  const qurbaniDefaultIndex = Math.max(
    0,
    project.variants.findIndex((variant) => variant[0] === "Afrika"),
  );
  const qurbaniDefault = project.variants[qurbaniDefaultIndex];
  const rawCards = isOrphanGroup
    ? projects
        .filter((item) => item.category === "Yetim")
        .map((item) => ({
          variant: getPrimaryProjectVariant(item),
          index: 0,
          cardProject: item,
        }))
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
      : project.variants;
  const cards = (isOrphanGroup
    ? rawCards
    : rawCards.map((variant, index) => ({
        variant,
        index:
          project.slug === "adak-akika-nafile-kurban"
            ? qurbaniDefaultIndex
            : index,
        cardProject: project,
      })))
    .filter(({ variant }, index, list) =>
      project.slug === "su-kuyusu"
        ? list.findIndex(
            (item) =>
              item.variant[0].split(" · ")[0] === variant[0].split(" · ")[0],
          ) === index
        : true,
    );
  return (
    <main className="project-group-page">
      <section className="container project-group-heading">
        <span>{project.category}</span>
        <h1>{isOrphanGroup ? "Yetim" : project.title}</h1>
        <p>
          {isOrphanGroup
            ? "Yetim çocukların düzenli ihtiyaçlarına destek olun; hamilik veya giydirme projesini seçin."
            : project.short}
        </p>
      </section>
      <section
        className="container project-group-tabs"
        aria-label="Proje grupları"
      >
        {projectMenuItems.map((item) => {
          const ItemIcon = projectIcons[item.slug] || HandHeart;
          const itemIsOrphanGroup = item.category === "Yetim";
          return (
            <Link
              className={
                itemIsOrphanGroup
                  ? isOrphanGroup
                    ? "active"
                    : ""
                  : item.slug === project.slug
                    ? "active"
                    : ""
              }
              key={item.slug}
              to={`/projeler/${item.slug}`}
            >
              <ItemIcon />
              <span>{itemIsOrphanGroup ? "Yetim" : item.title}</span>
              <small>
                {itemIsOrphanGroup
                  ? projects.filter((candidate) => candidate.category === "Yetim")
                      .length
                  : Math.max(1, item.variants.length)}
              </small>
            </Link>
          );
        })}
      </section>
      <section className="container project-group-results">
        <div className="project-group-title">
          <div>
            <Icon />
            <span>
              <small>PROJE SEÇENEKLERİ</small>
              <h2>{isOrphanGroup ? "Yetim" : project.title}</h2>
            </span>
          </div>
          <b>{cards.length} seçenek</b>
        </div>
        <div className="project-variant-grid">
          {cards.map(({ variant, index, cardProject }) => (
            <article
              className={`project-variant-card ${
                cardProject.slug === "gida-kolisi" ? "food-package-card" : ""
              }`}
              key={`${cardProject.slug}-${variant[0]}`}
            >
              <div className="project-variant-image">
                <Media
                  src={projectVariantImage(cardProject, index)}
                  alt={cardProject.title + " " + variant[0]}
                />
              </div>
              <div className="project-variant-copy">
                <h3>
                  {isOrphanGroup
                    ? cardProject.title
                    : project.slug === "su-kuyusu"
                    ? variant[0].split(" · ")[0]
                    : variant[0]}
                </h3>
                <p>{cardProject.short}</p>
                {cardProject.slug === "gida-kolisi" ? (
                  <FoodPackageQuickDonation
                    project={cardProject}
                    variant={variant}
                    add={add}
                  />
                ) : (
                  <div>
                    <b>
                      {cardProject.calculator
                        ? "Tutarınızı hesaplayın"
                        : variant[1]
                          ? money(variant[1], variant[2])
                          : "Fiyat yakında"}
                    </b>
                    {cardProject.calculator ? (
                      <Link to="/zekat-hesapla">
                        HESAPLA <ArrowRight />
                      </Link>
                    ) : (
                      <Link
                        to={`/projeler/${cardProject.slug}/detay?secim=${index}`}
                      >
                        DETAYLARI GÖR <ArrowRight />
                      </Link>
                    )}
                  </div>
                )}
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
          <span>{project.category}</span>
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
            <h3>{project.title}</h3>
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
                      Sepete ekle <Plus />
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
          <div className="simple-image-brand">
            <span>{project.category}</span>
          </div>
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
                  Sepete Ekle <ShoppingBag />
                </button>
              )}
            </>
          )}
        </aside>
      </section>
      <section className="container simple-project-description">
        <article>
          <h2>{project.title}</h2>
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
          <div className="simple-image-brand">
            <span>{project.category}</span>
          </div>
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
                  min="1"
                  step="1"
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
                    min="1"
                    step="1"
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
            <span>Sepete eklenecek tutar</span>
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
            Sepete Ekle <ShoppingBag />
          </button>
        </aside>
      </section>
      <section className="container simple-project-description">
        <article>
          <h2>{project.title} hakkında</h2>
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

function ProjectDetailVerenel({ add }) {
  const { content } = useCms();
  const projects = getProjects(content);
  const { slug } = useParams(),
    [params] = useSearchParams(),
    project = projects.find((x) => x.slug === slug),
    requestedChoice = Number(
      params.get("secim") ??
        (project?.slug === "adak-akika-nafile-kurban"
          ? Math.max(
              0,
              project.variants.findIndex((variant) => variant[0] === "Afrika"),
            )
          : 0),
    ),
    initialChoice =
      Number.isInteger(requestedChoice) &&
      requestedChoice >= 0 &&
      requestedChoice < (project?.variants?.length || 0)
        ? requestedChoice
        : 0,
    [choice, setChoice] = useState(initialChoice),
    first = project?.variants?.[initialChoice],
    [amount, setAmount] = useState(first?.[1] ? String(first[1]) : ""),
    [months, setMonths] = useState(1);
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
    monthlySponsorship = project.slug === "yetim-hamiligi",
    isQurbani = project.slug === "adak-akika-nafile-kurban",
    minimumAmount = 1,
    finalAmount = monthlySponsorship
      ? Number(variant?.[1] || 0) * months
      : isQurbani
        ? Number(variant?.[1] || 0)
        : Number(amount),
    presets =
      currency === "USD" ? [100, 250, 500, 1000] : [500, 1000, 2000, 5000],
    copy = project.details ||
      projectLongCopy[project.slug] || [project.description];
  const selectVariant = (i) => {
    const index = Number(i);
    setChoice(index);
    setAmount(
      project.variants[index]?.[1] ? String(project.variants[index][1]) : "",
    );
  };
  const donate = () => {
    if (!Number.isFinite(finalAmount) || finalAmount < minimumAmount) return;
    if (isQurbani && finalAmount !== Number(variant?.[1])) return;
    add({
      slug: `${project.slug}-${choice}-${finalAmount}`,
      tag: project.category,
      title: isQurbani
        ? `${project.title} · ${variant[0]}`
        : `${project.title} · ${monthlySponsorship ? `${months} Ay` : variant[0]}`,
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
      <div className="container verenel-title">
        <h1>{project.title}</h1>
        <div>
          <Link to={`/projeler/${project.slug}`}>{project.category}</Link>
          <ChevronRight />
          <span>
            {project.slug === "su-kuyusu"
              ? variant?.[0]?.split(" · ")[0]
              : variant?.[0] || project.title}
          </span>
        </div>
      </div>
      <section className="container simple-project-top verenel-project-top">
        <div className="simple-project-visual">
          <Media
            src={projectVariantImage(project, choice)}
            alt={project.title}
          />
          <div className="simple-image-brand">
            <span>{project.category}</span>
          </div>
        </div>
        <aside className="simple-donation-form verenel-donation-form">
          <h2>{project.title}</h2>
          <p>{project.short}</p>
          <h3>Bağış Yap</h3>
          {project.calculator && (
            <Link className="zakat-calc-link" to="/zekat-hesapla">
              Zekâtını hesapla <Calculator />
            </Link>
          )}
          {project.variants.length > 1 && (
            <label>
              Varyant Seçimi <em>*</em>
              <select
                required
                value={choice}
                onChange={(e) => selectVariant(e.target.value)}
              >
                {project.variants.map((v, i) => (
                  <option key={v[0]} value={i} disabled={!v[1]}>
                    {project.slug === "su-kuyusu"
                      ? v[0].split(" · ")[1] || v[0]
                      : v[0]}{" "}
                    {v[1] ? `— ${money(v[1], v[2])}` : "— Fiyat yakında"}
                  </option>
                ))}
              </select>
            </label>
          )}
          {monthlySponsorship && (
            <label>
              Hamilik Süresi <em>*</em>
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month} Ay —{" "}
                    {money(Number(variant?.[1] || 0) * month, currency)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            {monthlySponsorship ? "Toplam Hamilik Tutarı" : "Bağış Tutarı"}
            <div className="donation-amount-input">
              <input
                aria-label="Bağış Tutarı"
                type="number"
                min={minimumAmount}
                step="1"
                inputMode="decimal"
                placeholder="0,00"
                value={monthlySponsorship ? finalAmount : amount}
                readOnly={monthlySponsorship || isQurbani}
                onChange={(e) =>
                  !monthlySponsorship && !isQurbani && setAmount(e.target.value)
                }
              />
              <i>{currency === "USD" ? "$" : "₺"}</i>
            </div>
          </label>
          {!monthlySponsorship && !isQurbani && (
            <div className="quick-amounts">
              {presets.map((x) => (
                <button
                  type="button"
                  className={finalAmount === x ? "active" : ""}
                  onClick={() => setAmount(String(x))}
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
      <section className="container simple-project-description">
        <article>
          <h2>Detaylı Bilgi</h2>
          <div className="project-detail-facts">
            <div>
              <b>
                {finalAmount > 0
                  ? money(finalAmount, currency)
                  : "Serbest tutar"}
              </b>
              <span>Seçili proje tutarı</span>
            </div>
            <div>
              <b>
                {project.slug === "su-kuyusu"
                  ? variant?.[0]?.split(" · ")[0]
                  : variant?.[0] || project.category}
              </b>
              <span>Uygulama bölgesi</span>
            </div>
            <div>
              <b>{project.beneficiaries || "Doğrulanmış ihtiyaç sahipleri"}</b>
              <span>{project.scope || "Öncelikli yararlanıcı grubu"}</span>
            </div>
          </div>
          {copy.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      </section>
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
  const [mode, setMode] = useState(
      location.pathname === "/kayit" ? "register" : "login",
    ),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [user, setUser] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("yedirenk-user-session"));
      } catch {
        return null;
      }
    });
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
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
  };
  return (
    <main>
      <PageHero
        tag={page.tag}
        title={user ? page.userTitle : page.title}
        text={page.text}
        image={page.image}
      />
      <section className="section account-section">
        <div className="container account-shell">
          {user ? (
            <div className="account-welcome">
              <CircleUserRound />
              <span>HOŞ GELDİNİZ</span>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <Link className="btn orange" to="/projeler">
                Bağış yap <ArrowRight />
              </Link>
              <button onClick={logout}>Güvenli çıkış</button>
            </div>
          ) : (
            <>
              <div className="account-intro">
                <span className="kicker">YEDİRENK HESABIM</span>
                <h2>{page.sectionTitle}</h2>
                <p>{page.sectionText}</p>
                <ul>
                  <li>
                    <Check /> Güvenli hesap ve şifre saklama
                  </li>
                  <li>
                    <Check /> Hızlı bağış işlemleri
                  </li>
                  <li>
                    <Check /> Bağış geçmişi için hazır altyapı
                  </li>
                </ul>
              </div>
              <form className="account-form" onSubmit={submit}>
                <div className="account-tabs">
                  <button
                    type="button"
                    className={mode === "login" ? "active" : ""}
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                    }}
                  >
                    Giriş Yap
                  </button>
                  <button
                    type="button"
                    className={mode === "register" ? "active" : ""}
                    onClick={() => {
                      setMode("register");
                      setMessage("");
                    }}
                  >
                    Kayıt Ol
                  </button>
                </div>
                <h3>
                  {mode === "login"
                    ? "Hesabınıza giriş yapın"
                    : "Yeni bağışçı hesabı oluşturun"}
                </h3>
                {mode === "register" && (
                  <div className="payment-grid">
                    <label>
                      Ad
                      <input
                        name="firstName"
                        required
                        maxLength="80"
                        autoComplete="given-name"
                      />
                    </label>
                    <label>
                      Soyad
                      <input
                        name="lastName"
                        required
                        maxLength="80"
                        autoComplete="family-name"
                      />
                    </label>
                    <label className="wide">
                      Telefon
                      <input
                        name="phone"
                        required
                        maxLength="30"
                        autoComplete="tel"
                      />
                    </label>
                  </div>
                )}
                <label>
                  E-posta
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength="254"
                    autoComplete="email"
                  />
                </label>
                <label>
                  Şifre
                  <input
                    name="password"
                    type="password"
                    required
                    minLength="8"
                    maxLength="128"
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                  />
                </label>
                {message && (
                  <p
                    className={
                      message.includes("Başarı") ||
                      message.includes("oluşturuldu")
                        ? "account-message success"
                        : "account-message"
                    }
                  >
                    {message}
                  </p>
                )}
                <button disabled={busy} className="btn navy">
                  {busy
                    ? "İşleniyor…"
                    : mode === "login"
                      ? "Giriş Yap"
                      : "Kayıt Ol"}{" "}
                  <ArrowRight />
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Cart({ items, setItems, onClose }) {
  const total = items.reduce(
      (n, x) => n + toTRY(x.price * x.qty, x.currency || "TRY"),
      0,
    ),
    totalLabel = money(total, "TRY");
  const [checkout, setCheckout] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(""),
    [kvkkOpen, setKvkkOpen] = useState(false);
  useEffect(() => {
    if (checkout)
      track("checkout_start", {
        amount: total,
        campaigns: items.map((x) => x.slug),
      });
  }, [checkout]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    description: "",
    country: "Türkiye",
    city: "",
    district: "",
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
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
      if (!form.city || !form.district)
        throw new Error(
          "Ödemeyi tamamlamak için il ve ilçe seçimi zorunludur.",
        );
      if (!form.description.trim())
        throw new Error("Açıklama alanı zorunludur.");
      if (
        form.firstName.length > 80 ||
        form.lastName.length > 80 ||
        form.email.length > 254 ||
        form.phone.length > 30 ||
        form.city.length > 100 ||
        form.description.length > 500
      )
        throw new Error("Girilen bilgiler izin verilen uzunluğu aşıyor.");
      const base = (
        import.meta.env.VITE_PANEL_API_URL ||
        import.meta.env.VITE_VEFA_API_URL ||
        "http://localhost:3000"
      ).replace(/\/$/, "");
      if (
        !/^https:\/\//i.test(base) &&
        !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(base)
      )
        throw new Error("Güvenli ödeme bağlantısı yapılandırılmamış.");
      const response = await fetch(`${base}/api/public/online-donations`, {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          description: form.description.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          amount: total,
          campaign: items
            .map((item) => `${item.title} (${item.qty} adet)`)
            .join(", ")
            .slice(0, 500),
          consent: form.consent,
          website: form.website,
        }),
      });
      const data = await response.json();
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
        reason instanceof Error ? reason.message : "Ödeme tamamlanamadı.",
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
          <button aria-label="Kapat" onClick={onClose}>
            <X />
          </button>
        </div>
        {receipt ? (
          <div className="payment-success">
            <BadgeCheck />
            <span>ÖDEME BAŞARILI</span>
            <h3>Bağışınız için teşekkür ederiz.</h3>
            <p>
              Demo ödemeniz Yedirenk Derneği yönetim paneline başarıyla
              aktarıldı.
            </p>
            <b>Makbuz No: {receipt}</b>
            <button className="btn navy" onClick={onClose}>
              Tamam
            </button>
          </div>
        ) : checkout ? (
          <>
            <div className="checkout-steps">
              <span className="done">
                <b>1</b> Sepet
              </span>
              <i />
              <span className="active">
                <b>2</b> Ödeme
              </span>
              <i />
              <span>
                <b>3</b> Sonuç
              </span>
            </div>
            <form className="checkout-layout" onSubmit={pay}>
              <div className="checkout-main">
                <section className="member-callout">
                  <div>
                    <b>Üye misiniz?</b>
                    <span>
                      Giriş yaparak bilgilerinizi otomatik doldurun ve önceki
                      bağışlarınızı takip edin.
                    </span>
                  </div>
                  <Link to="/giris" onClick={onClose}>
                    Giriş Yap
                  </Link>
                </section>
                {error && <p className="payment-error">{error}</p>}
                <section className="checkout-card">
                  <h4>Ödeme</h4>
                  <label>
                    Kart üzerindeki ad
                    <input
                      required
                      autoComplete="cc-name"
                      placeholder="AD SOYAD"
                      value={form.cardName}
                      onChange={(e) => update("cardName", e.target.value)}
                    />
                  </label>
                  <label>
                    Kart numarası
                    <div className="card-input">
                      <CreditCard />
                      <input
                        required
                        autoComplete="cc-number"
                        inputMode="numeric"
                        pattern="[0-9 ]{16,19}"
                        maxLength="19"
                        placeholder="0000 0000 0000 0000"
                        value={form.cardNumber}
                        onChange={(e) =>
                          update(
                            "cardNumber",
                            e.target.value.replace(/[^0-9 ]/g, ""),
                          )
                        }
                      />
                    </div>
                  </label>
                  <div className="card-date-grid">
                    <label>
                      Ay
                      <select
                        required
                        autoComplete="cc-exp-month"
                        value={form.expiryMonth}
                        onChange={(e) => update("expiryMonth", e.target.value)}
                      >
                        <option value="">Ay</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Yıl
                      <select
                        required
                        autoComplete="cc-exp-year"
                        value={form.expiryYear}
                        onChange={(e) => update("expiryYear", e.target.value)}
                      >
                        <option value="">Yıl</option>
                        {Array.from(
                          { length: 12 },
                          (_, i) => new Date().getFullYear() + i,
                        ).map((y) => (
                          <option key={y}>{y}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      CVV
                      <input
                        required
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        pattern="[0-9]{3}"
                        maxLength="3"
                        placeholder="***"
                        value={form.cvv}
                        onChange={(e) =>
                          update("cvv", e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </label>
                  </div>
                </section>
                <section className="checkout-card personal-card">
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
                      placeholder="Bağışınızla ilgili açıklamanızı yazın"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </label>
                  <div className="location-warning">
                    Ödemeyi tamamlamak için il ve ilçe seçimi zorunludur.
                  </div>
                  <div className="location-grid">
                    <label>
                      Ülke
                      <select
                        required
                        value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                      >
                        <option>Türkiye</option>
                      </select>
                    </label>
                    <label>
                      Şehir
                      <select
                        required
                        value={form.city}
                        onChange={(e) => {
                          update("city", e.target.value);
                          update("district", "");
                        }}
                      >
                        <option value="">Lütfen Seçiniz</option>
                        {Object.keys(districts).map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      İlçe
                      <select
                        required
                        disabled={!form.city}
                        value={form.district}
                        onChange={(e) => update("district", e.target.value)}
                      >
                        <option value="">Lütfen Seçiniz</option>
                        {(districts[form.city] || []).map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
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
                        <Link to="/kurumsal/bilgi-guvenligi" onClick={onClose}>
                          Ayrıntılı bilgi sayfasını aç <ArrowRight />
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              <aside className="checkout-summary">
                <h4>Bağış Özeti</h4>
                {items.map((item) => (
                  <div className="summary-item" key={item.slug}>
                    <span>
                      <b>{item.title}</b>
                      <small>{item.qty} adet</small>
                    </span>
                    <strong>
                      {money(item.price * item.qty, item.currency || "TRY")}
                    </strong>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Toplam</span>
                  <b>{totalLabel}</b>
                </div>
                <div className="secure-payment">
                  <ShieldCheck />
                  <span>
                    <b>Güvenli ödeme</b>
                    <small>Kart bilgileriniz saklanmaz.</small>
                  </span>
                </div>
                <button disabled={loading} className="payment-submit">
                  {loading ? (
                    <>
                      <LoaderCircle className="spin" /> İşleniyor...
                    </>
                  ) : (
                    <>
                      {totalLabel} Bağış Yap <ArrowRight />
                    </>
                  )}
                </button>
                <small className="demo-note">
                  Bu bir demo ödeme ekranıdır; gerçek tahsilat yapılmaz.
                </small>
                <button
                  type="button"
                  className="payment-back"
                  onClick={() => setCheckout(false)}
                >
                  ← Sepete geri dön
                </button>
              </aside>
            </form>
          </>
        ) : !items.length ? (
          <div className="empty">
            <ShoppingBag />
            <h3>Sepetin henüz boş.</h3>
            <p>Bir kampanya seçerek iyiliğe ortak olabilirsin.</p>
            <Link to="/projeler" onClick={onClose} className="btn orange">
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
                <Link className="btn outline" to="/projeler" onClick={onClose}>
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
      <section className="newsletter">
        <div className="container">
          <div>
            <HeartHandshake />
            <span>
              <b>{f.newsletterTitle}</b>
              <small>{f.newsletterText}</small>
            </span>
          </div>
          <Link
            className="btn orange volunteer-footer-button"
            to="/katil/gonullu-ol"
          >
            {f.newsletterButton} <ArrowRight />
          </Link>
        </div>
      </section>
      <footer>
        <div className="container footer-grid">
          <div>
            <Logo light />
            <p>{f.brandText}</p>
            <div className="social">
              <a href={f.social.instagram} aria-label="Instagram">
                <Instagram />
              </a>
              <a href={f.social.facebook} aria-label="Facebook">
                <Facebook />
              </a>
              <a href={f.social.youtube} aria-label="YouTube">
                <Youtube />
              </a>
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
        if (node.parentElement?.closest("script,style,.admin-v2")) continue;
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
  const [cart, setCart] = useState([]),
    [drawer, setDrawer] = useState(false),
    [language, setLanguageState] = useState(
      () => localStorage.getItem("yedirenk-language") || "tr",
    );
  const loc = useLocation();
  const { content } = useCms();
  const setLanguage = (value) => {
    if (!content.languages?.[value]?.published) return;
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
    const started = Date.now();
    track("page_view");
    return () =>
      track("page_duration", {
        seconds: Math.max(1, Math.round((Date.now() - started) / 1000)),
      });
  }, [loc.pathname]);
  const add = (c) => {
    track("cart_add", { campaign: c.slug, title: c.title, amount: c.price });
    setCart((x) =>
      x.some((i) => i.slug === c.slug)
        ? x.map((i) => (i.slug === c.slug ? { ...i, qty: i.qty + 1 } : i))
        : [...x, { ...c, qty: 1 }],
    );
    setDrawer(true);
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
      <Header
        cart={cart}
        onCart={() => setDrawer(true)}
        language={language}
        setLanguage={setLanguage}
      />
      <Routes key={routeKey} location={loc}>
        <Route path="/" element={<Home add={add} />} />
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
      {drawer && (
        <Cart
          items={cart}
          setItems={setCart}
          onClose={() => setDrawer(false)}
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
