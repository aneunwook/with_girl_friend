import React, { useState } from 'react';
import { searchUserByEmail, registerCouple} from '../../service/couple/coupleService.js'

const CoupleRegister = () => {
    const [email, setEmail] = useState(''); // 입력한 이메일
    const [user, setUser] = useState(null); // 검색된 유저 정보
    const [message, setMessage] = useState('');

    // 상대방 검색
    const handleSearch = async () => {
        setMessage('');
        const foundUser = await searchUserByEmail(email);
        if(foundUser){
            setUser(foundUser);
        }else{
            setMessage("사용자를 찾을 수 없습니다");
            setUser(null);
        }
    }
    
    // 커플 등록

    const handleRegisterCouple = async () =>{
        if(!user) return;
        const result = await registerCouple(user.email);

        if(result){
            setMessage("🎉 우리는 커플입니다! 💕");
        }else {
            setMessage("❌ 커플 등록 실패");
          }
    }

    return(
        <div>
            <h2>커플 등록</h2>
            <input
                type='email'
                placeholder="상대방 이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>

            {user && (
        <div>
          <p>✨ {user.name}님을 찾았습니다!</p>
          <button onClick={handleRegisterCouple}>친구 추가</button>
        </div>
      )}

      {message && <p>{message}</p>}
        </div>
    )
}

export default CoupleRegister;