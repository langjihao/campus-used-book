// pages/wxlogin/wxlogin.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    nickName:"",
    avatarUrl:"",
    openID:"",
    userInfo: {},
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
        })
        let user = this.data.userInfo;
        let that = this;
        db.collection('user').where({
          _openid:that.data.openID         
        }).get().then(res => {
          console.log(res)
          if(res.data == ""){
            db.collection('user').add({
              data: {
                    stamp: new Date().getTime(),
                    avatarUrl:user.avatarUrl,
                    nickName:user.nickName,
                    gender:user.gender,
                    city:user.city,
                    isauth: false,
              },
              fail: function(res) {
                    console.log(res)
                    wx.hideLoading();
                    wx.showToast({
                          title: '注册失败，请重新提交',
                          icon: 'none',
                    })
              
        },
  })       
            wx.showToast({
              title: '授权成功，正在前往实名认证界面',
            })
            wx.navigateTo({
              url: '/pages/verify/verify'
            })
          }
          else if(!res.data[0].isauth){
            wx.showToast({
              title: '您尚未实名认证，正在前往实名认证页面',
            })
            wx.navigateTo({
              url: '/pages/verify/verify'
            })
          } 
          else{
            wx.showToast({
              title: '欢迎回来',
            });
            wx.setStorageSync('userinfo',res.data[0])
            wx.setStorageSync('history', [])
            wx.navigateBack({})
          }
      })}})},

  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"login",
      complete:res =>{
        this.setData({
          openID : res.result.openid
        })
        wx.setStorageSync('openid',res.result.openid)
      }
    })
  },
})