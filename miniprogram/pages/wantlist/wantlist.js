const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

			data: {
				list: [],
				skip: 0,
				scrollTop: 0,
				nomore: false,
				query:{
					_openid:wx.getStorageSync('openid'),
					type:1
				}
			},
			async onShow(){
				await this.querylist();
			},
			//调用查询云函数
			querylist(){
			let that=this;
			wx.cloud.callFunction({
				name:"querylist",
				data:{
					skip:that.data.skip,
					query:that.data.query,
				},
				success(res){
					console.log(res)
					that.setData({
						list:that.data.list.concat(res.result.data)
					})
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
      //删除
      del(e) {
            let that = this;
            let del = e.currentTarget.dataset.del;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确定要删除该发布吗？',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在删除'
                              })
                              db.collection('publish').doc(del._id).remove({
                                    success() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '成功删除',
                                          })
																					that.setData({
																						list:[]
																					})
																					that.querylist()
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '删除失败',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //擦亮
      crash(e) {
            let that = this;
            let crash = e.currentTarget.dataset.crash;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确定要擦亮该消息吗？',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在擦亮'
                              })
                              db.collection('publish').doc(crash._id).update({
                                    data: {
                                          creat: new Date().getTime(),
                                    },
                                    success() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '成功擦亮',
                                          })
																					that.setData({
																						list:[]
																					})
																					that.querylist()
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '操作失败',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //标记已求到
      selled(e){
            let that = this;
            let crash = e.currentTarget.dataset.crash;
            wx.showModal({
                  title: '温馨提示',
                  content: '恭喜你又收到了一件宝贝！点击确定取消求购',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在下架'
                              })
                              db.collection('publish').doc(crash._id).update({
                                    data: {
                                          status:2
                                    },
                                    success() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '成功',
                                          })
                                          that.setData({
																						list:[]
																					})
																					that.querylist()
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({icon:"none",
                                                title: '操作失败',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //查看详情
      detail(e) {
            let that = this;
            let detail = e.currentTarget.dataset.detail;
            if (detail.status == 0) {
                  wx.navigateTo({
                        url: '/pages/detail/detail?scene=' + detail._id,
                  })
            }
      },
      //跳转编辑
      modify(e){
        let that = this;
        let detail = e.currentTarget.dataset.detail;
        wx.navigateTo({
          url: '/pages/modify/modify?scene=' + detail._id
        })
      },
      //下拉刷新
      onPullDownRefresh() {
				this.setData({
					list:[]
				})
				this.queryist();
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll: function(e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      onReachBottom() {
				if(!this.data.nomore){
					this.setData({
						skip:this.data.skip+1
					})
					this.querylist()
				}
				else{
					return
				}
		},
})