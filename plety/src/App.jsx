import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Global styles: smooth scroll + marquee keyframes (kept in-file)    */
/* ------------------------------------------------------------------ */
const GlobalStyles = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    body { background: #000; }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      [class*="animate-[marquee"] { animation: none !important; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const VIDEOS = {
  hero: "https://cdn.sceneai.art/Hero%20Section%20Video/50b4f304-cdca-4e12-8735-580d225834be.mp4",
  chat: "https://cdn.sceneai.art/Hero%20Section%20Video/1bcc8fa3-37f6-4c53-8591-0347e4c7f8ac.mp4",
  transcription: "https://cdn.sceneai.art/Hero%20Section%20Video/736fd4a0-70ac-4f44-9633-55769ead6aca.mp4",
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const FAQS = [
  {
    q: "Is my data safe with Plety?",
    a: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never train models on your private data, and you can request full deletion at any time.",
  },
  {
    q: "How long does integration take?",
    a: "Most teams are live in under an hour. Our SDKs and REST API plug into your existing stack with just a few lines of code, and API 2.0 adds native webhooks.",
  },
  {
    q: "Which languages does transcription support?",
    a: "Plety transcribes over 50 languages and dialects in real time, including Arabic, English, French, and Spanish, with automatic speaker detection.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. Upgrade, downgrade, or cancel whenever you like from your dashboard. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do you offer support for enterprise teams?",
    a: "Yes. Enterprise plans include SSO, dedicated infrastructure, custom SLAs, and a named success manager who works directly with your team.",
  },
];

/* ------------------------------------------------------------------ */
/*  Smooth scroll helper (accounts for the fixed navbar)               */
/* ------------------------------------------------------------------ */
const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - (href === "#about" ? 0 : 72);
  window.scrollTo({ top, behavior: "smooth" });
};

/* ------------------------------------------------------------------ */
/*  FadeInUp — scroll reveal wrapper                                   */
/* ------------------------------------------------------------------ */
function FadeInUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo — stroke-based geometric mark                                 */
/* ------------------------------------------------------------------ */
function PletyLogo({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="2.75" y="2.75" width="26.5" height="26.5" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 23V9h5.25a4.75 4.75 0 0 1 0 9.5H12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.25" cy="13.75" r="1.25" fill="currentColor" />
    </svg>
  );
}

function Brand({ className = "" }) {
  return (
    <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId("#about"); }} className={`flex items-center gap-2.5 text-white ${className}`}>
      <PletyLogo />
      <span className="text-lg font-semibold tracking-tight">Plety</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */
function PrimaryButton({ children = "Get started", href = "#contact" }) {
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollToId(href); }}
      className="inline-flex items-center justify-center bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ children = "Learn more", href = "#features" }) {
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollToId(href); }}
      className="inline-flex items-center justify-center bg-[#1F1F22] hover:bg-[#2A2A2D] text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/5 transition-colors"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Navbar                                                          */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Brand />

        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={(e) => handleNav(e, "#contact")}
          className="hidden md:inline-flex bg-[#1F1F22] hover:bg-[#2A2A2D] text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/5 transition-colors"
        >
          Get started
        </a>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden relative w-10 h-10 -mr-2 flex items-center justify-center text-white"
        >
          <span className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
          <span className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className="md:hidden grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className={`px-6 pb-6 pt-2 flex flex-col gap-1 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  className="block py-3 text-base font-medium text-gray-300 hover:text-white border-b border-white/5 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="#contact"
                onClick={(e) => handleNav(e, "#contact")}
                className="flex justify-center bg-white text-black text-sm font-medium px-5 py-3 rounded-full"
              >
                Get started
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Background video helper                                            */
/* ------------------------------------------------------------------ */
function BgVideo({ src, className }) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee brand logos (stroke SVGs)                                  */
/* ------------------------------------------------------------------ */
const BRANDS = [
  {
    name: "Springfield",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z" />
        <path d="M5 19 13 11" />
      </svg>
    ),
  },
  {
    name: "Orbitc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="3.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)" />
      </svg>
    ),
  },
  {
    name: "Cloud",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.5 4.5 0 0 0 7 18Z" />
      </svg>
    ),
  },
  {
    name: "Amster",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3 21 20H3L12 3Z" />
        <path d="M12 10.5 16.5 20M12 10.5 7.5 20" />
      </svg>
    ),
  },
  {
    name: "Nexus",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
];

function Marquee() {
  // 4 identical copies → translateX(-50%) lands exactly on copy #3, seamless loop.
  const items = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];
  const mask = "linear-gradient(to right, transparent, black 15%, black 85%, transparent)";
  return (
    <div className="w-full mt-24">
      <p className="text-sm text-gray-500 font-medium mb-8 text-center">Trusted by industry leaders</p>
      <div className="relative w-full overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">
          {items.map((b, i) => (
            <div key={i} className="flex-shrink-0 px-8 flex items-center gap-2 text-gray-400" aria-hidden={i >= BRANDS.length}>
              {b.icon}
              <span className="text-lg font-semibold tracking-tight">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Hero                                                            */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section id="about" className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative z-0 overflow-hidden">
      <BgVideo src={VIDEOS.hero} className="absolute inset-0 -z-10 w-full h-full object-cover min-w-full min-h-full opacity-90" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black" />

      <div className="px-6 flex flex-col items-center w-full">
        <FadeInUp>
          <span className="inline-flex px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-sm">
            ✨ Announcing API 2.0
          </span>
        </FadeInUp>

        <FadeInUp delay={100}>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-center">
            The intelligence layer <br />
            for clear <span className="font-serif italic font-normal">decisions.</span>
          </h1>
        </FadeInUp>

        <FadeInUp delay={200}>
          <p className="text-[16px] text-gray-400 max-w-2xl text-center mx-auto">
            Our platform integrates seamlessly into your stack to deliver real-time understanding, not just predictions.
          </p>
        </FadeInUp>

        <FadeInUp delay={300}>
          <div className="flex flex-row items-center gap-3 mt-10">
            <PrimaryButton />
            <SecondaryButton />
          </div>
        </FadeInUp>
      </div>

      <FadeInUp delay={400} className="w-full">
        <Marquee />
      </FadeInUp>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared feature text block                                          */
/* ------------------------------------------------------------------ */
function FeatureText({ badge, badgeColor, title, text }) {
  return (
    <FadeInUp className="flex flex-col items-start">
      <span className={`inline-flex px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6 ${badgeColor}`}>
        ✨ {badge}
      </span>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-[1.1]">{title}</h2>
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">{text}</p>
      <PrimaryButton />
    </FadeInUp>
  );
}

function MockupFrame({ video, children }) {
  return (
    <FadeInUp delay={150}>
      <div className="rounded-3xl overflow-hidden p-8 border border-white/10 relative min-h-[420px] flex items-center justify-center">
        <BgVideo src={video} className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative w-full">{children}</div>
      </div>
    </FadeInUp>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Feature — AI Chat                                               */
/* ------------------------------------------------------------------ */
const ChipIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d={d} />
  </svg>
);

function ChatCard() {
  const chips = [
    { label: "Create image", d: "M4 16l4.5-4.5 3 3L15 11l5 5M4 5h16v14H4zM9 9.5h.01" },
    { label: "Summarize", d: "M4 6h16M4 12h10M4 18h7" },
    { label: "Analyze data", d: "M5 20V10M12 20V4M19 20v-7" },
    { label: "Code", d: "m8 8-4 4 4 4M16 8l4 4-4 4" },
  ];
  return (
    <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50 max-w-md mx-auto">
      <div className="flex flex-wrap gap-2 mb-16">
        {chips.map((c) => (
          <span key={c.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <ChipIcon d={c.d} />
            {c.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl pl-3 pr-1.5 py-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5 text-gray-500">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="flex-1 text-sm text-gray-500">Ask anything...</span>
        <button type="button" aria-label="Voice input" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
        <button type="button" aria-label="Voice mode" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FeatureChat() {
  return (
    <section id="features" className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-24 px-6 max-w-7xl mx-auto items-center">
      <FeatureText
        badge="AI chat"
        badgeColor="text-yellow-300"
        title="Where speed meets intelligent conversation."
        text="A conversational AI assistant that understands your questions, provides intelligent answers, and helps you get things done fast from casual chats to complex tasks."
      />
      <MockupFrame video={VIDEOS.chat}>
        <ChatCard />
      </MockupFrame>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Feature — AI Transcription                                      */
/* ------------------------------------------------------------------ */
const WAVE = [6, 12, 20, 14, 26, 18, 30, 22, 12, 8, 16, 28, 34, 24, 14, 20, 30, 18, 10, 6, 14, 24, 32, 20, 12, 18, 26, 16, 8, 12, 22, 14, 8, 4];

function TranscriptionCard() {
  return (
    <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" aria-label="Play recording" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">11:06 AM – Chris</p>
          <p className="text-xs text-gray-500">Product sync · 02:14</p>
        </div>
      </div>

      <div className="flex items-center gap-[3px] h-10 mb-5" aria-hidden="true">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full ${i < 14 ? "bg-green-400" : "bg-white/20"}`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <div className="space-y-2.5 border-t border-white/10 pt-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-gray-500 mr-2">00:12</span>
          Let's lock the launch date for next Thursday and loop in design.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          <span className="mr-2">00:19</span>
          We'll need the final assets by Monday so QA has time to review…
        </p>
      </div>
    </div>
  );
}

function FeatureTranscription() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-24 px-6 max-w-7xl mx-auto items-center">
      <div className="order-2 lg:order-1">
        <MockupFrame video={VIDEOS.transcription}>
          <TranscriptionCard />
        </MockupFrame>
      </div>
      <div className="order-1 lg:order-2">
        <FeatureText
          badge="AI transcription"
          badgeColor="text-green-400"
          title="Turn speech into text with speed and precision."
          text="Automatically convert speech into accurate, editable text in real time. Perfect for meetings, interviews, voice notes, and more, powered by advanced speech recognition technology."
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. FAQ                                                             */
/* ------------------------------------------------------------------ */
function FAQItem({ q, a, open, onToggle, last, id }) {
  return (
    <div className={last ? "" : "border-b border-white/10"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
        className="w-full flex items-center justify-between gap-6 py-6 px-6 text-left"
      >
        <span className="text-base text-white font-medium">{q}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-out ${open ? "rotate-45 text-white" : "rotate-0"}`}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div
        id={`faq-panel-${id}`}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-gray-400 text-sm pb-6 px-6 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section id="faq" className="py-32 px-6 max-w-3xl mx-auto">
      <FadeInUp>
        <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-12">We've got answers</h2>
      </FadeInUp>
      <FadeInUp delay={100}>
        <div className="border border-white/10 rounded-xl bg-transparent">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              id={i}
              {...item}
              last={i === FAQS.length - 1}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Footer                                                          */
/* ------------------------------------------------------------------ */
const FOOTER_COLS = [
  { title: "Product", links: [["About", "#about"], ["Pricing", "#"], ["Changelog", "#"], ["Contact", "#contact"]] },
  { title: "Legal", links: [["Terms of service", "#"], ["Privacy policy", "#"], ["404", "#"]] },
  { title: "Connect", links: [["Instagram", "#"], ["YouTube", "#"], ["LinkedIn", "#"], ["Twitter / X", "#"]] },
];

function Footer() {
  return (
    <footer id="contact" className="relative z-0 pt-32 pb-10 px-6 border-t border-white/5 overflow-hidden">
      <BgVideo src={VIDEOS.hero} className="absolute inset-0 object-cover w-full h-full opacity-40 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-black/60 to-black" />

      <FadeInUp className="flex flex-col items-center text-center mb-32">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-10">
          Ready to automate <span className="font-serif italic font-normal">everything?</span>
        </h2>
        <div className="flex flex-row items-center gap-3">
          <PrimaryButton href="#about" />
          <SecondaryButton />
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-24">
        <div>
          <div className="flex items-center gap-2.5 text-white mb-4">
            <PletyLogo />
            <span className="text-xl font-bold tracking-tight">Plety</span>
          </div>
          <p className="text-sm text-gray-400">Speed, scale, and smarts — deployed.</p>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-medium text-white mb-4">{col.title}</h3>
            <ul className="space-y-3">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => {
                      if (href.length > 1) { e.preventDefault(); scrollToId(href); }
                      else e.preventDefault();
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-500 border-t border-white/5 pt-8">
        <span>© 2026 Plety. All rights reserved</span>
        <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
        <span>by <span className="text-gray-300">Re-text</span></span>
        <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
        <span>Made in <span className="text-gray-300">Gemini</span></span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <div className="bg-black text-white min-h-screen antialiased overflow-x-hidden">
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <FeatureChat />
        <FeatureTranscription />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
