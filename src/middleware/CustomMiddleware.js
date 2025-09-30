const User = require("../models/User")

exports.checkUserProfileCompletion = async (req, res, next) =>{
    const fetchRequest = req.headers["x-fetch-call"]?.includes('true')
    try{
        const user_id = req.token.payload
        const user = await User.findById(user_id, "profileCompleted")
        res.locals.profileCompleted = user.profileCompleted
        if (fetchRequest && !user.profileCompleted){
            return res.status(401).json({
                message: "Profile needs completion", 
                redirectTo : "/account/additional-details"})
            
        }else if(!user.profileCompleted){
            return res.redirect("/account/additional-details")
        }
        next()
    }catch(error){
        if (fetchRequest){
            res.status(404).json({
                message: "User not found", 
                redirectTo : "/register"})
        }else{
            res.redirect("/register")
        }
    }
}

