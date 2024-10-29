require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const dns = require('dns');
const res = require('express/lib/response');
const { error } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let urlDatabase = {}; // { short_url: original_url }
let urlCounter = 1;

// POST route for creating shortened URLs
dns.lookup('freecodecamp.org', (err) => {
  if (err) {
    res.json({error: 'invalid URL'});
  } 
  else {
    console.log('DNS lookup successful');
  }
});
app.post('/api/shorturl', (req, res) => {
  const { original_url } = req.body;

  // Validate URL
  dns.lookup(original_url, (err) => {
    if (err) {
      return res.json({ error: 'invalid URL' });
    }
  });
  // Store the URL and assign a short URL identifier
  const short_url = urlCounter++;
  urlDatabase[short_url] = original_url;

  res.json({ original_url, short_url });
});

// GET route for redirecting
app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const original_url = urlDatabase[short_url];

  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Listen on specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});