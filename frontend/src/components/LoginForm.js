import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import styles from '../assets/styles/LoginPage.module.css';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      alert('로그인 성공!');
      navigator('/');
    } catch (err) {
      alert('로그인 실패!');
    }
  };
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.contentContainer}>
          <div className={styles.userContainer}>
            <h2 className={styles.loginTitle}>Account Sign In</h2>
            <form onSubmit={handleSubmit} className={styles.loginSubmitForm}>
              <div
                className={`${styles.inputWrapper} ${
                  message ? styles.showMessage : ''
                }`}
              >
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.loginField}
                />
                <span className={styles.floatingLabel}>Email</span>
              </div>
              <div
                className={`${styles.inputWrapper} ${
                  message ? styles.showMessage : ''
                }`}
              >
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.loginField}
                />
                <span className={styles.floatingLabel}>Password</span>
              </div>

              <div className={styles.sendLoginContainer}>
                <button type="submit" className={styles.loginButton}>
                  로그인
                </button>
                <hr />
              </div>
            </form>
            <div className={styles.goToSignUpContainer}>
              <Link to="/signUp/email" className={styles.loginLink}>
                Create a New Account
              </Link>
              <Link to="/signUp/email" className={styles.forgotPassword}>
                Lost Password?
              </Link>
            </div>
          </div>
          <div className={styles.imgContainer}></div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
