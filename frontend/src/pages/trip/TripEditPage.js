import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTripDetails,
  updateTrip,
  uploadTripPhoto,
} from '../../service/trip/tripService.js';
import MapComponent from '../../components/MapComponent.js';

import '../../assets/styles/EditTripPage.css';

const TripEditPage = (existingTrips) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null); // 여행지 정보를 저장
  const [isLoading, setIsLoading] = useState(true); //로딩 상태 저장
  const [error, setError] = useState(null); // 에러 메시지 저장

  // 수정 가능한 필드
  const [name, setName] = useState(''); // 여행지 이름
  const [address, setAddress] = useState(''); // 여행지 주소
  const [photo_url, setPhotoUrl] = useState(''); // 대표 사진 URL
  const [memo, setMemo] = useState(''); //대표 메모
  const [additionalPhotos, setAdditionalPhotos] = useState([]); // 추가 사진 리스트
  const [additionalMemos, setAdditionalMemos] = useState([]); // 추가 메모 리스트
  const [trips, setTrips] = useState(existingTrips || []); // 기존 저장된 여행 목록
  const [tempMarker, setTempMarker] = useState(null); //주소 입력 시 임시 마커

  // 사용자가 주소를 입력할 때마다 임시 마커 업데이트
  useEffect(() => {
    if (address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          setTempMarker({
            latitude: location.lat(),
            longitude: location.lng(),
          });
        } else {
          setTempMarker(null);
        }
      });
    } else {
      setTempMarker(null);
    }
  }, [address]);

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
        setMemo(data.memo);
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

  const handlePhotoUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('trip', file);

    try {
      const data = await uploadTripPhoto(formData);

      // 업로드된 사진의 URL을 상태에 반영
      const newPhotos = [...additionalPhotos];
      newPhotos[index].photo_url = data.photo_url; // 서버에서 받은 URL 저장
      setAdditionalPhotos(newPhotos);
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  const handleMainPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('trip', file);

    try {
      const data = await uploadTripPhoto(formData);
      setPhotoUrl(file); // 여기에서 File 객체 저장
    } catch (error) {
      console.error('대표 사진 업로드 실패:', error);
    }
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
        memo,
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
    <div className="edit-trip-container">
      {/* 제목 영역 */}
      <div className="title-container">
        <p className="form-title">Add a New Travel Destination!</p>
        <p className="form-description">
          Enter the name and address of the place you visited, and add photos
          and notes!
        </p>
      </div>

      {/* 폼 영역 */}
      <form className="edit-form-container">
        <div>
          <h3>Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="여행지의 이름을 입력해 주세요"
            required
          />
        </div>
        <div>
          <h3>Address</h3>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
            placeholder="주소를 입력해 주세요"
          />
          <h3 className="post-text">사진 첨부</h3>
        </div>
        {/* 추가 사진 영역 */}
        <div className="edit-photo-container">
          {[{ photo_url }, ...additionalPhotos].map((photo, index) => (
            <div key={index} className="edit-photo-item">
              {/* 미리보기 */}₩
              {photo.photo_url && (
                <div className="photo-wrapper">
                  <img
                    src={
                      photo.photo_url instanceof File
                        ? URL.createObjectURL(photo.photo_url)
                        : `http://localhost:3000${photo.photo_url}`
                    }
                    alt={`추가 사진 ${index === 0 ? '대표' : index}`}
                    className="photo-preview"
                  />
                  <label
                    htmlFor={`extra-image-${index}`}
                    className="custom-edit-button"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </label>
                  {/* 대표 사진 삭제는 photo_url 상태를 지우고, 추가 사진은 배열에서 제거 */}
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      index === 0
                        ? setPhotoUrl('')
                        : handleDeletePhoto(index - 1)
                    }
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                </div>
              )}
              {/* 파일 업로드 input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  index === 0
                    ? handleMainPhotoUpload(e)
                    : handlePhotoUpload(index - 1, e)
                }
                className="extra-image"
                id={`extra-image-${index}`} // 각 input에 고유 id 부여
              />
            </div>
          ))}
          {/* 최대 10개까지만 추가 가능 */}
          {additionalPhotos.length < 10 && (
            <label
              htmlFor={`extra-image-${additionalPhotos.length - 1}`}
              className="add-button"
              onClick={handleAddPhoto}
            >
              <i class="fa-solid fa-camera"></i>사진 추가
            </label>
          )}
        </div>

        {/* 추가 메모 영역 */}
        <div>
          <h3>메모</h3>
          <textarea
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="input-field"
            placeholder="메모 해주세요"
          />
        </div>

        {/* 제출 버튼 영역 */}
        <div className="edit-submit-button">
          <button type="button" onClick={handleUpdate} className="edit-button">
            수정
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="delete-edit-button"
          >
            취소
          </button>
        </div>
      </form>
      {/* 우측 - 지도 */}
      <div className="map-container">
        <MapComponent
          trips={trips}
          tempMarker={tempMarker}
          className="add-map"
        />
      </div>
    </div>
  );
};

export default TripEditPage;
