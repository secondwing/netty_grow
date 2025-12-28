import React, { useState, useEffect } from 'react';
import './GrowthRecord.css';

function MonthlyAnalysis({ log, onUpdateLog }) {
    const [analysis, setAnalysis] = useState({
        positive: '',
        negative: '',
        improvement: ''
    });

    useEffect(() => {
        if (log && log.analysis) {
            setAnalysis(log.analysis);
        }
    }, [log]);

    const handleChange = (field, value) => {
        setAnalysis(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onUpdateLog({ analysis });
    };

    return (
        <div className="growth-section">
            <h2 className="growth-section__title">월 성장분석</h2>

            <div className="growth-card">
                <h3 className="growth-card__title">행동결과 (+)</h3>
                <p className="growth-card__subtitle">달성하게 만든 주요 원인(요인)</p>
                <textarea
                    className="growth-textarea"
                    value={analysis.positive}
                    onChange={(e) => handleChange('positive', e.target.value)}
                    placeholder="성공 요인을 작성해주세요."
                />
            </div>

            <div className="growth-card">
                <h3 className="growth-card__title">행동결과 (-)</h3>
                <p className="growth-card__subtitle">미달성하게 만든 주요 원인(요인)</p>
                <textarea
                    className="growth-textarea"
                    value={analysis.negative}
                    onChange={(e) => handleChange('negative', e.target.value)}
                    placeholder="실패 요인을 작성해주세요."
                />
            </div>

            <div className="growth-card">
                <h3 className="growth-card__title">(-) 행동보완</h3>
                <p className="growth-card__subtitle">미달성한 부분을 보완할 방법</p>
                <textarea
                    className="growth-textarea"
                    value={analysis.improvement}
                    onChange={(e) => handleChange('improvement', e.target.value)}
                    placeholder="보완점을 작성해주세요."
                />
            </div>

            <button className="growth-btn growth-btn--save" onClick={handleSave}>
                저장하기
            </button>
        </div>
    );
}

export default MonthlyAnalysis;
