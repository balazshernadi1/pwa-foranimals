const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const key = process.env.JWT_KEY
const refresh_key = process.env.JWT_REFRESH_KEY

exports.createAccessToken = (user_id) =>{
    return jwt.sign({id:user_id}, key, {expiresIn:"1hr"})
}

exports.createRefreshToken = (user_id)=>{
    return jwt.sign({id:user_id}, refresh_key)
}

exports.authenticateToken = (req, res, next)=>{
    const token = req.cookies.accessToken

    if(!token){
        return unAuthorisedAccess(req,res)
    }
    try{
        const decodedToken = jwt.verify(token, key)

        req.token = {payload: decodedToken.id}
        console.log("we good")
        return next()
    }catch (error) {
        if (error.name === "TokenExpiredError"){
            return tokenRefresh(req,res,next)
        }

        unAuthorisedAccess(req,res)
    }
}

async function tokenRefresh(req,res,next) {

    console.log("Refresh time")
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken){
        return unAuthorisedAccess(req,res)
    }

    try{
        const decodedToken = jwt.verify(refreshToken, refresh_key)

        const user = await User.findById({_id : decodedToken.id}).select("+refreshToken")
        if (!user || user.refreshToken !== refreshToken){
            return unAuthorisedAccess(req,res)
        }

        const newAccessToken = jwt.sign({id:decodedToken.id}, key, {expiresIn:'1hr'})
        res.cookie("accessToken", newAccessToken, {maxAge : 60000*60})
        req.token = {payload: decodedToken.id}
        return next()
    }catch(error){
        return unAuthorisedAccess(req,res)
    }
}

function unAuthorisedAccess(req, res) {

    const fetchRequest = req.headers["x-fetch-call"]?.includes('true')
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    if (fetchRequest){
        return res.status(401).json({message: "Unauthorised access", redirectTo : "/login"})
    }

    res.redirect("/login")
}


