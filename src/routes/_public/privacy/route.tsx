import { Helmet } from 'react-helmet-async';

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - MEGG</title>
                <meta name="description" content="Privacy Policy for MEGG mobile application." />
            </Helmet>

            <div className="container" style={{ padding: '100px 20px', maxWidth: '800px' }}>
                <h1 className="text-section" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', wordBreak: 'break-word' }}>Privacy Policy</h1>
                <p className="text-body" style={{ marginBottom: '2rem', fontStyle: 'italic' }}>Last updated: 29/03/2026</p>

                <div className="text-body">
                    <p style={{ marginBottom: '1.5rem' }}>
                        MEGG ("we", "our", or "us") values your privacy. This Privacy Policy explains how MEGG collects, uses, and protects information when you use the MEGG mobile application ("App"). By using the MEGG app, you agree to the practices described in this Privacy Policy.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>1. Information We Collect</h3>

                    <p style={{ fontWeight: '400', marginTop: '1rem', textDecoration: 'underline' }}>a) Information You Provide</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>When you choose to sign in using Google, we may receive basic profile information such as your name and email address.</li>
                        <li>Signing in is optional. You can use the app without logging in.</li>
                    </ul>

                    <p style={{ fontWeight: '400', marginTop: '1rem', textDecoration: 'underline' }}>b) Automatically Collected Information</p>
                    <p>We may collect limited, non-personal information such as:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Device type</li>
                        <li>App usage data (screens viewed, interactions)</li>
                        <li>App performance and crash data</li>
                    </ul>
                    <p>This information helps us improve app performance and user experience.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>2. How We Use Your Information</h3>
                    <p>We use collected information to:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Improve app functionality and features</li>
                        <li>Provide a better fashion discovery experience</li>
                        <li>Analyze app performance and usage trends</li>
                        <li>Ensure app security and prevent misuse</li>
                    </ul>
                    <p>We do not sell or rent your personal data to third parties.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>3. Affiliate Links & Third-Party Platforms</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG uses third-party affiliate partners such as Wishlink to generate product links. These affiliate links help us understand aggregated performance data such as product clicks and completed purchases. This data is used only for analytics and to improve product selection and user experience. MEGG does not receive or store personally identifiable information related to these transactions.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG displays curated fashion products with affiliate links. When you click on a product, you are redirected to third-party e-commerce platforms such as Myntra, Flipkart, or Amazon to complete your purchase.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG may earn a commission through affiliate links when users make purchases on third-party platforms, at no additional cost to the user.
                    </p>
                    <p>Please note:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>MEGG does not sell products directly</li>
                        <li>MEGG does not process payments</li>
                        <li>Purchases are completed on third-party platforms</li>
                        <li>Third-party platforms have their own privacy policies and terms</li>
                    </ul>
                    <p>We recommend reviewing their privacy policies before making a purchase.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>4. Product Images & Content</h3>
                    <p>
                        Product images and information displayed in the app are used only for fashion discovery and redirection purposes. MEGG does not claim ownership of third-party product images, trademarks, or brand names.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>5. Login & Authentication</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem' }}>
                        <li>Login via Google is optional</li>
                        <li>Users may skip login and access app features</li>
                        <li>No passwords are stored by MEGG</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>6. Camera & Media Access</h3>
                    <p>MEGG may request camera access for features such as color guidance or style assistance.</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Camera access is used only when the feature is active</li>
                        <li>No photos or videos are stored or shared without user consent</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>7. Data Sharing</h3>
                    <p>We do not share personal user data with third parties except:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>When required by law</li>
                        <li>For essential app analytics and security purposes</li>
                        <li>When redirecting users to third-party shopping platforms at user request</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>8. Data Security</h3>
                    <p>
                        We take reasonable measures to protect user information and prevent unauthorized access, misuse, or loss of data.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>9. Data Retention</h3>
                    <p>
                        We retain your data only as long as necessary to provide our services or as required by law.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>10. Children's Privacy</h3>
                    <p>
                        MEGG is not intended for children under the age of 13. We do not knowingly collect personal data from children.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>11. Changes to This Privacy Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes will be reflected within the app or on our official platform.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>12. User Rights</h3>
                    <p>
                        You may request deletion of your account and associated data by contacting us at meggxfashion@gmail.com.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>13. Contact Us</h3>
                    <p>If you have any questions or concerns about this Privacy Policy, you can contact us at:</p>
                    <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Email: meggxfashion@gmail.com</p>
                </div>
            </div>
        </>
    );
};

export default Privacy;
