"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import logo from "@/app/assets/images/logo.png"
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setActiveTab(pathname);
  }, [pathname]);

  const navItems = [
    { path: "/", label: "Forside" },
    { path: "/about", label: "Om os" },
    { path: "/add-news", label: "Tilføj nyhed" },
  ];

  const renderLinks = (isMobile = false) =>
    navItems.map((item) => (
      <Link
        key={item.path}
        href={item.path}
        className={`${
          isMobile
            ? "text-white text-lg font-medium px-6 py-2 rounded-full hover:bg-white/20 transition"
            : "px-5 py-1.5 rounded-full text-base font-medium text-gray-700 hover:bg-gray-300 transition"
        } ${activeTab === item.path ? (isMobile ? "bg-white/20" : "bg-gray-800 text-white") : ""}`}
        onClick={() => {
          setActiveTab(item.path);
          if (isMobile) setMenuOpen(false);
        }}
      >
        {item.label}
      </Link>
    ));

  return (
    <>
      <header className="w-full flex items-center justify-between px-5 md:px-10 lg:px-16 py-3 bg-white shadow-md ">
        <Link href="/" style={{display: "flex", alignItems: "center"}}>
        <img src={logo.src} alt="" style={{width: 25, height: 25}}/>
          <div className="text-xl md:text-2xl font-bold cursor-pointer text-black">
            Kort<span className="text-gray-500">Nyhed</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-2 bg-gray-200 px-2 py-1 rounded-full">
          {renderLinks()}
        </nav>

        {/* Socials + login */}
        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            <Link href="/settings" className="p-2 border rounded-md text-gray-700 hover:bg-gray-100">
              <FaUser />
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 border rounded-md bg-transparent text-gray-700 hover:bg-gray-100 transition"
            >
              login
            </Link>
          )}
        </div>

        {/* Burger */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-700 text-white flex flex-col justify-between p-6 z-[999]">
          <div
            className="self-end text-3xl cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </div>

          <nav className="flex flex-col gap-5 mt-16 items-center">
            {renderLinks(true)}
          </nav>

          <div className="flex justify-center items-center gap-5 mb-5">
            <a href="https://www.facebook.com/goITclub/">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/goitclub/">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/c/GoIT">
              <FaYoutube />
            </a>
            {isLoggedIn ? (
              <Link href="/settings">
                <FaUser />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 border rounded-md bg-transparent text-white hover:bg-white/20 transition"
              >
                login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
