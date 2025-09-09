let jwt=require("jsonwebtoken");

exports.VerifyToken=(req,res,next)=>
{
    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;  //so sometimes in some system AUthoirzation is used in captial and in some small
    if(authHeader && authHeader.startsWith("Bearer"))  //check where it is authheader and it starts with breaer or not 
    {
        token=authHeader.split(" ")[1];   //now it is been split like [bearer][eysdg]-token 
        if(!token)       //if token is not then 
        {
            res.status(401).json({message:`NO token`});
        }
        try{   //if there is token then 
            let decode=jwt.verify(token,process.env.secretKey);//jwt.verify function use to verify token and process.env in env file we have giventhe key 
            req.user=decode;   //if token is valid then it give as playload id role 
            //console.log("the decode is :",req.user);
             //console.log("The decoded token payload is:", req.user);
            next();
        }catch(err)
        {
            console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Token is invalid or expired" });    
        }
    }

}