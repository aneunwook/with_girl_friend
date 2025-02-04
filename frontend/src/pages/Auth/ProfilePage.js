import React, {useEffect, useState} from "react";
import axiosInstance from "../../service/axiosInstance.js";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axiosInstance.get("/user/profile")
        .then((response) => setProfile(response.data))
        .catch((error) => console.error('프로필 가져오기 실패', error));
    }, []);

    return(
        <div>
      {profile ? (
        <div>
          <h1>{profile.name}님의 프로필</h1>
          <p>역할: {profile.role}</p>
        </div>
      ) : (
        <p>프로필 정보를 불러오는 중...</p>
      )}
    </div>
  );
}