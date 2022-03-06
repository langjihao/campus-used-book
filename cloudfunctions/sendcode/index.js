const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', 
  port: 465, 
  auth: {
    user: '1574447086@qq.com', 
    pass: 'kxzkyexsciflhaac' 
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 云函数入口函数
exports.main = async(event, context) => {
    //生成一个验证码
    var range=function(start,end)
    {
             var array=[];
             for(var i=start;i<end;++i) array.push(i);
             return array;
    };
    var randomstr = range(0,5).map(function(x){return Math.floor(Math.random()*10);
    }).join('');
    //获取邮件校园邮箱地址
    var add = event.UID + "@mails.qust.edu.cn"
  var mail = {
    // 发件人
    from: '来自青稞<1574447086@qq.com>',
    // 主题
    subject: '青稞二手校内认证邮件',
    // 收件人
    to: add,
    // 邮件内容，text或者html格式
    text: randomstr
  };
 
  let res = await transporter.sendMail(mail);
  return randomstr;
}