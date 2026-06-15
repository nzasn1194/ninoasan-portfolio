import Image from "next/image";
import { useState } from "react";

const WorkCard = ({ images = [], img, name, description, onClick }) => {
  const gallery = images.length ? images : img ? [img] : [];
  const slides = gallery.filter((s) => !!s && typeof s === "string").slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (event) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = (event) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="group card-accent relative overflow-hidden rounded-[2rem] p-2 laptop:p-4 first:ml-0 link bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-sky-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 border border-fuchsia-300/30 dark:border-cyan-400/30 ring-1 ring-cyan-300/20 dark:ring-fuchsia-500/20 shadow-[0_18px_55px_rgba(15,23,42,0.12)] hover:shadow-[0_24px_80px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="image-shell cert-image relative overflow-hidden rounded-[1.75rem] border border-fuchsia-400/45 dark:border-cyan-500/45 mb-5 aspect-[4/3] flex items-center justify-center p-4 bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 shadow-sm transition-all duration-700 ease-out group-hover:-translate-y-1">
        <div className="relative h-full w-full">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full h-full overflow-hidden flex items-center justify-center relative inner-img">
                <div className="absolute inset-0">
                  {slide ? (
                    <Image
                      src={slide}
                      alt={`${name} image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      unoptimized={String(slide).startsWith("data:") || String(slide).startsWith("http")}
                      className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-xl shadow-lg transition hover:bg-white dark:bg-slate-900/90 dark:text-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-xl shadow-lg transition hover:bg-white dark:bg-slate-900/90 dark:text-white"
              >
                ›
              </button>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-400 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 p-4 tablet:p-5 shadow-sm">
        <h1 className="text-lg tablet:text-lg laptop:text-xl font-semibold text-black dark:text-white">
          {name ? name : "Project Name"}
        </h1>
        <h2 className="text-sm tablet:text-sm laptop:text-base text-slate-700 dark:text-slate-300 mt-2 leading-6">
          {description ? description : "Description"}
        </h2>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClick?.();
            }}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold uppercase text-white transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            VIEW
          </button>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {slides.length > 1 ? `${currentIndex + 1}/${slides.length}` : "View"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
