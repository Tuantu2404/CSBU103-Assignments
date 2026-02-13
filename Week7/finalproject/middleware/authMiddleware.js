const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: 'Không tìm thấy Token. Vui lòng đăng nhập.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Bao gồm lỗi hết hạn
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' }); 
        }
        
        req.user = user; 
        next();
    });
}

module.exports = authenticateToken;