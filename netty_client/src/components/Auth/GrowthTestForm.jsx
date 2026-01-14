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
                    우리는 자녀, 친구, 학생, 직원 등 사회에서 주는 역할에 익숙합니다.
                    스스로에게 역할과 할일을 부여하며 자신을 위한 하루를 만들어가고 있나요?
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
                    인간은 매순간 성장합니다. 그 과정의 단계를 꽃으로 비유하자면,
                    당신의 현재 '나' 성장 이미지는 어떠한가요?
                </p>
                <div className="growth-test-table-wrapper">
                    <table className="growth-test-table">
                        <thead>
                            <tr>
                                <th>땅</th>
                                <th>씨앗</th>
                                <th>새싹</th>
                                <th>꽃</th>
                                <th>꽃다발</th>
                                <th>정원</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>나와 본적없는 사이</td>
                                <td>나와 본적있는 사이</td>
                                <td>나와 소통하는 사이</td>
                                <td>나와 사랑하는 사이</td>
                                <td>나와 회복하는 사이</td>
                                <td>나와 함께하는 사이</td>
                            </tr>
                            <tr>
                                <td>나를 인지하지못하는 상태</td>
                                <td>나의 생각과 감정을 인지하는 상태</td>
                                <td>나에게 관심이 있고 알아가는 상태</td>
                                <td>나를 있는 그대로 인정하는 상태</td>
                                <td>새로운 나를 알아가고 인정을 반복하는 상태</td>
                                <td>매순간 나를 사랑하는 마음을 지속하는 상태</td>
                            </tr>
                            <tr>
                                {[1, 2, 3, 4, 5, 6].map(val => (
                                    <td key={val} className="text-center">
                                        <input
                                            type="radio"
                                            name="test3"
                                            value={val}
                                            checked={values.test3 === val}
                                            onChange={(e) => handleRadioChange('test3', e.target.value)}
                                            disabled={readOnly}
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GrowthTestForm;
