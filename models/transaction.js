const  mongoose= require('mongoose');

let  transactionSchema= new mongoose.Schema({
    trans_id : String,
    user_id  : String,
    name     : String,
    amount   : Number,
    date     : Date
  //  is_Recurring: Boolean
});
module.exports= mongoose.model('Transaction',transactionSchema);;