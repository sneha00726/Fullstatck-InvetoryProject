// This file is the starting point of Application

// imports Express App Obj from App.js 
let app=require("./src/app.js");

// .listen is method of express application obj, it start server on port 3000 so that it can receive client requests and responds to client requests from browser or postman and callback fuction runs when server started successfully
app.listen(process.env.server_port,()=>
{
  console.log("server started");
});
