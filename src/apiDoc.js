const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { config } = require("../config");
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";
let idDoc;
//Check token, create Google Doc and return ID Document
async function authorize(query) {
  const oAuth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris
  );
  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        reject(err);
      }
      else{
        oAuth2Client.setCredentials(JSON.parse(token));
        getIdDoc(oAuth2Client, query).then((response) => {
          //console.log(response)
          idDoc = response.data.id;
          resolve(idDoc);
        });
      }
    });
  });
}

//Return URL for generate new token
function getNewToken() {
  const oAuth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris
  );
  return (authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  }));
}
//Set code that return Google Auth and generate Token
function enterCode(code) {
  const oAuth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris
  );
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error("Error retrieving access token", err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log("Token stored to", TOKEN_PATH);
    });
  });
}
//Set Id Doc
async function getIdDoc(oauth2Client, query) {
  try {
    return await createFile(oauth2Client, query);
  } catch (err) {
    return err;
  }
}
//Create Google Doc with query
function createFile(oauth2Client, query) {
  const DRIVE = google.drive({ version: "v3", auth: oauth2Client });
  var fileType = "text/html";
  var titleDoc = query.id + " - " + query.dominio;
  var parents = query.dir;
  console.log(parents);
  return new Promise((resolve, reject) => {
    DRIVE.files.create(
      {
        resource: {
          name: titleDoc,
          mimeType: "application/vnd.google-apps.document",
          parents: [parents],
        },
        media: {
          mimeType: fileType,
          body: bodyDoc(query),
        },
      },
      function (err, file) {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      }
    );
  });
}
//Template of Google Document
const bodyDoc = (query) => {
  const body =
    "<header>" +
    '<img src="https://www.cleanranks.com/wp-content/uploads/2021/05/Captura-de-Pantalla-2021-05-28-a-las-0.24.40.png" width="600" class="logo">' +
    "</header>" +
    '<div class="content"><center>' +
    '<table width="100%">' +
    '<tr class="thead">' +
    '  <td width="30%">Publicación</td>' +
    '  <td width="70%">Dominio</td>' +
    "</tr>" +
    "<tr>" +
    '  <td width="30%">' +
    query.id +
    " LB</td>" +
    '  <td width="70%">' +
    query.dominio +
    "</td>" +
    "</tr>" +
    '<tr class="thead">' +
    '  <td width="30%">Keywords</td>' +
    '  <td width="70%">Landing destino</td>' +
    "</tr>" +
    "<tr>" +
    '  <td width="30%">' +
    query.kw +
    "</td>" +
    ' <td width="70%">' +
    query.landing +
    "</td>" +
    "</tr>" +
    "</table>" +
    '<p class="title-aproved">Título aprobado:</p>' +
    '<p class="title-content">' +
    query.title +
    "</p>" +
    "</center></div>";
  return body;
};
module.exports = { authorize, getNewToken, enterCode };
