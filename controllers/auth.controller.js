const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const validatePassword = require('../utils/validatePassword');
const generateToken = require('../utils/generateToken');

const signup = async (req, res, next) => {
    try{
        const { name, email, password, role } = req.body;

        const passwordCheck  = validatePassword(password);

        if(!passwordCheck.valid){
            return res.status(400).json({ success: false, message: passwordCheck.message });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ success: false, message: 'Email already exists. Please login.' });
        }else{
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role
            });

            res.status(201).json({ success: true, message: 'User created successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, });
        }

    }catch(err){
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. find user by email
        const user = await User.findOne({ email }).select('+password');
        if(!user){
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        // 2. compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // 3. generate token (JWT) - skipped for brevity

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        })

        res.json({ token, success: true, message: 'Login successful', user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        } });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });  
    }
};


module.exports = {
    signup,
    login,
}