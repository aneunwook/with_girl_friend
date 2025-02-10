import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Playlist from "./Playlist.js";

const PlaylistSong = sequelize.define(
    "playlistsong",
    {
        id: {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        playlist_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Playlist,
                key : 'id',
            },
            onDelete: "CASCADE", // 플레이리스트 삭제 시 곡들도 삭제됨
        },
        spotify_track_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        track_name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        artist_name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        album_name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        preview_url: {
        type: DataTypes.STRING,
        allowNull: true, // 미리 듣기 URL (없을 수도 있음)
        },
        },
        {
          timestamps: true,
          tableName: "playlist_songs",
        }
)

export default PlaylistSong;
