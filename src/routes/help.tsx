import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./about";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — Spaces" },
      {
        name: "description",
        content:
          "Answers to common Spaces questions: accounts, posting, tips and payouts, plans, and account safety.",
      },
      { property: "og:title", content: "Help Center — Spaces" },
      {
        property: "og:description",
        content: "Getting started, posting, tips and payouts, plans and safety on Spaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I create an account?",
    a: "Open the sign-in page and choose email, Google or Apple. New accounts land straight on your feed with a profile created for you.",
  },
  {
    q: "How do I post?",
    a: "Use the composer at the top of your feed. You can add text and photos; uploads are stored privately to your account and shown on your posts.",
  },
  {
    q: "How do tips and payouts work?",
    a: "Supporters can send you a tip from your profile or a post. Earnings collect as a pending balance in Settings → Monetization, where you choose a payout destination.",
  },
  {
    q: "How do I change my plan?",
    a: "Open Plans & Perks, pick the plan you want, and confirm. You can switch between monthly and yearly billing at any time.",
  },
  {
    q: "How do I keep my account safe?",
    a: "Use a unique password, review Settings → Privacy & safety, and report anything abusive with the report option on a post or profile.",
  },
  {
    q: "Something is broken — what now?",
    a: "We have not published a support email here yet. Send us the address you want listed and we will add it to this page.",
  },
];

function HelpPage() {
  return (
    <LegalShell title="Help Center" subtitle="Short answers to the questions we get most.">
      {faqs.map((f) => (
        <div key={f.q} className="rounded-2xl border border-border/70 bg-card p-5">
          <h2 className="!pt-0 !text-base">{f.q}</h2>
          <p className="mt-2 text-muted-foreground">{f.a}</p>
        </div>
      ))}
    </LegalShell>
  );
}
