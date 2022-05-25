// pages/verify/verify.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '输入学工号',
      },
      {
        text: '验证信息',
      },
      {
        text: '完成',
      },
    ],
    step1:true,
    step2:false,
    step3:false,
    active:0,
    stuinfo:{},
		UID:''
  },

  //信息输入部分
  uidinput(e){
    this.data.UID = e.detail.value
  },
  wxinput(e){
    this.data.WX = e.detail.value
  },
  qqinput(e){
    this.data.QQ = e.detail.value
  },
  codeinput(e){
    this.data.codeinput = e.detail.value
  },
  //匹配专业信息
  match(){
    let that = this;
    //校检学号(尚未考虑教工的情况)
    let UID = that.data.UID;
    if (UID == '') {
          wx.showToast({icon:"none",
                title: '请输入您的学号',
                icon: 'none',
                duration: 2000
          });
          return false
    }
    db.collection('class').where({
          ClassID : parseInt(UID.substring(0,8))
    }).get({
          success(res) {
                that.setData(
                      { stuinfo:res.data[0],
                        step1:false,step2:true,
                        active:1}
								)},
					fail(res) {
						wx.showToast({icon:"none",
							title: '没有找到您的班级',
						})
					}
                // wx.cloud.callFunction({
                //   name:"sendcode",
                //   data:{
                //     UID:that.data.UID
                //   },
                //   success(res){
                //     that.setData({
                //       code:res.result
                //     })},
                //   fail(res){
                //     console.log(res)
                //   }
                // })       
      })
  },
  //认证比对验证码 成功则入库（免去认证，全部成功）
  auth(){
    if(true){
      let that = this;
      let openid=that.data.openid;
      let stuinfo = that.data.stuinfo;
      db.collection("user").where({
        _openid:openid
      }).update({
        data: {
        class:stuinfo.Class,
        major:stuinfo.Major,
        school:stuinfo.School,
        campus:stuinfo.Distinct,
        grade:stuinfo.Grade,
        majorID:stuinfo.MajorID,
        classID:stuinfo.ClassID,
        isauth:true,
        UID:that.data.UID,
        carbonaccount:0,//碳账户
        QQ:that.data.QQ,
        WX:that.data.WX,
        },
        success(res){
          that.login()
        }})}
    else{
      wx.showToast({icon:"none",
        title: '验证码错误，请重新输入',
      })
    }
  },
  //验证联系方式
  otherinfoconfirm(){
    //两种联系方式不能均为空
    if(this.data.QQ==''&&this.data.WX==''){
      wx.showToast({icon:"none",
        title: '两种联系方式不能均为空',
        duration:2000
      })
    }
    //验证验证码是否正确
    this.auth()

  },
  //认证成功后自动登录
  login(){
    db.collection('user').where({
      _openid:this.data.openid
    }).get({
      success(res){
      console.log(res)    
      wx.setStorageSync('userinfo', res.data[0])
      wx.setStorageSync('history', [])
      }
        })

    this.setData({
      step3:true,
      step2:false,
      active:2
      })
		},
	//回首页
	navitoindex(){
		wx.switchTab({
			url: '/pages/index/index',
		})
	},
  onLoad() {
    let openid =wx.getStorageSync('openid')
    this.setData({
      openid:openid
      })
  },
})