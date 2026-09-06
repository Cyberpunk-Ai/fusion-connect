import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./about";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Spaces" },
      {
        name: "description",
        content:
          "The rules for using Spaces: your account, your content, acceptable use, paid plans, and account closure.",
      },
      { property: "og:title", content: "Terms of Service — Spaces" },
      {
        property: "og:description",
        content: "Account rules, content ownership, acceptable use and billing terms for Spaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalShell title="Terms of Service" subtitle="Last updated September 2026.">
      <h2>Your account</h2>
      <p>
        You need an account to post, message or receive tips. Keep your login details private and
        tell us if you think someone else has used your account. You must be old enough to consent
        to these terms where you live.
      </p>

      <h2>Your content</h2>
      <p>
        You keep ownership of everything you post. By posting, you give us permission to store,
        display and distribute that content so the platform can show it to the audience you chose.
        You are responsible for having the rights to what you upload.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>No harassment, hate speech, threats or targeted abuse.</li>
        <li>No illegal content, spam, scams or impersonation.</li>
        <li>No attempts to break, overload or reverse-engineer the service.</li>
      </ul>
      <p>We may remove content or suspend accounts that break these rules.</p>

      <h2>Paid plans and creator earnings</h2>
      <p>
        Paid plans renew automatically for the billing period you choose until you cancel. Cancelling
        stops future charges and keeps access until the end of the current period. Tips and payouts
        are processed by our payment provider; platform fees are shown before you confirm.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can close your account at any time. We may end access if these terms are seriously or
        repeatedly broken.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The service is provided as is, without warranties. This page is a plain-language summary
        rather than lawyer-drafted terms — have a lawyer review it before you rely on it publicly.
      </p>
    </LegalShell>
  );
}
