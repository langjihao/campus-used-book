// pages/cart/cart.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  onShow: function () {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})