import React, { useState, useEffect } from 'react';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';
import LoadingButton from '../Common/LoadingButton';

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

    const handleDraftAI = async (itemId, field, itemGoal) => {
        try {
            // Collect activity logs for this item
            // We need to find which activities belong to this item.
            // plan.items has activities.
            const item = plan.items.find(i => i._id === itemId);
            if (!item) return;

            const activityIds = item.activities.map(a => a._id);

            // Get logs from localLog that match these activityIds
            const relevantLogs = (localLog.activityLogs || [])
                .filter(l => activityIds.includes(l.activityId))
                .map(l => {
                    const activity = item.activities.find(a => a._id === l.activityId);
                    return `[${activity.content}] ${l.log}`;
                });

            if (relevantLogs.length === 0) {
                alert('작성된 월간 활동 기록이 없어 AI 초안을 작성할 수 없습니다.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/ai/draft/monthly-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    month: log.month,
                    type: field,
                    itemGoal: itemGoal,
                    activityLogs: relevantLogs
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleAnalysisChange(itemId, field, data.draft);
            }
        } catch (error) {
            console.error('AI Draft Error:', error);
            alert('AI 초안 작성에 실패했습니다.');
        }
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ margin: 0 }}>행동결과 (강점)</label>
                                        <LoadingButton
                                            className="growth-btn growth-btn--ai"
                                            onClick={() => handleDraftAI(item._id, 'strength', item.goal)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                    </div>
                                    <AutoResizeTextarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'strength')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'strength', e.target.value)}
                                        placeholder="잘한 점, 성과 등을 기록해주세요"
                                        minHeight="100px"
                                    />
                                </div>
                                <div className="growth-analysis-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ margin: 0 }}>행동결과 (약점)</label>
                                        <LoadingButton
                                            className="growth-btn growth-btn--ai"
                                            onClick={() => handleDraftAI(item._id, 'weakness', item.goal)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                    </div>
                                    <AutoResizeTextarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'weakness')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'weakness', e.target.value)}
                                        placeholder="아쉬운 점, 부족한 점을 기록해주세요"
                                        minHeight="100px"
                                    />
                                </div>
                                <div className="growth-analysis-item full-width">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ margin: 0 }}>행동보완 (성장 환경조성)</label>
                                        <LoadingButton
                                            className="growth-btn growth-btn--ai"
                                            onClick={() => handleDraftAI(item._id, 'supplement', item.goal)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                    </div>
                                    <AutoResizeTextarea
                                        className="growth-textarea"
                                        value={getAnalysisValue(item._id, 'supplement')}
                                        onChange={(e) => handleAnalysisChange(item._id, 'supplement', e.target.value)}
                                        placeholder="개선할 점, 앞으로의 계획을 기록해주세요"
                                        minHeight="100px"
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
