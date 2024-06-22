const express = require('express');
const app = express();
const port = 3000;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle GET requests to the root endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route to handle GET requests to the /about endpoint
app.get('/about', (req, res) => {
  res.send('About Us');
});

// Route to handle POST requests to the /data endpoint
app.post('/data', (req, res) => {
  const receivedData = req.body;
  res.json({
    message: 'Data received',
    data: receivedData
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
