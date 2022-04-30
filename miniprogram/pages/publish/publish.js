// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		islogin:false
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
		if(this.data.userinfo.isauth){
		wx.navigateTo({
			url: '/pages/want/want',
		})
		}
		else{
			wx.showModal({
				cancelColor: 'cancelColor',
				content:'初次使用，请先完善个人信息',
				confirmText:'去完善',
				cancelText:"下次再说",
				cancelColor: 'cancelColor',
				success(res) {
				if (res.confirm) {
				
				wx.navigateTo({
					url: '/pages/verify/verify',
				})

				} else {

				 return false
				}}
			})
		}
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