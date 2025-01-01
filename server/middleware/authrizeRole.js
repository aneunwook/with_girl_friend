// const authorizeRole = (requiredRole) => {
//     return (req, res, next) => {
//         console.log('AuthorizeRole - req.user:', req.user); // req.user 로그 출력
//         // req.user 또는 req.user.role 확인

//         if (!req.user || !req.user.role) {
//             console.error('User or role information missing');
//             return res.status(403).json({ message: 'Unauthorized: Missing role or user information' });
//         }

//         if (req.user.role !== requiredRole) {
//             console.error(`Insufficient privileges: Required ${requiredRole}, Found ${req.user.role}`);
//             return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
//         }

//         next();
//     };
// };

// export default authorizeRole;
