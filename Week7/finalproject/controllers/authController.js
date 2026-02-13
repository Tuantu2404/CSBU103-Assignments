const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Mongoose Model

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        // Tìm kiếm bằng cú pháp Mongoose
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Tạo User bằng cú pháp Mongoose
        const newUser = new User({ username, email, password_hash });
        await newUser.save();

        res.status(201).json({ 
            message: 'Đăng ký thành công.', 
            user: { id: newUser._id, username: newUser.username }
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Tìm kiếm bằng cú pháp Mongoose
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Mongoose sử dụng _id 
        const token = jwt.sign(
            { id: user._id, 
              email: user.email,
              role: user.role}, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ 
            message: 'Đăng nhập thành công.', 
            token: token,
            userRole: user.role
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
}

module.exports = { register, login };