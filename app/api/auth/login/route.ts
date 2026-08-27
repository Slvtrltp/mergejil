import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, getSessionCookieOptions } from "@/lib/auth";

const DEMO_EMAIL = "demo@mergejil.mn";
const DEMO_PASSWORD = "demo1234";
const DEMO_USER = { id: 0, email: DEMO_EMAIL, first_name: "Demo", last_name: "User" };

type DbUser = { id: number; email: string; first_name: string; last_name: string };
type DbResult = { user: DbUser } | { error: string; status: number } | null;

async function tryDatabaseLogin(email: string, password: string): Promise<DbResult> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { getPool, initializeSchema } = await import("@/lib/db");
    await initializeSchema();
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return { error: "И-мэйл эсвэл нууц үг буруу байна", status: 401 };
    }
    const dbUser = result.rows[0] as DbUser & { password_hash: string };
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    if (!valid) {
      return { error: "И-мэйл эсвэл нууц үг буруу байна", status: 401 };
    }
    return { user: dbUser };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "И-мэйл болон нууц үг шаардлагатай" },
        { status: 400 }
      );
    }

    const dbResult = await tryDatabaseLogin(email, password);

    let resolvedUser: DbUser | null = null;

    if (dbResult && "error" in dbResult) {
      return NextResponse.json({ error: dbResult.error }, { status: dbResult.status });
    } else if (dbResult && "user" in dbResult) {
      resolvedUser = dbResult.user;
    } else {
      // DB unavailable — allow demo account
      if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        resolvedUser = DEMO_USER;
      } else {
        return NextResponse.json(
          { error: "И-мэйл эсвэл нууц үг буруу байна" },
          { status: 401 }
        );
      }
    }

    const token = signToken({
      userId: resolvedUser.id,
      email: resolvedUser.email,
      firstName: resolvedUser.first_name,
      lastName: resolvedUser.last_name,
    });

    const cookieOpts = getSessionCookieOptions();
    const response = NextResponse.json({
      success: true,
      user: {
        id: resolvedUser.id,
        email: resolvedUser.email,
        firstName: resolvedUser.first_name,
        lastName: resolvedUser.last_name,
      },
    });
    response.cookies.set(cookieOpts.name, token, cookieOpts);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Серверийн алдаа гарлаа" }, { status: 500 });
  }
}
