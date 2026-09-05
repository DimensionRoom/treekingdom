import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import LuckyList from "@/components/lucky/LuckyList";
import LuckyMatch from "@/components/lucky/LuckyMatch";
import LuckyDaily from "@/components/lucky/LuckyDaily";
import LuckyOccasions from "@/components/lucky/LuckyOccasions";

const LuckyPage = () => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState("list");

  return (
    <div className="section-padding">
      <div className="container mx-auto">
        <div className="mb-5 md:mb-8">
          <h1 className="font-display font-bold text-2xl md:text-4xl text-foreground mb-1.5 flex items-center gap-2">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-accent shrink-0" />
            {lang === "th" ? "ไม้มงคล" : "Lucky Plants"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {lang === "th"
              ? "เลือกต้นไม้มงคลตามดวง เสริมพลังและความเป็นสิริมงคลให้กับชีวิต"
              : "Choose lucky plants by your destiny — boost positive energy in your life"}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
            <TabsList className="bg-muted rounded-full p-1 h-auto inline-flex w-max">
              <TabsTrigger
                value="list"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {lang === "th" ? "ไม้มงคลทั้งหมด" : "All Lucky Plants"}
              </TabsTrigger>
              <TabsTrigger
                value="match"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {lang === "th" ? "จับคู่ดวง" : "Match by Destiny"}
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {lang === "th" ? "ดวงรายวัน" : "Daily Fortune"}
              </TabsTrigger>
              <TabsTrigger
                value="occasions"
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {lang === "th" ? "ตามโอกาส" : "By Occasion"}
              </TabsTrigger>
            </TabsList>
          </div>

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
