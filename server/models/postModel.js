import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  // 파일 확장자 .js를 명시해야 함

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'posts',
    createdAt: 'created_at',  // DB 칼럼 이름을 'created_at'으로 매핑
    updatedAt: 'updated_at',
});

export default Post;
