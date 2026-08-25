import "./globals.css";
import Sidebar from "./components/sidebar/sidebar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body>
        <header>
          <h1>Bookkeeping</h1>
        </header>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
