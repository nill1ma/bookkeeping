import "@/app/globals.css";
import Sidebar from "../components/sidebar/sidebar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header>
        <h1>Bookkeeping</h1>
      </header>
      <Sidebar />
      <main>{children}</main>
    </>
  );
}
