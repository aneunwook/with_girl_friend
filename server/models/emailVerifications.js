import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const EmailVerification = sequelize.define(
  'EmailVerification',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 한 이메일당 한 번의 인증 코드만 저장 가능
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // 기본값은 false (아직 인증되지 않음)
    },
    
  },
  {
    timestamps: true,
    tableName: 'email_verifications',
  }
);

export default EmailVerification;
