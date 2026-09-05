import "./globals.css";
import I18nProvider from "./i18n/Provider";
import ReactQueryProvider from "./providers/RectQueryProvider/ReactQueryProvider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <ReactQueryProvider>
          <I18nProvider locale="en">
            {children}
          </I18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}