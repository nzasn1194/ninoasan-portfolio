import Image from "next/image";
import { usePortfolio } from "../../lib/usePortfolio";

const Socials = ({ className, buttonClass }) => {
  const { portfolio } = usePortfolio();

  const iconFor = (title) => {
    const t = title.toLowerCase();
    if (t.includes("github")) return "/images/github.svg";
    if (t.includes("linkedin")) return "/images/linkedin.svg";
    if (t.includes("email")) return "/images/email.svg";
    if (t.includes("twitter")) return "/images/twitter.svg";
    return null;
  };

  return (
    <div className={`${className} flex items-center gap-2 mob:flex-nowrap`}>
      {portfolio.socials?.map((social, index) => {
        const icon = iconFor(social.title || "");
        if (icon) {
          return (
            <button
              key={index}
              onClick={() => window.open(social.link)}
              className={
                buttonClass ||
                "flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20"
              }
              aria-label={social.title}
            >
              <Image className="w-5 h-5 filter invert" src={icon} alt={social.title} width={20} height={20} />
            </button>
          );
        }

        return (
          <button
            key={index}
              onClick={() => window.open(social.link)}
              className={
                buttonClass ||
                "flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20"
              }
            aria-label={social.title}
          >
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default Socials;
