import type { UseI18nOptions } from "vue-i18n";

// @see https://github.com/intlify/vue-i18n-next/issues/324
declare module "vue-i18n" {
  type Same<T> = { [k in keyof T]: T[k] };

  export type Composer2<
    Messages = {},
    DateTimeFormats = {},
    NumberFormats = {},
    Message = VueMessageType
  > = Same<Composer<Messages, DateTimeFormats, NumberFormats, Message>>;

  export function useI18n<Options extends UseI18nOptions = object>(
    options?: Options
  ): Composer2<
    Options["messages"],
    Options["datetimeFormats"],
    Options["numberFormats"]
  >;
}
