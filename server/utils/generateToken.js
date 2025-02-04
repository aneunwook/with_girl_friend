import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET 값이 설정되지 않았습니다.");
    }

    return jwt.sign(
        {
            id : user.id, 
            email : user.email, 
            name : user.name,
            role: user.role
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1h'}
    )
}

export default generateToken;