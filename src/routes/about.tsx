import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Spaces — Social for creators & communities" },
      {
        name: "description",
        content:
          "Spaces is a social platform built for creators: rooms, stories, direct tips and analytics, without the noise.",
      },
      { property: "og:title", content: "About Spaces" },
      {
        property: "og:description",
        content: "Why Spaces exists and what we build for creators and communities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalShell title="About Spaces" subtitle="A social home built around creators, not algorithms.">
      <p>
        Spaces is a social platform for people who make things. Instead of a single endless timeline,
        Spaces gives every community its own room, every creator their own storefront, and every
        member control over what they see.
      </p>
      <h2>What we build</h2>
      <ul>
        <li>Live rooms and stories for real-time conversation.</li>
        <li>Direct fan support with tips and creator payouts.</li>
        <li>Clear analytics so creators know what actually resonates.</li>
        <li>Team workspaces and a developer API for larger publishers.</li>
      </ul>
      <h2>How we operate</h2>
      <p>
        Your posts belong to you. We do not sell personal data, and creators keep the large majority
        of what their audience sends them — on our top plan, all of it.
      </p>
      <h2>Contact</h2>
      <p>
        We have not published a company address or phone number here yet. Send us the details you
        want listed and we will add them.
      </p>
    </LegalShell>
  );
}

export function LegalShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-black tracking-tight">
            Spaces
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link to="/about" className="hover:text-brand">
              About
            </Link>
            <Link to="/help" className="hover:text-brand">
              Help
            </Link>
            <Link to="/privacy" className="hover:text-brand">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-brand">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
        <div className="mt-10 space-y-5 text-sm leading-relaxed text-foreground/90 [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
        <div className="mt-14 border-t border-border/70 pt-6 text-sm">
          <Link to="/" className="font-bold text-brand hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
