import dotenv from 'dotenv';
dotenv.config(); // .env 파일을 읽어 환경 변수 설정

export const config = {
    development: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'mysql',
    },
};
