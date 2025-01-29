import React, { useEffect, useRef } from 'react';

const MapComponent = ({ trips, onMarkerClick }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]); // 마커 참조
  const map = useRef(null); // 지도 객체
  const infoWindowRef = useRef(null); // 정보 창 참조

  useEffect(() => {
    if (window.google) {
      // Google Maps 객체 생성
      map.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.978 }, // 초기 중심 (서울)
        zoom: 10, // 줌 레벨
      });
    } else {
      console.error('Google Maps JavaScript API가 로드되지 않았습니다.');
    }
  }, []);

  useEffect(() => {
    if (map.current && Array.isArray(trips) && trips.length > 0) {
      //기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (!infoWindowRef.current) {
        infoWindowRef.current = new window.google.maps.InfoWindow();
      }

      // 새로운 마커 추가
      trips.forEach((trip) => {
        const lat = parseFloat(trip.latitude);
        const lng = parseFloat(trip.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for trip: ${trip.name}`, {
            lat,
            lng,
          });
          return; // 좌표가 유효하지 않은 경우 스킵
        }
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map.current,
          title: trip.name,
        });

        // InfoWindow 생성
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div style="width: 150px; text-align: center;">
          <img src="http://localhost:3000${trip.photo_url}" alt="대표 사진" style="width: 100%; height: auto; border-radius: 5px;">
          <p style="margin: 5px 0;">${trip.memo}</p>
        </div>
      `,
        });

        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
        });

        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(trip);
          }
        });

        //마우스가 마커에서 나가면 정보 창 닫기
        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        markersRef.current.push(marker);
      });
    }
  }, [trips, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100vh', // 화면 전체 높이
      }}
    />
  );
};

export default MapComponent;
