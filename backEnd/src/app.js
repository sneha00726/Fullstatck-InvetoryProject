let express=require("express");

let bodyparser=require("body-parser");
let cookieparser=require("cookie-parser");
let path=require("path");
let con=require("../db.js");
let app=express();
let router=require(".//routes/router.js");
let cors = require("cors"); 
// Enable CORS
app.use(cors({ origin: "http://localhost:5173" })); // for your React app
app.use(express.static("public"));
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
//app.use(cookieparser("1233456789@$"));


app.use("/",router);
module.exports=app;