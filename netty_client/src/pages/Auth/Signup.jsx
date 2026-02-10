import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { API_BASE_URL } from '../../config';
import MDEditor from '@uiw/react-md-editor';
import GrowthTestForm from '../../components/Auth/GrowthTestForm';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import GrowthTestResult from '../../components/GrowthRecord/GrowthTestResult';

const TERMS_CONTENT = `##### 제1조 (목적)
본 약관은 Netty(이하 “서비스”)가 제공하는 기록 및 커뮤니티 서비스의 이용과 관련하여 서비스와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

##### 제2조 (용어의 정의)
1. “회원”이란 본 약관에 동의하고 Netty가 제공하는 서비스를 이용하는 자를 말합니다.
2. “서비스”란 Netty가 제공하는 기록, 커뮤니티 및 이에 부수하는 모든 기능을 의미합니다.

##### 제3조 (약관의 효력 및 변경)
1. 본 약관은 회원가입 시 서비스 화면에 게시되며, 회원이 동의함으로써 효력이 발생합니다.
2. Netty는 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.

##### 제4조 (회원가입)
1. 회원가입은 이용자가 본 약관에 동의하고 필요한 정보를 입력함으로써 완료됩니다.
2. 회원은 입력한 정보가 변경될 경우 서비스 내에서 이를 수정할 책임이 있습니다.

##### 제5조 (서비스의 제공)
1. Netty는 회원에게 다음과 같은 서비스를 제공합니다.
    - 개인 기록 서비스
    - 커뮤니티 참여 및 활동 서비스
    - 기타 Netty가 정하는 서비스
2. 서비스의 내용은 운영 상황에 따라 변경 또는 추가될 수 있습니다.

##### 제6조 (회원의 의무)
회원은 다음 행위를 하여서는 안 됩니다.
1. 타인의 정보를 도용하거나 허위 정보를 입력하는 행위
2. 서비스의 정상적인 운영을 방해하는 행위
3. 관련 법령 및 본 약관을 위반하는 행위

##### 제7조 (서비스 이용의 제한)
Netty는 회원이 본 약관을 위반한 경우, 사전 안내 후 서비스 이용을 제한하거나 회원 자격을 정지할 수 있습니다.

##### 제8조 (면책사항)
1. Netty는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
2. 회원의 귀책사유로 발생한 손해에 대해서는 책임을 지지 않습니다.

##### 제9조 (준거법)
본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.`;

const PRIVACY_CONTENT = `##### 개인정보수집방침

Netty는 회원의 개인정보를 소중히 보호하며, 「개인정보 보호법」등 관련 법령을 준수합니다.

##### 1. 개인정보의 수집 및 이용 목적

Netty는 다음의 목적을 위해 개인정보를 수집·이용합니다.

- 회원 가입 및 본인 확인
- 기록 서비스 및 커뮤니티 제공
- 이용자 맞춤 환경 제공
- 서비스 운영 및 고객 문의 대응
- 프로그램 안내·소식 등 정보 제공

##### 2. 수집하는 개인정보 항목

**[필수 항목]**
- 아이디
- 비밀번호
- 이름/별칭
- 생년월일
- 휴대폰 번호
- 사는 지역(시/구)
- 소속

**[선택 항목]**
- 성별

※ Netty는 서비스 제공에 필요한 **최소한의 개인정보만 수집합니다.**

##### 3. 개인정보의 보유 및 이용 기간

회원의 개인정보는 회원 탈퇴 시까지 보유·이용하며, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.

##### 4. 개인정보의 제3자 제공

Netty는 회원의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령에 따른 경우는 예외로 합니다.

##### 5. 개인정보의 처리 위탁

Netty는 원활한 서비스 제공을 위해 필요한 경우 개인정보 처리를 위탁할 수 있으며, 이 경우 사전에 공지합니다.

##### 6. 개인정보 보호를 위한 노력

Netty는 회원의 개인정보 보호를 위해 기술적·관리적 보호조치를 시행합니다.

Netty는 회원이 작성한 기록과 콘텐츠를 개인의 소중한 이야기로 인식하며, 이를 안전하게 보호하기 위해 노력합니다.

1. 회원의 기록 콘텐츠는 서비스 제공 및 기능 운영 목적 외에는 외부에 공개되거나 활용되지 않습니다.
2. 회원의 기록 내용은 회원의 동의 없이 제3자에게 제공되지 않습니다.
3. 서비스 개선을 위한 분석이 필요한 경우에도 개인을 식별할 수 없는 형태로만 최소한으로 활용합니다.
4. 커뮤니티 내에서 공유되는 기록과 콘텐츠는 해당 공간의 취지와 신뢰를 존중하며, 무단 복제 및 외부 공유를 금지합니다.

※ 단, 관련 법령에 따라 수사기관 등 법적 요청이 있는 경우에는 예외적으로 제공될 수 있습니다.

##### 7. 이용자의 권리

회원은 언제든지 본인의 개인정보를 조회·수정·삭제할 수 있으며, 회원 탈퇴를 통해 개인정보 이용을 중단할 수 있습니다. Netty는 탈퇴 회원의 개인정보와 기록 콘텐츠를 지체 없이 삭제합니다

##### 8. 개인정보 보호 문의

개인정보 보호와 관련한 문의는 서비스 내 문의 기능을 통해 접수할 수 있습니다.`;

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
    const { login } = useContext(AuthContext);
    const { showNotification } = useNotification();

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
                // 회원가입 성공 시 3단계(결과 화면)로 이동
                setStep(3);
                window.scrollTo(0, 0);
            } else {
                alert(data.message || '회원가입 실패');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const handleAutoLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
                showNotification('가입을 환영합니다! 자동 로그인되었습니다.', 'success');
                navigate('/record', { state: { tab: 'growth' } }); // 성장 기록 페이지로 이동
            } else {
                showNotification('자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.', 'error');
                navigate('/login');
            }
        } catch (error) {
            console.error('Auto login error:', error);
            showNotification('자동 로그인 중 오류가 발생했습니다.', 'error');
            navigate('/login');
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
                    <div className="terms-box" style={{ padding: '1rem' }}>
                        <MDEditor.Markdown
                            source={TERMS_CONTENT}
                            style={{ backgroundColor: 'transparent', color: 'inherit', fontSize: '0.85rem' }}
                        />
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
                    <div className="terms-box" style={{ padding: '1rem' }}>
                        <MDEditor.Markdown
                            source={PRIVACY_CONTENT}
                            style={{ backgroundColor: 'transparent', color: 'inherit', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleNext} className="auth-form__button">다음 단계로</button>
        </div>
    );

    const renderStep2 = () => (
        <div className="auth-step">
            {/* <h2 className="auth-step__title">성장 테스트</h2> */}
            <p className="auth-step__desc">질문을 통해<br />
                나 자신과의 관계를 알아보고,<br />
                그 과정을 성장도감으로 기록해요.<br /><br />

                이 테스트는<br />
                지금의 나를 이해하고<br />
                앞으로의 기록 방향을<br />
                가볍게 안내해주는 시작점이에요. </p>

            <GrowthTestForm
                values={formData.growthTestResults}
                onChange={handleTestChange}
            />

            <div className="auth-buttons">
                <button type="button" onClick={() => setStep(1)} className="auth-form__button auth-form__button--secondary">이전 단계</button>
                <button type="submit" className="auth-form__button">함께할 준비 완료!</button>
            </div>
        </div>
    );

    const renderStep3 = () => {
        const stage = formData.growthTestResults.test3 || 1;

        return (
            <div className="auth-step analysis-step">
                <div className="analysis-intro">
                    <p>나를 아는 만큼 성장해요.</p>
                    <p>Netty는 그 과정을 <span className="highlight">성장도감</span>으로 표현했어요.</p><br />
                    <p>꽃은 혼자서도 피지만,</p>
                    <p>함께할 때 더 빨리, 더 오래 피어납니다.</p>
                    <p>때가 되면, 꽃이 가득한 정원에서 만나요.</p>
                </div>

                <GrowthTestResult stage={stage} />

                <div className="auth-buttons">
                    <button type="button" onClick={handleAutoLogin} className="auth-form__button start-button">
                        나성장 기록하기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="auth-page">
            <h1 className="auth-page__title">나를 소개해요</h1>
            <div className="auth-progress">
                <div className={`auth-progress__step ${step >= 1 ? 'active' : ''}`}>1. 자기소개 </div>
                <div className={`auth-progress__line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`auth-progress__step ${step >= 2 ? 'active' : ''}`}>2. 나성장테스트</div>
                <div className={`auth-progress__line ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`auth-progress__step ${step >= 3 ? 'active' : ''}`}>3. 나의 성장도감</div>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
                {step === 1 ? renderStep1() : (step === 2 ? renderStep2() : renderStep3())}
            </form>
        </div>
    );
}

export default Signup;
