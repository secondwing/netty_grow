import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import './Auth.css';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // TODO: Store token/user info properly
                onLogin(formData.username);
                showNotification('로그인 성공!', 'success');
                navigate('/');
            } else {
                showNotification(data.message || '로그인 실패', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('서버 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <div className="auth-page">
            <h1 className="auth-page__title">로그인</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
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
                <button type="submit" className="auth-form__button">로그인</button>
            </form>
        </div>
    );
}

export default Login;
