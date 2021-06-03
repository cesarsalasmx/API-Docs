const express = require("express");
const app = express();
const auth = require("../apiDoc");
const bodyParser = require("body-parser");
const { response } = require("express");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/google", async function (req, res) {
  auth
    .authorize(req.query)
    .then((response) => {
      let url = "https://docs.google.com/document/d/" + response + "/edit";
      res.redirect(url);
    })
    .catch((err) => {
      console.log("Errorisimo: " + err);
      res.redirect(auth.getNewToken());
    });
});
app.get("/google/callback", async function (req, res) {
  const { code } = req.query;
  const token = auth.enterCode(code);
  res.send("Token creado, vuelve a crear el documento");
});
module.exports = app;
