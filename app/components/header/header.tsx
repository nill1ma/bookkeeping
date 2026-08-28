
"use client"
import { logout } from "@/app/services/auth/auth";
import "./styles.css";
import Button from "@/app/components/ui/Button/Button";

export default function Header() {
    async function handleLogout() {
        await logout();
      }
  return (
    <header className="header">
      <h1>Bookkeeping</h1>
      <form action={handleLogout}>
        <Button variant="secondary" type="submit">Logout</Button>
      </form>
    </header>
  );
}