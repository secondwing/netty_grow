import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

// Header component
function Header({ isLoggedIn, onLogout }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__logo" onClick={closeMenu}>
                    <img src="/Netty.svg" alt="Netty" className="header__logo-img" />
                </Link>

                {/* Mobile Menu Button */}
                <button className="header__mobile-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Nav */}
                <nav className={`header__nav ${isMenuOpen ? 'header__nav--mobile-open' : ''}`}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/" className="header__link" onClick={closeMenu}>홈</Link>
                            <Link to="/record" className="header__link" onClick={closeMenu}>나성장</Link>
                            <Link to="/mypage" className="header__link" onClick={closeMenu}>마이페이지</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" className="header__link" onClick={closeMenu}>관리자</Link>
                            )}
                            <button onClick={handleLogout} className="header__button header__button--logout">
                                다음에 봐요
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header__link" onClick={closeMenu}>함께해요</Link>
                            <Link to="/signup" className="header__button header__button--signup" onClick={closeMenu}>
                                나를 소개해요
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
