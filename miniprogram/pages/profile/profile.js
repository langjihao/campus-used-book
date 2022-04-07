// pages/profile/profile.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(){
      let user = wx.getStorageSync('userinfo')
      console.log(user)
      this.setData({
        userinfo:user,
        islogin:true
      })
      },
    onShow(){
      let user =wx.getStorageSync('userinfo')
      console.log(user)
      this.setData({
        userinfo:user,
        islogin:false
      })
      if(this.data.userinfo!=''){
            this.setData({
                  islogin:true
      })
  }
    },
    loginout(){
      wx.setStorageSync('userinfo', '')
      let user =wx.getStorageSync('userinfo')
      this.setData({
        userinfo:user,
        islogin:false
      })
    },
    go(e) {
      wx.navigateTo({
            url: e.currentTarget.dataset.go
      })
  },
})