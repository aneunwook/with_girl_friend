import dotenv from 'dotenv'; // require 대신 import 사용
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
// import jwt from 'jsonwebtoken'; // JWT 주석 처리
import defineAssociations from './config/associations.js';
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js';
import anniversaryRoutes from './routes/anniversaryRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import coupleRoutes from './routes/coupleRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
defineAssociations();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://3.147.66.146:3000',
      'http://localhost:8080',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 포함
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 쿠키 포함 요청을 허용
  })
);
app.options('*', cors()); // OPTIONS 요청 허용
// JSON 파싱 미들웨어
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/anniversaries', anniversaryRoutes);

app.use('/api/photos', photoRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/couples', coupleRoutes);
app.use('/api/playlists', playlistRoutes);

// 정적 파일 제공: `/uploads` 요청에 대해 처리
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// 정적 파일 제공: `/trip` 요청에 대해 처리
app.use('/trip', express.static(path.join(__dirname, '../trip')));

app.get('/', (req, res) => {
  res.send('Hello! The server is running.');
});

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
