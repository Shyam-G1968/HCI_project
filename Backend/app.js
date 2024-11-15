require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passportsetup = require('./middleware/passport_setup');
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const app = express();
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 4000;
const restaurantRoutes = require('./routes/restaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on your frontend's URL
    credentials: true,
}));

app.use(express.json()); // Parse JSON bodies
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', userRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/reservation',reservationRoutes);

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to Database");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => console.log(err));

// Enhanced Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Error message:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
