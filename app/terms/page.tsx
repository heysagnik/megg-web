import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using MEGG — India\'s curated men\'s fashion platform.',
  alternates: { canonical: 'https://www.meggfashion.in/terms' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-[var(--container-px)] pt-xl pb-3xl">
      <p className="text-label text-muted mb-[0.75rem]">
        Legal
      </p>
      <h1 className="text-section mb-[0.5rem]">
        Terms & Conditions
      </h1>
      <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] italic mb-lg">
        Last updated: 31/01/2026
      </p>

      <div>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          Welcome to MEGG. By downloading, accessing, or using the MEGG mobile application ("App"),
          you agree to comply with and be bound by these Terms & Conditions ("Terms"). If you do
          not agree with these Terms, please do not use the App.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          1. About MEGG
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG is a fashion discovery and guidance app that provides:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Curated fashion product recommendations</li>
          <li>Style reels and outfit inspiration</li>
          <li>Color-combination and fashion guides</li>
          <li>Sales alerts and fashion assistance features</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG does not sell products directly. The App redirects users to third-party e-commerce
          platforms such as Myntra, Flipkart, and Amazon to complete purchases.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          2. Eligibility
        </h2>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>You must be at least 13 years old to use MEGG.</li>
          <li>
            If you are under 18, you confirm that you have parental or legal guardian consent to use
            the App.
          </li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          3. Use of the App
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          You agree to use MEGG only for lawful purposes and in a manner that does not:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe the rights of others</li>
          <li>Interfere with the security or functionality of the App</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          You must not misuse the App, attempt unauthorized access, or disrupt app services.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          4. Login & Access
        </h2>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Login via Google is optional</li>
          <li>Users can access most features without creating an account</li>
          <li>MEGG does not store user passwords</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          5. Affiliate Links & Third-Party Platforms
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG uses affiliate links for fashion products. MEGG may use affiliate partners, including
          Wishlink, to track aggregated product performance such as clicks and sales. This
          information is used solely for analytical purposes to improve product recommendations and
          app experience. MEGG does not control or access individual user purchase data and does not
          process payments.
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG may earn a commission through affiliate links when users make purchases on
          third-party platforms, at no additional cost to the user.
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          When you click on a product:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>You are redirected to a third-party platform</li>
          <li>Purchases are completed on that platform</li>
          <li>
            Prices, availability, delivery, returns, and refunds are governed by the third
            party's terms
          </li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG is not responsible for:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Product quality</li>
          <li>Order fulfillment</li>
          <li>Shipping delays</li>
          <li>Returns or refunds</li>
          <li>Customer service issues from third-party platforms</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          6. Product Information & Accuracy
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG curates fashion products based on experience, trends, and styling judgment. However:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>
            Product images, descriptions, prices, and availability are provided by third-party
            platforms
          </li>
          <li>MEGG does not guarantee accuracy, completeness, or availability at all times</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          7. Intellectual Property
        </h2>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>The MEGG app, logo, design, and original content are owned by MEGG</li>
          <li>
            Third-party product images, brand names, and trademarks belong to their respective
            owners
          </li>
          <li>You may not copy, modify, or distribute MEGG content without permission</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          8. Camera & App Features
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          Some features (such as color guidance) may require camera access. By using these features,
          you agree that:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Access is used only for app functionality</li>
          <li>MEGG does not store images or videos without consent</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          9. Limitation of Liability
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG is provided on an "as-is" basis. To the maximum extent permitted by law,
          MEGG shall not be liable for:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Any direct or indirect loss</li>
          <li>Shopping decisions made by users</li>
          <li>Product dissatisfaction</li>
          <li>Third-party service failures</li>
        </ul>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          Users are responsible for their own purchasing decisions.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          10. Termination
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG reserves the right to:
        </p>
        <ul className="list-disc pl-md mb-sm mt-[0.5rem] font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em]">
          <li>Suspend or terminate access to the App</li>
          <li>Modify or discontinue features</li>
          <li>Take action against misuse or policy violations</li>
        </ul>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          11. Changes to These Terms
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          MEGG may update these Terms from time to time. Continued use of the App after changes
          indicates acceptance of the updated Terms.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          12. Governing Law
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          These Terms are governed by and interpreted in accordance with the laws of India.
        </p>

        <h2 className="font-sans text-[1.05rem] mt-lg mb-sm uppercase font-normal tracking-[0.05em]">
          13. Contact Information
        </h2>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm">
          If you have any questions about these Terms, contact us at:
        </p>
        <p className="font-sans text-base leading-[1.9] text-muted-dark uppercase tracking-[0.02em] mb-sm font-semibold">
          Email: meggxfashion@gmail.com
        </p>
      </div>

      <div className="border-t border-border pt-lg mt-lg">
        <Link
          href="/privacy"
          className="inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition bg-transparent text-black underline decoration-1 underline-offset-[3px] hover:opacity-60"
        >
          View Privacy Policy →
        </Link>
      </div>
    </div>
  )
}
