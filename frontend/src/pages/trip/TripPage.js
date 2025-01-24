import React, { useState } from 'react';
import MapComponent from '../../components/MapComponent.js';
import AddTripPage from './AddTripPage.js';

const TripPage = () => {
  const [trips, setTrips] = useState([]);

  const handleTripAdded = (newTrip) => {
    setTrips((prevTrips) => [...prevTrips, newTrip]);
  };

  return (
    <div>
      <h1>여행지 관리</h1>
      <AddTripPage onTripAdded={handleTripAdded} />
      {/* <MapComponent trips={trips} /> */}
    </div>
  );
};

export default TripPage;
