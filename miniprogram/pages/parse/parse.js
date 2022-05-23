const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({
      data: {
				show:0
				},
			onShow(){
				console.log(1)
				let that = this;
				let openid = wx.getStorageSync('openid');
				let user = wx.getStorageSync('userinfo')
				this.setData({
					avatarUrl:user.avatarUrl,
					userinfo:user
				})
				db.collection("publish").where({
					_openid:openid,
					status:2
				}).get({
					success(res){
						that.setData({
							num:res.data.length*700,
						})
					}
				})
			},
			//弹出某个提示框
			showPopup(e){
				this.setData({
					show:e.currentTarget.dataset.id
				})
			},
			//关闭提示框
			close(){
				this.setData({
					show:0
				})
			},
			//跳转到发布tab
			gotopub(){
				wx.switchTab({
					url: '/pages/publish/publish',
				})
			},
			//返回上一层
			back(){
				wx.navigateBack()
			},
		})