const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    artist: {
        type: String,
        maxlength: 100
    },
    lyrics_chords: {
        type: String,
        required: true
    },
    user_id: { // Khóa ngoại (reference) tới User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến Model User
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Các trạng thái có thể có
        default: 'pending' // Mặc định bài hát mới luôn ở trạng thái chờ duyệt
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);