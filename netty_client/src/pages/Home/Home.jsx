import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home__hero">
                <h1 className="home__title">
                    기록은 가볍게<br />
                    성장은 확실하게
                </h1>
                <p className="home__subtitle">
                    흩어진 생각들을 모아 단단한 커리어로<br />
                    Netty와 함께 기록의 가치를 발견하세요.
                </p>
                <div className="home__actions">
                    <Link to="/signup" className="home__button home__button--primary">
                        시작하기
                    </Link>
                    <a href="#brand-images" className="home__button home__button--secondary">
                        더 알아보기
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
