import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signUp,
  requestEmailVerification,
  verifyEmailCode,
} from '../../service/auth/authService';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력한 인증 코드
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 이메일 인증 요청 (6자리 코드 전송)
  const handleVerification = async () => {
    try {
      const response = await requestEmailVerification(formData.email);
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
      setError('이메일 인증 요청 실패!');
    }
  };

  // 인증 코드 검증
  const handleVerifyCode = async () => {
    if (isVerified) return; // 중복 요청 방지

    try {
      const response = await verifyEmailCode(formData.email, verificationCode);
      console.log('✅ 백엔드 응답:', response); // 디버깅 로그 추가

      if (response?.message?.trim() === '이메일 인증 성공!') {
        setIsVerified(true);
        setError(''); // 에러 초기화
        alert('이메일 인증 완료!');
      } else {
        setError(response?.error || '잘못된 인증 코드입니다.');
      }
    } catch (err) {
      console.error('❌ 인증 코드 검증 실패:', err);
      setError('인증 코드 확인 실패!');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 현재 인증 상태:', isVerified); // 로그 확인

    if (!isVerified) {
      setError('이메일 인증을 먼저 완료해주세요!');
      return;
    }

    try {
      const response = await signUp({ ...formData, isVerified });
      console.log('서버 응답:', response);

      if (response?.message === '회원가입 성공') {
        alert('회원가입 성공');
        navigate('/login');
      } else {
        setError(response.message || '회원가입 실패');
      }
    } catch (err) {
      console.error('회원가입 실패:', err);
      setError(error.response?.data?.error || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력해 주세요"
            required
          />
          <button type="button" onClick={handleVerification}>
            이메일 인증 요청
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="인증 코드 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          ></input>
          <button type="button" onClick={handleVerifyCode}>
            인증 코드 확인
          </button>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해 주세요"
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력해 주세요"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={!isVerified}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
