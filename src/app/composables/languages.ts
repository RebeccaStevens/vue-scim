import * as assert from "~/assert";

type LanguageMeta = Readonly<{
  locale: string;
  icon: string;
}>;

const languages: ReadonlyArray<LanguageMeta> = [
  {
    locale: "en-US",
    icon: "i-emojione-flag-for-united-states",
  },
  {
    locale: "en-GB",
    icon: "i-emojione-flag-for-united-kingdom",
  },
];

export function useLanguages() {
  const { locale, availableLocales } = useI18n();

  assert.ok(
    languages.every(({ locale }) => availableLocales.includes(locale)),
    "Every language meta data value must be an avaliable locale."
  );

  const setLanguage = (code: string) => {
    locale.value = code;
  };

  const languageMeta: ReadonlyMap<string, LanguageMeta> = new Map(
    languages.map((lang) => [lang.locale, lang])
  );

  const currentLanguageMeta = computed(() => {
    const meta = languageMeta.get(locale.value);
    assert.isDefined(
      meta,
      "Cannot find the language meta data for the current language."
    );
    return meta;
  });

  return {
    setLanguage,
    languageMeta,
    currentLanguageMeta,
  };
}
