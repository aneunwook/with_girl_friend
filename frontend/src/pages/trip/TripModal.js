import React from 'react';
import { useNavigate } from 'react-router-dom'; // 라우팅에 필요

const TripModal = ({ trip, onClose, isLoading }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

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
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>닫기</button>
        <h3>{trip.name}</h3>

        {trip.trip_photos && trip.trip_photos.length > 0 ? (
          <>
            <h4>대표 사진</h4>
            <img
              src={`http://localhost:3000${trip.photo_url}`}
              alt={trip.name}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </>
        ) : (
          <p>대표 사진이 없습니다.</p>
        )}

        <h4>추가 사진들</h4>
        {trip.trip_photos && trip.trip_photos.length > 0 ? (
          trip.trip_photos.map((photo) => (
            <img
              key={photo.id}
              src={`http://localhost:3000${photo.photo_url}`}
              alt="추가 사진"
              style={{ width: '100%', marginBottom: '10px' }}
            />
          ))
        ) : (
          <p>추가 사진이 없습니다.</p>
        )}

        <h4>메모들</h4>
        {trip.memos && trip.memos.length > 0 ? (
          trip.memos.map((memo) => <p key={memo.id}>{memo.memo}</p>)
        ) : (
          <p>메모가 없습니다.</p>
        )}

        {/* 수정 버튼 추가 */}
        <button
          onClick={() => navigate(`/editTrip/${trip.id}`)}
          style={{
            marginTop: '20px',
            padding: '10px 15px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default TripModal;
