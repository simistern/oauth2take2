//Server Scripts
var r = require("rethinkdbdash")();

require("rethink-config")({
  "r": r,
  "database" : "oauth2Tutorial",
  "tables" : ["oauthUsers", "tokens"]
});

var express = require("express");
var app = express();

var oauth2 = require("r-oauth2")
oauth2.init({
  "r": r,
  "db": "oauth2_tutorial",
  "oauthTable": "oauthUsers",
  "tokenTable": "tokens",
  "bcrypt": true
})

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("./public"));

var bcrypt = require("bcrypt");

app.post("/register", function(req,res,next){
  var err = false;
  var msg = [];

  if(!req.body.clientId){
    err = true;
    msg.push("Please supply a Username")
  }

  if(!req.body.clientSecret){
    err = true;
    msg.push("please supply a password")
  }

  if(!req.body.grantType){
    err = true;
    msg.push("You did not supply a grant type")
  } else {
    if (req.body.grantType != "customer" && req.body.grantType != "admin"){
      err = true;
      msg.push("Please specify your grant type");
    }
  }

  if (err == true){
    return res.status(400).send({
      "msg": msg
    })
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.clientSecret, salt);

  r.db("oauth2_tutorial").table("oauthUsers").insert({
    "clientId": req.body.clientId,
    "clientSecret" : hash,
    "grantType" : req.body.grantType
  }).then(function(){
    return res.status(200).send({
      "msg": "User Registered!"
    })
  })
})

app.post("/login", oauth2.generateToken());

app.get("/restricted", oauth2.authenticate(), function(req,res,next){
  res.status(200).send("Restricted area accessed!").sendFile(__dirname + "/public/ticketpage.html")
});

var PORT = 3000;
app.listen(PORT);
console.log("Oauth tutorial listening on port " + PORT);
