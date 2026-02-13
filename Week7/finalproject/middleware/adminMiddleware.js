// middleware/adminMiddleware.js

module.exports = (req, res, next) => {
    // req.user được gắn từ authenticateToken (authMiddleware.js)
    if (req.user && req.user.role === 'admin') {
        next(); // Là Admin, tiếp tục xử lý
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ Admin mới có quyền thực hiện chức năng này.' });
    }
};