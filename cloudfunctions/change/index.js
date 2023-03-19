//用于定时清除过期的雷达消息

const cloud = require('wx-server-sdk')
cloud.init({
  env: ' your env id'
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event,context) => {
	for(var i=2;i++;i<100){
	let a = await db.collection("book1").skip(i*100).get()
	let promiseList = a.data.map((item) => {
    return new Promise(resolve => {
			item['_id'] =  parseInt(item['isbn'])
			console.log(item)
			resolve(item)
			db.collection("book").add({
				data:item,
			})
      // wx.uploadFile({
      //   url,
      //   filePath: item,
      //   name: 'images[]',
      //   success: (res) => {
      //     const data = JSON.parse(res.data).responseData.imageUrls[0];
      //     resolve(data);
      //   }
      // });
    });
  });
  // 使用Primise.all来执行promiseList
  const result = Promise.all(promiseList).then((res) => {
    // 返回的res是个数据，对应promiseList中请求的结果，顺序与promiseList相同
    // 在这里也就是在线图片的url数组了
    return res;
  }).catch((error) => {
    console.log(error);
  });}
}