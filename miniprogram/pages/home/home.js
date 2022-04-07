const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({
      data: {
            sort: JSON.parse(config.data).sort,
            scrollTop: 0,
            nomore: false,
            list: [],
            key:'',
            userinfo:'',
            islogin:false,
            currentList : 0
      },
      onLoad() {
            this.getbanner();
            this.getList();
      },
      //监测屏幕滚动
      onPageScroll: function(e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      onChange(e){
            this.setData({
                  key: e.detail,
            });
      },
      //获取搜索关键字
      keyInput(e) {
            this.data.key = e.detail
      },
      //跳转搜索页
      search(e) {
            console.log(e)
            wx.navigateTo({
                  url: '/pages/search/search?key=' + e.detail
            })
      },
      onShow(){
            let user =wx.getStorageSync('userinfo')
            this.setData({
              userinfo:user,
              islogin:false
            })
            if(this.data.userinfo!=''){
                  this.setData({
                        islogin:true
            })
      }},

      //获取当前标签页
      gettab(e){
            //0表示通用商品
            let c = e.detail.index;
            if (c==0){
                  this.getList();
                  this.onShow()
            } 
            //1表示同专业号推荐商品
            else if(c==1){
                  let major = this.data.userinfo.MajorID;
                  this.getkindList(major),
                  this.onShow()
            }
            //其余表示该品类的商品
            else{
                  this.getkindList(c),
                  this.onShow()
            }
      },
      //获取某类商品
      getkindList(e) {
            let that = this;
            db.collection('publish').where({
                  status: 0,
                  sortid: e,
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

      //获取全部商品
      getList() {
            let that = this;
            //一会儿加上本校区优选
            db.collection('publish').where({
                  status: 0,
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
            this.getList();
      },
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //跳转详情
      detail(e) {
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
            })
      },
      //获取轮播
      getbanner() {
            let that = this;
            db.collection('banner').where({}).get({
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
      onShareAppMessage() {
            return {
                  title: JSON.parse(config.data).share_title,
                  imageUrl: JSON.parse(config.data).share_img,
                  path: '/pages/start/start'
            }
      },

})