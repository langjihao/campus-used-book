const cloud = require('wx-server-sdk')
cloud.init({
  env: ' your env id'
})
const db = cloud.database();
const _ = db.command;
// 消息记录表
const MSG = 'chat';
// 云函数入口函数
exports.main = async (event, context) => {
	console.log(event)
  // 获取步骤
  let step = event.step;
  // 获取房间号
  let roomId = event.roomId;
  return await db.collection(MSG).where({
    roomId
  }).skip(step).limit(20).orderBy('_createTime','desc').get();
}