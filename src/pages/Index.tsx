import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Crown, Flame, Heart, Leaf, Search, Sprout } from "lucide-react";
import gsap from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlants, useCategoryInfo, useViewCounts } from "@/hooks/useCloudData";
import Seo from "@/components/Seo";
import ImageWithFallback from "@/components/ImageWithFallback";
import SectionViewAllLink from "@/components/SectionViewAllLink";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SOCIAL_PROFILES, absoluteUrl } from "@/lib/site";
import type { PlantCategory } from "@/data/plants";
import { varietyImages } from "@/data/varietyImages";
import "./home.css";

const categories: { key: PlantCategory; image: string; ext?: "png" | "svg" }[] = [
  { key: "tree", image: "category-tree" },
  { key: "flower", image: "category-flower" },
  { key: "foliage", image: "category-foliage" },
  { key: "cactus", image: "category-cactus" },
  { key: "water", image: "category-water" },
];

const Illustration = ({ name, ext = "png", className = "" }: { name: string; ext?: "png" | "svg"; className?: string }) => (
  <img className={className} src={`/images/${name}.${ext}`} alt="" loading="lazy" width={96} height={96} />
);

export default function Index() {
  const popularRef = useRef<HTMLElement>(null);
  const { lang, t } = useLanguage();
  const th = lang === "th";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openTip, setOpenTip] = useState<number | null>(null);
  const { data, isPending, isError, refetch } = usePlants();
  const { data: views } = useViewCounts();
  const categoryInfo = useCategoryInfo();
  const plants = data?.plants ?? [];
  const featured = plants.slice(0, 5);
  // The plant's own most-viewed variety, if anyone has actually opened one.
  // Top-level only: a mutation form has no page of its own, so VarietySection
  // would never expand a link pointing at one. Zero views means no winner to
  // name, rather than an arbitrary first variety.
  const topVarietyOf = (plant: typeof plants[number]) =>
    (plant.varieties ?? [])
      .filter(v => !v.parentId)
      .map(v => ({
        variety: v,
        views: views?.[`variety:${v.id}`] ?? 0,
        // Gallery first, then the single image, then the bundled fallback —
        // the same order VarietySection resolves its own thumbnails in.
        thumb: (v.images ?? []).find(src => src && src.trim() !== "") ?? v.image ?? varietyImages[v.id],
      }))
      .filter(v => v.views > 0)
      .sort((a, b) => b.views - a.views)[0];

  const popular = plants
    .map(plant => ({ plant, views: views?.[`plant:${plant.id}`] ?? 0, topVariety: topVarietyOf(plant) }))
    .filter(p => p.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
  useEffect(() => {
    if (!popular.length || !popularRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".home-popular-leaf").forEach((leaf, index) => {
        const direction = index % 2 ? 1 : -1;
        gsap.set(leaf, { transformOrigin: "50% 70%" });
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.18 })
          .to(leaf, {
            x: direction * (18 + index * 2),
            y: index % 3 === 0 ? -24 : 18 + index,
            rotation: direction * (13 + index * 1.5),
            scale: index % 2 ? 1.08 : .94,
            duration: 2.4 + index * .22,
            ease: "sine.inOut",
          })
          .to(leaf, {
            x: direction * -10,
            y: index % 2 ? -14 : 12,
            rotation: direction * -8,
            scale: 1,
            duration: 2 + index * .16,
            ease: "sine.inOut",
          });
      });
    }, popularRef);
    return () => context.revert();
  }, [popular.length]);
  const label = (key: string) => th ? categoryInfo[key]?.th : categoryInfo[key]?.en;
  const formatInterest = (count: number) => count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`
    : count.toLocaleString(th ? "th-TH" : "en-US");

  const tips = [
    { image: "care-light", title: th ? "แสงที่เหมาะสม" : "The right light", description: th ? "เลือกปริมาณแสงให้เหมาะกับแต่ละชนิด" : "Find the right light for each plant", detail: th ? "สังเกตแสงในบริเวณที่ปลูก และเลือกตำแหน่งตามความต้องการของพรรณไม้ ดูรายละเอียดแสงที่เหมาะสมได้ในหน้าพรรณไม้แต่ละชนิด" : "Observe the light in your space and match it to your plant. Check each plant’s care guide for its specific light requirements." },
    { image: "care-water", title: th ? "รดน้ำพอดี" : "Water wisely", description: th ? "รดน้ำอย่างเข้าใจ ให้รากเติบโตแข็งแรง" : "Keep roots healthy with thoughtful watering", detail: th ? "ตรวจความชื้นของดินก่อนรดน้ำ เลือกกระถางที่ระบายน้ำได้ดี และปรับความถี่ตามชนิดต้นไม้และสภาพอากาศ" : "Check soil moisture before watering, use a well-draining pot, and adjust watering to the plant and weather." },
    { image: "care-nutrients", title: th ? "ดูแลธาตุอาหาร" : "Nourish your plants", description: th ? "ปุ๋ยและอาหารเสริมที่เหมาะสม" : "Choose suitable nutrients and fertilizer", detail: th ? "เลือกปุ๋ยให้เหมาะกับชนิดพืช ใช้ตามคำแนะนำบนฉลาก และหลีกเลี่ยงการให้ปุ๋ยมากเกินไป" : "Choose a fertilizer suited to your plant, follow the label, and avoid overfeeding." },
    { image: "care-pruning", title: th ? "ตัดแต่งกิ่ง" : "Prune with care", description: th ? "ช่วยให้ต้นไม้แข็งแรงและสวยงาม" : "Encourage healthy, beautiful growth", detail: th ? "ใช้กรรไกรที่สะอาด ตัดใบแห้งและกิ่งที่เสียหาย และศึกษาช่วงเวลาตัดแต่งที่เหมาะกับพรรณไม้แต่ละชนิด" : "Use clean shears, remove dry leaves and damaged stems, and check the right pruning season for your plant." },
  ];
  const allLink = (to: string, text: string) => <Link className="home-outline" to={to}>{text}<ArrowRight size={15} /></Link>;
  return <div className="home-page">
    <Seo title={SITE_TITLE[lang]} description={SITE_DESCRIPTION[lang]} jsonLd={[
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: ["th", "en"] },
      { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: absoluteUrl("/logo.svg"), sameAs: [...SOCIAL_PROFILES] },
    ]} />
    <section className="home-hero">
      <div className="home-wrap home-hero-grid">
        <div className="home-hero-copy">
          <h1>{th ? "โลกของพรรณไม้" : "A world of plants"}<br /><span>{th ? "เริ่มต้นได้ที่นี่" : "starts right here."}</span></h1>
          <p className="home-intro">{th ? <>ค้นพบพรรณไม้หลากหลายสายพันธุ์ พร้อมวิธีดูแล<br className="desktop-break" />และแรงบันดาลใจสำหรับคนรักต้นไม้</> : "Discover wonderful plants, practical care guides, and inspiration for a greener life."}</p>
          <div className="home-benefits"><span><Leaf />{th ? "ข้อมูลครบถ้วน" : "Plant knowledge"}</span><span><BookOpen />{th ? "วิธีดูแลละเอียด" : "Care guides"}</span><span><Heart />{th ? "เหมาะสำหรับทุกคน" : "For everyone"}</span></div>
          <form className="home-search" role="search" onSubmit={e => { e.preventDefault(); navigate(`/plants${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`); }}>
            <Search size={24} /><input aria-label={th ? "ค้นหาพรรณไม้" : "Search plants"} placeholder={th ? "ค้นหาพรรณไม้ หรือคำที่คุณสนใจ..." : "Search for your next favorite plant..."} value={search} onChange={e => setSearch(e.target.value)} /><button aria-label={th ? "ค้นหา" : "Search"}><ArrowRight /></button>
          </form>
          <div className="home-tags">{["flower", "foliage", "herb", "cactus", "water"].map(key => <Link key={key} to={`/plants?cat=${key}`}># {label(key)}</Link>)}</div>
        </div>
        <div className="home-hero-visual">
          <img className="home-hero-backdrop" src="/images/hero-botanical-backdrop.svg" alt="" aria-hidden="true" />
          <img className="home-hero-art" src="/images/home-hero-supplied.png" alt={th ? "ภาพวาดมอนสเตอร่าในกระถางกับหนังสือสีเขียว" : "Illustrated monstera plant with green books"} width={1254} height={1254} fetchPriority="high" />
          <div className="home-hero-motto" aria-hidden="true">More<br />Plants<br />Happier<br />People<Leaf /></div>
        </div>
      </div>
    </section>
    <section className="home-featured home-section" id="featured">
      <div className="home-wrap">
        <div className="home-heading"><div className="home-heading-copy"><Illustration name="category-foliage" className="home-heading-art" /><div><h2>{th ? "พรรณไม้แนะนำ" : "Meet your next plant"}</h2><p>{th ? "ต้นไม้ที่คัดมาเพื่อคุณ" : "A little inspiration for your growing collection"}</p></div></div><SectionViewAllLink to="/plants" /></div>
        {isPending && <p role="status">{th ? "กำลังโหลดพรรณไม้..." : "Loading plants..."}</p>}
        {isError && <p role="alert">{th ? "โหลดข้อมูลไม่สำเร็จ " : "Unable to load plants. "}<button onClick={() => refetch()}>{th ? "ลองอีกครั้ง" : "Try again"}</button></p>}
        {!isPending && !isError && featured.length === 0 && <p>{th ? "ยังไม่มีพรรณไม้ในรายการนี้" : "No plants in this collection yet."}</p>}
        <div className="home-plant-grid">{featured.map(plant => <article className="home-plant" key={plant.id}>
          <Link to={`/plants/${plant.id}`} state={{ from: "/" }}><ImageWithFallback src={data?.images[plant.id]?.[0]} alt={plant.name[lang]} loading="lazy" className="home-plant-image" /></Link>
          <div className="home-plant-body"><div className="home-plant-title"><Link to={`/plants/${plant.id}`} state={{ from: "/" }}><h3>{plant.name[lang]}</h3></Link></div><p>{plant.description[lang]}</p><Link className="home-badge" to={`/plants?cat=${plant.category}`}>{label(plant.category)}</Link></div>
        </article>)}</div>
      </div>
    </section>
    {popular.length > 0 && (
      <section ref={popularRef} className="home-popular home-section" aria-labelledby="home-popular-title">
        <div className="home-popular-leaves" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => <span className={`home-popular-leaf home-popular-leaf-${index + 1}`} key={index} />)}
        </div>
        <div className="home-wrap">
          <div className="home-heading">
            <div className="home-heading-copy">
              <Illustration name="heading-trophy" className="home-heading-art" />
              <div>
                <h2 id="home-popular-title">{th ? "ยอดนิยมตอนนี้" : "Popular right now"}</h2>
                <p>{th ? "พรรณไม้ที่กำลังได้รับความสนใจสูงสุด" : "The plants attracting the most interest"}</p>
              </div>
            </div>
            <SectionViewAllLink to="/plants?sort=popular" />
          </div>
          <ol className="home-ranking">
            {popular.map(({ plant, views: count, topVariety }, index) => (
              <li className={`home-ranking-card home-ranking-card-${index + 1}`} key={plant.id}>
                {index === 0 && <Crown className="home-ranking-crown" aria-hidden="true" />}
                <span className="home-ranking-ribbon">
                  {index === 0
                    ? (th ? "ยอดนิยมอันดับ 1" : "No. 1 most popular")
                    : (th ? `อันดับ ${index + 1}` : `Rank ${index + 1}`)}
                </span>
                {/* Not a single wrapping <Link> any more: the variety below is
                    its own link, and an anchor inside an anchor is invalid
                    HTML. The plant link stretches over the whole card via
                    ::after instead, and the variety link sits above it. */}
                <div className="home-ranking-card-inner">
                  <ImageWithFallback className="home-ranking-image" src={data?.images[plant.id]?.[0]} alt={plant.name[lang]} loading="lazy" />
                  <span className="home-ranking-content">
                    <b>
                      <Link
                        className="home-ranking-link"
                        to={`/plants/${plant.id}`}
                        state={{ from: "/" }}
                        title={plant.name[lang]}
                        aria-label={`${plant.name[lang]}, ${th ? "อันดับ" : "rank"} ${index + 1}`}
                      >
                        {plant.name[lang]}
                      </Link>
                    </b>
                    <small>{label(plant.category)}</small>
                    {topVariety && (
                      <Link
                        className="home-ranking-variety"
                        to={`/plants/${plant.id}?variety=${topVariety.variety.id}`}
                        state={{ from: "/" }}
                      >
                        <ImageWithFallback
                          className="home-ranking-variety-image"
                          src={topVariety.thumb}
                          alt={topVariety.variety.name[lang]}
                          loading="lazy"
                        />
                        <span className="home-ranking-variety-text">
                          <span className="home-ranking-variety-label">
                            <Sprout aria-hidden="true" />
                            {t("popular.topVariety")}
                          </span>
                          <b title={topVariety.variety.name[lang]}>{topVariety.variety.name[lang]}</b>
                        </span>
                        <span className="home-ranking-variety-count">
                          <Flame aria-hidden="true" />
                          {formatInterest(topVariety.views)}
                        </span>
                      </Link>
                    )}
                    <span className="home-ranking-interest"><Flame aria-hidden="true" />{formatInterest(count)} {th ? "คนสนใจ" : "interested"}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )}
    <section className="home-section home-care" id="care"><div className="home-wrap"><div className="home-heading"><div className="home-heading-copy"><Illustration name="heading-bulb" className="home-heading-art" /><div><h2>{th ? "เคล็ดลับการดูแล" : "A little care goes a long way"}</h2><p>{th ? "ดูแลต้นไม้ให้สวยและอยู่กับเราได้นาน" : "Help your plants thrive, one day at a time"}</p></div></div><SectionViewAllLink to="/plants" /></div><div className="home-tip-grid">{tips.map((tip, i) => <button className="home-tip" key={tip.title} onClick={() => setOpenTip(openTip === i ? null : i)} aria-expanded={openTip === i} aria-controls="home-tip-detail"><Illustration name={tip.image} className="home-infographic" /><h3>{tip.title}</h3><p>{tip.description}</p></button>)}</div>{openTip !== null && <div className="home-tip-detail" id="home-tip-detail"><h3>{tips[openTip].title}</h3><p>{tips[openTip].detail}</p></div>}</div></section>
    <section className="home-section home-categories"><div className="home-wrap"><div className="home-heading"><div className="home-heading-copy"><Illustration name="category-foliage" className="home-heading-art" /><div><h2>{th ? "หมวดหมู่พรรณไม้" : "Find your kind of green"}</h2><p>{th ? "สำรวจพรรณไม้ตามประเภทที่คุณสนใจ" : "Explore the plants that speak to you"}</p></div></div><SectionViewAllLink to="/plants" /></div><div className="home-category-grid">{categories.map(({ key, image, ext }) => <Link className="home-category" key={key} to={`/plants?cat=${key}`}><span className={`home-category-icon home-category-icon-${key}`}><Illustration name={image} ext={ext} className="home-infographic" /></span><h3>{label(key)}</h3><span className="home-badge">{plants.filter(p => p.category === key).length} {th ? "ชนิด" : "species"}</span></Link>)}</div></div></section>
    <section className="home-wrap home-cta-wrap"><div className="home-cta"><div className="home-cta-copy"><span>TreeKingdom</span><h2>{th ? "เริ่มต้นปลูกต้นไม้กันเถอะ!" : "Let’s grow something wonderful!"}</h2><p>{th ? "ค้นพบแรงบันดาลใจใหม่ ๆ และร่วมเป็นส่วนหนึ่งของชุมชนคนรักต้นไม้" : "Find fresh inspiration and your own little corner of green."}</p><div className="home-cta-actions">{allLink("/plants", th ? "สำรวจพรรณไม้" : "Explore plants")}{allLink("/personality", th ? "ค้นหาต้นไม้ที่ใช่" : "Find your plant match")}</div></div><img className="home-cta-backdrop" src="/images/footer-botanical-backdrop.svg" alt="" aria-hidden="true" />
      <img className="home-cta-leaves" src="/images/footer-floating-leaves.svg" alt="" aria-hidden="true" />
      <img className="home-footer-plant" src="/images/footer-plant-supplied.png" alt="" loading="lazy" width={1254} height={1254} />
      <span className="home-cta-motto" aria-hidden="true">Small<br />Plants<br />Big<br />Happiness<Heart /></span></div></section>
  </div>;
}
