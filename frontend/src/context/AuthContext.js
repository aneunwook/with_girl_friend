import { createContext, useState, useEffect } from 'react';
import { signIn, getUserProfile } from '../service/auth/authService.js';
import axiosInstance from '../service/axiosInstance.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // ✅ 토큰 상태 추가

  useEffect(
    () => {
      console.log('🔥 useEffect 실행됨, 저장된 토큰:', token);
      console.log('🔥 AuthProvider에서 제공하는 user 상태:', user);

      if (token) {
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`; // ✅ token 변경 시 axiosInstance 헤더 업데이트
        console.log(
          '✅ useEffect에서 axiosInstance 기본 헤더 설정 완료:',
          axiosInstance.defaults.headers.common['Authorization']
        );

        fetchUserProfile(token); // ✅ token이 있을 때만 사용자 정보 가져오기
      } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null); // ✅ 로그아웃 시 user 상태 초기화
      }
    },
    [token],
    [user]
  );

  // ✅ 사용자 정보 가져오는 함수
  const fetchUserProfile = async (token) => {
    try {
      console.log('🔥 fetchUserProfile 실행됨, 토큰:', token);

      const userData = await getUserProfile(token);
      console.log('✅ 불러온 사용자 정보:', userData);

      if (userData) {
        setUser(userData); // ✅ user 상태 업데이트!
        console.log('✅ user 상태 업데이트 완료!', userData);
      } else {
        console.error('❌ 받은 userData가 없음!');
      }
    } catch (err) {
      console.error('❌ 사용자 정보를 불러오지 못함:', err);
      setUser(null);
    }
  };

  const login = async (userData) => {
    console.log('🔥 login 함수 실행됨', userData); // ✅ 실행 여부 확인

    try {
      const data = await signIn(userData);
      console.log('로그인 응답 데이터:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log(
          '✅ localStorage에 저장된 토큰:',
          localStorage.getItem('token')
        ); // 🔥 확인용 로그

        setToken(data.token);

        // ✅ axiosInstance의 기본 헤더에 즉시 반영
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.token}`;
        console.log(
          '✅ axiosInstance 기본 헤더에 저장된 토큰:',
          axiosInstance.defaults.headers.common['Authorization']
        );

        console.log('저장된 토큰:', data.token);

        await fetchUserProfile(data.token); // ✅ 로그인 후 사용자 정보 가져오기!
      } else {
        console.error('토근이 응답에서 누락되었습니다.');
      }
      return data;
    } catch (err) {
      console.error('로그인 실패:', err);
      throw err;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/'; //
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
