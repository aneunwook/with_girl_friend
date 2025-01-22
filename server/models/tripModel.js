import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import TripPhoto from '../models/tripPhotoModel.js';
import TripMemo from '../models/tripMemoModel.js';

const Trip = sequelize.define(
  'Trip',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      // 주소 필드 추가
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7), // 위도
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7), // 경도
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
    },
    memo: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: 'trips',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Trip.associate = (models) => {
  // 하나의 Trip은 여러 개의 TripPhoto와 TripMemo를 가질 수 있다.
  Trip.hasMany(models.TripPhoto, { foreignKey: 'trip_id', as: 'photos' });
  Trip.hasMany(models.TripMemo, { foreignKey: 'trip_id', as: 'memos' });
};

export default Trip;
