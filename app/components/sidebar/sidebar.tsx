import Link from "next/link";

export default function Sidebar() {
  return (
    <aside>
      <ul>
        <Link href="/create"><li>Create</li></Link>
        <Link href="/list"><li>List</li></Link>
      </ul>
    </aside>
  );
}