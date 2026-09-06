import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import PersonalityQuiz from "@/components/personality/PersonalityQuiz";
import PersonalityFilters from "@/components/personality/PersonalityFilters";
import Seo from "@/components/Seo";

const PersonalityPage = () => {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState("quiz");

  return (
    <div className="section-padding">
      <Seo
        title={lang === "th" ? "ค้นหาบุคลิกภาพต้นไม้ของคุณ | TreeKingdom" : "Find Your Plant Personality | TreeKingdom"}
        description={
          lang === "th"
            ? "ทำแบบทดสอบเพื่อค้นหาต้นไม้ที่เหมาะกับไลฟ์สไตล์ของคุณ"
            : "Take the quiz to find plants that match your lifestyle."
        }
      />
      <div className="container mx-auto">
        <div className="mb-5 md:mb-8">
          <h1 className="font-display font-bold text-2xl md:text-4xl text-foreground mb-1.5 flex items-center gap-2">
            <Leaf className="w-6 h-6 md:w-7 md:h-7 text-primary shrink-0" />
            {t("personality.title")}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t("personality.subtitle")}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
            <TabsList className="bg-muted rounded-full p-1 h-auto inline-flex w-max">
              <TabsTrigger
                value="quiz"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("personality.tab.quiz")}
              </TabsTrigger>
              <TabsTrigger
                value="filters"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("personality.tab.filters")}
              </TabsTrigger>
            </TabsList>
          </div>

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
