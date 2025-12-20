import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        gender: 'male',
        birthDate: '',
        phone: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    gender: formData.gender,
                    birthDate: formData.birthDate,
                    phone: formData.phone,
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

    return (
        <div className="auth-page">
            <h1 className="auth-page__title">회원가입</h1>
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
                <button type="submit" className="auth-form__button">가입하기</button>
            </form>
        </div>
    );
}

export default Signup;
