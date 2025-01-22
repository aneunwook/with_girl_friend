// models/index.js (또는 다른 파일에서 모델을 모아서 가져오는 방식)
import Trip from './tripModel.js';
import TripPhoto from './tripPhotoModel.js';
import TripMemo from './tripMemoModel.js';

const models = {
  Trip,
  TripPhoto,
  TripMemo,
};

// 관계 설정
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

export { models, Trip, TripPhoto, TripMemo };
