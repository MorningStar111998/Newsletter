const express = require("express");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAdress = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAdress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/75745402ae";
  const options = {
    method: "POST",
    auth: "Regis1:97a553e3a4d5c069efd46d63613ced97-us13",
  };

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

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server up and Running on port " + port);
});

//API Key : 97a553e3a4d5c069efd46d63613ced97-us13
//List ID : 75745402ae
