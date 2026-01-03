import React, { useState, useEffect } from 'react';

function GrowthReflection({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const handleReflectionChange = (field, value) => {
        setLocalPlan({
            ...localPlan,
            reflection: {
                ...localPlan.reflection,
                [field]: value
            }
        });
    };

    const handleSave = () => {
        onUpdate(localPlan);
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">나의 성장소감</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-reflection-container">
                    <div className="growth-form-group">
                        <label>{localPlan.year}년 한 문장 요약</label>
                        <input
                            type="text"
                            className="growth-input growth-input--large"
                            value={localPlan.reflection?.summary || ''}
                            onChange={(e) => handleReflectionChange('summary', e.target.value)}
                            placeholder="올해를 한 문장으로 표현한다면?"
                        />
                    </div>

                    <div className="growth-form-group">
                        <label>본문</label>
                        <textarea
                            className="growth-textarea growth-textarea--large"
                            value={localPlan.reflection?.detail || ''}
                            onChange={(e) => handleReflectionChange('detail', e.target.value)}
                            placeholder="올해의 성장 과정, 느낀 점, 배운 점 등을 자유롭게 기록해주세요"
                            rows={15}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrowthReflection;
