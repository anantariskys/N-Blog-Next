import React from "react";
import LogoutButton from "@/components/LogoutButton";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const MainLayout = ({ children }) => {
  const cookieStore = cookies();
  let decodedToken = null;
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }


  const menuItems = [
    { name: "Home", link: "/", icon: "fluent:home-32-filled" },
    { name: "Search", link: "/", icon: "fluent:search-32-filled" },
    { name: "Explore", link: "/", icon: "material-symbols:explore-outline" },
    { name: "Reels", link: "/", icon: "fluent:play-32-filled" },
    { name: "Messages", link: "/", icon: "uil:message" },
    { name: "Notifications", link: "/", icon: "mdi:heart-outline" },
    { name: "Create", link: "/", icon: "mdi:plus-box-outline" },
    {
      name: "Profile",
      link: `/${decodedToken?.userId || ""}`,
      icon: "fluent:person-32-filled",
    },
  ];
  return (
    <div className="w-full flex">
      <aside className="max-w-60 w-full border-r px-5 flex flex-col justify-between py-8 border-gray-600 h-screen sticky top-0">
        <section className="space-y-12">
          <h1 className="text-3xl font-semibold">N Gram</h1>
          <ul className="flex flex-col gap-8 font-semibold w-full">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex gap-1 items-center"
              >
                <Icon className="text-2xl" icon={item.icon} />
                {item.name}
              </Link>
            ))}
          </ul>
        </section>
        <LogoutButton />
      </aside>
      {children}
    </div>
  );
};

export default MainLayout;
