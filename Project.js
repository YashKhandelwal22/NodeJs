// Initialize the Project

mkdir restaurant-bot
cd restaurant-bot
npm init -y

// Install Dependencies

npm install express mongoose body-parser axios jsonwebtoken bcryptjs

// Create Models

// models/restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    menu: [{
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

// User Model
// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);

// Develop Routes
// User Model
// routes/users.js
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secret = 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, secret);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, secret);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: 'Login failed! Check authentication credentials' });
    }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;

// Restaurant Routes
// routes/restaurants.js
const express = require('express');
const Restaurant = require('../models/restaurant');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Add a new restaurant
router.post('/', auth, async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.send(restaurants);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific restaurant
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }
        res.send(restaurant);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a restaurant
router.patch('/:id', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!restaurant) {
            return res.status(404).send();
        }
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a restaurant
router.delete('/:id', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }
        res.send(restaurant);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

// Implement a Chat Interface
npm install socket.io

// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/restaurant-bot'; // Change this to your MongoDB URI

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io integration
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('findRestaurants', async (query, callback) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch
