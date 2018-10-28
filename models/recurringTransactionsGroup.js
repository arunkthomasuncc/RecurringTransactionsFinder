var  mongoose= require('mongoose');
var Transaction=require('./../models/transaction')

var  recurringTransactionsgroupSchema= new mongoose.Schema({
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