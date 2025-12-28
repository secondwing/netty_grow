import React, { useState, useEffect } from 'react';
import './GrowthRecord.css';

function YearlyPlan({ plan, onUpdate }) {
    const [desiredSelf, setDesiredSelf] = useState(['', '', '']);
    const [goals, setGoals] = useState([
        { goal: '', action: '', motivation: '' },
        { goal: '', action: '', motivation: '' },
        { goal: '', action: '', motivation: '' }
    ]);

    useEffect(() => {
        if (plan) {
            setDesiredSelf(plan.desiredSelf || ['', '', '']);
            setGoals(plan.goals || [
                { goal: '', action: '', motivation: '' },
                { goal: '', action: '', motivation: '' },
                { goal: '', action: '', motivation: '' }
            ]);
        }
    }, [plan]);

    const handleDesiredSelfChange = (index, value) => {
        const newDesiredSelf = [...desiredSelf];
        newDesiredSelf[index] = value;
        setDesiredSelf(newDesiredSelf);
    };

    const handleGoalChange = (index, field, value) => {
        const newGoals = [...goals];
        newGoals[index] = { ...newGoals[index], [field]: value };
        setGoals(newGoals);
    };

    const handleSave = () => {
        onUpdate({ desiredSelf, goals });
    };

    return (
        <div className="growth-section">
            <h2 className="growth-section__title">나의 성장계획</h2>

            <div className="growth-card">
                <h3 className="growth-card__title">0000년에 원하는 나의 모습 3가지</h3>
                <div className="growth-input-group">
                    {desiredSelf.map((item, index) => (
                        <input
                            key={index}
                            type="text"
                            className="growth-input"
                            placeholder={`${index + 1}. 원하는 모습`}
                            value={item}
                            onChange={(e) => handleDesiredSelfChange(index, e.target.value)}
                        />
                    ))}
                </div>
            </div>

            <div className="growth-card">
                <h3 className="growth-card__title">1년간 성장목표 (하고싶은일/ 필요한일 / 활동동기)</h3>
                <div className="growth-goals">
                    {goals.map((item, index) => (
                        <div key={index} className="growth-goal-item">
                            <h4 className="growth-goal-item__title">목표 {index + 1}</h4>
                            <input
                                type="text"
                                className="growth-input"
                                placeholder="하고싶은 일 / 필요한 일"
                                value={item.goal}
                                onChange={(e) => handleGoalChange(index, 'goal', e.target.value)}
                            />
                            <input
                                type="text"
                                className="growth-input"
                                placeholder="필요한 활동 (구체적 행동)"
                                value={item.action}
                                onChange={(e) => handleGoalChange(index, 'action', e.target.value)}
                            />
                            <input
                                type="text"
                                className="growth-input"
                                placeholder="활동 동기"
                                value={item.motivation}
                                onChange={(e) => handleGoalChange(index, 'motivation', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button className="growth-btn growth-btn--save" onClick={handleSave}>
                저장하기
            </button>
        </div>
    );
}

export default YearlyPlan;
