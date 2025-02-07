import React, { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailCode } from "../../service/auth/authService.js";
import { useSignUp } from "./SignUpContext.js";
import styles from '../../assets/styles/SignUp.module.css';

const VerificationStep = () => {
    const { formData, setFormData } = useSignUp();
    const [ verificationCode, setVerificationCode ] = useState('');
    const [ message, setMessage ] = useState('');
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

    const handleVerifyCode = async () => {
        try{
            const response = await verifyEmailCode(formData.email, verificationCode);
            if(response?.message?.trim() === '이메일 인증 성공!'){
                setFormData({ ...formData, isVerified: true});
                navigate('/signUp/password');
            }else {
                setMessage('잘못된 인증 코드입니다');
              }
            } catch {
              setMessage('인증 코드 확인 실패');
            }
    }

    return (
        <div className={styles.signUpContainer}>
        <div className={styles.verifiedContainer}>
            <h2 className={styles.signUpTitle}>Get Started With Us</h2>
            <p className={styles.signUpSubTitle}>Please verify your identity by entering the code you received</p>
            <div className={`${styles.inputWrapper} ${message ? styles.showMessage : ''}`}>
            <input
              type="text"
              placeholder=""
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.signUpField}
            ></input>
            <span className={styles.floatingLabel}>Code</span>
            </div>
            {/* 메시지 영역을 div로 감싸기 */}
            {/* 메시지 영역 */}
            <div ref={messageRef} className={`${styles.messageContainer} ${message ? styles.show : ""}`}>
                  <i class="fa-solid fa-triangle-exclamation"></i>
                   <p className={styles.message}>{message}</p>
            </div>
            <button type="button" onClick={handleVerifyCode} className={styles.sendCode}>
                Check Code
            </button>
          </div>
          </div>
      );
}

export default VerificationStep;