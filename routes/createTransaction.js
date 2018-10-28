var express = require('express');
var transactionModel = require('./../models/transaction');
var recurringGroupModel = require('./../models/recurringTransactionsGroup');
var async = require('async');
var router = express.Router();

router.post('/', function(req, res) {
  createTransaction(req, res);

});
router.get('/', function(req, res) {
  getRecurringTransactions(req, res);

});


async function createTransaction(req, res, next) {


  let transactions = req.body.transactions;
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    var transactionObj = new transactionModel({
      trans_id: transaction.trans_id,
      user_id: transaction.user_id,
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
    });
    await transactionObj.save()
      .then(item => {


      })
      .catch(err => {
        /*console.log("Error in writing to db");
       const error = new Error('Please try again');
         error.httpStatusCode = 400;
         next(error);*/
      });
    await createRecurringGroup(transactionObj);
  }
  await getRecurringTransactions(req, res);
}

function createRecurringGroup(transaction) {
  let name = transaction.name.split(' ')[0];
  let user_id = transaction.user_id;
  let transactionAmt = transaction.amount;
  recurringGroupModel.findOne({
    'name': name,
    'user_id': user_id,
    'next_amt': {
      "$gte": transactionAmt / 1.1,
      "$lte": transactionAmt / 0.9
    }
  }, (err, recurringTransactions) => {
    if (err) {

    } else {

      if (recurringTransactions) {

        
        predictNextTransactionDetailsAndSave(recurringTransactions,transaction)
        
        
      } else {
        createNewRecurringGroup(transaction)
      }
    }

  });

}

function predictNextTransactionDetailsAndSave(recurringTransactionGroup,transaction)
{
  let transactions = recurringTransactionGroup.transactions;
  let noOfTransasctions=transactions.length;  
  if (noOfTransasctions > 1) {
      let interval = recurringTransactionGroup.interval;
      let nextDateInMilliSec = recurringTransactionGroup.next_date.getTime();
      let transactionDateMilliSec = transaction.date.getTime();
      if (Math.abs(nextDateInMilliSec - transactionDateMilliSec) < 10 * 24 * 60 * 60 * 1000) {
        let nextPredictedDate = new Date(nextDateInMilliSec + (interval * 24 * 60 * 60 * 1000));
        recurringTransactionGroup.next_date = nextPredictedDate;
        recurringTransactionGroup.next_amt = transaction.amount;
        recurringTransactionGroup.transactions.push(transaction);
        recurringTransactionGroup.save();
  }
        } else {
          //case where only transaction is there 
          let possibleNextDate = [];
          //existing transaction date
          let existingTransactionDate = recurringTransactionGroup.next_date;
          let transactionDateMilliSec = transaction.date.getTime();
          let flag = false;
          let nextDate = null;
          let interval = 0;
          possibleNextDate.push(new Date(existingTransactionDate.getTime() + 7 * 24 * 60 * 60 * 1000));
          possibleNextDate.push(new Date(existingTransactionDate.getTime() + 30 * 24 * 60 * 60 * 1000));
          possibleNextDate.push(new Date(existingTransactionDate.getTime() + 365 * 24 * 60 * 60 * 1000));

          for (let i = 0; i < possibleNextDate.length; i++) {
            if (Math.abs(possibleNextDate[i] - transactionDateMilliSec) < 10 * 24 * 60 * 60 * 1000) {
              flag = true;
              if (i == 0) {

                nextDate = new Date(transactionDateMilliSec + 7 * 24 * 60 * 60 * 1000);
                interval = 7;

              } else if (i == 1) {
                nextDate = new Date(transactionDateMilliSec + 30 * 24 * 60 * 60 * 1000);
                interval = 30;

              } else {
                nextDate = new Date(transactionDateMilliSec + 365 * 24 * 60 * 60 * 1000);
                interval = 365;

              }

              break;

            }
          }
          if (flag == true) {
            recurringTransactionGroup.next_amt = transaction.amount;
            recurringTransactionGroup.next_date = nextDate;
            recurringTransactionGroup.interval = interval;
            recurringTransactionGroup.transactions.push(transaction);
            recurringTransactionGroup.is_recurringGroup = true;
            recurringTransactionGroup.save();
          } else {
            createNewRecurringGroup(transaction);
          }

        }
}

function createNewRecurringGroup(transaction) {
    var recurringGroup = new recurringGroupModel();
    recurringGroup.name = transaction.name.split(' ')[0];
    recurringGroup.user_id = transaction.user_id;
    recurringGroup.next_amt = transaction.amount;
    recurringGroup.next_date = transaction.date;
    recurringGroup.transactions.push(transaction);
    recurringGroup.is_recurringGroup = false;
    recurringGroup.interval = 0;
    recurringGroup.save();
}
function getRecurringTransactions(req, res) {
  recurringGroupModel.find({
      is_recurringGroup: true
    }, ['name', 'user_id', 'next_amt', 'next_date', 'transactions'], {
      sort: {
        name: 1
      }
    })
    .populate('transactions', ['trans_id', 'user_id', 'name', 'amount', 'date']).exec(
      (err, recurringTransactions) => {
        if (err) {
          console.log(err);
        } else {
          res.send(recurringTransactions);
        }
      } 
    );

}

module.exports = router