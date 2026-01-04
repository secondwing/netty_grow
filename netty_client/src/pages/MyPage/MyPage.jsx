import React, { useState, useEffect } from 'react';
import './MyPage.css';

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

    useEffect(() => {
        if (currentUser) {
            fetchUserInfo();
        }
    }, [currentUser]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/user/${currentUser}`);
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
            const response = await fetch(`http://localhost:5000/api/auth/user/${currentUser}`, {
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

    const calculateGrowthStage = (results) => {
        if (!results || !results.test1 || !results.test2 || !results.test3) return 'growth_01';
        const total = results.test1 + results.test2 + results.test3;
        if (total <= 4) return 'growth_01';
        if (total <= 7) return 'growth_02';
        if (total <= 10) return 'growth_03';
        if (total <= 12) return 'growth_04';
        return 'growth_05';
    };

    const currentStage = (() => {
        // 1. If explicitly set to Admin stage (growth_06), use it.
        if (userInfo?.growthStage === 'growth_06') return 'growth_06';

        // 2. If we have test results, calculate the stage dynamically.
        // This ensures that even if the DB has a default 'growth_01', the actual score is reflected.
        if (userInfo?.growthTestResults) {
            return calculateGrowthStage(userInfo.growthTestResults);
        }

        // 3. Fallback to stored stage or default.
        return userInfo?.growthStage || 'growth_01';
    })();

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
                                src={`/growth/${currentStage}.png`}
                                alt="Growth Stage"
                                className="my-page__avatar-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/growth/growth_01.png'; // Fallback
                                }}
                            />
                        </div>
                        <div className="my-page__identity">
                            <h3 className="my-page__name">{userInfo?.name}</h3>
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
                                        <div className="my-page__result-item">
                                            <span className="my-page__result-label">Test 1. 거주지 인식</span>
                                            <span className="my-page__result-value">{userInfo.growthTestResults.test1}점</span>
                                        </div>
                                        <div className="my-page__result-item">
                                            <span className="my-page__result-label">Test 2. 자아 원동력</span>
                                            <span className="my-page__result-value">{userInfo.growthTestResults.test2}점</span>
                                        </div>
                                        <div className="my-page__result-item">
                                            <span className="my-page__result-label">Test 3. 성장 단계</span>
                                            <span className="my-page__result-value">{userInfo.growthTestResults.test3}단계 ({userInfo.growthTestResults.test3}점)</span>
                                        </div>
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
