import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import sequelize from './config/db.js'; // sequelize import
import userRoutes from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', postRoutes); // 여기에 CRUD 관련 라우트를 설정할 수 있습니다.
app.use('/api', userRoutes);

// 서버 실행 전에 Sequelize 연결 확인
sequelize.sync({force: false}).then(() => {
    console.log('Database synchronized successfully');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
