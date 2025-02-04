import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/TripModal.css';

const TripModal = ({ trip, onClose, isLoading }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스 상태

  if (!trip || isLoading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Loading...</p>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    );
  }

  const photos = trip.trip_photos || []; // 추가 사진 목록
  const totalPhotos = photos.length; // 총 사진 개수

  // 다음 사진으로 이동
  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  // 이전 사진으로 이동
  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          x
        </button>
        <h3>{trip.name}</h3>

        {totalPhotos > 0 ? (
          <div className="slider-container">
            <button className="prev-btn" onClick={prevPhoto}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <img
              src={`http://localhost:5000${photos[currentIndex].photo_url}`}
              alt={`여행 사진 ${currentIndex + 1}`}
              className="slider-image"
            />
            <button className="next-btn" onClick={nextPhoto}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        ) : (
          <p>사진이 없습니다.</p>
        )}

        {/* 인디케이터 (동그라미) */}
        <div className="indicator-container">
          {photos.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)} // 클릭 시 해당 사진으로 이동
            ></span>
          ))}
        </div>

        {trip.memos && trip.memos.length > 0 ? (
          trip.memos.map((memo) => <p key={memo.id}>{memo.memo}</p>)
        ) : (
          <p>메모가 없습니다.</p>
        )}

        <button
          onClick={() => navigate(`/editTrip/${trip.id}`)}
          className="edit-btn"
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default TripModal;
