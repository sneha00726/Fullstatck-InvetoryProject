// This line imports the jsonwebtoken library, which provides functions to sign and verify JWTs
let jwt=require("jsonwebtoken");
exports.VerifyToken=(req,res,next)=>
{
    //Used to store the extracted token from the request header
    let token;

    //This line gets the Authorization header from the incoming request.
    let authHeader=req.headers.Authorization || req.headers.authorization;
    //whether authHeader exists and whether it starts with the keyword "Bearer"
    if(authHeader && authHeader.startsWith("Bearer"))
    {
        //Splits the header by spaces. It assigns the actual JWT (the second part) to the token variable.
        token=authHeader.split(" ")[1];
        if(!token)
        {
            //If no token was found after splitting, it responds with a 401 Unauthorized error.
            return res.status(401).json({message:`NO token`});
        }
        try
        {
            //This line verifies the token using the secret key from environment variables.
            // If the token is valid, it decodes the payload.
            // If not valid or expired, it will jump to the catch block.

            //A secret key is a private string of characters (like a password) known only to your server
            let decode=jwt.verify(token,process.env.secretKey);

            //Adds the decoded token payload to the req object.
            req.user=decode;

            //console.log("the decode is :",req.user);
            //console.log("The decoded token payload is:", req.user);

            //Calls the next middleware
            next();
        }
        //If token verification fails (e.g., token is expired) this block runs.
        catch(err)
        {
            console.error("Token verification failed:", err);
            return res.status(401).json({ message: "Token is invalid or expired" });    
        }
    }
}