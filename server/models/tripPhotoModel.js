import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Trip from '../models/tripModel.js';

const TripPhoto = sequelize.define(
  'TripPhoto',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'trip_photos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

TripPhoto.associate = (models) => {
  // 하나의 TripPhoto는 하나의 Trip에 속한다.
  TripPhoto.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
};

export default TripPhoto;
