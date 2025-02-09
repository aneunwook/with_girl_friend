import React, { useContext } from 'react';
import ImageSlider from './ImageSlider';
import main1 from '../assets/styles/image/main1.jpg';
import main2 from '../assets/styles/image/main2.jpg';
import main4 from '../assets/styles/image/main4.jpg';
import { AuthContext } from '../context/AuthContext.js';
import LoveDay from './LoveDay';

const images = [main1, main2, main4];

const MainPage = ({}) => {
  const { user } = useContext(AuthContext); // ✅ useContext로 가져오기
  console.log('MainPage에서 받은 user:', user); // ✅ 확인!

  console.log('🔥 MainPage에서 받은 user:', user);

  return (
    <div>
      <ImageSlider images={images} />
      <LoveDay user={user} />
    </div>
  );
};

export default MainPage;

//오늘이 몇 번째 날인지 카운트
//함께한 여행 기록, 데이트 사진 모아보기, 특별했던 날들 카드 형식으로 정리
//오늘의 날씨, 사랑 관련 명언이나, 서로 했던 감동적인 말
