import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home__hero">
                <h1 className="home__title">
                    <span>
                        기록은 나답게<br />
                        성장은 확실하게
                    </span>
                </h1>
                <p className="home__subtitle">
                    나에 대한 기록을 모아<br />
                    Netty와 함께 나다운 일상을 만들어가요
                </p>
                <div className="home__actions">
                    <Link to="/record" className="home__button home__button--primary">
                        나를 기록하기
                    </Link>
                    <a href="#brand-images" className="home__button home__button--secondary">
                        Netty 소개
                    </a>
                </div>
            </div>

            <div id="brand-images" className="home__brand-images">
                <img src="/netty_brand/Netty_Brand_1.jpg" alt="Netty Brand 1" className="home__brand-image" />
                <img src="/netty_brand/Netty_Brand_2.jpg" alt="Netty Brand 2" className="home__brand-image" />
                <img src="/netty_brand/Netty_Brand_3.jpg" alt="Netty Brand 3" className="home__brand-image" />
                <img src="/netty_brand/Netty_Brand_4.jpg" alt="Netty Brand 4" className="home__brand-image" />
            </div>
        </div>
    );
}

export default Home;
