const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            list: [],
            page: 1,
            scrollTop: 0,
            nomore: false,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            wx.showLoading({
                  title: '加载中',
            })
            let openid = wx.getStorageSync('openid');
            this.setData(
                  {_openid:openid}
            )
            this.getList();
      },
      getList() {
            let that = this;
            db.collection('publish').where({
									_openid: that.data._openid,
									type:1
            }).orderBy('creat', 'desc').limit(20).get({
                  success: function(res) {
                        wx.hideLoading();
                        wx.stopPullDownRefresh(); //暂停刷新动作
                        that.setData({
                              list: res.data,
                              nomore: false,
                              page: 0,
                        })
                        console.log(res.data)
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
                                          wx.showToast({
                                                title: '成功删除',
                                          })
                                          that.editcart(del._id,4)
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({
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
                                          wx.showToast({
                                                title: '成功擦亮',
                                          })
                                          that.getList();
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({
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
                                          wx.showToast({
                                                title: '成功',
                                          })
                                          that.editcart(crash._id,2)
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({
                                                title: '操作失败',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //售出\删除后对购物车记录进行修改
      editcart(id,flag){
        let that =this;
        db.collection('cart').where({
          itemid : id,
          }).update({
            data:{status:flag},
          success(res){
            console.log(res)
            that.getList();
          },
          fail(res){
            console.log(res)
            that.getList();
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
            this.getList();
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
            this.more();
      },
      //加载更多
      more() {
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                  return false
            }
            let page = that.data.page + 1;
            db.collection('publish').where({
									_openid: that.data._openid,
									
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
})