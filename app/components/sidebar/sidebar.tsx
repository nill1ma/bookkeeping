"use client"

import Link from "next/link";
import "./styles.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <Link href="/list"><li className="sidebar-link">List</li></Link>
        <Link href="/create"><li className="sidebar-link">Create</li></Link>
      </ul>
    </aside>
  );
}