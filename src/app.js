const express   = require("express");
const app = express();

const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({extended:false});

const dotenv = require("dotenv");
require('dotenv').config();
var sha512 = require('js-sha512');
var path = require("path");
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/view', express.static(path.join(__dirname, 'views')))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')


/*database connection*/

const mongoose = require("mongoose");
require("../db/conn");

var cors = require('cors')
app.use(cors())


var corsOptions = {
    origin: '*',
}

// const { json } = require("stream/consumers");
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
app.get("/",cors(corsOptions), async (req,res)=>{
    try {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome To Easycampus');
           } catch (error) {
        res.status(400).send(error)
    }
    }); 

    app.get("/users",cors(corsOptions), async (req,res)=>{
        try {
            const users = await userModel.find();
            res.status(200).send(users);
               } catch (error) {
            res.status(400).send(error)
        }
        }); 

//get user by id
    app.get("/users/:id",cors(corsOptions), async (req,res)=>{
        try {
            const _id = req.params.id;
            const users = await userModel.findById(_id);
            res.status(200).send(users);
               } catch (error) {
            res.status(400).send(error)
        }
        });

    //add user 
        app.post("/users",cors(corsOptions), async (req,res)=>{
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
        app.delete("/users/:id",cors(corsOptions), async (req,res)=>{
            try {
                const _id = req.params.id;
                const users = await userModel.findByIdAndDelete(_id);
                res.status(200).send("User Deleted Sucfcessfull");
                   } catch (error) {
                res.status(400).send(error)
            }
            }); 
        //update user by id
        app.post("/users/:id",cors(corsOptions),async(req,res)=>{
            try{
                const _id = req.params.id;
                const users = await userModel.findByIdAndUpdate(_id,req.body,{new :true});
                res.status(201).send({users:users,message:"User Updated Successfull"});        
            }catch(err){
                res.status(404).send(err);
            }
            });

            var config = {
              key: process.env.EASEBUZZ_KEY || '2PBP7IABZ2',
              salt: process.env.EASEBUZZ_SALT || 'DAH88E3UWQ',
              env: process.env.EASEBUZZ_ENV || 'test',
              enable_iframe: process.env.EASEBUZZ_IFRAME || 0,
            };
              
              
              
              //response 
              app.post('/response',cors(corsOptions),async (req, res) => {
                function checkReverseHash(response) {
                  var hashstring = config.salt + "|" + response.status + "|" + response.udf10 + "|" + response.udf9 + "|" + response.udf8 + "|" + response.udf7 +
                    "|" + response.udf6 + "|" + response.udf5 + "|" + response.udf4 + "|" + response.udf3 + "|" + response.udf2 + "|" + response.udf1 + "|" +
                    response.email + "|" + response.firstname + "|" + response.productinfo + "|" + response.amount + "|" + response.txnid + "|" + response.key
                  hash_key = sha512.sha512(hashstring);
                  if (hash_key == req.body.hash)
                    return true;
                  else
                    return false;
                }
                if (checkReverseHash(req.body)) {
                  res.send(req.body);
                }
                res.send('false, check the hash value ');
              });
              
              
              //initiate_payment API
              app.post('/initiate_payment',cors(corsOptions),async (req, res)=> {
                // var data = req.body;
                var data = {
                  txnid: '786786bhjbj',
                  amount: '12.90',
                  name: 'gautam',
                  email: 'initiate.payment@easebuzz.in',
                  phone: '9608993215',
                  productinfo: 'Ecjndjs',
                  surl: 'https://crudapi-demo1.onrender.com/response',
                  furl: 'https://crudapi-demo1.onrender.com/response',
                  udf1: '',
                  udf2: '',
                  udf3: '',
                  udf4: '',
                  udf5: '',
                  address1: '',
                  address2: '',
                  city: '',
                  state: '',
                  country: '',
                  zipcode: '',
                  sub_merchant_id: '',
                  unique_id: '',
                  split_payments: '',
                  customer_authentication_id: '',
                  udf6: '',
                  udf7: '',
                  udf8: '',
                  udf9: '',
                  udf10: ''
                }
              
                console.log("data",data);
                console.log("req.body",req.body);
                var initiate_payment = require('../Easebuzz/initiate_payment.js');
                initiate_payment.initiate_payment(data, config, res);
              });
              
              //Transcation API  
              app.post('/transaction',cors(corsOptions),async (req, res)=> {
                data = req.body;
                var transaction = require('../Easebuzz/transaction.js');
                transaction.transaction(data, config, res);
              });
              
              
              //Transcation Date API  
              app.post('/transaction_date',cors(corsOptions),async(req, res)=> {
              
                data = req.body;
                var transaction_date = require('../Easebuzz/tranaction_date.js');
                transaction_date.tranaction_date(data, config, res);
              });
              
              //Payout API
              app.post('/payout', function (req, res) {
              
                data = req.body;
                var payout = require('../Easebuzz/payout.js');
                payout.payout(data, config, res);
              
              });
              
              //Refund API
              app.post('/refund', function (req, res) {
                data = req.body;
                var refund = require('../Easebuzz/refund.js');
                refund.refund(data, config, res);
              
              });



    




app.listen(port, () => {  
    console.log(`Now listening on port ${port}`); 
});
