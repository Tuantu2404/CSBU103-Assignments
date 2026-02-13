const Song = require('../models/Song'); // Đảm bảo đường dẫn này là đúng
const mongoose = require('mongoose'); // Cần Mongoose để kiểm tra tính hợp lệ của ObjectId

// @route   GET api/songs
// @desc    Lấy tất cả các bài hát
// @access  Public
// controllers/songController.js

// ...

exports.getAllSongs = async (req, res) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        let filter = {};
        

        filter = { status: 'approved' }; // Chỉ lấy các bài hát đã được duyệt
        const songs = await Song.find(filter)
            .populate('user_id', 'username') // Lấy username từ User Model
            .exec();

        res.status(200).json(songs);
    } catch (error) {
    }
};
exports.getPendingSongs = async (req, res) => {
    try {
        const songs = await Song.find({ status: 'pending' })
            .populate('user_id', 'username')
            .exec();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi tải danh sách chờ duyệt.' });
    }
};
// @route   GET api/songs/:id
// @desc    Lấy chi tiết một bài hát theo ID
// @access  Public
exports.getSongById = async (req, res) => {
    try {
        const id = req.params.id;

        //  BƯỚC 1: KIỂM TRA TÍNH HỢP LỆ CỦA ID (RẤT QUAN TRỌNG)
        // Nếu ID không phải là định dạng ObjectId hợp lệ của MongoDB, Mongoose sẽ báo lỗi 500 hoặc truy vấn thất bại.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Trả về 404 (Not Found) nếu ID không hợp lệ về mặt định dạng
            return res.status(404).json({ message: 'Bài hát không tồn tại (ID không hợp lệ).' });
        }

        //  BƯỚC 2: TÌM BÀI HÁT
        const song = await Song.findById(id).populate('user_id', 'username').lean();

        if (!song) {
            // Nếu định dạng ID hợp lệ nhưng không tìm thấy trong DB
            return res.status(404).json({ message: 'Bài hát không tồn tại.' });
        }

        res.status(200).json(song);
    } catch (error) {
        // Xử lý lỗi server chung hoặc lỗi truy vấn database
        console.error(error);
        res.status(500).json({ message: 'Lỗi Server nội bộ khi lấy chi tiết bài hát.' });
    }
};
 exports.approveSong = async (req, res) => {
    try {
        const songId = req.params.id;
        // Lấy trạng thái mới từ body: { status: 'approved' | 'rejected' }
        const { status } = req.body; 
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }

        const updatedSong = await Song.findByIdAndUpdate(
            songId,
            { status: status, approved_by: req.user.id }, // Gán ID của Admin đang duyệt
            { new: true }
        );

        if (!updatedSong) {
            return res.status(404).json({ message: 'Bài hát không tồn tại.' });
        }

        res.status(200).json({ 
            message: `Bài hát đã được cập nhật trạng thái thành ${status}.`, 
            song: updatedSong 
        });
    } catch (error) {
        console.error('Lỗi khi duyệt bài hát:', error);
        res.status(500).json({ message: 'Lỗi Server nội bộ khi duyệt bài hát.' });
    }
};
// @route   POST api/songs
// @desc    Tạo một bài hát mới
// @access  Private (Cần authenticateToken)
exports.createSong = async (req, res) => {
    const { title, artist, lyrics_chords } = req.body;
    
    try {
        const newSong = new Song({
            title,
            artist,
            lyrics_chords,
            user_id: req.user.id // Lấy ID người dùng từ Token đã xác thực
        });

        const song = await newSong.save();
        res.json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server nội bộ khi tạo bài hát.');
    }
};
// TRONG controllers/songController.js
exports.deleteSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const userId = req.user.id;
        // Lấy vai trò (role) người dùng từ Token đã xác thực (được gắn bởi authMiddleware)
        const userRole = req.user.role; 

        if (!mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(404).json({ message: 'Bài hát không tồn tại (ID không hợp lệ).' });
        }

        // 1. TÌM BÀI HÁT
        const songToDelete = await Song.findById(songId);

        if (!songToDelete) {
             return res.status(404).json({ message: 'Bài hát không tồn tại.' });
        }

        // 2. KIỂM TRA QUYỀN: Người tạo (sở hữu) HOẶC Admin
        const isOwner = songToDelete.user_id.toString() === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            // Không phải chủ sở hữu và không phải Admin -> Từ chối
            return res.status(403).json({ message: 'Bạn không có quyền xóa bài hát này.' });
        }
        
        // 3. THỰC HIỆN XÓA (Admin hoặc Chủ sở hữu đều có quyền xóa đến đây)
        await Song.deleteOne({ _id: songId });

        res.status(200).json({ message: 'Bài hát đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa bài hát:', error);
        res.status(500).json({ message: 'Lỗi Server nội bộ khi xóa bài hát.' });
    }
};