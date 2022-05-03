var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require('body-parser');
const ejs=require('body-parser');
var fs=require('fs');
var router = express.Router();
app.use(express.static(__dirname + '/public'));
const path=require('path');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));

//Set View Engine
app.set('view engine','ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/*AWS.config.update({
	accessKeyId: 'ASIAQBTHYMNIJW2MK5XX',
	secretAccessKey: 'u/TMQjgIqa5U/gsgoX6d90gKgAuSsDkvxT3uhkcc',
	sessionToken: 'FwoGZXIvYXdzEFEaDIuxt9wMgjudGA3H5SLVAVisdyzVmS1z9ainxJJn50hWyk4BumKKNOH5ghIw5FSVRZAznDUb1sTyCTTItzfoSoIJXA2tpOJxoIMgZ8NN9NjtE+5t1lkAJQadNytV6SsdVXgeb5lVVuv7fdOOCvOKOLvXmFPKxZ2nshzoDXbTMentMwIMWy/wZ3aUP8FzxkH1ianDcZOhX3ijQ3g7Z71Eq2gUzjA4KtvqLeda79u9iiY4/aoTXa8SW/vo0dvfE6t6r1TyuUqXXoManby5XKD40Z0/zYLHkR9TH7rwEQyBo5htT7WYlSi++MT8BTIuQSWEMFHsC7pEUsvpnWBCz+mgowbS4ti2VYLejKgYkfMlt5osrTZihROPbI1WUg==',
	region: 'us-east-1'
});*/

var connection = mysql.createConnection({
    host: "database-1.coa9l9nnpvvs.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    port: "3306",
    database: "mydb",
});

connection.connect(function (err) {
    if (err){
        console.error("DB connection failed"+err.stack);
        return;
    }
    console.log("Connected to RDS");
});

app.get('/log',function(req,res,html){
    console.log("start");
    res.render('login'),{
        title:"Login"
    }
})

app.get('/login',function(req,res,html){
    console.log("Hii");
    var username = req.param('uname', null)
    var password = req.param('password', null)

    connection.query('SELECT * from login', function (error, results, fields) {
        if (error){
            console.error("Not Working"+error.stack);
            return;
    };
    console.log("done");
    var length = results.length

    for (i = 0; i < length; i++)
      if (results[i].username === username && results[i].password === password)
        test = 1

    if (test === 1)
    res.render('index'),{
        title:"Travelogue"
    }
    else
      res.send("Login Failure try again!!");

  });
});

app.get('/index',function(req,res,html){
    res.render('index'),{
        title:"Travelogue"
    }
})

app.get("/chennai",function(req,res,html){
    res.render('chennai'),{
        title:"Chennai"
    }
})

app.get("/ratings",function(req,res,html){
    console.log("in..")
    res.render('ratings'),{
        title:"ratings"
    }
})

app.post("/update",function(req,res){
    var place=req.param("place",null);
    var r=req.param("rate",null);
    console.log(place);
    let sql1="SELECT ratings,n from ratings where place like '"+place+"'";
    console.log(sql1);
    connection.query(sql1,(err,res)=>{
        if(err) throw err;
        console.log(res[0]);
        var avg=((res[0].ratings)+r)/((res[0].n)+1);
        let sql="UPDATE ratings SET status='"+avg+"','"+(n+1)+"' WHERE grievance_id like '"+userId+"'";
        let query=connection.query(sql,(err,result)=>{
            if(err)throw err;
            res.redirect('/chennai');
    })
        /*let sql="UPDATE grievance SET status='"+req.body.status+"' WHERE grievance_id like '"+userId+"'";
        let query=connection.query(sql,(err,result)=>{
            if(err)throw err;
            res.redirect('/grievance_status')
        })*/
})
})

app.get("/image",function(req,res,html){
    console.log("Helloo");
    res.render('image'),{
        title:"Check Images"
    }
})

const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
//const fs = require('fs');
const util = require('util');

app.get("/speak",function(req,res,html){
    async function quickStart() {
        // The text to synthesize
        const text = 'hello, world!';
      
        // Construct the request
        const request = {
          input: {text: text},
          // Select the language and SSML voice gender (optional)
          voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
          // select the type of audio encoding
          audioConfig: {audioEncoding: 'MP3'},
        };
      
        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
      }
      quickStart();
      
      
})

app.listen(8000);