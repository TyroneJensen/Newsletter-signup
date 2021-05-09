const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
// const request = require('request')

const app = express();

app.use(express.static("public")); // static method allows server to use css/images/js
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  // get user data from html form using class
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // create data object with objects and properties needed by API
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  // flat pack JSON file
  const jsonData = JSON.stringify(data);

  // url of API endpoint
  const url = "https://us17.api.mailchimp.com/3.0/lists/5d046b97ee";
  // method and authentication with API key
  const options = {
    method: "POST",
    auth: process.env.AUTH,
  };
  // create request object
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  // write to API
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// process.env.PORT is for Heroku servers to choose a port, 3000 is localhost
app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000");
});

// API key
// 9467062ff6a14bb4b097c14dfe363b08-us17

// LIST id
// 5d046b97ee
