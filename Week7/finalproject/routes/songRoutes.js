const express = require('express');
const router = express.Router();
const songController = require('../controllers/songcontroller'); 
const authenticateToken = require('../middleware/authMiddleware'); 
const adminMiddleware = require('../middleware/adminMiddleware'); // Import Admin Middleware

// 1. CÁC ROUTE CỤ THỂ KHÔNG CÓ THAM SỐ HOẶC CÓ CHUỖI CỤ THỂ

// API GET (Công khai)
// Lấy tất cả bài hát đã duyệt
router.get('/', songController.getAllSongs);

// API POST (Cần bảo vệ)
// Đăng tải bài hát mới (Mặc định status: pending)
router.post('/', authenticateToken, songController.createSong); 

//  ROUTE ADMIN - RẤT QUAN TRỌNG: PHẢI ĐẶT TRƯỚC /:id
// Lấy danh sách bài hát đang chờ duyệt (Chỉ Admin)
router.get('/pending', authenticateToken, adminMiddleware, songController.getPendingSongs);
// API DUYỆT BÀI HÁT (Admin Only)
// Cập nhật trạng thái bài hát (approve/reject)
router.put('/:id/approve', authenticateToken, adminMiddleware, songController.approveSong); 


// 2. CÁC ROUTE CHUNG CHUNG CÓ THAM SỐ (/:id)

// API GET theo ID (Công khai)
router.get('/:id', songController.getSongById);

// API DELETE (Cần bảo vệ - Admin có thể xóa bài của người khác)
router.delete('/:id', authenticateToken, songController.deleteSong);


module.exports = router;