import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how DetectX collects, uses, and protects your personal information and data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-foreground/80 mb-6">
            Last updated: October 25, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-foreground/80 mb-4">
              DetectX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI content detection service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
            <p className="text-foreground/80 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>Register for an account</li>
              <li>Use our services</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p className="text-foreground/80 mb-4">
              This may include: name, email address, username, and profile information.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data</h3>
            <p className="text-foreground/80 mb-4">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Detection requests and results</li>
              <li>Uploaded content (temporarily, for analysis)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-foreground/80 mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>To provide and maintain our Service</li>
              <li>To process your detection requests</li>
              <li>To improve our AI detection algorithms</li>
              <li>To send you updates and notifications</li>
              <li>To monitor usage and prevent abuse</li>
              <li>To provide customer support</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-foreground/80 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
            <p className="text-foreground/80 mb-4">
              Uploaded content is:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>Processed in secure servers</li>
              <li>Encrypted during transmission</li>
              <li>Retained only as long as necessary for analysis</li>
              <li>Automatically deleted after processing (unless saved to your account)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-foreground/80 mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in operating our Service (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-foreground/80 mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-foreground/80 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="text-foreground/80 mb-4">
              To exercise these rights, please contact us at privacy@detectx.ai
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-foreground/80 mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-foreground/80 mb-4">
              Your information may be transferred to and maintained on servers located outside of your jurisdiction. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-foreground/80 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-foreground/80 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none mb-4 text-foreground/80">
              <li>Email: privacy@detectx.ai</li>
              <li>Website: https://detectx.ai/contact</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
