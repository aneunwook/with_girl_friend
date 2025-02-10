import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Couple from './couples.js'

const Playlist = sequelize.define(
    'Playlist',
    {
        id:{
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        couple_id :{
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : 'couples',
                key : 'id',
            },
            onDelete: 'CASCADE', // 삭제 시 해당 게시물도 함께 삭제

        },
    },
    {
        timestamps : true,
        tableName : 'playlists',
    }
)


export default Playlist;