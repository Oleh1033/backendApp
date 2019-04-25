const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const db = require("./config/db.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type", "Authorization", "token"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);

const mongoClient = new MongoClient(
  db.url,
  { useNewUrlParser: true }
);

let dbClient;
let dbKudos;
let dbCompany;

mongoClient.connect(function(err, client) {
  if (err) return console.log(err);
  dbClient = client;

  dbKudos = client.db("KudosDB").collection("Billennium");
  dbCompany = client.db("KudosDB").collection("BillenniumConfig");
  require("./app/routesKudos")(app, dbKudos);
  require("./app/routesConfig")(app, dbCompany);
  app.listen(port, function() {
    console.log("Server wait cor conection..." + port );
  });
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
 