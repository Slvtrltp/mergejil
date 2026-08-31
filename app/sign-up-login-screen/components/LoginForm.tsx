"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Detect redirect param (works on client after mount)
  const [redirectTo, setRedirectTo] = React.useState<string | null>(null);
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    if (r === "results") setRedirectTo("/career-profile-recommendations");
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  const fillDemoAccount = () => {
    setValue("email", "demo@mergejil.mn");
    setValue("password", "demo1234");
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Нэвтрэхэд алдаа гарлаа");
      } else {
        toast.success("Амжилттай нэвтэрлээ! 🎉", {
          description: `Тавтай морилно уу, ${json.user?.firstName || json.user?.email}!`,
        });
        router.push(redirectTo || "/career-assessment");
        router.refresh();
      }
    } catch {
      toast.error("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Сайн уу 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Бүртгэлтэй и-мэйлээрээ нэвтэрнэ үү
        </p>
      </div>

      {/* Google auth button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all duration-150 active:scale-[0.98] mb-4"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        Google-ээр нэвтрэх
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">эсвэл</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="login-email"
          className="block text-sm font-semibold text-foreground mb-1.5"
        >
          И-мэйл хаяг
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="та@example.mn"
          className={`w-full px-4 py-3 border rounded-xl text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all duration-150 ${
            errors.email ? "border-danger" : "border-input"
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
          <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-foreground"
          >
            Нууц үг
          </label>
          <button
            type="button"
            className="text-xs text-primary hover:underline font-medium"
          >
            Нууц үгээ мартсан уу?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all duration-150 ${
              errors.password ? "border-danger" : "border-input"
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
          <p className="mt-1.5 text-xs text-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2 mb-6">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-input accent-primary"
          {...register("remember")}
        />
        <label
          htmlFor="remember"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Намайг сана
        </label>
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

      {/* Demo account button */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        <button
          type="button"
          onClick={fillDemoAccount}
          className="text-primary font-normal hover:underline"
        >
          Demo account
        </button>
      </p>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Бүртгэл байхгүй юу?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary font-semibold hover:underline"
        >
          Бүртгүүлэх
        </button>
      </p>
    </form>
  );
}
