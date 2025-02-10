import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from './userModel.js';

const Couple = sequelize.define(
    'Couple',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement : true,
        },
        user1_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key : 'id',
            },
        },
        user2_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model : User,
                key : 'id',
            },
        },
    },
    {
        timestamps : true,
        tableName : 'couples',
        uniqueKeys: { // ✅ 유니크 키 설정
            unique_couple: {
                fields: ['user1_id', 'user2_id'],
            }
        }
    }
)

export default Couple;
