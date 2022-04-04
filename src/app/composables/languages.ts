type LanguageMeta = Readonly<{
  locale: string;
  name: string;
  icon: string;
}>;

const languages: ReadonlyArray<LanguageMeta> = [
  {
    locale: "en",
    name: "English",
    icon: "i-emojione-flag-for-united-states",
  },
];

export function useLanguages() {
  const { locale, availableLocales } = useI18n();

  const setLanguage = (code: string) => {
    locale.value = code;
  };

  const languageMeta: ReadonlyMap<string, LanguageMeta> = new Map(
    languages.map((lang) => [lang.locale, lang])
  );

  console.assert(
    availableLocales.every((lang) => languageMeta.has(lang)),
    "Every avaliable locale should be listed in the language meta data."
  );

  const currentLanguageMeta = languageMeta.get(locale.value);

  console.assert(
    currentLanguageMeta !== undefined,
    "Cannot find the language meta data for the current language."
  );

  return {
    setLanguage,
    languageMeta,
    currentLanguageMeta,
  };
}
