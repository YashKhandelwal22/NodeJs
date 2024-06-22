// Create the Mongoose Model
/*const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Entry = require('./models/Entry');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongoose-crud-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// CRUD Routes

// Create an entry
app.post('/entries', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).send(entry);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Read all entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).send(entries);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read a single entry by ID
app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).send();
    }
    res.status(200).send(entry);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update an entry by ID
app.patch('/entries/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!entry) {
      return res.status(404).send();
    }
    res.status(200).send(entry);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete an entry by ID
app.delete('/entries/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).send();
    }
    res.status(200).send(entry);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
