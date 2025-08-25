let model_in=require("../models/register_loginmodel.js");
let bcrypt=require("bcryptjs");
let {validateEmail,validatePassword}=require("../validation/registervalidation.js");
require("dotenv").config();
let jwt=require("jsonwebtoken");

exports.HomeLoginPage=(req,res)=>
{
    res.send("wellcome home page");
}

exports.RegisterApi=(req,res)=>

{
     console.log("Received body:", req.body);
    let {name,email,password,role}=req.body;
    let hashedpass=bcrypt.hashSync(password,8);

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }
    let promsie=model_in.FindByEmail(email);
    promsie.then((result)=>
    {
        if(result.length>0)
        {
           // console.log("email exits");
            res.status(400).json({message:`User have registered with same email alreday `});
        }
        else{
            model_in.InsertUser(name,email,hashedpass,role).then(()=>{
                res.status(201).json({message:`User registered with username ${name}`});
            }).catch((err)=>
            {
                res.send("error"+err);
            });
        }
    }).catch((err)=>
    {
        res.status(500).json({ message: "Database error"});
    });
}

exports.LoginPage=(req,res)=>
{
    let {email,password}=req.body;
    let promise=model_in.ValidateLogin(email);
    promise.then((result)=>
    {
        if(result.length>0)
        {
            let userdata=result[0];
            let dbpass=userdata.password;
            let valid=bcrypt.compareSync(password,dbpass);
            if(valid)
            {
                let token=jwt.sign({
                    id:userdata.id,
                    role:userdata.role

                },process.env.secretKey,{expiresIn:'24h'});
                 res.status(200).json({
                    message:"login succesful",
                    token:token
                 });
            }
            else{
                 //console.log("login failed");
                 res.status(400).json({message:`login failed`});
            }
        }
        else{
             //console.log("email  failed" );
            res.status(404).json({message:`email not found`});
        }

    }).catch((err)=>
    {
        res.send(err);
    });
}