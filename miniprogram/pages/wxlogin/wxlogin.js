// pages/wxlogin/wxlogin.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    nickName:"",
    avatarUrl:"",
    openID:"",
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        db.collection('user').where({
          _openid:this.data.openID
          
        }).get().then(res => {
          if(res.data == ""){
            db.collection('user').add({
              data: {
                    stamp: new Date().getTime(),
                    info: this.data.userInfo,
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
            console.log(res)
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
            wx.navigateBack({})
          }
      })}})},


  /**
   * 生命周期函数--监听页面加载
   */
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
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})