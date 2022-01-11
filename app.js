const express=require("express");
const bodyParser=require("body-parser");
const request = require("request");
const https= require("https");
require("dotenv").config();
console.log(process.env);
const APIKEY=process.env.API_KEY;

const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");

})

app.post("/", function(req, res){
    var firstname= req.body.fname;
    var lastname= req.body.flname;
    var email= req.body.email;

    var data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }

    const jsonData= JSON.stringify(data);

    const url= "https://us20.api.mailchimp.com/3.0/lists/088432df14";
    const options={
        method: "POST",
        auth: "manan:"+APIKEY+""
    }
    const request= https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/sucess.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})
app.listen (3000,function(){
    console.log("the server is running on port 3000.");
});



// audience id 088432df14
//api key a16fdfda2049ed6e8b54c8da5e03d63b-us20