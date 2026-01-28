import React, { useState, useEffect, useRef } from 'react';
import UnicodePicker from './UnicodePicker';

function GrowthReflection({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);
    const textareaRef = useRef(null);

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

    const handleInsertChar = (char) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = localPlan.reflection?.detail || '';
            const newText = text.substring(0, start) + char + text.substring(end);

            handleReflectionChange('detail', newText);

            // Restore cursor position and focus
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + char.length, start + char.length);
            }, 0);
        }
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ margin: 0 }}>본문</label>
                            <UnicodePicker onInsert={handleInsertChar} />
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="growth-textarea"
                            value={localPlan.reflection?.detail || ''}
                            onChange={(e) => handleReflectionChange('detail', e.target.value)}
                            placeholder="성장 소감을 자유롭게 작성해주세요."
                            rows={20}
                            style={{
                                width: '100%',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                minHeight: '400px',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrowthReflection;
