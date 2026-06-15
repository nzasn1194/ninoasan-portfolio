import Image from "next/image";
import { usePortfolio } from "../../lib/usePortfolio";

const Socials = ({ className }) => {
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
              className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/15 transition-colors"
              aria-label={social.title}
            >
              <Image src={icon} alt={social.title} width={20} height={20} />
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => window.open(social.link)}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/15 transition-colors"
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
