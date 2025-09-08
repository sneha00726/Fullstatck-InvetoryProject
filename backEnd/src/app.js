// This line import Express Framework
let express=require("express");

// import bodyparser tool which helps express to read form data or post request bodies
let bodyparser=require("body-parser");

let cookieparser=require("cookie-parser");

// import node's built-in path module, that helps to handle file and folder path
let path=require("path");

// import db connection from db.js
let con=require("../db.js");

// creates Express App Object
let app=express();

// loads router file that handles all routes
let router=require(".//routes/router.js");

let cors = require("cors"); 

//app.use() is a method of Express app obj and used to add middleware(functions that runs during req-res cycle)
// enable CORS
app.use(cors({ origin: "http://localhost:5173" })); // for React app

// provides static files like CSS, images, JS from public folder
app.use(express.static("public"));

// it helps express read JSON data sent by client like postman or a frontend app
app.use(express.json());

//it is middleware used to help express to read form data sent using POST requests
app.use(bodyparser.urlencoded({extended:true}));

//app.use(cookieparser("1233456789@$"));

// it allows express to use all routes written in the router file starting from main URL "/"
app.use("/",router);

// exports the app obj, so it can be used in index.js to start the server
module.exports=app;