import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    useEffect(() => {
        // Handle initial hash scroll
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>MEGG - Fashion Clarity</title>
                <meta name="description" content="MEGG: Personally selected fashion guidance. Quality beats quantity." />
            </Helmet>

            <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 5% 40px' }}>
                <h1 className="text-hero" style={{ fontWeight: '300' }}>
                    CONFIDENT <br />
                    <span style={{ color: '#999' }}>NOT CONFUSING</span>
                </h1>
                <div style={{ marginTop: '4rem', maxWidth: '400px' }}>
                    <p className="text-body" style={{ marginBottom: '2rem' }}>
                        MEGG cuts through the noise. Clarity, trust, and simplicity back into fashion.
                    </p>
                    <a href="#about" className="btn">DISCOVER</a>
                </div>
            </section>

            <section id="about" className="section">
                <div className="container">
                    <div className="grid-2">
                        <div>
                            <span className="text-label">01 — About</span>
                            <h2 className="text-section">CURATED <br />CLARITY</h2>
                        </div>
                        <div style={{ alignSelf: 'end' }}>
                            <p className="text-body" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                                MEGG solves one problem: <br />Choice overload.
                            </p>
                            <p className="text-body">
                                Thousands of options create confusion. We filter the chaos to bring you a personally selected experience where quality always beats quantity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-gray">
                <div className="container">
                    <span className="text-label">02 — Vision</span>
                    <div className="grid-2">
                        <h3 className="text-section">SMARTER <br />SHOPPING</h3>
                        <p className="text-body">
                            Instead of endless scrolling, explore a carefully curated selection of jackets, sweaters, caps, watches, and essentials. We help you shop with confidence.
                        </p>
                    </div>
                </div>
            </section>

            <section id="founders" className="section">
                <div className="container">
                    <span className="text-label">03 — Founders</span>
                    <h2 className="text-section" style={{ marginBottom: '80px' }}>THE EDITORS</h2>

                    <div className="grid-2">
                        <div>
                            <div style={{ height: '500px', background: '#e0e0e0', marginBottom: '20px' }}></div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>MEGHANSH GUPTA</h3>
                            <span className="text-label">Fashion Influencer</span>
                            <p className="text-body">
                                1.1M+ Followers. Brings real-world styling experience and trend awareness. Every recommendation reflects hands-on testing.
                            </p>
                            <a href="https://www.instagram.com/meghansh07?utm_source=qr" target="_blank" className="text-label" style={{ marginTop: '20px', textDecoration: 'underline' }}>@meghansh07</a>
                        </div>
                        <div>
                            <div style={{ height: '500px', background: '#333', marginBottom: '20px' }}></div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>DEVANSH GUPTA</h3>
                            <span className="text-label">Product Lead</span>
                            <p className="text-body">
                                Shapes MEGG to solve the frustrations of online shopping. Defines the vision and ensures a seamless experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-black">
                <div className="container">
                    <span className="text-label" style={{ color: '#999' }}>04 — Features</span>
                    <h2 className="text-section">THE DIFFERENCE</h2>

                    <div className="grid-3" style={{ marginTop: '80px' }}>
                        {[
                            "Personally selected fashion",
                            "Reel-based styling guidance",
                            "Outfit suggestions",
                            "Sales alerts",
                            "Camera-based color guidance",
                            "Honest recommendations"
                        ].map((item, i) => (
                            <div key={i} className="border-top">
                                <p style={{ fontSize: '1.4rem' }}>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-section">OUR PROMISE</h2>
                    <p className="text-body" style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
                        We recommend products because they’re good — not because they’re popular. Fashion advice should be simple, honest, and practical.
                    </p>
                    <a href="#" className="btn">DOWNLOAD APP</a>
                </div>
            </section>
        </>
    );
};

export default Home;
