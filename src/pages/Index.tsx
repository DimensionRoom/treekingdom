import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import PlantCard from "@/components/PlantCard";
import { allCategories } from "@/data/plants";
import { usePlants, useCategoryInfo } from "@/hooks/useCloudData";
import { ArrowRight, Droplets, Sun, Thermometer, Leaf } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = usePlants();
  const plants = data?.plants ?? [];
  const categoryInfo = useCategoryInfo();

  const featuredPlants = plants.slice(0, 4);

  const tips = [
    { icon: <Sun className="w-7 h-7" />, emoji: "☀️", title: lang === "th" ? "แสงที่เหมาะสม" : "Right Light", desc: lang === "th" ? "เลือกตำแหน่งที่มีแสงเหมาะกับชนิดพืช" : "Place plants where they get the right amount of light", color: "from-accent/20 to-accent/5" },
    { icon: <Droplets className="w-7 h-7" />, emoji: "💧", title: lang === "th" ? "รดน้ำพอดี" : "Water Wisely", desc: lang === "th" ? "รดน้ำตามความต้องการของต้นไม้แต่ละชนิด" : "Water according to each plant's specific needs", color: "from-primary/20 to-primary/5" },
    { icon: <Thermometer className="w-7 h-7" />, emoji: "🌡️", title: lang === "th" ? "อุณหภูมิเหมาะสม" : "Temperature", desc: lang === "th" ? "รักษาอุณหภูมิให้เหมาะกับพืชแต่ละประเภท" : "Maintain optimal temperature for each plant type", color: "from-secondary/20 to-secondary/5" },
  ];

  useEffect(() => {
    const scroller = document.querySelector("main");
    if (!containerRef.current || !scroller) return;

    const elements = containerRef.current.querySelectorAll(".anim-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("anim-visible");
            observer.unobserve(el);
          }
        });
      },
      { root: scroller, threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <HeroSection />

      {/* Featured plants */}
      <section className="section-padding relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 cute-blob -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 cute-blob -z-10" />

        <div className="container mx-auto">
          <div className="anim-item text-center mb-8 md:mb-14">
            <h2 className="font-display font-bold text-2xl md:text-5xl text-foreground mb-3 md:mb-4">
              🌟 {t("featured")}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-lg">{t("featured.sub")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7">
            {featuredPlants.map((plant, i) => (
              <div key={plant.id} className="anim-item" data-delay={i * 120}>
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-14 anim-item" data-delay="200">
            <Link
              to="/plants"
              className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cute-shadow group text-base md:text-lg"
            >
              <Leaf className="w-5 h-5" />
              {t("nav.plants")} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="section-padding bg-gradient-to-b from-muted/50 via-muted/30 to-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto">
          <div className="anim-item text-center mb-8 md:mb-14">
            <h2 className="font-display font-bold text-2xl md:text-5xl text-foreground mb-3 md:mb-4">
              💡 {lang === "th" ? "เคล็ดลับการดูแล" : "Quick Care Tips"}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-lg">
              {lang === "th" ? "พื้นฐานที่ต้องรู้ก่อนเริ่มปลูกต้นไม้" : "Essential basics before you start gardening"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {tips.map((tip, i) => (
              <div key={i} className={`anim-item relative bg-card rounded-2xl md:rounded-3xl border-2 border-border p-5 md:p-8 text-center card-hover group overflow-hidden`} data-delay={i * 150}>
                <div className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative flex sm:block items-center gap-4 text-left sm:text-center">
                  <div className="shrink-0 flex sm:block items-center gap-3">
                    
                    <div className="w-11 h-11 sm:w-14 sm:h-14 sm:mx-auto sm:mb-5 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 hidden sm:flex">
                      {tip.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base md:text-xl text-card-foreground mb-1 md:mb-3">{tip.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="section-padding relative">
        <div className="absolute top-20 left-10 w-56 h-56 bg-accent/5 cute-blob -z-10 animate-leaf-sway" />

        <div className="container mx-auto">
          <div className="anim-item text-center mb-8 md:mb-14">
            <h2 className="font-display font-bold text-2xl md:text-5xl text-foreground mb-3 md:mb-4">
              {t("categories.title")}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-lg">{t("categories.sub")}</p>
          </div>

          <div className="anim-item relative px-4 md:px-12">
            <Carousel
              opts={{ align: "start", loop: true, dragFree: true }}
              plugins={[
                AutoScroll({
                  speed: 2.5,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {allCategories.map((cat) => {
                  const info = categoryInfo[cat];
                  const count = plants.filter((p) => p.category === cat).length;
                  return (
                    <CarouselItem key={cat} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Link
                        to={`/plants?cat=${cat}`}
                        className="block bg-card rounded-2xl md:rounded-3xl border-2 border-border p-4 md:p-8 text-center transition-all duration-300 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)] hover:rotate-[0.5deg] group relative overflow-hidden h-full"
                      >
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-[2.5] transition-transform duration-700" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/5 rounded-full group-hover:scale-[2] transition-transform duration-500" />
                        <div className="relative">
                          <div className="text-4xl md:text-5xl mb-3 md:mb-5 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-300 inline-block drop-shadow-sm">
                            {info.emoji}
                          </div>
                          <h3 className="font-display font-bold text-sm md:text-base text-card-foreground mb-2 md:mb-3">
                            {lang === "th" ? info.th : info.en}
                          </h3>
                          {count > 0 && (
                            <p className="text-muted-foreground text-xs md:text-sm bg-muted px-3 py-1.5 md:px-4 md:py-2 rounded-full inline-block font-medium">
                              {count} {lang === "th" ? "ชนิด" : "species"}
                            </p>
                          )}
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="anim-item relative overflow-hidden rounded-2xl md:rounded-[2rem] hero-gradient p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(var(--primary-foreground)/0.05),transparent)]" />
            <div className="absolute top-4 left-8 w-20 h-20 bg-primary-foreground/10 cute-blob animate-float" />
            <div className="absolute bottom-4 right-8 w-16 h-16 bg-primary-foreground/10 cute-blob animate-leaf-sway" />
            <div className="relative">
              <h2 className="font-display font-bold text-2xl md:text-4xl text-primary-foreground mb-3 md:mb-4">
                {lang === "th" ? "🌱 เริ่มต้นปลูกต้นไม้กันเถอะ!" : "🌱 Start Your Plant Journey!"}
              </h2>
              <p className="text-primary-foreground/70 text-sm md:text-lg mb-6 md:mb-8 max-w-lg mx-auto">
                {lang === "th" ? "สำรวจพรรณไม้หลากหลายสายพันธุ์และอุปกรณ์จัดสวนครบครัน" : "Explore a diverse collection of plants and gardening supplies"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/plants"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-card text-primary font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all"
                >
                  🌿 {t("hero.cta")}
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-primary-foreground/40 text-primary-foreground font-bold rounded-full hover:bg-primary-foreground/10 transition-all"
                >
                  📦 {t("hero.cta2")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
