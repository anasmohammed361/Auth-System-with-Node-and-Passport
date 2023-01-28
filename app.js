// Module imports
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import { config } from 'dotenv'
import passport from 'passport'
import localStrategy from 'passport-local'
//Mongoose Model imports
import { user } from './models/User.mjs'
// Middleware and route imports
import {auth} from './middleware/auth.mjs'
import {router} from './routes/authRoute.mjs'

//Env
config()

const uri = process.env.DATABASE_URI
mongoose.connect(uri)
.then(()=>console.log("Connected to Db"))
.catch((e)=>console.error(e))

const app = express()

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

//Setting up Routes
app.use(router)

app.get("/home",auth().authenticate(),(req,res)=>{
    res.send("Whoo Hoo , User is Logged In")
})

app.listen("3000" , ()=> console.log("Server running at port 3000"))