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
    .replace(/Yönetim Kurulu Mesajı/g, "Başkanın Mesajı")
    .replace(/Yönetim Kurulumuzdan/g, "Başkanın Mesajı")
    .replace(/YÖNETİM KURULUNDAN/g, "BAŞKANIN MESAJI")
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

const collectBundledAssetPaths = (value, paths = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectBundledAssetPaths(item, paths));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectBundledAssetPaths(item, paths));
  } else if (typeof value === "string" && value.startsWith("/assets/")) {
    paths.add(value);
  }
  return paths;
};

const upgradeBundledAssetPaths = (value, currentPaths) => {
  if (Array.isArray(value))
    return value.map((item) => upgradeBundledAssetPaths(item, currentPaths));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        upgradeBundledAssetPaths(item, currentPaths),
      ]),
    );
  if (typeof value !== "string") return value;
  const upgraded = value.replace(/\.(?:png|jpe?g)(?=\?|$)/i, ".webp");
  return upgraded !== value && currentPaths.has(upgraded) ? upgraded : value;
};

const withProjectCardImages = (projects, defaults) =>
  (projects || []).map((project) => {
    const defaultProject = (defaults || []).find(
      (candidate) => candidate.slug === project.slug,
    );
    return {
      ...project,
      cardImage:
        !project.cardImage || /^\/assets\/project-card-/.test(project.cardImage)
          ? defaultProject?.cardImage || project.image
          : project.cardImage,
    };
  });

export function CmsProvider({ defaults, children }) {
  const cleanDefaults = useMemo(
    () => removeLegacyWording(defaults),
    [defaults],
  );
  const bundledAssetPaths = useMemo(
    () => collectBundledAssetPaths(cleanDefaults),
    [cleanDefaults],
  );
  const [content, setContent] = useState(() => {
    try {
      let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        if (Number(saved.settings?.assetFormatVersion || 0) < 1)
          saved = upgradeBundledAssetPaths(saved, bundledAssetPaths);
        if (Number(saved.settings?.wordingVersion || 0) < 3)
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
          upgradeQurbaniVariants =
            Number(saved.settings?.projectsVersion || 0) < 32,
          addAfricaQurbaniVariant =
            Number(saved.settings?.projectsVersion || 0) < 37,
          removeTanzaniaMosque =
            Number(saved.settings?.projectsVersion || 0) < 31,
          upgradeZakatProject =
            Number(saved.settings?.projectsVersion || 0) < 9,
          addGazaProject = Number(saved.settings?.projectsVersion || 0) < 10,
          upgradeGazaSingleProject =
            Number(saved.settings?.projectsVersion || 0) < 26,
          upgradeGazaWaterTankerProject =
            Number(saved.settings?.projectsVersion || 0) < 35,
          restoreGazaProjects =
            Number(saved.settings?.projectsVersion || 0) < 43,
          upgradeFoodParcelCountries =
            Number(saved.settings?.projectsVersion || 0) < 55,
          addFoodParcelGaza = Number(saved.settings?.projectsVersion || 0) < 42,
          upgradeQurbaniCard =
            Number(saved.settings?.projectsVersion || 0) < 51,
          upgradeWaterWellCard =
            Number(saved.settings?.projectsVersion || 0) < 15,
          upgradeOrphanClothingCard =
            Number(saved.settings?.projectsVersion || 0) < 36,
          upgradeOrphanSponsorshipCard =
            Number(saved.settings?.projectsVersion || 0) < 17,
          upgradeOrphanCountries =
            Number(saved.settings?.projectsVersion || 0) < 56,
          upgradeOrphanConjunction =
            Number(saved.settings?.projectsVersion || 0) < 57,
          upgradeCurrentProjectDetails =
            Number(saved.settings?.projectsVersion || 0) < 58,
          removeCommunityMealGaza =
            Number(saved.settings?.projectsVersion || 0) < 59,
          upgradeGazaSurgeryPrice =
            Number(saved.settings?.projectsVersion || 0) < 60,
          upgradeZakatCard = Number(saved.settings?.projectsVersion || 0) < 22,
          upgradeZakatDetailCopy =
            Number(saved.settings?.projectsVersion || 0) >= 22 &&
            Number(saved.settings?.projectsVersion || 0) < 28,
          upgradeZakatCurrentCopy =
            Number(saved.settings?.projectsVersion || 0) < 41,
          addCommunityMealProject =
            Number(saved.settings?.projectsVersion || 0) < 29,
          upgradeCommunityMealCopy =
            Number(saved.settings?.projectsVersion || 0) < 30,
          upgradeCommunityMealCategory =
            Number(saved.settings?.projectsVersion || 0) < 40,
          upgradeCommunityMealDetails =
            Number(saved.settings?.projectsVersion || 0) < 46,
          upgradeMosqueImages =
            Number(saved.settings?.projectsVersion || 0) < 23,
          upgradeWorshipProjectCopy =
            Number(saved.settings?.projectsVersion || 0) < 49,
          upgradeMedresePrice =
            Number(saved.settings?.projectsVersion || 0) < 24,
          upgradeMedreseImages =
            Number(saved.settings?.projectsVersion || 0) < 25,
          upgradeMadrasaCopy =
            Number(saved.settings?.projectsVersion || 0) < 53,
          upgradeProjectCardCopy =
            Number(saved.settings?.projectsVersion || 0) < 45,
          removeLegacyNavigation =
            Number(saved.settings?.navigationVersion || 0) < 2,
          upgradeWhoWeAreNavigation =
            Number(saved.settings?.navigationVersion || 0) < 3,
          upgradeCorporateNavigation =
            Number(saved.settings?.navigationVersion || 0) < 5,
          upgradeActivitiesNavigation =
            Number(saved.settings?.navigationVersion || 0) < 6,
          upgradeCorporateLandingNavigation =
            Number(saved.settings?.navigationVersion || 0) < 7,
          replaceHomepageCampaigns =
            Number(saved.settings?.projectHomepageVersion || 0) < 2,
          replaceNewsletterWithVolunteer =
            Number(saved.settings?.footerVolunteerVersion || 0) < 1,
          upgradeFooterContent =
            Number(saved.settings?.footerContentVersion || 0) < 1,
          replaceNewsImages = Number(saved.settings?.newsImageVersion || 0) < 3,
          upgradeContact = Number(saved.settings?.contactVersion || 0) < 3,
          upgradeCurrentContact =
            Number(saved.settings?.contactVersion || 0) < 4,
          upgradeCorporatePages =
            Number(saved.settings?.corporatePagesVersion || 0) < 6,
          upgradeLegalPages =
            Number(saved.settings?.legalPagesVersion || 0) < 1;
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
            ...(upgradeContact || upgradeCurrentContact
              ? {
                  phone: cleanDefaults.settings.phone,
                  whatsapp: cleanDefaults.settings.whatsapp,
                  email: cleanDefaults.settings.email,
                  address: cleanDefaults.settings.address,
                }
              : {}),
            projectsVersion: 60,
            wordingVersion: 3,
            assetFormatVersion: 1,
            navigationVersion: 7,
            donationRouteVersion: 2,
            projectHomepageVersion: 2,
            footerVolunteerVersion: 1,
            footerContentVersion: 1,
            newsImageVersion: 3,
            contactVersion: 4,
            corporatePagesVersion: 6,
            legalPagesVersion: 1,
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
          pages: {
            ...cleanDefaults.pages,
            ...saved.pages,
            ...(upgradeCorporatePages
              ? {
                  hakkimizda: {
                    ...cleanDefaults.pages.hakkimizda,
                    ...saved.pages?.hakkimizda,
                    title: cleanDefaults.pages.hakkimizda.title,
                    category: cleanDefaults.pages.hakkimizda.category,
                  },
                  egitim: cleanDefaults.pages.egitim,
                  kultur: cleanDefaults.pages.kultur,
                  yardimlasma: cleanDefaults.pages.yardimlasma,
                  "kurumsal-kimlik": cleanDefaults.pages["kurumsal-kimlik"],
                  tuzuk: cleanDefaults.pages.tuzuk,
                  kvkk: cleanDefaults.pages.kvkk,
                }
              : {}),
          },
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
            ...(upgradeLegalPages ? { legal: cleanDefaults.footer.legal } : {}),
            ...(upgradeFooterContent
              ? { columns: cleanDefaults.footer.columns }
              : {}),
          },
          sitePages: { ...cleanDefaults.sitePages, ...saved.sitePages },
          navigation: upgradeCorporateLandingNavigation
            ? cleanDefaults.navigation
            : upgradeActivitiesNavigation
              ? cleanDefaults.navigation
              : upgradeCorporateNavigation
                ? cleanDefaults.navigation
                : upgradeWhoWeAreNavigation
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
          )
            .map((savedProject) => {
              const currentCardProject = cleanDefaults.projects.find(
                (item) => item.slug === savedProject.slug,
              );
              if (upgradeCurrentProjectDetails && currentCardProject) {
                return {
                  ...savedProject,
                  category: currentCardProject.category,
                  title: currentCardProject.title,
                  short: currentCardProject.short,
                  description: currentCardProject.description,
                  details: currentCardProject.details,
                  variants: currentCardProject.variants,
                };
              }
              if (
                removeCommunityMealGaza &&
                savedProject.slug === "toplu-yemek"
              ) {
                return {
                  ...savedProject,
                  variants: (savedProject.variants || []).filter(
                    (variant) => variant?.[0] !== "Filistin / Gazze",
                  ),
                };
              }
              if (
                upgradeGazaSurgeryPrice &&
                savedProject.slug === "gazze-yardim"
              ) {
                return {
                  ...savedProject,
                  variants: (savedProject.variants || []).map((variant) =>
                    variant?.[0] === "Ameliyat Projesi"
                      ? [variant[0], 11500, variant[2], ...variant.slice(3)]
                      : variant,
                  ),
                };
              }
              const project =
                upgradeProjectCardCopy &&
                [
                  "adak-akika-nafile-kurban",
                  "su-kuyusu",
                  "toplu-yemek",
                ].includes(savedProject.slug)
                  ? {
                      ...savedProject,
                      short: currentCardProject?.short || savedProject.short,
                    }
                  : savedProject;
              if (
                (upgradeMedreseImages ||
                  upgradeMedresePrice ||
                  upgradeMadrasaCopy) &&
                project.slug === "medrese"
              ) {
                const currentMedrese = cleanDefaults.projects.find(
                  (item) => item.slug === "medrese",
                );
                return {
                  ...project,
                  short: currentMedrese?.short || project.short,
                  description:
                    currentMedrese?.description || project.description,
                  details: currentMedrese?.details || project.details,
                  image: currentMedrese?.image || project.image,
                  variants: currentMedrese?.variants || project.variants,
                };
              }

              if (
                (upgradeMosqueImages || upgradeWorshipProjectCopy) &&
                ["cami", "mescid"].includes(project.slug)
              ) {
                const currentWorshipProject = cleanDefaults.projects.find(
                  (item) => item.slug === project.slug,
                );
                return {
                  ...project,
                  title: currentWorshipProject?.title || project.title,
                  short: currentWorshipProject?.short || project.short,
                  description:
                    currentWorshipProject?.description || project.description,
                  details: currentWorshipProject?.details || project.details,
                  image: currentWorshipProject?.image || project.image,
                  variants: currentWorshipProject?.variants || project.variants,
                };
              }

              if (removeTanzaniaMosque && project.slug === "cami") {
                return {
                  ...project,
                  variants: (project.variants || []).filter(
                    (variant) => variant?.[0] !== "Tanzanya",
                  ),
                };
              }

              if (
                (restoreQurbaniVariants ||
                  upgradeQurbaniVariants ||
                  addAfricaQurbaniVariant) &&
                project.slug === "adak-akika-nafile-kurban"
              )
                return {
                  ...project,
                  variants:
                    restoreQurbaniVariants || upgradeQurbaniVariants
                      ? [
                          ["Afrika", 4800, "TRY"],
                          ["Bangladeş", 6900, "TRY"],
                          ["Yemen", 6900, "TRY"],
                          ["Afganistan", 6900, "TRY"],
                          ["Türkiye", 20000, "TRY"],
                        ]
                      : [
                          ["Afrika", 4800, "TRY"],
                          ...(project.variants || []).filter(
                            (variant) => variant?.[0] !== "Afrika",
                          ),
                        ],
                };

              if (upgradeZakatProject && project.slug === "zekat") {
                const currentZakat = cleanDefaults.projects.find(
                  (item) => item.slug === "zekat",
                );
                return {
                  ...project,
                  short: currentZakat?.short || project.short,
                  description: currentZakat?.description || project.description,
                  details: currentZakat?.details || project.details,
                  calculator: false,
                  variants: [
                    [
                      "Zekât Bağışı",
                      0,
                      "TRY",
                      "/assets/project-zakat-user-provided-v4.webp",
                    ],
                  ],
                };
              }

              if (
                (upgradeGazaSingleProject ||
                  upgradeGazaWaterTankerProject ||
                  restoreGazaProjects) &&
                project.slug === "gazze-yardim"
              ) {
                const currentGaza = cleanDefaults.projects.find(
                  (item) => item.slug === "gazze-yardim",
                );
                return {
                  ...project,
                  title: currentGaza?.title || project.title,
                  image: currentGaza?.image || project.image,
                  short: currentGaza?.short || project.short,
                  description: currentGaza?.description || project.description,
                  details: currentGaza?.details || project.details,
                  variants: currentGaza?.variants || project.variants,
                };
              }

              if (
                (upgradeFoodParcelCountries || addFoodParcelGaza) &&
                project.slug === "gida-kolisi"
              ) {
                const currentFoodParcel = cleanDefaults.projects.find(
                  (item) => item.slug === "gida-kolisi",
                );
                return {
                  ...project,
                  title: currentFoodParcel?.title || project.title,
                  image: currentFoodParcel?.image || project.image,
                  short: currentFoodParcel?.short || project.short,
                  description:
                    currentFoodParcel?.description || project.description,
                  variants: currentFoodParcel?.variants || project.variants,
                };
              }

              if (
                upgradeQurbaniCard &&
                project.slug === "adak-akika-nafile-kurban"
              ) {
                const currentQurbani = cleanDefaults.projects.find(
                  (item) => item.slug === "adak-akika-nafile-kurban",
                );
                return {
                  ...project,
                  title: currentQurbani?.title || project.title,
                  image: currentQurbani?.image || project.image,
                  short: currentQurbani?.short || project.short,
                };
              }

              if (upgradeWaterWellCard && project.slug === "su-kuyusu") {
                const currentWaterWell = cleanDefaults.projects.find(
                  (item) => item.slug === "su-kuyusu",
                );
                return {
                  ...project,
                  title: currentWaterWell?.title || project.title,
                  image: currentWaterWell?.image || project.image,
                };
              }

              if (
                upgradeOrphanCountries &&
                ["yetim-hamiligi", "yetim-giydirme"].includes(project.slug)
              ) {
                const currentOrphanProject = cleanDefaults.projects.find(
                  (item) => item.slug === project.slug,
                );
                return {
                  ...project,
                  title: currentOrphanProject?.title || project.title,
                  image: currentOrphanProject?.image || project.image,
                  short: currentOrphanProject?.short || project.short,
                  description:
                    currentOrphanProject?.description || project.description,
                  details: currentOrphanProject?.details || project.details,
                  variants: currentOrphanProject?.variants || project.variants,
                };
              }

              if (
                upgradeOrphanConjunction &&
                ["yetim-hamiligi", "yetim-giydirme"].includes(project.slug)
              ) {
                const currentOrphanProject = cleanDefaults.projects.find(
                  (item) => item.slug === project.slug,
                );
                return {
                  ...project,
                  short: currentOrphanProject?.short || project.short,
                  description:
                    currentOrphanProject?.description || project.description,
                };
              }

              if (
                upgradeOrphanClothingCard &&
                project.slug === "yetim-giydirme"
              ) {
                const currentOrphanClothing = cleanDefaults.projects.find(
                  (item) => item.slug === "yetim-giydirme",
                );
                return {
                  ...project,
                  title: currentOrphanClothing?.title || project.title,
                  image: currentOrphanClothing?.image || project.image,
                  short: currentOrphanClothing?.short || project.short,
                  description:
                    currentOrphanClothing?.description || project.description,
                  details: currentOrphanClothing?.details || project.details,
                  variants: currentOrphanClothing?.variants || project.variants,
                };
              }

              if (
                upgradeOrphanSponsorshipCard &&
                project.slug === "yetim-hamiligi"
              ) {
                const currentOrphanSponsorship = cleanDefaults.projects.find(
                  (item) => item.slug === "yetim-hamiligi",
                );
                return {
                  ...project,
                  title: currentOrphanSponsorship?.title || project.title,
                  image: currentOrphanSponsorship?.image || project.image,
                };
              }

              if (upgradeZakatCard && project.slug === "zekat") {
                const currentZakat = cleanDefaults.projects.find(
                  (item) => item.slug === "zekat",
                );
                return {
                  ...project,
                  title: currentZakat?.title || project.title,
                  image: currentZakat?.image || project.image,
                  short: currentZakat?.short || project.short,
                  variants: currentZakat?.variants || project.variants,
                };
              }

              if (upgradeZakatDetailCopy && project.slug === "zekat") {
                const currentZakat = cleanDefaults.projects.find(
                  (item) => item.slug === "zekat",
                );
                return {
                  ...project,
                  short: currentZakat?.short || project.short,
                };
              }

              if (upgradeZakatCurrentCopy && project.slug === "zekat") {
                const currentZakat = cleanDefaults.projects.find(
                  (item) => item.slug === "zekat",
                );
                return {
                  ...project,
                  short: currentZakat?.short || project.short,
                  description: currentZakat?.description || project.description,
                };
              }

              if (
                (upgradeCommunityMealCopy ||
                  upgradeCommunityMealCategory ||
                  upgradeCommunityMealDetails) &&
                project.slug === "toplu-yemek"
              ) {
                const currentCommunityMeal = cleanDefaults.projects.find(
                  (item) => item.slug === "toplu-yemek",
                );
                return {
                  ...project,
                  category: currentCommunityMeal?.category || project.category,
                  title: currentCommunityMeal?.title || project.title,
                  short: currentCommunityMeal?.short || project.short,
                  description:
                    currentCommunityMeal?.description || project.description,
                  image: currentCommunityMeal?.image || project.image,
                  variants: currentCommunityMeal?.variants || project.variants,
                };
              }

              return project;
            })
            .concat(
              addGazaProject &&
                !(saved.projects || cleanDefaults.projects).some(
                  (project) => project.slug === "gazze-yardim",
                )
                ? cleanDefaults.projects.filter(
                    (project) => project.slug === "gazze-yardim",
                  )
                : [],
              addCommunityMealProject &&
                !(saved.projects || cleanDefaults.projects).some(
                  (project) => project.slug === "toplu-yemek",
                )
                ? cleanDefaults.projects.filter(
                    (project) => project.slug === "toplu-yemek",
                  )
                : [],
            )
            .map((project) => ({
              ...project,
              cardImage: /^\/assets\/project-card-/.test(
                String(project.cardImage || ""),
              )
                ? cleanDefaults.projects.find(
                    (candidate) => candidate.slug === project.slug,
                  )?.cardImage || project.image
                : project.cardImage ||
                  cleanDefaults.projects.find(
                    (candidate) => candidate.slug === project.slug,
                  )?.cardImage ||
                  project.image,
            })),
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
    if (Number(content.settings?.newsImageVersion || 0) >= 3) return;
    setContent((current) => ({
      ...current,
      settings: {
        ...current.settings,
        newsImageVersion: 3,
      },
      news: cleanDefaults.news,
    }));
  }, [cleanDefaults.news, content.settings?.newsImageVersion]);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const controller = new AbortController();
    fetch("/api/public/content", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("CMS içeriği alınamadı.");
        return response.json();
      })
      .then(({ content: published }) => {
        if (!published || typeof published !== "object") return;
        setContent((current) => ({
          ...current,
          ...published,
          settings: {
            ...current.settings,
            ...published.settings,
            typography: {
              ...current.settings?.typography,
              ...published.settings?.typography,
            },
          },
          home: { ...current.home, ...published.home },
          pages: { ...current.pages, ...published.pages },
          sitePages: { ...current.sitePages, ...published.sitePages },
          projects: withProjectCardImages(
            published.projects || current.projects,
            cleanDefaults.projects,
          ),
        }));
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          console.error("Yayınlanmış CMS içeriği yüklenemedi.", error);
      });
    return () => controller.abort();
  }, []);

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
          projects: withProjectCardImages(
            parsed.projects || cleanDefaults.projects,
            cleanDefaults.projects,
          ),
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
