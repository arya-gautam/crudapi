const express   = require("express");
const app = express();

const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({extended:false});

const dotenv = require("dotenv");
require('dotenv').config();

/*database connection*/

const mongoose = require("mongoose");
require("../db/conn");



const { json } = require("stream/consumers");
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//create schema and get data from db 
var userSchema = new mongoose.Schema({
    firstname: String,
    lastname:String,
    phone:String,
    email:String,
    password:String,
    confirmpassword:String,
    address:String,
});

var userModel=mongoose.model('registers',userSchema);
//get all users
app.get("/users", async (req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send(users);
           } catch (error) {
        res.status(400).send(error)
    }
    }); 

//get user by id
    app.get("/users/:id", async (req,res)=>{
        try {
            const _id = req.params.id;
            const users = await userModel.findById(_id);
            res.status(200).send(users);
               } catch (error) {
            res.status(400).send(error)
        }
        });

    //add user 
        app.post("/users", async (req,res)=>{
            try {
                const password = req.body.password;
                const cpassword = req.body.confirmpassword;
                if(password === cpassword)
                {
                    const uers = new userModel({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        email : req.body.email,
                        phone : req.body.phone,
                        password : password,
                        confirmpassword : cpassword,
                        address : req.body.address
                    });
                    
                    const save = await uers.save();
                   // var users = await userModel.find();
                    res.status(201).send("User Added Successfull");
                }
            } catch (error) {
               res.status(400).send(error);
            }
            })
        //delete user by id 
        app.delete("/users/:id", async (req,res)=>{
            try {
                const _id = req.params.id;
                const users = await userModel.findByIdAndDelete(_id);
                res.status(200).send("User Deleted Sucfcessfull");
                   } catch (error) {
                res.status(400).send(error)
            }
            }); 
        //update user by id
        app.post("/users/:id",async(req,res)=>{
            try{
                const _id = req.params.id;
                const users = await userModel.findByIdAndUpdate(_id,req.body,{new :true});
                res.status(201).send({users:users,message:"User Updated Successfull"});        
            }catch(err){
                res.status(404).send(err);
            }
            });

    




app.listen(port, () => {  
    console.log(`Now listening on port ${port}`); 
});
