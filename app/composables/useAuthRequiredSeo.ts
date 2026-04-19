type AuthRequiredSeoPageKey =
  | "userAccount"
  | "userPasswordPage"
  | "adminContribute"
  | "adminUsers";

export function useAuthRequiredSeo(pageKey: AuthRequiredSeoPageKey) {
  useI18nPageSeo({
    pageKey,
    noindex: true,
  });
}
