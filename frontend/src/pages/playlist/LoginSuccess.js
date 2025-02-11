import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const redirectTo = localStorage.getItem("redirectTo") || "/"; // 저장된 redirectTo가 있으면 사용

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_refresh_token", refreshToken);
      localStorage.removeItem("redirectTo"); // 리다이렉트 후 삭제
      navigate(redirectTo); // 저장된 경로로 이동
    }
  }, []);

  return <h2>로그인 성공! 이동 중...</h2>;
};

export default LoginSuccess;
