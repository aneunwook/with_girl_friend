import React, { useEffect, useState } from 'react';
import MapComponent from '../../components/MapComponent.js';
import TripModal from './TripModal.js';
import { getAllTrips, getTripDetails } from '../../service/trip/tripService.js';
import { useActionData, useParams } from 'react-router-dom';

const TripPage = () => {
  const { id } = useParams(); // URL의 'id' 파라미터 추출
  const [trips, setTrips] = useState([]); //모든 여행지
  const [selectedTrip, setSelectedTrip] = useState(null); // 선택된 여행지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await getAllTrips();
        console.log('Fetched trips:', response); // 데이터 확인

        setTrips(response);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  const handleMarkerClick = async (trip) => {
    console.log('Clicked trip:', trip); // trip 객체 확인
    setIsLoading(true);
    try {
      const response = await getTripDetails(trip.id);
      setSelectedTrip(response); // 마커 클릭 시 선택된 여행지 설정
      console.log('게시물 정보:', response); // 데이터 확인
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setSelectedTrip(null); // 모달 닫기
  };

  return (
    <div className="map-page-container">
      <div className="map-header">
        <p className="map-title">Our Shared Memories</p>
        <div className="map-subtitle-button">
          <p className="map-subtitle">Let’s Leave Our Moments on the Map</p>
          <button className="map-button">Add Destination</button>
        </div>
      </div>
      <MapComponent
        trips={trips}
        onMarkerClick={handleMarkerClick}
        className="main-map"
      />
      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={handleModalClose}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TripPage;
