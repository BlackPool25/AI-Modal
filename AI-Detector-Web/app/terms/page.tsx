import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service and user agreement for using DetectX AI content detection platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-foreground/80 mb-6">
            Last updated: October 25, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 mb-4">
              By accessing and using DetectX ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-foreground/80 mb-4">
              DetectX provides AI-generated content detection services. You agree to use the Service only for lawful purposes and in accordance with these Terms.
            </p>
            <p className="text-foreground/80 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Attempt to reverse engineer or circumvent the detection algorithms</li>
              <li>Upload malicious content or content you don't have rights to analyze</li>
              <li>Use the Service to harass, abuse, or harm others</li>
              <li>Overload or interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-foreground/80 mb-4">
              When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Content and Data</h2>
            <p className="text-foreground/80 mb-4">
              Content uploaded to DetectX is processed for detection purposes. We do not claim ownership of your content, but you grant us the right to process and analyze it to provide our services.
            </p>
            <p className="text-foreground/80 mb-4">
              We retain uploaded content temporarily for analysis purposes and may use anonymized data to improve our detection algorithms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Detection Results</h2>
            <p className="text-foreground/80 mb-4">
              While we strive for accuracy, DetectX's detection results are provided "as is" without warranties. Detection algorithms may not be 100% accurate, and results should be used as guidance, not definitive proof.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-foreground/80 mb-4">
              The Service and its original content, features, and functionality are owned by DetectX and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-foreground/80 mb-4">
              DetectX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-foreground/80 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-foreground/80 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-foreground/80 mb-4">
              If you have any questions about these Terms, please contact us at contact@detectx.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
