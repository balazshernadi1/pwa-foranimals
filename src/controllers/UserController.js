const User = require("../models/User")
const bcrypt = require('bcrypt');
const jwt = require("../auth/JsonWebToken")

exports.renderLoginPage = async (req, res) => {
    res.render('login.ejs', {exctractScripts : true})
}

exports.renderRegisterPage = async (req, res) => {
    res.render('register.ejs', {exctractScripts : true} )
}

exports.logInUser = async (req, res) => {
    
    const password = req.body.password
    const username = req.body.username

    try {
        const user = await User.findOne({username : username})

        if(!user){
            return res.status(404).json({ message: "User doesn't exist", success: false })
        }
        const user_password = user.password
        const user_id = user._id.toString()

    
        const isSame = await bcrypt.compare(password, user_password)
    
        if(!isSame){
            return res.status(401).json({ message: "Invalid password", success: false })
        }
        const refreshToken = jwt.createRefreshToken(user_id)
        const accessToken = jwt.createAccessToken(user_id, refreshToken)

        user.refreshToken = refreshToken

        await user.save()
            
        res.cookie("accessToken", `${accessToken}`, {maxAge :  3600000 })
        res.cookie("refreshToken", `${refreshToken}`)

        return res.status(200).json({
            message: "Login successful",
            success: true,
            redirectTo: "/account/dashboard",
        })
           
    } catch (error) {
        res.json({message : "Major error", error : error})
    }
   
}

exports.createNewUser = async(req, res) => {

    const password = req.body.password
    const username = req.body.username

    const password_pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const username_pattern = /^[a-zA-Z0-9_]{5,15}$/

    if(!username_pattern.test(username) || !password_pattern.test(password)){
        res.send({message : "Username or Password is invalid"})
        return
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username : username,
            password : hashedPassword
        })

        const refreshToken = jwt.createRefreshToken(newUser._id)
        const accessToken = jwt.createAccessToken(newUser._id)
        

        newUser.refreshToken = refreshToken
    
        await newUser.save()


        res.cookie("accessToken", `${accessToken}`, {maxAge : 15*60*100})
        res.cookie("refreshToken", `${refreshToken}`)
        res.send({success : true, redirectTo : "account/dashboard"})
    }catch{
        res.send({success : false})
    }

    
}

exports.checkUserExists = async (req, res) => {
    try{
        const user = await User.findOne({username : req.body.username})

        if (user){
            res.status(404).json({ message: "Username already exists", exists: true })
        }else{
            res.status(200).json({ message: "Username is available", exists: false })
        }
    }catch(error){
        res.status(500).json({ message: "Error", error : true })
    }
}