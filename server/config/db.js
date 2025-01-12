import { Sequelize } from 'sequelize';
import { config } from './config.js';

// Sequelize 설정
const sequelize = new Sequelize(
  config.development.database, // DB 이름
  config.development.username, // 사용자명
  config.development.password, // 비밀번호
  {
    host: config.development.host, // 호스트
    dialect: config.development.dialect, // MySQL 사용
  }
);

// 데이터베이스 연결 확인
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
