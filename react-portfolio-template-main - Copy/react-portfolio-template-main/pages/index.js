import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BubbleBackground from "../components/BubbleBackground";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import ServiceCard from "../components/ServiceCard";
import WorkCard from "../components/WorkCard";
import { usePortfolio } from "../lib/usePortfolio";

const Home = () => {
  const { portfolio, savePortfolio } = usePortfolio();
  const data = portfolio;
  const [resumePdf, setResumePdf] = useState(data.resumePdf || null);

  useEffect(() => {
    setResumePdf(data.resumePdf || null);
  }, [data.resumePdf]);

  const hasAboutImage = !!data.aboutPhoto;

  const heroSubtitle = useMemo(
    () => data.heroSubtitle || `${data.headerTaglineTwo || "I am a"} ${data.headerTaglineThree || "Designer"}`,
    [data.heroSubtitle, data.headerTaglineTwo, data.headerTaglineThree]
  );
  const headerLine = (data.headerTaglineOne || "").replace(/^Hi!\s*/i, "");

  const handleWorkScroll = () => {
    const section = document.getElementById("work");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAboutScroll = () => {
    const section = document.getElementById("about");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const pdfBase64 = event.target?.result;
        setResumePdf(pdfBase64);
        savePortfolio({ ...data, resumePdf: pdfBase64 });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Head>
        <title>{data.name} Portfolio</title>
        <meta name="description" content="Portfolio of Niño Asan" />
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 grid-background opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.15),_transparent_30%)] pointer-events-none" />
        <BubbleBackground />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 laptop:px-10">
          <Header handleWorkScroll={handleWorkScroll} handleAboutScroll={handleAboutScroll} />

          <main className="mt-16 space-y-24">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_25px_75px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="relative z-10">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-cyan-400/90">{data.introLabel || "WELCOME TO MY PORTFOLIO"}</p>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight text-white laptop:text-7xl">
                      {headerLine}
                    </h1>
                    <h2 className="mt-4 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400 laptop:text-7xl">
                      {data.heroTitle || `Hello, I'm ${data.name}`}
                    </h2>
                    <h3 className="mt-4 text-3xl font-semibold text-white laptop:text-4xl">
                      {heroSubtitle}
                    </h3>
                  </div>

                  <p className="max-w-3xl text-base leading-8 text-slate-300 laptop:text-xl">
                    {data.heroDescription || data.headerTaglineFour}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={handleAboutScroll}
                      className="rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Read More
                    </button>
                    <div className="flex flex-wrap gap-3">
                      {data.socials?.map((social) => (
                        <button
                          key={social.id}
                          onClick={() => window.open(social.link, "_blank")}
                          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.3em] text-slate-100 transition hover:bg-white/10"
                        >
                          {social.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="about" className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="grid gap-10 laptop:grid-cols-[1.5fr_1fr] items-center">
                <div className="text-center">
                  <h2 className="mt-3 text-2xl font-semibold text-blue-400">ABOUT ME</h2>
                  <p className="mt-6 text-lg leading-8 text-slate-300 text-justify">{data.aboutpara}</p>
                </div>
                <div className="relative mx-auto flex max-w-sm items-center justify-center rounded-[2rem] border border-white/10 bg-[#081122] p-6">
                  {hasAboutImage ? (
                    <div className="relative h-80 w-80 rounded-full overflow-hidden border-2 border-cyan-500/60 shadow-[0_0_80px_rgba(34,211,238,0.3)] transition-all duration-500 hover:shadow-[0_0_120px_rgba(34,211,238,0.5)] animate-pulse">
                      <Image
                        src={data.aboutPhoto}
                        alt="Uploaded profile"
                        layout="fill"
                        objectFit="cover"
                        unoptimized={String(data.aboutPhoto).startsWith("data:") || String(data.aboutPhoto).startsWith("http")}
                      />
                    </div>
                  ) : (
                    <div className="flex h-80 w-80 items-center justify-center rounded-full border-2 border-cyan-500/60 border-dashed text-center text-slate-400 shadow-[0_0_80px_rgba(34,211,238,0.3)]">
                      Upload your photo under Edit Data.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section id="work">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-semibold text-blue-400">FEATURED PROJECTS</h2>
              </div>

              <div className="grid gap-6 tablet:grid-cols-3">
                {data.projects.map((project) => (
                  <WorkCard
                    key={project.id}
                    images={project.images || (project.imageSrc ? [project.imageSrc] : [])}
                    img={project.imageSrc}
                    name={project.title}
                    description={project.description}
                    onClick={() => window.open(project.url, "_blank")}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-semibold text-blue-400">CERTIFICATIONS</h2>
              </div>
              <div
                className={`grid gap-6 ${
                  data.services && data.services.length === 2
                    ? "grid-cols-2 justify-items-center"
                    : "tablet:grid-cols-3"
                }`}
              >
                {data.services?.map((service) => (
                  <ServiceCard key={service.id} image={service.image} name={service.title} />
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="text-center">
                <h2 className="mt-3 text-2xl font-semibold text-blue-400">EXPERIENCE AND SKILLS</h2>
              </div>

              <div className="mt-10 space-y-8">
                {data.resume.experiences.map((experience) => (
                  <ProjectResume
                    key={experience.id}
                    dates={experience.dates}
                    type={experience.type}
                    position={experience.position}
                    bullets={experience.bullets.join(",")}
                  />
                ))}
              </div>
              
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    if (resumePdf) {
                      window.open(resumePdf, '_blank');
                    }
                  }}
                  className="rounded-full bg-blue-600 px-10 py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!resumePdf}
                >
                  VIEW RESUME
                </button>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
