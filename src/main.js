/* 
 ------------------------------------------
  Easebuzz Payment Gateway Integration Kit
  
  Install required packages -> npm install

  Run integration kit -> node main.js
 -----------------------------------------
  Author:  Anurag Alone

*/

require('dotenv').config()
var sha512 = require('js-sha512');
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/view', express.static(path.join(__dirname, 'views')))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
const cors = require('cors');
// app.use(cors());
// const corsOption = {
//   credentials: true,
//   origin: ['http://localhost:3030', 'http://localhost:3030']
// }

// app.use(cors(corsOption));
// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200,
//   }
// app.use(cors(corsOptions));
// app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* 
  Change key,salt and other configuration mentioned in .env file
*/

var config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};



//response 
app.post('/response', function (req, res) {
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
app.post('/initiate_payment', function (req, res) {
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
app.post('/transaction', function (req, res) {
  data = req.body;
  var transaction = require('../Easebuzz/transaction.js');
  transaction.transaction(data, config, res);
});


//Transcation Date API  
app.post('/transaction_date', function (req, res) {

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

app.listen(3000);
console.log("Easebuzz Payment Kit Demo server started at 3000");