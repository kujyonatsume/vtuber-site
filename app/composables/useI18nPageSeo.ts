type I18nPageSeoOptions = {
  pageKey: string;
  noindex?: boolean;
  image?: string;
};

const localeToOgLocale: Record<string, string> = {
  zh: "zh_TW",
  en: "en_US",
};

export function useI18nPageSeo(options: I18nPageSeoOptions) {
  const { t, locale } = useI18n();

  const pageTitle = computed(() => t(`${options.pageKey}.title`));
  const pageDescription = computed(() => t(`${options.pageKey}.description`));
  const siteName = computed(() => t("common.projectName"));
  const fullTitle = computed(() => `${pageTitle.value} | ${siteName.value}`);
  const ogLocale = computed(() => localeToOgLocale[locale.value] || "en_US");
  const ogImage = computed(() => options.image || "/hero.png");
  const robots = options.noindex
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large";

  useSeoMeta({
    title: () => fullTitle.value,
    description: () => pageDescription.value,
    ogTitle: () => fullTitle.value,
    ogDescription: () => pageDescription.value,
    ogLocale: () => ogLocale.value,
    ogType: "website",
    ogImage: () => ogImage.value,
    twitterTitle: () => fullTitle.value,
    twitterDescription: () => pageDescription.value,
    twitterImage: () => ogImage.value,
    twitterCard: "summary_large_image",
  });

  useHead({
    meta: [
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
    ],
  });
}
