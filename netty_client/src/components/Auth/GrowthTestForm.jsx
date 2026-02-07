import React from 'react';
import './GrowthTestForm.css';

function GrowthTestForm({ values, onChange, readOnly = false }) {
    const handleRadioChange = (testName, value) => {
        if (readOnly) return;
        onChange(testName, parseInt(value));
    };

    return (
        <div className="growth-test-container">
            <div className="growth-test-item">
                <h3>Test 1. '나'는 어디에 살고 있을까요?</h3>
                <p className="growth-test-desc">
                    또 다른 ‘나’가 있다고 가정할 때, 그 존재는 현재 어디에 살고 있을까요?
                </p>
                <div className="growth-test-options">
                    {[
                        { val: 1, text: '모르겠다.' },
                        { val: 2, text: '이웃집에 살고 있다.' },
                        { val: 3, text: '아래층에 살고 있다.' },
                        { val: 4, text: '함께 살고 있다.' }
                    ].map(opt => (
                        <label key={opt.val} className={`growth-radio-label ${readOnly ? 'read-only' : ''}`}>
                            <input
                                type="radio"
                                name="test1"
                                value={opt.val}
                                checked={values.test1 === opt.val}
                                onChange={(e) => handleRadioChange('test1', e.target.value)}
                                disabled={readOnly}
                            />
                            {opt.text}
                        </label>
                    ))}
                </div>
            </div>

            <div className="growth-test-item">
                <h3>Test 2. ‘나’를 원동력으로 살아가고 있나요?</h3>
                <p className="growth-test-desc">
                    우리는 자녀, 친구, 학생, 직원처럼 여러 역할 속에서 살아갑니다.<br />
                    그 속에서 나 자신을 위한 하루를 만들고 있나요?
                </p>
                <div className="growth-test-options">
                    {[
                        { val: 1, text: '모르겠다.' },
                        { val: 2, text: '세상에 나 혼자 남는다면 삶의 의미가 없을 것 같다.' },
                        { val: 3, text: '자신의 건강을 위한 루틴(기상, 요리, 청소, 운동 등)이 있다.' },
                        { val: 4, text: '내가 있는 곳, 함께 하는 사람이 최고라고 생각한다.' }
                    ].map(opt => (
                        <label key={opt.val} className={`growth-radio-label ${readOnly ? 'read-only' : ''}`}>
                            <input
                                type="radio"
                                name="test2"
                                value={opt.val}
                                checked={values.test2 === opt.val}
                                onChange={(e) => handleRadioChange('test2', e.target.value)}
                                disabled={readOnly}
                            />
                            {opt.text}
                        </label>
                    ))}
                </div>
            </div>

            <div className="growth-test-item">
                <h3>Test 3. '나'는 어떤 성장단계에 있을까요?</h3>
                <p className="growth-test-desc">
                    사람은 매 순간 변하고, 그 자체로 성장하고 있어요.<br />
                    지금의 '나'를 꽃의 성장 과정에 비유한다면, 어떤 모습에 가까울까요?
                </p>
                <div className="growth-test-table-wrapper">
                    <div className="growth-test-tables-container">
                        {[
                            [
                                { id: 1, name: '땅', desc1: '나와 본적없는 사이', desc2: '나를 인지하지못하는 상태' },
                                { id: 2, name: '씨앗', desc1: '나와 본적있는 사이', desc2: '나의 생각과 감정을 인지하는 상태' },
                                { id: 3, name: '새싹', desc1: '나와 소통하는 사이', desc2: '나에게 관심이 있고 알아가는 상태' }
                            ],
                            [
                                { id: 4, name: '꽃', desc1: '나와 사랑하는 사이', desc2: '나를 있는 그대로 인정하는 상태' },
                                { id: 5, name: '꽃다발', desc1: '나와 회복하는 사이', desc2: '새로운 나를 알아가고 인정을 반복하는 상태' },
                                { id: 6, name: '정원', desc1: '나와 함께하는 사이', desc2: '매순간 나를 사랑하는 마음을 지속하는 상태' }
                            ]
                        ].map((group, sectionIndex) => (
                            <table key={sectionIndex} className="growth-test-table">
                                <thead>
                                    <tr>
                                        {group.map(stage => <th key={stage.id} width="33.33%">{stage.name}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {group.map(stage => <td key={stage.id}>{stage.desc1}</td>)}
                                    </tr>
                                    <tr>
                                        {group.map(stage => <td key={stage.id}>{stage.desc2}</td>)}
                                    </tr>
                                    <tr>
                                        {group.map(stage => (
                                            <td key={stage.id} className="text-center">
                                                <input
                                                    type="radio"
                                                    name="test3"
                                                    value={stage.id}
                                                    checked={values.test3 === stage.id}
                                                    onChange={(e) => handleRadioChange('test3', e.target.value)}
                                                    disabled={readOnly}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrowthTestForm;
