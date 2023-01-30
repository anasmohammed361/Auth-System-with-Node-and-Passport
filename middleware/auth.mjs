import passport,{} from 'passport'
import {ExtractJwt,Strategy} from 'passport-jwt'
import {user} from '../models/User.mjs'
import {jwtSecret,jwtSession} from '../configs/config.mjs'

const params = {
    secretOrKey : jwtSecret,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken("jwt")
}

export function auth() {
    const strategy = new Strategy(params,
        (payload,done)=>{
            const currentUser = user.findById(payload.id,(err,user)=>{
                if(err)
                    return done(new Error("UserNotFound"),null)
                else if(payload.expire <= Date.now())
                    return done(new Error("TokenExpired"),null)
                else
                    return done(null,user)
            })
        })
        passport.use(strategy)
        return {
            initialize: ()=> passport.initialize(),
            authenticate : ()=> passport.authenticate('jwt',jwtSession)
        }
}