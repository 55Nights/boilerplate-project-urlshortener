require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//
app.post('/api/shorturl', function(req, res, next) {
  const url = new URL(req.body.url);
  const hostname = url.hostname;

  dns.lookup(hostname, (err, address) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: 'Invalid URL' });
    } else {
      next();
    }
  });
}, function(req, res) {
  const min = 1;
  const max = 100000000;
  const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
  res.json({ original_url: req.body.url, short_url: randomInteger });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
