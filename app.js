const express = require("express")
require('dotenv').config();
const app = express();
const { connectDB } = require('./src/db/DB');
const HomeRouter = require("./src/routes/HomeRoute")
const AdoptRouter = require("./src/routes/AdoptRouter")
const UserRouter = require("./src/routes/UserRouter")
const RegisterRouter = require("./src/routes/RegisterRouter")
const AccountRouter = require("./src/routes/AccountRouter")
const DonateRouter = require("./src/routes/DonateRouter")
const PaymentRouter = require("./src/routes/PaymentRouter")
const RehomeRouter = require("./src/routes/RehomeRouter")
const cookieParser = require("cookie-parser")
const expressEjsLayouts = require("express-ejs-layouts")

app.use(cookieParser())
app.use(expressEjsLayouts)
app.use(express.static('public'));
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);
app.use(checkLogin)
app.use(express.json());
app.set("view engine", "ejs");


app.use("/", HomeRouter)
app.use("/login", UserRouter)
app.use("/register", RegisterRouter)
app.use("/adopt", AdoptRouter)
app.use("/donate", DonateRouter)
app.use("/account", AccountRouter)
app.use("/payment", PaymentRouter)
app.use("/rehome", RehomeRouter)



connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed", error);
  process.exit(1); 
});

function checkLogin(req, res, next) {
    const token = req.cookies.accessToken

    if(token){
      res.locals.isLoggedIn = true
    }else{
      res.locals.isLoggedIn = false
    }
    next()
}

