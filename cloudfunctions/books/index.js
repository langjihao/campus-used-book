//第三方图书信息API秘钥
const appkey = '220d737bc380667b'; 


const cloud = require('wx-server-sdk')
const TCB = require('tcb-router'); 
const request = require('request');
cloud.init({
		env: 'cloud1-7gg95toua8c7bcf8'
	})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
      const app = new TCB({
            event
			});
      //根据isbn码获取图书详情信息
      app.router('bookinfo', async(ctx) => {
				ctx.body = new Promise(resolve => {
					request({
								url: 'https://api.jisuapi.com/isbn/query?appkey=' + appkey + '&isbn=' + event.isbn,
								method: "GET",
								json: true,
					}, function(error, response, body) {
								resolve({
											body: body
								})
					});
				});
            
      });
      return app.serve();
}