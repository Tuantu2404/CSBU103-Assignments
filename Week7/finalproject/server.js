// server.js

// 1. CẤU HÌNH CƠ BẢN VÀ KHAI BÁO MODULE
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Nhúng Module Database (Mongoose)
const connectDB = require('./config/database'); 
// Models cần được require để Mongoose biết Schema tồn tại
require('./models/User'); 
require('./models/Song'); 

// NHÚNG CÁC FILE ROUTE ĐÃ TÁCH
const authRoutes = require('./routes/authRoutes'); 
const songRoutes = require('./routes/songRoutes'); 

// 2. MIDDLEWARE CHUNG
app.use(cors());
app.use(express.json());

// 3. KẾT NỐI DB VÀ KHỞI ĐỘNG SERVER
connectDB() // Gọi hàm kết nối DB
    .then(() => {
        // GẮN ROUTES VÀO APP SAU KHI KẾT NỐI DB THÀNH CÔNG
        app.get('/', (req, res) => {
            res.status(200).json({ 
                message: "Chào mừng đến với API Kho Hợp Âm Cá Nhân!", 
                status: "Running" 
            });
        });

        app.use('/api/auth', authRoutes); 
        app.use('/api/songs', songRoutes); 

        // KHỞI ĐỘNG SERVER
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
            console.log(`Mở http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("Lỗi khởi động Server:", error);
    });