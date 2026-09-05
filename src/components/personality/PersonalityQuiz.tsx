import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QUIZ, archetypeFor, profileFromAnswers } from "@/lib/personality";
import PersonalityResults from "./PersonalityResults";
import ShareButton from "@/components/ShareButton";
import { ArrowLeft, RotateCcw } from "lucide-react";
import gsap from "gsap";

const PersonalityQuiz = () => {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const done = step >= QUIZ.length;
  const question = QUIZ[step];
  const progress = Math.round((Math.min(step, QUIZ.length) / QUIZ.length) * 100);

  const profile = useMemo(() => profileFromAnswers(answers), [answers]);
  const archetype = useMemo(() => archetypeFor(profile), [profile]);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 16, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [step]);

  const answer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [question.key]: key }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  if (done) {
    return (
      <div>
        <div
          ref={cardRef}
          className="rounded-3xl border-2 border-border bg-card p-5 md:p-7 mb-6 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative">
            <span className="text-5xl md:text-6xl block mb-2">{archetype.emoji}</span>
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              {t("personality.quiz.resultLabel")}
            </p>
            <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
              {lang === "th" ? archetype.th : archetype.en}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              {lang === "th" ? archetype.descTh : archetype.descEn}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-foreground text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors border-2 border-border"
              >
                <RotateCcw className="w-4 h-4" />
                {t("personality.quiz.retake")}
              </button>
              <ShareButton title={lang === "th" ? archetype.th : archetype.en} />
            </div>
          </div>
        </div>

        <PersonalityResults profile={profile} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground mb-3 text-center">{t("personality.quiz.intro")}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5">
          <span>
            {t("personality.quiz.question")} {step + 1}/{QUIZ.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div ref={cardRef} className="rounded-3xl border-2 border-border bg-card p-5 md:p-7">
        <h2 className="font-display font-bold text-lg md:text-2xl text-foreground mb-4 text-center">
          {lang === "th" ? question.th : question.en}
        </h2>
        <div className="grid gap-2.5">
          {question.options.map((o) => (
            <button
              key={o.key}
              onClick={() => answer(o.key)}
              className="flex items-center gap-3 p-3 md:p-4 rounded-2xl border-2 border-border bg-muted/40 hover:border-primary hover:bg-primary/5 transition-all text-left active:scale-[0.99]"
            >
              <span className="text-2xl md:text-3xl shrink-0">{o.emoji}</span>
              <span className="font-semibold text-sm md:text-base text-foreground">
                {lang === "th" ? o.th : o.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("personality.quiz.back")}
        </button>
      )}
    </div>
  );
};

export default PersonalityQuiz;
