import './GrowthCalendar.css';

function GrowthCalendar({ records }) {
    if (!records || records.length === 0) {
        return (
            <div className="growth-calendar growth-calendar--empty">
                <p>아직 기록이 없습니다. 첫 번째 낙서를 남겨보세요!</p>
            </div>
        );
    }

    return (
        <div className="growth-calendar">
            <h2 className="growth-calendar__title">성장 기록 ({records.length})</h2>
            <div className="growth-calendar__grid">
                {records.map((record) => (
                    <div key={record._id} className="growth-calendar__card">
                        <div className="growth-calendar__date">
                            {new Date(record.createdAt).toLocaleDateString()} {new Date(record.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="growth-calendar__content">
                            <div className="growth-calendar__item">
                                <span className="growth-calendar__label">계기</span>
                                <p className="growth-calendar__text">{record.trigger}</p>
                            </div>
                            <div className="growth-calendar__item">
                                <span className="growth-calendar__label">상황</span>
                                <p className="growth-calendar__text">{record.situation}</p>
                            </div>
                            <div className="growth-calendar__item">
                                <span className="growth-calendar__label">생각</span>
                                <p className="growth-calendar__text">{record.thought}</p>
                            </div>
                            <div className="growth-calendar__item">
                                <span className="growth-calendar__label">감정</span>
                                <p className="growth-calendar__text">{record.emotion}</p>
                            </div>
                            <div className="growth-calendar__item">
                                <span className="growth-calendar__label">보완</span>
                                <p className="growth-calendar__text">{record.improvement}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GrowthCalendar;
