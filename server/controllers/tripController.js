import Trip from '../models/tripModel.js';
import TripPhoto from '../models/tripPhotoModel.js';
import TripMemo from '../models/tripMemoModel.js';
import axios from 'axios';
import sequelize from '../config/db.js';
import { models } from '../models/index1.js';
import { Op } from 'sequelize';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBiiT7sHwRcIsxcRd-H1lQWHdQ9K0ZRZU8';

export const tripUploadPhotos = async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    // 대표 사진 (첫 번째 파일)
    const photo_url =
      req.files && req.files[0] ? `/trip/${req.files[0].filename}` : null;

    // 추가 사진 (첫 번째 이후의 파일들)
    const additionalPhotos =
      req.files && req.files.length > 1
        ? req.files.slice(1).map((file) => `/trip/${file.filename}`)
        : [];

    res.status(200).json({
      message: '사진 업로드 완료',
      photo_url,
      additionalPhotos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '사진 업로드 중 오류가 발생했습니다.' });
  }
};

export const addTrip = async (req, res) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작
  const { address, name, photo_url, memo, additionalPhotos, additionalMemos } =
    req.body;
  console.log(req.body);
  console.log(req.files);

  if (!address || !name) {
    return res.status(400).json({ message: '주소와 이름은 필수입니다.' });
  }

  try {
    // 1. 주소로 위도/경도 가져오기
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!geocodeResponse.data.results.length) {
      return res.status(400).json({ message: '유효하지 않은 주소입니다.' });
    }

    const location = geocodeResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    // 2. Trip 생성
    const newTrip = await Trip.create(
      {
        user_id: 1,
        name,
        latitude: lat,
        longitude: lng,
        address,
        photo_url,
        memo,
      },
      { transaction: t }
    );

    // 3. 추가 사진 저장 (PhotoModel에 저장)
    if (additionalPhotos && additionalPhotos.length > 0) {
      const photos = additionalPhotos.map((url) => ({
        trip_id: newTrip.id,
        photo_url: url,
      }));
      await TripPhoto.bulkCreate(photos, { transaction: t });
    }

    // 4. 추가 메모 저장
    if (additionalMemos && additionalMemos.length > 0) {
      const memos = additionalMemos.map((text) => ({
        trip_id: newTrip.id,
        memo: text,
      }));
      await TripMemo.bulkCreate(memos, { transaction: t });
    }
    await t.commit(); // 성공 시 커밋
    res
      .status(201)
      .json({ message: '여행지가 추가되었습니다.', trip: newTrip });
  } catch (error) {
    await t.rollback(); // 실패 시 롤백
    console.error(error);
    res
      .status(500)
      .json({ message: '여행지를 추가하는 중 오류가 발생했습니다.' });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      attributes: ['id', 'name', 'latitude', 'longitude', 'photo_url', 'memo'],
    });
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: '여행지 목록을 가져오는 중 오류가 발생했습니다.' });
  }
};

export const getTripDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await models.Trip.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'latitude',
        'longitude',
        'address',
        'photo_url',
        'memo',
      ],
      include: [
        {
          model: models.TripPhoto,
          as: 'trip_photos',
          attributes: ['id', 'photo_url'],
        }, // 추가사진
        { model: models.TripMemo, as: 'memos', attributes: ['id', 'memo'] }, // 추가 메모
      ],
      logging: console.log, // 실행된 SQL 쿼리 확인
    });
    console.log(trip);

    if (!trip) {
      console.error(`Trip with ID ${id} not found`);
      return res
        .status(404)
        .json({ message: '해당 여행지를 찾을 수 없습니다' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error during getTripDetails:', error);
    console.error('Error stack:', error.stack); // 에러 스택 확인
    res
      .status(500)
      .json({ message: '여행지 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

export const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { address, name, photo_url, memo, additionalPhotos, additionalMemos } =
    req.body;

  if (!id || !name || !address) {
    return res.status(400).json({ message: 'ID, 주소, 이름은 필수 입니다' });
  }

  const t = await sequelize.transaction();

  try {
    //1. 여행지 ID로 데이터 조회
    const trip = await Trip.findOne({ where: { id }, transaction: t });

    if (!trip) {
      return res
        .status(404)
        .json({ message: '해당 ID의 여행지를 찾을 수 없습니다' });
    }

    // 2. 주소 변경 시, 위도/경도 업데이트
    let lat = trip.latitude;
    let lng = trip.longitude;

    if (address != trip.address) {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (!geocodeResponse.data.results.length) {
        return res.status(400).json({ message: '유효하지 않은 주소입니다.' });
      }
      const location = geocodeResponse.data.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
    }

    //3. 여행지 기본 정보 수정
    trip.name = name || trip.name;
    trip.address = address || trip.address;
    trip.latitude = lat;
    trip.longitude = lng;
    trip.photo_url = photo_url || trip.photo_url;
    trip.memo = memo || trip.memo;

    await trip.save({ transaction: t }); // 저장

    //4. 추가 사진 수정 (조건부 업데이트)
    if (additionalPhotos && additionalPhotos.length > 0) {
      // 유지할 사진 ID를 추출
      const existingPhotoIds = additionalPhotos // ID가 있는 사진만 필터링
        .filter((photo) => photo.id)
        .map((photo) => photo.id);

      // 삭제할 사진 제거
      await TripPhoto.destroy({
        where: { trip_id: id, id: { [Op.notIn]: existingPhotoIds } }, //Op.notIn은 "이 목록에 없는 항목"을 의미
        transaction: t,
      });

      // 새로 추가된 사진 입력
      const newPhotos = additionalPhotos.filter((photo) => !photo.id);
      if (newPhotos.length > 0) {
        const photosToCreate = newPhotos.map((photo) => ({
          trip_id: id,
          photo_url: photo.photo_url,
        }));
        await TripPhoto.bulkCreate(photosToCreate, { transaction: t });
      }
    }

    //5. 추가 메모 수정
    if (additionalMemos && additionalMemos.length > 0) {
      const existingMemoIds = additionalMemos
        .filter((memo) => memo.id)
        .map((memo) => memo.id);

      await TripMemo.destroy({
        where: { trip_id: id, id: { [Op.notIn]: existingMemoIds } },
        transaction: t,
      });

      const newMemos = additionalMemos.filter((memo) => !memo.id);
      if (newMemos.length > 0) {
        const memosToCreate = newMemos.map((memo) => ({
          trip_id: id,
          memo: memo.memo,
        }));
        await TripMemo.bulkCreate(memosToCreate, { transaction: t });
      }
    }

    await t.commit();
    res
      .status(200)
      .json({ message: '여행지가 성공적으로 업데이트 되었습니다', trip });
  } catch (error) {
    await t.rollback(); // 실패 시 롤백
    console.error(error);
    res
      .status(500)
      .json({ message: '여행지 정보를 업데이트하는 중 오류가 발생했습니다.' });
  }
};

export const deleteTrip = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();

  try {
    // 1. 여행지 존재 여부 확인
    const trip = await Trip.findByPk(id, { transaction: t });

    if (!trip) {
      return res
        .status(404)
        .json({ message: '해당 ID의 여행지를 찾을 수 없습니다.' });
    }

    // 2. 여행지 삭제 (cascade 가 사진과 메모도 자동으로 처리)
    await trip.destroy({ transaction: t });

    await t.commit();
    res.status(200).json({ message: '여행지가 성공적으로 삭제 되었습니다.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: '여행지 삭제 중 오류가 발생했습니다.' });
  }
};
