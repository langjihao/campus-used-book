
const cloud = require('wx-server-sdk')
const request = require('request');
cloud.init({
		env: 'cloud1-7gg95toua8c7bcf8'
	})
const db = cloud.database();
const _=db.command;

// 云函数入口函数
exports.main = async(event, context) => {
	const wxContext = cloud.getWXContext()
  // 获取用户唯一身份识别ID
	let openid = wxContext.OPENID
	console.log(openid)
	//判断是否存在房间
	let room = await db.collection('chatlist').where({
		itemid:event.id,
		members:openid
	}).get();
	console.log(room.data.length)
	if(room.data.length==0){
	//获取用户信息
	let selleropenid = event.selleropenid;
	let buyeropenid = openid;
	let _sellerInfo_ = await db.collection("user").doc(selleropenid).get();
	let selleravatar = _sellerInfo_.data.avatarUrl;
	let sellernickName = _sellerInfo_.data.nickName;
	let _buyerInfo_ = await db.collection("user").doc(buyeropenid).get();
	let buyeravatar = _buyerInfo_.data.avatarUrl;
	let buyernickName = _buyerInfo_.data.nickName;
	//获取商品信息
	let _iteminfo_ = await db.collection("publish").doc(event.id).get();
	console.log(_iteminfo_)
	let itemtitle = _iteminfo_.data.title;
	let itempic = _iteminfo_.data.piclist[0];
	let res = await db.collection("chatlist").add({
		data:{
				itemid:event.id,
				members: [selleropenid,buyeropenid],
				selleropenid,
				selleravatar,
				sellernickName,
				itempic,
				itemtitle,
				buyeropenid,
				buyeravatar,
				buyernickName,
				lastmsg:'',
				update:123
		},
	})
	return(res._id)
	}
	else{
		console.log(1)
		return(room.data[0]._id)
	}
}