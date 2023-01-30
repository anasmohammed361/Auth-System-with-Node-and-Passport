import { Schema, model } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
const userSchema = new Schema({
    username: { type : String , unique : true, required : true },
    password:String
},{
    collection:'authentication'
})
userSchema.plugin(passportLocalMongoose)
export const user =  model('auth',userSchema)
