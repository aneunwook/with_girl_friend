import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define('User', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 이메일 중복 방지
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    profile_picture:{
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    timestamps: true, //createdAt, updatedAt 컬럼 자동생성
    tableName: 'users', // 데이블 이름 명시적으로 지정
})

export default User;