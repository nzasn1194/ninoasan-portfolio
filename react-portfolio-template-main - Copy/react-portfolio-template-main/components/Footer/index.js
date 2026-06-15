import { useState } from "react";
import Socials from "../Socials";

const Footer = ({}) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fallback: open mail client with populated subject/body
    const mailto = `mailto:${"your-email@example.com"}?subject=${encodeURIComponent(
      form.subject || "Contact"
    )}&body=${encodeURIComponent(`Name: ${form.name}\n\n${form.message}`)}&cc=${encodeURIComponent(
      form.email
    )}`;
    window.open(mailto, "_blank");
  };

  return (
    <div className="mt-5 laptop:mt-40 p-4 laptop:p-0 relative z-20">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2 items-start">
        <div>
          <h2 className="text-sm uppercase tracking-[0.4em] text-cyan-400/80">Get in touch</h2>
          <h1 className="mt-4 text-4xl font-bold text-white">Let&apos;s build something extraordinary together.</h1>
          <p className="mt-6 max-w-2xl text-base tablet:text-lg opacity-70">I&apos;m currently available for freelance work and open to new opportunities. If you have a project that needs a creative touch, or just want to discuss the latest tech, I&apos;m all ears.</p>

          <div className="mt-8 border-t border-white/5 pt-6">
            <div className="flex gap-8 items-center">
              <div>
                <p className="text-xs uppercase text-slate-400">Email me</p>
                <a href="mailto:ninobauzonasan@gmail.com" className="font-semibold text-white hover:text-cyan-300 transition">ninobauzonasan@gmail.com</a>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Based in</p>
                <p className="font-semibold">Philippines</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm uppercase text-slate-400">Follow me</p>
              <div className="mt-4">
                  <Socials buttonClass={"flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20"} />
                </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative rounded-[1rem] border border-white/10 p-6 bg-slate-950 shadow-[0_25px_50px_rgba(15,23,42,0.75)]">
          <h3 className="text-xl font-semibold text-white">Send a Message</h3>
          <label className="mt-4 block text-xs uppercase text-slate-400">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full mt-2 p-3 rounded-md bg-transparent border border-white/10 text-white" placeholder="Your Name" />
          <label className="mt-4 block text-xs uppercase text-slate-400">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full mt-2 p-3 rounded-md bg-transparent border border-white/10 text-white" placeholder="your_email@example.com" />
          <label className="mt-4 block text-xs uppercase text-slate-400">Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} className="w-full mt-2 p-3 rounded-md bg-transparent border border-white/10 text-white" placeholder="Project Inquiry, Hello, etc." />
          <label className="mt-4 block text-xs uppercase text-slate-400">Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} className="w-full mt-2 p-3 rounded-md bg-transparent border border-white/10 text-white h-36" placeholder="How can I help you?" />
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 px-6 py-3 text-white font-semibold transition-colors duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
