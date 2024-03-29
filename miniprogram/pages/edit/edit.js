const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
						campuslist: JSON.parse(config.data).campus,
						showcampus:false
      },
      //跳转到实名认证页
      navitoauth(){
            wx.navigateTo({
                  url: '/pages/verify/verify'
                })
      },
			//展示校区选项
			showcampus(){
				this.setData({ showcampus: !this.data.showcampus });
			},
			//改变校区
			choosecampus(e){
				this.setData({
					campus:e.detail.value
			})     

			},
			confirmcampus(e){
				this.setData({
					campus:e.detail.value,
					showcampus: !this.data.showcampus
			})   
			},
      onLoad() {
            let user =wx.getStorageSync('userinfo');
            let openid = wx.getStorageSync('openid')
            this.setData({
							QQ:user.QQ,
							WX:user.WX,
							campus:user.campus,
							avatarUrl:user.avatarUrl,
							nickName:user.nickName,
              userinfo:user,
              openid:openid
            })
      },
      wxInput(e) {
				console.log(e)
            this.data.WX = e.detail;
      },
      qqInput(e) {
            this.data.QQ = e.detail;
      },    
      //同步最新头像昵称
      getUserProfile(e){
				let that = this;
					wx.getUserProfile({
								desc: '更新头像和昵称',
								success(res){
									that.setData({
										nickName: res.userInfo.nickName,
										avatarUrl:res.userInfo.avatarUrl
								})

								},
								fail(res){
											wx.showToast({icon:"none",
												title: '更新失败',
											})
								}
		})
			},
      //校检更新
      check() {
				let that=this;
					wx.showLoading({
								title: '正在提交',
					})
					db.collection('user').doc(that.data.openid).update({
								data: {
											QQ: that.data.QQ,
											WX: that.data.WX,
											avatarUrl:that.data.avatarUrl,
											campus:that.data.campus,
											nickName:that.data.nickName,
											update: new Date().getTime(),
								},
								success: function(res) {
											console.log(res)
											db.collection('user').doc(that.data.openid).get({
														success: function(res) {
																	wx.setStorageSync('userinfo',res.data)
																	wx.hideLoading();
																	wx.showToast({icon:"none",
																				title: '修改成功',
																				icon: 'success'
																	})
																	wx.navigateBack()
														},
											})
								},
								fail(res) {
											console.log(res)
											wx.hideLoading();
											wx.showToast({icon:"none",
														title: '修改失败，请重新提交',
														icon: 'none',
											})
								}
					})
      },
})