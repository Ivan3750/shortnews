export default function Home() {
  const news = [
    {
      title: "EU lancerer nyt initiativ mod misinformation",
      summary:
        "EU planlægger strengere regler for sociale medier for at bekæmpe falske nyheder og sikre pålidelig information til borgere.",
      source: "https://www.dr.dk/nyheder",
    },
    {
      title: "Ny teknologi gør elbiler billigere",
      summary:
        "Forskere har udviklet batterier, der kan oplades hurtigere og holder længere, hvilket kan gøre elbiler mere tilgængelige.",
      source: "https://www.tv2.dk/",
    },
    {
      title: "Dansk økonomi vokser trods usikkerhed",
      summary:
        "Danmarks BNP voksede med 2% i andet kvartal trods inflation og global uro.",
      source: "https://politiken.dk/",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-md">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-700">ShortNews</h1>
          <p className="text-gray-600">Få et hurtigt overblik over dagens nyheder</p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 grid gap-6">
        {news.map((item, idx) => (
          <article key={idx} className="rounded-xl bg-white shadow p-5">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-gray-700">{item.summary}</p>
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline"
            >
              Læs mere →
            </a>
          </article>
        ))}
      </section>

      <footer className="mt-10 bg-white border-t">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ShortNews — Lavet af Ivan
        </div>
      </footer>
    </main>
  );
}
