const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        console.log('AuthorizeRole - req.user:', req.user); // req.user 로그 출력
        // req.user 또는 req.user.role 확인
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Unauthorized: Missing role or user information' });
        }

        // 역할 비교
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        next();
    };
};

export default authorizeRole;