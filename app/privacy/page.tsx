'use client'
import { useRouter } from 'next/navigation'
import { Sparkles } from '@/components/MagicUI'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={8} />

      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={() => router.back()}
          className="text-purple-300 hover:text-white mb-6"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <h1 className="text-white text-3xl font-display mb-6">Privacy Policy</h1>
          <p className="text-purple-300 text-sm mb-8">Last updated: January 2026</p>

          <div className="prose prose-invert prose-purple max-w-none space-y-6 text-purple-100">
            
            <section>
              <h2 className="text-white text-xl font-display mb-3">1. Introduction</h2>
              <p>
                My Story Magic ("we", "our", "us") is committed to protecting your privacy and the 
                privacy of your children. This policy explains how we collect, use, and protect 
                your personal information in compliance with Australian Privacy Principles.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">2. Information We Collect</h2>
              
              <h3 className="text-purple-200 font-semibold mt-4 mb-2">Account Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email address (for account creation and communication)</li>
                <li>Authentication data (via Google Sign-In)</li>
              </ul>

              <h3 className="text-purple-200 font-semibold mt-4 mb-2">Child Profile Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Child's first name (used in story generation)</li>
                <li>Child's age (to create age-appropriate content)</li>
                <li>Child's interests (to personalise stories)</li>
              </ul>
              <p className="mt-2 text-sm text-purple-300">
                Note: We only collect first names, never full names, addresses, or other identifying 
                information about children.
              </p>

              <h3 className="text-purple-200 font-semibold mt-4 mb-2">Voice Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Voice recordings (for Premium voice cloning feature)</li>
                <li>Voice clone data (processed and stored securely)</li>
              </ul>

              <h3 className="text-purple-200 font-semibold mt-4 mb-2">Usage Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Stories generated and saved</li>
                <li>Feature usage and preferences</li>
                <li>App performance and error data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To generate personalised bedtime stories</li>
                <li>To create and maintain voice clones (Premium)</li>
                <li>To manage your subscription and account</li>
                <li>To improve our AI and services</li>
                <li>To communicate important updates</li>
                <li>To ensure content safety and compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">4. Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption and security practices:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Data is encrypted in transit (HTTPS/TLS)</li>
                <li>Database hosted on secure cloud infrastructure (Supabase)</li>
                <li>Voice data processed by secure third-party providers (ElevenLabs, Google)</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">5. Third-Party Services</h2>
              <p>We use the following third-party services to provide our features:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Google</strong> - Authentication and text-to-speech</li>
                <li><strong>Anthropic</strong> - AI story generation</li>
                <li><strong>ElevenLabs</strong> - Voice cloning technology</li>
                <li><strong>Supabase</strong> - Database and authentication</li>
                <li><strong>Vercel</strong> - App hosting</li>
              </ul>
              <p className="mt-2">
                Each provider has their own privacy policy and data handling practices. 
                We only share the minimum data necessary to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">6. Children's Privacy</h2>
              <p>
                We take children's privacy seriously:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>We do not collect data directly from children</li>
                <li>All child profiles are created and managed by parents/guardians</li>
                <li>We only store first names and age-appropriate interests</li>
                <li>Generated stories are not shared publicly</li>
                <li>We do not use children's data for advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">7. Your Rights</h2>
              <p>Under Australian Privacy Principles, you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Correction</strong> - Update or correct inaccurate data</li>
                <li><strong>Deletion</strong> - Delete your account and all associated data</li>
                <li><strong>Portability</strong> - Export your stories and data</li>
                <li><strong>Complaint</strong> - Lodge a complaint with the OAIC if unsatisfied</li>
              </ul>
              <p className="mt-2">
                You can exercise these rights through the Settings page in the app, or by 
                contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">8. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. When you delete your 
                account:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>All personal data is deleted within 30 days</li>
                <li>Voice clones are permanently deleted</li>
                <li>Generated stories are removed</li>
                <li>Some anonymised usage data may be retained for analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">9. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and app functionality. We do not 
                use advertising cookies or third-party tracking for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">10. International Data</h2>
              <p>
                While we are based in Australia, some data processing occurs on servers in 
                other countries (e.g., USA for cloud services). We ensure all providers meet 
                adequate data protection standards.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                significant changes via email or in-app notification. Continued use of the 
                Service after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-display mb-3">12. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, please contact us 
                through the app's support feature.
              </p>
              <p className="mt-4 text-purple-300 text-sm">
                You may also lodge a complaint with the Office of the Australian Information 
                Commissioner (OAIC) at <a href="https://www.oaic.gov.au" className="underline hover:text-white">www.oaic.gov.au</a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}
