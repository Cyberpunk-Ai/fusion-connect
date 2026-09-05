import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Shared across mounts so a profile is only ever provisioned once per user.
const profileSetup = new Map<string, Promise<void>>();

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Join — Spaces" },
      {
        name: "description",
        content:
          "Create your Spaces account or sign back in to post, join live audio rooms, message creators and tip the people you follow.",
      },
      { property: "og:title", content: "Sign In or Join — Spaces" },
      { property: "og:description", content: "Create a Spaces account or sign in to post, chat and go live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  async function ensureProfile(authUserId: string, fallbackEmail: string) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (existing) {
      const wanted = displayName.trim();
      if (wanted && existing.display_name !== wanted) {
        await supabase.from("profiles").update({ display_name: wanted }).eq("id", existing.id);
      }
      return;
    }

    const handle = (fallbackEmail.split("@")[0] || "member").replace(/[^a-z0-9_]/gi, "").toLowerCase();
    await supabase.from("profiles").upsert(
      {
        auth_user_id: authUserId,
        username: `${handle}${Math.floor(Math.random() * 9000 + 1000)}`,
        display_name: displayName.trim() || handle,
      },
      { onConflict: "auth_user_id", ignoreDuplicates: true },
    );
  }

  useEffect(() => {
    let done = false;
    const finish = async (userId: string, mail: string) => {
      if (done) return;
      done = true;
      await ensureProfile(userId, mail);
      void navigate({ to: "/feed" });
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void finish(data.session.user.id, data.session.user.email ?? "");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void finish(session.user.id, session.user.email ?? "");
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSocial(provider: "google" | "apple") {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Sign-in failed");
        return;
      }
      if (result.redirected) return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { display_name: displayName.trim() || undefined },
          },
        });
        if (error) throw error;

        // Email confirmation is on: signUp returns no session, so the person is
        // not signed in yet. Don't pretend they are — keep them on this page.
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("signin");
          setPassword("");
          return;
        }

        toast.success("Account created — welcome to Spaces!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }
      void navigate({ to: "/feed" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-pink text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <h1 className="text-xl font-black">{mode === "signin" ? "Welcome back" : "Join Spaces"}</h1>
        </div>

        <div className="mb-5 flex rounded-2xl bg-muted/40 p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors",
                mode === m ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
              )}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSocial("google")}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted/50 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.7z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.3 7.3 0 0 1-11-3.8H1v3.1A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1a12 12 0 0 0 0 10.8z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSocial("apple")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8s-1.8-.8-2.9-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.3zM14.2 5.5c.6-.8 1-1.8.9-2.9-.9.1-2 .6-2.7 1.4-.6.7-1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3z" />
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </main>
  );
}
