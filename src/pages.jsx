import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  HandHeart,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { pageContent, programDetails } from "./siteData";

const visualByPath = (path) =>
  path.includes("su")
    ? "/assets/child.webp"
    : path.includes("acil") || path.includes("yardim") || path.includes("gazze")
      ? "/assets/aid.webp"
      : path.includes("gonullu") || path.includes("sponsor")
        ? "/assets/volunteer.webp"
        : "/assets/education.webp";

const Field = ({ label, ...props }) => (
  <label className="form-field">
    <span>{label}</span>
    <input {...props} />
  </label>
);

function SuccessMessage({ children }) {
  return (
    <div className="success-message">
      <Check />
      {children}
    </div>
  );
}

function StandardContent({ data, path }) {
  return (
    <div className="container detail-grid">
      <article className="detail-copy">
        <span className="eyebrow">ÖZENLE VE GÜVENLE</span>
        <h2>
          Her adımda insan onuru,
          <br />
          <em>her işte güven.</em>
        </h2>
        <p>{data.summary}</p>
        <p>
          Yedirenk, yapılan çalışmanın büyüklüğünden önce samimiyetine ve
          sürdürülebilir etkisine odaklanır. İhtiyacı doğru tespit eder,
          kaynakları şeffaf biçimde yönetir ve sonuçları düzenli olarak
          paylaşır.
        </p>
        <div className="principle-row">
          <div>
            <ShieldCheck />
            <b>Şeffaflık</b>
            <small>Bağışların izlenebilir kullanımı</small>
          </div>
          <div>
            <HeartHandshake />
            <b>İnsan Onuru</b>
            <small>Hak temelli ve saygılı yaklaşım</small>
          </div>
          <div>
            <Landmark />
            <b>Sürdürülebilirlik</b>
            <small>Kalıcı ve ölçülebilir etki</small>
          </div>
        </div>
      </article>
      <aside className="detail-aside">
        <img src={visualByPath(path)} alt="" loading="lazy" decoding="async" />
        <div>
          <small>YEDİRENK YAKLAŞIMI</small>
          <p>“Gerçek iyilik gösterişte değil, samimiyettedir.”</p>
        </div>
      </aside>
    </div>
  );
}

function ProgramContent({ data, detail, pathname }) {
  const entries = Object.entries(programDetails);
  const currentIndex = entries.findIndex(([path]) => path === pathname);
  const related = [1, 2, 3].map(
    (step) => entries[(currentIndex + step) % entries.length],
  );
  return (
    <div className={`program-detail program-v-${currentIndex}`}>
      <section className="program-intro container">
        <div>
          <span className="eyebrow">YEDİRENK SAHADA</span>
          <h2>
            {data.title} için
            <br />
            <em>insan odaklı çözüm.</em>
          </h2>
          <p>{detail.lead}</p>
          <div className="program-actions">
            <Link className="btn btn-accent" to="/projeler">
              Destek Ol <ArrowRight />
            </Link>
            <Link className="text-link" to="/katil/gonullu-ol">
              Gönüllü Katıl <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="program-image">
          <img
            src={detail.image}
            alt={`${data.title} çalışmaları`}
            decoding="async"
          />
          <span>
            <ShieldCheck />
            <b>İhtiyaç odaklı</b>
            <small>Şeffaf ve izlenebilir çalışma modeli</small>
          </span>
        </div>
      </section>
      <section className="program-focus">
        <div className="container">
          <div className="program-heading">
            <span>ÇALIŞMA ALANLARI</span>
            <h2>Neler yapıyoruz?</h2>
            <p>
              Her destek kalemini sahadaki gerçek ihtiyaç, güvenlik ve
              sürdürülebilirlik kriterleriyle planlıyoruz.
            </p>
          </div>
          <div className="focus-grid">
            {detail.focus.map((x, i) => (
              <article key={x[0]}>
                <small>0{i + 1}</small>
                <span>
                  {
                    [
                      <HandHeart />,
                      <BookOpen />,
                      <HeartHandshake />,
                      <UsersRound />,
                    ][i]
                  }
                </span>
                <h3>{x[0]}</h3>
                <p>{x[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="program-process container">
        <div>
          <span className="eyebrow">ÇALIŞMA MODELİ</span>
          <h2>
            Desteği nasıl
            <br />
            <em>ulaştırıyoruz?</em>
          </h2>
          <p>
            Hız kadar doğruluğu, yardım kadar sürdürülebilir etkiyi önemsiyoruz.
          </p>
        </div>
        <ol>
          {detail.steps.map((x, i) => (
            <li key={x}>
              <span>{i + 1}</span>
              <div>
                <b>{x}</b>
                <small>
                  {i === 0
                    ? "Sahadan doğrulanmış bilgiyle başlarız."
                    : i === 1
                      ? "Kaynak ve uygulama planını oluştururuz."
                      : i === 2
                        ? "İnsan onurunu gözeterek uygularız."
                        : "Sonucu kayıt altına alır ve değerlendiririz."}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="program-callout">
        <div className="container">
          <img
            src="/assets/yedirenk-mark-transparent.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div>
            <span>BU ÇALIŞMAYA ORTAK OL</span>
            <h2>{detail.callout}</h2>
          </div>
          <Link className="btn btn-accent" to="/projeler">
            Şimdi Destek Ol <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="related-programs container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DİĞER ÇALIŞMALAR</span>
            <h2>
              İyiliğin diğer <em>kanatları</em>
            </h2>
          </div>
          <Link className="text-link" to="/calismalarimiz">
            Tümünü Gör <ArrowRight />
          </Link>
        </div>
        <div>
          {related.map(([path, item]) => (
            <Link to={path} key={path}>
              <img src={item.image} alt="" loading="lazy" decoding="async" />
              <b>{pageContent[path].title}</b>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ApplicationForm({ type, notify }) {
  const [sent, setSent] = useState(false);
  const titles = {
    volunteer: "Gönüllü başvurusu",
    sponsor: "İş birliği talebi",
    contact: "İletişim formu",
    career: "Kariyer başvurusu",
  };
  if (sent)
    return (
      <SuccessMessage>
        Başvurunuz alındı. Ekibimiz sizinle iletişime geçecek.
      </SuccessMessage>
    );
  return (
    <form
      className="application-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        notify?.("Form başarıyla gönderildi.");
      }}
    >
      <h3>{titles[type]}</h3>
      <p>
        Alanları eksiksiz doldurun; ilgili ekibimiz en kısa sürede dönüş yapsın.
      </p>
      <div className="form-grid">
        <Field label="Adınız Soyadınız" required placeholder="Ad Soyad" />
        <Field
          label="E-posta Adresiniz"
          type="email"
          required
          placeholder="ornek@eposta.com"
        />
        <Field
          label="Telefon Numaranız"
          required
          placeholder="05xx xxx xx xx"
        />
        <label className="form-field">
          <span>Konu</span>
          <select required defaultValue="">
            <option value="" disabled>
              Seçiniz
            </option>
            <option>Gönüllülük</option>
            <option>Kurumsal iş birliği</option>
            <option>Bağış ve destek</option>
            <option>Diğer</option>
          </select>
        </label>
      </div>
      <label className="form-field full">
        <span>Mesajınız</span>
        <textarea
          required
          rows="5"
          placeholder="Size nasıl yardımcı olabiliriz?"
        />
      </label>
      <label className="form-check">
        <input type="checkbox" required /> KVKK aydınlatma metnini okudum ve
        kabul ediyorum.
      </label>
      <button className="btn btn-primary" type="submit">
        Gönder <ArrowRight size={17} />
      </button>
    </form>
  );
}

function ZakatCalculator() {
  const [values, setValues] = useState({
    cash: "",
    gold: "",
    trade: "",
    debt: "",
  });
  const total = Math.max(
    0,
    (+values.cash || 0) +
      (+values.gold || 0) +
      (+values.trade || 0) -
      (+values.debt || 0),
  );
  const zakat = total * 0.025;
  return (
    <div className="tool-card">
      <h3>Zekâtınızı hesaplayın</h3>
      <p>Tutarları Türk lirası karşılığıyla girin.</p>
      <div className="form-grid">
        {[
          ["cash", "Nakit ve Birikim"],
          ["gold", "Altın ve Kıymetli Maden"],
          ["trade", "Ticari Mal Varlığı"],
          ["debt", "Vadesi Gelen Borçlar"],
        ].map(([key, label]) => (
          <Field
            key={key}
            label={label}
            type="number"
            min="0"
            value={values[key]}
            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            placeholder="0 ₺"
          />
        ))}
      </div>
      <div className="calculator-result">
        <span>Yaklaşık zekât tutarı</span>
        <b>{zakat.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺</b>
        <small>
          Toplam zekâta tabi tutar: {total.toLocaleString("tr-TR")} ₺
        </small>
      </div>
      <Link className="btn btn-accent" to="/projeler">
        Bağışa Devam Et <ArrowRight size={17} />
      </Link>
    </div>
  );
}

function LoginPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="login-wrap">
      <div className="login-info">
        <img
          src="/assets/yedirenk-mark-transparent.webp"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="eyebrow light">YEDİRENK HESABIM</span>
        <h2>
          İyilik yolculuğunu
          <br />
          tek yerden takip et.
        </h2>
        <ul>
          <li>
            <Check /> Bağışlarını görüntüle
          </li>
          <li>
            <Check /> Sponsorluklarını takip et
          </li>
          <li>
            <Check /> Gönüllülük programlarına katıl
          </li>
        </ul>
      </div>
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <h3>Hesabınıza giriş yapın</h3>
        <p>Bağışçı, sponsor veya gönüllü hesabınızla devam edin.</p>
        {sent && (
          <SuccessMessage>
            Demo giriş doğrulandı. Canlı üyelik servisi kuruluş sürecinde
            bağlanacaktır.
          </SuccessMessage>
        )}
        <Field label="E-posta" type="email" required />
        <Field label="Şifre" type="password" required />
        <button className="btn btn-primary">
          Giriş Yap <ArrowRight />
        </button>
        <a href="#sifre">Şifremi unuttum</a>
        <hr />
        <Link className="btn btn-outline" to="/katil/gonullu-ol">
          Yeni Hesap Oluştur
        </Link>
      </form>
    </div>
  );
}

function ListingPage({ type }) {
  const items =
    type === "news"
      ? [
          [
            "Yaz Atölyeleri Çocukların Hayalleriyle Renklendi",
            "18 Temmuz 2026",
            "/assets/education.webp",
          ],
          [
            "Dayanışma Paketlerimiz 250 Aileye Ulaştı",
            "11 Temmuz 2026",
            "/assets/aid.webp",
          ],
          [
            "Ortak Hafıza Buluşmaları Başladı",
            "04 Temmuz 2026",
            "/assets/child.webp",
          ],
        ]
      : [
          ["Çocuk Akademileri", "Eğitim", "/assets/education.webp"],
          ["Kültür Köprüleri", "Kültür", "/assets/child.webp"],
          ["Mahalle Dayanışması", "Yardımlaşma", "/assets/aid.webp"],
        ];
  return (
    <div className="container listing-grid">
      {items.map((x, i) => (
        <article key={x[0]}>
          <img src={x[2]} alt="" loading="lazy" decoding="async" />
          <div>
            <small>{x[1]}</small>
            <h3>{x[0]}</h3>
            <p>
              Yedirenk’in sahada yürüttüğü bu çalışma hakkında ayrıntılı bilgi
              ve güncel gelişmeler.
            </p>
            <Link to={type === "news" ? `/haberler/${i + 1}` : "/projeler"}>
              Detayları İncele <ArrowRight />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SitePage({ notify, addCart }) {
  const { pathname } = useLocation();
  if (pathname === "/giris")
    return (
      <main className="inner-main">
        <LoginPage />
      </main>
    );
  if (pathname === "/bagis" || pathname.startsWith("/bagis/"))
    return <Navigate to="/projeler" replace />;
  const data =
    pageContent[pathname] ||
    (pathname.startsWith("/haberler/") ? pageContent["/haberler"] : null);
  if (!data)
    return (
      <main className="inner-main">
        <PageHero
          data={{
            category: "404",
            title: "Sayfa Bulunamadı",
            summary:
              "Aradığınız sayfa taşınmış veya henüz hazırlanmamış olabilir.",
          }}
        />
        <div className="not-found">
          <Link className="btn btn-primary" to="/">
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  const isForm = [
    "/katil/gonullu-ol",
    "/katil/sponsor-ol",
    "/iletisim",
    "/kurumsal/insan-kaynaklari",
  ].includes(pathname);
  const program = programDetails[pathname];
  return (
    <main className="inner-main">
      <PageHero data={data} />
      {program ? (
        <ProgramContent data={data} detail={program} pathname={pathname} />
      ) : (
        <section className="inner-content">
          {pathname === "/zekat-hesapla" ? (
            <div className="container">
              <ZakatCalculator />
            </div>
          ) : pathname === "/haberler" ? (
            <ListingPage type="news" />
          ) : pathname === "/projeler" || pathname === "/calismalarimiz" ? (
            <ListingPage type="projects" />
          ) : isForm ? (
            <div className="container form-layout">
              <div>
                <h2>
                  Özenle ve güvenle
                  <br />
                  <em>birlikte yürüyelim.</em>
                </h2>
                <p>{data.summary}</p>
                <div className="contact-short">
                  <span>
                    <Mail /> bilgi@yedirenk.org.tr
                  </span>
                  <span>
                    <Phone /> 0 (212) 000 00 00
                  </span>
                  <span>
                    <MapPin /> İstanbul, Türkiye
                  </span>
                </div>
              </div>
              <ApplicationForm
                type={
                  pathname.includes("gonullu")
                    ? "volunteer"
                    : pathname.includes("sponsor")
                      ? "sponsor"
                      : pathname.includes("insan-kaynaklari")
                        ? "career"
                        : "contact"
                }
                notify={notify}
              />
            </div>
          ) : pathname === "/katil/bulten" ? (
            <div className="container">
              <ApplicationForm type="contact" notify={notify} />
            </div>
          ) : (
            <StandardContent data={data} path={pathname} />
          )}
        </section>
      )}
    </main>
  );
}

function PageHero({ data }) {
  return (
    <section className="page-hero">
      <div className="page-hero-pattern" />
      <div className="container">
        <span>{data.category}</span>
        <h1>{data.title}</h1>
        <p>{data.summary}</p>
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          <ArrowRight />
          {data.title}
        </div>
      </div>
    </section>
  );
}
