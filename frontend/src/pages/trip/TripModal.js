import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTrip } from '../../service/trip/tripService.js';
import '../../assets/styles/TripModal.css';

const TripModal = ({ trip, onClose, onDelete, isLoading }) => {
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

  const photos =
    trip.trip_photos && trip.trip_photos.length > 0 ? trip.trip_photos : [];

  const totalPhotos = photos.length;

  // 다음 사진으로 이동
  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  // 이전 사진으로 이동
  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(trip.id);
      alert('여행 기록이 삭제되었습니다');
      onDelete(trip.id); // 삭제된 ID를 부모에게 전달
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('게시물 삭제 중 에러발생', error);
      alert('여행 기록 삭제 실패');
    }
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
              src={`http://localhost:3000${photos[currentIndex].photo_url}`}
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

        {trip.memo ? <p>{trip.memo}</p> : <p>메모가 없습니다.</p>}

        <button
          onClick={() => navigate(`/editTrip/${trip.id}`)}
          className="edit-btn"
        >
          수정
        </button>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
};

export default TripModal;
