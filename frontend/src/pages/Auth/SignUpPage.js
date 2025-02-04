import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../service/auth/authService";

const SignUpPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signUp(formData);
            console.log("서버 응답:", response);

            if (response?.message === "회원가입 성공") {
                alert('회원가입 성공');
                navigate('/login');
            } else {
                setError(response.message || '회원가입 실패');
            }
        } catch (err) {
            console.error('회원가입 실패:', err);
            setError('회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력해 주세요" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해 주세요" required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력해 주세요" required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUpPage;
