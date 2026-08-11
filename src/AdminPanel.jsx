import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  FileImage,
  Globe2,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelLeftClose,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Type,
  Upload,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCms } from "./cms";
import { getLocalAnalytics } from "./analytics";
import appSource from "./App.jsx?raw";

const NAV = [
  ["dashboard", LayoutDashboard, "Genel Bakış", "Sitenizin kısa özeti"],
  [
    "analytics",
    BarChart3,
    "Ziyaretçi Analitiği",
    "IP, sayfa süresi ve bağış dönüşümü",
  ],
  [
    "members",
    Users,
    "Kayıtlı Kullanıcılar",
    "Bağışçı hesapları ve kayıt tarihleri",
  ],
  ["home", Home, "Ana Sayfa", "Metinler, sayaçlar ve hikâye"],
  ["slides", Image, "Slider / Manşet", "Ana sayfa büyük görselleri"],
  [
    "projects",
    WalletCards,
    "Projeler",
    "Tüm projeler, kategoriler, içerikler ve ücretler",
  ],
  ["sitePages", Menu, "Sayfa İçerikleri", "Giriş, kayıt ve sayfa metinleri"],
  [
    "allContent",
    Search,
    "Tüm Metin ve Görseller",
    "Menüler, butonlar, formlar ve medya",
  ],
  [
    "languages",
    Globe2,
    "Dil Yönetimi",
    "Türkçe, İngilizce ve Arapça yayınları",
  ],
  ["news", Newspaper, "Haberler", "Haber ve duyurular"],
  ["pages", Menu, "Diğer Sayfalar", "Kurumsal ve çalışma sayfaları"],
  ["structure", Menu, "Menü ve Kartlar", "Üst menü ve çalışma alanları"],
  [
    "footer",
    PanelLeftClose,
    "Footer ve Bülten",
    "Alt menü ve sosyal bağlantılar",
  ],
  ["typography", Type, "Yazı Boyutları", "Başlık, metin ve buton ölçüleri"],
  ["settings", Settings, "Genel Ayarlar", "Logo ve iletişim bilgileri"],
];
const blankNews = {
  id: "",
  category: "Duyuru",
  date: new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }),
  title: "Yeni haber",
  summary: "Haber özeti",
  body: "Haber metni",
  image: "/assets/news-hero-logo-v5.png",
  active: true,
};
const blankSlide = {
  image: "/assets/hero.jpg",
  tag: "YENİ MANŞET",
  title: "Yeni manşet",
  text: "Manşet açıklaması",
  cta: "Bağış Yap",
  path: "/projeler",
  color: "#06b2aa",
};
const blankProject = {
  slug: "",
  category: "Genel",
  title: "Yeni Proje",
  short: "Projenin kısa açıklaması",
  description: "Proje kartı açıklaması",
  beneficiaries: "Doğrulanmış ihtiyaç sahipleri",
  scope: "Proje kapsamında belirlenen destek",
  details: [
    "Projenin amacı, kapsamı ve uygulama süreci hakkında detaylı bilgi.",
  ],
  image: "/assets/aid.jpg",
  variants: [["Standart", 1000, "TRY", "/assets/aid.jpg"]],
  active: true,
  calculator: false,
};

function Field({ label, children, hint, wide = false }) {
  return (
    <label className={wide ? "admin-field wide" : "admin-field"}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Text({
  label,
  value,
  onChange,
  wide = false,
  area = false,
  type = "text",
  hint,
}) {
  return (
    <Field label={label} wide={wide} hint={hint}>
      {area ? (
        <textarea
          rows="4"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) =>
            onChange(
              type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
        />
      )}
    </Field>
  );
}
function ImagePicker({ value, onChange, label = "Görsel" }) {
  const ref = useRef();
  const video =
    typeof value === "string" &&
    (value.startsWith("data:video/") || /\.(mp4|webm|ogg)(\?|$)/i.test(value));
  const load = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(f);
  };
  return (
    <Field label={label} wide>
      <div className="admin-image-picker">
        {value ? (
          video ? (
            <video src={value} controls preload="metadata" />
          ) : (
            <img src={value} alt="Görsel önizleme" />
          )
        ) : (
          <div className="image-empty">
            <FileImage />
          </div>
        )}
        <div>
          <button type="button" onClick={() => ref.current.click()}>
            <Upload /> Bilgisayardan seç
          </button>
          <small>JPG, PNG, WebP, MP4, WebM veya OGG</small>
        </div>
      </div>
      <input
        ref={ref}
        hidden
        type="file"
        accept="image/*,video/mp4,video/webm,video/ogg"
        onChange={load}
      />
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Alternatif: görsel veya video adresi"
      />
    </Field>
  );
}
function Section({ title, description, actions, children }) {
  return (
    <section className="admin-section">
      <header>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
function CardHead({ title, index, onMove, onDelete, count }) {
  return (
    <div className="editor-head">
      <div>
        <small>İÇERİK {index + 1}</small>
        <b>{title || "İsimsiz içerik"}</b>
      </div>
      <div>
        {onMove && (
          <>
            <button
              disabled={!index}
              onClick={() => onMove(-1)}
              title="Yukarı taşı"
            >
              <ChevronUp />
            </button>
            <button
              disabled={index === count - 1}
              onClick={() => onMove(1)}
              title="Aşağı taşı"
            >
              <ChevronDown />
            </button>
          </>
        )}
        <button className="delete" onClick={onDelete} title="Sil">
          <Trash2 />
        </button>
      </div>
    </div>
  );
}
function SizeControl({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  onChange,
  sample,
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="size-control">
        <input
          aria-label={`${label} kaydırıcısı`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div>
          <input
            aria-label={`${label} değeri`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) =>
              onChange(
                Math.min(max, Math.max(min, Number(e.target.value) || min)),
              )
            }
          />
          <span>{step < 1 ? "oran" : "px"}</span>
        </div>
      </div>
      {sample && (
        <div
          className="type-sample"
          style={step < 1 ? { lineHeight: value } : { fontSize: value }}
        >
          {sample}
        </div>
      )}
    </Field>
  );
}
function contentSearch(content, raw) {
  const q = raw.trim().toLocaleLowerCase("tr-TR");
  if (q.length < 2) return [];
  const results = [],
    add = (tab, area, title, data, filter = "") => {
      const values = [];
      const walk = (x) => {
        if (typeof x === "string") values.push(x);
        else if (Array.isArray(x)) x.forEach(walk);
        else if (x && typeof x === "object") Object.values(x).forEach(walk);
      };
      walk(data);
      const hit = values.find((x) => x.toLocaleLowerCase("tr-TR").includes(q));
      if (hit) results.push({ tab, area, title, preview: hit, filter });
    };
  add("home", "Ana Sayfa", "Ana sayfa metinleri", content.home);
  content.slides.forEach((x) =>
    add("slides", "Slider / Manşet", x.title, x, x.title),
  );
  (content.projects || []).forEach((x) =>
    add("projects", "Proje Yönetimi", x.title, x, x.title),
  );
  content.news.forEach((x) => add("news", "Haberler", x.title, x, x.title));
  Object.entries(content.pages || {}).forEach(([path, x]) =>
    add("pages", "Diğer Sayfalar", x.title || path, x, x.title),
  );
  add("structure", "Menü ve Kartlar", "Üst menü ve çalışma kartları", {
    navigation: content.navigation,
    workAreas: content.workAreas,
  });
  add("footer", "Footer ve Bülten", "Footer metinleri", content.footer);
  add(
    "settings",
    "Genel Ayarlar",
    "Logo ve iletişim bilgileri",
    content.settings,
  );
  return results.slice(0, 30);
}

function Login({ content, onLogin }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="admin-login-v2">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const ok = await onLogin(
            new FormData(e.currentTarget).get("password"),
          );
          setBusy(false);
          if (!ok)
            setError(
              "Giriş başarısız veya servis geçici olarak kullanılamıyor.",
            );
        }}
      >
        <img src={content.settings.logo} />
        <div className="login-badge">YÖNETİM PANELİ</div>
        <h1>Tekrar hoş geldiniz</h1>
        <p>
          Site içeriklerinizi düzenlemek için yönetici şifrenizle giriş yapın.
        </p>
        <Field label="Yönetici şifresi">
          <input
            name="password"
            type="password"
            autoFocus
            required
            maxLength="256"
            autoComplete="current-password"
            placeholder="Şifrenizi yazın"
          />
        </Field>
        {error && <div className="login-error">{error}</div>}
        <button disabled={busy} className="primary-action">
          {busy ? "Kontrol ediliyor…" : "Giriş yap"}
        </button>
        <Link to="/">
          <ArrowLeft /> Siteye geri dön
        </Link>
      </form>
    </main>
  );
}

function FooterEditor({ content, update }) {
  const f = content.footer,
    change = (k, v) => update("footer", { ...f, [k]: v });
  return (
    <>
      <Section
        title="Gönüllülük çağrısı"
        description="Footer üstündeki gönüllülük şeridinin metinleri."
      >
        <div className="form-grid">
          <Text
            label="Başlık"
            value={f.newsletterTitle}
            onChange={(v) => change("newsletterTitle", v)}
          />
          <Text
            label="Buton yazısı"
            value={f.newsletterButton}
            onChange={(v) => change("newsletterButton", v)}
          />
          <Text
            label="Açıklama"
            wide
            area
            value={f.newsletterText}
            onChange={(v) => change("newsletterText", v)}
          />
        </div>
      </Section>
      <Section
        title="Footer marka ve sosyal medya"
        description="Logo altındaki açıklama ve sosyal medya bağlantıları."
      >
        <div className="form-grid">
          <Text
            label="Kurumsal açıklama"
            wide
            area
            value={f.brandText}
            onChange={(v) => change("brandText", v)}
          />
          <Text
            label="Instagram bağlantısı"
            value={f.social.instagram}
            onChange={(v) => change("social", { ...f.social, instagram: v })}
          />
          <Text
            label="Facebook bağlantısı"
            value={f.social.facebook}
            onChange={(v) => change("social", { ...f.social, facebook: v })}
          />
          <Text
            label="YouTube bağlantısı"
            value={f.social.youtube}
            onChange={(v) => change("social", { ...f.social, youtube: v })}
          />
        </div>
      </Section>
      {f.columns.map((column, ci) => (
        <Section
          key={ci}
          title={`Footer menü sütunu ${ci + 1}`}
          description="Sütun başlığı, bağlantı yazıları ve hedef adresleri."
        >
          <div className="form-grid">
            <Text
              label="Sütun başlığı"
              wide
              value={column.title}
              onChange={(v) =>
                change(
                  "columns",
                  f.columns.map((c, i) => (i === ci ? { ...c, title: v } : c)),
                )
              }
            />
            {column.links.map((link, li) => (
              <React.Fragment key={li}>
                <Text
                  label={`Bağlantı ${li + 1} yazısı`}
                  value={link.label}
                  onChange={(v) =>
                    change(
                      "columns",
                      f.columns.map((c, i) =>
                        i === ci
                          ? {
                              ...c,
                              links: c.links.map((l, j) =>
                                j === li ? { ...l, label: v } : l,
                              ),
                            }
                          : c,
                      ),
                    )
                  }
                />
                <Text
                  label="Hedef adres"
                  value={link.path}
                  onChange={(v) =>
                    change(
                      "columns",
                      f.columns.map((c, i) =>
                        i === ci
                          ? {
                              ...c,
                              links: c.links.map((l, j) =>
                                j === li ? { ...l, path: v } : l,
                              ),
                            }
                          : c,
                      ),
                    )
                  }
                />
              </React.Fragment>
            ))}
          </div>
        </Section>
      ))}
      <Section
        title="Alt yasal satır"
        description="Telif metni ve yasal sayfa bağlantıları."
      >
        <div className="form-grid">
          <Text
            label="Telif metni"
            wide
            value={f.copyright}
            onChange={(v) => change("copyright", v)}
          />
          {f.legal.map((link, i) => (
            <React.Fragment key={i}>
              <Text
                label={`Yasal bağlantı ${i + 1}`}
                value={link.label}
                onChange={(v) =>
                  change(
                    "legal",
                    f.legal.map((l, j) => (j === i ? { ...l, label: v } : l)),
                  )
                }
              />
              <Text
                label="Hedef adres"
                value={link.path}
                onChange={(v) =>
                  change(
                    "legal",
                    f.legal.map((l, j) => (j === i ? { ...l, path: v } : l)),
                  )
                }
              />
            </React.Fragment>
          ))}
        </div>
      </Section>
    </>
  );
}

function StructureEditor({ content, update }) {
  return (
    <>
      <Section
        title="Üst menü"
        description="Ana menü başlıkları ve açıldığında görünen sütun başlıkları."
      >
        <div className="form-grid">
          {content.navigation.map((m, i) => (
            <React.Fragment key={i}>
              <Text
                label={`Menü ${i + 1} başlığı`}
                value={m.label}
                onChange={(v) =>
                  update(
                    "navigation",
                    content.navigation.map((x, j) =>
                      j === i ? { ...x, label: v } : x,
                    ),
                  )
                }
              />
              <Text
                label="Hedef adres"
                value={m.path}
                onChange={(v) =>
                  update(
                    "navigation",
                    content.navigation.map((x, j) =>
                      j === i ? { ...x, path: v } : x,
                    ),
                  )
                }
              />
              {m.cols.map((col, ci) => (
                <Text
                  key={ci}
                  label={`${m.label} sütun ${ci + 1}`}
                  value={col[0]}
                  onChange={(v) =>
                    update(
                      "navigation",
                      content.navigation.map((x, j) =>
                        j === i
                          ? {
                              ...x,
                              cols: x.cols.map((c, k) =>
                                k === ci ? [v, c[1]] : c,
                              ),
                            }
                          : x,
                      ),
                    )
                  }
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </Section>
      <Section
        title="Çalışma alanı kartları"
        description="Ana sayfadaki dört büyük çalışma kartının tüm alanları."
      >
        {content.workAreas.map((x, i) => (
          <div className="structure-card" key={i}>
            <div className="form-grid">
              <Text
                label="Başlık"
                value={x.title}
                onChange={(v) =>
                  update(
                    "workAreas",
                    content.workAreas.map((a, j) =>
                      j === i ? { ...a, title: v } : a,
                    ),
                  )
                }
              />
              <Text
                label="Hedef adres"
                value={x.path}
                onChange={(v) =>
                  update(
                    "workAreas",
                    content.workAreas.map((a, j) =>
                      j === i ? { ...a, path: v } : a,
                    ),
                  )
                }
              />
              <Text
                label="Açıklama"
                wide
                area
                value={x.description}
                onChange={(v) =>
                  update(
                    "workAreas",
                    content.workAreas.map((a, j) =>
                      j === i ? { ...a, description: v } : a,
                    ),
                  )
                }
              />
              <ImagePicker
                value={x.image}
                onChange={(v) =>
                  update(
                    "workAreas",
                    content.workAreas.map((a, j) =>
                      j === i ? { ...a, image: v } : a,
                    ),
                  )
                }
              />
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function ProjectsEditor({ content, update }) {
  const projects = content.projects || [];
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug || "");
  const [newCategory, setNewCategory] = useState("");
  const categories = content.projectCategories || [];
  const makeSlug = (value) =>
    value
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/[ç]/g, "c")
      .replace(/[ğ]/g, "g")
      .replace(/[ı]/g, "i")
      .replace(/[ö]/g, "o")
      .replace(/[ş]/g, "s")
      .replace(/[ü]/g, "u")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const changeProject = (index, value) =>
    update(
      "projects",
      projects.map((item, i) => (i === index ? value : item)),
    );
  const moveProject = (index, dir) => {
    const next = [...projects],
      target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("projects", next);
  };
  const removeProject = (index) => {
    if (!confirm("Bu proje ve tüm varyantları silinsin mi?")) return;
    const next = projects.filter((_, i) => i !== index);
    update("projects", next);
    setSelectedSlug(next[0]?.slug || "");
  };
  const addProject = () => {
    const enteredTitle = prompt("Yeni projenin adını yazın:");
    const title = enteredTitle?.trim();
    if (!title) return;
    const baseSlug = makeSlug(title) || "proje";
    let slug = baseSlug;
    let suffix = 2;
    while (projects.some((project) => project.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    const project = {
      ...blankProject,
      title,
      slug,
      variants: blankProject.variants.map((x) => [...x]),
      details: [...blankProject.details],
      category: categories[0] || "Genel",
    };
    update("projects", [project, ...projects]);
    setQuery("");
    setSelectedSlug(project.slug);
  };
  const addCategory = () => {
    const name = newCategory.trim();
    if (
      !name ||
      categories.some(
        (x) => x.toLocaleLowerCase("tr-TR") === name.toLocaleLowerCase("tr-TR"),
      )
    )
      return;
    update("projectCategories", [...categories, name]);
    setNewCategory("");
  };
  const renameCategory = (oldName, newName) => {
    const name = newName.trim();
    if (!name || name === oldName) return;
    if (
      categories.some(
        (category) =>
          category !== oldName &&
          category.toLocaleLowerCase("tr-TR") ===
            name.toLocaleLowerCase("tr-TR"),
      )
    ) {
      alert("Bu kategori zaten mevcut.");
      return;
    }
    update(
      "projectCategories",
      categories.map((x) => (x === oldName ? name : x)),
    );
    update(
      "projects",
      projects.map((p) =>
        p.category === oldName ? { ...p, category: name } : p,
      ),
    );
  };
  const removeCategory = (name) => {
    if (
      !confirm(
        `${name} kategorisi silinsin mi? Bu kategorideki projeler Genel kategorisine taşınacak.`,
      )
    )
      return;
    const remaining = categories.filter((x) => x !== name);
    if (!remaining.includes("Genel")) remaining.push("Genel");
    update("projectCategories", remaining);
    update(
      "projects",
      projects.map((p) =>
        p.category === name ? { ...p, category: "Genel" } : p,
      ),
    );
  };
  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) =>
      `${project.title} ${project.category} ${project.slug}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
    );
  return (
    <>
      <div className="list-toolbar">
        <div className="admin-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Proje veya kategori ara..."
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X />
            </button>
          )}
        </div>
        <button type="button" className="primary-action" onClick={addProject}>
          <Plus /> Yeni proje ekle
        </button>
      </div>
      <Section
        title="Proje kategorileri"
        description="Kategori ekleyin, adını değiştirin veya kaldırın. Kategori değişiklikleri projelere otomatik uygulanır."
      >
        <div className="category-manager">
          <div className="category-add">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCategory();
                }
              }}
              placeholder="Yeni kategori adı"
            />
            <button type="button" onClick={addCategory}>
              <Plus /> Kategori ekle
            </button>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category}>
                <input
                  aria-label={`${category} kategori adı`}
                  defaultValue={category}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value && value !== category)
                      renameCategory(category, value);
                  }}
                />
                <button
                  type="button"
                  aria-label={`${category} kategorisini sil`}
                  onClick={() => removeCategory(category)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <div className="project-manager-layout">
        <aside className="project-manager-list">
          {visible.map(({ project, index }) => (
            <button
              type="button"
              className={project.slug === selectedSlug ? "active" : ""}
              key={`${project.slug}-${index}`}
              onClick={() => setSelectedSlug(project.slug)}
            >
              <span>
                <b>{project.title}</b>
                <small>
                  {project.category} · {project.variants?.length || 0} varyant
                </small>
              </span>
              <i className={project.active === false ? "draft" : "live"}>
                {project.active === false ? "Taslak" : "Yayında"}
              </i>
            </button>
          ))}
          {!visible.length && <p>Aramanızla eşleşen proje bulunamadı.</p>}
        </aside>
        <div className="project-manager-editor">
          {projects
            .map((project, index) => ({ project, index }))
            .filter(({ project }) => project.slug === selectedSlug)
            .map(({ project, index: pi }) => (
              <Section key={`${project.slug}-${pi}`} title="" description="">
                <CardHead
                  title={project.title}
                  index={pi}
                  count={projects.length}
                  onMove={(dir) => moveProject(pi, dir)}
                  onDelete={() => removeProject(pi)}
                />
                <div className="form-grid">
                  <Text
                    label="Proje başlığı"
                    value={project.title}
                    onChange={(v) =>
                      changeProject(pi, { ...project, title: v })
                    }
                  />
                  <Field label="Kategori">
                    <select
                      value={project.category}
                      onChange={(e) =>
                        changeProject(pi, {
                          ...project,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                      {!categories.includes(project.category) && (
                        <option>{project.category}</option>
                      )}
                    </select>
                  </Field>
                  <Text
                    label="Kısa adres (slug)"
                    hint="Örn. su-kuyusu; boşluk ve Türkçe karakter kullanmayın."
                    value={project.slug}
                    onChange={(v) => {
                      const slug = makeSlug(v);
                      changeProject(pi, { ...project, slug });
                      setSelectedSlug(slug);
                    }}
                  />
                  <Field label="Yayın ve proje türü">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={project.active !== false}
                        onChange={(e) =>
                          changeProject(pi, {
                            ...project,
                            active: e.target.checked,
                          })
                        }
                      />
                      <i />
                      <span>
                        {project.active !== false ? "Yayında" : "Taslak"}
                      </span>
                    </label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={project.calculator === true}
                        onChange={(e) =>
                          changeProject(pi, {
                            ...project,
                            calculator: e.target.checked,
                          })
                        }
                      />
                      <i />
                      <span>Zekât hesaplama projesi</span>
                    </label>
                  </Field>
                  <Text
                    label="Kısa açıklama"
                    wide
                    area
                    value={project.short}
                    onChange={(v) =>
                      changeProject(pi, { ...project, short: v })
                    }
                  />
                  <Text
                    label="Kart açıklaması"
                    wide
                    area
                    value={project.description}
                    onChange={(v) =>
                      changeProject(pi, { ...project, description: v })
                    }
                  />
                  <Text
                    label="Kimlere ulaşır?"
                    value={project.beneficiaries}
                    onChange={(v) =>
                      changeProject(pi, { ...project, beneficiaries: v })
                    }
                  />
                  <Text
                    label="Bağış kapsamı"
                    value={project.scope}
                    onChange={(v) =>
                      changeProject(pi, { ...project, scope: v })
                    }
                  />
                  <Text
                    label="Detaylı bilgiler"
                    wide
                    area
                    hint="Her paragrafı boş bir satırla ayırın. Tutar, kapsam, yararlanıcı ve uygulama sürecini açıklayın."
                    value={(project.details || []).join("\n\n")}
                    onChange={(v) =>
                      changeProject(pi, {
                        ...project,
                        details: v.split(/\n\s*\n/).filter(Boolean),
                      })
                    }
                  />
                  <ImagePicker
                    value={project.image}
                    onChange={(v) =>
                      changeProject(pi, { ...project, image: v })
                    }
                  />
                </div>
                <div className="project-variant-admin">
                  <div className="editor-head">
                    <div>
                      <small>BAĞIŞ SEÇENEKLERİ</small>
                      <b>Ülke, fiyat ve para birimi</b>
                    </div>
                    <button
                      type="button"
                      className="add-variant-button"
                      title="Yeni ülke veya seçenek ekle"
                      aria-label="Yeni ülke veya seçenek ekle"
                      onClick={() =>
                        changeProject(pi, {
                          ...project,
                          variants: [
                            ...(project.variants || []),
                            ["Yeni bölge", 0, "TRY", project.image],
                          ],
                        })
                      }
                    >
                      <Plus /> Yeni varyant ekle
                    </button>
                  </div>
                  {(project.variants || []).map((variant, vi) => (
                    <div
                      className="form-grid project-variant-row"
                      key={`${vi}-${variant[0]}`}
                    >
                      <div className="variant-row-title wide">
                        <b>Varyant {vi + 1}</b>
                        <span>Seçenek adı, ücret, para birimi ve görsel</span>
                      </div>
                      <Text
                        label="Ülke / seçenek"
                        value={variant[0]}
                        onChange={(v) =>
                          changeProject(pi, {
                            ...project,
                            variants: project.variants.map((x, i) =>
                              i === vi ? [v, x[1], x[2], x[3]] : x,
                            ),
                          })
                        }
                      />
                      <Text
                        label="Tutar"
                        type="number"
                        value={variant[1]}
                        onChange={(v) =>
                          changeProject(pi, {
                            ...project,
                            variants: project.variants.map((x, i) =>
                              i === vi ? [x[0], v, x[2], x[3]] : x,
                            ),
                          })
                        }
                      />
                      <Field label="Para birimi">
                        <select
                          value={variant[2] || "TRY"}
                          onChange={(e) =>
                            changeProject(pi, {
                              ...project,
                              variants: project.variants.map((x, i) =>
                                i === vi
                                  ? [x[0], x[1], e.target.value, x[3]]
                                  : x,
                              ),
                            })
                          }
                        >
                          <option value="TRY">TL</option>
                          <option value="USD">Dolar</option>
                          <option value="EUR">Euro</option>
                          <option value="GBP">Sterlin</option>
                        </select>
                      </Field>
                      <ImagePicker
                        label="Seçenek görseli"
                        value={variant[3] || ""}
                        onChange={(v) =>
                          changeProject(pi, {
                            ...project,
                            variants: project.variants.map((x, i) =>
                              i === vi ? [x[0], x[1], x[2], v] : x,
                            ),
                          })
                        }
                      />
                      <button
                        className="admin-variant-delete"
                        type="button"
                        onClick={() =>
                          confirm("Bu seçenek silinsin mi?") &&
                          changeProject(pi, {
                            ...project,
                            variants: project.variants.filter(
                              (_, i) => i !== vi,
                            ),
                          })
                        }
                      >
                        <Trash2 /> Seçeneği sil
                      </button>
                    </div>
                  ))}
                </div>
              </Section>
            ))}
        </div>
      </div>
    </>
  );
}

function SitePagesEditor({ content, update }) {
  const labels = {
    tag: "Üst etiket",
    title: "Sayfa başlığı",
    userTitle: "Giriş sonrası başlık",
    text: "Sayfa açıklaması",
    sectionTitle: "Bölüm başlığı",
    sectionText: "Bölüm açıklaması",
    emptyTitle: "Boş sonuç başlığı",
    emptyText: "Boş sonuç açıklaması",
    note: "Bilgilendirme notu",
  };
  const change = (key, field, value) =>
    update("sitePages", {
      ...content.sitePages,
      [key]: { ...content.sitePages[key], [field]: value },
    });
  return (
    <>
      {Object.entries(content.sitePages || {}).map(([key, page]) => (
        <Section
          key={key}
          title={page.name || key}
          description="Bu sayfanın başlık, açıklama, bölüm metinleri ve ana görseli."
        >
          <div className="form-grid">
            {Object.entries(page)
              .filter(([field]) => !["name", "image"].includes(field))
              .map(([field, value]) => (
                <Text
                  key={field}
                  label={labels[field] || field}
                  wide
                  area={["text", "sectionText", "emptyText", "note"].includes(
                    field,
                  )}
                  value={value}
                  onChange={(v) => change(key, field, v)}
                />
              ))}
            <ImagePicker
              value={page.image}
              onChange={(v) => change(key, "image", v)}
            />
          </div>
        </Section>
      ))}
    </>
  );
}

const literalTexts = [
  ...new Set(
    [
      ...[...appSource.matchAll(/>([^<>{}]+)</g)].map((m) =>
        m[1].replace(/\s+/g, " ").trim(),
      ),
      ...[
        ...appSource.matchAll(/(?:placeholder|aria-label|title)="([^"]+)"/g),
      ].map((m) => m[1].trim()),
    ].filter((x) => x.length > 1 && /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(x)),
  ),
].sort((a, b) => a.localeCompare(b, "tr"));
const literalMedia = [
  ...new Set(
    [...appSource.matchAll(/\/assets\/[A-Za-z0-9._/-]+/g)].map((m) => m[0]),
  ),
].sort();

function AllContentEditor({ content, update }) {
  const [filter, setFilter] = useState("");
  const q = filter.toLocaleLowerCase("tr-TR"),
    overrides = content.overrides || { text: {}, media: {} };
  const change = (kind, original, value) => {
    const next = { ...(overrides[kind] || {}) };
    if (!value || value === original) delete next[original];
    else next[original] = value;
    update("overrides", { ...overrides, [kind]: next });
  };
  const texts = literalTexts.filter(
    (x) =>
      !q ||
      x.toLocaleLowerCase("tr-TR").includes(q) ||
      (overrides.text?.[x] || "").toLocaleLowerCase("tr-TR").includes(q),
  );
  const media = literalMedia.filter(
    (x) => !q || x.toLocaleLowerCase("tr-TR").includes(q),
  );
  return (
    <>
      <div className="list-toolbar">
        <div className="admin-search">
          <Search />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Menü, buton, form metni veya görsel ara..."
          />
          {filter && (
            <button onClick={() => setFilter("")}>
              <X />
            </button>
          )}
        </div>
        <span className="result-count">
          {texts.length} metin · {media.length} medya
        </span>
      </div>
      <Section
        title="Tüm sabit metinler"
        description="Menüler, butonlar, form etiketleri, ödeme metinleri ve ortak arayüz yazıları. Boş bırakırsanız özgün metin kullanılır."
      >
        <div className="global-content-list">
          {texts.map((original) => (
            <Field key={original} label={original}>
              <input
                value={overrides.text?.[original] || ""}
                placeholder={original}
                onChange={(e) => change("text", original, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </Section>
      <Section
        title="Tüm görsel ve videolar"
        description="Sitede kullanılan medya dosyalarını görsel veya video ile değiştirebilirsiniz."
      >
        <div className="global-media-list">
          {media.map((original) => (
            <ImagePicker
              key={original}
              label={original}
              value={overrides.media?.[original] || original}
              onChange={(v) => change("media", original, v)}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

function collectTranslatableStrings(content) {
  const found = new Set(literalTexts),
    walk = (value) => {
      if (typeof value === "string") {
        const text = value.trim();
        if (
          text.length > 1 &&
          !text.startsWith("/") &&
          !/^https?:/i.test(text) &&
          !text.includes("@") &&
          /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(text)
        )
          found.add(text);
      } else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object")
        Object.values(value).forEach(walk);
    };
  const { languages, overrides, ...base } = content;
  walk(base);
  return [...found].sort((a, b) => a.localeCompare(b, "tr"));
}

function LanguagesEditor({ content, update }) {
  const [selected, setSelected] = useState("en"),
    [filter, setFilter] = useState("");
  const languages = content.languages || {},
    language = languages[selected] || {},
    q = filter.toLocaleLowerCase("tr-TR");
  const strings = collectTranslatableStrings(content).filter(
    (x) =>
      !q ||
      x.toLocaleLowerCase("tr-TR").includes(q) ||
      (language.text?.[x] || "")
        .toLocaleLowerCase(selected === "ar" ? "ar" : "en")
        .includes(q),
  );
  const changeLanguage = (value) =>
    update("languages", {
      ...languages,
      [selected]: { ...language, ...value },
    });
  const changeText = (original, value) => {
    const next = { ...(language.text || {}) };
    if (!value || value === original) delete next[original];
    else next[original] = value;
    changeLanguage({ text: next });
  };
  const changeMedia = (original, value) => {
    const next = { ...(language.media || {}) };
    if (!value || value === original) delete next[original];
    else next[original] = value;
    changeLanguage({ media: next });
  };
  return (
    <>
      <Section
        title="Dil ve yayın ayarları"
        description="Her dil bağımsız yayınlanabilir; boş çeviriler Türkçe kaynak metne geri döner."
      >
        <div className="language-admin-tabs">
          {Object.entries(languages).map(([key, item]) => (
            <button
              className={selected === key ? "active" : ""}
              onClick={() => setSelected(key)}
              key={key}
            >
              {item.code} · {item.label}
            </button>
          ))}
        </div>
        <div className="form-grid">
          <Text
            label="Dil adı"
            value={language.label}
            onChange={(v) => changeLanguage({ label: v })}
          />
          <Text
            label="Kısa kod"
            value={language.code}
            onChange={(v) => changeLanguage({ code: v })}
          />
          <Field label="Yazı yönü">
            <select
              value={language.dir || "ltr"}
              onChange={(e) => changeLanguage({ dir: e.target.value })}
            >
              <option value="ltr">Soldan sağa</option>
              <option value="rtl">Sağdan sola</option>
            </select>
          </Field>
          <Field label="Yayın durumu">
            <label className="switch">
              <input
                disabled={selected === "tr"}
                type="checkbox"
                checked={language.published !== false}
                onChange={(e) =>
                  changeLanguage({ published: e.target.checked })
                }
              />
              <i />
              <span>{language.published !== false ? "Yayında" : "Taslak"}</span>
            </label>
          </Field>
        </div>
      </Section>
      <div className="list-toolbar">
        <div className="admin-search">
          <Search />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Çevrilecek metni ara..."
          />
        </div>
        <span className="result-count">
          {strings.length} çevrilebilir metin
        </span>
      </div>
      <Section
        title={`${language.label || selected} metinleri`}
        description="Türkçe kaynak solda, bu dilde yayınlanacak karşılık düzenleme alanındadır."
      >
        <div className="translation-list">
          {strings.map((original) => (
            <Field key={original} label={original}>
              <textarea
                dir={language.dir || "ltr"}
                rows={original.length > 120 ? 4 : 2}
                value={language.text?.[original] || ""}
                placeholder={
                  selected === "tr" ? original : `${language.label} çevirisi`
                }
                onChange={(e) => changeText(original, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </Section>
      <Section
        title={`${language.label || selected} medya karşılıkları`}
        description="İsterseniz bu dil için farklı görsel veya video yayınlayın."
      >
        <div className="global-media-list">
          {literalMedia.map((original) => (
            <ImagePicker
              key={original}
              label={original}
              value={language.media?.[original] || original}
              onChange={(v) => changeMedia(original, v)}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

function AnalyticsPanel() {
  const [events, setEvents] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/analytics", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok)
          throw new Error(
            (await r.json().catch(() => ({}))).message ||
              "Analitik yüklenemedi.",
          );
        return r.json();
      })
      .then((x) => setEvents(x.events || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const sessions = new Map();
  for (const e of events) {
    const s = sessions.get(e.sessionId) || {
      id: e.sessionId,
      ip: e.ip,
      last: e.timestamp,
      pages: new Set(),
      seconds: 0,
      cart: [],
      checkout: false,
      paid: false,
    };
    s.last = Math.max(s.last, e.timestamp);
    s.pages.add(e.path);
    if (e.event === "page_duration") s.seconds += Number(e.data?.seconds || 0);
    if (e.event === "cart_add") s.cart.push(e.data?.title || e.data?.campaign);
    if (e.event === "checkout_start") s.checkout = true;
    if (e.event === "donation_success") s.paid = true;
    sessions.set(e.sessionId, s);
  }
  const list = [...sessions.values()].sort((a, b) => b.last - a.last),
    pageStats = {};
  events
    .filter((e) => e.event === "page_duration")
    .forEach((e) => {
      const p = pageStats[e.path] || { seconds: 0, count: 0 };
      p.seconds += Number(e.data?.seconds || 0);
      p.count++;
      pageStats[e.path] = p;
    });
  const campaigns = {};
  events
    .filter((e) => e.event === "cart_add")
    .forEach((e) => {
      const n = e.data?.title || e.data?.campaign || "Bilinmeyen";
      campaigns[n] = (campaigns[n] || 0) + 1;
    });
  if (loading)
    return <div className="analytics-state">Analitik verileri yükleniyor…</div>;
  if (error)
    return (
      <div className="analytics-state error">
        <b>Analitik henüz kullanılamıyor</b>
        <p>{error}</p>
        <small>Üretimde YEDIRENK_ANALYTICS KV binding’ini bağlayın.</small>
      </div>
    );
  return (
    <>
      <div className="analytics-summary">
        <div>
          <Users />
          <b>{list.length}</b>
          <span>Ziyaretçi oturumu</span>
        </div>
        <div>
          <Clock />
          <b>
            {Math.round(
              list.reduce((n, x) => n + x.seconds, 0) /
                Math.max(1, list.length),
            )}{" "}
            sn
          </b>
          <span>Ortalama süre</span>
        </div>
        <div>
          <WalletCards />
          <b>{list.filter((x) => x.cart.length).length}</b>
          <span>Sepete ekleyen</span>
        </div>
        <div>
          <BarChart3 />
          <b>{list.filter((x) => x.cart.length && !x.paid).length}</b>
          <span>Ödemeden ayrılan</span>
        </div>
      </div>
      <Section
        title="Sayfa performansı"
        description="Ziyaretçilerin hangi sayfada ortalama ne kadar kaldığı."
      >
        <div className="analytics-table">
          <table>
            <thead>
              <tr>
                <th>Sayfa</th>
                <th>Ziyaret/süre olayı</th>
                <th>Ortalama süre</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pageStats)
                .sort((a, b) => b[1].seconds - a[1].seconds)
                .map(([path, x]) => (
                  <tr key={path}>
                    <td>{path}</td>
                    <td>{x.count}</td>
                    <td>{Math.round(x.seconds / x.count)} saniye</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section
        title="Bağış ilgisi"
        description="Hangi yardım alanının daha fazla sepete eklendiği."
      >
        <div className="analytics-table">
          <table>
            <thead>
              <tr>
                <th>Yardım alanı</th>
                <th>Sepete eklenme</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(campaigns)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section
        title="Ziyaretçi ve dönüşüm detayları"
        description="IP adresleri yalnızca yetkili panelde gösterilir ve kayıtlar 30 gün sonra silinir."
      >
        <div className="analytics-table">
          <table>
            <thead>
              <tr>
                <th>Son ziyaret</th>
                <th>IP adresi</th>
                <th>Sayfa</th>
                <th>Süre</th>
                <th>Sepet</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id}>
                  <td>{new Date(x.last).toLocaleString("tr-TR")}</td>
                  <td>
                    <code>{x.ip}</code>
                  </td>
                  <td>{x.pages.size}</td>
                  <td>{x.seconds} sn</td>
                  <td>{x.cart.join(", ") || "—"}</td>
                  <td>
                    <span
                      className={`conversion ${x.paid ? "paid" : x.checkout ? "checkout" : x.cart.length ? "abandoned" : ""}`}
                    >
                      {x.paid
                        ? "Bağış tamamlandı"
                        : x.checkout
                          ? "Ödemede ayrıldı"
                          : x.cart.length
                            ? "Sepette bıraktı"
                            : "Sadece ziyaret"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
function MembersPanel() {
  const [users, setUsers] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (import.meta.env.DEV) {
      try {
        setUsers(
          JSON.parse(localStorage.getItem("yedirenk-dev-users") || "[]")
            .map(({ passwordHash, ...u }) => u)
            .sort((a, b) => b.createdAt - a.createdAt),
        );
      } catch {
        setError("Yerel kayıtlar okunamadı.");
      } finally {
        setLoading(false);
      }
    } else
      fetch("/api/admin/users", { credentials: "same-origin" })
        .then(async (r) => {
          const b = await r.json();
          if (!r.ok) throw new Error(b.message);
          setUsers(b.users || []);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, []);
  if (loading)
    return <div className="analytics-state">Kullanıcılar yükleniyor…</div>;
  if (error)
    return (
      <div className="analytics-state error">
        <b>Kullanıcı listesi yüklenemedi</b>
        <p>{error}</p>
        <small>Üretimde YEDIRENK_USERS KV binding’ini bağlayın.</small>
      </div>
    );
  return (
    <Section
      title={`Kayıtlı kullanıcılar (${users.length})`}
      description="Şifreler hiçbir zaman bu ekrana veya API yanıtına dahil edilmez."
    >
      <div className="analytics-table">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Kayıt tarihi</th>
              <th>Son giriş</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <b>
                    {u.firstName} {u.lastName}
                  </b>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{new Date(u.createdAt).toLocaleString("tr-TR")}</td>
                <td>{new Date(u.lastLoginAt).toLocaleString("tr-TR")}</td>
                <td>
                  <span className={`conversion ${u.active ? "paid" : ""}`}>
                    {u.active ? "Aktif" : "Pasif"}
                  </span>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan="6">Henüz kayıtlı kullanıcı yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export default function AdminPanel() {
  const { content, update, reset, exportData, importData } = useCms();
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    if (!logged && import.meta.env.PROD)
      fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      }).catch(() => {});
  }, [logged]);
  const [tab, setTab] = useState("dashboard"),
    [query, setQuery] = useState(""),
    [finderQuery, setFinderQuery] = useState(""),
    [notice, setNotice] = useState(""),
    [mobile, setMobile] = useState(false),
    [attempts, setAttempts] = useState(0),
    [lockedUntil, setLockedUntil] = useState(0);
  const importRef = useRef();
  const password =
    import.meta.env.VITE_ADMIN_PASSWORD ||
    (import.meta.env.DEV ? "yedirenk2026" : "");
  const login = async (p) => {
    if (import.meta.env.PROD) {
      try {
        const r = await fetch("/api/admin/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: p }),
        });
        if (!r.ok) return false;
        const data = await fetch("/api/admin/content", {
          credentials: "same-origin",
        });
        if (data.ok) {
          const saved = await data.json();
          if (saved.content) importData(JSON.stringify(saved.content));
        }
        setLogged(true);
        return true;
      } catch {
        return false;
      }
    }
    if (Date.now() < lockedUntil || !password) return false;
    if (p !== password) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) {
        setLockedUntil(Date.now() + 60000);
        setAttempts(0);
      }
      return false;
    }
    setAttempts(0);
    setLogged(true);
    return true;
  };
  const flash = (m) => {
    setNotice(m);
    setTimeout(() => setNotice(""), 2200);
  };
  const save = async () => {
    if (import.meta.env.PROD) {
      try {
        const r = await fetch("/api/admin/content", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });
        if (!r.ok) throw new Error();
        flash("İçerik güvenli sunucuya kaydedildi.");
      } catch {
        flash(
          "Kaydetme başarısız; oturumunuzu ve sunucu ayarlarını kontrol edin.",
        );
      }
      return;
    }
    flash("Değişiklikler kaydedildi ve siteye uygulandı.");
  };
  const setList = (name, index, value) =>
    update(
      name,
      content[name].map((x, i) => (i === index ? value : x)),
    );
  const remove = (name, index) =>
    confirm("Bu içeriği kalıcı olarak silmek istiyor musunuz?") &&
    update(
      name,
      content[name].filter((_, i) => i !== index),
    );
  const move = (name, index, dir) => {
    const a = [...content[name]],
      to = index + dir;
    if (to < 0 || to >= a.length) return;
    [a[index], a[to]] = [a[to], a[index]];
    update(name, a);
  };
  const filtered = (name) =>
    content[name]
      .map((x, i) => ({ ...x, _index: i }))
      .filter((x) =>
        (x.title || x.tag || "").toLowerCase().includes(query.toLowerCase()),
      );
  const pageEntries = useMemo(
    () =>
      Object.entries(content.pages || {}).filter(([, p]) =>
        (p.title || "").toLowerCase().includes(query.toLowerCase()),
      ),
    [content.pages, query],
  );
  const finderResults = useMemo(
    () => contentSearch(content, finderQuery),
    [content, finderQuery],
  );
  if (!logged) return <Login content={content} onLogin={login} />;
  const current = NAV.find((x) => x[0] === tab) || NAV[0];
  const changeHome = (k, v) => update("home", { ...content.home, [k]: v });
  const changeFooter = (k, v) =>
    update("footer", { ...content.footer, [k]: v });
  return (
    <main className="admin-v2">
      <aside className={mobile ? "open" : ""}>
        <div className="admin-brand">
          <img src={content.settings.logo} />
          <button onClick={() => setMobile(false)}>
            <PanelLeftClose />
          </button>
        </div>
        <nav>
          {NAV.map(([id, I, label, desc]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => {
                setTab(id);
                setQuery("");
                setMobile(false);
              }}
            >
              <I />
              <span>
                <b>{label}</b>
                <small>{desc}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="aside-bottom">
          <Link to="/" target="_blank">
            <Eye /> Siteyi görüntüle
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("yedirenk-admin");
              setLogged(false);
            }}
          >
            <LogOut /> Güvenli çıkış
          </button>
        </div>
      </aside>
      {mobile && (
        <button className="admin-overlay" onClick={() => setMobile(false)} />
      )}
      <div className="admin-workspace">
        <header className="admin-top">
          <button className="admin-menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <small>{current[2]}</small>
            <h1>{current[3]}</h1>
          </div>
          <div className="top-actions">
            <Link to="/" target="_blank">
              <Eye /> Önizle
            </Link>
            <button className="primary-action" onClick={save}>
              <Save /> Değişiklikleri kaydet
            </button>
          </div>
        </header>
        {notice && (
          <div className="save-notice">
            <Save /> {notice}
          </div>
        )}
        <div className="admin-page">
          {tab === "dashboard" && (
            <>
              <div className="welcome-card">
                <div>
                  <span>İÇERİK MERKEZİ</span>
                  <h2>Değiştireceğiniz kelimeyi yazarak başlayın</h2>
                  <p>
                    Aşağıdaki arama sitenin bütün başlık, açıklama, haber,
                    sayfa, menü ve footer metinlerini tarar.
                  </p>
                </div>
                <Link to="/" target="_blank">
                  Siteyi aç <Eye />
                </Link>
              </div>
              <section className="content-finder">
                <div className="finder-title">
                  <Search />
                  <div>
                    <h3>Sitede yazı bul</h3>
                    <p>
                      Örneğin “Gazze”, “Bağış Yap” veya değiştirmek istediğiniz
                      cümleden birkaç kelime yazın.
                    </p>
                  </div>
                </div>
                <div className="finder-input">
                  <Search />
                  <input
                    autoFocus
                    value={finderQuery}
                    onChange={(e) => setFinderQuery(e.target.value)}
                    placeholder="Değiştirmek istediğiniz kelimeyi yazın…"
                  />
                  {finderQuery && (
                    <button
                      aria-label="Aramayı temizle"
                      onClick={() => setFinderQuery("")}
                    >
                      <X />
                    </button>
                  )}
                </div>
                {finderQuery.trim().length === 1 && (
                  <p className="finder-help">Aramak için en az 2 harf yazın.</p>
                )}
                {finderQuery.trim().length > 1 && (
                  <div className="finder-results">
                    {finderResults.length ? (
                      finderResults.map((r, i) => (
                        <button
                          key={`${r.tab}-${r.title}-${i}`}
                          onClick={() => {
                            setTab(r.tab);
                            setQuery(r.filter);
                            setFinderQuery("");
                            window.scrollTo(0, 0);
                          }}
                        >
                          <span>
                            <small>{r.area}</small>
                            <b>{r.title}</b>
                            <em>{r.preview}</em>
                          </span>
                          <strong>Düzenle →</strong>
                        </button>
                      ))
                    ) : (
                      <div className="finder-empty">
                        Bu kelimeyi içeren düzenlenebilir bir metin bulunamadı.
                      </div>
                    )}
                  </div>
                )}
              </section>
              <div className="summary-grid">
                <button onClick={() => setTab("projects")}>
                  <WalletCards />
                  <b>{content.projects.length}</b>
                  <span>Proje</span>
                  <small>Düzenlemek için tıklayın</small>
                </button>
                <button onClick={() => setTab("news")}>
                  <Newspaper />
                  <b>{content.news.length}</b>
                  <span>Haber</span>
                  <small>Düzenlemek için tıklayın</small>
                </button>
                <button onClick={() => setTab("slides")}>
                  <Image />
                  <b>{content.slides.length}</b>
                  <span>Slider</span>
                  <small>Düzenlemek için tıklayın</small>
                </button>
                <button onClick={() => setTab("pages")}>
                  <Menu />
                  <b>{Object.keys(content.pages || {}).length}</b>
                  <span>İç sayfa</span>
                  <small>Düzenlemek için tıklayın</small>
                </button>
              </div>
              <div className="help-card">
                <h3>3 adımda düzenleyin</h3>
                <ol>
                  <li>
                    Yukarıdaki kutuya değiştirmek istediğiniz kelimeyi yazın.
                  </li>
                  <li>Sonuçtaki “Düzenle” düğmesine basıp metni değiştirin.</li>
                  <li>
                    “Değişiklikleri kaydet” düğmesine basın ve “Önizle” ile
                    kontrol edin.
                  </li>
                </ol>
              </div>
            </>
          )}
          {tab === "home" && (
            <>
              <Section
                title="Kurumsal tanıtım"
                description="Ana sayfada logonun yanındaki tanıtım alanı."
              >
                <div className="form-grid">
                  <Text
                    label="Küçük üst başlık"
                    value={content.home.introEyebrow}
                    onChange={(v) => changeHome("introEyebrow", v)}
                  />
                  <Text
                    label="Ana başlık"
                    value={content.home.introTitle}
                    onChange={(v) => changeHome("introTitle", v)}
                  />
                  <Text
                    label="Açıklama"
                    wide
                    area
                    value={content.home.introText}
                    onChange={(v) => changeHome("introText", v)}
                  />
                </div>
              </Section>
              <Section
                title="Proje vitrini"
                description="Ana sayfadaki güncel proje kartlarının üst metinleri."
              >
                <div className="form-grid">
                  <Text
                    label="Küçük üst başlık"
                    value={content.home.campaignEyebrow}
                    onChange={(v) => changeHome("campaignEyebrow", v)}
                  />
                  <Text
                    label="Ana başlık"
                    value={content.home.campaignTitle}
                    onChange={(v) => changeHome("campaignTitle", v)}
                  />
                  <Text
                    label="Açıklama"
                    wide
                    area
                    value={content.home.campaignText}
                    onChange={(v) => changeHome("campaignText", v)}
                  />
                </div>
              </Section>
              <Section
                title="Etki ve saha hikâyesi"
                description="Sayaçlar ve ana sayfadaki büyük hikâye alanı."
              >
                <div className="form-grid">
                  <Text
                    label="Etki etiketi"
                    value={content.home.impactEyebrow}
                    onChange={(v) => changeHome("impactEyebrow", v)}
                  />
                  <Text
                    label="Etki başlığı"
                    value={content.home.impactTitle}
                    onChange={(v) => changeHome("impactTitle", v)}
                  />
                  {content.home.stats.map((s, i) => (
                    <React.Fragment key={i}>
                      <Text
                        label={`Sayaç ${i + 1}`}
                        value={s.value}
                        onChange={(v) =>
                          changeHome(
                            "stats",
                            content.home.stats.map((x, j) =>
                              j === i ? { ...x, value: v } : x,
                            ),
                          )
                        }
                      />
                      <Text
                        label="Sayaç açıklaması"
                        value={s.label}
                        onChange={(v) =>
                          changeHome(
                            "stats",
                            content.home.stats.map((x, j) =>
                              j === i ? { ...x, label: v } : x,
                            ),
                          )
                        }
                      />
                    </React.Fragment>
                  ))}
                  <Text
                    label="Hikâye üst başlığı"
                    value={content.home.storyEyebrow}
                    onChange={(v) => changeHome("storyEyebrow", v)}
                  />
                  <Text
                    label="Hikâye başlığı"
                    value={content.home.storyTitle}
                    onChange={(v) => changeHome("storyTitle", v)}
                  />
                  <Text
                    label="Alıntı"
                    wide
                    area
                    value={content.home.storyQuote}
                    onChange={(v) => changeHome("storyQuote", v)}
                  />
                  <Text
                    label="Açıklama"
                    wide
                    area
                    value={content.home.storyText}
                    onChange={(v) => changeHome("storyText", v)}
                  />
                  <ImagePicker
                    value={content.home.storyImage}
                    onChange={(v) => changeHome("storyImage", v)}
                  />
                </div>
              </Section>
              <Section
                title="Güven şeridi"
                description="Slider altındaki dört güven mesajı."
              >
                <div className="form-grid">
                  {content.trust.map((s, i) => (
                    <React.Fragment key={i}>
                      <Text
                        label={`Başlık ${i + 1}`}
                        value={s.title}
                        onChange={(v) =>
                          update(
                            "trust",
                            content.trust.map((x, j) =>
                              j === i ? { ...x, title: v } : x,
                            ),
                          )
                        }
                      />
                      <Text
                        label={`Açıklama ${i + 1}`}
                        value={s.text}
                        onChange={(v) =>
                          update(
                            "trust",
                            content.trust.map((x, j) =>
                              j === i ? { ...x, text: v } : x,
                            ),
                          )
                        }
                      />
                    </React.Fragment>
                  ))}
                </div>
              </Section>
            </>
          )}
          {["slides", "news"].includes(tab) && (
            <>
              <div className="list-toolbar">
                <div className="admin-search">
                  <Search />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="İçeriklerde ara..."
                  />
                  {query && (
                    <button onClick={() => setQuery("")}>
                      <X />
                    </button>
                  )}
                </div>
                <button
                  className="primary-action"
                  onClick={() => {
                    if (tab === "slides")
                      update(tab, [...content[tab], { ...blankSlide }]);
                    if (tab === "news")
                      update(tab, [
                        ...content[tab],
                        { ...blankNews, id: String(Date.now()) },
                      ]);
                  }}
                >
                  <Plus /> Yeni {tab === "slides" ? "slider" : "haber"} ekle
                </button>
              </div>
              {filtered(tab).map((item, visibleIndex) => {
                const i = item._index;
                return (
                  <Section key={`${tab}-${i}`} title="" description="">
                    <CardHead
                      title={item.title}
                      index={i}
                      count={content[tab].length}
                      onMove={(d) => move(tab, i, d)}
                      onDelete={() => remove(tab, i)}
                    />
                    <div className="form-grid">
                      {tab === "slides" && (
                        <>
                          <Text
                            label="Üst etiket"
                            value={item.tag}
                            onChange={(v) =>
                              setList(tab, i, { ...item, tag: v })
                            }
                          />
                          <Text
                            label="Başlık"
                            value={item.title}
                            onChange={(v) =>
                              setList(tab, i, { ...item, title: v })
                            }
                          />
                          <Text
                            label="Açıklama"
                            wide
                            area
                            value={item.text}
                            onChange={(v) =>
                              setList(tab, i, { ...item, text: v })
                            }
                          />
                          <Text
                            label="Vurgu rengi"
                            type="color"
                            value={item.color}
                            onChange={(v) =>
                              setList(tab, i, { ...item, color: v })
                            }
                          />
                          <ImagePicker
                            value={item.image}
                            onChange={(v) =>
                              setList(tab, i, { ...item, image: v })
                            }
                          />
                        </>
                      )}
                      {tab === "news" && (
                        <>
                          <Text
                            label="Başlık"
                            value={item.title}
                            onChange={(v) =>
                              setList(tab, i, { ...item, title: v })
                            }
                          />
                          <Text
                            label="Kategori"
                            value={item.category}
                            onChange={(v) =>
                              setList(tab, i, { ...item, category: v })
                            }
                          />
                          <Text
                            label="Tarih"
                            value={item.date}
                            onChange={(v) =>
                              setList(tab, i, { ...item, date: v })
                            }
                          />
                          <Text
                            label="Kısa özet"
                            wide
                            area
                            value={item.summary}
                            onChange={(v) =>
                              setList(tab, i, { ...item, summary: v })
                            }
                          />
                          <Text
                            label="Haber metni"
                            wide
                            area
                            value={item.body}
                            onChange={(v) =>
                              setList(tab, i, { ...item, body: v })
                            }
                          />
                          <ImagePicker
                            value={item.image}
                            onChange={(v) =>
                              setList(tab, i, { ...item, image: v })
                            }
                          />
                          <Field label="Yayın durumu" wide>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.active !== false}
                                onChange={(e) =>
                                  setList(tab, i, {
                                    ...item,
                                    active: e.target.checked,
                                  })
                                }
                              />
                              <i />
                              <span>
                                {item.active !== false ? "Yayında" : "Taslak"}
                              </span>
                            </label>
                          </Field>
                        </>
                      )}
                    </div>
                  </Section>
                );
              })}
            </>
          )}
          {tab === "pages" && (
            <>
              <div className="list-toolbar">
                <div className="admin-search">
                  <Search />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Sayfa ara..."
                  />
                </div>
                <span className="result-count">{pageEntries.length} sayfa</span>
              </div>
              {pageEntries.map(([slug, p]) => (
                <details className="page-editor" key={slug}>
                  <summary>
                    <div>
                      <b>{p.title}</b>
                      <small>/{slug}</small>
                    </div>
                    <ChevronDown />
                  </summary>
                  <div className="form-grid">
                    <Text
                      label="Sayfa başlığı"
                      value={p.title}
                      onChange={(v) =>
                        update("pages", {
                          ...content.pages,
                          [slug]: { ...p, title: v },
                        })
                      }
                    />
                    <Text
                      label="Giriş açıklaması"
                      wide
                      area
                      value={p.lead}
                      onChange={(v) =>
                        update("pages", {
                          ...content.pages,
                          [slug]: { ...p, lead: v },
                        })
                      }
                    />
                    <ImagePicker
                      value={p.image}
                      onChange={(v) =>
                        update("pages", {
                          ...content.pages,
                          [slug]: { ...p, image: v },
                        })
                      }
                    />
                    {(p.qas || []).map((qa, i) => (
                      <div className="faq-editor wide" key={i}>
                        <Text
                          label={`Soru ${i + 1}`}
                          value={qa[0]}
                          onChange={(v) =>
                            update("pages", {
                              ...content.pages,
                              [slug]: {
                                ...p,
                                qas: p.qas.map((x, j) =>
                                  j === i ? [v, x[1]] : x,
                                ),
                              },
                            })
                          }
                        />
                        <Text
                          label="Cevap"
                          area
                          value={qa[1]}
                          onChange={(v) =>
                            update("pages", {
                              ...content.pages,
                              [slug]: {
                                ...p,
                                qas: p.qas.map((x, j) =>
                                  j === i ? [x[0], v] : x,
                                ),
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </>
          )}
          {tab === "typography" &&
            (() => {
              const defaults = {
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
                t = { ...defaults, ...content.settings.typography },
                change = (key, value) =>
                  update("settings", {
                    ...content.settings,
                    typography: { ...t, [key]: value },
                  });
              return (
                <>
                  <Section
                    title="Genel okuma ayarları"
                    description="Sitenin temel metin ölçüsünü ve satır aralığını belirleyin. Her ayar yazarken canlı önizlemeye uygulanır."
                  >
                    <div className="form-grid">
                      <SizeControl
                        label="Genel yazı boyutu"
                        hint="Formlar ve özel ölçüsü olmayan metinler"
                        value={t.body}
                        min={12}
                        max={20}
                        onChange={(v) => change("body", v)}
                        sample="Yedirenk ile iyiliğe ortak olun."
                      />
                      <SizeControl
                        label="Metin satır aralığı"
                        hint="Uzun paragrafların okuma rahatlığı"
                        value={t.lineHeight}
                        min={1.2}
                        max={2.2}
                        step={0.1}
                        onChange={(v) => change("lineHeight", v)}
                        sample="İyiliği, dayanışmayı ve güveni birlikte büyütüyoruz."
                      />
                      <SizeControl
                        label="Paragraf yazısı"
                        hint="Açıklamalar ve içerik metinleri"
                        value={t.bodyText}
                        min={12}
                        max={22}
                        onChange={(v) => change("bodyText", v)}
                        sample="Her destek kalıcı bir iyilik hikâyesine dönüşür."
                      />
                      <SizeControl
                        label="Üst menü yazısı"
                        hint="Masaüstü navigasyon bağlantıları"
                        value={t.nav}
                        min={11}
                        max={20}
                        onChange={(v) => change("nav", v)}
                        sample="Biz Kimiz · Projeler · Bağış Yap"
                      />
                    </div>
                  </Section>
                  <Section
                    title="Başlık boyutları"
                    description="Manşet, iç sayfa ve bölüm başlıklarını birbirinden bağımsız yönetin."
                  >
                    <div className="form-grid">
                      <SizeControl
                        label="Ana manşet başlığı"
                        value={t.heroTitle}
                        min={32}
                        max={80}
                        onChange={(v) => change("heroTitle", v)}
                        sample="İyiliğin Yedi Rengi"
                      />
                      <SizeControl
                        label="Manşet açıklaması"
                        value={t.heroText}
                        min={13}
                        max={24}
                        onChange={(v) => change("heroText", v)}
                        sample="Birlikte daha çok hayata dokunuyoruz."
                      />
                      <SizeControl
                        label="Bölüm başlıkları"
                        value={t.sectionTitle}
                        min={24}
                        max={56}
                        onChange={(v) => change("sectionTitle", v)}
                        sample="Çalışmalarımız"
                      />
                      <SizeControl
                        label="İç sayfa başlığı"
                        value={t.pageTitle}
                        min={30}
                        max={68}
                        onChange={(v) => change("pageTitle", v)}
                        sample="Hakkımızda"
                      />
                    </div>
                  </Section>
                  <Section
                    title="Kartlar, butonlar ve footer"
                    description="Tekrarlanan arayüz bileşenlerinin yazı ölçülerini hassas biçimde ayarlayın."
                  >
                    <div className="form-grid">
                      <SizeControl
                        label="Kart başlıkları"
                        value={t.cardTitle}
                        min={14}
                        max={30}
                        onChange={(v) => change("cardTitle", v)}
                        sample="Kalıcı Destek"
                      />
                      <SizeControl
                        label="Kart açıklamaları"
                        value={t.cardText}
                        min={11}
                        max={20}
                        onChange={(v) => change("cardText", v)}
                        sample="İhtiyaç sahiplerine düzenli destek ulaştırın."
                      />
                      <SizeControl
                        label="Buton yazıları"
                        value={t.button}
                        min={11}
                        max={20}
                        onChange={(v) => change("button", v)}
                        sample="Bağış Yap"
                      />
                      <SizeControl
                        label="Footer yazıları"
                        value={t.footer}
                        min={10}
                        max={18}
                        onChange={(v) => change("footer", v)}
                        sample="İletişim · Kurumsal · Yasal"
                      />
                    </div>
                    <div className="typography-actions">
                      <button
                        type="button"
                        onClick={() =>
                          update("settings", {
                            ...content.settings,
                            typography: defaults,
                          })
                        }
                      >
                        Yazı boyutlarını varsayılana döndür
                      </button>
                      <small>
                        Bu işlem yalnızca tipografi ayarlarını sıfırlar.
                      </small>
                    </div>
                  </Section>
                </>
              );
            })()}
          {tab === "settings" && (
            <>
              <Section
                title="Logo ve marka"
                description="Header ve footer alanında kullanılan logo."
              >
                <div className="form-grid">
                  <ImagePicker
                    label="Site logosu"
                    value={content.settings.logo}
                    onChange={(v) =>
                      update("settings", { ...content.settings, logo: v })
                    }
                  />
                  <Text
                    label="Logo genişliği (px)"
                    type="number"
                    value={content.settings.logoWidth}
                    onChange={(v) =>
                      update("settings", { ...content.settings, logoWidth: v })
                    }
                  />
                  <Text
                    label="Logo yüksekliği (px)"
                    type="number"
                    value={content.settings.logoHeight}
                    onChange={(v) =>
                      update("settings", { ...content.settings, logoHeight: v })
                    }
                  />
                  <Text
                    label="Üst duyuru metni"
                    wide
                    value={content.settings.alert}
                    onChange={(v) =>
                      update("settings", { ...content.settings, alert: v })
                    }
                  />
                </div>
              </Section>
              <Section
                title="İletişim bilgileri"
                description="Sitenin alt bölümünde gösterilen bilgiler."
              >
                <div className="form-grid">
                  <Text
                    label="Telefon"
                    value={content.settings.phone}
                    onChange={(v) =>
                      update("settings", { ...content.settings, phone: v })
                    }
                  />
                  <Text
                    label="E-posta"
                    value={content.settings.email}
                    onChange={(v) =>
                      update("settings", { ...content.settings, email: v })
                    }
                  />
                  <Text
                    label="Adres"
                    wide
                    value={content.settings.address}
                    onChange={(v) =>
                      update("settings", { ...content.settings, address: v })
                    }
                  />
                  <Text
                    label="Footer açıklaması"
                    wide
                    area
                    value={content.settings.footerText}
                    onChange={(v) =>
                      update("settings", { ...content.settings, footerText: v })
                    }
                  />
                </div>
              </Section>
              <Section
                title="Yedekleme ve sıfırlama"
                description="İçeriklerinizi JSON dosyası olarak saklayabilirsiniz."
              >
                <div className="backup-actions">
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(
                        new Blob([exportData()], { type: "application/json" }),
                      );
                      a.download = "yedirenk-icerik-yedegi.json";
                      a.click();
                    }}
                  >
                    <Download /> Yedeği indir
                  </button>
                  <button onClick={() => importRef.current.click()}>
                    <Upload /> Yedek yükle
                  </button>
                  <input
                    ref={importRef}
                    hidden
                    type="file"
                    accept="application/json"
                    onChange={(e) => {
                      const r = new FileReader();
                      r.onload = () => {
                        try {
                          importData(r.result);
                          flash("Yedek başarıyla yüklendi.");
                        } catch {
                          flash("Yedek dosyası geçerli değil.");
                        }
                      };
                      if (e.target.files[0]) r.readAsText(e.target.files[0]);
                    }}
                  />
                  <button
                    className="danger"
                    onClick={() =>
                      confirm("Tüm değişiklikler sıfırlansın mı?") && reset()
                    }
                  >
                    <Trash2 /> Varsayılana dön
                  </button>
                </div>
              </Section>
            </>
          )}
          {tab === "analytics" && <AnalyticsPanel />}{" "}
          {tab === "members" && <MembersPanel />}{" "}
          {tab === "projects" && (
            <ProjectsEditor content={content} update={update} />
          )}{" "}
          {tab === "sitePages" && (
            <SitePagesEditor content={content} update={update} />
          )}{" "}
          {tab === "allContent" && (
            <AllContentEditor content={content} update={update} />
          )}{" "}
          {tab === "languages" && (
            <LanguagesEditor content={content} update={update} />
          )}{" "}
          {tab === "structure" && (
            <StructureEditor content={content} update={update} />
          )}{" "}
          {tab === "footer" && (
            <FooterEditor content={content} update={update} />
          )}{" "}
        </div>
      </div>
    </main>
  );
}
