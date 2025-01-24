import React, { useEffect, useRef, useState} from 'react';
import { getAllTrips, getTripDetails } from '../service/trip/tripService.js';

const MapComponent = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if(window.google){
            // Google Maps 객체 생성
            new window.google.maps.Map(mapRef.current, {
                center: { lat: 37.5665, lng: 126.9780 }, // 초기 중심 (서울)
                zoom: 10, // 줌 레벨
            })
        } else {
            console.error('Google Maps JavaScript API가 로드되지 않았습니다.');
        }
    }, []);
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