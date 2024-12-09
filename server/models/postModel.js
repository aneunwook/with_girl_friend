import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  // .js 확장자를 명시해야 합니다.

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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Post;
