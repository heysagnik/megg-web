import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '400', letterSpacing: '-0.05em' }}>
                MEGG
            </Link>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="/#about">About</a></li>
                    <li><a href="/#founders">Founders</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
