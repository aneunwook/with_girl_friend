import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../service/auth/authService";

const SignUpPage = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const userData = {email, password, name};
            await signUp(userData); // authService의 signUp을 호출
            navigate('/login');
        }catch(err){
            console.error('회원가입 실패', err);    
        }
    }

    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email"
                        value={email}
                        onChange={handleEmail}
                        placeholder="이메일을 입력해 주세요"
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password"
                        value={password}
                        onChange={handlePassword}
                        placeholder="비밀번호를 입력해 주세요"
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" 
                        value={name}
                        onChange={handleName}
                        placeholder="이름을 입력해 주세요"
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}

export default SignUpPage;