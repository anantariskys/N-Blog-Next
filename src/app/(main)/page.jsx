import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Home() {

  return (
    <main className="flex">
      <section>
        <h1>Welcome to the Home Page</h1> 
      </section>
    </main>
  );
}
