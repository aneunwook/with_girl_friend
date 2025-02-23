import React, { useState, useRef, useEffect } from 'react';
import {
  searchUserByEmail,
  registerCouple,
} from '../../service/couple/coupleService.js';
import styles from '../../assets/styles/CoupleRegister.module.css';

const CoupleRegister = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const dropdownRef = useRef(null);

  const handleSearch = async () => {
    setMessage('');
    const foundUser = await searchUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      setMessage('사용자를 찾을 수 없습니다');
      setUser(null);
    }
  };

  const handleRegisterCouple = async () => {
    if (!user) return;

    try {
      const response = await registerCouple(user.email);

      setMessage('🎉 우리는 커플입니다! 💕'); // 성공 시 메시지
    } catch (error) {
      console.error('커플 등록 오류:', error);

      if (error.response?.status === 400) {
        const errorMsg = error.response.data.message;

        if (errorMsg.includes('자기 자신')) {
          setMessage('자기 자신은 커플을 맺을 수 없습니다');
        } else if (errorMsg.includes('이미 커플')) {
          setMessage('이미 커플입니다');
        } else {
          setMessage('❌ 커플 등록 실패');
        }
      } else {
        setMessage('❌ 서버 오류 발생');
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <h3>커플 등록</h3>
      <input
        type="email"
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
  );
};

export default CoupleRegister;
