import React, { useState, useEffect } from 'react';
import LoadingButton from '../Common/LoadingButton';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';

function GrowthResult({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const handleOutcomeChange = (itemIndex, value) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].outcome = value;
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleDraftAI = async (itemIndex) => {
        try {
            const item = localPlan.items[itemIndex];
            // Collect all activity IDs and contents
            const activityIds = item.activities.map(a => a._id);
            const activityContent = item.activities.map(a => a.content).join(', ');

            const response = await fetch('http://localhost:5000/api/ai/draft/yearly-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    activityContent: activityContent,
                    activityIds: activityIds
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleOutcomeChange(itemIndex, data.draft);
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

                <div className="growth-items growth-items--vertical">
                    {localPlan.items.map((item, itemIndex) => {
                        // Soft Delete Logic for Items
                        if (item.isDeleted) {
                            // In Yearly Result, we might want to show deleted items if they have outcomes recorded?
                            // For consistency with Monthly Analysis, let's check if there's any outcome content.
                            const hasOutcome = item.activities.some(a => a.outcome && a.outcome.trim() !== '');
                            if (!hasOutcome) return null;
                        }

                        return (
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

                                <div className="growth-activities-log" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                    {item.activities.map((activity, activityIndex) => {
                                        // Soft Delete Logic for Activities
                                        if (activity.isDeleted) return null;

                                        return (
                                            <div key={activity._id || activityIndex} className="growth-activity-log-row" style={{ flex: 1, width: 0 }}>
                                                <div className="growth-activity-content">
                                                    <span className="growth-activity-badge">활동 {activityIndex + 1}</span>
                                                    <p>{activity.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="growth-log-input-wrapper" style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ margin: 0, fontWeight: 600, color: '#333' }}>성장 활동성과 (이뤄낸 일)</label>
                                        <LoadingButton
                                            className="growth-btn growth-btn--ai"
                                            onClick={() => handleDraftAI(itemIndex)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                    </div>
                                    <AutoResizeTextarea
                                        className="growth-textarea"
                                        value={item.outcome || ''}
                                        onChange={(e) => handleOutcomeChange(itemIndex, e.target.value)}
                                        placeholder="1년 동안의 성과를 종합적으로 기록해주세요"
                                        minHeight="120px"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default GrowthResult;
