import { usePortfolio } from "../../lib/usePortfolio";
import Button from "../Button";

const Socials = ({ className }) => {
  const { portfolio } = usePortfolio();

  return (
    <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
      {portfolio.socials?.map((social, index) => (
        <Button key={index} onClick={() => window.open(social.link)}>
          {social.title}
        </Button>
      ))}
    </div>
  );
};

export default Socials;
