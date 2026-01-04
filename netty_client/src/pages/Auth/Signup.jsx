import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import GrowthTestForm from '../../components/Auth/GrowthTestForm';

function Signup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        gender: 'male',
        birthDate: '',
        phone: '',
        location: '',
        affiliation: 'student',
        consent: false,
        growthTestResults: {
            test1: null,
            test2: null,
            test3: null
        }
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTestChange = (testName, value) => {
        setFormData(prev => ({
            ...prev,
            growthTestResults: {
                ...prev.growthTestResults,
                [testName]: parseInt(value)
            }
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!formData.consent) {
            alert('개인정보 수집 및 활용에 동의해주세요.');
            return;
        }
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for Growth Test
        const { test1, test2, test3 } = formData.growthTestResults;
        if (!test1 || !test2 || !test3) {
            alert('모든 성장 테스트 항목에 응답해주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    // Remove confirmPassword before sending
                    confirmPassword: undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('회원가입이 완료되었습니다. 로그인해주세요.');
                navigate('/login');
            } else {
                alert(data.message || '회원가입 실패');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const renderStep1 = () => (
        <div className="auth-step">
            <h2 className="auth-step__title">기본 인적사항</h2>
            <div className="auth-form__group">
                <label className="auth-form__label">아이디</label>
                <input
                    type="text"
                    name="username"
                    className="auth-form__input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">비밀번호</label>
                <input
                    type="password"
                    name="password"
                    className="auth-form__input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">비밀번호 확인</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="auth-form__input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">이름</label>
                <input
                    type="text"
                    name="name"
                    className="auth-form__input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">성별</label>
                <select
                    name="gender"
                    className="auth-form__select"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">생년월일</label>
                <input
                    type="date"
                    name="birthDate"
                    className="auth-form__input"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">핸드폰 번호</label>
                <input
                    type="tel"
                    name="phone"
                    className="auth-form__input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">사는 지역</label>
                <input
                    type="text"
                    name="location"
                    className="auth-form__input"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="도 / 시 / 군 / 동"
                    required
                />
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">소속</label>
                <select
                    name="affiliation"
                    className="auth-form__select"
                    value={formData.affiliation}
                    onChange={handleChange}
                >
                    <option value="student">학생</option>
                    <option value="job_seeker">취준생</option>
                    <option value="worker">직장인</option>
                    <option value="freelancer">프리랜서</option>
                    <option value="entrepreneur">창업자</option>
                    <option value="pre_entrepreneur">예비창업자</option>
                </select>
            </div>
            <div className="auth-form__group auth-form__group--checkbox">
                <label className="auth-checkbox-label">
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                    />
                    개인정보 수집 및 활용 동의
                </label>
            </div>
            <button type="button" onClick={handleNext} className="auth-form__button">다음 단계로</button>
        </div>
    );

    const renderStep2 = () => (
        <div className="auth-step">
            <h2 className="auth-step__title">성장 테스트</h2>
            <p className="auth-step__desc">당신의 현재 상태를 진단해보세요.</p>

            <GrowthTestForm
                values={formData.growthTestResults}
                onChange={handleTestChange}
            />

            <div className="auth-buttons">
                <button type="button" onClick={() => setStep(1)} className="auth-form__button auth-form__button--secondary">이전</button>
                <button type="submit" className="auth-form__button">가입완료</button>
            </div>
        </div>
    );

    return (
        <div className="auth-page">
            <h1 className="auth-page__title">회원가입</h1>
            <div className="auth-progress">
                <div className={`auth-progress__step ${step >= 1 ? 'active' : ''}`}>1. 기본정보</div>
                <div className={`auth-progress__line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`auth-progress__step ${step >= 2 ? 'active' : ''}`}>2. 성장테스트</div>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
                {step === 1 ? renderStep1() : renderStep2()}
            </form>
        </div>
    );
}

export default Signup;
