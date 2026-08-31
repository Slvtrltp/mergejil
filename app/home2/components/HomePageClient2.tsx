"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const STATS = [
  { value: "12,400+", label: "Оролцогчид", icon: "👥" },
  { value: "98%", label: "Сэтгэл ханамж", icon: "⭐" },
  { value: "33 мин", label: "Нийт хугацаа", icon: "⏱" },
  { value: "200+", label: "Мэргэжлийн чиглэл", icon: "🎯" },
];

const MODULES = [
  {
    id: "m1",
    num: "01",
    label: "MBTI Тест",
    desc: "Таны хувийн шинж, зан чанарыг 16 төрлийн загварт тулгуурлан тодорхойлно",
    duration: "10 мин",
    xp: "120 XP",
    accent: "#6ee7b7",
    bg: "from-emerald-950/80 to-emerald-900/40",
    border: "border-emerald-800/50",
    tag: "Хувийн шинж",
  },
  {
    id: "m2",
    num: "02",
    label: "IQ Тест",
    desc: "Логик сэтгэлгээ, тоон болон орон зайн чадварыг хэмжинэ",
    duration: "15 мин",
    xp: "150 XP",
    accent: "#fbbf24",
    bg: "from-amber-950/80 to-amber-900/40",
    border: "border-amber-800/50",
    tag: "Оюуны чадвар",
  },
  {
    id: "m3",
    num: "03",
    label: "Ур чадвар",
    desc: "Практик болон мэргэжлийн ур чадварыг бодит даалгаврын тусламжтай үнэлнэ",
    duration: "8 мин",
    xp: "100 XP",
    accent: "#a78bfa",
    bg: "from-violet-950/80 to-violet-900/40",
    border: "border-violet-800/50",
    tag: "Практик чадвар",
  },
];

const RESULTS_FEATURES = [
  { label: "Мэргэжлийн тохирол", value: "94%", sub: "Нарийвчлал" },
  { label: "Санал болгох мэргэжил", value: "12+", sub: "Чиглэл" },
  { label: "Их сургуулийн зөвлөмж", value: "30+", sub: "Байгууллага" },
  { label: "Карьерийн зам", value: "5+", sub: "Хувилбар" },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Батболд Д.",
    role: "МУИС, Мэдээллийн технологи",
    type: "INTJ",
    quote: "Тест өгсний дараа яг тохирсон мэргэжлийн чиглэлийг олсон. Маш үнэн зөв дүн шинжилгээ.",
    color: "#6ee7b7",
  },
  {
    id: "t2",
    name: "Номин Э.",
    role: "ШУТИС, Бизнес удирдлага",
    type: "ENFJ",
    quote: "Карьерийн зөвлөгөө авах гэж олон газар явсан ч энэ платформ хамгийн дэлгэрэнгүй үр дүн өгсөн.",
    color: "#fbbf24",
  },
  {
    id: "t3",
    name: "Ганбаатар С.",
    role: "Дизайнер, Улаанбаатар",
    type: "ISFP",
    quote: "33 минутын дотор миний бүх чадварыг нэгтгэн харуулсан. Гайхалтай туршлага байлаа.",
    color: "#a78bfa",
  },
];

export default function HomePageClient2() {
  const [mounted, setMounted] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveModule((p) => (p + 1) % MODULES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    const el = heroRef.current;
    el?.addEventListener("mousemove", handleMouse);
    return () => el?.removeEventListener("mousemove", handleMouse);
  }, [mounted]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080c14", color: "#e2e8f0", fontFamily: "var(--font-sans)" }}>
      {/* ── NAV ── */}
      <header
        style={{ background: "rgba(8,12,20,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg,#f5a623,#e8870a)", color: "#080c14" }}
            >
              М
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "#f1f5f9" }}>
              Мэргэжил<span style={{ color: "#f5a623" }}>.мн</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {["Үнэлгээ", "Үр дүн", "Сэтгэгдэл"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-xs font-medium transition-colors"
                style={{ color: "rgba(226,232,240,0.55)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#f1f5f9")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(226,232,240,0.55)")}
              >
                {item}
              </a>
            ))}
            <Link
              href="/career-confirmation-test"
              className="text-xs font-medium transition-colors"
              style={{ color: "rgba(226,232,240,0.55)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#f1f5f9")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(226,232,240,0.55)")}
            >
              Мэргэжил шалгах
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/sign-up-login-screen"
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all"
              style={{ color: "rgba(226,232,240,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Нэвтрэх
            </Link>
            <Link
              href="/career-assessment"
              className="text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
              style={{ background: "#f5a623", color: "#080c14" }}
            >
              Эхлэх →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ minHeight: "92vh", display: "flex", alignItems: "center" }}
        >
          {/* Animated gradient orbs */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 65%)",
              top: mounted ? `${mousePos.y * 0.3 - 10}%` : "10%",
              left: mounted ? `${mousePos.x * 0.3 + 30}%` : "55%",
              transform: "translate(-50%,-50%)",
              transition: "top 0.8s cubic-bezier(0.25,0.46,0.45,0.94), left 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(110,231,183,0.07) 0%, transparent 65%)",
              bottom: "5%",
              left: "5%",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%)",
              top: "15%",
              right: "8%",
            }}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 relative z-10 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
              {/* Left */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
                  style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)", color: "#f5a623" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#f5a623", boxShadow: "0 0 6px #f5a623", animation: "pulse 2s infinite" }}
                  />
                  Монголын #1 Карьер платформ
                </div>

                <h1
                  className="font-black leading-[1.05] mb-6"
                  style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", letterSpacing: "-0.03em", color: "#f8fafc" }}
                >
                  Таны карьерийн{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg, #f5a623 0%, #fbbf24 50%, #f5a623 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    зөв зам
                  </span>
                  <br />
                  энд эхэлнэ
                </h1>

                <p className="text-base leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(226,232,240,0.6)" }}>
                  33 минутын 3 модулийн үнэлгээгээр таны хувийн шинж, оюуны чадвар, ур чадварыг нэгтгэн хамгийн тохиромжтой мэргэжлийн замыг тодорхойлно.
                </p>

                <div className="flex flex-wrap gap-3 mb-12">
                  <Link
                    href="/career-assessment"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                    style={{ background: "#f5a623", color: "#080c14", boxShadow: "0 0 30px rgba(245,166,35,0.3)" }}
                  >
                    Үнэлгээ эхлэх
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link
                    href="/sign-up-login-screen"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(226,232,240,0.8)" }}
                  >
                    Бүртгүүлэх
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-8">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div className="text-xl font-black tabular-nums" style={{ color: "#f8fafc" }}>
                        {s.icon} {s.value}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(226,232,240,0.4)" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — animated module stack */}
              <div className="relative hidden lg:block" style={{ height: 420 }}>
                {MODULES.map((mod, idx) => {
                  const isActive = mounted && activeModule === idx;
                  const offset = (idx - (mounted ? activeModule : 0) + MODULES.length) % MODULES.length;
                  return (
                    <div
                      key={mod.id}
                      className="absolute w-full rounded-2xl p-6 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, rgba(8,12,20,0.95), rgba(8,12,20,0.8))`,
                        border: `1px solid ${isActive ? mod.accent + "55" : "rgba(255,255,255,0.07)"}`,
                        boxShadow: isActive ? `0 0 40px ${mod.accent}22` : "none",
                        top: `${offset * 28}px`,
                        left: `${offset * 8}px`,
                        zIndex: MODULES.length - offset,
                        transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                        opacity: offset === 0 ? 1 : offset === 1 ? 0.7 : 0.4,
                        transform: `scale(${offset === 0 ? 1 : offset === 1 ? 0.97 : 0.94})`,
                      }}
                      onClick={() => setActiveModule(idx)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: mod.accent + "18", color: mod.accent, border: `1px solid ${mod.accent}30` }}
                        >
                          {mod.tag}
                        </span>
                        <span className="text-4xl font-black" style={{ color: "rgba(255,255,255,0.06)", lineHeight: 1 }}>
                          {mod.num}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2" style={{ color: "#f8fafc" }}>
                        {mod.label}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(226,232,240,0.5)" }}>
                        {mod.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                            ⏱ {mod.duration}
                          </span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: mod.accent + "18", color: mod.accent }}
                          >
                            +{mod.xp}
                          </span>
                        </div>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: mod.accent + "18", color: mod.accent }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID — Assessment modules ── */}
        <section id="Үнэлгээ" className="py-20 lg:py-28" style={{ background: "#0d1117" }}>
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f5a623" }}>
                  Үнэлгээний систем
                </p>
                <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  3 модуль · 33 минут ·<br />
                  <span style={{ color: "rgba(226,232,240,0.4)" }}>Бүрэн карьерийн профайл</span>
                </h2>
              </div>
              <Link
                href="/career-assessment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold self-start lg:self-auto transition-all"
                style={{ border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623" }}
              >
                Бүгдийг үзэх →
              </Link>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large card — MBTI */}
              <div
                className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0d2818,#0a1f12)", border: "1px solid rgba(110,231,183,0.15)" }}
              >
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)", transform: "translate(30%,-30%)" }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(110,231,183,0.12)", color: "#6ee7b7", border: "1px solid rgba(110,231,183,0.2)" }}
                    >
                      Модуль 01 · MBTI
                    </span>
                    <span className="text-6xl font-black" style={{ color: "rgba(110,231,183,0.06)", lineHeight: 1 }}>
                      01
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-3" style={{ color: "#f8fafc" }}>
                    Хувийн шинжийн үнэлгээ
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(226,232,240,0.5)", maxWidth: 380 }}>
                    Myers-Briggs загварт тулгуурлан таны сэтгэлгээний хэв маяг, харилцааны онцлог, шийдвэр гаргах арга барилыг тодорхойлно. 16 төрлийн хувийн шинжийн аль нэгт хамаарахыг олж мэдэнэ.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Экстроверт/Интроверт", "Сэтгэлгээний хэв", "Шийдвэр гаргалт", "Амьдралын хэв маяг"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(110,231,183,0.08)", color: "rgba(110,231,183,0.7)", border: "1px solid rgba(110,231,183,0.12)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>⏱ 10 минут</span>
                    <span className="text-xs font-bold" style={{ color: "#6ee7b7" }}>+120 XP</span>
                  </div>
                </div>
              </div>

              {/* IQ card */}
              <div
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1a1200,#120e00)", border: "1px solid rgba(251,191,36,0.15)" }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)", transform: "translate(30%,-30%)" }}
                />
                <div className="relative z-10">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full mb-5 inline-block"
                    style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
                  >
                    Модуль 02 · IQ
                  </span>
                  <h3 className="text-xl font-black mb-2" style={{ color: "#f8fafc" }}>
                    Оюуны чадварын тест
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(226,232,240,0.45)" }}>
                    Логик, тоон болон орон зайн сэтгэлгээний чадварыг хэмжинэ.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>⏱ 15 минут</span>
                    <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>+150 XP</span>
                  </div>
                </div>
              </div>

              {/* Skills card */}
              <div
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0f0a1e,#0a0614)", border: "1px solid rgba(167,139,250,0.15)" }}
              >
                <div
                  className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)", transform: "translate(-30%,30%)" }}
                />
                <div className="relative z-10">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full mb-5 inline-block"
                    style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}
                  >
                    Модуль 03 · Ур чадвар
                  </span>
                  <h3 className="text-xl font-black mb-2" style={{ color: "#f8fafc" }}>
                    Практик ур чадварын тест
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(226,232,240,0.45)" }}>
                    Бодит даалгаврын тусламжтайгаар таны мэргэжлийн ур чадварыг үнэлнэ.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>⏱ 8 минут</span>
                    <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>+100 XP</span>
                  </div>
                </div>
              </div>

              {/* CTA card */}
              <div
                className="lg:col-span-2 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1a0f00,#120a00)", border: "1px solid rgba(245,166,35,0.2)" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(245,166,35,0.06) 0%, transparent 60%)" }}
                />
                <div className="relative z-10">
                  <p className="text-xs font-bold mb-2" style={{ color: "rgba(245,166,35,0.7)" }}>
                    Нийт хугацаа: 33 минут
                  </p>
                  <h3 className="text-xl font-black" style={{ color: "#f8fafc" }}>
                    Гурван модулийг дуусгаад бүрэн карьерийн профайлаа авна уу
                  </h3>
                </div>
                <Link
                  href="/career-assessment"
                  className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "#f5a623", color: "#080c14", boxShadow: "0 0 24px rgba(245,166,35,0.25)" }}
                >
                  Одоо эхлэх
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── RESULTS SECTION ── */}
        <section id="Үр дүн" className="py-20 lg:py-28" style={{ background: "#080c14" }}>
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left — mock result card */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(245,166,35,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
                />
                <div
                  className="relative rounded-2xl p-7"
                  style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>Таны MBTI төрөл</p>
                      <p className="text-3xl font-black" style={{ color: "#f5a623" }}>INTJ</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(226,232,240,0.4)" }}>Стратегич</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>Нийт оноо</p>
                      <p className="text-2xl font-black" style={{ color: "#6ee7b7" }}>370 XP</p>
                    </div>
                  </div>

                  {/* Skill bars */}
                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Аналитик сэтгэлгээ", pct: 88, color: "#6ee7b7" },
                      { label: "Бүтээлч чадвар", pct: 74, color: "#a78bfa" },
                      { label: "Удирдах чадвар", pct: 91, color: "#fbbf24" },
                    ].map((skill) => (
                      <div key={skill.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color: "rgba(226,232,240,0.55)" }}>{skill.label}</span>
                          <span className="font-bold tabular-nums" style={{ color: skill.color }}>{skill.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${skill.pct}%`, background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Career tags */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.4)" }}>Санал болгох мэргэжлүүд</p>
                    <div className="flex flex-wrap gap-2">
                      {["Програм хангамж", "Дата шинжилгээ", "Бизнес стратеги", "Судалгаа"].map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.15)" }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — features */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#f5a623" }}>
                  Үр дүн
                </p>
                <h2
                  className="font-black leading-tight mb-6"
                  style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#f8fafc", letterSpacing: "-0.02em" }}
                >
                  Нэг тест биш —<br />
                  <span style={{ color: "rgba(226,232,240,0.35)" }}>бүрэн карьерийн зураглал</span>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(226,232,240,0.5)", maxWidth: 420 }}>
                  Гурван модулийн үр дүнг нэгтгэн таны хувийн шинж, оюуны чадвар, ур чадварт тулгуурласан нарийвчилсан карьерийн профайл бэлтгэнэ.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {RESULTS_FEATURES.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl p-4"
                      style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-2xl font-black mb-0.5" style={{ color: "#f5a623" }}>{f.value}</p>
                      <p className="text-xs font-semibold" style={{ color: "#f8fafc" }}>{f.label}</p>
                      <p className="text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>{f.sub}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/career-assessment"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)" }}
                >
                  Үнэлгээ эхлэх →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="Сэтгэгдэл" className="py-20 lg:py-28" style={{ background: "#0d1117" }}>
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f5a623" }}>
                Сэтгэгдэл
              </p>
              <h2
                className="font-black"
                style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#f8fafc", letterSpacing: "-0.02em" }}
              >
                Хэрэглэгчид юу хэлдэг вэ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={t.id}
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: "#080c14",
                    border: `1px solid ${t.color}22`,
                    transform: idx === 1 ? "translateY(-12px)" : "none",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${t.color}08 0%, transparent 70%)`, transform: "translate(30%,-30%)" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: t.color + "18", color: t.color, border: `1px solid ${t.color}30` }}
                      >
                        {t.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "#f8fafc" }}>{t.name}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(226,232,240,0.4)" }}>{t.role}</p>
                      </div>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: t.color + "15", color: t.color }}
                      >
                        {t.type}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(226,232,240,0.6)" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAREER CONFIRMATION SECTION ── */}
        <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#080c14" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(110,231,183,0.05) 0%, transparent 60%)" }}
          />
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{ background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.25)", color: "#6ee7b7" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }} />
                  Шинэ функц
                </div>
                <h2
                  className="font-black leading-tight mb-5"
                  style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#f8fafc", letterSpacing: "-0.02em" }}
                >
                  Сонирхсон мэргэжлээ{" "}
                  <span style={{ color: "#6ee7b7" }}>баталгаажуул</span>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(226,232,240,0.5)", maxWidth: 460 }}>
                  Аль мэргэжлийг сонирхож байгаагаа сонгоод, тусгайлан боловсруулсан 5 асуултын тестийг өгнө үү.
                  Тест нь тухайн мэргэжил танд үнэхээр тохирч байгаа эсэхийг тодорхойлж, итгэлтэй байхад тусална.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { icon: "🎯", text: "8 мэргэжлийн чиглэлээс сонгох боломжтой" },
                    { icon: "⚡", text: "5 асуулт — 3 минутад дуусна" },
                    { icon: "📊", text: "Тохирлын хувь болон чадварын дүн шинжилгээ" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm" style={{ color: "rgba(226,232,240,0.65)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/career-confirmation-test"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "#6ee7b7", color: "#080c14", boxShadow: "0 0 30px rgba(110,231,183,0.2)" }}
                >
                  Мэргэжил шалгах
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Right — career cards preview */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "💻", name: "Програм хангамжийн инженер", accent: "#6ee7b7", pct: 94 },
                  { emoji: "🎯", name: "Бүтээгдэхүүний менежер", accent: "#f5a623", pct: 78 },
                  { emoji: "🎨", name: "UX Дизайнер", accent: "#a78bfa", pct: 85 },
                  { emoji: "📊", name: "Өгөгдлийн шинжээч", accent: "#fbbf24", pct: 71 },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="text-2xl mb-2">{c.emoji}</div>
                    <div className="text-xs font-semibold mb-3 leading-snug" style={{ color: "#f1f5f9" }}>
                      {c.name}
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span style={{ color: "rgba(226,232,240,0.4)" }}>Тохирол</span>
                      <span className="font-bold" style={{ color: c.accent }}>{c.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#080c14" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(245,166,35,0.08) 0%, transparent 60%)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 text-center relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}
            >
              🚀 Үнэгүй · Бүртгэл шаардлагагүй
            </div>
            <h2
              className="font-black leading-tight mb-5"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "#f8fafc", letterSpacing: "-0.03em" }}
            >
              Өнөөдөр карьерийн<br />
              <span
                style={{
                  background: "linear-gradient(90deg,#f5a623,#fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                замаа тодорхойл
              </span>
            </h2>
            <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: "rgba(226,232,240,0.45)" }}>
              33 минут зарцуулаад таны ирээдүйн карьерийн бүрэн зураглалыг авна уу.
            </p>
            <Link
              href="/career-assessment"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base transition-all"
              style={{ background: "#f5a623", color: "#080c14", boxShadow: "0 0 40px rgba(245,166,35,0.3)" }}
            >
              Үнэлгээ эхлэх — үнэгүй
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black"
              style={{ background: "linear-gradient(135deg,#f5a623,#e8870a)", color: "#080c14" }}
            >
              М
            </div>
            <span className="text-sm font-bold" style={{ color: "#f8fafc" }}>
              Мэргэжил<span style={{ color: "#f5a623" }}>.мн</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.3)" }}>
            © 2026 Мэргэжил.мн — Монголын карьер удирдамжийн платформ
          </p>
          <div className="flex items-center gap-5">
            <Link href="/career-assessment" className="text-xs transition-colors" style={{ color: "rgba(226,232,240,0.4)" }}>
              Үнэлгээ
            </Link>
            <Link href="/sign-up-login-screen" className="text-xs transition-colors" style={{ color: "rgba(226,232,240,0.4)" }}>
              Нэвтрэх
            </Link>
            <Link href="/home" className="text-xs transition-colors" style={{ color: "rgba(226,232,240,0.4)" }}>
              Хуучин хуудас
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
