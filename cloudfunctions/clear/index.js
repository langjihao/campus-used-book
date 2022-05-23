//用于定时清除过期的雷达消息

const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7gg95toua8c7bcf8'
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event,context) => {
	console.log(1)
	console.log(new Date().getTime()-86400000)
  let a = 	await db.collection("publish").where({
		type:_.gt(1),
		creat:_.lte(new Date().getTime()-86400000) //超过一天，标记售出
	}).update({
		data:{
			status:1
		}
	})
	console.log(a)
}