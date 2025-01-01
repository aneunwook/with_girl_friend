import dotenv from 'dotenv'; // require 대신 import 사용
dotenv.config();

import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:3001', // 클라이언트 URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 포함
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 쿠키 포함 요청을 허용
  })
);
app.options('*', cors()); // OPTIONS 요청 허용

app.use(express.json());
app.use('/api/posts', postRoutes); // 여기에 CRUD 관련 라우트를 설정할 수 있습니다.
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`
  );
  console.log('Request Headers:', req.headers);
  next();
});

// 서버 실행 전에 Sequelize 연결 확인
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
