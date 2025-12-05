
const express = require('express');
const app = express();

require('dotenv').config();    
const connectDB = require('./config/db');  // Call database connection function
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

//Routers
const Signup = require('./routes/auth.routes');
const Login = require('./routes/auth.routes');
const getProfile = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');



// built-in body parser
app.use(express.json());

// Basic security middlewares
app.use(helmet());
app.use(cors());

// simple logger (dev)

if(process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// rate limiter (basic config)

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100  // limit each IP to 100 requests per windowMs
})

app.use(limiter);


// Middleware to handle JSON requests
app.use('/api/auth', Signup);  // Mount auth routes at /api/auth
app.use('/api/auth', Login);  // Mount auth routes at /api/auth
app.use('/api/auth', getProfile);  // Mount auth routes at /api/auth

app.use('/api/teams', teamRoutes); // Mount team routes at /api/teams

//Health checkup Route

app.get('/api/health', (req,res) => {
    res.json({status:"ok", timestamp: Date.now()})
});

// global error middleware

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({success: false, message:err.message || "Server Error"});
})

const PORT = process.env.PORT || 8000;

// Connect DB then start server

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
});




