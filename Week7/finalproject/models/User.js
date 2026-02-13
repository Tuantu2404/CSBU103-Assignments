const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ chấp nhận hai giá trị này
        default: 'user' // Mặc định tất cả người dùng mới là 'user'
    }
}, { timestamps: true }); // Mongoose tự động thêm createdAt và updatedAt

module.exports = mongoose.model('User', UserSchema);