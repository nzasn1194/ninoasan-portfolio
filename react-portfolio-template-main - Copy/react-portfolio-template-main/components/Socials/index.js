import { usePortfolio } from "../../lib/usePortfolio";
import Image from "next/image";
import Button from "../Button";

const Socials = ({ className }) => {
  const { portfolio } = usePortfolio();

  const iconFor = (title) => {
    const t = title.toLowerCase();
    if (t.includes("github")) return "/images/github.svg";
    if (t.includes("linkedin")) return "/images/linkedin.svg";
    if (t.includes("email")) return "/images/email.svg";
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
              className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center hover:bg-white/10"
              aria-label={social.title}
            >
              <Image src={icon} alt={social.title} width={18} height={18} />
            </button>
          );
        }

        return (
          <Button key={index} onClick={() => window.open(social.link)}>
            {social.title}
          </Button>
        );
      })}
    </div>
  );
};

export default Socials;
