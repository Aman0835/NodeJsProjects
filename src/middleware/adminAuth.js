const authAdmin = (req,res,next)=>{
    const token ="some_valueof token"
    const isAdmin = token === "some_valueof token";
    if(isAdmin){
        console.log("Admin authenticated");
        next();
    }
    else{
        res.status(401).send("Access denied. Admins only.");
    }
}



module.exports ={ authAdmin}