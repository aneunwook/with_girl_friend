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

        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(trip);
          }
        });
        // 마커 hover 시 대표 사진 표시
        // marker.addListener('mouseover', () => {
        //   const photoUrl =
        //     trip.photos && trip.photos.length > 0
        //       ? trip.photos[0].photo_url
        //       : null;

        //   if (photoUrl) {
        //     infoWindowRef.current.setContent(
        //       `<div style="width: 150px; text-align: center;">
        //         <img src="${photoUrl}" alt="${trip.name}" style="width: 100%;" />
        //         <p style="margin: 5px 0 0; font-size: 14px;">${trip.name}</p>
        //       </div>`
        //     );
        //     infoWindowRef.current.open(map.current, marker);
        //   }
        // });
        // 마우스가 마커에서 나가면 정보 창 닫기
        //  marker.addListener('mouseout', () => {
        //   infoWindowRef.current.close();
        // });

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
