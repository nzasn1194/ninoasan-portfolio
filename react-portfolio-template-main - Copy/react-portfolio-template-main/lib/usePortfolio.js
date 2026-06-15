import { useEffect, useState } from "react";
import defaultData from "../data/portfolio.json";

const STORAGE_KEY = "portfolio-data";

const ensureArray = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(fallback)) return fallback;
  return [];
};

const normalizePortfolio = (raw) => {
  if (!raw || typeof raw !== "object") return defaultData;

  const resume = raw.resume || {};

  const projects = ensureArray(raw.projects, defaultData.projects).map((project, index) => {
    const defaultProject = defaultData.projects[index] || {};
    const imageSrc = project?.imageSrc || defaultProject.imageSrc || "";
    return {
      ...defaultProject,
      ...project,
      images: ensureArray(project.images, imageSrc ? [imageSrc] : defaultProject.images),
    };
  });

  return {
    ...defaultData,
    ...raw,
    socials: ensureArray(raw.socials, defaultData.socials),
    projects,
    services: ensureArray(raw.services, defaultData.services),
    resume: {
      ...defaultData.resume,
      ...resume,
      experiences: ensureArray(resume.experiences, defaultData.resume.experiences),
      languages: ensureArray(resume.languages, defaultData.resume.languages),
      frameworks: ensureArray(resume.frameworks, defaultData.resume.frameworks),
      others: ensureArray(resume.others, defaultData.resume.others),      expertise: ensureArray(resume.expertise, defaultData.resume.expertise),    },
  };
};

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(defaultData);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const normalized = normalizePortfolio(parsed);
      setPortfolio(normalized);
    } catch (error) {
      console.warn("Failed to parse saved portfolio data", error);
      window.localStorage.removeItem(STORAGE_KEY);
      setPortfolio(defaultData);
    }
  }, []);

  const savePortfolio = (next) => {
    const normalized = normalizePortfolio(next);
    setPortfolio(normalized);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      // Attempt to persist to Netlify function which will commit to GitHub.
      // The function will reject payloads that include data-URI images.
      try {
        fetch("/.netlify/functions/save-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio: normalized }),
        })
          .then((res) => {
            if (!res.ok) return res.text().then((t) => Promise.reject(t));
            return res.json();
          })
          .then(() => {
            console.log("Portfolio persisted remotely");
          })
          .catch((err) => {
            console.warn("Remote save failed", err);
          });
      } catch (err) {
        console.warn("Remote save not available", err);
      }
    }
  };

  return { portfolio, savePortfolio };
}
