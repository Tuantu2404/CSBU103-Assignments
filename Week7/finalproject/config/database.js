const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/ten_database_cua_ban'; 

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Kết nối MongoDB thành công!');
    } catch (err) {
        console.error('LỖI Kết nối MongoDB:', err.message);
        // Thoát ứng dụng nếu không thể kết nối
        process.exit(1); 
    }
};

module.exports = connectDB;