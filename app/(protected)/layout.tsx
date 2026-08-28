import "@/app/globals.css";
import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <Sidebar />
      <main>{children}</main>
    </>
  );
}
