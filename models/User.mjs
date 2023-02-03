import { Schema, model } from 'mongoose'
import findOrCreatePlugin from 'mongoose-findorcreate'
import passportLocalMongoose from 'passport-local-mongoose'
const userSchema = new Schema({
    username: String,
    password:String,
    googleId:String
},{
    collection:'authentication'
})
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreatePlugin)
export const user =  model('auth',userSchema)
