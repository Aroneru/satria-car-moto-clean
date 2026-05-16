"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("fixed inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center", className)} {...props}>
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="bg-yellow-400 rounded-t-2xl p-8 text-center mb-0">
          <div className="flex justify-center mb-6" >
            <Image
              src="/images/logo.png"
              alt="Satria Car & Moto Clean"
              width={96}
              height={96}
              className="shadow-lg rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Satria Car & Moto Clean
          </h1>
          <p className="text-slate-700 text-sm">Dashboard Management System</p>
        </div>

        {/* Login Card */}
        <Card className="rounded-none border-0 bg-white shadow-2xl">
          <CardContent className="pt-8 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Login ke Dashboard
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold select-auto">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!bg-white !border-2 !border-slate-500 !text-slate-900 !placeholder-slate-400 rounded-lg h-12 focus:!border-yellow-400 !outline-none autofill:!bg-white autofill:!text-slate-900 autofill:shadow-[inset_0_0_0px_1000px_rgb(255_255_255)]"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold select-auto">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!bg-white !border-2 !border-slate-500 !text-slate-900 !placeholder-slate-400 rounded-lg h-12 focus:!border-yellow-400 !outline-none pr-10 autofill:!bg-white autofill:!text-slate-900 autofill:shadow-[inset_0_0_0px_1000px_rgb(255_255_255)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-900 transition-colors w-5 h-5"
                  >
                    <Image
                      src={!showPassword ? "/images/eye-closed.svg" : "/images/eye-open.svg"}
                      alt={!showPassword ? "Show password" : "Hide password"}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold h-12 text-base rounded-lg transition-colors shadow-lg"
              >
                {isLoading ? "Sedang login..." : "Login"}
              </Button>


            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="bg-white text-center text-slate-500 text-xs py-4 border-t border-slate-200 rounded-b-2xl">
          © 2026 Satria Car & Moto Clean. All rights reserved.
        </div>

        {/* Back to Website Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white text-sm hover:text-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
