import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

dotenv.config(); // .env 파일 로드

// Sequelize 설정
const sequelize = new Sequelize(
  process.env.DB_NAME, // 데이터베이스 이름
  process.env.DB_USER, // 사용자명
  process.env.DB_PASSWORD, // 비밀번호
  {
    host: process.env.DB_HOST, // 호스트
    dialect: 'mysql', // MySQL 사용
    port: process.env.DB_PORT || 3306, // MySQL 포트 (필요하면 .env에 추가)
    logging: false, // SQL 쿼리 로그 비활성화
  }
);

// 데이터베이스 연결 확인
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected successfully!');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });

export default sequelize;
