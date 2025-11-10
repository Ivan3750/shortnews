"use client";
import React from "react";
import { motion } from "framer-motion";
import global  from "@/app/assets/images/global.jpg";




export default function AboutUs() {
  const fade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-20">
        {/* Hero */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-16 flex flex-col lg:flex-row gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fade}
            className="flex-1"
          >
            <h1 className="text-5xl font-extrabold leading-tight">
              Om os — <span className="text-gray-700">KortNyhed</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Vi gør verdens nyheder korte, verificerede og tilgængelige — 60-sekunders opdateringer, fri for støj og falske historier. Vores mission er at spare din tid og styrke din tillid til medierne.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#mission"
                className="px-5 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
              >
                Vores mission
              </a>
              <a
                href="#process"
                className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Sådan arbejder vi
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fade}
            className="flex-1 flex justify-center"
          >
            {/* <img
              src="/images/mockup-phone.png"
              alt="KortNyhed app mockup"
              className="w-80 h-auto drop-shadow-xl"
            /> */}
          </motion.div>
        </section>

        {/* Mission */}
        <section id="mission" className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fade}
            className="text-center"
          >
            <h2 className="text-4xl font-bold">Vores mission</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              KortNyhed blev grundlagt for at skabe et alternativ til kaotiske nyhedsfeeds. Vi tror på, at sandhed skal være hurtig, klar og verificeret. Vores redaktion kombinerer teknologi, journalistik og transparens for at gøre nyheder forståelige igen.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              title: "Hastighed",
              text: "De vigtigste nyheder kondenseret på 60 sekunder – perfekt til din daglige rytme.",
            }, {
              title: "Faktatjek",
              text: "AI + redaktionel kontrol sikrer, at kun pålidelige historier bliver publiceret.",
            }, {
              title: "Transparens",
              text: "Hver artikel linker til oprindelige kilder og viser verificeringsstatus.",
            }].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fade}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-xl text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-16">
          <motion.h3
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fade}
            className="text-3xl font-bold text-center"
          >
            Sådan arbejder vi
          </motion.h3>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
              step: "1",
              title: "Indsamling",
              text: "Vi henter nyheder fra verificerede kilder, lokale medier og troværdige journalister.",
            }, {
              step: "2",
              title: "Filtrering",
              text: "AI og redaktører fjerner støj, clickbait og misinformation.",
            }, {
              step: "3",
              title: "Kondensering",
              text: "Essensen af hver historie koges ned til 60 sekunder – kun fakta, ingen fyld.",
            }, {
              step: "4",
              title: "Publicering",
              text: "Efter faktatjek bliver historien publiceret i appen og på web med kildeangivelser.",
            }].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fade}
                className="flex flex-col items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-lg text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values / Impact */}
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade}
            >
              <h3 className="text-3xl font-bold mb-4">Hvorfor det betyder noget</h3>
              <p className="text-gray-600 mb-4">
                Vores samfund drukner i information – men ikke i viden. Vi vil ændre den måde, folk holder sig opdateret på: færre overskrifter, mere indsigt. ShortNews er skabt til dig, der vil forstå verden, ikke bare scrolle gennem den.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✔️ Reducerer tid brugt på nyheder med 80%</li>
                <li>✔️ Øger tilliden til medier gennem gennemsigtighed</li>
                <li>✔️ Hjælper dig med at skelne fakta fra manipulation</li>
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade}
              className="flex justify-center"
            >
              <img
                src={global.src}
                alt="Global reach illustration"
                className="w-full max-w-md rounded-2xl shadow-md"
              />
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}