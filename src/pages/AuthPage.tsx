import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase-external/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { lang } = useLanguage();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/admin", { replace: true });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success(lang === "th" ? "สมัครสำเร็จ! โปรดเข้าสู่ระบบ" : "Signed up! Please sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card border-2 border-border rounded-3xl p-6 sm:p-8 cute-shadow">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">
          {mode === "signin"
            ? lang === "th" ? "เข้าสู่ระบบ" : "Sign in"
            : lang === "th" ? "สมัครสมาชิก" : "Sign up"}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {lang === "th" ? "สำหรับผู้ดูแลระบบเท่านั้น" : "Admin access only"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border-2 border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {lang === "th" ? "รหัสผ่าน" : "Password"}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border-2 border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signin"
              ? lang === "th" ? "เข้าสู่ระบบ" : "Sign in"
              : lang === "th" ? "สร้างบัญชี" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-xs text-muted-foreground hover:text-primary mt-4 block w-full text-center"
        >
          {mode === "signin"
            ? lang === "th" ? "ยังไม่มีบัญชี? สมัครเลย" : "No account? Sign up"
            : lang === "th" ? "มีบัญชีแล้ว? เข้าสู่ระบบ" : "Have an account? Sign in"}
        </button>

        <Link to="/" className="text-xs text-muted-foreground hover:text-primary mt-3 block text-center">
          ← {lang === "th" ? "กลับหน้าหลัก" : "Back home"}
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
