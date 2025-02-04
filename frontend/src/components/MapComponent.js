import React, { useEffect, useRef } from 'react';
import '../assets/styles/MapComponent.css';

const MapComponent = ({ trips, onMarkerClick, tempMarker, className }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]); // 마커 참조
  const map = useRef(null); // 지도 객체
  const infoWindowRef = useRef(null); // 정보 창 참조
  const tempMarkerRef = useRef(null); // 임시 마커 참조

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
           <div class="custom-info-window">
          <img src="http://localhost:5000${trip.photo_url}" alt="대표 사진" class="info-img">
          <hr class="info-divider"/>
          <p class="info-text">${trip.name}</p>
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

  // 주소 입력 시 임시 마커 처리
  useEffect(() => {
    if (map.current) {
      // 기존 임시 마커 삭제
      if (tempMarkerRef.current) {
        tempMarkerRef.current.setMap(null);
      }

      if (tempMarker) {
        const { latitude, longitude } = tempMarker;
        if (!isNaN(latitude) && !isNaN(longitude)) {
          tempMarkerRef.current = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map.current,
            title: '입력한 주소임',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });

          // 지도 중심 이동
          map.current.setCenter({ lat: latitude, lng: longitude });
        }
      }
    }
  }, [tempMarker]);

  return <div ref={mapRef} className={`map ${className}`} />;
};

export default MapComponent;
