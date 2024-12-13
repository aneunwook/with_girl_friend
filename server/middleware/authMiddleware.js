import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({error : 'Access token required'})
    }

    // "Bearer <TOKEN>" 형식에서 토큰만 추출
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'Token missing'});
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}
