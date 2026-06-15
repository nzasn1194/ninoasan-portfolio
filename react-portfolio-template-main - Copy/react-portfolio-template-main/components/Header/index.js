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
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleWorkScroll}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    Projects
                  </button>
                  <button
                    onClick={handleAboutScroll}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    About
                  </button>
                  {showResume && (
                    <button
                      onClick={() => router.push("/resume")}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => router.push("/edit")}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    Edit Data
                  </button>
                  <button
                    onClick={() => window.open("mailto:hello@chetanverma.com")}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    Contact
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => router.push("/")}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    Home
                  </button>
                  {showBlog && (
                    <button
                      onClick={() => router.push("/blog")}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                    >
                      Blog
                    </button>
                  )}
                  {showResume && (
                    <button
                      onClick={() => router.push("/resume")}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => window.open("mailto:hello@chetanverma.com")}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    Contact
                  </button>
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
          <span className="bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">{name}</span>.
        </h1>
        {!isBlog ? (
            <div className="flex items-center gap-8">
              <button
                onClick={handleWorkScroll}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                Projects
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={handleAboutScroll}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                About
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
              {showResume && (
                <button
                  onClick={() => router.push("/resume")}
                  className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
                >
                  Resume
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              )}

              <button
                onClick={() => router.push("/edit")}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                Edit Data
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>

              <button
                onClick={() => window.open("mailto:hello@chetanverma.com")}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                Contact
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push("/")}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                Home
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
              {showBlog && (
                <button
                  onClick={() => router.push("/blog")}
                  className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
                >
                  Blog
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              )}
              {showResume && (
                <button
                  onClick={() => router.push("/resume")}
                  className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
                >
                  Resume
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              )}

              <button
                onClick={() => window.open("mailto:hello@chetanverma.com")}
                className="relative group text-sm uppercase tracking-[0.3em] text-slate-100 transition duration-300 hover:text-white"
              >
                Contact
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>

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
