import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  FileImage,
  FileText,
  FolderKanban,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  BarChart3,
  Clock3,
  MapPin,
  Menu,
  MousePointerClick,
  Newspaper,
  Plus,
  Save,
  Search,
  Settings,
  Users,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCms } from "./cms";
import { getLocalAnalytics } from "./analytics";
import { eventTrafficSource } from "./analyticsAttribution";

const SECTIONS = [
  {
    id: "overview",
    label: "Başlangıç",
    description: "Sitede düzenlemek istediğiniz alanı seçin.",
    icon: LayoutDashboard,
    keys: [],
  },
  {
    id: "home",
    label: "Ana Sayfa",
    description: "Manşetler, ana sayfa metinleri, sayaçlar ve güven mesajları.",
    icon: Home,
    keys: ["home", "slides", "trust"],
  },
  {
    id: "projects",
    label: "Projeler",
    description: "Proje kartları, detay metinleri, fiyatlar ve seçenekler.",
    icon: FolderKanban,
    keys: ["projectCategories", "projects", "campaigns"],
  },
  {
    id: "news",
    label: "Haberler",
    description: "Haber ekleyin, metinlerini ve görsellerini değiştirin.",
    icon: Newspaper,
    keys: ["news"],
  },
  {
    id: "analytics",
    label: "Ziyaretçi Analitiği",
    description: "Ziyaret, tıklama, sayfada kalma ve konum istatistikleri.",
    icon: BarChart3,
    keys: [],
  },
  {
    id: "pages",
    label: "Sayfalar",
    description: "Kurumsal sayfalar, faaliyetler ve diğer sayfa içerikleri.",
    icon: FileText,
    keys: ["pages", "sitePages"],
  },
  {
    id: "structure",
    label: "Menü ve Kartlar",
    description: "Üst menü, bağlantılar ve çalışma alanı kartları.",
    icon: Menu,
    keys: ["navigation", "workAreas"],
  },
  {
    id: "footer",
    label: "Alt Alan",
    description: "Footer metinleri, bağlantılar ve sosyal medya hesapları.",
    icon: FileText,
    keys: ["footer"],
  },
  {
    id: "settings",
    label: "Genel Ayarlar",
    description: "Logo, iletişim bilgileri, diller ve genel site ayarları.",
    icon: Settings,
    keys: ["settings", "languages"],
  },
  {
    id: "all",
    label: "Tüm Site Verileri",
    description: "Sitedeki bütün düzenlenebilir alanların eksiksiz görünümü.",
    icon: Search,
    keys: null,
  },
];

const LABELS = {
  home: "Ana sayfa metinleri",
  slides: "Ana sayfa manşetleri",
  trust: "Güven mesajları",
  projects: "Projeler",
  projectCategories: "Proje kategorileri",
  campaigns: "Kampanyalar",
  news: "Haberler",
  pages: "Kurumsal ve faaliyet sayfaları",
  sitePages: "Sistem sayfaları",
  navigation: "Üst menü",
  workAreas: "Çalışma alanı kartları",
  footer: "Alt alan (footer)",
  settings: "Genel site ayarları",
  languages: "Dil ayarları",
  overrides: "Metin ve görsel düzeltmeleri",
  title: "Başlık",
  text: "Metin",
  description: "Açıklama",
  short: "Kısa açıklama",
  summary: "Özet",
  body: "Haber / sayfa metni",
  image: "Görsel",
  cardImage: "Proje seçenekleri dış kapak görseli",
  mobileImage: "Mobil görsel",
  logo: "Logo",
  label: "Görünen ad",
  category: "Kategori",
  date: "Tarih",
  published: "Yayın tarihi",
  active: "Yayında",
  path: "Bağlantı adresi",
  cta: "Buton yazısı",
  tag: "Üst etiket",
  slug: "Sayfa kısa adı",
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-posta",
  address: "Adres",
  currency: "Para birimi",
  variants: "Bağış seçenekleri",
  details: "Detay paragrafları",
  columns: "Footer sütunları",
  links: "Bağlantılar",
  items: "İçerikler",
  social: "Sosyal medya",
};

const TOP_LEVEL_TEMPLATES = {
  news: {
    id: "",
    category: "Duyuru",
    date: new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    published: new Date().toISOString().slice(0, 10),
    title: "Yeni haber başlığı",
    summary: "Haberin kısa özeti",
    body: "Haber metnini buraya yazın.",
    image: "/assets/news-hero-logo-v5.webp",
    active: true,
  },
  slides: {
    image: "/assets/hero.webp",
    tag: "YENİ MANŞET",
    title: "Yeni manşet",
    text: "Manşet açıklaması",
    cta: "Bağış Yap",
    path: "/projeler",
    color: "#06b2aa",
  },
  projects: {
    slug: "yeni-proje",
    category: "Genel",
    title: "Yeni Proje",
    short: "Projenin kısa açıklaması",
    description: "Projenin detaylı açıklaması",
    image: "/assets/aid.webp",
    cardImage: "/assets/aid.webp",
    variants: [["Standart", 1000, "TRY", "/assets/aid.webp"]],
    active: true,
  },
};

const humanize = (key) => {
  if (LABELS[key]) return LABELS[key];
  return String(key)
    .replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const replaceAtPath = (source, path, nextValue) => {
  if (!path.length) return nextValue;
  const [head, ...tail] = path;
  const copy = Array.isArray(source) ? [...source] : { ...source };
  copy[head] = replaceAtPath(source?.[head], tail, nextValue);
  return copy;
};

const blankLike = (value) => {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, blankLike(entry)]),
    );
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return true;
  return "";
};

const isMediaKey = (key) =>
  /(^|_)(image|logo|media|video|photo|cover|icon|görsel)$/i.test(String(key)) ||
  /(Image|Logo|Media|Video|Photo|Cover|Icon|Görsel)$/.test(String(key));

const isLongText = (key, value) =>
  String(value || "").length > 110 ||
  /(text|description|summary|body|quote|content|details|lead|short)/i.test(
    String(key),
  );

function Login({ logo, onLogin }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const success = await onLogin(password);
    if (!success) setError("Şifre hatalı veya sunucuya ulaşılamıyor.");
    setBusy(false);
  };
  return (
    <main className="admin-login-v2 cms-login">
      <form onSubmit={submit}>
        <img src={logo} alt="Yedirenk Derneği" />
        <span>İÇERİK YÖNETİMİ</span>
        <h1>Yönetim paneline giriş</h1>
        <p>Site metinlerini, sayfaları, haberleri ve görselleri buradan yönetin.</p>
        <label>
          Yönetici şifresi
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>
        {error && <small className="cms-error">{error}</small>}
        <button className="primary-action" disabled={busy}>
          {busy ? "Kontrol ediliyor…" : "Giriş Yap"}
        </button>
        <Link to="/">
          <ArrowLeft /> Siteye dön
        </Link>
      </form>
    </main>
  );
}

function MediaField({ value, onChange, label }) {
  const inputRef = useRef(null);
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(value || "") ||
    String(value || "").startsWith("data:video/");
  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      try {
        const bitmap = await createImageBitmap(file);
        const maxEdge = 1920;
        const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        onChange(canvas.toDataURL("image/webp", 0.82));
        event.target.value = "";
        return;
      } catch {
        // Older browsers fall back to the regular file reader below.
      }
    }
    if (file.size > 2_500_000) {
      window.alert("Bu medya dosyası çok büyük. En fazla 2,5 MB dosya seçin.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="cms-field cms-media-field">
      <label>{label}</label>
      <div className="cms-media-preview">
        {value ? (
          isVideo ? (
            <video src={value} controls preload="metadata" />
          ) : (
            <img src={value} alt="Görsel önizleme" />
          )
        ) : (
          <span><FileImage /> Görsel seçilmedi</span>
        )}
        <button type="button" onClick={() => inputRef.current?.click()}>
          <Upload /> Bilgisayardan seç
        </button>
      </div>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*,video/mp4,video/webm,video/ogg"
        onChange={selectFile}
      />
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Görsel adresi"
      />
    </div>
  );
}

function PrimitiveField({ fieldKey, value, onChange, label: labelOverride }) {
  const label = labelOverride || humanize(fieldKey);
  if (typeof value === "boolean") {
    return (
      <label className="cms-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }
  if (isMediaKey(fieldKey) && typeof value === "string") {
    return <MediaField label={label} value={value} onChange={onChange} />;
  }
  const inputType =
    typeof value === "number"
      ? "number"
      : /published/i.test(fieldKey) || /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? "date"
        : /(email)/i.test(fieldKey)
          ? "email"
          : "text";
  return (
    <div className="cms-field">
      <label>{label}</label>
      {isLongText(fieldKey, value) ? (
        <textarea
          rows={String(value || "").length > 500 ? 9 : 4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type={inputType}
          value={value ?? ""}
          onChange={(event) =>
            onChange(
              typeof value === "number"
                ? Number(event.target.value)
                : event.target.value,
            )
          }
        />
      )}
    </div>
  );
}

function EditorNode({ fieldKey, value, path, onChange, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  if (value === null || typeof value !== "object") {
    return (
      <PrimitiveField
        fieldKey={fieldKey}
        value={value ?? ""}
        onChange={(next) => onChange(path, next)}
      />
    );
  }

  if (Array.isArray(value)) {
    const addItem = () => {
      let item = "";
      if (depth === 0 && TOP_LEVEL_TEMPLATES[fieldKey]) {
        item = deepClone(TOP_LEVEL_TEMPLATES[fieldKey]);
        if (fieldKey === "news") item.id = String(Date.now());
      } else if (value.length) {
        const sample = value[value.length - 1];
        if (Array.isArray(sample)) item = sample.map((entry) =>
          typeof entry === "number" ? 0 : typeof entry === "boolean" ? true : "",
        );
        else if (sample && typeof sample === "object") item = blankLike(sample);
      }
      onChange(path, [...value, item]);
    };
    const updateItem = (index, next) => {
      const copy = [...value];
      copy[index] = next;
      onChange(path, copy);
    };
    const removeItem = (index) => {
      if (!window.confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;
      onChange(path, value.filter((_, itemIndex) => itemIndex !== index));
    };
    const moveItem = (index, direction) => {
      const target = index + direction;
      if (target < 0 || target >= value.length) return;
      const copy = [...value];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      onChange(path, copy);
    };
    return (
      <section className={`cms-node cms-array depth-${Math.min(depth, 3)}`}>
        <button className="cms-node-title" type="button" onClick={() => setOpen(!open)}>
          {open ? <ChevronDown /> : <ChevronRight />}
          <span>{humanize(fieldKey)}</span>
          <small>{value.length} içerik</small>
        </button>
        {open && (
          <div className="cms-node-body">
            {value.map((item, index) => {
              const title =
                item?.title || item?.label || item?.tag || item?.name ||
                (Array.isArray(item) ? item[0] : "") || `${index + 1}. içerik`;
              return (
                <article className="cms-list-item" key={`${path.join(".")}-${index}`}>
                  <header>
                    <b>{String(title)}</b>
                    <div>
                      <button type="button" disabled={!index} onClick={() => moveItem(index, -1)} title="Yukarı taşı"><ArrowUp /></button>
                      <button type="button" disabled={index === value.length - 1} onClick={() => moveItem(index, 1)} title="Aşağı taşı"><ArrowDown /></button>
                      <button type="button" className="danger" onClick={() => removeItem(index)} title="Sil"><Trash2 /></button>
                    </div>
                  </header>
                  <EditorNode
                    fieldKey={String(index + 1)}
                    value={item}
                    path={[]}
                    depth={depth + 1}
                    onChange={(itemPath, next) =>
                      updateItem(
                        index,
                        itemPath.length
                          ? replaceAtPath(item, itemPath, next)
                          : next,
                      )
                    }
                  />
                </article>
              );
            })}
            <button className="cms-add-button" type="button" onClick={addItem}>
              <Plus /> Yeni içerik ekle
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`cms-node cms-object depth-${Math.min(depth, 3)}`}>
      <button className="cms-node-title" type="button" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown /> : <ChevronRight />}
        <span>{humanize(fieldKey)}</span>
        <small>{Object.keys(value).length} alan</small>
      </button>
      {open && (
        <div className="cms-node-body cms-fields-grid">
          {Object.entries(value).map(([key, child]) => (
            <EditorNode
              key={key}
              fieldKey={key}
              value={child}
              path={[...path, key]}
              depth={depth + 1}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const DICTIONARY_KEYS = new Set(["pages", "sitePages", "languages"]);

function SimpleRepeater({ fieldKey, value, onChange, depth }) {
  const add = () => {
    const sample = value.at(-1);
    const next =
      fieldKey === "variants"
        ? ["", 0, sample?.[2] || "TRY", ""]
        : Array.isArray(sample)
          ? sample.map((entry) => blankLike(entry))
          : sample === undefined
            ? ""
            : blankLike(sample);
    onChange([...value, next]);
  };
  const updateItem = (index, next) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };
  const remove = (index) => {
    if (!window.confirm("Bu satırı silmek istediğinize emin misiniz?")) return;
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };
  return (
    <section className="studio-repeater">
      <header>
        <div><b>{humanize(fieldKey)}</b><small>{value.length} satır</small></div>
        <button type="button" onClick={add}><Plus /> Satır ekle</button>
      </header>
      <div className="studio-repeater-list">
        {value.map((item, index) => (
          <article key={index}>
            <div className="studio-row-head">
              <span>{index + 1}</span>
              <b>{item?.title || item?.label || item?.name || (Array.isArray(item) ? item[0] : "") || `${index + 1}. satır`}</b>
              <div>
                <button type="button" disabled={!index} onClick={() => move(index, -1)}><ArrowUp /></button>
                <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)}><ArrowDown /></button>
                <button type="button" className="danger" onClick={() => remove(index)}><Trash2 /></button>
              </div>
            </div>
            {Array.isArray(item) ? (
              <div className="studio-tuple-fields">
                {item.map((entry, entryIndex) => (
                  <PrimitiveField
                    key={entryIndex}
                    fieldKey={
                      ["Seçenek adı", "Tutar", "Para birimi", "Proje içi varyant görsel", "Açıklama"][entryIndex] ||
                      `${entryIndex + 1}. alan`
                    }
                    value={entry ?? ""}
                    onChange={(next) => {
                      const copy = [...item];
                      copy[entryIndex] = next;
                      updateItem(index, copy);
                    }}
                  />
                ))}
              </div>
            ) : item !== null && typeof item === "object" ? (
              <SimpleForm
                value={item}
                depth={depth + 1}
                onChange={(next) => updateItem(index, next)}
              />
            ) : (
              <PrimitiveField
                fieldKey={`${humanize(fieldKey)} ${index + 1}`}
                value={item ?? ""}
                onChange={(next) => updateItem(index, next)}
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SimpleForm({ value, onChange, depth = 0, dataKey = "" }) {
  if (Array.isArray(value)) {
    return <SimpleRepeater fieldKey="İçerikler" value={value} onChange={onChange} depth={depth} />;
  }
  if (!value || typeof value !== "object") {
    return <PrimitiveField fieldKey="Değer" value={value ?? ""} onChange={onChange} />;
  }
  const entries = Object.entries(value);
  const primitives = entries.filter(([, child]) => child === null || typeof child !== "object");
  const groups = entries.filter(([, child]) => child !== null && typeof child === "object");
  const change = (key, next) => onChange({ ...value, [key]: next });
  return (
    <div className={`studio-form depth-${Math.min(depth, 2)}`}>
      {primitives.length > 0 && (
        <div className="studio-field-grid">
          {primitives.map(([key, child]) => (
            <PrimitiveField
              key={key}
              fieldKey={key}
              label={
                dataKey === "projects" && key === "image"
                  ? "Proje içi varsayılan görsel"
                  : undefined
              }
              value={child ?? ""}
              onChange={(next) => change(key, next)}
            />
          ))}
        </div>
      )}
      {groups.map(([key, child]) =>
        Array.isArray(child) ? (
          <SimpleRepeater key={key} fieldKey={key} value={child} onChange={(next) => change(key, next)} depth={depth} />
        ) : (
          <section className="studio-subsection" key={key}>
            <header><b>{humanize(key)}</b><small>Bu bölümdeki alanları düzenleyin</small></header>
            <SimpleForm value={child} onChange={(next) => change(key, next)} depth={depth + 1} dataKey={dataKey} />
          </section>
        ),
      )}
    </div>
  );
}

function CollectionEditor({ dataKey, value, onChange }) {
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (selected >= value.length) setSelected(Math.max(0, value.length - 1));
  }, [selected, value.length]);
  const add = () => {
    let item = TOP_LEVEL_TEMPLATES[dataKey]
      ? deepClone(TOP_LEVEL_TEMPLATES[dataKey])
      : value.length
        ? blankLike(value.at(-1))
        : "";
    if (dataKey === "news") item.id = String(Date.now());
    onChange([...value, item]);
    setSelected(value.length);
  };
  const remove = () => {
    if (!value.length || !window.confirm("Seçili içeriği silmek istediğinize emin misiniz?")) return;
    onChange(value.filter((_, index) => index !== selected));
  };
  const updateSelected = (next) => {
    const copy = [...value];
    copy[selected] = next;
    onChange(copy);
  };
  return (
    <div className="studio-master-detail">
      <aside className="studio-record-list">
        <header><b>{humanize(dataKey)}</b><button type="button" onClick={add}><Plus /> Yeni ekle</button></header>
        <div>
          {value.map((item, index) => (
            <button type="button" className={selected === index ? "active" : ""} key={index} onClick={() => setSelected(index)}>
              {item?.image && <img src={item.image} alt="" />}
              <span>
                <b>{item?.title || item?.label || item?.tag || item?.name || (Array.isArray(item) ? item[0] : "") || `${index + 1}. içerik`}</b>
                <small>{item?.category || item?.date || item?.path || "Düzenlemek için seçin"}</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </aside>
      <section className="studio-record-editor">
        {value.length ? (
          <>
            <header className="studio-editor-heading">
              <div><span>SEÇİLİ İÇERİK</span><h3>{value[selected]?.title || value[selected]?.label || value[selected]?.tag || `${selected + 1}. içerik`}</h3></div>
              <button type="button" className="studio-delete" onClick={remove}><Trash2 /> Bu içeriği sil</button>
            </header>
            <SimpleForm value={value[selected]} onChange={updateSelected} dataKey={dataKey} />
          </>
        ) : (
          <div className="studio-empty"><FileText /><h3>Henüz içerik yok</h3><p>İlk içeriği oluşturmak için “Yeni ekle” düğmesine basın.</p></div>
        )}
      </section>
    </div>
  );
}

function DictionaryEditor({ dataKey, value, onChange }) {
  const keys = Object.keys(value || {});
  const [selectedKey, setSelectedKey] = useState(keys[0] || "");
  useEffect(() => {
    if (!value?.[selectedKey]) setSelectedKey(Object.keys(value || {})[0] || "");
  }, [selectedKey, value]);
  const add = () => {
    const entered = window.prompt("Yeni sayfanın kısa adını yazın (örnek: yeni-sayfa)");
    const key = String(entered || "").trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, "-");
    if (!key || value[key]) return;
    const sample = value[keys[0]] || { title: "", text: "" };
    onChange({ ...value, [key]: blankLike(sample) });
    setSelectedKey(key);
  };
  const remove = () => {
    if (!selectedKey || !window.confirm("Seçili sayfayı silmek istediğinize emin misiniz?")) return;
    const copy = { ...value };
    delete copy[selectedKey];
    onChange(copy);
  };
  return (
    <div className="studio-master-detail">
      <aside className="studio-record-list">
        <header><b>{humanize(dataKey)}</b><button type="button" onClick={add}><Plus /> Yeni ekle</button></header>
        <div>
          {keys.map((key) => (
            <button type="button" className={selectedKey === key ? "active" : ""} key={key} onClick={() => setSelectedKey(key)}>
              <span><b>{value[key]?.title || value[key]?.label || humanize(key)}</b><small>{humanize(key)}</small></span><ChevronRight />
            </button>
          ))}
        </div>
      </aside>
      <section className="studio-record-editor">
        {selectedKey ? (
          <>
            <header className="studio-editor-heading">
              <div><span>SEÇİLİ SAYFA</span><h3>{value[selectedKey]?.title || humanize(selectedKey)}</h3></div>
              <button type="button" className="studio-delete" onClick={remove}><Trash2 /> Bu sayfayı sil</button>
            </header>
            <SimpleForm value={value[selectedKey]} onChange={(next) => onChange({ ...value, [selectedKey]: next })} />
          </>
        ) : <div className="studio-empty"><FileText /><h3>Sayfa bulunamadı</h3></div>}
      </section>
    </div>
  );
}

function SectionStudio({ keys, content, onTopLevelChange }) {
  const [activeKey, setActiveKey] = useState(keys[0] || "");
  useEffect(() => {
    if (!keys.includes(activeKey)) setActiveKey(keys[0] || "");
  }, [activeKey, keys]);
  const value = content[activeKey];
  return (
    <div className="content-studio">
      {keys.length > 1 && (
        <div className="studio-data-tabs">
          {keys.map((key) => <button type="button" className={activeKey === key ? "active" : ""} key={key} onClick={() => setActiveKey(key)}>{humanize(key)}</button>)}
        </div>
      )}
      {Array.isArray(value) ? (
        <CollectionEditor dataKey={activeKey} value={value} onChange={(next) => onTopLevelChange(activeKey, next)} />
      ) : DICTIONARY_KEYS.has(activeKey) ? (
        <DictionaryEditor dataKey={activeKey} value={value || {}} onChange={(next) => onTopLevelChange(activeKey, next)} />
      ) : (
        <section className="studio-single-editor">
          <header className="studio-editor-heading"><div><span>DÜZENLEME FORMU</span><h3>{humanize(activeKey)}</h3></div></header>
          <SimpleForm value={value || {}} onChange={(next) => onTopLevelChange(activeKey, next)} />
        </section>
      )}
    </div>
  );
}

const searchContent = (content, query) => {
  const needle = query.trim().toLocaleLowerCase("tr-TR");
  if (needle.length < 2) return [];
  const results = [];
  const walk = (value, path = []) => {
    if (typeof value === "string" && value.toLocaleLowerCase("tr-TR").includes(needle)) {
      results.push({ path, value });
      return;
    }
    if (Array.isArray(value)) value.forEach((entry, index) => walk(entry, [...path, index]));
    else if (value && typeof value === "object")
      Object.entries(value).forEach(([key, entry]) => walk(entry, [...path, key]));
  };
  walk(content);
  return results.slice(0, 50);
};

const formatDuration = (seconds) => {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  if (value < 60) return `${value} sn`;
  return `${Math.floor(value / 60)} dk ${value % 60} sn`;
};

const maskIp = (ip = "") => {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.***.***` : ip;
  }
  if (ip.includes(":")) return `${ip.split(":").slice(0, 3).join(":")}:…`;
  return ip || "Bilinmiyor";
};

function AnalyticsDashboard() {
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState(7);
  const [showIps, setShowIps] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      if (import.meta.env.DEV) {
        setEvents(getLocalAnalytics());
      } else {
        const response = await fetch("/api/admin/analytics", { credentials: "same-origin" });
        if (!response.ok) throw new Error();
        const result = await response.json();
        setEvents(Array.isArray(result.events) ? result.events : []);
      }
    } catch {
      setError("Analitik verileri alınamadı. Sunucu bağlantısını kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const report = useMemo(() => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const since = days === 1 ? todayStart.getTime() : todayStart.getTime() - (days - 1) * 86400000;
    const filtered = events.filter((event) => Number(event.timestamp) >= since);
    const sessions = new Map();
    const pages = new Map();
    const places = new Map();
    const timeline = new Map();
    const sources = new Map();
    let views = 0;
    let clicks = 0;
    let duration = 0;
    let durations = 0;

    if (days === 1) {
      for (let hour = 0; hour < 24; hour += 1) {
        const timestamp = todayStart.getTime() + hour * 3600000;
        const key = `${String(hour).padStart(2, "0")}:00`;
        timeline.set(key, { key, timestamp, views: 0, clicks: 0, sessions: new Set() });
      }
    } else {
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(todayStart.getTime() - offset * 86400000);
        const key = date.toLocaleDateString("tr-TR");
        timeline.set(key, { key, timestamp: date.getTime(), views: 0, clicks: 0, sessions: new Set() });
      }
    }

    filtered.forEach((event) => {
      const timestamp = Number(event.timestamp) || 0;
      const data = event.data || {};
      const path = String(event.path || "/");
      const sessionId = String(event.sessionId || "bilinmiyor");
      const country = String(event.country || data._geoCountry || "Bilinmiyor");
      const region = String(event.region || "");
      const city = String(event.city || data._geoCity || "Bilinmiyor");
      const eventDate = new Date(timestamp);
      const key = days === 1 ? `${String(eventDate.getHours()).padStart(2, "0")}:00` : eventDate.toLocaleDateString("tr-TR");
      const period = timeline.get(key) || { key, timestamp, views: 0, clicks: 0, sessions: new Set() };
      period.sessions.add(sessionId);
      if (event.event === "page_view") { views++; period.views++; }
      if (event.event === "click") { clicks++; period.clicks++; }
      period.timestamp = Math.min(period.timestamp, timestamp);
      timeline.set(key, period);

      const page = pages.get(path) || { path, views: 0, clicks: 0, duration: 0, durations: 0 };
      if (event.event === "page_view") page.views++;
      if (event.event === "click") page.clicks++;
      if (event.event === "page_duration") {
        const seconds = Math.min(86400, Math.max(0, Number(data.seconds) || 0));
        page.duration += seconds; page.durations++; duration += seconds; durations++;
      }
      pages.set(path, page);

      const placeKey = `${country}|${city}`;
      const place = places.get(placeKey) || { country, city, sessions: new Set(), views: 0 };
      place.sessions.add(sessionId);
      if (event.event === "page_view") place.views++;
      places.set(placeKey, place);

      if (event.event === "page_view") {
        const source = eventTrafficSource(event);
        const sourceRow = sources.get(source) || { source, views: 0, sessions: new Set(), campaigns: new Set() };
        if (data._trafficCampaign) sourceRow.campaigns.add(String(data._trafficCampaign));
        sourceRow.views++; sourceRow.sessions.add(sessionId); sources.set(source, sourceRow);
      }

      const session = sessions.get(sessionId) || {
        id: sessionId, ip: event.ip || "", country, region, city, timezone: event.timezone || "", isp: event.isp || "",
        views: 0, clicks: 0, duration: 0, firstAt: timestamp, lastPath: path, lastAt: timestamp,
        referrer: event.referrer || "", source: eventTrafficSource(event), userAgent: event.userAgent || "",
      };
      if (event.event === "page_view") session.views++;
      if (event.event === "click") session.clicks++;
      if (event.event === "page_duration") session.duration += Math.min(86400, Math.max(0, Number(data.seconds) || 0));
      if (timestamp >= session.lastAt) { session.lastAt = timestamp; session.lastPath = path; }
      session.firstAt = Math.min(session.firstAt, timestamp);
      if (!session.ip && event.ip) session.ip = event.ip;
      if ((!session.country || session.country === "Bilinmiyor") && country !== "Bilinmiyor") { session.country = country; session.region = region; session.city = city; }
      sessions.set(sessionId, session);
    });

    return {
      sessions: [...sessions.values()].sort((a, b) => b.lastAt - a.lastAt),
      pages: [...pages.values()].sort((a, b) => b.views - a.views).slice(0, 12),
      places: [...places.values()].map((p) => ({ ...p, count: p.sessions.size })).sort((a, b) => b.count - a.count).slice(0, 12),
      timeline: [...timeline.values()].sort((a, b) => days === 1 ? a.key.localeCompare(b.key) : a.timestamp - b.timestamp),
      sources: [...sources.values()].map((s) => ({ ...s, unique: s.sessions.size, campaign: [...s.campaigns].join(", ") })).sort((a, b) => b.views - a.views).slice(0, 10),
      views, clicks, unique: sessions.size, average: durations ? duration / durations : 0,
    };
  }, [events, days]);

  const maxTimeline = Math.max(1, ...report.timeline.map((row) => row.views));
  const visibleSessions = report.sessions.filter((session) => `${session.ip} ${session.country} ${session.region} ${session.city} ${session.lastPath} ${session.isp} ${session.source}`.toLocaleLowerCase("tr-TR").includes(searchText.toLocaleLowerCase("tr-TR")));
  const exportCsv = () => {
    const q = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [["IP", "Ülke", "Bölge", "Şehir", "İlk görülme", "Son görülme", "Sayfa", "Tıklama", "Süre (sn)", "Son sayfa", "Geliş kaynağı", "Yönlendiren", "İnternet sağlayıcı", "Tarayıcı bilgisi"], ...visibleSessions.map((s) => [s.ip,s.country,s.region,s.city,new Date(s.firstAt).toLocaleString("tr-TR"),new Date(s.lastAt).toLocaleString("tr-TR"),s.views,s.clicks,s.duration,s.lastPath,s.source,s.referrer,s.isp,s.userAgent])];
    const blob = new Blob(["\uFEFF" + rows.map((row) => row.map(q).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `yedirenk-ziyaretci-raporu-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
  };
  return (
    <div className="analytics-dashboard">
      <section className="analytics-toolbar">
        <div><b>Ziyaretçi hareketleri</b><small>IP, konum ve hareketler oturum bazında son 30 güne kadar tutulur.</small></div>
        <div>
          {[1, 7, 30].map((value) => <button key={value} className={days === value ? "active" : ""} onClick={() => setDays(value)}>{value === 1 ? "Bugün" : `${value} gün`}</button>)}
          <button title="Yenile" onClick={load}><RefreshCw /></button>
          <button title="CSV raporu indir" onClick={exportCsv}><Download /> CSV</button>
        </div>
      </section>
      {error && <div className="analytics-error">{error}</div>}
      <section className="analytics-kpis">
        {[
          [Users, "Tekil ziyaretçi", report.unique],
          [Eye, "Sayfa görüntüleme", report.views],
          [MousePointerClick, "Toplam tıklama", report.clicks],
          [Clock3, "Ortalama kalma", formatDuration(report.average)],
        ].map(([Icon, label, value]) => <article key={label}><Icon /><span><small>{label}</small><strong>{loading ? "…" : value}</strong></span></article>)}
      </section>
      <section className="analytics-grid">
        <article className="analytics-card analytics-chart">
          <h3>{days === 1 ? "Saatlik trafik" : "Günlük trafik"}</h3>
          <div>{report.timeline.map((row) => <span key={row.key} title={`${row.views} görüntüleme · ${row.clicks} tıklama · ${row.sessions.size} ziyaretçi`}><i style={{ height: `${Math.max(5, row.views / maxTimeline * 100)}%` }} /><small>{days === 1 ? row.key : row.key.slice(0, 5)}</small></span>)}</div>
          {!report.timeline.length && <p>Bu aralıkta henüz veri yok.</p>}
        </article>
        <article className="analytics-card">
          <h3><MapPin /> Ülke ve şehirler</h3>
          <div className="analytics-table compact">
            {report.places.map((place) => <div key={`${place.country}-${place.city}`}><span><b>{place.city || "Bilinmiyor"}</b><small>{place.country || "Bilinmiyor"}</small></span><strong>{place.count}</strong></div>)}
          </div>
        </article>
      </section>
      <section className="analytics-grid analytics-secondary-grid">
        <article className="analytics-card"><h3>Geliş kaynakları</h3><div className="analytics-table compact">{report.sources.map((row) => <div key={row.source}><span><b>{row.source}</b><small>{row.unique} tekil ziyaretçi{row.campaign ? ` · ${row.campaign}` : ""}</small></span><strong>{row.views}</strong></div>)}</div></article>
        <article className="analytics-card"><h3>Rapor araçları</h3><p className="analytics-privacy">Aşağıdaki listeyi IP, şehir, ülke, sayfa veya internet sağlayıcısına göre arayabilirsiniz.</p><div className="analytics-report-tools"><label><Search /><input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="IP, şehir, ülke veya sayfa ara" /></label><button onClick={() => setShowIps((value) => !value)}>{showIps ? "IP adreslerini maskele" : "Tam IP adreslerini göster"}</button><button onClick={exportCsv}><Download /> CSV raporu indir</button></div></article>
      </section>
      <section className="analytics-card">
        <h3>En çok ziyaret edilen sayfalar</h3>
        <div className="analytics-table analytics-pages">
          <header><span>Sayfa</span><span>Görüntüleme</span><span>Tıklama</span><span>Ort. süre</span></header>
          {report.pages.map((page) => <div key={page.path}><b>{page.path}</b><span>{page.views}</span><span>{page.clicks}</span><span>{formatDuration(page.durations ? page.duration / page.durations : 0)}</span></div>)}
        </div>
      </section>
      <section className="analytics-card">
        <h3>Son ziyaretçi oturumları</h3>
        <p className="analytics-privacy">IP adresleri yalnızca bu yönetici ekranında görünür. CSV raporu seçili tarih aralığını ve mevcut arama filtresini kullanır.</p>
        <div className="analytics-table analytics-visitors">
          <header><span>IP / Konum</span><span>Son sayfa</span><span>Hareket</span><span>Kalma süresi</span><span>Son görülme</span></header>
          {visibleSessions.slice(0, 250).map((session) => <div key={session.id} title={`${session.userAgent}\n${session.isp}`}><span><b>{showIps ? (session.ip || "Bilinmiyor") : maskIp(session.ip)}</b><small>{[session.city, session.region, session.country].filter((v) => v && v !== "Bilinmiyor").join(", ") || "Konum çözülüyor"}{session.isp ? ` · ${session.isp}` : ""}</small></span><b>{session.lastPath}</b><span>{session.views} sayfa · {session.clicks} tık</span><span>{formatDuration(session.duration)}</span><span><small>İlk: {new Date(session.firstAt).toLocaleString("tr-TR")}</small>Son: {new Date(session.lastAt).toLocaleString("tr-TR")}</span></div>)}
        </div>
      </section>
    </div>
  );
}

export default function AdminPanel() {
  const { content, update, importData } = useCms();
  const [loggedIn, setLoggedIn] = useState(false);
  const [sectionId, setSectionId] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const password =
    import.meta.env.VITE_ADMIN_PASSWORD ||
    (import.meta.env.DEV ? "yedirenk2026" : "");

  const login = async (enteredPassword) => {
    if (!import.meta.env.PROD) {
      if (!password || enteredPassword !== password) return false;
      setLoggedIn(true);
      return true;
    }
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: enteredPassword }),
      });
      if (!response.ok) return false;
      const savedResponse = await fetch("/api/admin/content", {
        credentials: "same-origin",
      });
      if (savedResponse.ok) {
        const saved = await savedResponse.json();
        if (saved.content) importData(JSON.stringify(saved.content));
      }
      setLoggedIn(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    if (import.meta.env.PROD) {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      }).catch(() => {});
    }
    setLoggedIn(false);
  };

  const save = async () => {
    setSaving(true);
    if (import.meta.env.PROD) {
      try {
        const response = await fetch("/api/admin/content", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });
        if (!response.ok) throw new Error();
        setNotice("Değişiklikler yayınlandı.");
        setDirty(false);
      } catch {
        setNotice("Kaydetme başarısız. Oturumu ve internet bağlantısını kontrol edin.");
      }
    } else {
      setNotice("Değişiklikler lokalde kaydedildi ve siteye uygulandı.");
      setDirty(false);
    }
    setSaving(false);
    window.setTimeout(() => setNotice(""), 3000);
  };

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const changeTopLevel = (key, path, nextValue) => {
    const current = content[key];
    update(key, path.length ? replaceAtPath(current, path, nextValue) : nextValue);
    setDirty(true);
  };

  const selectedSection = SECTIONS.find((section) => section.id === sectionId) || SECTIONS[0];
  const visibleKeys =
    selectedSection.keys === null
      ? Object.keys(content)
      : selectedSection.keys || [];
  const results = useMemo(() => searchContent(content, query), [content, query]);

  if (!loggedIn) return <Login logo={content.settings?.logo} onLogin={login} />;

  return (
    <main className="cms-admin">
      <aside className={mobileMenu ? "open" : ""}>
        <div className="cms-admin-brand">
          <img src={content.settings?.logo} alt="Yedirenk Derneği" />
          <button type="button" onClick={() => setMobileMenu(false)}><X /></button>
        </div>
        <nav>
          {SECTIONS.map(({ id, label, description, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={sectionId === id ? "active" : ""}
              onClick={() => {
                setSectionId(id);
                setMobileMenu(false);
                window.scrollTo(0, 0);
              }}
            >
              <Icon />
              <span><b>{label}</b><small>{description}</small></span>
            </button>
          ))}
        </nav>
        <div className="cms-admin-aside-actions">
          <Link to="/" target="_blank"><Eye /> Siteyi görüntüle</Link>
          <button type="button" onClick={logout}><LogOut /> Güvenli çıkış</button>
        </div>
      </aside>

      {mobileMenu && <button className="cms-admin-overlay" onClick={() => setMobileMenu(false)} />}

      <div className="cms-admin-workspace">
        <header className="cms-admin-topbar">
          <button className="cms-mobile-menu" type="button" onClick={() => setMobileMenu(true)}><Menu /></button>
          <div>
            <small>YEDİRENK İÇERİK YÖNETİMİ</small>
            <h1>{selectedSection.label}</h1>
          </div>
          <div className="cms-top-actions">
            <Link to="/" target="_blank"><Eye /> Önizle</Link>
            <button className="cms-save" type="button" onClick={save} disabled={saving}>
              {saving ? <span className="cms-spinner" /> : dirty ? <Save /> : <Check />}
              {saving ? "Kaydediliyor…" : dirty ? "Değişiklikleri Yayınla" : "Kaydedildi"}
            </button>
          </div>
        </header>

        {notice && <div className="cms-notice"><Check /> {notice}</div>}

        <div className="cms-admin-content">
          {sectionId === "analytics" ? (
            <AnalyticsDashboard />
          ) : sectionId === "overview" ? (
            <>
              <section className="cms-welcome">
                <div>
                  <span>HOŞ GELDİNİZ</span>
                  <h2>Sitedeki her içeriği buradan yönetin</h2>
                  <p>Değiştirmek istediğiniz kelimeyi arayın veya aşağıdan ilgili bölümü seçin. Kod bilmeniz gerekmez.</p>
                </div>
                <Image />
              </section>
              <section className="cms-search-box">
                <Search />
                <div>
                  <label>Sitede bir yazı bul</label>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Örneğin: Gazze, bağış yap, iletişim…" />
                </div>
                {query && <button type="button" onClick={() => setQuery("")}><X /></button>}
              </section>
              {query.trim().length > 1 && (
                <section className="cms-search-results">
                  <h3>{results.length} sonuç bulundu</h3>
                  {results.map((result, index) => {
                    const topKey = String(result.path[0]);
                    const target = SECTIONS.find((section) => section.keys?.includes(topKey)) || SECTIONS.at(-1);
                    return (
                      <button key={`${result.path.join(".")}-${index}`} onClick={() => setSectionId(target.id)}>
                        <small>{result.path.map(humanize).join(" › ")}</small>
                        <span>{result.value}</span>
                        <ChevronRight />
                      </button>
                    );
                  })}
                </section>
              )}
              <section className="cms-section-cards">
                {SECTIONS.filter((section) => !["overview", "all"].includes(section.id)).map(({ id, label, description, icon: Icon }) => (
                  <button key={id} onClick={() => setSectionId(id)}>
                    <Icon /><span><b>{label}</b><small>{description}</small></span><ChevronRight />
                  </button>
                ))}
              </section>
            </>
          ) : (
            <>
              <section className="cms-page-intro">
                <div><span>DÜZENLEME ALANI</span><h2>{selectedSection.label}</h2><p>{selectedSection.description}</p></div>
                <div className="cms-edit-tip"><FileText /><span><b>Nasıl kullanılır?</b><small>Başlıklara dokunarak alanları açın. Değişiklik bitince “Yayınla” düğmesine basın.</small></span></div>
              </section>
              <SectionStudio
                keys={visibleKeys}
                content={content}
                onTopLevelChange={(key, nextValue) =>
                  changeTopLevel(key, [], nextValue)
                }
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
