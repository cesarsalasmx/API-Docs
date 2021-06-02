const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
//const googleapi = require('googleapis');
const { config } = require("../config");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
let idDoc;
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
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
        reject(false);
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      getIdDoc(oAuth2Client, query).then((response) => {
        idDoc = response.data.id;
        resolve(idDoc);
      });
    });
  });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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
    var query = {};
    return createFile(oAuth2Client, query);
  });
}
async function getIdDoc(oauth2Client, query) {
  try {
    return await createFile(oauth2Client, query);
  } catch (err) {
    return err;
  }
}
function createFile(oauth2Client, query) {
  const DRIVE = google.drive({ version: "v3", auth: oauth2Client });
  var fileType = "text/html";
  var titleDoc = query.id + " - " + query.dominio;
  return new Promise((resolve, reject) => {
    DRIVE.files.create(
      {
        resource: {
          name: titleDoc,
          mimeType: "application/vnd.google-apps.document",
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
