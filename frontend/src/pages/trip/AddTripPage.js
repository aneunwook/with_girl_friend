import React, { useEffect, useState } from 'react';
import MapComponent from '../../components/MapComponent.js';
import { addTrip, uploadTripPhoto } from '../../service/trip/tripService.js';
import '../../assets/styles/AddTripPage.css';

const AddTripPage = ({ onTripAdded, existingTrips }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    memo: '',
    additionalMemos: [''],
  });

  const [photos, setPhotos] = useState([]); //모든 업로드 된 사진들
  const [tempMarker, setTempMarker] = useState(null) //주소 입력 시 임시 마커
  const [trips, setTrips] = useState(existingTrips || []); // 기존 저장된 여행 목록
  const [previewPhoto, setPreviewPhoto] = useState(null); // 미리보기 용 사진

  // 사용자가 주소를 입력할 때마다 임시 마커 업데이트
  useEffect(() => {
    if(formData.address){
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: formData.address}, (results, status) => {
        if (status === 'OK'){
          const location = results[0].geometry.location;
          setTempMarker({
            name: formData.name || '입력 중...',

            latitude: location.lat(),
            longitude: location.lng(),
            memo: formData.memo,

          })
        } else{
          setTempMarker(null);
        }
      });
    }else{
      setTempMarker(null);
    }
  }, [formData.address]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMemoChange = (index, value) => {
    const updateMemos = [...formData.additionalMemos];
    updateMemos[index] = value;
    setFormData({ ...formData, additionalMemos: updateMemos });
  };

  const addMemo = () => {
    setFormData({
      ...formData,
      additionalMemos: [...formData.additionalMemos, ''],
    });
  };

  const removeMemo = (index) => {
    const updatedMemos = [...formData.additionalMemos];
    updatedMemos.splice(index, 1);
    setFormData({ ...formData, additionalMemos: updatedMemos });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhoto) => [...prevPhoto, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: 사진 업로드
      const photoData = new FormData();
      photos.forEach((file) => photoData.append('trip', file));
      const { photo_url, additionalPhotos } = await uploadTripPhoto(photoData);

      // Step 2: 여행지 추가
      const tripData = {
        name: formData.name,
        address: formData.address,
        memo: formData.memo,
        photo_url,
        additionalPhotos,
        additionalMemos: formData.additionalMemos,
      };

      const addResponse = await addTrip(tripData);

      if (!addResponse || !addResponse.trip) {
        console.error("Invalid API response structure:", addResponse);
        return;
      }
      
      const trip = addResponse.trip;
      if (!trip) {
        console.error("No trip data in response:", addResponse);
        return;
      }

      
      if (onTripAdded) {
        onTripAdded(trip); // 부모 컴포넌트에 추가된 여행지 정보 전달
      }

      // 기존 여행지 목록 업데이트
      setTrips([...trips, trip]);

      // 입력 폼 초기화 & 임시 마커 제거
      setFormData({
        name: '',
        address: '',
        memo: '',
        additionalMemos: [''],
      });
      setPhotos([]);
      setTempMarker(null);
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  };

  return (
    <div className="add-trip-container">
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <input
          type="text"
          name="name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
          placeholder="여행지의 이름을 입력해 주세요"
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="address"
          className="input-field"
          value={formData.address}
          onChange={handleChange}
          placeholder="주소를 입력해 주세요"
        />
      </div>
      <div className='file-upload-container'>
        <input
          type="file"
          name="trip"
          id="fileUpload" // label과 연결하기 위해 id 지정
          className="file-input"
          placeholder="추가 할 사진들을 넣어 주세요"
          multiple
          onChange={handlePhotoChange}
        />

         {/* 파일 업로드 입력창 (사용자가 직접 입력 가능) */}
         <div className="file-input-box">
          <input
            type="text"
            className="file-text-input"
            placeholder="파일을 선택하거나 클릭하여 업로드하세요"
            readOnly
            value={photos.map((file) => file.name).join(', ')} // 선택된 파일명 표시
          />
        <label htmlFor="fileUpload" className="custom-upload-button">
            <i class="fa-solid fa-upload"></i>
        </label>
      </div>
      </div>
      <div>
        <input
          type="text"
          name="memo"
          className="input-field"
          value={formData.memo}
          placeholder="내용을 적어 주세요"
          onChange={handleChange}
        />
      </div>
      {/* <div>
        <label>추가 메모들:</label>
        {formData.additionalMemos.map((memo, index) => (
          <div key={index}>
            <input
              type="text"
              className="input-field"
              value={memo}
              onChange={(e) => handleMemoChange(index, e.target.value)}
            />
            <button type="button" onClick={() => removeMemo(index)}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addMemo}>
          추가 메모 추가
        </button>
      </div> */}
      <button type="submit">여행지 추가</button>
    </form>
   {/* 우측 - 지도 */}
   <div className="map-container">
        <MapComponent trips={trips} tempMarker={tempMarker} />
      </div>
    </div>
  );
};

export default AddTripPage;
