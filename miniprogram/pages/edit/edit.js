const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
						campuslist: JSON.parse(config.data).campus,
						show:false
      },
      //跳转到实名认证页
      navitoauth(){
            wx.navigateTo({
                  url: '/pages/verify/verify'
                })
      },
      //校区选择
      choose(e){
            this.setData({
                  campus:e.detail.value
            })     
			},
			//弹出层开关
			showPopup() {
				this.setData({ show: !this.data.show });
			},
			//切换商品类别
			choosesort(e){
				console.log(e)
				this.setData({
				campus:e.detail.value,
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
											wx.showToast({
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
																	wx.showToast({
																				title: '修改成功',
																				icon: 'success'
																	})
														},
											})
								},
								fail(res) {
											console.log(res)
											wx.hideLoading();
											wx.showToast({
														title: '修改失败，请重新提交',
														icon: 'none',
											})
								}
					})
      },
})