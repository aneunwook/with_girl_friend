import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signUp,
  requestEmailVerification,
  verifyEmailCode,
  checkEmail,
} from '../../service/auth/authService';
import styles from '../../assets/styles/LoginPage.module.css';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력한 인증 코드
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
  const [isChecking, setIsChecking] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 이메일 인증 요청 (6자리 코드 전송)
  const handleVerification = async () => {
    try {
      const response = await requestEmailVerification(formData.email);
      alert('인증 코드가 이메일로 전송되었습니다.');
      setStep(2);
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
        setStep(3);
      } else {
        setError(response?.error || '잘못된 인증 코드입니다.');
      }
    } catch (err) {
      console.error('❌ 인증 코드 검증 실패:', err);
      setError('인증 코드 확인 실패!');
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      setMessage('이메일을 입력하세요');
      return;
    }
    setIsChecking(true);
    setIsEmailValid(false);
    try {
      const response = await checkEmail(formData.email);
      if (response.status === 200) {
        setMessage('사용 가능한 이메일 입니다.');
        handleVerification();
        setIsEmailValid(true); // 이메일 사용 가능
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('이미 존재하는 이메일 입니다.');
      } else {
        setMessage('오류가 발생했습니다. 다시 시도하세요.');
      }
    } finally {
      setIsChecking(false);
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
    <>
      <div className={styles.signUpContainer}>
        {step === 1 && (
          <div className={styles.emailContainer}>
            <div className={styles.inputWrapper}>
              <h1>회원가입</h1>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                className={styles.signUpField}
                required
              />
              <span className={styles.floatingLabel}>Email</span>
            </div>
            <button type="button" onClick={handleCheckEmail}>
              중복 확인
            </button>

            {message && <p>{message}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="verified-container">
            <input
              type="text"
              placeholder="인증 코드 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.signUpField}
            ></input>
            <button type="button" onClick={handleVerifyCode}>
              인증 코드 확인
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className={styles.signUpFormContainer}>
            <div className="password-container">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={styles.signUpField}
                required
              />
            </div>
            <div className="name-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={styles.signUpField}
                required
              />
            </div>
            <button type="submit" disabled={!isVerified}>
              회원가입
            </button>
          </form>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
};

export default SignUpPage;
