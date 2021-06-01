const express= require('express');
const app = express();
const auth = require('../apiDoc');
const {createFile} = require('../document');
const bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/google", async function (req,res) {
    try{
        let id = auth.authorize(req.query);
        res.send('Complete:'+id.then(response=>console.log(response)));
        
        //createFile(token);
    }
    catch(err){
        res.redirect(auth.getNewToken());
    }
    
})
app.get("/google/callback",async function(req,res) {
    const { code } = req.query;
    const token = auth.enterCode(code);
    // try{
    //     await createFile(token);
    // }catch(err){
    //     console.log('Hay error vro :(');
    // }
    
    res.send('Complete');
}) 
module.exports=app;