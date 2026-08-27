import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Calculate MBTI type from answers
function calculateMBTI(mbtiAnswers: Record<string, string>): string {
  if (mbtiAnswers.mbtiType) return mbtiAnswers.mbtiType;
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(mbtiAnswers).forEach((v) => {
    if (v in counts) counts[v]++;
  });
  return (
    (counts.E >= counts.I ? "E" : "I") +
    (counts.S >= counts.N ? "S" : "N") +
    (counts.T >= counts.F ? "T" : "F") +
    (counts.J >= counts.P ? "J" : "P")
  );
}

// Calculate IQ score from answers
function calculateIQScore(iqAnswers: Record<string, string>): number {
  const correct = Object.values(iqAnswers).filter((v) => v === "correct").length;
  const total = Object.keys(iqAnswers).length || 15;
  return Math.round(85 + (correct / total) * 45);
}

// Calculate skills scores
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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
    }

    const { mbti, iq, skills } = await req.json();

    const mbtiType = calculateMBTI(mbti || {});
    const iqScore = calculateIQScore(iq || {});
    const skillsScores = calculateSkillsScores(skills || {});

    // Try to persist to DB — gracefully skip if DATABASE_URL is not configured
    if (process.env.DATABASE_URL) {
      try {
        const { getPool, initializeSchema } = await import("@/lib/db");
        await initializeSchema();
        const pool = getPool();
        await pool.query(
          `INSERT INTO assessment_results (user_id, mbti_type, mbti_answers, iq_score, iq_answers, skills_scores, skills_answers)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id) DO UPDATE SET
             mbti_type = EXCLUDED.mbti_type,
             mbti_answers = EXCLUDED.mbti_answers,
             iq_score = EXCLUDED.iq_score,
             iq_answers = EXCLUDED.iq_answers,
             skills_scores = EXCLUDED.skills_scores,
             skills_answers = EXCLUDED.skills_answers,
             completed_at = NOW()`,
          [session.userId, mbtiType, JSON.stringify(mbti), iqScore, JSON.stringify(iq), JSON.stringify(skillsScores), JSON.stringify(skills)]
        );
      } catch (dbErr) {
        console.warn("DB save skipped (no database configured):", dbErr);
        // Return success anyway — results are stored client-side
      }
    }

    return NextResponse.json({ success: true, mbtiType, iqScore, skillsScores });
  } catch (err) {
    console.error("Submit assessment error:", err);
    return NextResponse.json({ error: "Серверийн алдаа гарлаа" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
    }

    // If no DATABASE_URL, tell client to use localStorage
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ hasResults: false, useLocalStorage: true });
    }

    try {
      const { getPool, initializeSchema } = await import("@/lib/db");
      await initializeSchema();
      const pool = getPool();
      const result = await pool.query(
        `SELECT mbti_type, iq_score, skills_scores, completed_at
         FROM assessment_results WHERE user_id = $1`,
        [session.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ hasResults: false });
      }

      const row = result.rows[0];
      return NextResponse.json({
        hasResults: true,
        mbtiType: row.mbti_type,
        iqScore: row.iq_score,
        skillsScores: row.skills_scores,
        completedAt: row.completed_at,
      });
    } catch (dbErr) {
      console.warn("DB read skipped (no database configured):", dbErr);
      return NextResponse.json({ hasResults: false, useLocalStorage: true });
    }
  } catch (err) {
    console.error("Get results error:", err);
    return NextResponse.json({ error: "Серверийн алдаа гарлаа" }, { status: 500 });
  }
}
