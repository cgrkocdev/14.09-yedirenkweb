import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "yedirenk-cms-v1";
const CmsContext = createContext(null);

const removeLegacyWording = (value) => {
  if (Array.isArray(value)) return value.map(removeLegacyWording);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        removeLegacyWording(key),
        removeLegacyWording(item),
      ]),
    );
  if (typeof value !== "string") return value;
  return value
    .replace(/emanet bilinci/gi, "sorumluluk bilinci")
    .replace(/emanet anlayışı/gi, "sorumluluk anlayışı")
    .replace(/emanet yaklaşımı/gi, "sorumluluk yaklaşımı")
    .replace(/emanet edilen/gi, "bağışlanan")
    .replace(/emanetçisi/gi, "sorumlusu")
    .replace(/emanetlerinizi/gi, "bağışlarınızı")
    .replace(/emanetiniz/gi, "bağışınız")
    .replace(/emanetinizi/gi, "bağışınızı")
    .replace(/emanetlerin/gi, "bağışların")
    .replace(/emanettir/gi, "değerlidir")
    .replace(/emanette/gi, "ortak amaçta")
    .replace(/emanetin/gi, "bağışın")
    .replace(/emaneti/gi, "bağışı")
    .replace(/emanetler/gi, "bağışlar")
    .replace(/emanet/gi, "bağış");
};

const replaceLegacyDonationRoute = (value) => {
  if (Array.isArray(value)) return value.map(replaceLegacyDonationRoute);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceLegacyDonationRoute(item),
      ]),
    );
  if (typeof value !== "string") return value;
  return /^\/bagis(?:[/?#]|$)/.test(value) ? "/projeler" : value;
};

const upgradeAboutNavigation = (navigation) =>
  (navigation || []).map((item) => ({
    ...item,
    cols: (item.cols || [])
      .filter(([title]) => title !== "İlkelerimiz")
      .map(([title, links]) => [
        title,
        (links || []).map((label) =>
          label === "Tarihçemiz"
            ? "İlham Kaynağımız"
            : label === "Yönetim"
              ? "Kurumsal"
              : label,
        ),
      ]),
  }));

export function CmsProvider({ defaults, children }) {
  const cleanDefaults = useMemo(
    () => removeLegacyWording(defaults),
    [defaults],
  );
  const [content, setContent] = useState(() => {
    try {
      let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        if (Number(saved.settings?.wordingVersion || 0) < 2)
          saved = removeLegacyWording(saved);
        if (Number(saved.settings?.donationRouteVersion || 0) < 2)
          saved = replaceLegacyDonationRoute(saved);
        const upgradeTypography =
            Number(saved.settings?.typographyVersion || 0) < 2,
          upgradeLogo = Number(saved.settings?.typographyVersion || 0) < 4,
          upgradeProjects = Number(saved.settings?.projectsVersion || 0) < 3,
          cleanupPlaceholderProjects =
            Number(saved.settings?.projectsVersion || 0) < 4,
          restoreQurbaniVariants =
            Number(saved.settings?.projectsVersion || 0) < 6,
          removeLegacyNavigation =
            Number(saved.settings?.navigationVersion || 0) < 2,
          upgradeWhoWeAreNavigation =
            Number(saved.settings?.navigationVersion || 0) < 3,
          replaceHomepageCampaigns =
            Number(saved.settings?.projectHomepageVersion || 0) < 2,
          replaceNewsletterWithVolunteer =
            Number(saved.settings?.footerVolunteerVersion || 0) < 1,
          replaceNewsImages = Number(saved.settings?.newsImageVersion || 0) < 2;
        return {
          ...cleanDefaults,
          ...saved,
          settings: {
            ...cleanDefaults.settings,
            ...saved.settings,
            ...(upgradeTypography
              ? { typography: cleanDefaults.settings.typography }
              : {}),
            ...(upgradeLogo
              ? {
                  logoWidth: cleanDefaults.settings.logoWidth,
                  logoHeight: cleanDefaults.settings.logoHeight,
                  typographyVersion: 4,
                }
              : {}),
            projectsVersion: 6,
            wordingVersion: 2,
            navigationVersion: 3,
            donationRouteVersion: 2,
            projectHomepageVersion: 2,
            footerVolunteerVersion: 1,
            newsImageVersion: 2,
            typography: upgradeTypography
              ? cleanDefaults.settings.typography
              : {
                  ...cleanDefaults.settings.typography,
                  ...saved.settings?.typography,
                },
          },
          home: {
            ...cleanDefaults.home,
            ...saved.home,
            ...(replaceHomepageCampaigns
              ? {
                  campaignEyebrow: cleanDefaults.home.campaignEyebrow,
                  campaignTitle: cleanDefaults.home.campaignTitle,
                  campaignText: cleanDefaults.home.campaignText,
                }
              : {}),
          },
          campaigns: [],
          news: replaceNewsImages
            ? cleanDefaults.news
            : saved.news || cleanDefaults.news,
          pages: { ...cleanDefaults.pages, ...saved.pages },
          footer: {
            ...cleanDefaults.footer,
            ...saved.footer,
            ...(replaceNewsletterWithVolunteer
              ? {
                  newsletterTitle: cleanDefaults.footer.newsletterTitle,
                  newsletterText: cleanDefaults.footer.newsletterText,
                  newsletterButton: cleanDefaults.footer.newsletterButton,
                  newsletterPlaceholder: "",
                }
              : {}),
          },
          sitePages: { ...cleanDefaults.sitePages, ...saved.sitePages },
          navigation: upgradeWhoWeAreNavigation
            ? upgradeAboutNavigation(
                (saved.navigation || cleanDefaults.navigation).filter(
                  (item) =>
                    !removeLegacyNavigation ||
                    !["Ne Yapıyoruz", "Nasıl Katılırsın"].includes(
                      String(item.label || "").replace(/\?$/, ""),
                    ),
                ),
              )
            : saved.navigation || cleanDefaults.navigation,
          overrides: {
            text: {
              ...cleanDefaults.overrides?.text,
              ...saved.overrides?.text,
            },
            media: {
              ...cleanDefaults.overrides?.media,
              ...saved.overrides?.media,
            },
          },
          languages: Object.fromEntries(
            Object.entries(cleanDefaults.languages || {}).map(([key, base]) => [
              key,
              {
                ...base,
                ...saved.languages?.[key],
                text: {
                  ...(base.text || {}),
                  ...(saved.languages?.[key]?.text || {}),
                },
                media: {
                  ...(base.media || {}),
                  ...(saved.languages?.[key]?.media || {}),
                },
              },
            ]),
          ),
          projects: (upgradeProjects
            ? cleanDefaults.projects
            : (saved.projects || cleanDefaults.projects).filter(
                (project) =>
                  !cleanupPlaceholderProjects ||
                  (!(project.slug || "").startsWith("yeni-proje-") &&
                    project.title !== "Yeni Proje"),
              )
          ).map((project) =>
            restoreQurbaniVariants &&
            project.slug === "adak-akika-nafile-kurban"
              ? {
                  ...project,
                  variants: [
                    ["Sudan", 5200, "TRY"],
                    ["Yemen", 5600, "TRY"],
                    ["Afganistan", 5400, "TRY"],
                    ["Afrika", 4800, "TRY"],
                  ],
                }
              : project,
          ),
          projectCategories: (
            saved.projectCategories || cleanDefaults.projectCategories
          ).filter(
            (category) =>
              !cleanupPlaceholderProjects ||
              !/^Yeni Proje(ler)?$/i.test(category),
          ),
        };
      }
      return cleanDefaults;
    } catch {
      return cleanDefaults;
    }
  });

  useEffect(() => {
    if (Number(content.settings?.newsImageVersion || 0) >= 2) return;
    setContent((current) => ({
      ...current,
      settings: {
        ...current.settings,
        newsImageVersion: 2,
      },
      news: cleanDefaults.news,
    }));
  }, [cleanDefaults.news, content.settings?.newsImageVersion]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      /* storage quota: keep current session usable */
    }
  }, [content]);
  const value = useMemo(
    () => ({
      content,
      update: (section, value) =>
        setContent((current) => ({ ...current, [section]: value })),
      reset: () => {
        localStorage.removeItem(STORAGE_KEY);
        setContent(cleanDefaults);
      },
      exportData: () => JSON.stringify(content, null, 2),
      importData: (raw) => {
        if (typeof raw !== "string" || raw.length > 4_000_000)
          throw new Error("Yedek dosyası çok büyük veya geçersiz.");
        const parsed = JSON.parse(raw);
        if (
          !parsed ||
          typeof parsed !== "object" ||
          Array.isArray(parsed) ||
          !Array.isArray(parsed.campaigns) ||
          !Array.isArray(parsed.news) ||
          parsed.campaigns.length > 200 ||
          parsed.news.length > 1000
        )
          throw new Error("Geçersiz yedek dosyası.");
        setContent({
          ...cleanDefaults,
          ...parsed,
          settings: {
            ...cleanDefaults.settings,
            ...parsed.settings,
            typography: {
              ...cleanDefaults.settings.typography,
              ...parsed.settings?.typography,
            },
          },
          home: { ...cleanDefaults.home, ...parsed.home },
          pages: { ...cleanDefaults.pages, ...parsed.pages },
          footer: { ...cleanDefaults.footer, ...parsed.footer },
        });
      },
    }),
    [content, cleanDefaults],
  );
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const value = useContext(CmsContext);
  if (!value) throw new Error("useCms must be used inside CmsProvider");
  return value;
}
