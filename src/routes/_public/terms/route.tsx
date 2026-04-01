
import { Helmet } from 'react-helmet-async';

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions - MEGG</title>
                <meta name="description" content="Terms and Conditions for using the MEGG mobile application." />
            </Helmet>

            <div className="container" style={{ padding: '100px 20px', maxWidth: '800px' }}>
                <h1 className="text-section" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', wordBreak: 'break-word' }}>Terms & Conditions</h1>
                <p className="text-body" style={{ marginBottom: '2rem', fontStyle: 'italic' }}>Last updated: 31/01/2026</p>

                <div className="text-body">
                    <p style={{ marginBottom: '1.5rem' }}>
                        Welcome to MEGG. By downloading, accessing, or using the MEGG mobile application ("App"), you agree to comply with and be bound by these Terms & Conditions ("Terms"). If you do not agree with these Terms, please do not use the App.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>1. About MEGG</h3>
                    <p>MEGG is a fashion discovery and guidance app that provides:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Curated fashion product recommendations</li>
                        <li>Style reels and outfit inspiration</li>
                        <li>Color-combination and fashion guides</li>
                        <li>Sales alerts and fashion assistance features</li>
                    </ul>
                    <p>
                        MEGG does not sell products directly. The App redirects users to third-party e-commerce platforms such as Myntra, Flipkart, and Amazon to complete purchases.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>2. Eligibility</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem' }}>
                        <li>You must be at least 13 years old to use MEGG.</li>
                        <li>If you are under 18, you confirm that you have parental or legal guardian consent to use the App.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>3. Use of the App</h3>
                    <p>You agree to use MEGG only for lawful purposes and in a manner that does not:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe the rights of others</li>
                        <li>Interfere with the security or functionality of the App</li>
                    </ul>
                    <p>You must not misuse the App, attempt unauthorized access, or disrupt app services.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>4. Login & Access</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem' }}>
                        <li>Login via Google is optional</li>
                        <li>Users can access most features without creating an account</li>
                        <li>MEGG does not store user passwords</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>5. Affiliate Links & Third-Party Platforms</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG uses affiliate links for fashion products. MEGG may use affiliate partners, including Wishlink, to track aggregated product performance such as clicks and sales. This information is used solely for analytical purposes to improve product recommendations and app experience. MEGG does not control or access individual user purchase data and does not process payments.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG may earn a commission through affiliate links when users make purchases on third-party platforms, at no additional cost to the user.
                    </p>
                    <p>When you click on a product:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>You are redirected to a third-party platform</li>
                        <li>Purchases are completed on that platform</li>
                        <li>Prices, availability, delivery, returns, and refunds are governed by the third party's terms</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>MEGG is not responsible for:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Product quality</li>
                        <li>Order fulfillment</li>
                        <li>Shipping delays</li>
                        <li>Returns or refunds</li>
                        <li>Customer service issues from third-party platforms</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>6. Product Information & Accuracy</h3>
                    <p>MEGG curates fashion products based on experience, trends, and styling judgment. However:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Product images, descriptions, prices, and availability are provided by third-party platforms</li>
                        <li>MEGG does not guarantee accuracy, completeness, or availability at all times</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>7. Intellectual Property</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem' }}>
                        <li>The MEGG app, logo, design, and original content are owned by MEGG</li>
                        <li>Third-party product images, brand names, and trademarks belong to their respective owners</li>
                        <li>You may not copy, modify, or distribute MEGG content without permission</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>8. Camera & App Features</h3>
                    <p>Some features such as color guidance may require camera access. By using these features, you agree that:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Access is used only for app functionality</li>
                        <li>MEGG does not store images or videos without user consent</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>9. Limitation of Liability</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        MEGG is provided on an "as-is" basis. To the maximum extent permitted by law, MEGG shall not be liable for:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem' }}>
                        <li>Any direct or indirect loss</li>
                        <li>Shopping decisions made by users</li>
                        <li>Product dissatisfaction</li>
                        <li>Third-party service failures</li>
                    </ul>
                    <p>Users are responsible for their own purchasing decisions.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>10. User Rights</h3>
                    <p>
                        You may request deletion of your account and associated data at any time by contacting us at meggxfashion@gmail.com. We will process your request within a reasonable timeframe.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>11. Termination</h3>
                    <p>MEGG reserves the right to:</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <li>Suspend or terminate access to the App</li>
                        <li>Modify or discontinue features</li>
                        <li>Take action against misuse or policy violations</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>12. Changes to These Terms</h3>
                    <p>
                        MEGG may update these Terms from time to time. Continued use of the App after changes indicates acceptance of the updated Terms.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>13. Governing Law</h3>
                    <p>
                        These Terms are governed by and interpreted in accordance with the laws of India.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '3rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '400' }}>14. Contact Information</h3>
                    <p>If you have any questions about these Terms, contact us at:</p>
                    <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Email: meggxfashion@gmail.com</p>
                </div>
            </div>
        </>
    );
};

export default Terms;
