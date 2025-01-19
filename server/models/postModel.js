import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // 자동 증가
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // 외래키로 참조할 모델 이름
        key: 'id', // 외래키가 참조하는 필드
      },
      onDelete: 'CASCADE', // 삭제 시 해당 게시물도 함께 삭제
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true, // 설명은 선택사항으로 설정
    },

    tags: {
      type: DataTypes.STRING(255),
      allowNull: true, // 태그는 선택사항으로 설정
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'posts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Post;
