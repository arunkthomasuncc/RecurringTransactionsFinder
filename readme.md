API Details

1. Create Transactions
URL : http://localhost:1984/createTransaction
Sample Payload:
{
	"transactions" :[
  {
    "name": "VPN Service",
    "date": "2016-05-19T07:00:00.000Z",
    "amount": 29.99,
    "trans_id": 17,
    "user_id": 1,
    "is_recurring": "TRUE"
  }
 ]
}

Sample resonse :
same as below

2. Getting Recurring transaction
   URL : http://localhost:1984/getRecurringTransaction
   Sample response:
   
[
    {
        "transactions": [
            {
                "_id": "5bdce685d10f8a6564496ee9",
                "trans_id": "24",
                "user_id": "1",
                "name": "GEICO",
                "amount": 165.25,
                "date": "2018-04-16T07:00:00.000Z"
            },
            {
                "_id": "5bdce686d10f8a6564496ef9",
                "trans_id": "16",
                "user_id": "1",
                "name": "GEICO",
                "amount": 165.25,
                "date": "2018-05-16T07:00:00.000Z"
            },
            {
                "_id": "5bdce686d10f8a6564496f04",
                "trans_id": "10",
                "user_id": "1",
                "name": "GEICO",
                "amount": 165.25,
                "date": "2018-06-14T07:00:00.000Z"
            },
            {
                "_id": "5bdce686d10f8a6564496f0d",
                "trans_id": "5",
                "user_id": "1",
                "name": "GEICO",
                "amount": 165.25,
                "date": "2018-07-16T07:00:00.000Z"
            }
        ],
        "_id": "5bdce685d10f8a6564496eeb",
        "name": "GEICO",
        "user_id": "1",
        "next_amt": 165.25,
        "next_date": "2018-08-14T07:00:00.000Z"
    }
  ]
  
  
