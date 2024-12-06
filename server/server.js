import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import sequelize from './config/db.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', postRoutes);

// 서버 실행 전에 Sequelize 연결 확인
sequelize.sync().then(() => {
    console.log('DataBase Connected successfully');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
