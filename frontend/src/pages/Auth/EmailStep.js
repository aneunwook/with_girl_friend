import React, { useState, useEffect, useRef} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  requestEmailVerification,
  checkEmail,
} from '../../service/auth/authService';
import { useSignUp } from './SignUpContext';
import styles from '../../assets/styles/SignUp.module.css';

const EmailStep = () => {
  const {formData, setFormData} = useSignUp();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (message && messageRef.current) {
      const messageBox = messageRef.current;
      messageBox.style.height = `${messageBox.scrollHeight}px`; // 동적으로 높이 설정
    } else if (!message && messageRef.current) {
      messageRef.current.style.height = "0"; // 메시지가 사라질 때 높이 0으로
    }
  }, [message]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleCheckEmail = async () => {
    if (!formData.email) {
      setMessage('이메일을 입력해 주세요');
      return;
    }

    if(!validateEmail(formData.email)){
      setMessage('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await checkEmail(formData.email);
      if (response.status === 200) {
        setMessage('사용 가능한 이메일 입니다.');
        await requestEmailVerification(formData.email);
        navigate('/signUp/verify');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('이미 존재하는 이메일 입니다.');
      } else {
        setMessage('오류가 발생했습니다. 다시 시도하세요.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={styles.signUpContainer}>
      <div className={styles.emailContainer}>
              <h2 className={styles.signUpTitle}>Get Started With Us</h2>
              <p className={styles.signUpSubTitle}>Weave your unique love story together on [Website Name], a haven for you and your forever person, where every chapter is a cherished memory</p>
            <div className={`${styles.inputWrapper} ${message ? styles.showMessage : ''}`}>
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
           {/* 메시지 영역을 div로 감싸기 */}
         {/* 메시지 영역 */}
            <div ref={messageRef} className={`${styles.messageContainer} ${message ? styles.show : ""}`}>
                  <i class="fa-solid fa-triangle-exclamation"></i>
                   <p className={styles.message}>{message}</p>
            </div>
            <div className={styles.sendCodeContainer}>
              <button type="button" onClick={handleCheckEmail} className={styles.sendCode}>
                {loading ? "전송중..." : "GET STARTED"}
              </button>
               {/* ✅ 로딩 중일 때 스피너 표시 */}
               {loading && <div className={styles.spinner}></div>}
            <hr/>
            </div>
            <div className={styles.goToLogin}>
              <Link to="/login" className={styles.loginLink}>Already have an account? Sign in here.</Link>
            </div>
          </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
};

export default EmailStep;
