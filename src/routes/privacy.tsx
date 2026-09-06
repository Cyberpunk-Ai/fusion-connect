import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./about";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Spaces" },
      {
        name: "description",
        content:
          "How Spaces collects, uses and protects your information, and the choices you have over your data.",
      },
      { property: "og:title", content: "Privacy Policy — Spaces" },
      {
        property: "og:description",
        content: "What data Spaces collects, how it is used, and how to control or delete it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" subtitle="Last updated September 2026.">
      <h2>Information we collect</h2>
      <ul>
        <li>Account details you give us: email, username, display name, bio and profile photo.</li>
        <li>Content you create: posts, comments, messages, stories and uploaded media.</li>
        <li>Usage information such as which pages you open and basic device details.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your information to run your account, show your content to the people you intend,
        deliver notifications, prevent abuse, and give creators aggregate statistics about their own
        audience. We do not sell your personal information.
      </p>

      <h2>Sharing</h2>
      <p>
        We share information only with the service providers that make the platform work — hosting,
        databases, file storage, and payment processing — and when the law requires it. Payment card
        details are handled by our payment processor and never stored on our servers.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Edit or remove your profile information at any time in Settings.</li>
        <li>Make your account private, hide activity, and control notifications.</li>
        <li>Delete your posts and uploads; deleting your account removes your content.</li>
      </ul>

      <h2>Retention and security</h2>
      <p>
        We keep your data for as long as your account is active. Access is restricted per account,
        and traffic is encrypted in transit. No system is perfectly secure, so please use a strong,
        unique password.
      </p>

      <h2>Contact</h2>
      <p>
        We have not published a privacy contact address here yet. Send us the email or postal
        address you want listed and we will add it. This page is a general description of our
        practices, not legal advice — have a lawyer review it before you rely on it publicly.
      </p>
    </LegalShell>
  );
}
