const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;

Page({
  data: {
    nomore:false,
    islogin:false
  },
	//跳转聊天
	gochat(e){
		console.log(e)
		wx.navigateTo({
			url: '/pages/chat/chat?scene=' + e.currentTarget.dataset.id
		})
	},
  //获取用户聊天列表
  getchatlist(){
    let that = this;
    db.collection('chatlist').where({
      members:that.data.userinfo._openid,
    }).limit(20).get({
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
    db.collection('chatlist').where({
          status: 0,
    }).orderBy('update', 'desc').skip(page * 20).limit(20).get({
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
                wx.showToast({icon:"none",
                      title: '获取失败',
                      icon: 'none'
                })
          }
    })
  },
  onReachBottom() {
  this.more();
  },
  //下拉刷新
  onPullDownRefresh() {
  this.getchatlist();
  },
  gotop() {
  wx.pageScrollTo({
      scrollTop: 0
  })
  },
  //跳转详情
  detail(e) {
    wx.navigateTo({
        url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.detail,
    })
  },
  onShow(){
		let user =wx.getStorageSync('userinfo')
    if(user){
    this.setData({
      userinfo:user,
      islogin:true,
    })}
    this.getchatlist()
  },
  //删除购物车商品
  delete(e){
    let that = this;
    console.log(e.currentTarget.dataset.detail)
    db.collection('cart').doc(e.currentTarget.dataset.detail).remove({
      success() {
        wx.showToast({icon:"none",
              title: '成功删除',
        })
        that.getcartlist();
      },
      fail() {
        wx.hideLoading();
        wx.showToast({icon:"none",
              title: '删除失败',
              icon: 'none'
        })
  }
    })
	},
})