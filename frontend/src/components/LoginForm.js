import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

const LoginForm = () => {
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await login({email, password});
            alert('로그인 성공!');
        }catch (err) {
            alert('로그인 실패!');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">로그인</button>
        </form>
      );
    };
    
    export default LoginForm;

