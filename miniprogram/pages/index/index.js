const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({
		data: {
					onlycampus:false,
					onlysell:false,
					showtip:false,
					sort: JSON.parse(config.data).sort,
					scrollTop: 0,
					nomore: false,
					list: [],
					userinfo:'',
					islogin:false,
					currentList : 0,
					showtype:0,
					barheight:app.globalData.CustomBar,
					query:{
						status:0
					},
					skip:0
		},
		onLoad() {
					wx.showLoading({
						title: '宝贝在路上',
					})
					this.getbanner();
					this.querylist();
		},
		//监测屏幕滚动
		onPageScroll(e){
					this.setData({
								scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
					})
		},
		//改变显示布局
		changeshowtype(){
			if(this.data.showtype==0){
				this.setData({
					showtype:1
				})
			}
			else{
				this.setData({
					showtype:0
				})
			}
		},
		onShow(){
			this.setData({
				userinfo:wx.getStorageSync('userinfo'),
			})
		},
		//获取当前标签页
		gettab(e){
					this.setData({
						nomore:false,
						list:[],
						skip:0,
					})
					let c = e.detail.index;
					if (c==0){
								this.setData({
									query:{
										status:0
									}
								})
								this.querylist()
					} 
					//其余表示该品类的商品
					else{
						this.setData({
							query:{
								status:0,
								kind:c
							}
						})
						this.querylist()
					}
		},
		//获取商品
		querylist() {
			let that=this;
			wx.cloud.callFunction({
				name:"querylist",
				data:{
					skip:that.data.skip,
					query:that.data.query,
				},
				success(res){
					that.setData({
						list:that.data.list.concat(res.result.data)
					})
					wx.hideLoading()
					if(res.result.data.length<20){
						that.setData({
							nomore:true
						})
					}
				},
				fail(err){
					console.log(err)
				}
			})
		},
		//触底加载更多
		onReachBottom() {
			if(this.data.nomore){
				return
			}
			this.setData({
				skip:this.data.skip+1
			})
			this.querylist()
		},
		//下拉刷新
		onPullDownRefresh() {
				wx.showLoading()
				this.setData({
					list:[],
					skip:0
				})
				this.querylist();
		},
		gotop() {
					wx.pageScrollTo({
								scrollTop: 0
					})
		},
		//获取轮播
		getbanner() {
					let that = this;
					db.collection('banner').get({
								success: function(res) {
											that.setData({
														banner: res.data[0].list
											})
								}
					})
		},
		//跳转轮播链接
		goweb(e) {
					if (e.currentTarget.dataset.web){
								wx.navigateTo({
											url: '/pages/web/web?url='+e.currentTarget.dataset.web.url,
								})
					}
		},
		//跳转搜索
		gotoserach(){
			wx.navigateTo({
				url: '/pages/search/search',
			})
		},
		onShareAppMessage() {
					return {
								title: JSON.parse(config.data).share_title,
								imageUrl: JSON.parse(config.data).share_img,
								path: '/pages/index/index'
					}
		},
		//展示提示
		showtip(){
			this.setData({
				showtip:!this.data.showtip
			})
		},
		//只看本校区
		onlycampus(){
			this.setData({
				onlycampus:!this.data.onlycampus
			})
		},
		//不看求购
		onlysell(){
			this.setData({
				onlysell:!this.data.onlysell
			})
		}
})