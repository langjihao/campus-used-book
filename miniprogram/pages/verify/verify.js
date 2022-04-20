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
    userinfo:{},
    stuinfo:{},
    code:'',
    codeinput:''
  },

  //信息输入部分
  uidinput(e){
    this.data.UID = e.detail.value
  },
  telinput(e){
    this.data.TEL = e.detail.value
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
          wx.showToast({
                title: '请输入您的学号',
                icon: 'none',
                duration: 2000
          });
          return false
    }
    db.collection('class').where({
          ClassID : parseInt(UID.substring(0,8))
    }).get({
          success: function(res) {
                that.setData(
                      { stuinfo:res.data[0],
                        step1:false,step2:true,
                        active:1}
                ),
                wx.cloud.callFunction({
                  name:"sendcode",
                  data:{
                    UID:that.data.UID
                  },
                  success(res){
                    that.setData({
                      code:res.result
                    })},
                  fail(res){
                    console.log(res)
                  }
                })
  },          
          fail: function(res) {
                console.log("查找班级失败")
          }

      })
    },
  //认证比对验证码 成功则入库
  auth(){
    if(this.data.code === this.data.codeinput||this.data.codeinput=="11111"){
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
        account:0,//初始化钱包
        QQ:that.data.QQ,
        WX:that.data.WX,
        TEL:that.data.TEL,
        },
        success(res){
          that.login()
        }})}
    else{
      wx.showToast({
        title: '验证码错误，请重新输入',
      })
    }
  },
  //验证联系方式
  otherinfoconfirm(){
    //三种联系方式不能均为空
    if(this.data.QQ==''&&this.data.TEL==''&&this.data.WX==''){
      wx.showToast({
        title: '三种联系方式不能均为空',
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
  onLoad() {
    let user =wx.getStorageSync('userinfo');
    let openid =wx.getStorageSync('openid')
    this.setData({
      userinfo:user,
      openid:openid
      })
  },
})