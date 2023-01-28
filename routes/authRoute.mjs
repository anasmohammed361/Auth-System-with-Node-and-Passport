import {user} from '../models/User.mjs'
import {jwtSecret} from '../config.mjs'
import {Router} from 'express'
import passport from 'passport'
import jwtSimple from 'jwt-simple'

export const router = Router()

router.post("/login",passport.authenticate("local"),
async (req,res)=>{
console.log("Passed the auth so logged in");
try {
    const userData = await user.findOne({
        username:req.body.username
    })
    const payload = {
        id:userData.id,
        // mills * sec * min * hours * days 
        expire : Date.now() +1000 * 60 * 60 * 24 * 1
    }
    const token = jwtSimple.encode(payload,jwtSecret)
    res.json({
        token:token,
    })
} catch (error) {
    console.log("Error occured at /login \n",error);
}
})

router.post("/signup",async(req,res)=>{
   
    user.register(
        new user({username:req.body.username}),
        req.body.password,
        (err,user)=>{
            if(err)
                res.send(err)
            else
                res.send({message:"Signup Successful"})
        }
    )
})



// export {router}