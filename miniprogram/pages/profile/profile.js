// pages/profile/profile.js
const app = getApp()
const db = wx.cloud.database();
Page({
		onLoad(){
			let user =wx.getStorageSync('userinfo')
			this.setData({
				userinfo:user,
				campus:user.campus
			})
		},
    onShow(){
      let user =wx.getStorageSync('userinfo')
      this.setData({
        userinfo:user,
				campus:user.campus
      })
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
      if (!this.data.userinfo) {
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