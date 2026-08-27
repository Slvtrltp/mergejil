"use client";

import React, { useState } from "react";
import { skillsQuestions, SKILLS_CATEGORIES } from "./assessmentData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SkillsModule({
  onComplete,
}: {
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const question = skillsQuestions[currentIndex];
  const isAnswered = question ? !!answers[question.id] : false;
  const currentCat = question ? SKILLS_CATEGORIES.find((c) => c.key === question.category) : undefined;

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentIndex < skillsQuestions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 350);
  };

  const getSkillScore = (catKey: string) => {
    const catQs = skillsQuestions.filter((q) => q.category === catKey);
    const answered = catQs.filter((q) => answers[q.id]);
    const total = answered.reduce((sum, q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return sum + (opt?.value || 0);
    }, 0);
    const max = catQs.length * 3;
    return max > 0 ? Math.round((total / max) * 100) : 0;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
      {!question ? null : (
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                Практик Ур чадварын тест
              </h2>
              <p className="text-xs text-muted-foreground">
                Бодит нөхцөл дэх чадварыг үнэлнэ
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-primary tabular-nums">
              {currentIndex + 1} / {skillsQuestions.length}
            </div>
            <div className="text-xs text-muted-foreground">асуулт</div>
          </div>
        </div>

        {/* Category skill bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {SKILLS_CATEGORIES.map((cat) => {
            const score = getSkillScore(cat.key);
            const catQs = skillsQuestions.filter((q) => q.category === cat.key);
            const answered = catQs.filter((q) => answers[q.id]).length;
            const isActive = question.category === cat.key;
            return (
              <div
                key={cat.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/5" :"border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs font-semibold text-foreground">
                    {cat.label}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${score}%`,
                      background: "linear-gradient(90deg, #F5A623, #FFD166)",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {answered}/{catQs.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Question card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 card-shadow-md mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            {currentCat && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${currentCat.color}`}
              >
                {currentCat.icon} {currentCat.label}
              </span>
            )}
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-semibold text-primary tabular-nums">
              {currentIndex + 1}/{skillsQuestions.length}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 leading-relaxed">
            {question.text}
          </h3>

          <div className="flex flex-col gap-3">
            {question.options.map((option, optIdx) => {
              const isSelected = answers[question.id] === option.id;
              const levelLabels = [
                "Туршлагагүй",
                "Эхлэгч",
                "Дунд",
                "Дэвшилтэт",
              ];
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? "border-accent bg-accent/5" :"border-border bg-card hover:border-accent/40 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {optIdx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {option.text}
                      </p>
                      {option.value !== undefined && (
                        <div className="flex items-center gap-1 mt-1.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={`level-dot-${option.id}-${i}`}
                              className={`w-4 h-1.5 rounded-full ${i < (option.value || 0) + 1 ? "bg-accent" : "bg-muted"}`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {levelLabels[option.value || 0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            Буцах
          </button>

          <span className="text-xs text-muted-foreground tabular-nums">
            {Object.keys(answers).length} / {skillsQuestions.length} хариулсан
          </span>

          <button
            onClick={() => {
              if (isAnswered && currentIndex < skillsQuestions.length - 1) {
                setCurrentIndex((i) => i + 1);
              } else if (isAnswered) {
                onComplete(answers);
              }
            }}
            disabled={!isAnswered}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-primary rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            {currentIndex === skillsQuestions.length - 1
              ? "Дуусгах" :"Дараагийн"}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
