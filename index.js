require('dotenv').config();
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));
let urlDatabase = {};
let shortUrlIndex=1; 
app.post('/api/shorturl',(req,res)=>{
  let url = req.body.url;
  if(!url){
    return res.json({error:'invalid url'});
  }
  urlDatabase[shortUrlIndex] = url;
  res.json(
    {
      original_url: req.body.url,
      short_url:shortUrlIndex
    }
    );
    shorturlIndex++;
});
app.get('/api/shorturl/:shorturl',(req,res)=>{
res.redirect(urlDatabase[req.params.shorturl]);
});
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});