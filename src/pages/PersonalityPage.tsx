import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import PersonalityQuiz from "@/components/personality/PersonalityQuiz";
import PersonalityFilters from "@/components/personality/PersonalityFilters";
import Seo from "@/components/Seo";
import "./catalog.css";

const PersonalityPage = () => {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState("quiz");

  return (
    <div className="catalog-page">
      <Seo
        title={lang === "th" ? "ค้นหาบุคลิกภาพต้นไม้ของคุณ | TreeKingdom" : "Find Your Plant Personality | TreeKingdom"}
        description={
          lang === "th"
            ? "ทำแบบทดสอบเพื่อค้นหาต้นไม้ที่เหมาะกับไลฟ์สไตล์ของคุณ"
            : "Take the quiz to find plants that match your lifestyle."
        }
      />
      <div className="catalog-decoration catalog-decoration-left" aria-hidden="true" />
      <div className="catalog-decoration catalog-decoration-right" aria-hidden="true" />
      <div className="catalog-container">
        <header className="catalog-title-block">
          <span className="catalog-title-icon"><Leaf /></span>
          <div>
            <h1>{t("personality.title")}</h1>
            <p>{t("personality.subtitle")}</p>
          </div>
          <span className="catalog-handwriting" aria-hidden="true">ค้นหาต้นไม้<br />ที่ใช่<br />สำหรับคุณ</span>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="catalog-tabs">
            <TabsTrigger value="quiz">{t("personality.tab.quiz")}</TabsTrigger>
            <TabsTrigger value="filters">{t("personality.tab.filters")}</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="mt-5 md:mt-6">
            <PersonalityQuiz />
          </TabsContent>
          <TabsContent value="filters" className="mt-5 md:mt-6">
            <PersonalityFilters />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PersonalityPage;
