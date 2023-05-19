const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Set up middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the URL model
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
});

const URL = mongoose.model('URL', urlSchema);

// API route to handle URL shortening
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;
  
  // Generate a unique short URL
  const shortUrl = generateShortUrl();
  
  // Save the URL to the database
  const url = new URL({
    longUrl,
    shortUrl,
  });
  await url.save();
  
  res.json({ shortUrl });
});

// API route to handle URL redirection
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  
  // Find the long URL in the database
  const url = await URL.findOne({ shortUrl });
  
  if (url) {
    res.redirect(url.longUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
