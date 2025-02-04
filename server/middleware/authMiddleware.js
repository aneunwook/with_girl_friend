import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    console.log("🔍 Authorization 헤더:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message : '토큰이 필요합니다'});
    }

    try{
        console.log("🚀 추출된 토큰:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("✅ 토큰 디코딩 성공:", decoded);

        req.user = decoded;
        next();
  } catch (error) {
    console.error("❌ JWT 검증 실패:", error.message);
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

export default authMiddleware;