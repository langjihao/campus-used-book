// pages/publish/publish.js
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
  onLoad(options) {

	},
	onShow(){
		let user =wx.getStorageSync('userinfo')
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
	navitowant(){
		wx.navigateTo({
			url: '/pages/want/want',
		})
	},
	navitopub(){
		wx.navigateTo({
			url: '/pages/quickpublish/quickpublish',
		})
	},
	navitologin(){
		wx.navigateTo({
			url: '/pages/wxlogin/wxlogin',
		})
	}
})