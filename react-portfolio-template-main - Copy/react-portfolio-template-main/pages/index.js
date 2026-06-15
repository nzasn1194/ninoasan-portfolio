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
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-400"
                    >
                      Read More
                    </button>
                    <div className="flex flex-wrap gap-4">
                      {data.socials?.map((social) => {
                        const getIcon = (title) => {
                          const t = title.toLowerCase();
                          if (t.includes("github")) return "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.545 2.914 1.209.092-.937.35-1.546.636-1.903-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z";
                          if (t.includes("linkedin")) return "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";
                          if (t.includes("twitter")) return "M23.953 4.57a10 10 0 002.856-3.51 10 10 0 01-2.856 1.11 5 5 0 00-8.61.6c-1.09 1.13-1.938 2.7-1.938 4.27 0 .4.045.787.127 1.161A14.05 14.05 0 012.744 2.556c-.436.75-.7 1.627-.7 2.563 0 1.737.886 3.269 2.232 4.164a5 5 0 01-2.267-.616v.06c0 2.209 1.591 4.063 3.708 4.476a5 5 0 01-2.252.085 5.008 5.008 0 004.67 3.476 10.004 10.004 0 01-6.177 2.126 10 10 0 006.168 1.809c7.402 0 11.44-6.15 11.44-11.44 0-.174 0-.345-.012-.516a8.15 8.15 0 002.016-2.084z";
                          if (t.includes("email")) return "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z";
                          return null;
                        };
                        const icon = getIcon(social.title);
                        return (
                          <button
                            key={social.id}
                            onClick={() => window.open(social.link, "_blank")}
                            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20"
                            aria-label={social.title}
                            title={social.title}
                          >
                            {icon ? (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d={icon} />
                              </svg>
                            ) : (
                              <span className="text-xs font-semibold text-white">{social.title.slice(0, 2).toUpperCase()}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="about" className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="grid gap-10 laptop:grid-cols-[1.5fr_1fr] items-center">
                <div className="text-center laptop:text-left">
                  <h2 className="mt-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400">ABOUT ME</h2>
                  <p className="mt-6 text-lg leading-8 text-slate-300">{data.aboutpara}</p>
                </div>
                <div className="relative mx-auto flex items-center justify-center rounded-[2rem] border border-white/10 bg-[#081122] p-6">
                  {hasAboutImage ? (
                    <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80 rounded-full overflow-hidden border-2 border-cyan-500/60 shadow-[0_0_80px_rgba(34,211,238,0.3)] transition-all duration-500 hover:shadow-[0_0_120px_rgba(34,211,238,0.5)]">
                      <Image
                        src={data.aboutPhoto}
                        alt="Uploaded profile"
                        layout="fill"
                        objectFit="cover"
                        unoptimized={String(data.aboutPhoto).startsWith("data:") || String(data.aboutPhoto).startsWith("http")}
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80 items-center justify-center rounded-full border-2 border-cyan-500/60 border-dashed text-center text-slate-400 shadow-[0_0_80px_rgba(34,211,238,0.3)]">
                      Upload your photo under Edit Data.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section id="work" className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400">FEATURED PROJECTS</h2>
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
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400">CERTIFICATIONS</h2>
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
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400">EXPERIENCE AND SKILLS</h2>
              </div>

              <div className="max-w-5xl mx-auto">
                {/* Experience Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-cyan-300 text-center mb-8">Professional Experience</h3>
                  <div className="space-y-6">
                    {data.resume.experiences.map((experience, idx) => (
                      <div key={experience.id} className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 to-blue-400/50"></div>
                        <div className="ml-16 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:border-cyan-400/30 transition-all duration-300">
                          <ProjectResume
                            dates={experience.dates}
                            type={experience.type}
                            position={experience.position}
                            bullets={experience.bullets.join(",")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expertise Section */}
                {data.resume.expertise?.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-cyan-300 text-center mb-8">Technical Expertise</h3>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.02] p-8 backdrop-blur-sm">
                      <div className="flex flex-wrap gap-3 justify-center">
                        {data.resume.expertise.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            className="rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 px-5 py-2.5 text-sm font-medium text-cyan-200 transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/20 hover:shadow-lg hover:shadow-cyan-400/20"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => {
                    if (resumePdf) {
                      window.open(resumePdf, '_blank');
                    }
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
