import {user} from '../models/User.mjs'
import {Router} from 'express'
import passport  from 'passport'

export const authRouter = Router()

authRouter.post("/login",
 (req,res)=>{
    const currentUser = new user({
        username:req.body.username,
        password:req.body.password
    })
   req.login(currentUser,(err)=>{
    if(err){
        console.log(err);
    }else{
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/home")
        })
    }
   })
})

authRouter.post("/signup",async(req,res)=>{
    user.register(
        new user({username:req.body.username}),
        req.body.password,
        (err,user)=>{
            if(err)
                res.send(err)
            else{
                passport.authenticate("local")(req,res,()=>{
                    res.redirect('/home')
                })
            } 
        }
    )
})

authRouter.get("/signout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log(err);
        }
    })
   res.redirect("/login")
})

