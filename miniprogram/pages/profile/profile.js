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
    login(){
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
  })
    },
    go(e) {
      if (!this.data.islogin) {
        wx.showModal({
              title: '温馨提示',
              content: '该功能需要登录方可使用，是否马上去登录',
              success(res) {
                    if (res.confirm) {
                          wx.navigateTo({
                                url: '/pages/wxlogin/wxlogin',
                          })
                    }
              }
        })
        return false
       }
      wx.navigateTo({
            url: e.currentTarget.dataset.go
      })
  },
})