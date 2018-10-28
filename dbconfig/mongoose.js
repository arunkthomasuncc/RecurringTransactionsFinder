var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/interview_challenge', function(){
	console.log("success");
});
module.exports={mongoose :mongoose};