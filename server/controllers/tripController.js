import Trip from '../models/tripModel.js';
import TripPhoto from '../models/tripPhotoModel.js';
import TripMemo from '../models/tripMemoModel.js';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBiiT7sHwRcIsxcRd-H1lQWHdQ9K0ZRZU8';

export const addTrip = async (req, res) => {
  const { address, name, photo_url, memo } = req.body;

  if (!address || !name) {
    return res.status(400).json({ message: '주소와 이름은 필수입니다.' });
  }

  try {
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const location = geocodeResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    const newTrip = await Trip.create({
      user_id: 1,
      name,
      latitude: lat,
      longitude: lng,
      address,
      photo_url,
      memo,
    });
    res
      .status(201)
      .json({ message: '여행지가 추가되었습니다.', trip: newTrip });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: '여행지를 추가하는 중 오류가 발생했습니다.' });
  }
};

export const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { address, name, photo_url, memo } = req.body;
};
