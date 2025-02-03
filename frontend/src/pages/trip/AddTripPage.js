import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [photos, setPhotos] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [trips, setTrips] = useState(existingTrips || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: formData.address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          setTempMarker({
            name: formData.name || '입력 중...',
            latitude: location.lat(),
            longitude: location.lng(),
            memo: formData.memo,
          });
        } else {
          setTempMarker(null);
        }
      });
    } else {
      setTempMarker(null);
    }
  }, [formData.address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
  };

  const handleDeletePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const photoData = new FormData();
      photos.forEach((file) => photoData.append('trip', file));
      const { photo_url, additionalPhotos } = await uploadTripPhoto(photoData);

      const tripData = {
        name: formData.name,
        address: formData.address,
        memo: formData.memo,
        photo_url,
        additionalPhotos,
        additionalMemos: formData.additionalMemos,
      };

      const addResponse = await addTrip(tripData);
      if (onTripAdded) {
        onTripAdded(addResponse.trip);
      }

      alert('여행지가 추가되었습니다');
      navigate('/trips');
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
    <div className="edit-trip-container">
      <div className="title-container">
        <p className="form-title">Add a New Travel Destination!</p>
        <p className="form-description">
          Enter the name and address of the place you visited, and add photos
          and notes!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form-container">
        <div>
          <h3>Name</h3>
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
          <h3>Address</h3>
          <input
            type="text"
            name="address"
            className="input-field"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소를 입력해 주세요"
          />
        </div>
        <h3 className="post-text">사진 첨부</h3>
        <div className="edit-photo-container">
          {photos.map((photo, index) => (
            <div key={index} className="edit-photo-item">
              {/* 미리보기 */}
              <div className="photo-wrapper">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`추가 사진 ${index}`}
                  className="photo-preview"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeletePhoto(index)}
                >
                  <i className="fa-solid fa-x"></i>
                </button>
              </div>
            </div>
          ))}

          {/* 최대 10개까지만 추가 가능 */}
          {photos.length < 10 && (
            <label className="add-button">
              <i className="fa-solid fa-camera"></i> 사진 추가
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="extra-image"
                hidden
              />
            </label>
          )}
        </div>
        <div>
          <h3>메모</h3>
          <textarea
            name="memo"
            className="input-field"
            value={formData.memo}
            onChange={handleChange}
            placeholder="메모 해주세요"
          />
        </div>
        <div className="edit-submit-button">
          <button type="submit" className="edit-button">
            등록
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

export default AddTripPage;
