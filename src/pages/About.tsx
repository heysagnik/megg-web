import { Helmet } from 'react-helmet-async';

const FEATURES = [
  { n: '01', title: 'Personally Selected', body: 'Every product is handpicked — not algorithmically generated.' },
  { n: '02', title: 'Reel-Based Styling', body: 'See how pieces actually look and move in real life.' },
  { n: '03', title: 'Outfit Suggestions', body: 'Complete looks, not just individual items.' },
  { n: '04', title: 'Sales Alerts', body: 'Know when your saved pieces drop in price.' },
  { n: '05', title: 'Colour Guidance', body: 'Camera-based advice for what works with your wardrobe.' },
  { n: '06', title: 'Honest Reviews', body: 'Recommendations earned by quality, not paid placement.' },
];

const About = () => (
  <>
    <Helmet>
      <title>About — MEGG</title>
      <meta name="description" content="MEGG: Personally selected fashion guidance. Quality beats quantity. Meet the editors." />
    </Helmet>

    {/* ── Hero ──────────────────────────────────────────── */}
    <section style={{ minHeight: '92svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(2rem,6vw,5rem) clamp(1.5rem,5vw,4rem)', paddingBottom: 'clamp(3rem,7vw,6rem)', borderBottom: '1px solid #EBEBEB' }}>
      <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '1.5rem' }}>MEGG — About</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem,10vw,9rem)', fontWeight: 400, lineHeight: 0.92, letterSpacing: '-0.03em', maxWidth: '900px' }}>
        Confident,<br />
        <span style={{ color: '#D4D4D4' }}>not confusing.</span>
      </h1>
      <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#616161', fontWeight: 300, lineHeight: 1.7, maxWidth: '380px' }}>
          MEGG cuts through the noise. Clarity, trust, and simplicity back into fashion.
        </p>
        <a
          href="#about-section"
          className="btn-outline"
        >
          Discover More
        </a>
      </div>
    </section>

    {/* ── About ─────────────────────────────────────────── */}
    <section id="about-section" style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderBottom: '1px solid #EBEBEB' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'end' }}>
          <div>
            <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '1rem' }}>01 — About</p>
            <h2 className="text-section">Curated<br />Clarity</h2>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#616161', fontWeight: 400, lineHeight: 1.6, marginBottom: '1.25rem' }}>
              MEGG solves one problem:<br />choice overload.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#9A9A9A', fontWeight: 300, lineHeight: 1.8 }}>
              Thousands of options create confusion. We filter the chaos to bring you a personally selected experience where quality always beats quantity.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── Vision ────────────────────────────────────────── */}
    <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', background: '#F5F5F5', borderBottom: '1px solid #EBEBEB' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '1rem' }}>02 — Vision</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'end' }}>
          <h3 className="text-section">Smarter<br />Shopping</h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#9A9A9A', fontWeight: 300, lineHeight: 1.8 }}>
            Instead of endless scrolling, explore a carefully curated selection — jackets, essentials, shoes, and more. We help you shop with confidence, not confusion.
          </p>
        </div>
      </div>
    </section>

    {/* ── Founders ──────────────────────────────────────── */}
    <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderBottom: '1px solid #EBEBEB' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '1rem' }}>03 — The Editors</p>
        <h2 className="text-section" style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>Meet the Team</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>

          {/* Founder 1 */}
          <div>
            <div style={{ background: '#F0EFEC', aspectRatio: '3/4', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              {/* Placeholder — replace src with actual photo */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', color: '#D4D4D4', fontWeight: 400 }}>MG</span>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Meghansh Gupta
            </h3>
            <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '0.75rem' }}>Fashion Influencer</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.825rem', color: '#616161', fontWeight: 300, lineHeight: 1.75, maxWidth: '360px', marginBottom: '0.875rem' }}>
              1.1M+ followers. Brings real-world styling experience and trend awareness. Every recommendation reflects hands-on testing.
            </p>
            <a
              href="https://www.instagram.com/meghansh07"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#9A9A9A', borderBottom: '1px solid #D4D4D4', paddingBottom: '1px', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9A9A9A'; e.currentTarget.style.borderColor = '#D4D4D4'; }}
            >
              @meghansh07 ↗
            </a>
          </div>

          {/* Founder 2 */}
          <div>
            <div style={{ background: '#0A0A0A', aspectRatio: '3/4', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', color: '#333', fontWeight: 400 }}>DG</span>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Devansh Gupta
            </h3>
            <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '0.75rem' }}>Product Lead</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.825rem', color: '#616161', fontWeight: 300, lineHeight: 1.75, maxWidth: '360px' }}>
              Shapes MEGG to solve the frustrations of online shopping. Defines the vision and ensures every experience is seamless.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── Features ──────────────────────────────────────── */}
    <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', background: '#0A0A0A', color: '#fff' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="text-label" style={{ color: '#444', marginBottom: '1rem' }}>04 — The Difference</p>
        <h2 className="text-section" style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>What Sets Us Apart</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0' }}>
          {FEATURES.map((item) => (
            <div key={item.n} style={{ borderTop: '1px solid #1E1E1E', padding: '2rem 1.5rem 2rem 0' }}>
              <p className="text-label" style={{ color: '#444', marginBottom: '0.875rem' }}>{item.n}</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 400, color: '#fff', marginBottom: '0.625rem' }}>
                {item.title}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#666', fontWeight: 300, lineHeight: 1.7 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Promise ───────────────────────────────────────── */}
    <section style={{ padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center', borderTop: '1px solid #EBEBEB' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '1.5rem' }}>05 — Our Promise</p>
        <h2 className="text-section" style={{ marginBottom: '1.5rem' }}>Quality Over<br />Everything</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#9A9A9A', fontWeight: 300, lineHeight: 1.8, marginBottom: '2.5rem' }}>
          We recommend products because they're good — not because they're popular. Fashion advice should be simple, honest, and practical.
        </p>
        <a href="#" className="btn-primary">Download the App</a>
      </div>
    </section>
  </>
);

export default About;
