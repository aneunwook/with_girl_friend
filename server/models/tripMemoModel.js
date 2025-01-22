import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TripMemo = sequelize.define('TripMemo', {
    id:{
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
    memo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},{
    timestamps: true,
    tableName: 'trip_memos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
}
)

TripMemo.associate = (models) => {
        // 하나의 TripMemo는 하나의 Trip에 속한다.
    TripMemo.belongsTo(models.Trip, {foreignKey:'trip_id', as: 'trip'})
}

export default TripMemo;