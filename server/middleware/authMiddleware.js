import jwt from 'jsonwebtoken';

// 환경 변수에서 JWT 비밀 키 가져오기
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined. Set it in the environment variables.");
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    // Authorization 헤더 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Unauthorized access attempt: Missing or malformed token');
        return res.status(401).json({ message: 'Unauthorized: Token is missing or malformed' });
    }

    // 토큰 추출
    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        console.log('Decoded Token:', decodedToken);

        // 토큰 구조 확인
        if (!decodedToken || !decodedToken.userId || !decodedToken.role) {
            console.error('Invalid token structure:', decodedToken);
            return res.status(403).json({ message: 'Forbidden: Invalid token structure' });
        }

        // req.user 설정
        req.user = { id: decodedToken.userId, role: decodedToken.role };
        console.log('Request User Object:', req.user);

        // 다음 미들웨어 호출
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);

        // 만료된 토큰 처리
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Forbidden: Token has expired' });
        }

        // 기타 오류
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export default authenticateToken;
