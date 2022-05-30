// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const tencentcloud = require("tencentcloud-sdk-nodejs");
const NlpClient = tencentcloud.nlp.v20190408.Client;
const clientConfig = {
  credential: {
    secretId: "AKIDTjjSwIwoBTYOyHS6evvevvfAPbXBBQ9d",
    secretKey: "NWCcm87qIRLzMTIzPYT8YiTzPYS6TbS4",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "nlp.tencentcloudapi.com",
    },
  },
};
const client = new NlpClient(clientConfig);
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const params = {
    "Text": event.text,
    "Num": 5
	};
	
	let newlist = client.KeywordsExtraction(params).then(
		(data) => {
			var list=[];	
			for(var i = 0;i<data.Keywords.length;i++){
				list=list.concat([data.Keywords[i].Word])
			}
			return({aitag:list})
		},
		(err) => {
			console.error("error", err);
		})
	return(newlist)
}

