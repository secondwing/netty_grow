import React, { useState, useEffect } from 'react';

function MonthlyAnalysis({ plan, log, onUpdateLog }) {
    const [localLog, setLocalLog] = useState(log);

    useEffect(() => {
        setLocalLog(log);
    }, [log]);

    const handleAnalysisChange = (itemId, field, value) => {
        if (!localLog) return;

        const newItemAnalyses = [...(localLog.itemAnalyses || [])];
        const existingAnalysisIndex = newItemAnalyses.findIndex(a => a.itemId === itemId);

        if (existingAnalysisIndex >= 0) {
            newItemAnalyses[existingAnalysisIndex][field] = value;
        } else {
            const newAnalysis = { itemId, strength: '', weakness: '', supplement: '' };
            newAnalysis[field] = value;
            newItemAnalyses.push(newAnalysis);
        }

        setLocalLog({ ...localLog, itemAnalyses: newItemAnalyses });
    };

    const getAnalysisValue = (itemId, field) => {
        if (!localLog || !localLog.itemAnalyses) return '';
        const analysis = localLog.itemAnalyses.find(a => a.itemId === itemId);
        return analysis ? analysis[field] : '';
    };

    const handleSave = () => {
        onUpdateLog(localLog);
    };

    if (!plan || !localLog) return <div>Loading...</div>;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">월 성장분석</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-items">
                    {plan.items.map((item, itemIndex) => (
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

                            <div className="growth-analysis-grid">
                                <div className="growth-analysis-item">
                                    <label>행동결과 (강점)</label>
                                    <textarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'strength')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'strength', e.target.value)}
                                        placeholder="잘한 점, 성과 등을 기록해주세요"
                                        rows={3}
                                    />
                                </div>
                                <div className="growth-analysis-item">
                                    <label>행동결과 (약점)</label>
                                    <textarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'weakness')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'weakness', e.target.value)}
                                        placeholder="아쉬운 점, 부족한 점을 기록해주세요"
                                        rows={3}
                                    />
                                </div>
                                <div className="growth-analysis-item full-width">
                                    <label>행동보완 (성장 환경조성)</label>
                                    <textarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'supplement')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'supplement', e.target.value)}
                                        placeholder="개선할 점, 앞으로의 계획을 기록해주세요"
                                        rows={3}
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

export default MonthlyAnalysis;
