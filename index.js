require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url")
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
var urls = []
var submmitedUrl = ''
app.post(
  "/api/shorturl",
  function (req, res, next) {
    submmitedUrl = req.body.url
    let parsedUrl = url.parse(submmitedUrl);

    if (parsedUrl.protocol !== "https:") {
      res.json({ error: "Invalid URL" });
    }
    dns.lookup(parsedUrl.hostname, (err, address, family) => {
      if (err) {
        res.json({ error: "Invalid URL" });
      }
  
    });
    next()
  }, function (req, res, next) {
    //check if the url is in urls
    const containsUrl = urls.find((obj) => obj["original_url"] === submmitedUrl);
    
    if (containsUrl) {
      res.json(containsUrl);
    } else {
      next();
    }
  },
  (req, res) => {
    const min = 1;
    const max = 10000000;

    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    
    let obj = {
      "original_url": submmitedUrl,
      "short_url": randomInt
    }
    urls.push(obj)
    
    res.json(obj);
  }
);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
