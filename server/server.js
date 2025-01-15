import dotenv from 'dotenv'; // require 대신 import 사용
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
// import jwt from 'jsonwebtoken'; // JWT 주석 처리
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import anniversaryRoutes from './routes/anniversaryRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import { Post, Photo } from './models/index.js';

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 포함
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 쿠키 포함 요청을 허용
  })
);
app.options('*', cors()); // OPTIONS 요청 허용
// JSON 파싱 미들웨어
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/posts', postRoutes); // 여기에 CRUD 관련 라우트를 설정할 수 있습니다.
app.use('/api/auth', userRoutes);
app.use('/api/anniversaries', anniversaryRoutes);
app.use('/api/photos', photoRoutes);

// 정적 파일 제공: `/uploads` 요청에 대해 처리
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // React의 빌드된 정적 파일 제공
// app.use(express.static(path.join(__dirname, '../client/build')));

// // React 라우터와 정적 파일 처리
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// 로그용 미들웨어
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




  // JWT 관련 라우트 주석 처리
/*
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens[refreshToken]) {
    return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
});
*/