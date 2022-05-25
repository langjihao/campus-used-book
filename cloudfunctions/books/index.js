//第三方图书信息API秘钥
const appkey = '220d737bc380667b'; 

const rp = require('request-promise')
const cloud = require('wx-server-sdk')
const TCB = require('tcb-router'); 
const request = require('request');
cloud.init({
		env: 'cloud1-7gg95toua8c7bcf8'
	})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
		let isbn = parseInt(event.isbn);
		let query =await db.collection("book").where({
			_id:isbn
		}).get();
		if(query.data.length==0){
			var rp_options=
			{ url: 'https://api.jisuapi.com/isbn/query?appkey=' + appkey + '&isbn=' + event.isbn,
				method: "GET",
				json: true,
			};
			let book = await rp(rp_options).then(async function(bookdata){

				let bookinfo = bookdata.result;
				bookinfo['_id'] = isbn;
				if(bookinfo.pic==''){
					bookinfo.pic='cloud://cloud1-7gg95toua8c7bcf8.636c-cloud1-7gg95toua8c7bcf8-1256970835/nopic.png'
				}
				await db.collection('book').add({
								data: bookinfo,
						});
				return(bookdata.result)
		})
		return(book)
		}
		else{
			return(query.data[0])
		}
	}