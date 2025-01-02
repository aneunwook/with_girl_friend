import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Anniversary = sequelize.define('Anniversary', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anniversary_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true, 
    tableName: 'anniversaries', 
    underscored: true,
  });
  
  export default Anniversary;