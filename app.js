// Module imports
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import passport from 'passport'
import localStrategy from 'passport-local'
//Mongoose Model imports
import { user } from './models/User.mjs'
// Middleware and route imports
import {auth} from './middleware/auth.mjs'
import {authRouter} from './routes/authRoute.mjs'

//Env
config()

const uri = process.env.DATABASE_URI
mongoose.connect(uri)
.then(()=>console.log("Connected to Db"))
.catch((e)=>console.error(e))

const app = express()

app.use(cookieParser())
app.use('/static',express.static("public"))
app.use('/static',express.static("views"))
app.use(urlencoded({extended:false}))
app.use(json())
app.use(auth().initialize())
app.use(session({secret:"so secret",
resave: false,
saveUninitialized: false}))

//Setting up Passportjs with Express
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()))

//Serialization
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    const jwt = req.cookies.jwt;
    if (jwt) {
      req.headers.authorization = `Bearer ${jwt}`;
    }
    next();
  });
//Setting up Routes
app.use(authRouter)

app.get("/home",auth().authenticate(),(req,res)=>{
    res.send("Whoo Hoo , User is Logged In")
})

app.get("/signup",(req,res)=>{
    res.sendFile('/home/anasmohammed361/vs/Js/Cybernaut/views/signup.htm')
})
app.get("/login",(req,res)=>{
    res.sendFile('/home/anasmohammed361/vs/Js/Cybernaut/views/login.htm')
})


app.listen("3000" , ()=> console.log("Server running at port 3000"))