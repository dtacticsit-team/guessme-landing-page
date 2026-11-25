import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use | guessme.co" },
      {
        name: "description",
        content: "Read the guessme.co terms of use placeholder and contact information.",
      },
      { property: "og:url", content: "https://guessme.co/terms-of-use" },
    ],
    links: [{ rel: "canonical", href: "https://guessme.co/terms-of-use" }],
  }),
  component: TermsOfUsePage,
});

function TermsOfUsePage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link to="/" className="legal-brand">guessme.co</Link>
        <h1>Terms of Use</h1>
        <p>
          This is a starter placeholder, not legal advice. Before launch,
          replace it with terms covering the website, linked products,
          acceptable use, intellectual property, disclaimers, liability, and
          governing law.
        </p>
        <p>
          Contact: <a href="mailto:hello@guessme.co">hello@guessme.co</a>
        </p>
        <Link to="/" className="legal-home-link">Back to home</Link>
      </article>
    </main>
  );
}
