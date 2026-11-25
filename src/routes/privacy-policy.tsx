import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | guessme.co" },
      {
        name: "description",
        content: "Read the guessme.co privacy policy placeholder and contact information.",
      },
      { property: "og:url", content: "https://guessme.co/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://guessme.co/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link to="/" className="legal-brand">guessme.co</Link>
        <h1>Privacy Policy</h1>
        <p>
          This is a starter placeholder, not a final policy. Before launch,
          replace it with an accurate policy covering data collected by
          GuessMe.co and each linked product, analytics, cookies, contact
          methods, retention, and applicable legal requirements.
        </p>
        <p>
          Contact: <a href="mailto:hello@guessme.co">hello@guessme.co</a>
        </p>
        <Link to="/" className="legal-home-link">Back to home</Link>
      </article>
    </main>
  );
}
