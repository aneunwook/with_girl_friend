import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../assets/styles/ImageSlider.module.css';

const ImageSlider = ({ images }) => {
  const setting = {
    dots: true, // 페이지네이션 (도트 네비게이션)
    infinite: true, // 무한 루프
    speed: 500,
    slidesToShow: 1, // 한 번에 하나씩 보여줌
    slidesToScroll: 1,
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 3초마다 변경
    arrows: true, // 좌우 화살표
  };

  return (
    <main>
      <div className={styles.sliderContainer}>
        <Slider {...setting}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className={styles.slideImage}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className={styles.howLongDate}></div>
    </main>
  );
};

export default ImageSlider;
