import "./globals.css";
import I18nProvider from "./i18n/Provider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <I18nProvider locale="en">
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}