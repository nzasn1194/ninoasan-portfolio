import { usePortfolio } from "../../lib/usePortfolio";

const Socials = ({ className, buttonClass }) => {
  const { portfolio } = usePortfolio();

  const svgPathFor = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('github')) return "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.545 2.914 1.209.092-.937.35-1.546.636-1.903-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z";
    if (t.includes('linkedin')) return "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";
    if (t.includes('twitter')) return "M23.953 4.57a10 10 0 002.856-3.51 10 10 0 01-2.856 1.11 5 5 0 00-8.61.6c-1.09 1.13-1.938 2.7-1.938 4.27 0 .4.045.787.127 1.161A14.05 14.05 0 012.744 2.556c-.436.75-.7 1.627-.7 2.563 0 1.737.886 3.269 2.232 4.164a5 5 0 01-2.267-.616v.06c0 2.209 1.591 4.063 3.708 4.476a5 5 0 01-2.252.085 5.008 5.008 0 004.67 3.476 10.004 10.004 0 01-6.177 2.126 10 10 0 006.168 1.809c7.402 0 11.44-6.15 11.44-11.44 0-.174 0-.345-.012-.516a8.15 8.15 0 002.016-2.084z";
    if (t.includes('email')) return "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z";
    return null;
  };

  return (
    <div className={`${className} flex items-center gap-2 mob:flex-nowrap`}>
      {portfolio.socials?.map((social, index) => {
        const path = svgPathFor(social.title || "");
        const cls = buttonClass || "flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20";

        if (path) {
          return (
            <button key={index} onClick={() => window.open(social.link)} className={cls} aria-label={social.title} title={social.title}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d={path} />
              </svg>
            </button>
          );
        }

        // fallback: plain text label
        return (
          <button key={index} onClick={() => window.open(social.link)} className={cls} aria-label={social.title} title={social.title}>
            <span className="text-sm font-semibold text-white">{(social.title || '').slice(0,2).toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Socials;
