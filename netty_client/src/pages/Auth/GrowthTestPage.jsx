import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthTestForm from '../../components/Auth/GrowthTestForm';
import './Auth.css'; // Reuse auth styles

function GrowthTestPage() {
    const [growthTestResults, setGrowthTestResults] = useState({
        test1: null,
        test2: null,
        test3: null
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGrowthTest();
    }, []);

    const fetchGrowthTest = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const user = await response.json();
                if (user.growthTestResults) {
                    setGrowthTestResults(user.growthTestResults);
                }
            }
        } catch (error) {
            console.error('Failed to fetch growth test', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestChange = (testName, value) => {
        setGrowthTestResults(prev => ({
            ...prev,
            [testName]: parseInt(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const { test1, test2, test3 } = growthTestResults;
        if (!test1 || !test2 || !test3) {
            alert('모든 성장 테스트 항목에 응답해주세요.');
            return;
        }

        try {
            // We need to fetch user info first to get other fields, or update the backend to allow partial updates
            // For now, let's assume we can update just the growthTestResults via a specific endpoint or the general user update
            // Since we don't have a dedicated endpoint for just test results, we'll use the user update endpoint.
            // But wait, the user update endpoint requires username in URL.

            // First get current user info to get username and other fields
            const meResponse = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
            const me = await meResponse.json();

            const response = await fetch(`http://localhost:5000/api/auth/user/${me.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    growthTestResults: {
                        ...growthTestResults,
                        takenAt: new Date()
                    }
                }),
            });

            if (response.ok) {
                alert('성장 테스트 결과가 저장되었습니다.');
                navigate('/mypage');
            } else {
                alert('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="auth-page">
            <h1 className="auth-page__title">성장 테스트</h1>
            <p className="auth-step__desc" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                언제든지 다시 진단하고 변화를 기록해보세요.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <GrowthTestForm
                    values={growthTestResults}
                    onChange={handleTestChange}
                />

                <div className="auth-buttons">
                    <button type="button" onClick={() => navigate('/mypage')} className="auth-form__button auth-form__button--secondary">취소</button>
                    <button type="submit" className="auth-form__button">결과 저장하기</button>
                </div>
            </form>
        </div>
    );
}

export default GrowthTestPage;
