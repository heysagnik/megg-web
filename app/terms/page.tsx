import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using MEGG — India\'s curated men\'s fashion platform.',
  alternates: { canonical: 'https://www.meggfashion.in/terms' },
  robots: { index: false, follow: false },
}

const sectionStyle = {
  fontSize: '1.05rem',
  marginTop: '3rem',
  marginBottom: '1rem',
  textTransform: 'uppercase' as const,
  fontWeight: '400',
  letterSpacing: '0.05em',
  fontFamily: 'var(--font-sans)',
}

const bodyStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem',
  lineHeight: 1.9,
  color: 'var(--color-muted-dark)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
  marginBottom: '1rem',
}

const listStyle = {
  listStyle: 'disc' as const,
  paddingLeft: '1.5rem',
  marginBottom: '1rem',
  marginTop: '0.5rem',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem',
  lineHeight: 1.9,
  color: 'var(--color-muted-dark)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
}

export default function TermsPage() {
  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'var(--space-xl) var(--container-px) var(--space-3xl)',
      }}
    >
      <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
        Legal
      </p>
      <h1 className="text-section" style={{ marginBottom: '0.5rem' }}>
        Terms &amp; Conditions
      </h1>
      <p style={{ ...bodyStyle, fontStyle: 'italic', marginBottom: '2.5rem' }}>
        Last updated: 31/01/2026
      </p>

      <div>
        <p style={bodyStyle}>
          Welcome to MEGG. By downloading, accessing, or using the MEGG mobile application ("App"),
          you agree to comply with and be bound by these Terms &amp; Conditions ("Terms"). If you do
          not agree with these Terms, please do not use the App.
        </p>

        <h2 style={sectionStyle}>1. About MEGG</h2>
        <p style={bodyStyle}>MEGG is a fashion discovery and guidance app that provides:</p>
        <ul style={listStyle}>
          <li>Curated fashion product recommendations</li>
          <li>Style reels and outfit inspiration</li>
          <li>Color-combination and fashion guides</li>
          <li>Sales alerts and fashion assistance features</li>
        </ul>
        <p style={bodyStyle}>
          MEGG does not sell products directly. The App redirects users to third-party e-commerce
          platforms such as Myntra, Flipkart, and Amazon to complete purchases.
        </p>

        <h2 style={sectionStyle}>2. Eligibility</h2>
        <ul style={listStyle}>
          <li>You must be at least 13 years old to use MEGG.</li>
          <li>
            If you are under 18, you confirm that you have parental or legal guardian consent to use
            the App.
          </li>
        </ul>

        <h2 style={sectionStyle}>3. Use of the App</h2>
        <p style={bodyStyle}>
          You agree to use MEGG only for lawful purposes and in a manner that does not:
        </p>
        <ul style={listStyle}>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe the rights of others</li>
          <li>Interfere with the security or functionality of the App</li>
        </ul>
        <p style={bodyStyle}>
          You must not misuse the App, attempt unauthorized access, or disrupt app services.
        </p>

        <h2 style={sectionStyle}>4. Login &amp; Access</h2>
        <ul style={listStyle}>
          <li>Login via Google is optional</li>
          <li>Users can access most features without creating an account</li>
          <li>MEGG does not store user passwords</li>
        </ul>

        <h2 style={sectionStyle}>5. Affiliate Links &amp; Third-Party Platforms</h2>
        <p style={bodyStyle}>
          MEGG uses affiliate links for fashion products. MEGG may use affiliate partners, including
          Wishlink, to track aggregated product performance such as clicks and sales. This
          information is used solely for analytical purposes to improve product recommendations and
          app experience. MEGG does not control or access individual user purchase data and does not
          process payments.
        </p>
        <p style={bodyStyle}>
          MEGG may earn a commission through affiliate links when users make purchases on
          third-party platforms, at no additional cost to the user.
        </p>
        <p style={bodyStyle}>When you click on a product:</p>
        <ul style={listStyle}>
          <li>You are redirected to a third-party platform</li>
          <li>Purchases are completed on that platform</li>
          <li>
            Prices, availability, delivery, returns, and refunds are governed by the third
            party&apos;s terms
          </li>
        </ul>
        <p style={bodyStyle}>MEGG is not responsible for:</p>
        <ul style={listStyle}>
          <li>Product quality</li>
          <li>Order fulfillment</li>
          <li>Shipping delays</li>
          <li>Returns or refunds</li>
          <li>Customer service issues from third-party platforms</li>
        </ul>

        <h2 style={sectionStyle}>6. Product Information &amp; Accuracy</h2>
        <p style={bodyStyle}>
          MEGG curates fashion products based on experience, trends, and styling judgment. However:
        </p>
        <ul style={listStyle}>
          <li>
            Product images, descriptions, prices, and availability are provided by third-party
            platforms
          </li>
          <li>MEGG does not guarantee accuracy, completeness, or availability at all times</li>
        </ul>

        <h2 style={sectionStyle}>7. Intellectual Property</h2>
        <ul style={listStyle}>
          <li>The MEGG app, logo, design, and original content are owned by MEGG</li>
          <li>
            Third-party product images, brand names, and trademarks belong to their respective
            owners
          </li>
          <li>You may not copy, modify, or distribute MEGG content without permission</li>
        </ul>

        <h2 style={sectionStyle}>8. Camera &amp; App Features</h2>
        <p style={bodyStyle}>
          Some features (such as color guidance) may require camera access. By using these features,
          you agree that:
        </p>
        <ul style={listStyle}>
          <li>Access is used only for app functionality</li>
          <li>MEGG does not store images or videos without consent</li>
        </ul>

        <h2 style={sectionStyle}>9. Limitation of Liability</h2>
        <p style={bodyStyle}>
          MEGG is provided on an &quot;as-is&quot; basis. To the maximum extent permitted by law,
          MEGG shall not be liable for:
        </p>
        <ul style={listStyle}>
          <li>Any direct or indirect loss</li>
          <li>Shopping decisions made by users</li>
          <li>Product dissatisfaction</li>
          <li>Third-party service failures</li>
        </ul>
        <p style={bodyStyle}>Users are responsible for their own purchasing decisions.</p>

        <h2 style={sectionStyle}>10. Termination</h2>
        <p style={bodyStyle}>MEGG reserves the right to:</p>
        <ul style={listStyle}>
          <li>Suspend or terminate access to the App</li>
          <li>Modify or discontinue features</li>
          <li>Take action against misuse or policy violations</li>
        </ul>

        <h2 style={sectionStyle}>11. Changes to These Terms</h2>
        <p style={bodyStyle}>
          MEGG may update these Terms from time to time. Continued use of the App after changes
          indicates acceptance of the updated Terms.
        </p>

        <h2 style={sectionStyle}>12. Governing Law</h2>
        <p style={bodyStyle}>
          These Terms are governed by and interpreted in accordance with the laws of India.
        </p>

        <h2 style={sectionStyle}>13. Contact Information</h2>
        <p style={bodyStyle}>If you have any questions about these Terms, contact us at:</p>
        <p style={{ ...bodyStyle, fontWeight: '600' }}>Email: meggxfashion@gmail.com</p>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginTop: '3rem' }}>
        <Link href="/privacy" className="btn-underline">
          View Privacy Policy →
        </Link>
      </div>
    </div>
  )
}
