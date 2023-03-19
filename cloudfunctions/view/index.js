// 云函数入口文件
// 控制浏览量增加
const cloud = require('wx-server-sdk')

cloud.init({
	env: ' your env id'
})
const db = cloud.database();
const _=db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	console.log(event)
	db.collection('publish').doc(event.id).update({
		data:{
			view:_.inc(1)
		},
		success(res){
			return(res)
		}
	})}