let app=require("./src/app.js");
app.listen(process.env.server_port,()=>
{
  console.log("server started");
});

