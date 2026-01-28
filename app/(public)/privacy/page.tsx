import Link from "next/link";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-(--page-bg) px-4 py-16 font-mono text-(--text-primary)">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="mb-6 flex justify-center">
          <Link href="/" aria-label="Regrada home">
            <picture>
              <source
                media="(prefers-color-scheme: dark)"
                srcSet="/regrada/regrada-banner-large-light.png"
              />
              <img
                src="/regrada/regrada-banner-large.png"
                alt="Regrada"
                width={720}
                height={180}
                className="h-auto w-48 sm:w-56 md:w-64"
              />
            </picture>
          </Link>
        </header>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Privacy Policy
          </h1>
          <p className="text-sm text-(--text-muted)">
            <strong className="text-(--text-primary)">
              Last updated:
            </strong>{" "}
            January 16, 2026
          </p>
        </div>

        <p className="text-(--text-secondary) leading-relaxed">
          This Privacy Policy explains how{" "}
          <strong className="text-(--text-primary)">
            Regrada, Inc.
          </strong>{" "}
          (“Regrada,” “we,” “us,” or “our”) collects, uses, discloses, and
          protects personal information when you access or use our website and
          services (collectively, the “Service”).
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            1. Information We Collect
          </h2>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Information You Provide
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
              <li>Name, email address, and contact details</li>
              <li>Account credentials and authentication data</li>
              <li>Communications with us (support requests, feedback)</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Information Collected Automatically
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
              <li>
                IP address, device identifiers, browser type, and operating
                system
              </li>
              <li>
                Usage data such as pages viewed, actions taken, and timestamps
              </li>
              <li>Log data and diagnostic information</li>
            </ul>
            <p className="text-(--text-secondary) leading-relaxed">
              We may use cookies and similar technologies to collect this
              information.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Information from Third Parties
            </h3>
            <p className="text-(--text-secondary) leading-relaxed">
              We may receive information from third-party services you connect
              to Regrada, such as CI/CD platforms, authentication providers, or
              version control systems, subject to their privacy policies and
              your settings.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            2. How We Use Information
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
            <li>Provide, operate, and maintain the Service</li>
            <li>Monitor usage, performance, and reliability</li>
            <li>Improve and develop new features</li>
            <li>Communicate with you</li>
            <li>Provide customer support</li>
            <li>Detect, prevent, and address security issues</li>
            <li>Comply with legal obligations and enforce agreements</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            3. Legal Bases for Processing (GDPR)
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
            <li>Performance of a contract</li>
            <li>Legitimate interests</li>
            <li>Consent (where required)</li>
            <li>Legal obligations</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            4. How We Share Information
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            We do{" "}
            <strong className="text-(--text-primary)">not</strong>{" "}
            sell personal information.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
            <li>Service providers (hosting, analytics, email delivery)</li>
            <li>
              Cloud infrastructure providers, including{" "}
              <strong className="text-(--text-primary)">
                Amazon Web Services (AWS)
              </strong>
              , acting as a data processor
            </li>
            <li>Professional advisors</li>
            <li>Authorities when required by law</li>
            <li>Business transfers (merger, acquisition, asset sale)</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            5. Data Retention
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            We retain personal information only as long as necessary to provide
            the Service, comply with legal obligations, resolve disputes, and
            enforce agreements.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            6. Cookies and Tracking Technologies
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            You can control cookies through your browser settings. Disabling
            cookies may affect Service functionality. Where required, we obtain
            consent for non-essential cookies.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            7. Data Security
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            We use reasonable administrative, technical, and organizational
            safeguards, including secure AWS infrastructure. However, no system
            is completely secure.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            8. International Data Transfers
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            We may process personal information outside your country of
            residence, including in the United States, using appropriate legal
            safeguards.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            9. Your Rights (GDPR)
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
            <li>Access, correction, or deletion of personal data</li>
            <li>Restriction or objection to processing</li>
            <li>Data portability</li>
            <li>Withdrawal of consent</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            10. California Privacy Rights (CPRA)
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-(--text-secondary)">
            <li>Right to know what personal information is collected</li>
            <li>Right to request deletion or correction</li>
            <li>
              Right to opt out of sale or sharing (we do not sell or share data)
            </li>
            <li>Right to non-discrimination</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            11. Children&apos;s Privacy
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            The Service is not intended for children under 13 (or under 16 where
            applicable).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            12. Changes to This Policy
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be
            reflected by the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            13. Contact Us
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            Email:{" "}
            <a
              href="mailto:privacy@regrada.com"
              className="text-accent transition-colors hover:text-(--text-primary)"
            >
              privacy@regrada.com
            </a>
            <br />
            Company: Regrada
          </p>
        </section>
      </main>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
