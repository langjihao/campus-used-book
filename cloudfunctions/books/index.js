//第三方图书信息API秘钥
const appkey = ''; 

const rp = require('request-promise')
const cloud = require('wx-server-sdk')
const TCB = require('tcb-router'); 
const request = require('request');
cloud.init({
		env: ''
	})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
		let isbn = parseInt(event.isbn);
		console.log(isbn)
		let query =await db.collection("book").where({
			_id:isbn
		}).get();
		console.log(query)
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
					bookinfo.pic='cloud:// your env id.636c- your env id-1256970835/nopic.png'
				}
				await db.collection('book').add({
								data: bookinfo,
						});
				return(bookinfo)
		})
			return(book)
		}
		else{
			return(query.data[0])
		}
	}