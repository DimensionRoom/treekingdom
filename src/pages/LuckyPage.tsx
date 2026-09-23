import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import LuckyList from "@/components/lucky/LuckyList";
import LuckyMatch from "@/components/lucky/LuckyMatch";
import LuckyDaily from "@/components/lucky/LuckyDaily";
import LuckyOccasions from "@/components/lucky/LuckyOccasions";
import Seo from "@/components/Seo";
import "./catalog.css";

const LuckyPage = () => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState("list");

  return (
    <div className="catalog-page">
      <Seo
        title={lang === "th" ? "ไม้มงคล | TreeKingdom" : "Lucky Plants | TreeKingdom"}
        description={
          lang === "th"
            ? "เลือกต้นไม้มงคลตามดวง เสริมพลังและความเป็นสิริมงคลให้กับชีวิต"
            : "Choose lucky plants by your destiny — boost positive energy in your life."
        }
      />
      <div className="catalog-decoration catalog-decoration-left" aria-hidden="true" />
      <div className="catalog-decoration catalog-decoration-right" aria-hidden="true" />
      <div className="catalog-container">
        <header className="catalog-title-block">
          <span className="catalog-title-icon"><Sparkles /></span>
          <div>
            <h1>{lang === "th" ? "ไม้มงคล" : "Lucky Plants"}</h1>
            <p>
              {lang === "th"
                ? "เลือกต้นไม้มงคลตามดวง เสริมพลังและความเป็นสิริมงคลให้กับชีวิต"
                : "Choose lucky plants by your destiny — boost positive energy in your life"}
            </p>
          </div>
          <span className="catalog-handwriting" aria-hidden="true">เสริมดวง<br />ให้ชีวิต<br />สดใส</span>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="catalog-tabs">
            <TabsTrigger value="list">{lang === "th" ? "ไม้มงคลทั้งหมด" : "All Lucky Plants"}</TabsTrigger>
            <TabsTrigger value="match">{lang === "th" ? "จับคู่ดวง" : "Match by Destiny"}</TabsTrigger>
            <TabsTrigger value="daily">{lang === "th" ? "ดวงรายวัน" : "Daily Fortune"}</TabsTrigger>
            <TabsTrigger value="occasions">{lang === "th" ? "ตามโอกาส" : "By Occasion"}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-5 md:mt-6">
            <LuckyList />
          </TabsContent>
          <TabsContent value="match" className="mt-5 md:mt-6">
            <LuckyMatch />
          </TabsContent>
          <TabsContent value="daily" className="mt-5 md:mt-6">
            <LuckyDaily />
          </TabsContent>
          <TabsContent value="occasions" className="mt-5 md:mt-6">
            <LuckyOccasions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LuckyPage;
