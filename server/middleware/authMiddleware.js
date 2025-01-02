// // import jwt from 'jsonwebtoken';

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   console.log('Authorization Header:', authHeader);

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res
//       .status(401)
//       .json({ message: 'Unauthorized: Token is missing or malformed' });
//   }

//   // 토큰 추출
//   const token = authHeader.split(' ')[1];

//   try {
//     // 토큰 검증
//     const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
//     console.log('Decoded Token:', decodedToken);

//     // 토큰 구조 확인
//     if (!decodedToken || !decodedToken.userId || !decodedToken.role) {
//       console.error('Invalid token structure:', decodedToken);
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: Invalid token structure' });
//     }

//     req.user = { id: decodedToken.userId, role: decodedToken.role };
//     console.log('Request User Object:', req.user);
//     next();
//   } catch (err) {
//     console.error('Token Verification Error:', err.message);
//     if (err.name === 'TokenExpiredError') {
//       return res.status(403).json({ message: 'Token has expired' });
//     }
//     return res.status(403).json({ message: 'Forbidden: Invalid token' });
//   }
// };

// // export default authenticateToken;
