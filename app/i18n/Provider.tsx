import { IntlProvider } from "react-intl";
import { en } from "./en";

const messages: Record<string, any> = {
  en,
};

export default function I18nProvider({ children, locale = "en" }: { children: React.ReactNode; locale?: string }) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}