import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] px-4 py-16 font-mono text-[color:var(--text-primary)]">
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
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">
            Terms and Conditions
          </h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            <strong className="text-[color:var(--text-primary)]">
              Last updated:
            </strong>{" "}
            January 16, 2026
          </p>
        </div>

        <p className="text-[color:var(--text-secondary)] leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the website, software, and services provided by{" "}
          <strong className="text-[color:var(--text-primary)]">
            Regrada, Inc.
          </strong>{" "}
          (&quot;Regrada,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) (collectively, the &quot;Service&quot;).
        </p>

        <p className="text-[color:var(--text-secondary)] leading-relaxed">
          By accessing or using the Service, you agree to be bound by these
          Terms. If you do not agree, do not use the Service.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            1. Eligibility
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You must be at least 18 years old and have the legal authority to
            enter into these Terms. If you use the Service on behalf of an
            organization, you represent that you are authorized to bind that
            organization.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            2. The Service
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Regrada provides tooling to test, monitor, and detect behavioral
            regressions in AI-powered systems. The Service is provided on an
            &quot;as is&quot; and &quot;as available&quot; basis. We may modify,
            suspend, or discontinue any part of the Service at any time, with or
            without notice.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            3. Accounts
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            4. Acceptable Use
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You agree not to:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-secondary)]">
            <li>
              Use the Service in violation of any applicable law or regulation
            </li>
            <li>Interfere with or disrupt the Service or infrastructure</li>
            <li>Attempt to gain unauthorized access to systems or data</li>
            <li>
              Reverse engineer or misuse the Service except as permitted by law
            </li>
            <li>
              Use the Service to develop or deploy harmful, deceptive, or
              unlawful AI systems
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            5. Customer Data
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You retain ownership of any data you submit to the Service
            &quot;Customer Data&quot;. You grant Regrada a limited right to
            process Customer Data solely to provide and improve the Service.
          </p>

          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Customer Data may be processed on cloud infrastructure provided by
            <strong className="text-[color:var(--text-primary)]">
              {" "}
              Amazon Web Services (AWS)
            </strong>
            , acting as a data processor under contractual obligations.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            6. Data Protection and Privacy
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Our processing of personal data is governed by our Privacy Policy,
            which forms part of these Terms.
          </p>

          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Where applicable, Regrada processes personal data in accordance
            with:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-secondary)]">
            <li>General Data Protection Regulation (GDPR)</li>
            <li>UK GDPR and Swiss data protection laws</li>
            <li>California Consumer Privacy Act, as amended by CPRA</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            7. Fees and Payment
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Certain features may require payment. Fees, billing terms, and
            payment obligations will be disclosed before purchase. All fees are
            non-refundable except as required by law.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            8. Intellectual Property
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            The Service, including all software, documentation, and branding, is
            the exclusive property of Regrada and its licensors. These Terms do
            not grant you any ownership rights in the Service.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            9. Feedback
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            If you provide feedback or suggestions, you grant Regrada a
            perpetual, irrevocable, royalty-free right to use it without
            restriction.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            10. Termination
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You may stop using the Service at any time. We may suspend or
            terminate access to the Service if you violate these Terms or use
            the Service in a manner that poses legal, security, or operational
            risk.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            11. Disclaimers
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM
            ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            12. Limitation of Liability
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, REGRADA SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, OR FOR LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION.
          </p>

          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU
            FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            13. Indemnification
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            You agree to indemnify and hold us harmless from any claims,
            damages, or expenses arising from your use of the Service or
            violation of these Terms.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            14. Governing Law
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            These Terms are governed by the laws of the State of Delaware, USA,
            without regard to conflict-of-laws principles.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            15. Changes to These Terms
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            We may update these Terms from time to time. Continued use of the
            Service after changes become effective constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            16. Contact
          </h2>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Email:{" "}
            <a
              href="mailto:legal@regrada.ai"
              className="text-[color:var(--accent)] transition-colors hover:text-[color:var(--text-primary)]"
            >
              legal@regrada.ai
            </a>
            <br />
            Company: Regrada, Inc.
          </p>
        </section>
      </main>
    </div>
  );
}
