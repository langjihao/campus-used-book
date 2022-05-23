const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7gg95toua8c7bcf8'
})
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
	console.log(event)
	if(event.skip){
		var skip = event.skip;
	}else{
		var skip = 0;
	}
	if(event.num){
		var num = event.num;
	}else{
		var num = 20;
	}
	console.log(skip,num)
  return await db.collection('publish').where({
    ...event.query
  }).skip(skip*20).limit(num).orderBy('creat','desc').get();
}