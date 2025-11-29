
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();    

module.exports = function authMiddleware(req, res, next) {  
    const header = req.headers['authorization'];
    if(!header){
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    //header format: Bearer tokenstring
    const parts = header.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer'){
        return res.status(401).json({ success: false, message: 'Invalid token format' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to request
        next();
    } catch(err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }   

};