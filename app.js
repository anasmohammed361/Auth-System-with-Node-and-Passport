const express = require('express')
const bcrypt = require('bcrypt')
const {config} = require('dotenv')
config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
// app.use()

console.log(process.env.DATABASE_URI);



app.route("/signUp")
.get((req,res)=>{
    // console.log(req.body);
    res.send("Hello world")
})
.post((req,res)=>{
    console.log(req.body);
    res.json({Name:req.body})
})

app.listen(3000,()=>{
    console.log("Server running at port 3000");
})