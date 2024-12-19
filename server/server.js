import dotenv from 'dotenv'; // require 대신 import 사용
dotenv.config();

import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3000'], // 클라이언트 URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 포함
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // 쿠키 포함 요청을 허용
}));

app.use(express.json());
app.use('/api/posts', postRoutes); // 여기에 CRUD 관련 라우트를 설정할 수 있습니다.
app.use('/api/auth', userRoutes);

// 404 에러 처리
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});


// 서버 실행 전에 Sequelize 연결 확인
sequelize.sync({force: false}).then(() => {
    console.log('Database synchronized successfully');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
