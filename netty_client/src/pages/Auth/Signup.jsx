import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { API_BASE_URL } from '../../config';
import GrowthTestForm from '../../components/Auth/GrowthTestForm';

function Signup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',

        name: '',
        nickname: '',
        gender: 'undisclosed',
        birthDate: '',
        phone: '',
        location: '',
        affiliation: 'student',
        termsAgreed: false,
        privacyAgreed: false,
        growthTestResults: {
            test1: null,
            test2: null,
            test3: null
        }
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone') {
            const numbers = value.replace(/[^\d]/g, '');
            let formattedPhone = '';
            if (numbers.length <= 3) formattedPhone = numbers;
            else if (numbers.length <= 7) formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
            else formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;

            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
        } else if (name === 'birthDate') {
            const numbers = value.replace(/[^\d]/g, '');
            let formattedDate = '';
            if (numbers.length <= 4) formattedDate = numbers;
            else if (numbers.length <= 6) formattedDate = `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
            else formattedDate = `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;

            setFormData(prev => ({ ...prev, [name]: formattedDate }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
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
        if (!formData.termsAgreed || !formData.privacyAgreed) {
            alert('이용약관 및 개인정보처리방침에 모두 동의해주세요.');
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
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    consent: formData.privacyAgreed,
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
            {/* <h2 className="auth-step__title">나에 대해 알려주세요</h2> */}
            <p className="auth-step__description">안녕하세요!<br />
                Netty는 당신에게 맞는 환경을 만들어가고 싶어요.<br />
                오늘은 기본정보만 알려주세요.<br />
                더 자세한 이야기는<br />
                천천히 알아가며 함께 만들어가요.</p>
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
                <label className="auth-form__label">이름 / 별칭</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        name="name"
                        className="auth-form__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름"
                        required
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="nickname"
                        className="auth-form__input"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="별칭"
                        required
                        style={{ flex: 1 }}
                    />
                </div>
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">성별 (선택)</label>
                <select
                    name="gender"
                    className="auth-form__select"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="undisclosed">미응답</option>
                </select>
            </div>
            <div className="auth-form__group">
                <label className="auth-form__label">생년월일</label>
                <input
                    type="text"
                    name="birthDate"
                    className="auth-form__input"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
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
                    maxLength={13}
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
                    placeholder="(시/구)"
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
                    <option value="resting">휴식</option>
                </select>
            </div>
            <div className="terms-section">
                <div className="terms-all-agree">
                    <label className="terms-checkbox-label terms-checkbox-label--all">
                        <input
                            type="checkbox"
                            checked={formData.termsAgreed && formData.privacyAgreed}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                    ...prev,
                                    termsAgreed: checked,
                                    privacyAgreed: checked
                                }));
                            }}
                        />
                        이용약관 및 개인정보수집 및 이용에 모두 동의합니다.
                    </label>
                </div>

                <div className="terms-group">
                    <div className="terms-header">
                        <span className="terms-title">[필수] 이용약관 동의</span>
                        <label className="terms-checkbox-label">
                            <input
                                type="checkbox"
                                name="termsAgreed"
                                checked={formData.termsAgreed}
                                onChange={handleChange}
                                required
                            />
                            동의함
                        </label>
                    </div>
                    <div className="terms-box">
                        1. 이 약관의 내용은 회원 가입과 동시에 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.<br />
                        2. 회사는 이 규정을 변경할 수 있으며, 규정을 변경할 경우 제1항과 같은 방법으로 사전에 공지함으로써 효력을 발생합니다.<br />
                        <br />
                        제3조 약관의 준칙<br />
                        본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신윤리위원회 심의규정, 정보통신 윤리강령, 프로그램보호법 및 기타 관련 법령의 규정에 의합니다.
                    </div>
                </div>

                <div className="terms-group">
                    <div className="terms-header">
                        <span className="terms-title">[필수] 개인정보처리방침 동의</span>
                        <label className="terms-checkbox-label">
                            <input
                                type="checkbox"
                                name="privacyAgreed"
                                checked={formData.privacyAgreed}
                                onChange={handleChange}
                                required
                            />
                            동의함
                        </label>
                    </div>
                    <div className="terms-box">
                        ① 개인정보의 수집 및 이용 목적<br />
                        회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
                        - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br />
                        - 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인<br />
                        <br />
                        ② 수집하는 개인정보 항목<br />
                        회사는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br />
                        - 수집항목 : 이름, 생년월일, 성별, 로그인ID, 비밀번호, 자택 전화번호, 자택 주소, 휴대전화번호, 이메일, 직업, 주민등록번호, 접속 로그, 쿠키, 접속 IP 정보
                    </div>
                </div>
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
            <h1 className="auth-page__title">나를 소개해요</h1>
            <div className="auth-progress">
                <div className={`auth-progress__step ${step >= 1 ? 'active' : ''}`}>1. 자기소개 </div>
                <div className={`auth-progress__line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`auth-progress__step ${step >= 2 ? 'active' : ''}`}>2. 나성장테스트</div>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
                {step === 1 ? renderStep1() : renderStep2()}
            </form>
        </div>
    );
}

export default Signup;
