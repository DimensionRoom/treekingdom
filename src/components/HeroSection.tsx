import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, Droplets, Flower2, Sun, Heart, Sparkles, CloudRain, TreePine, Sprout } from "lucide-react";
import gsap from "gsap";
import logoHero from "@/assets/logo-hero.svg";

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" });
      gsap.from(".hero-title-line", { y: 60, opacity: 0, duration: 0.9, delay: 0.1, stagger: 0.15, ease: "power3.out" });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
      gsap.from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6, delay: 0.55, ease: "power3.out" });
      gsap.from(".hero-icon", {
        scale: 0, opacity: 0, rotation: -180, duration: 0.7, delay: 0.2,
        stagger: 0.08, ease: "back.out(1.7)"
      });
      gsap.from(".hero-stat", {
        y: 30, opacity: 0, scale: 0.8, duration: 0.5, delay: 0.7,
        stagger: 0.1, ease: "back.out(1.4)"
      });
      gsap.from(".hero-feature", {
        x: -30, opacity: 0, duration: 0.5, delay: 0.9,
        stagger: 0.1, ease: "power3.out"
      });
    }, heroRef);

    if (floatingRef.current) {
      const children = floatingRef.current.children;
      Array.from(children).forEach((child, i) => {
        gsap.to(child, {
          y: -12 - Math.random() * 15,
          x: Math.sin(i) * 8,
          rotation: (i % 2 === 0 ? 1 : -1) * (5 + Math.random() * 10),
          duration: 2.5 + Math.random() * 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.3,
        });
      });
    }

    return () => ctx.revert();
  }, []);

  const stats = [
    { emoji: "🌿", value: "12+", label: lang === "th" ? "พรรณไม้" : "Plants" },
    { emoji: "📦", value: "20+", label: lang === "th" ? "อุปกรณ์" : "Supplies" },
    { emoji: "💧", value: "4", label: lang === "th" ? "หมวดหมู่" : "Categories" },
  ];

  const features = [
    { icon: "🌱", text: lang === "th" ? "ข้อมูลครบถ้วน" : "Complete Info" },
    { icon: "📖", text: lang === "th" ? "วิธีดูแลละเอียด" : "Care Guides" },
    { icon: "🎯", text: lang === "th" ? "เลือกได้ตามหมวด" : "By Category" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-[75vh] md:min-h-[92vh] flex items-center bg-background py-8 md:py-0"
    >
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      {/* Floating decorative icons */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="hero-icon absolute top-[10%] left-[6%]">
          <Leaf className="w-12 h-12 text-primary/20 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute top-[15%] right-[10%]">
          <Heart className="w-9 h-9 text-secondary/25 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute bottom-[30%] left-[12%]">
          <Flower2 className="w-16 h-16 text-accent/20 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute bottom-[15%] right-[6%]">
          <Sun className="w-11 h-11 text-accent/25 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute top-[50%] left-[50%]">
          <Droplets className="w-8 h-8 text-primary/15 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute top-[35%] left-[80%]">
          <CloudRain className="w-10 h-10 text-primary/15 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute bottom-[40%] right-[25%]">
          <TreePine className="w-14 h-14 text-primary/15 drop-shadow-lg" />
        </div>
        <div className="hero-icon absolute top-[70%] left-[30%]">
          <Sprout className="w-9 h-9 text-primary/20 drop-shadow-lg" />
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 cute-blob animate-leaf-sway" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/5 cute-blob animate-float" />
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-secondary/5 cute-blob animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-primary/8 cute-blob animate-leaf-sway" style={{ animationDelay: "0.7s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Logo doubles as the page's <h1> — same look, correct semantics for SEO. */}
          <h1 className="hero-title-line flex justify-center mb-6 md:mb-10">
            <img src={logoHero} alt={t("hero.title")} className="h-24 sm:h-40 md:h-56 lg:h-72 w-auto drop-shadow-2xl" />
          </h1>

          {/* Subtitle */}
          <p className="hero-sub text-muted-foreground text-base md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed font-medium px-2">
            {t("hero.subtitle")}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-10 px-2">
            {features.map((f, i) => (
              <span key={i} className="hero-feature inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-muted backdrop-blur-sm rounded-full text-foreground/80 text-xs md:text-sm font-medium border border-border">
                {f.icon} {f.text}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-16 px-4">
            <Link
              to="/plants"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cute-shadow text-base md:text-lg"
            >
              <span className="group-hover:scale-125 transition-transform duration-300 inline-block">🌱</span>
              {t("hero.cta")}
            </Link>
            <Link
              to="/categories"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 md:px-10 md:py-4 border-2 border-border text-foreground font-bold rounded-full hover:bg-muted hover:border-primary/30 transition-all duration-300 text-base md:text-lg"
            >
              <span className="group-hover:scale-125 transition-transform duration-300 inline-block">🛒</span>
              {t("hero.cta2")}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat group flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-muted/60 backdrop-blur-md rounded-2xl border border-border hover:bg-muted hover:scale-105 transition-all duration-300 cursor-default">
                <span className="text-2xl md:text-3xl group-hover:scale-125 transition-transform duration-300">{s.emoji}</span>
                <div className="text-left">
                  <div className="text-foreground font-bold text-lg md:text-xl leading-tight">{s.value}</div>
                  <div className="text-muted-foreground text-[10px] md:text-xs font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
