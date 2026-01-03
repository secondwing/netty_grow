import React, { useState, useEffect } from 'react';

function YearlyOverview({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const handleOverviewChange = (month, field, value) => {
        const newOverview = [...localPlan.yearlyOverview];
        const monthIndex = newOverview.findIndex(o => o.month === month);

        if (monthIndex >= 0) {
            newOverview[monthIndex][field] = value;
        } else {
            // Should not happen if initialized correctly, but handle anyway
            const newItem = { month, content: '', summary: '' };
            newItem[field] = value;
            newOverview.push(newItem);
        }

        setLocalPlan({ ...localPlan, yearlyOverview: newOverview });
    };

    const getOverviewValue = (month, field) => {
        const overview = localPlan.yearlyOverview.find(o => o.month === month);
        return overview ? overview[field] : '';
    };

    const handleSave = () => {
        onUpdate(localPlan);
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">{localPlan.year}년 한눈에 정리</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-overview-grid">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <div key={month} className="growth-overview-card">
                            <div className="growth-overview-header">
                                <h3>{month}월</h3>
                            </div>
                            <div className="growth-overview-body">
                                <div className="growth-form-group">
                                    <label>활동내용</label>
                                    <textarea
                                        className="growth-textarea"
                                        value={getOverviewValue(month, 'content')}
                                        onChange={(e) => handleOverviewChange(month, 'content', e.target.value)}
                                        placeholder="주요 활동 내용"
                                        rows={4}
                                    />
                                </div>
                                <div className="growth-form-group">
                                    <label>핵심요약</label>
                                    <input
                                        type="text"
                                        className="growth-input"
                                        value={getOverviewValue(month, 'summary')}
                                        onChange={(e) => handleOverviewChange(month, 'summary', e.target.value)}
                                        placeholder="한 줄 요약"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default YearlyOverview;
