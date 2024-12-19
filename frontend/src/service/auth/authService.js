import axiosInstance from "../axiosInstance";

export const signUp = async(userData) => {
    try{
        const response = await axiosInstance.post('/auth/signUp', userData);
        console.log("data:", response.data);
        return response.data;
    }catch (err) {
        if (err.response) {
          console.error('회원가입 오류:', err.response.data); // 서버 응답 오류 내용
        } else {
          console.error('회원가입 요청 실패:', err.message); // 네트워크 오류 등
        }
        throw err;
      }
    }

    export const signIn = async (userData) => {
        try {
            console.log('서버로 전달된 데이터:', userData);
        
            const response = await axiosInstance.post('/auth/signIn', userData);
            console.log('응답 전체:', response);

            const { accessToken, refreshToken } = response.data;
            
            console.log('Access Token이 저장되었습니다:', accessToken);
            console.log('Refresh Token이 저장되었습니다:', refreshToken);
            // 로컬 스토리지에 저장
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
    
            alert('로그인 성공');
            return { accessToken, refreshToken };

        } catch (err) {
            if (err.response) {
                console.error('로그인 오류:', err.response.data);
            } else {
                console.error('로그인 요청 실패:', err.message);
            }
            throw err;
        }
    };
    