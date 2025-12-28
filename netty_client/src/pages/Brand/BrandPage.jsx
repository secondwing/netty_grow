import './BrandPage.css';
import { PenTool, BarChart2, Users } from 'lucide-react';

function BrandPage() {
    return (
        <div className="brand-page">
            <div className="brand__header">
                <h2 className="brand__title">Why Netty?</h2>
                <p className="brand__description">
                    Netty는 단순한 기록 도구가 아닙니다. 당신의 흩어진 생각들을 모아
                    단단한 커리어 자산으로 만들어주는 성장 파트너입니다.
                </p>
            </div>

            <div className="brand__features">
                <div className="brand__feature">
                    <div className="brand__feature-icon-wrapper brand__feature-icon-wrapper--pink">
                        <PenTool className="brand__feature-icon brand__feature-icon--pink" size={24} />
                    </div>
                    <h3 className="brand__feature-title">Scribble to Asset</h3>
                    <p className="brand__feature-desc">
                        부담 없이 던진 메모가 AI를 통해 구조화된 회고로 변환됩니다.
                        기록의 심리적 장벽을 낮추고, 당신의 경험을 자산화하세요.
                    </p>
                </div>

                <div className="brand__feature">
                    <div className="brand__feature-icon-wrapper brand__feature-icon-wrapper--green">
                        <BarChart2 className="brand__feature-icon brand__feature-icon--green" size={24} />
                    </div>
                    <h3 className="brand__feature-title">Alternative Signal</h3>
                    <p className="brand__feature-desc">
                        일회성 스펙이 아닌, 꾸준함과 메타인지를 데이터로 증명하세요.
                        Netty는 당신의 성실함과 문제 해결 능력을 시각화합니다.
                    </p>
                </div>

                <div className="brand__feature">
                    <div className="brand__feature-icon-wrapper brand__feature-icon-wrapper--purple">
                        <Users className="brand__feature-icon brand__feature-icon--purple" size={24} />
                    </div>
                    <h3 className="brand__feature-title">Community as a Pacer</h3>
                    <p className="brand__feature-desc">
                        서로의 성장을 지켜봐 주는 '증인'이자 '속도 메이커'들과 함께하세요.
                        혼자가 아닌, 함께 성장하는 즐거움을 경험할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BrandPage;
