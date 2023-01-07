const mongoose = require("mongoose");


const mongoURI  = `mongodb+srv://users:users@cluster0.vkr3a.mongodb.net/cms?retryWrites=true&w=majority`;
//const mongoURI = `mongodb://127.0.0.1:27017/cms`;
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI ,{
    useNewUrlParser:true,
   // useCreateIndex:true,
    useUnifiedTopology:true,
    //useFindAndModify:false
}).then(()=>{
    console.log(`Connection Successful With Mongo DB`);
}).catch((error)=>{
    console.log(error);
});




  
