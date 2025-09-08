// this file creates connection to the db

// dotenv-npm package that that manages env variables and config is method of dotenv package that loads environment variables from .env file
require("dotenv").config();

// importing MySql2 library to connect to MySql db
let mysql=require("mysql2");

// createConnection is a method of MySql package, creates connection obj of MySQL db using process.env
// process.env- built-in obj in Node.js that stores environment variables
//.mysql- obj in which mysql2 package imported
let conn=mysql.createConnection({
    host:process.env.db_host,
    user:process.env.db_username,
    password:process.env.db_password,
    database:process.env.db_name,
    multipleStatements: true  
});

//.conn is method of connection obj, it is provided by MySql package, it actually establish connection to MySQL db andd err contains info about errors if connection not successful
conn.connect((err)=> 
{
    if(err)
    {
        console.log("database is not connected"+err);
    }
    else
    {
        console.log("database is connected");
    }
});
module.exports=conn;