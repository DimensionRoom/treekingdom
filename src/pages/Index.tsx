import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronRight, Heart, Leaf, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlants, useCategoryInfo, useViewCounts } from "@/hooks/useCloudData";
import Seo from "@/components/Seo";
import ImageWithFallback from "@/components/ImageWithFallback";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import type { PlantCategory } from "@/data/plants";
import "./home.css";

// "water" points at its own category-water.svg rather than reusing
// care-water.png — that PNG is the "watering tip" illustration (a potted
// plant with droplets), a different idea from "plants that grow in water"
// and duplicating it across both slots read as a mistake.
const categories: { key: PlantCategory; image: string; ext?: "png" | "svg" }[] = [
  { key: "tree", image: "category-tree" },
  { key: "flower", image: "category-flower" },
  { key: "foliage", image: "category-foliage" },
  { key: "cactus", image: "category-cactus" },
  { key: "water", image: "category-water", ext: "svg" },
];

const Illustration = ({ name, ext = "png", className = "" }: { name: string; ext?: "png" | "svg"; className?: string }) => (
  <img className={className} src={`/images/${name}.${ext}`} alt="" loading="lazy" width={96} height={96} />
);

export default function Index() {
  const { lang } = useLanguage();
  const th = lang === "th";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [openTip, setOpenTip] = useState<number | null>(null);
  const { data, isPending, isError, refetch } = usePlants();
  const { data: views } = useViewCounts();
  const categoryInfo = useCategoryInfo();
  const plants = data?.plants ?? [];
  const featured = onlyFavorites ? plants.filter(p => favorites.includes(p.id)) : plants.slice(0, 5);
  const popular = plants.map(plant => ({ plant, views: views?.[`plant:${plant.id}`] ?? 0 })).filter(p => p.views > 0).sort((a, b) => b.views - a.views).slice(0, 3);
  const label = (key: string) => th ? categoryInfo[key]?.th : categoryInfo[key]?.en;
  const tips = [
    { image: "care-light", title: th ? "แสงที่เหมาะสม" : "The right light", description: th ? "เลือกปริมาณแสงให้เหมาะกับแต่ละชนิด" : "Find the right light for each plant", detail: th ? "สังเกตแสงในบริเวณที่ปลูก และเลือกตำแหน่งตามความต้องการของพรรณไม้ ดูรายละเอียดแสงที่เหมาะสมได้ในหน้าพรรณไม้แต่ละชนิด" : "Observe the light in your space and match it to your plant. Check each plant’s care guide for its specific light requirements." },
    { image: "care-water", title: th ? "รดน้ำพอดี" : "Water wisely", description: th ? "รดน้ำอย่างเข้าใจ ให้รากเติบโตแข็งแรง" : "Keep roots healthy with thoughtful watering", detail: th ? "ตรวจความชื้นของดินก่อนรดน้ำ เลือกกระถางที่ระบายน้ำได้ดี และปรับความถี่ตามชนิดต้นไม้และสภาพอากาศ" : "Check soil moisture before watering, use a well-draining pot, and adjust watering to the plant and weather." },
    { image: "care-nutrients", title: th ? "ดูแลธาตุอาหาร" : "Nourish your plants", description: th ? "ปุ๋ยและอาหารเสริมที่เหมาะสม" : "Choose suitable nutrients and fertilizer", detail: th ? "เลือกปุ๋ยให้เหมาะกับชนิดพืช ใช้ตามคำแนะนำบนฉลาก และหลีกเลี่ยงการให้ปุ๋ยมากเกินไป" : "Choose a fertilizer suited to your plant, follow the label, and avoid overfeeding." },
    { image: "care-pruning", title: th ? "ตัดแต่งกิ่ง" : "Prune with care", description: th ? "ช่วยให้ต้นไม้แข็งแรงและสวยงาม" : "Encourage healthy, beautiful growth", detail: th ? "ใช้กรรไกรที่สะอาด ตัดใบแห้งและกิ่งที่เสียหาย และศึกษาช่วงเวลาตัดแต่งที่เหมาะกับพรรณไม้แต่ละชนิด" : "Use clean shears, remove dry leaves and damaged stems, and check the right pruning season for your plant." },
  ];
  const allLink = (to: string, text: string) => <Link className="home-outline" to={to}>{text}<ArrowRight size={15} /></Link>;
  return <div className="home-page">
    <Seo title={SITE_TITLE[lang]} description={SITE_DESCRIPTION[lang]} jsonLd={[{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL }]} />
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
        <div className="home-heading"><div className="home-heading-copy"><Illustration name="category-foliage" className="home-heading-art" /><div><h2>{th ? "พรรณไม้แนะนำ" : "Meet your next plant"}</h2><p>{th ? "ต้นไม้ยอดนิยมที่คัดมาเพื่อคุณ" : "A little inspiration for your growing collection"}</p></div></div>{allLink("/plants", th ? "ดูพรรณไม้ทั้งหมด" : "Explore all plants")}</div>
        {(favorites.length > 0 || onlyFavorites) && <button className="home-favorites-filter" onClick={() => setOnlyFavorites(!onlyFavorites)} aria-pressed={onlyFavorites}><Heart size={16} />{onlyFavorites ? (th ? "แสดงพรรณไม้แนะนำ" : "Show featured plants") : (th ? `รายการที่ถูกใจ (${favorites.length})` : `Your favorites (${favorites.length})`)}</button>}
        {isPending && <p role="status">{th ? "กำลังโหลดพรรณไม้..." : "Loading plants..."}</p>}
        {isError && <p role="alert">{th ? "โหลดข้อมูลไม่สำเร็จ " : "Unable to load plants. "}<button onClick={() => refetch()}>{th ? "ลองอีกครั้ง" : "Try again"}</button></p>}
        {!isPending && !isError && featured.length === 0 && <p>{th ? "ยังไม่มีพรรณไม้ในรายการนี้" : "No plants in this collection yet."}</p>}
        <div className="home-plant-grid">{featured.map(plant => <article className="home-plant" key={plant.id}>
          <Link to={`/plants/${plant.id}`} state={{ from: "/" }}><ImageWithFallback src={data?.images[plant.id]?.[0]} alt={plant.name[lang]} loading="lazy" className="home-plant-image" /></Link>
          <div className="home-plant-body"><div className="home-plant-title"><Link to={`/plants/${plant.id}`} state={{ from: "/" }}><h3>{plant.name[lang]}</h3></Link><button aria-label={`${th ? "ถูกใจ" : "Favorite"} ${plant.name[lang]}`} aria-pressed={favorites.includes(plant.id)} onClick={() => setFavorites(prev => prev.includes(plant.id) ? prev.filter(id => id !== plant.id) : [...prev, plant.id])}><Heart size={18} fill={favorites.includes(plant.id) ? "currentColor" : "none"} /></button></div><p>{plant.description[lang]}</p><Link className="home-badge" to={`/plants?cat=${plant.category}`}>{label(plant.category)}</Link></div>
        </article>)}</div>
      </div>
    </section>
    {popular.length > 0 && <section className="home-popular home-section"><div className="home-wrap"><div className="home-heading"><div className="home-heading-copy"><Illustration name="heading-trophy" className="home-heading-art" /><div><h2>{th ? "ยอดนิยมตอนนี้" : "Popular right now"}</h2><p>{th ? "พรรณไม้ที่มีผู้เข้าชมมากที่สุด" : "The plants our community loves exploring"}</p></div></div>{allLink("/plants?sort=popular", th ? "ดูอันดับทั้งหมด" : "See all plants")}</div><ol className="home-ranking">{popular.map(({ plant }, i) => <li key={plant.id}><Link to={`/plants/${plant.id}`} state={{ from: "/" }}><strong className={`home-rank home-rank-${i}`}>{i + 1}</strong><ImageWithFallback src={data?.images[plant.id]?.[0]} alt={plant.name[lang]} loading="lazy" /><span><b>{plant.name[lang]}</b><small>{label(plant.category)}</small></span><ChevronRight size={18} /></Link></li>)}</ol></div></section>}
    <section className="home-section home-care" id="care"><div className="home-wrap"><div className="home-heading"><div className="home-heading-copy"><Illustration name="heading-bulb" className="home-heading-art" /><div><h2>{th ? "เคล็ดลับการดูแล" : "A little care goes a long way"}</h2><p>{th ? "ดูแลต้นไม้ให้สวยและอยู่กับเราได้นาน" : "Help your plants thrive, one day at a time"}</p></div></div>{allLink("/plants", th ? "ดูวิธีดูแลแต่ละชนิด" : "Explore care guides")}</div><div className="home-tip-grid">{tips.map((tip, i) => <button className="home-tip" key={tip.title} onClick={() => setOpenTip(openTip === i ? null : i)} aria-expanded={openTip === i} aria-controls="home-tip-detail"><Illustration name={tip.image} className="home-infographic" /><h3>{tip.title}</h3><p>{tip.description}</p></button>)}</div>{openTip !== null && <div className="home-tip-detail" id="home-tip-detail"><h3>{tips[openTip].title}</h3><p>{tips[openTip].detail}</p></div>}</div></section>
    <section className="home-section home-categories"><div className="home-wrap"><div className="home-heading"><div className="home-heading-copy"><Illustration name="category-foliage" className="home-heading-art" /><div><h2>{th ? "หมวดหมู่พรรณไม้" : "Find your kind of green"}</h2><p>{th ? "สำรวจพรรณไม้ตามประเภทที่คุณสนใจ" : "Explore the plants that speak to you"}</p></div></div>{allLink("/plants", th ? "ดูหมวดหมู่ทั้งหมด" : "All categories")}</div><div className="home-category-grid">{categories.map(({ key, image, ext }) => <Link className="home-category" key={key} to={`/plants?cat=${key}`}><span className={`home-category-icon home-category-icon-${key}`}><Illustration name={image} ext={ext} className="home-infographic" /></span><h3>{label(key)}</h3><span className="home-badge">{plants.filter(p => p.category === key).length} {th ? "ชนิด" : "species"}</span></Link>)}</div></div></section>
    <section className="home-wrap home-cta-wrap"><div className="home-cta"><div className="home-cta-copy"><span>TreeKingdom</span><h2>{th ? "เริ่มต้นปลูกต้นไม้กันเถอะ!" : "Let’s grow something wonderful!"}</h2><p>{th ? "ค้นพบแรงบันดาลใจใหม่ๆ และร่วมเป็นส่วนหนึ่งของชุมชนคนรักต้นไม้" : "Find fresh inspiration and your own little corner of green."}</p><div className="home-cta-actions">{allLink("/plants", th ? "สำรวจพรรณไม้" : "Explore plants")}{allLink("/personality", th ? "ค้นหาต้นไม้ที่ใช่" : "Find your plant match")}</div></div><img className="home-cta-backdrop" src="/images/footer-botanical-backdrop.svg" alt="" aria-hidden="true" />
      <img className="home-cta-leaves" src="/images/footer-floating-leaves.svg" alt="" aria-hidden="true" />
      <img className="home-footer-plant" src="/images/footer-plant-supplied.png" alt="" loading="lazy" width={1254} height={1254} />
      <span className="home-cta-motto" aria-hidden="true">Small<br />Plants<br />Big<br />Happiness<Heart /></span></div></section>
  </div>;
}
