"use client"

import Link from "next/link";
import { logout } from "@/app/services/auth/auth";

export default function Sidebar() {

  async function handleLogout() {
    await logout();
  }

  return (
    <aside>
      <ul>
        <Link href="/create"><li>Create</li></Link>
        <Link href="/list"><li>List</li></Link>
      </ul>
      <form action={handleLogout}>
        <button type="submit">Logout</button>
      </form>
    </aside>
  );
}