"use client";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl font-serif leading-tight mb-6">
              Om <span className="italic text-gray-600">Energy Flow</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Vi er dedikerede til at levere de nyeste nyheder om energi, teknologi og miljø. Vores mission er at informere og inspirere vores læsere gennem kvalitetsindhold og indsigt fra eksperter.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition transform hover:scale-110">
                <FaFacebookF className="text-gray-700"/>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition transform hover:scale-110">
                <FaInstagram className="text-gray-700"/>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition transform hover:scale-110">
                <FaYoutube className="text-gray-700"/>
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/img/about-hero.jpg"
              alt="About Us Image"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-serif mb-4">Vores Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Vores mål er at gøre komplekse energinyheder tilgængelige for alle. Vi kombinerer dybdegående analyser med engagerende historier, så vores læsere kan forstå den globale energisituation og træffe informerede beslutninger.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Vi tror på ansvarlig journalistik og stræber efter altid at levere pålidelige og faktabaserede nyheder.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/img/mission.jpg"
            alt="Mission Image"
            width={500}
            height={400}
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-serif text-center mb-12">Vores Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Mia Jensen", role: "Redaktør", img: "/img/team1.jpg" },
              { name: "Lars Hansen", role: "Journalist", img: "/img/team2.jpg" },
              { name: "Sofie Nielsen", role: "Fotograf", img: "/img/team3.jpg" },
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-6">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-serif mb-4">Hold dig opdateret</h2>
        <p className="mb-6">Tilmeld dig vores nyhedsbrev og få de seneste nyheder direkte i din indbakke.</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Din email"
            className="flex-1 px-4 py-3 rounded-full text-gray-900 outline-none"
            required
          />
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full transition">
            Tilmeld
          </button>
        </form>
      </section>
    </main>
  );
}
