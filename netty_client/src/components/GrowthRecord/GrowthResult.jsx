import React, { useState, useEffect } from 'react';
import './GrowthRecord.css';

function GrowthResult({ plan, onUpdate }) {
    const [result, setResult] = useState('');
    const [reflection, setReflection] = useState('');

    useEffect(() => {
        if (plan) {
            setResult(plan.result || '');
            setReflection(plan.reflection || '');
        }
    }, [plan]);

    const handleSave = () => {
        onUpdate({ result, reflection });
    };

    return (
        <div className="growth-section">
            <h2 className="growth-section__title">성장 결과</h2>

            <div className="growth-card">
                <h3 className="growth-card__title">활동 성과 보고</h3>
                <textarea
                    className="growth-textarea growth-textarea--large"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="1년간의 활동 성과를 작성해주세요."
                />
            </div>

            <div className="growth-card">
                <h3 className="growth-card__title">성장 소감</h3>
                <textarea
                    className="growth-textarea"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="1년간의 성장 소감을 작성해주세요."
                />
            </div>

            <button className="growth-btn growth-btn--save" onClick={handleSave}>
                저장하기
            </button>
        </div>
    );
}

export default GrowthResult;
