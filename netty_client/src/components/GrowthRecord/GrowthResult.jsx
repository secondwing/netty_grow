import React, { useState, useEffect } from 'react';
import LoadingButton from '../Common/LoadingButton';

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

    const handleDraftAI = async (itemIndex, activityIndex, activityContent) => {
        try {
            // We need activityId to be precise, but for now let's pass content.
            // Actually, we have the activity object in the map loop.
            // But wait, the server route expects `activityId` to filter logs.
            // Let's pass activityId.
            const activityId = localPlan.items[itemIndex].activities[activityIndex]._id;

            const response = await fetch('http://localhost:5000/api/ai/draft/yearly-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    activityContent: activityContent,
                    activityId: activityId
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleOutcomeChange(itemIndex, activityIndex, data.draft);
            }
        } catch (error) {
            console.error('AI Draft Error:', error);
            alert('AI 초안 작성에 실패했습니다.');
        }
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <label style={{ margin: 0 }}>성장 활동성과 (이뤄낸 일)</label>
                                                <LoadingButton
                                                    className="growth-btn growth-btn--ai"
                                                    onClick={() => handleDraftAI(itemIndex, activityIndex, activity.content)}
                                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                                />
                                            </div>
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
