// Module imports
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
// import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import passport from 'passport'
// import localStrategy from 'passport-local'
//Mongoose Model imports
import { user } from './models/User.mjs'
// Middleware and route imports
import findOrCreate from 'mongoose-findorcreate'
// import {auth} from './middleware/auth.mjs'
import {authRouter} from './routes/authRoute.mjs'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
//Env
config()

const uri = process.env.DATABASE_URI

mongoose.set('strictQuery', true);
mongoose.connect(uri)
.then(()=>console.log("Connected to Db"))
.catch((e)=>console.error(e))

const app = express()

// app.use(cookieParser())
app.use('/public',express.static("public"))
app.use('/dist',express.static("dist"))
app.use('/src',express.static("src"))
app.use(urlencoded({extended:false}))
app.use(json())
// app.use(auth().initialize())
app.use(session({secret:"so secret",
resave: false,
saveUninitialized: false}))

//Setting up Passportjs with Express
app.use(passport.initialize())
app.use(passport.session());

passport.use(user.createStrategy())

//Serialization
passport.serializeUser((user,done)=>{
  done(null,user.id)
});
passport.deserializeUser((id,done)=>{
  user.findById(id,(err,user)=>{
    done(err,user)
  })
});
// Google OAuth Setup

passport.use(
  new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:'http://localhost:3000/auth/google/callback',
    userProfileURL:'https://www.googleapis.com/oauth2/v3/userinfo'
  },(accessToken, refreshToken, profile, cb) =>{
    user.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  })
)






// app.use((req, res, next) => {
//     const jwt = req.cookies.jwt;
//     if (jwt) {
//       req.headers.authorization = `Bearer ${jwt}`;
//     }
//     next();
//   });
//Setting up Routes
app.use(authRouter)

app.get("/home",(req,res)=>{
 if(req.isAuthenticated())
    res.send("<h1 style='text-align:center'>Whoo Hoo , User is Logged In</h1>")
  else res.redirect("/login")
})

app.get("/signup",(req,res)=>{
    res.sendFile('/home/anasmohammed361/vs/Js/Cybernaut/src/signup.html')
})
app.get("/login",(req,res)=>{
    res.sendFile('/home/anasmohammed361/vs/Js/Cybernaut/src/login.htm')
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res)  => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen("3000" , ()=> console.log("Server running at port 3000"))
