import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '4rem 0', marginTop: '4rem' }}>
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>MEGG</div>
                    <p style={{ maxWidth: '400px', color: '#888' }}>
                        Personally selected fashion guidance where quality beats quantity.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                    <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '2rem' }}>
                        © {new Date().getFullYear()} MEGG. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
