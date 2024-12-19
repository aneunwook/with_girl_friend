import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

        if (!decodedToken || !decodedToken.userId || !decodedToken.role) {
            return res.status(403).json({ message: 'Forbidden: Invalid token structure' });
        }

        req.user = { id: decodedToken.userId, role: decodedToken.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export default authenticateToken;
