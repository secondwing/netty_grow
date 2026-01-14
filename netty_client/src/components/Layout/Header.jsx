import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__logo">
                    <img src="/Netty.svg" alt="Netty" className="header__logo-img" />
                </Link>
                <nav className="header__nav">
                    {isLoggedIn ? (
                        <>
                            <Link to="/" className="header__link">홈</Link>
                            <Link to="/record" className="header__link">나성장</Link>
                            <Link to="/mypage" className="header__link">마이페이지</Link>
                            <button onClick={handleLogout} className="header__button header__button--logout">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header__link">로그인</Link>
                            <Link to="/signup" className="header__button header__button--signup">
                                회원가입
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
