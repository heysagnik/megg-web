import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for the MEGG mobile application.',
  alternates: { canonical: 'https://meggfashion.in/privacy' },
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
  textTransform: 'none' as const,
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
  textTransform: 'none' as const,
  letterSpacing: '0.02em',
}

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p style={{ ...bodyStyle, fontStyle: 'italic', marginBottom: '2.5rem' }}>
        Last updated: 29/01/2026
      </p>

      <div>
        <p style={bodyStyle}>
          MEGG ("we", "our", or "us") values your privacy. This Privacy Policy explains how MEGG
          collects, uses, and protects information when you use the MEGG mobile application ("App").
          By using the MEGG app, you agree to the practices described in this Privacy Policy.
        </p>

        <h2 style={sectionStyle}>1. Information We Collect</h2>

        <p style={{ ...bodyStyle, fontWeight: '500', textDecoration: 'underline' }}>
          a) Information You Provide
        </p>
        <ul style={listStyle}>
          <li>When you choose to sign in using Google, we may receive basic profile information such as your name and email address.</li>
          <li>Signing in is optional. You can use the app without logging in.</li>
        </ul>

        <p style={{ ...bodyStyle, fontWeight: '500', textDecoration: 'underline' }}>
          b) Automatically Collected Information
        </p>
        <p style={bodyStyle}>We may collect limited, non-personal information such as:</p>
        <ul style={listStyle}>
          <li>Device type</li>
          <li>App usage data (screens viewed, interactions)</li>
          <li>App performance and crash data</li>
        </ul>
        <p style={bodyStyle}>This information helps us improve app performance and user experience.</p>

        <h2 style={sectionStyle}>2. How We Use Your Information</h2>
        <p style={bodyStyle}>We use collected information to:</p>
        <ul style={listStyle}>
          <li>Improve app functionality and features</li>
          <li>Provide a better fashion discovery experience</li>
          <li>Analyze app performance and usage trends</li>
          <li>Ensure app security and prevent misuse</li>
        </ul>
        <p style={bodyStyle}>We do not sell or rent your personal data to third parties.</p>

        <h2 style={sectionStyle}>3. Affiliate Links &amp; Third-Party Platforms</h2>
        <p style={bodyStyle}>
          MEGG uses third-party affiliate partners such as Wishlink to generate product links. These
          affiliate links help us understand aggregated performance data such as product clicks and
          completed purchases. This data is used only for analytics and to improve product selection
          and user experience. MEGG does not receive or store personally identifiable information
          related to these transactions.
        </p>
        <p style={bodyStyle}>
          MEGG displays curated fashion products with affiliate links. When you click on a product,
          you are redirected to third-party e-commerce platforms such as Myntra, Flipkart, or Amazon
          to complete your purchase.
        </p>
        <p style={bodyStyle}>
          MEGG may earn a commission through affiliate links when users make purchases on third-party
          platforms, at no additional cost to the user.
        </p>
        <p style={bodyStyle}>Please note:</p>
        <ul style={listStyle}>
          <li>MEGG does not sell products directly</li>
          <li>MEGG does not process payments</li>
          <li>Purchases are completed on third-party platforms</li>
          <li>Third-party platforms have their own privacy policies and terms</li>
        </ul>
        <p style={bodyStyle}>We recommend reviewing their privacy policies before making a purchase.</p>

        <h2 style={sectionStyle}>4. Product Images &amp; Content</h2>
        <p style={bodyStyle}>
          Product images and information displayed in the app are used only for fashion discovery and
          redirection purposes. MEGG does not claim ownership of third-party product images,
          trademarks, or brand names.
        </p>

        <h2 style={sectionStyle}>5. Login &amp; Authentication</h2>
        <ul style={listStyle}>
          <li>Login via Google is optional</li>
          <li>Users may skip login and access app features</li>
          <li>No passwords are stored by MEGG</li>
        </ul>

        <h2 style={sectionStyle}>6. Camera &amp; Media Access</h2>
        <p style={bodyStyle}>MEGG may request camera access for features such as color guidance or style assistance.</p>
        <ul style={listStyle}>
          <li>Camera access is used only when the feature is active</li>
          <li>No photos or videos are stored or shared without user consent</li>
        </ul>

        <h2 style={sectionStyle}>7. Data Sharing</h2>
        <p style={bodyStyle}>We do not share personal user data with third parties except:</p>
        <ul style={listStyle}>
          <li>When required by law</li>
          <li>For essential app analytics and security purposes</li>
          <li>When redirecting users to third-party shopping platforms at user request</li>
        </ul>

        <h2 style={sectionStyle}>8. Data Security</h2>
        <p style={bodyStyle}>
          We take reasonable measures to protect user information and prevent unauthorized access,
          misuse, or loss of data.
        </p>

        <h2 style={sectionStyle}>9. Children&apos;s Privacy</h2>
        <p style={bodyStyle}>
          MEGG is not intended for children under the age of 13. We do not knowingly collect
          personal data from children.
        </p>

        <h2 style={sectionStyle}>10. Changes to This Privacy Policy</h2>
        <p style={bodyStyle}>
          We may update this Privacy Policy from time to time. Any changes will be reflected within
          the app or on our official platform.
        </p>

        <h2 style={sectionStyle}>11. Contact Us</h2>
        <p style={bodyStyle}>
          If you have any questions or concerns about this Privacy Policy, you can contact us at:
        </p>
        <p style={{ ...bodyStyle, fontWeight: '600' }}>Email: meggxfashion@gmail.com</p>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginTop: '3rem' }}>
        <Link href="/terms" className="btn-underline">
          View Terms &amp; Conditions →
        </Link>
      </div>
    </div>
  )
}
