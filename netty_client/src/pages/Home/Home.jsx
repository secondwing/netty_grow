import { Link } from 'react-router-dom';
import './Home.css';
import BrandPage from '../Brand/BrandPage';
import PeoplePage from '../People/PeoplePage';

function Home() {
    return (
        <div className="home">
            <div className="home__hero">
                <h1 className="home__title">
                    기록은 가볍게<br />
                    성장은 확실하게
                </h1>
                <p className="home__subtitle">
                    흩어진 생각들을 모아, 단단한 커리어로<br />
                    Netty와 함께 기록의 가치를 발견하세요.
                </p>
                <div className="home__actions">
                    <Link to="/signup" className="home__button home__button--primary">
                        시작하기
                    </Link>
                    <a href="#brand" className="home__button home__button--secondary">
                        더 알아보기
                    </a>
                </div>
            </div>
            <div id="brand">
                <BrandPage />
            </div>
            <div id="people">
                <PeoplePage />
            </div>
        </div>
    );
}

export default Home;
