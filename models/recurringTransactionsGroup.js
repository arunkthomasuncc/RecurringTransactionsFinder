const  mongoose= require('mongoose');
const Transaction=require('./../models/transaction')

let  recurringTransactionsgroupSchema= new mongoose.Schema({
    user_id : String,
    name  : String,
    next_amt    : Number,
    next_date   : Date,
    transactions : [ {
           			 type: mongoose.Schema.Types.ObjectId,
            		 ref: 'Transaction'
  					 }
    			   ],
    is_recurringGroup:  Boolean,
    interval:Number
});

module.exports= mongoose.model('RecurringTransactionsGroup',recurringTransactionsgroupSchema);