let jwt=require("jsonwebtoken");

exports.VerifyToken=(req,res,next)=>
{
    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer"))
    {
        token=authHeader.split(" ")[1];
        if(!token)
        {
            res.status(401).json({message:`NO token`});
        }
        try{
            let decode=jwt.verify(token,process.env.secretKey);
            req.user=decode;
            console.log("the decode is :",req.user);
             //console.log("The decoded token payload is:", req.user);
            next();
        }catch(err)
        {
            console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Token is invalid or expired" });    
        }
    }

}