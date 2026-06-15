import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { usePortfolio } from "../lib/usePortfolio";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const uploadToCloudinary = async (file) => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) return null;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url || data.url || null;
  } catch (err) {
    console.warn('Cloudinary upload error', err);
    return null;
  }
};

const EditPage = () => {
  const { portfolio, savePortfolio } = usePortfolio();
  const [formData, setFormData] = useState(portfolio);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setFormData(portfolio);
  }, [portfolio]);

  const persistFormData = (next) => {
    setFormData(next);
    savePortfolio(next);
    setSaveMessage("Saved successfully.");
    window.setTimeout(() => setSaveMessage(""), 2500);
  };

  const updateField = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      savePortfolio(next);
      return next;
    });
  };

  const updateNested = (section, index, key, value) => {
    setFormData((prev) => {
      const list = [...(prev[section] || [])];
      list[index] = { ...list[index], [key]: value };
      const next = { ...prev, [section]: list };
      savePortfolio(next);
      return next;
    });
  };

  const updateResumeExpertiseItem = (index, value) => {
    setFormData((prev) => {
      const expertise = [...((prev.resume?.expertise) || [])];
      expertise[index] = value;
      const next = {
        ...prev,
        resume: {
          ...prev.resume,
          expertise,
        },
      };
      savePortfolio(next);
      return next;
    });
  };

  const addResumeExpertise = () => {
    setFormData((prev) => {
      const expertise = [...((prev.resume?.expertise) || []), ""];
      const next = {
        ...prev,
        resume: {
          ...prev.resume,
          expertise,
        },
      };
      savePortfolio(next);
      return next;
    });
  };

  const removeResumeExpertise = (index) => {
    setFormData((prev) => {
      const expertise = [...((prev.resume?.expertise) || [])].filter((_, i) => i !== index);
      const next = {
        ...prev,
        resume: {
          ...prev.resume,
          expertise,
        },
      };
      savePortfolio(next);
      return next;
    });
  };

  const handleProjectImagesUpload = async (event, index) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (!files.length) return;

    // client-side validation: image files only, max 2MB each
    const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setSaveMessage('Only image files are allowed for project photos.');
        window.setTimeout(() => setSaveMessage(''), 3000);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setSaveMessage('Each image must be smaller than 2 MB.');
        window.setTimeout(() => setSaveMessage(''), 3000);
        continue;
      }
      validFiles.push(file);
    }
    if (!validFiles.length) return;

    // Try Cloudinary upload first (if configured), otherwise fallback to data URLs
    const cloudConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const results = await Promise.all(
      validFiles.map(async (file) => {
        if (cloudConfigured) {
          const url = await uploadToCloudinary(file);
          if (url) return url;
        }
        return await readFileAsDataUrl(file);
      })
    );

    setFormData((prev) => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], images: results };
      const next = { ...prev, projects: list };
      savePortfolio(next);
      return next;
    });
  };

  const addItem = (section, template) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [section]: [...(prev[section] || []), template],
      };
      savePortfolio(next);
      return next;
    });
  };

  const removeItem = (section, index) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      };
      savePortfolio(next);
      return next;
    });
  };

  const handleSave = () => {
    savePortfolio(formData);
    setSaveMessage("Saved successfully.");
    window.setTimeout(() => setSaveMessage(""), 2500);
  };

  const handleFileUpload = async (event, key, section, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file types and sizes
    const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB for single images
    const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5 MB for resume
    if (key === 'resumePdf') {
      if (file.type !== 'application/pdf') {
        setSaveMessage('Resume must be a PDF file.');
        window.setTimeout(() => setSaveMessage(''), 3000);
        return;
      }
      if (file.size > MAX_PDF_BYTES) {
        setSaveMessage('Resume PDF must be smaller than 5 MB.');
        window.setTimeout(() => setSaveMessage(''), 3000);
        return;
      }
    } else if (file.type && !file.type.startsWith('image/')) {
      setSaveMessage('Only image files are allowed here.');
      window.setTimeout(() => setSaveMessage(''), 3000);
      return;
    } else if (file.size > MAX_IMAGE_BYTES) {
      setSaveMessage('Image must be smaller than 3 MB.');
      window.setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const cloudConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    let savedUrl = null;
    if (cloudConfigured) {
      savedUrl = await uploadToCloudinary(file);
      if (!savedUrl) {
        setSaveMessage('Upload failed — saved locally instead.');
        window.setTimeout(() => setSaveMessage(''), 3000);
      }
    }

    const dataUrl = savedUrl || (await readFileAsDataUrl(file));

    if (section) {
      updateNested(section, index, key, dataUrl);
      return;
    }

    const next = {
      ...formData,
      [key]: dataUrl,
      ...(key === "resumePdf" ? { resumePdfName: file.name } : {}),
    };

    setFormData(next);
    savePortfolio(next);
  };

  return (
    <>
      <Head>
        <title>Edit Portfolio | {portfolio.name}</title>
      </Head>
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 laptop:px-10">
          <Header />
          <main className="mt-16 space-y-12">
            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8 flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Edit Data</p>
                  <h1 className="mt-3 text-4xl font-semibold text-white">Update your portfolio content</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="primary" onClick={handleSave}>Save Changes</Button>
                  {saveMessage && <span className="self-center text-sm text-green-400">{saveMessage}</span>}
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid gap-6 laptop:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">Intro Label</label>
                    <input
                      value={formData.introLabel || ""}
                      onChange={(e) => updateField("introLabel", e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081122] p-4 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">Hero Title</label>
                    <input
                      value={formData.heroTitle || ""}
                      onChange={(e) => updateField("heroTitle", e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081122] p-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 laptop:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">Hero Subtitle</label>
                    <input
                      value={formData.heroSubtitle || ""}
                      onChange={(e) => updateField("heroSubtitle", e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081122] p-4 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">Hero Description</label>
                    <textarea
                      value={formData.heroDescription || ""}
                      onChange={(e) => updateField("heroDescription", e.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081122] p-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 laptop:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">About Paragraph</label>
                    <textarea
                      value={formData.aboutpara || ""}
                      onChange={(e) => updateField("aboutpara", e.target.value)}
                      rows={6}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081122] p-4 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200">About Photo</label>
                    <div className="mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#081122] p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "aboutPhoto")}
                        className="w-full text-white"
                      />
                      {formData.aboutPhoto ? (
                        <div className="relative h-64 w-full rounded-3xl overflow-hidden">
                          <Image
                            src={formData.aboutPhoto}
                            alt="About preview"
                            layout="fill"
                            objectFit="cover"
                            unoptimized={String(formData.aboutPhoto).startsWith("data:") || String(formData.aboutPhoto).startsWith("http")}
                          />
                        </div>
                      ) : (
                        <div className="h-64 w-full rounded-3xl border border-dashed border-white/20 bg-slate-900/70 p-4 text-sm text-slate-400">Upload your about photo here.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Projects</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Feature projects</h2>
                </div>
                <Button type="primary" onClick={() => addItem("projects", { id: `${Date.now()}`, title: "New Project", description: "Add project description", imageSrc: "", url: "https://" })}>
                  Add Project
                </Button>
              </div>
              <div className="space-y-6">
                {formData.projects?.map((project, index) => (
                  <div key={project.id} className="rounded-3xl border border-white/10 bg-[#081122] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-white">Project #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem("projects", index)}
                        className="rounded-full border border-red-500 px-3 py-1 text-sm text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 laptop:grid-cols-2 mt-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-200">Title</label>
                        <input
                          value={project.title}
                          onChange={(e) => updateNested("projects", index, "title", e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-200">URL</label>
                        <input
                          value={project.url}
                          onChange={(e) => updateNested("projects", index, "url", e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-semibold text-slate-200">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateNested("projects", index, "description", e.target.value)}
                          rows={4}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-semibold text-slate-200">Project Images</label>
                        <div className="mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#020617] p-4">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleProjectImagesUpload(e, index)}
                            className="w-full text-white"
                          />
                          {project.images?.length ? (
                            <div className="grid gap-3 sm:grid-cols-3">
                              {project.images.slice(0, 3).map((src, imgIndex) => (
                                <div key={imgIndex} className="relative h-40 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                                  <Image
                                    src={src}
                                    alt={`${project.title} preview ${imgIndex + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    unoptimized={String(src).startsWith("data:") || String(src).startsWith("http")}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : project.imageSrc ? (
                            <div className="relative h-48 w-full rounded-3xl overflow-hidden">
                              <Image
                                src={project.imageSrc}
                                alt={project.title}
                                layout="fill"
                                objectFit="cover"
                                unoptimized={String(project.imageSrc).startsWith("data:") || String(project.imageSrc).startsWith("http")}
                              />
                            </div>
                          ) : (
                            <div className="h-48 w-full rounded-3xl border border-dashed border-white/20 bg-slate-900/70 text-center text-sm text-slate-400 p-4">
                              Upload up to 3 project photos here.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Resume</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Upload your PDF resume</h2>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#081122] p-6">
                <label className="block text-sm font-semibold text-slate-200">Resume PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "resumePdf")}
                  className="mt-2 w-full text-white"
                />
                <p className="mt-4 text-sm text-slate-400">
                  {formData.resumePdfName ? `Uploaded file: ${formData.resumePdfName}` : "Upload a PDF to enable the homepage VIEW RESUME button."}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Resume</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Expertise tags</h2>
                </div>
                <Button type="primary" onClick={addResumeExpertise}>Add Expertise</Button>
              </div>
              <div className="space-y-4">
                {formData.resume?.expertise?.map((skill, index) => (
                  <div key={`${skill}-${index}`} className="grid gap-4 laptop:grid-cols-[1fr_auto] items-end rounded-3xl border border-white/10 bg-[#081122] p-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200">Expertise #{index + 1}</label>
                      <input
                        value={skill}
                        onChange={(e) => updateResumeExpertiseItem(index, e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResumeExpertise(index)}
                      className="rounded-full border border-red-500 px-4 py-3 text-sm text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {!formData.resume?.expertise?.length && (
                  <p className="text-sm text-slate-400">Add expertise tags to show them on the Experience and Skills section.</p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Certifications</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Certification cards</h2>
                </div>
                <Button type="primary" onClick={() => addItem("services", { id: `${Date.now()}`, title: "New Certification", image: "" })}>
                  Add Certification
                </Button>
              </div>
              <div className="space-y-6">
                {formData.services?.map((service, index) => (
                  <div key={service.id} className="rounded-3xl border border-white/10 bg-[#081122] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-white">Certificate #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem("services", index)}
                        className="rounded-full border border-red-500 px-3 py-1 text-sm text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 laptop:grid-cols-2 mt-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-200">Title</label>
                        <input
                          value={service.title}
                          onChange={(e) => updateNested("services", index, "title", e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-semibold text-slate-200">Certificate Image</label>
                        <div className="mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#020617] p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "image", "services", index)}
                            className="w-full text-white"
                          />
                          {service.image ? (
                            <div className="relative h-48 w-full rounded-3xl overflow-hidden">
                              <Image
                                src={service.image}
                                alt={service.title}
                                layout="fill"
                                objectFit="cover"
                                unoptimized={String(service.image).startsWith("data:") || String(service.image).startsWith("http")}
                              />
                            </div>
                          ) : (
                            <div className="h-48 w-full rounded-3xl border border-dashed border-white/20 bg-slate-900/70 text-center text-sm text-slate-400 p-4">
                              Upload certification image here.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#050914] p-10 shadow-[0_25px_75px_rgba(8,16,38,0.45)]">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.4em] text-red-400/80">Socials</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Social links</h2>
              </div>
              <div className="space-y-6">
                {formData.socials?.map((social, index) => (
                  <div key={social.id} className="grid gap-4 laptop:grid-cols-3 items-end rounded-3xl border border-white/10 bg-[#081122] p-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200">Label</label>
                      <input
                        value={social.title}
                        onChange={(e) => updateNested("socials", index, "title", e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-200">Link</label>
                      <input
                        value={social.link}
                        onChange={(e) => updateNested("socials", index, "link", e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020617] p-4 text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem("socials", index)}
                      className="rounded-full border border-red-500 px-3 py-2 text-sm text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default EditPage;
