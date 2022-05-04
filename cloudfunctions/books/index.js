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
		let isbn = event.isbn;
		let query =await db.collection("books").where({
			isbn:isbn
		}).get();
		console.log(query)
		if(query.data.length==0){
			var rp_options=
			{ url: 'https://api.jisuapi.com/isbn/query?appkey=' + appkey + '&isbn=' + event.isbn,
				method: "GET",
				json: true,
			};
			let book = await rp(rp_options).then(async function(bookdata){
				console.log(bookdata)
				if(bookdata.result.pic==''){
					bookdata.result.pic='cloud://cloud1-7gg95toua8c7bcf8.636c-cloud1-7gg95toua8c7bcf8-1256970835/nopic.png'
				}
				await db.collection('books').add({
								data: bookdata.result,
						});
				return(bookdata.result)
		})
		console.log(book)
		return(book)
		}
		else{
			return(query.data[0])
		}
	}