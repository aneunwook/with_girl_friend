import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripDetails, updateTrip } from '../../service/trip/tripService.js';

const TripEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null); // 여행지 정보를 저장
  const [isLoading, setIsLoading] = useState(true); //로딩 상태 저장
  const [error, setError] = useState(null); // 에러 메시지 저장

  // 수정 가능한 필드
  const [name, setName] = useState(''); // 여행지 이름
  const [address, setAddress] = useState(''); // 여행지 주소
  const [photo_url, setPhotoUrl] = useState(''); // 대표 사진 URL
  const [additionalPhotos, setAdditionalPhotos] = useState([]); // 추가 사진 리스트
  const [additionalMemos, setAdditionalMemos] = useState([]); // 추가 메모 리스트

  // 여행지 상세 정보를 가져오는 함수
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const data = await getTripDetails(id);
        setTrip(data);

        // 초기값설정
        setName(data.name);
        setAddress(data.address);
        setPhotoUrl(data.photo_url);
        setAdditionalPhotos(
          Array.isArray(data.trip_photos) ? data.trip_photos : []
        );
        setAdditionalMemos(Array.isArray(data.memo) ? data.memo : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch trip details'); // 에러 발생 시 메시지
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchTripDetails(); // 데이터 가져오기 호출
  }, [id]);

  // 추가 사진 추가 버튼 클릭 시 호출
  const handleAddPhoto = () => {
    setAdditionalPhotos([
      ...additionalPhotos,
      { id: null, photo_url: '' }, // 새로 추가된 사진은 id가 null
    ]);
  };

  // 특정 사진 URL변경
  const handlePhotoChange = (index, url) => {
    const updatedPhotos = [...additionalPhotos]; // 기존 리스트 복사
    updatedPhotos[index].photo_url = url; // 해당 인덱스의 URL 변경
    setAdditionalPhotos(updatedPhotos); // 상태 업데이트
  };

  // 특정 사진 삭제
  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...additionalPhotos]; //기존 리스트 복사
    updatedPhotos.splice(index, 1); // 해당 인덱스 삭제
    setAdditionalPhotos(updatedPhotos); // 상태 없데이트
  };

  // 추가 메모 추가 버튼 클릭 시 호출
  const handleAddMemo = () => {
    setAdditionalMemos([...additionalMemos, { id: null, memo: '' }]); // 새로 추가 된 메모는 id가 null
  };

  // 특정 메모 내용 변경
  const handleMemoChange = (index, text) => {
    const updatedMemo = [...additionalMemos];
    updatedMemo[index].memo = text;
    setAdditionalMemos(updatedMemo);
  };

  //특정 메모 삭제
  const handleDeleteMemo = (index) => {
    const updatedMemo = [...additionalMemos];
    updatedMemo.splice(index, 1);
    setAdditionalMemos(updatedMemo);
  };

  // 여행지 수정 API 호출
  const handleUpdate = async () => {
    try {
      const updatedData = {
        name,
        address,
        photo_url,
        additionalPhotos,
        additionalMemos,
      };

      await updateTrip(id, updatedData); // API 호출로 수정 데이터 전송
      alert('여행지가 성공적으로 수정되었습니다');
      navigate(`/trips`); // 수정 후 이동 페이지
    } catch (err) {
      console.error('Error updating trip:', err); // 오류 로그 출력
      alert('여행지 수정 중 오류가 발생했습니다.'); // 오류 메시지
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return <p>Loading...</p>; // 로딩 중 메시지
  }

  // 에러 상태 처리
  if (error) {
    return <p>Error: {error}</p>; // 에러 메시지 출력
  }

  return (
    <div>
      <h1>여행지 수정</h1>
      <div>
        <label>
          이름:
          <input
            type="text"
            value={name} // 이름 필드 값
            onChange={(e) => setName(e.target.value)} // 변경 시 상태 업데이트
          />
        </label>
      </div>
      <div>
        <label>
          주소:
          <input
            type="text"
            value={address} // 주소 필드 값
            onChange={(e) => setAddress(e.target.value)} // 변경 시 상태 업데이트
          />
        </label>
      </div>
      <div>
        <label>
          대표 사진 URL:
          <input
            type="text"
            value={photo_url} // 대표 사진 URL 값
            onChange={(e) => setPhotoUrl(e.target.value)} // 변경 시 상태 업데이트
          />
        </label>
      </div>
      <div>
        <h3>추가 사진들</h3>
        {additionalPhotos.map((photo, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="추가 사진 URL"
              value={photo.photo_url} // 해당 사진 URL
              onChange={(e) => handlePhotoChange(index, e.target.value)} // URL 변경 시 호출
            />
            <button onClick={() => handleDeletePhoto(index)}>삭제</button>
          </div>
        ))}
        <button onClick={handleAddPhoto}>추가 사진 추가</button>
      </div>
      <div>
        <h3>추가 메모들</h3>
        {additionalMemos.map((memo, index) => (
          <div key={index}>
            <textarea
              placeholder="메모 내용"
              value={memo.memo} // 해당 메모 내용
              onChange={(e) => handleMemoChange(index, e.target.value)} // 내용 변경 시 호출
            />
            <button onClick={() => handleDeleteMemo(index)}>삭제</button>
          </div>
        ))}
        <button onClick={handleAddMemo}>메모 추가</button>
      </div>
      <button onClick={handleUpdate}>수정</button>
      <button onClick={() => navigate(-1)}>취소</button>
    </div>
  );
};

export default TripEditPage;
