const express = require('express')
const router =  express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
// const requireLogin = require('../middleware')
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"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"
//     }
// }))
//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


router.post('/signup',(req,res)=>{
    const {name,email,tel,password,role} = req.body
    if(!name || !email || !tel || !password){
        return res.status(422).json({error:"please add all the fields"})
    }
        User.findOne({email:email}||{tel:tel})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"User already exists with that email or tel"})
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    name,
                    email,
                    tel,
                    password:hashedpassword,
                    role: role || "basic"
                })
                user.save(err => {
                    if (err) {
                      res.status(500).send({ message: err })
                      return
                    }
                    res.json({message:"saved successfully"})
                })
            })
     })    
     .catch(err=>{
        console.log(err)
     })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
      return  res.status(422).json({error:"please add email or password"})
    }
    var n = email.includes("@reap.com")
   
        User.findOne({email:email})
        .populate("roles", "-__v")
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"Invalid email or password"})
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
                if(doMatch){
                    //res.json({message:"successfully"})
                    const token = jwt.sign({id:savedUser._id},JWT_SECRET)
                    const {_id,role,fullName,email,tel} = savedUser
                    res.json({token,user:{_id,role,fullName,email,tel}})
                }
                else{
                    return res.status(422).json({error:"Invalid email or password"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    
})

// router.post('/reset-password',(req,res)=>{
//     crypto.randomBytes(32,(err,buffer)=>{
//         if(err){
//             console.log(err)
//         }
//         const token = buffer.toString("hex")
//         User.findOne({email:req.body.email})
//         .then(user=>{
//             if(!user){
//                 return res.status(422).jsonp({error:"user dont exist with that email"})
//             }
//             user.resetToken = token
//             user.expireToken = Date.now() + 3600000
//             user.save().then((result)=>{
//                transporter.sendMail({
//                     to:usr.email,
//                     from:"niroavram@gmail.com",
//                     subject:"password reset",
//                     html: `     
//                     <p> You requested for password reset </p>
//                   <h5>Click on this<a href="http://localhost:3000/reset/${token}"> link</a> to reset password</h5>
//                    `
//                 }) 
//                 res.json({message:"check your email"})
//             })
//         })
//     })
// })
// router.post('/new-password',(req,res)=>{
//     const newPassword = req.body.password
//     const sentToken = req.body.token
//     User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
//     .then(user=>{
//         if(!user){
//             return res.status(422).json({error:"Try agian session experid"})
//         }
//         bcrypt.hash(newPassword,12).then(hashedpassword=>{
//             user.password  = hashedpassword
//             user.resetToken = undefined
//             user.expireToken = undefined
//             user.save().then((savedMember)=>{
//                 res.json({message:"password updated success"})
//             })
//         })
//     }).catch(err=>{
//         console.log(err)
//     })
// })
// router.post('/edit-profile',(req,res)=>{
//     const newPassword = req.body.password
//     const fullName = req.body.fullName
//     const email = req.body.email
//     const tel = req.body.tel
//     User.findOne(req.body._id)
//     .then(user=>{
//         if(!user){
//             return res.status(422).json({error:"Try agian session experid"})
//         }
//         bcrypt.hash(newPassword,12).then(hashedpassword=>{
//             user.tel = tel
//             user.fullName = fullName
//             user.email = email
//             user.password  = hashedpassword
//             user.save().then((savedUser)=>{
//                 res.json({message:"update profile successfully"})
//             })
//         })
//     }).catch(err=>{
//         console.log(err)
//     })
// })


module.exports = router