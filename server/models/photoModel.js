import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Photo = sequelize.define(
  'Photo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // 자동 증가
    },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts', // 외래키로 참조할 모델 이름
        key: 'id', // 참조하는 필드
      },
      onDelete: 'CASCADE', // 게시물이 삭제되면 해당 게시물에 속한 사진도 삭제
    },

    photo_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'photos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Photo;
