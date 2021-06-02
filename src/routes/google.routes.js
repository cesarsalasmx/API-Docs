const express= require('express');
const app = express();
const auth = require('../apiDoc');
const bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/google", async function (req,res) {
    try{
        let id = auth.authorize(req.query);
        id.then(response=>{
            console.log(response)
            let url = 'https://docs.google.com/document/d/'+response+'/edit';
            res.redirect(url);
        });
        
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