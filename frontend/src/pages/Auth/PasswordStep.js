import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../service/auth/authService.js';
import { useSignUp } from './SignUpContext.js';
import styles from '../../assets/styles/SignUp.module.css';

const PasswordStep = () => {
  const navigator = useNavigate();
  const { formData, setFormData } = useSignUp();
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!formData.isVerified) {
      setMessage('이메일 인증을 먼저 완료해주세요!');
      return;
    }

    // 1. 비밀번호 길이 체크 (8자 이상)
    if (formData.password.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    // 2. 비밀번호에 특수문자 포함 여부 확인
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      setMessage('비밀번호에 최소 1개의 특수문자가 포함되어야 합니다');
      return;
    }

    // 3. 비밀번호 & 비밀번호 확인 일치 여부 확인
    if (formData.password !== formData.passwordConfirm) {
      setMessage('비밀번호가 일치하지 않습니다');
      return;
    }

    if (!formData.startDate) {
      setMessage('만날 날짜를 입력해주세요!');
      return;
    }

    try {
      const response = await signUp(formData);
      if (response.message === '회원가입 성공') {
        alert('회원가입 성공');
        navigator('/login');
      } else {
        setMessage(response.message || '회원가입 실패');
      }
    } catch {
      setMessage('회원가입 실패');
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.emailContainer}>
        <h2 className={styles.signUpTitle}>Get Started With Us</h2>
        <p className={styles.signUpSubTitle}>
          Weave your unique love story together on [Website Name], a haven for
          you and your forever person, where every chapter is a cherished memory
        </p>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={formData.email || ''} // formData.email이 없을 경우 대비
            disabled // 수정 불가능
            className={styles.disabledInput}
          />
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={styles.signUpField}
            placeholder=""
          />
          <span className={styles.floatingLabel}>Password</span>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="password"
            name="passwordConfirm"
            onChange={(e) =>
              setFormData({ ...formData, passwordConfirm: e.target.value })
            }
            className={styles.signUpField}
            placeholder=""
          />
          <span className={styles.floatingLabel}>password Confirm</span>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.signUpField}
            placeholder=""
          />
          <span className={styles.floatingLabel}>Name</span>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="date" // 날짜 입력
            name="startDate"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className={styles.signUpField}
          />
          <span className={styles.floatingLabel}>Start Date (만난 날)</span>
        </div>

        <button onClick={handleSubmit} className={styles.sendCode}>
          Submit
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PasswordStep;
