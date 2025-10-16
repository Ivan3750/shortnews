"use client";
import { useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import bg from "@/app/assets/images/bg.jpg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState({
    open: false,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const res = await fetch("https://energyflow.b.goit.study/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setModal({ open: true, message: "✅ Tak for din tilmelding!" });
        setEmail("");
      } else {
        setModal({ open: true, message: data.message || "Noget gik galt. Prøv igen." });
      }
    } catch (err) {
      console.error(err);
      setModal({ open: true, message: "⚠️ Netværksfejl. Prøv igen senere." });
    }
  };

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background */}
      <img
        src={bg.src}
        alt="Baggrund"
        className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row justify-between gap-12">
        {/* Left Section */}
        <div className="flex flex-col gap-8 lg:w-1/2">
          <div className="flex items-center gap-6">
         <Link href="/">
                 <div className="text-xl md:text-2xl font-bold cursor-pointer text-white">
                   Kort<span className="text-gray-500">Nyhed</span>
                 </div>
               </Link>
            <div className="flex gap-3">
              {[
                { Icon: FaFacebookF, href: "https://facebook.com" },
                { Icon: FaInstagram, href: "https://instagram.com" },
                { Icon: FaYoutube, href: "https://youtube.com" },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-transform hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-serif leading-tight">
            Hold dig opdateret med{" "}
            <span className="italic text-white/60">energi-nyheder</span> hver dag
          </h1>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex flex-col items-start lg:items-end gap-4">
          <p className="text-sm text-gray-300">Tilmeld dig vores nyhedsbrev</p>
          <form
            className="w-full flex flex-col sm:flex-row gap-3"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-2 rounded-full text-gray-900 outline-none focus:ring-2 focus:ring-gray-600 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition"
            >
              Tilmeld
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} energy.flow — Alle rettigheder forbeholdes.</p>
        <div className="flex justify-center items-center gap-2 mt-1">
          <Link href="#" className="hover:underline">
            Privatlivspolitik
          </Link>
          <span>/</span>
          <Link href="#" className="hover:underline">
            Vilkår
          </Link>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <p>{modal.message}</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
              onClick={() => setModal({ open: false, message: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
