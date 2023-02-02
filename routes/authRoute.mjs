import {user} from '../models/User.mjs'
// import {jwtS ecret} from '../configs/config.mjs'
import {Router} from 'express'
import passport  from 'passport'

export const authRouter = Router()

// authRouter.post("/login",passport.authenticate("local"),
// async (req,res)=>{
// console.log("Passed the auth so logged in");
// try {
//     const userData = await user.findOne({
//         username:req.body.username
//     })
//     const payload = {
//         id:userData.id,
//         // mills * sec * min * hours * days 
//         expire : Date.now() +1000 * 60 * 60 * 24 * 1
//     }
//     const token = jwtSimple.encode(payload,jwtSecret)
//     res.cookie('jwt',token,{httpOnly:true})
//     res.send("Cookie was send")
// } catch (error) {
//     console.log("Error occured at /login",error);
// }
// })

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


// export {router}