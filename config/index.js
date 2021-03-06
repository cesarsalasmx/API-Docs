require('dotenv').config();

const config = {
    client_id: process.env.client_id,
    project_id: process.env.project_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_secret: process.env.client_secret,
    redirect_uris: process.env.redirect_uris,
    javascript_origins: process.env.javascript_origins,
}
module.exports = {config};