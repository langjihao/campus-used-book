// pages/explore/explore.js
const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		barheight:app.globalData.CustomBar,
		scrollTop: 0,
		nomore:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
	copy(e){
		console.log(e)
		var Q=e.currentTarget.dataset.detail.toString()
		wx.setClipboardData({
			data: Q,
			success: res => {
						wx.showToast({
									title: '复制QQ成功',
									icon: 'success',
									duration: 1000,
						})
			},
			fail(res){
				console.log(res)
			}
})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		this.getlist();
  },
  //获取群发布消息
  getlist(){
    let that = this;
    db.collection('QQ').orderBy('time', 'desc').limit(20).get({
      success: function(res) {
            wx.stopPullDownRefresh(); //暂停刷新动作
            if (res.data.length == 0) {
                  that.setData({
                        nomore: true,
                        list: [],
                  })
                  return false;
            }
            if (res.data.length < 20) {
                  that.setData({
                        nomore: true,
                        page: 0,
                        list: res.data,
                  })
            } else {
                  that.setData({
                        page: 0,
                        list: res.data,
                        nomore: false,
                  })
            }
      }
})
	},
  //加载更多
  more() {
    let that = this;
    if (that.data.nomore || that.data.list.length < 20) {
          return false
    }
    let page = that.data.page + 1;
    db.collection('QQ').orderBy('time', 'desc').skip(page * 20).limit(20).get({
          success: function(res) {
                if (res.data.length == 0) {
                      that.setData({
                            nomore: true
                      })
                      return false;
                }
                if (res.data.length < 20) {
                      that.setData({
                            nomore: true
                      })
                }
                that.setData({
                      page: page,
                      list: that.data.list.concat(res.data)
                })
          },
          fail() {
                wx.showToast({
                      title: '获取失败',
                      icon: 'none'
                })
          }
    })
	},
	//触底事件
  onReachBottom() {
  this.more();
  },
  //下拉刷新
  onPullDownRefresh() {
  this.getlist();
	},
	//检测屏幕滚动
	onPageScroll(e){
		this.setData({
					scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
		})
	},
	//回顶
  gotop() {
  wx.pageScrollTo({
      scrollTop: 0
  })
	},
		//页面切换
		tabSelect(e) {
			this.setData({
				TabCur: e.currentTarget.dataset.id,
				scrollLeft: (e.currentTarget.dataset.id-1)*60
			})
		},
	
	})