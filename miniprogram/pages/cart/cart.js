// pages/cart/cart.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
		Tab:["宝贝","聊天"],
		TabCur: 0,
    scrollLeft:0,
    nomore:false,
    islogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user =wx.getStorageSync('userinfo')
    if(user){
    this.setData({
      userinfo:user,
      islogin:true,
    })}

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

	},
	//页面切换
	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },

  //获取用户加购的商品
  getcartlist(){
    let that = this;
    db.collection('cart').where({
      _openid:that.data.userinfo._openid,
    }).orderBy('creat', 'desc').limit(20).get({
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
    db.collection('publish').where({
          status: 0,
    }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
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
  onReachBottom() {
  this.more();
  },
  //下拉刷新
  onPullDownRefresh() {
  this.getcartlist();
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
    this.getcartlist()
  },
  //删除购物车商品
  delete(e){
    let that = this;
    console.log(e.currentTarget.dataset.detail)
    db.collection('cart').doc(e.currentTarget.dataset.detail).remove({
      success() {
        wx.showToast({
              title: '成功删除',
        })
        that.getcartlist();
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
              title: '删除失败',
              icon: 'none'
        })
  }
    })
	},
	//获取聊天列表
	getchatlist(){
	},
	// ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
	// 创建聊天房间
	startchat(e){
		console.log(e)
	}
})