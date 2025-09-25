import { en, es } from "@/utils/translations";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n();

i18n.enableFallback = true;
i18n.translations = { en, es };
i18n.locale = Localization.getLocales()[0]?.languageCode ?? "en";

export default i18n;
