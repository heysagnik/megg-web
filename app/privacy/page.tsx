import type { Metadata } from 'next'
import { Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for MEGG — India\'s curated men\'s fashion platform.',
  alternates: { canonical: 'https://www.meggfashion.in/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-[var(--container-px)] pt-xl pb-3xl">
      <p className="text-label text-muted mb-[0.75rem]">
        Legal
      </p>
      <h1 className="text-section mb-[0.5rem]">
        Privacy Policy
      </h1>
      <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] italic mb-lg">
        Last updated: 29/01/2026
      </p>

      <div>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG ("we", "our", or "us") values your privacy. This Privacy Policy explains how MEGG
          collects, uses, and protects information when you use the MEGG mobile application ("App").
          By using the MEGG app, you agree to the practices described in this Privacy Policy.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          1. Information We Collect
        </h2>

        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm font-medium underline">
          a) Information You Provide
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>When you choose to sign in using Google, we may receive basic profile information such as your name and email address.</li>
          <li>Signing in is optional. You can use the app without logging in.</li>
        </ul>

        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm font-medium underline">
          b) Automatically Collected Information
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We may collect limited, non-personal information such as:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Device type</li>
          <li>App usage data (screens viewed, interactions)</li>
          <li>App performance and crash data</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          This information helps us improve app performance and user experience.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          2. How We Use Your Information
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We use collected information to:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Improve app functionality and features</li>
          <li>Provide a better fashion discovery experience</li>
          <li>Analyze app performance and usage trends</li>
          <li>Ensure app security and prevent misuse</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We do not sell or rent your personal data to third parties.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          3. Affiliate Links & Third-Party Platforms
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG uses third-party affiliate partners such as Wishlink to generate product links. These
          affiliate links help us understand aggregated performance data such as product clicks and
          completed purchases. This data is used only for analytics and to improve product selection
          and user experience. MEGG does not receive or store personally identifiable information
          related to these transactions.
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG displays curated fashion products with affiliate links. When you click on a product,
          you are redirected to third-party e-commerce platforms such as Myntra, Flipkart, or Amazon
          to complete your purchase.
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG may earn a commission through affiliate links when users make purchases on third-party
          platforms, at no additional cost to the user.
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          Please note:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>MEGG does not sell products directly</li>
          <li>MEGG does not process payments</li>
          <li>Purchases are completed on third-party platforms</li>
          <li>Third-party platforms have their own privacy policies and terms</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We recommend reviewing their privacy policies before making a purchase.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          4. Product Images & Content
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          Product images and information displayed in the app are used only for fashion discovery and
          redirection purposes. MEGG does not claim ownership of third-party product images,
          trademarks, or brand names.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          5. Login & Authentication
        </h2>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Login via Google is optional</li>
          <li>Users may skip login and access app features</li>
          <li>No passwords are stored by MEGG</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          6. Camera & Media Access
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG may request camera access for features such as color guidance or style assistance.
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Camera access is used only when the feature is active</li>
          <li>No photos or videos are stored or shared without user consent</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          7. Data Sharing
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We do not share personal user data with third parties except:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>When required by law</li>
          <li>For essential app analytics and security purposes</li>
          <li>When redirecting users to third-party shopping platforms at user request</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          8. Data Security
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We take reasonable measures to protect user information and prevent unauthorized access,
          misuse, or loss of data.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          9. Children's Privacy
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG is not intended for children under the age of 13. We do not knowingly collect
          personal data from children.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          10. Changes to This Privacy Policy
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          We may update this Privacy Policy from time to time. Any changes will be reflected within
          the app or on our official platform.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          11. Contact Us
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          If you have any questions or concerns about this Privacy Policy, you can contact us at:
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm font-semibold">
          Email: meggxfashion@gmail.com
        </p>
      </div>

      <div className="border-t border-border pt-lg mt-lg">
        <Button href="/terms" variant="underline">
          View Terms & Conditions →
        </Button>
      </div>
    </div>
  )
}
