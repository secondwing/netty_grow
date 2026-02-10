import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './ProApplicationPage.css';

const ProApplicationPage = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        reasons: [],
        paymentType: '1month',
        paymentStatus: 'pending',
        communityParticipation: 'yes',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Benefits list for "신청이유" section
    const benefits = [
        "성장 기록 및 AI 성장 분석",
        "1:1 기록 피드백 및 성장점검",
        "개별 맞춤형 프로그램 추천",
        "커뮤니티 독려 모임"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => {
                const newReasons = checked
                    ? [...prev.reasons, value]
                    : prev.reasons.filter(r => r !== value);
                return { ...prev, reasons: newReasons };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showNotification('로그인이 필요합니다.', 'error');
            navigate('/login');
            return;
        }

        if (formData.paymentStatus === 'pending') {
            if (!window.confirm('회비를 아직 납부하지 않으셨습니다. 신청서를 제출하시겠습니까?')) {
                return;
            }
        }

        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/api/application`, {
                ...formData,
                reason: formData.reasons.join(', ')
            }, {
                withCredentials: true
            });

            showNotification('신청서가 성공적으로 제출되었습니다.', 'success');
            // Redirect to Growth Record - Plan tab
            navigate('/record', { state: { tab: 'plan' } });
        } catch (error) {
            console.error('Application error:', error);
            showNotification('신청서 제출 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pro-application-page">
            <h1 className="page-title">나성장 참여신청서</h1>
            <p className="page-subtitle">
                나성장은 스스로를 다루는 힘을 기르는 과정을 함께하는 커뮤니티입니다.<br />
                신청서를 작성해주시면 확인 후 승인 처리가 진행됩니다.
            </p>

            <form onSubmit={handleSubmit} className="application-form">

                {/* Section 1: 신청이유 (Benefits) */}
                {/* Section 1: 신청이유 (Checkboxes) */}
                <section className="form-section">
                    <h2 className="section-title">[나성장]에 신청한 이유가 무엇인가요? (복수 선택 가능)</h2>
                    <div className="checkbox-group vertical">
                        {benefits.map((benefit, index) => (
                            <label key={index} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="reasons"
                                    value={benefit}
                                    checked={formData.reasons.includes(benefit)}
                                    onChange={handleChange}
                                />
                                <span className="checkbox-text">{benefit}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Section 2: 참여방식 */}
                <section className="form-section">
                    <h2 className="section-title">나성장 참여방식</h2>
                    <div className="radio-group vertical">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="paymentType"
                                value="1month"
                                checked={formData.paymentType === '1month'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">1개월 단위 (5만원)</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="paymentType"
                                value="6months"
                                checked={formData.paymentType === '6months'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">6개월 단위 (25만원 / 일시불)</span>
                        </label>
                    </div>
                </section>

                {/* Section 3: 회비 납부 여부 */}
                <section className="form-section">
                    <h2 className="section-title">나성장 회비 납부 여부</h2>
                    <div className="bank-info">
                        <strong>납부계좌 : 농협 302-0943-5399-91 박선빈</strong>
                    </div>
                    <div className="radio-group vertical">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="paid"
                                checked={formData.paymentStatus === 'paid'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">납부완료했습니다.</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="pending"
                                checked={formData.paymentStatus === 'pending'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">신청 후 납부하겠습니다.</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="free_event"
                                checked={formData.paymentStatus === 'free_event'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">설연휴 2월 한정, 무료혜택</span>
                        </label>
                    </div>
                </section>

                {/* Section 4: 커뮤니티 독려모임 참여 */}
                <section className="form-section">
                    <h2 className="section-title">커뮤니티 독려모임 참여 (단톡방 초대)</h2>
                    <div className="info-box">
                        <p><strong>독려모임 안내</strong></p>
                        <ul>
                            <li>모임 참여시, 독려비 (1개월 1만원, 6개월 5만원)가 추가됩니다.</li>
                            <li>월 미작성시 1만원씩 차감되며, 작성완료시 100% 환급됩니다.</li>
                            <li>단, 차감된 금액은 환급되지 않습니다.</li>
                        </ul>
                    </div>
                    <div className="radio-group vertical">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="communityParticipation"
                                value="yes"
                                checked={formData.communityParticipation === 'yes'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">참여합니다!</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="communityParticipation"
                                value="no"
                                checked={formData.communityParticipation === 'no'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">참여하지 않습니다.</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="communityParticipation"
                                value="later"
                                checked={formData.communityParticipation === 'later'}
                                onChange={handleChange}
                            />
                            <span className="radio-text">고민해 보겠습니다.</span>
                        </label>
                    </div>
                </section>

                {/* Section 5: 안내 문구 (KakaoTalk) */}
                <section className="form-section kakao-section">
                    <div className="kakao-info-box">
                        <p>카카오톡 채널 1:1 채팅방에 <strong>[나성장 - 성함]</strong> 남겨주세요!</p>
                        <p>남기시면, 관리자가 신청확인 및 안내문자를 드립니다.</p>
                        <a
                            href="https://pf.kakao.com/_PVCiG/chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kakao-link"
                        >
                            👉 카카오톡 채널 바로가기
                        </a>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? '제출 중...' : '신청서 제출하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProApplicationPage;
