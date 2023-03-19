const cloud = require('wx-server-sdk')
const crypto = require('crypto');
cloud.init({
  env: ' your env id'
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数 
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 获取用户唯一身份识别ID
  let openid = wxContext.OPENID || event.openid;
	let _userInfo_ = await db.collection("user").doc(openid).get();
  // 获取用户信息
	let avatar = _userInfo_.data.avatarUrl;
	let nickName = _userInfo_.data.nickName;
  // 获取消息类型
  let msgType = event.msgType || 'text';
  // 获取会话房间号
  let roomId = event.roomId;
  // 根据消息类型 -- 进行不同逻辑处理
  switch (msgType) {
    case 'text': {
			// 获取消息主体内容
			console.log(event)
			let content = event.content;
			console.log(roomId)
			let remind = await db.collection("chatlist").doc(roomId).update({
				data:	{	lastmsg:content,
				update:new Date().getTime(),}
			});
			console.log(remind)
			return await db.collection("chat").add({
				data: {
					roomId,
					openid,
					msgType,
					content,
					avatar:avatar,
					nickName:nickName,
					creat: new Date().getTime()
				}
			})
      } 
    case 'image': {
			let content = event.content;
			const hash = crypto.createHash('md5');
      hash.update(content, 'utf8');
      const md5 = hash.digest('hex');
      let upData = await cloud.uploadFile({
        cloudPath: 'cloud-chat/'+md5+'.png',
        fileContent: Buffer.from(content,'base64')
      })
			let fileID = upData.fileID;
			await db.collection("chatlist").doc(roomId).update({
				data:{lastmsg:"[图片消息]",
				update:new Date().getTime(),}
			})
			return await db.collection("chat").add({
				data: {
					roomId,
					openid,
					msgType,
					content:fileID,
					avatar:avatar,
					nickName:nickName,
					creat: new Date().getTime()
				}
			})
      }
    }
}
