import React, { useState, useEffect } from 'react';
import './MyPage.css';
import { API_BASE_URL } from '../../config';
import GrowthTestResult from '../../components/GrowthRecord/GrowthTestResult';

const MyPage = ({ currentUser }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [growthStages, setGrowthStages] = useState([]);

    useEffect(() => {
        if (currentUser) {
            fetchUserInfo();
        }
        fetchGrowthStages();
    }, [currentUser]);

    const fetchGrowthStages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/growth-stages`);
            if (response.ok) {
                setGrowthStages(await response.json());
            }
        } catch (error) {
            console.error('Failed to fetch growth stages', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user/${currentUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            setUserInfo(data);
            setFormData({
                name: data.name,
                phone: data.phone,
                gender: data.gender,
                birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                location: data.location || '',
                affiliation: data.affiliation || 'student'
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user/${currentUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setUserInfo(updatedUser);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: userInfo.name,
            phone: userInfo.phone,
            gender: userInfo.gender,
            birthDate: userInfo.birthDate ? userInfo.birthDate.split('T')[0] : '',
            location: userInfo.location || '',
            affiliation: userInfo.affiliation || 'student'
        });
    };

    const getAffiliationLabel = (value) => {
        const map = {
            student: '학생',
            job_seeker: '취준생',
            worker: '직장인',
            freelancer: '프리랜서',
            entrepreneur: '창업자',
            pre_entrepreneur: '예비창업자'
        };
        return map[value] || value;
    };

    // Calculate stage ID based on score if not explicitly set
    const getStageId = (results) => {
        if (!results || !results.test1) return 'growth_01';
        const total = results.test1 + results.test2 + results.test3;
        // Use logic consistent with backend or rely on minScore from loaded stages
        // For robustness, let's use the loaded stages if available
        if (growthStages.length > 0) {
            // Sort by minScore descending to find the highest matching stage
            const sorted = [...growthStages].sort((a, b) => b.minScore - a.minScore);
            const match = sorted.find(s => total >= s.minScore && total <= s.maxScore);
            return match ? match.stageId : 'growth_05'; // Fallback if over max
        }

        // Fallback hardcoded logic
        if (total <= 4) return 'growth_01';
        if (total <= 7) return 'growth_02';
        if (total <= 10) return 'growth_03';
        if (total <= 12) return 'growth_04';
        return 'growth_05';
    };

    const currentStageId = (() => {
        if (userInfo?.growthStage === 'growth_06') return 'growth_06';
        if (userInfo?.growthTestResults) return getStageId(userInfo.growthTestResults);
        return userInfo?.growthStage || 'growth_01';
    })();

    const currentStageInfo = growthStages.find(s => s.stageId === currentStageId) ||
        { imageUrl: `/growth/${currentStageId}.png`, name: 'Unknown' };

    if (loading) return <div className="my-page__loading">Loading...</div>;
    if (error) return <div className="my-page__error">Error: {error}</div>;

    return (
        <div className="my-page">
            <div className="my-page__container">
                <h2 className="my-page__title">마이 페이지</h2>

                <div className="my-page__card">
                    <div className="my-page__header">
                        <div className="my-page__avatar-wrapper">
                            <img
                                src={currentStageInfo.imageUrl}
                                alt={currentStageInfo.name || "Growth Stage"}
                                className="my-page__avatar-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/growth/growth_01.png';
                                }}
                            />
                        </div>
                        <div className="my-page__identity">
                            <h3 className="my-page__name">{userInfo?.name}</h3>
                            <span className="my-page__growth-name" style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                {currentStageInfo.name && <span className="stage-badge">{currentStageInfo.name}</span>}
                            </span>
                            <span className="my-page__username">@{userInfo?.username}</span>
                        </div>
                    </div>

                    <div className="my-page__content">
                        {isEditing ? (
                            <form className="my-page__form" onSubmit={handleSubmit}>
                                <div className="my-page__field">
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>전화번호</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>성별</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    >
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </select>
                                </div>
                                <div className="my-page__field">
                                    <label>생년월일</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>사는 지역</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>소속</label>
                                    <select
                                        name="affiliation"
                                        value={formData.affiliation}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    >
                                        <option value="student">학생</option>
                                        <option value="job_seeker">취준생</option>
                                        <option value="worker">직장인</option>
                                        <option value="freelancer">프리랜서</option>
                                        <option value="entrepreneur">창업자</option>
                                        <option value="pre_entrepreneur">예비창업자</option>
                                    </select>
                                </div>

                                <div className="my-page__actions">
                                    <button type="button" className="my-page__button my-page__button--cancel" onClick={handleCancel}>
                                        취소
                                    </button>
                                    <button type="submit" className="my-page__button my-page__button--save">
                                        저장
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="my-page__info">
                                <div className="my-page__row">
                                    <span className="my-page__label">이름</span>
                                    <span className="my-page__value">{userInfo?.name}</span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">전화번호</span>
                                    <span className="my-page__value">{userInfo?.phone}</span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">성별</span>
                                    <span className="my-page__value">
                                        {userInfo?.gender === 'male' ? '남성' : '여성'}
                                    </span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">생년월일</span>
                                    <span className="my-page__value">
                                        {userInfo?.birthDate ? new Date(userInfo.birthDate).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">사는 지역</span>
                                    <span className="my-page__value">{userInfo?.location || '-'}</span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">소속</span>
                                    <span className="my-page__value">{getAffiliationLabel(userInfo?.affiliation)}</span>
                                </div>

                                <button className="my-page__button my-page__button--edit" onClick={() => setIsEditing(true)}>
                                    프로필 수정
                                </button>

                                {userInfo?.growthTestResults && (
                                    <div className="my-page__growth-results">
                                        <h3 className="my-page__section-title">성장 테스트 결과</h3>
                                        <GrowthTestResult stage={userInfo.growthTestResults.test3} />

                                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                            <a href="/growth-test" className="my-page__link-button">
                                                성장 테스트 다시 보기
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default MyPage;
