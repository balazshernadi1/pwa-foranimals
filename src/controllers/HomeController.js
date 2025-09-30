const Animal = require("../models/Animal")

exports.renderHomePage = async (req, res) =>{
    const animals = await Animal.findAdoptableAnimals(6)
    const card = [
        {title: 'Rehome your pet for FREE', description:'Simply register an account with us, tell us a bit about yourself and your pet you want to rehome.', btn_href:'/register', btn_title:'REGISTER'},
        {title: "Don't want to adopt?", description:'No problem! You can still help by donating without the need of an account, only your name and an email address!', btn_href:'/donate', btn_title:'DONATE NOW'}
    ]
      res.render('index.ejs', {animals:animals, card:card, extractScripts: true, extractStyles : true})

}

exports.renderFallbackPage = async (req, res) => {
    res.render("offline.ejs")
}