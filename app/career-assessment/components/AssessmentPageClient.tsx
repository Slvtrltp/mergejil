"use client";

import React, { useState } from "react";
import AssessmentHeader from "./AssessmentHeader";
import MBTIModule from "./MBTIModule";
import IQModule from "./IQModule";
import SkillsModule from "./SkillsModule";
import ModuleComplete from "./ModuleComplete";
import { useRouter } from "next/navigation";

export type ModuleState =
  | "mbti" | "mbti-complete" | "iq" | "iq-complete" | "skills" | "skills-complete" | "submitting";

export type AssessmentAnswers = {
  mbti: Record<string, string>;
  iq: Record<string, string>;
  skills: Record<string, string>;
};

// ── helpers (mirror the API logic so we can compute locally) ──────────────────
function calculateMBTI(mbtiAnswers: Record<string, string>): string {
  if (mbtiAnswers.mbtiType) return mbtiAnswers.mbtiType;
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(mbtiAnswers).forEach((v) => { if (v in counts) counts[v]++; });
  return (
    (counts.E >= counts.I ? "E" : "I") +
    (counts.S >= counts.N ? "S" : "N") +
    (counts.T >= counts.F ? "T" : "F") +
    (counts.J >= counts.P ? "J" : "P")
  );
}

function calculateIQScore(iqAnswers: Record<string, string>): number {
  const correct = Object.values(iqAnswers).filter((v) => v === "correct").length;
  const total = Object.keys(iqAnswers).length || 15;
  return Math.round(85 + (correct / total) * 45);
}

function calculateSkillsScores(skillsAnswers: Record<string, string>): Record<string, number> {
  const categories: Record<string, number[]> = {};
  Object.entries(skillsAnswers).forEach(([key, val]) => {
    const cat = key.split("-")[0];
    if (!categories[cat]) categories[cat] = [];
    const num = parseInt(val);
    if (!isNaN(num)) categories[cat].push(num);
  });
  const scores: Record<string, number> = {};
  Object.entries(categories).forEach(([cat, vals]) => {
    scores[cat] = Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100);
  });
  return scores;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentPageClient() {
  const [currentModule, setCurrentModule] = useState<ModuleState>("mbti");
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    mbti: {},
    iq: {},
    skills: {},
  });
  const router = useRouter();

  const saveProgress = (modules: string[]) => {
    try {
      localStorage.setItem("completedModules", JSON.stringify(modules));
    } catch {
      // ignore
    }
  };

  const handleMBTIComplete = (mbtiAnswers: Record<string, string>) => {
    setAnswers((prev) => ({ ...prev, mbti: mbtiAnswers }));
    saveProgress(["mbti"]);
    setCurrentModule("mbti-complete");
  };

  const handleIQComplete = (iqAnswers: Record<string, string>) => {
    setAnswers((prev) => ({ ...prev, iq: iqAnswers }));
    saveProgress(["mbti", "iq"]);
    setCurrentModule("iq-complete");
  };

  const handleSkillsComplete = (skillsAnswers: Record<string, string>) => {
    setAnswers((prev) => ({ ...prev, skills: skillsAnswers }));
    saveProgress(["mbti", "iq", "skills"]);
    setCurrentModule("skills-complete");
  };

  const handleFinalSubmit = async () => {
    setCurrentModule("submitting");

    // Compute results locally — this works even without a database
    const mbtiType = calculateMBTI(answers.mbti);
    const iqScore = calculateIQScore(answers.iq);
    const skillsScores = calculateSkillsScores(answers.skills);

    const computedResults = {
      hasResults: true,
      mbtiType,
      iqScore,
      skillsScores,
      completedAt: new Date().toISOString(),
    };

    try {
      // Save computed results to localStorage so results page can read them immediately
      localStorage.setItem("assessmentResults", JSON.stringify(computedResults));
      // Also keep raw answers in case DB becomes available later
      localStorage.setItem("pendingAssessmentAnswers", JSON.stringify(answers));
    } catch {
      // ignore storage errors
    }

    // Try to persist to DB (best-effort, non-blocking)
    try {
      const res = await fetch("/api/assessment/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (res.ok) {
        // DB saved — clear pending answers (keep computed results for fast display)
        try { localStorage.removeItem("pendingAssessmentAnswers"); } catch { /* ignore */ }
      }
    } catch {
      // DB unavailable — results are already in localStorage, continue
    }

    router.push("/career-profile-recommendations");
  };

  const getModuleIndex = () => {
    if (currentModule === "mbti" || currentModule === "mbti-complete") return 0;
    if (currentModule === "iq" || currentModule === "iq-complete") return 1;
    return 2;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AssessmentHeader
        moduleIndex={getModuleIndex()}
        answers={answers}
      />

      <main className="flex-1 flex flex-col">
        {currentModule === "mbti" && (
          <MBTIModule onComplete={handleMBTIComplete} />
        )}
        {currentModule === "mbti-complete" && (
          <ModuleComplete
            moduleKey="mbti"
            title="MBTI Тест дууслаа!"
            subtitle="Хувийн шинжийн үнэлгээ амжилттай дууслаа"
            xp={120}
            nextLabel="IQ Тест эхлэх →"
            onNext={() => setCurrentModule("iq")}
            stats={[
              {
                label: "Хариулсан асуулт",
                value: `${answers.mbti.mbtiManual === "true" ? 20 : Object.keys(answers.mbti).filter((k) => k !== "mbtiType").length}/20`,
              },
              { label: "Олгосон XP", value: "+120 XP" },
              { label: "Дараагийн модуль", value: "IQ Тест" },
            ]}
          />
        )}
        {currentModule === "iq" && <IQModule onComplete={handleIQComplete} />}
        {currentModule === "iq-complete" && (
          <ModuleComplete
            moduleKey="iq"
            title="IQ Тест дууслаа!"
            subtitle="Танин мэдэхүйн чадварын үнэлгээ дууслаа"
            xp={150}
            nextLabel="Ур чадварын тест эхлэх →"
            onNext={() => setCurrentModule("skills")}
            stats={[
              {
                label: "Хариулсан асуулт",
                value: `${Object.keys(answers.iq).length}/15`,
              },
              { label: "Олгосон XP", value: "+150 XP" },
              { label: "Дараагийн модуль", value: "Ур чадвар" },
            ]}
          />
        )}
        {currentModule === "skills" && (
          <SkillsModule onComplete={handleSkillsComplete} />
        )}
        {(currentModule === "skills-complete" ||
          currentModule === "submitting") && (
          <ModuleComplete
            moduleKey="skills"
            title="Бүх тест дууслаа! 🎉"
            subtitle="Таны карьерийн профайл боловсруулагдаж байна..."
            xp={100}
            nextLabel={
              currentModule === "submitting" ?"Боловсруулж байна..." :"Карьерийн профайл харах →"
            }
            onNext={handleFinalSubmit}
            isLoading={currentModule === "submitting"}
            isFinal
            stats={[
              { label: "Нийт олгосон XP", value: "+370 XP" },
              { label: "Дууссан модуль", value: "3/3" },
              { label: "Зарцуулсан хугацаа", value: "~32 мин" },
            ]}
          />
        )}
      </main>
    </div>
  );
}
