import React, { useState, useEffect } from 'react';

function GrowthResult({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const handleOutcomeChange = (itemIndex, activityIndex, value) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].activities[activityIndex].outcome = value;
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleSave = () => {
        onUpdate(localPlan);
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">연 결과보고서</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-items">
                    {localPlan.items.map((item, itemIndex) => (
                        <div key={item._id || itemIndex} className="growth-item-card">
                            <div className="growth-item-header">
                                <div className="growth-item-header__info">
                                    <span className="growth-label">원하는 나:</span>
                                    <span className="growth-value">{item.desiredSelf}</span>
                                </div>
                                <div className="growth-item-header__info">
                                    <span className="growth-label">성장목표:</span>
                                    <span className="growth-value">{item.goal}</span>
                                </div>
                            </div>

                            <div className="growth-activities-log">
                                {item.activities.map((activity, activityIndex) => (
                                    <div key={activity._id || activityIndex} className="growth-activity-log-row">
                                        <div className="growth-activity-content">
                                            <span className="growth-activity-badge">활동 {activityIndex + 1}</span>
                                            <p>{activity.content}</p>
                                        </div>
                                        <div className="growth-log-input-wrapper">
                                            <label>성장 활동성과 (이뤄낸 일)</label>
                                            <textarea
                                                className="growth-textarea"
                                                value={activity.outcome}
                                                onChange={(e) => handleOutcomeChange(itemIndex, activityIndex, e.target.value)}
                                                placeholder="1년 동안의 성과를 기록해주세요"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GrowthResult;
