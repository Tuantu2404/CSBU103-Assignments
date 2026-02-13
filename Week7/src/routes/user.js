const express = require("express");
const router = express.Router();
const User = require("../models/user.mongo"); 

router.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

    if(!emailRegex.test(username)){
        return res.status(400).json({message: "Invalid email format!"});
    }

    if(!passwordRegex.test(password)){
        return res.status(400).json({
            message: "Password must be at least 6 characters, contain 1 number and 1 special character!"
        });
    }

    try {

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "User already exists!"});
        }

        const newUser = new User({
            username,
            password
        });

        await newUser.save();

        res.json({message: "Registration successful!"});

    } catch(err){
        res.status(500).json({message: "Server error"});
    }

});

module.exports = router;
