import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../service/auth/authService";

const LoginPage = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const userData = {email, password};
            const {token} = await signIn(userData);
            localStorage.setItem('token', token)
            navigate('/');
        }catch(err){
            console.error('로그인 오류:', err);   
        }
    }

    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email"
                        value={email}
                        onChange={handleEmail}
                        placeholder="이메일을 입력해주세요"
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password"
                        value={password}
                        onChange={handlePassword}
                        placeholder="비밀번호을 입력해주세요"
                        required
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default LoginPage;