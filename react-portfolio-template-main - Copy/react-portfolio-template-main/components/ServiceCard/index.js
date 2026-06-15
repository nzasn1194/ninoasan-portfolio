import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const ServiceCard = ({ image, name }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`group card-accent relative overflow-hidden w-full max-w-sm mx-auto p-4 rounded-[2rem] border border-fuchsia-300/30 dark:border-cyan-400/30 bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-all ease-out duration-300 ${
        mounted && theme === "dark" ? "hover:bg-slate-900/95 hover:border-cyan-500/60" : "hover:bg-fuchsia-50/95 hover:border-fuchsia-600/60"
      } hover:-translate-y-1 link text-center`}
    >
      {image && (
        <div className="cert-image image-shell relative overflow-hidden rounded-[1.75rem] border border-fuchsia-400/45 dark:border-cyan-500/45 mb-5 aspect-[4/3] flex items-center justify-center p-4 bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 shadow-sm transition-all duration-700 ease-out group-hover:-translate-y-1">
          <div className="inner-img relative w-full h-full overflow-hidden">
            <Image
              src={image}
              alt={`${name} certification`}
              layout="fill"
              objectFit="cover"
              unoptimized={String(image).startsWith("data:") || String(image).startsWith("http")}
              className="transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      )}
      <h1 className="text-lg font-semibold leading-tight text-black dark:text-white drop-shadow-sm z-10 text-center">
        {name ? name : "Heading"}
      </h1>
    </div>
  );
};

export default ServiceCard;
