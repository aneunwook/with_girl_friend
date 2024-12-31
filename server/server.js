import dotenv from 'dotenv'; // require 대신 import 사용
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // Refresh Token 검증 및 Access Token 발급에 필요
import postRoutes from './routes/postRoutes.js';
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT || 5000;

// Refresh Token 저장소 (임시: 실제로는 DB 사용을 권장)
const refreshTokens = {};

app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트 URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 포함
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // 쿠키 포함 요청을 허용
}));

app.use(express.json());
app.use('/api/posts', authenticateToken, postRoutes); // 여기에 CRUD 관련 라우트를 설정할 수 있습니다.
app.use('/api/auth', userRoutes);

// Refresh Token을 받아 새로운 Access Token 발급
app.post('/api/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    // Refresh Token 검증
    if (!refreshToken || !refreshTokens[refreshToken]) {
        return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
        }

        // 새로운 Access Token 발급
        const newAccessToken = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
});

// 로그용 미들웨어
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    next();
});

// 서버 실행 전에 Sequelize 연결 확인
sequelize.sync({ force: false }).then(() => {
    console.log('Database synchronized successfully');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
