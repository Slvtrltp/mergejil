"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const STATS = [
  { value: "12,400+", label: "Оролцогчид" },
  { value: "98%", label: "Сэтгэл ханамж" },
  { value: "33 мин", label: "Нийт хугацаа" },
  { value: "200+", label: "Мэргэжлийн чиглэл" },
];

const MODULES = [
  {
    id: "home-mod-mbti",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10C7 8.34 8.34 7 10 7s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3Z" fill="currentColor" opacity="0.4" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "MBTI Тест",
    desc: "Хувийн шинжийн үнэлгээ",
    duration: "10 мин",
    xp: "+120 XP",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
    moduleKey: "mbti",
  },
  {
    id: "home-mod-iq",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    label: "IQ Тест",
    desc: "Танин мэдэхүйн чадвар",
    duration: "15 мин",
    xp: "+150 XP",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
    moduleKey: "iq",
  },
  {
    id: "home-mod-skills",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10L8 15L17 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Ур чадвар",
    desc: "Практик ур чадварын тест",
    duration: "8 мин",
    xp: "+100 XP",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
    moduleKey: "skills",
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Батболд Д.",
    role: "МУИС, Мэдээллийн технологи",
    type: "INTJ",
    quote: "Тест өгсний дараа яг тохирсон мэргэжлийн чиглэлийг олсон. Маш үнэн зөв дүн шинжилгээ.",
    avatar: "Б",
  },
  {
    id: "t2",
    name: "Номин Э.",
    role: "ШУТИС, Бизнес удирдлага",
    type: "ENFJ",
    quote: "Карьерийн зөвлөгөө авах гэж олон газар явсан ч энэ платформ хамгийн дэлгэрэнгүй үр дүн өгсөн.",
    avatar: "Н",
  },
  {
    id: "t3",
    name: "Ганбаатар С.",
    role: "Дизайнер, Улаанбаатар",
    type: "ISFP",
    quote: "33 минутын дотор миний бүх чадварыг нэгтгэн харуулсан. Гайхалтай туршлага байлаа.",
    avatar: "Г",
  },
];

const USER_TYPES = [
  {
    id: "ut-confirm",
    emoji: "🎯",
    tag: "Шийдвэрлэсэн",
    tagColor: "bg-blue-100 text-blue-700",
    title: "Мэргэжлээ сонгосон ч баталгаажуулахыг хүсч байна уу?",
    desc: "Та аль хэдийн нэг мэргэжлийг сонирхож байна. Гэхдээ энэ нь үнэхээр таны хувийн шинж, чадвартай нийцэж байна уу? Бидний тест таны сонголтыг шинжлэлийн үндэслэлтэйгээр баталгаажуулна.",
    highlight: "Таны сонголт зөв эсэхийг шалгана",
    highlightColor: "text-blue-600",
    span: "md:col-span-1",
    accent: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50/60 to-white",
  },
  {
    id: "ut-lost",
    emoji: "🧭",
    tag: "Чиглэлгүй",
    tagColor: "bg-amber-100 text-amber-700",
    title: "Юу болохоо мэдэхгүй, хаанаас эхлэхээ ч мэдэхгүй байна уу?",
    desc: "Олон сонголтын дунд төөрч, аль нь өөртөө тохирохыг мэдэхгүй байгаа хүмүүст зориулсан. Бидний үнэлгээ таны хувийн онцлог, чадварт тулгуурлан хамгийн тохиромжтой замыг заана.",
    highlight: "Таны хувийн замыг олоход тусална",
    highlightColor: "text-amber-600",
    span: "md:col-span-1 md:row-span-1",
    accent: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50/60 to-white",
  },
  {
    id: "ut-potential",
    emoji: "💡",
    tag: "Нуугдмал авьяас",
    tagColor: "bg-emerald-100 text-emerald-700",
    title: "Ухаалаг, чадвартай ч өөрийгөө дутуу үнэлдэг үү?",
    desc: "Зарим хүмүүс гайхалтай авьяас чадвартай байдаг ч өөрийгөө хэр чадвартайг мэдэхгүй байдаг. Бидний IQ болон ур чадварын тест таны нуугдмал боломжийг илрүүлж, таны үнэ цэнийг харуулна.",
    highlight: "Таны нуугдмал чадварыг илрүүлнэ",
    highlightColor: "text-emerald-600",
    span: "md:col-span-1",
    accent: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50/60 to-white",
  },
];

type ProgressStatus = "completed" | "active" | "pending";

function getModuleProgress(moduleKey: string, completedModules: string[]): ProgressStatus {
  if (completedModules.includes(moduleKey)) return "completed";
  const order = ["mbti", "iq", "skills"];
  const idx = order.indexOf(moduleKey);
  const prevCompleted = idx === 0 || completedModules.includes(order[idx - 1]);
  if (prevCompleted && !completedModules.includes(moduleKey)) return "active";
  return "pending";
}

function ProgressBadge({ status }: { status: ProgressStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5L4.5 7.5L8 3" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Дууссан
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        Идэвхтэй
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      Хүлээгдэж байна
    </span>
  );
}

export default function HomePageClient() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("completedModules");
      if (stored) {
        setCompletedModules(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS?.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L8 15M1 8L15 8" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 1L10.5 4.5M8 1L5.5 4.5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-sm text-primary">Мэргэжил.мн</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#who-is-this-for" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Хэнд зориулсан</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Хэрхэн ажилладаг</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Сэтгэгдэл</a>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/sign-up-login-screen"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all duration-150"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/career-assessment"
                className="text-sm font-semibold text-white gradient-primary px-4 py-1.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150"
              >
                Эхлэх
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)", transform: "translate(20%, -20%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)", transform: "translate(-20%, 20%)" }}
          />

          <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-20 lg:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 border border-accent/30 rounded-full text-accent text-xs font-semibold mb-6">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" />
                  </svg>
                  Монголын #1 Карьер удирдамжийн платформ
                </div>

                <h1 className="text-white font-bold leading-tight mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
                  Таны зам{" "}
                  <span className="text-accent">энд эхэлнэ</span>
                </h1>

                <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-xl">
                  Мэргэжлээ сонгосон ч баталгаажуулах хэрэгтэй байна уу? Эсвэл яг юу болохоо мэдэхгүй байна уу? Эсвэл өөртөө итгэлгүй ч гэсэн гайхалтай авьяастай гэдгээ мэдрэх хэрэгтэй байна уу?
                </p>

                {/* Three-type pill indicators */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <a href="#who-is-this-for" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-xs font-medium hover:bg-blue-500/30 transition-colors cursor-pointer">
                    🎯 Сонголтоо баталгаажуулах
                  </a>
                  <a href="#who-is-this-for" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs font-medium hover:bg-amber-500/30 transition-colors cursor-pointer">
                    🧭 Чиглэл хайж байна
                  </a>
                  <a href="#who-is-this-for" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-medium hover:bg-emerald-500/30 transition-colors cursor-pointer">
                    💡 Нуугдмал авьяасаа нээх
                  </a>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 mb-12">
                  <Link
                    href="/career-assessment"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 card-shadow"
                  >
                    Үнэлгээ эхлэх
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link
                    href="/sign-up-login-screen"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-150"
                  >
                    Бүртгүүлэх
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  {STATS?.map((stat) => (
                    <div key={`hero-stat-${stat?.label}`}>
                      <div className="text-white font-bold text-2xl tabular-nums">{stat?.value}</div>
                      <div className="text-white/50 text-xs mt-0.5">{stat?.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 lg:py-20 bg-secondary/40">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Үйл явц</span>
              <h2 className="text-foreground font-bold text-2xl lg:text-3xl mt-2">3 модулийн үнэлгээ</h2>
              <p className="text-muted-foreground mt-2 max-w-lg">Дөнгөж 33 минутад таны карьерийн бүрэн профайл бэлэн болно</p>
            </div>

            {/* Bento-style module cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MODULES?.map((mod, idx) => {
                const status = mounted ? getModuleProgress(mod.moduleKey, completedModules) : "pending";
                const isCompleted = status === "completed";
                return (
                  <Link
                    key={mod?.id}
                    href="/career-assessment"
                    className={`relative bg-card border rounded-2xl p-6 card-shadow hover:card-shadow-md transition-all duration-200 group cursor-pointer block ${idx === 1 ? "md:mt-6" : ""} ${isCompleted ? "border-emerald-200" : "border-border hover:border-primary/30"}`}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${mod?.color} mb-4`}>
                      {mod?.icon}
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-foreground text-base">{mod?.label}</h3>
                      <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{mod?.xp}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{mod?.desc}</p>

                    <div className="mb-4">
                      <ProgressBadge status={status} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${mod?.dot}`} />
                        <span className="text-xs text-muted-foreground">{mod?.duration}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-semibold text-primary">Модуль {idx + 1}/3</span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
                      >
                        <path d="M3 7H11M7.5 4L11 7L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-5 text-6xl font-black text-muted/40 select-none leading-none">
                      {idx + 1}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/career-assessment"
                className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 card-shadow"
              >
                Одоо эхлэх — үнэгүй
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Results preview */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Үр дүн</span>
                <h2 className="text-foreground font-bold text-2xl lg:text-3xl mt-2 mb-4">
                  Таны карьерийн <span className="text-primary">бүрэн профайл</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Тест дууссаны дараа таны хувийн шинж, оюуны чадвар, ур чадварыг нэгтгэн хамгийн тохиромжтой мэргэжлийн чиглэлүүдийг санал болгоно.
                </p>
                <ul className="space-y-3">
                  {[
                    "Тохиромжтой мэргэжлийн жагсаалт",
                    "Их сургуулийн зөвлөмж",
                    "Ур чадварын радар диаграм",
                    "Карьерийн замын зураглал",
                  ]?.map((item) => (
                    <li key={`result-${item}`} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.5 7.5L8 3" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock result card */}
              <div className="bg-card border border-border rounded-2xl p-6 card-shadow-md">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Таны MBTI төрөл</div>
                    <div className="text-2xl font-black text-primary">INTJ</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Нийт XP</div>
                    <div className="text-xl font-bold text-accent">370 XP</div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Аналитик сэтгэлгээ", pct: 88 },
                    { label: "Бүтээлч чадвар", pct: 74 },
                    { label: "Удирдах чадвар", pct: 91 },
                  ]?.map((skill) => (
                    <div key={`skill-${skill?.label}`}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{skill?.label}</span>
                        <span className="font-semibold text-foreground tabular-nums">{skill?.pct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full"
                          style={{ width: `${skill?.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Санал болгох мэргэжлүүд</div>
                  <div className="flex flex-wrap gap-2">
                    {["Програм хангамж", "Дата шинжилгээ", "Бизнес стратеги"]?.map((career) => (
                      <span key={`career-${career}`} className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full border border-border">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 lg:py-20 bg-secondary/40">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Сэтгэгдэл</span>
              <h2 className="text-foreground font-bold text-2xl lg:text-3xl mt-2">Хэрэглэгчид юу хэлдэг вэ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS?.map((t, idx) => (
                <div
                  key={t?.id}
                  className={`bg-card border rounded-2xl p-6 transition-all duration-300 ${mounted && activeTestimonial === idx ? "border-primary/30 card-shadow-md" : "border-border card-shadow"}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t?.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t?.name}</div>
                      <div className="text-xs text-muted-foreground">{t?.role}</div>
                    </div>
                    <span className="ml-auto text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{t?.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t?.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-hero py-16 lg:py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(245,166,35,0.07) 0%, transparent 60%)" }}
          />
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="text-white font-bold text-2xl lg:text-3xl mb-4">
              Өнөөдөр карьерийн замаа тодорхойл
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              33 минут зарцуулаад таны ирээдүйн карьерийн бүрэн зураглалыг авна уу.
            </p>
            <Link
              href="/career-assessment"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 card-shadow-md"
            >
              Үнэлгээ эхлэх — үнэгүй
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-primary rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L8 15M1 8L15 8" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-primary">Мэргэжил.мн</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Мэргэжил.мн — Монголын карьер удирдамжийн платформ</p>
          <div className="flex items-center gap-4">
            <Link href="/career-assessment" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Үнэлгээ</Link>
            <Link href="/sign-up-login-screen" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Нэвтрэх</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
