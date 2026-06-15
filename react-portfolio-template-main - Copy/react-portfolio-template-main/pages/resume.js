import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { usePortfolio } from "../lib/usePortfolio";

const Resume = () => {
  const { portfolio } = usePortfolio();
  return (
    <>
      <Head>
        <title>Resume | {portfolio.name}</title>
      </Head>
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 laptop:px-10">
          <Header isBlog />
          <main className="mt-20 rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
            <h1 className="text-4xl font-semibold">Resume</h1>
            <p className="mt-4 text-slate-300">This is a placeholder resume page. Replace this content with your resume details.</p>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Resume;
