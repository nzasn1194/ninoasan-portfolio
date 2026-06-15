import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePortfolio } from "../../lib/usePortfolio";
import Button from "../Button";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { portfolio } = usePortfolio();

  const { name, showBlog, showResume, darkMode } = portfolio;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Popover className="block tablet:hidden sticky top-0 z-20 bg-[#020617]/70 backdrop-blur-xl">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-3 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link"
              >
                <span className="bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">{name}</span>.
              </h1>

              <div className="flex items-center">
                <Popover.Button className="rounded-full p-2 transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/80">
                  <Image
                    className="h-5 w-5"
                    src={`/images/${
                      !open
                        ? theme === "dark"
                          ? "menu-white.svg"
                          : "menu.svg"
                        : theme === "light"
                        ? "cancel.svg"
                        : "cancel-white.svg"
                    }`}
                    alt={open ? "Close menu" : "Open menu"}
                    width={20}
                    height={20}
                  />
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className={`absolute right-2 left-2 z-20 w-auto p-4 bg-[#020617]/85 border border-white/10 shadow-xl backdrop-blur-xl rounded-3xl`}
            >
              {!isBlog ? (
                <div className="grid grid-cols-1">
                  <Button onClick={handleWorkScroll}>Project</Button>
                  <Button onClick={handleAboutScroll}>About</Button>
                  {showResume && (
                    <Button
                      onClick={() =>
                        window.open("mailto:hello@chetanverma.com")
                      }
                    >
                      Resume
                    </Button>
                  )}
                  <Button onClick={() => router.push("/edit")}>Edit Data</Button>
                  <Button
                    onClick={() => window.open("mailto:hello@chetanverma.com")}
                  >
                    Contact
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  <Button onClick={() => router.push("/")} classes="first:ml-1">
                    Home
                  </Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                      classes="rounded-full bg-cyan-500 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-400"
                    >
                      Resume
                    </Button>
                  )}

                  <Button
                    onClick={() => window.open("mailto:hello@chetanverma.com")}
                  >
                    Contact
                  </Button>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className={`mt-10 hidden flex-row items-center justify-between sticky top-0 z-20 bg-[#020617]/70 backdrop-blur-xl border border-white/10 rounded-[2rem] px-4 py-3 ${
          theme === "light" && "bg-white/95"
        } dark:text-white tablet:flex`}
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0"
        >
          <span className="bg-gradient-to-r fr          cd "c:\Users\Ninz\Downloads\ninoasan-portfolio\react-portfolio-template-main - Copy\react-portfolio-template-main"
          git remote set-url origin git@github.com:nzasn1194/ninoasan-portfolio.git
          git push -u origin mainom-pink-500 to-sky-500 bg-clip-text text-transparent">{name}</span>.
        </h1>
        {!isBlog ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleWorkScroll}
              classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
            >
              Project
            </Button>
            <Button
              onClick={handleAboutScroll}
              classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
            >
              About
            </Button>
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="rounded-full bg-cyan-500 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-400"
              >
                Resume
              </Button>
            )}

            <Button
              onClick={() => router.push("/edit")}
              classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
            >
              Edit Data
            </Button>
            <Button onClick={() => window.open("mailto:hello@chetanverma.com")}>
              Contact
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => router.push("/")}
              classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
            >
              Home
            </Button>
            {showBlog && (
              <Button
                onClick={() => router.push("/blog")}
                classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
              >
                Blog
              </Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="rounded-full bg-cyan-500 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-400"
              >
                Resume
              </Button>
            )}

            <Button
              onClick={() => window.open("mailto:hello@chetanverma.com")}
              classes="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition hover:bg-white/10"
            >
              Contact
            </Button>

            {mounted && theme && darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Image
                  className="h-6"
                  alt="Toggle theme"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  width={24}
                  height={24}
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
