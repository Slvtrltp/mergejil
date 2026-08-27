"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import ResultsHeader from "./ResultsHeader";
import ProfileHeroSection from "./ProfileHeroSection";
import IQSection from "./IQSection";
import SkillsRadarSection from "./SkillsRadarSection";
import ProfessionCards from "./ProfessionCards";
import UniversitySection from "./UniversitySection";
import WorkEnvironmentSection from "./WorkEnvironmentSection";
import RoadmapSection from "./RoadmapSection";
import { PROFILE_DATA } from "./resultsData";

interface SessionUser {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AssessmentResults {
  hasResults: boolean;
  mbtiType?: string;
  iqScore?: number;
  skillsScores?: Record<string, number>;
  completedAt?: string;
}

type LoginFormData = {
  email: string;
  password: string;
};

// ── Read results from localStorage (works without a database) ─────────────────
function readLocalResults(): AssessmentResults | null {
  try {
    const raw = localStorage.getItem("assessmentResults");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.hasResults) return parsed as AssessmentResults;
    return null;
  } catch {
    return null;
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function InlineLoginForm({ onSuccess }: { onSuccess: (user: SessionUser) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();

  const fillDemoAccount = () => {
    setValue("email", "demo@mergejil.mn");
    setValue("password", "demo1234");
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Нэвтрэхэд алдаа гарлаа");
      } else {
        onSuccess({
          userId: json.user?.id ?? 0,
          email: json.user?.email ?? data.email,
          firstName: json.user?.firstName,
          lastName: json.user?.lastName,
        });
      }
    } catch {
      setErrorMsg("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {errorMsg && (
        <p className="mb-3 text-xs text-red-500 text-center">{errorMsg}</p>
      )}

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="gate-email" className="block text-sm font-semibold text-foreground mb-1.5">
          И-мэйл хаяг
        </label>
        <input
          id="gate-email"
          type="email"
          autoComplete="email"
          placeholder="та@example.mn"
          className={`w-full px-4 py-3 border rounded-xl text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all duration-150 ${
            errors.email ? "border-red-400" : "border-input"
          }`}
          {...register("email", {
            required: "И-мэйл хаяг оруулна уу",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Зөв и-мэйл хаяг оруулна уу",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-5">
        <label htmlFor="gate-password" className="block text-sm font-semibold text-foreground mb-1.5">
          Нууц үг
        </label>
        <div className="relative">
          <input
            id="gate-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all duration-150 ${
              errors.password ? "border-red-400" : "border-input"
            }`}
            {...register("password", { required: "Нууц үг оруулна уу" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 gradient-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ minHeight: "52px" }}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <LogIn size={18} />
            Нэвтрэх
          </>
        )}
      </button>

      {/* Demo account link */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        <button
          type="button"
          onClick={fillDemoAccount}
          className="text-primary font-normal hover:underline"
        >
          Demo account
        </button>
      </p>
    </form>
  );
}

export default function ResultsPageClient() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "professions" | "education" | "roadmap"
  >("profile");

  const loadResults = async (userId?: number) => {
    // 1. Try localStorage first — always available, no DB needed
    const localResults = readLocalResults();
    if (localResults) {
      setAssessmentResults(localResults);
    }

    // 2. Try DB (best-effort — may fail if DATABASE_URL is not set)
    try {
      const resultsRes = await fetch("/api/assessment/results");
      if (resultsRes.ok) {
        const data = await resultsRes.json();
        if (data.hasResults) {
          setAssessmentResults(data);
          // Sync DB results back to localStorage for consistency
          try { localStorage.setItem("assessmentResults", JSON.stringify(data)); } catch { /* ignore */ }
        }
      }
    } catch {
      // DB unavailable — localStorage results already set above
    }

    // 3. If we have pending raw answers and are now authenticated, try to submit them
    try {
      const pending = localStorage.getItem("pendingAssessmentAnswers");
      if (pending && userId) {
        const answers = JSON.parse(pending);
        const submitRes = await fetch("/api/assessment/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });
        if (submitRes.ok) {
          localStorage.removeItem("pendingAssessmentAnswers");
          // Refresh from DB after successful submit
          const refreshRes = await fetch("/api/assessment/results");
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.hasResults) {
              setAssessmentResults(refreshData);
              try { localStorage.setItem("assessmentResults", JSON.stringify(refreshData)); } catch { /* ignore */ }
            }
          }
        }
      }
    } catch {
      // ignore — localStorage results are already displayed
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setSessionUser(data.user);
        await loadResults(data.user?.userId);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLoginSuccess = async (user: SessionUser) => {
    setSessionUser(user);
    setIsAuthenticated(true);
    await loadResults(user.userId);
  };

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: "tab-profile", key: "profile" as const, label: "Профайл", icon: "👤" },
    { id: "tab-professions", key: "professions" as const, label: "Мэргэжлүүд", icon: "💼" },
    { id: "tab-education", key: "education" as const, label: "Боловсрол", icon: "🎓" },
    { id: "tab-roadmap", key: "roadmap" as const, label: "Roadmap", icon: "🗺️" },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Үр дүнг харахын тулд нэвтэрнэ үү
          </h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Таны MBTI, IQ болон ур чадварын үр дүн бэлэн байна. Харахын тулд эхлээд нэвтэрнэ үү эсвэл бүртгүүлнэ үү.
          </p>
          <div className="relative mb-6 rounded-2xl overflow-hidden border border-border">
            <div className="p-6 bg-card space-y-3 blur-sm select-none pointer-events-none" aria-hidden="true">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-xl" />
                ))}
              </div>
              <div className="h-24 bg-muted rounded-xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[1px]">
              <span className="text-xs font-semibold text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full shadow">
                🔒 Нэвтэрсний дараа харагдана
              </span>
            </div>
          </div>

          {/* Inline login form */}
          <div className="bg-card border border-border rounded-2xl p-6 text-left mb-4">
            <InlineLoginForm onSuccess={handleLoginSuccess} />
          </div>

          <button
            onClick={() => router.push("/career-assessment")}
            className="w-full py-3 px-6 border border-border text-muted-foreground font-medium text-sm rounded-xl hover:bg-muted transition-all duration-150"
          >
            ← Тестэд буцах
          </button>
        </div>
      </div>
    );
  }

  // Build profile data merging results (localStorage or DB) with static profile data
  const profileData = {
    ...PROFILE_DATA,
    user: {
      ...PROFILE_DATA.user,
      name: sessionUser
        ? `${sessionUser.lastName || ""} ${sessionUser.firstName || ""}`.trim() || sessionUser.email
        : PROFILE_DATA.user.name,
    },
    mbti: assessmentResults?.mbtiType
      ? { ...PROFILE_DATA.mbti, type: assessmentResults.mbtiType }
      : PROFILE_DATA.mbti,
    iq: assessmentResults?.iqScore
      ? { ...PROFILE_DATA.iq, score: assessmentResults.iqScore }
      : PROFILE_DATA.iq,
  };

  return (
    <div className="min-h-screen bg-background">
      <ResultsHeader user={profileData.user} />

      {/* Tab navigation */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  activeTab === tab.key
                    ? "bg-primary text-white" :"text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-8">
        {activeTab === "profile" && (
          <div className="space-y-8">
            <ProfileHeroSection mbti={profileData.mbti} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <IQSection iq={profileData.iq} />
              <SkillsRadarSection skills={PROFILE_DATA.skills} />
            </div>
            <WorkEnvironmentSection
              environments={PROFILE_DATA.workEnvironments}
              collaborationStyles={PROFILE_DATA.collaborationStyles}
            />
          </div>
        )}
        {activeTab === "professions" && (
          <ProfessionCards professions={PROFILE_DATA.professions} />
        )}
        {activeTab === "education" && (
          <UniversitySection
            universities={PROFILE_DATA.universities}
            professions={PROFILE_DATA.professions}
          />
        )}
        {activeTab === "roadmap" && (
          <RoadmapSection
            roadmap={PROFILE_DATA.roadmap}
            totalXP={PROFILE_DATA.user.totalXP}
          />
        )}
      </main>
    </div>
  );
}
