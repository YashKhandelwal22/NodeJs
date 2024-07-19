mkdir uploads

// routes/users.js
const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secret = 'your_jwt_secret';

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000 // 1MB limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

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

// Upload profile picture
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    res.send({ message: 'File uploaded successfully!' });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Protected route example
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

// ... other routes ...

module.exports = router;


// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;



// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/restful-api'; // Change this to your MongoDB URI

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


npm install axios


// routes/users.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const User = require('../models/user');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secret = 'your_jwt_secret';
const weatherApiKey = 'your_openweathermap_api_key'; // Replace with your OpenWeatherMap API key

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000 // 1MB limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

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

// Upload profile picture
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    res.send({ message: 'File uploaded successfully!' });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Fetch weather information
router.get('/weather', auth, async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).send({ error: 'City is required' });
        }

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch weather data' });
    }
});

// Protected route example
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

// ... other routes ...

module.exports = router;
