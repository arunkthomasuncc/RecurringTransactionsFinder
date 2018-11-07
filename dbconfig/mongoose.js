var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/interview_challenge', {useNewUrlParser: true}, function(){
	console.log("mongoDB connected");
});
module.exports={mongoose :mongoose};