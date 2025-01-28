import sequelize from '../config/db.js';
import Trip from './tripModel.js';
import TripPhoto from './tripPhotoModel.js';
import TripMemo from './tripMemoModel.js';

// 모델 초기화
const models = {
  Trip,
  TripPhoto,
  TripMemo,
};

// 모델 관계 정의
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize, models };
