const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            scrollTop: 0,
            newlist: [],
            list: [],
            key: '',
            blank: false,
            nomore:false,
            switchTitle1: '全部商品',
            switchTitle2: '排序',
            itemTitle: '筛选',
            option1: [
              { text: '崂山校区', value: 0 },
              { text: '四方校区', value: 1 },
            ],
            value1: 0,
      },
      onLoad: function(e) {
            if(e){
                  this.setData({
                        key:e.key
                  })
                  this.search()    
            }
            else{
                  this.getnew();
            }
      },
      //同学都在搜
      //跳转详情
      detail(e) {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
            })
      },
      //搜索结果
      search() {
            let that = this;
            let key = that.data.key;
            if (key == '') {
                  wx.showToast({
                        title: '请输入关键词',
                        icon: 'none',
                  })
                  return false;
            }
            wx.setNavigationBarTitle({
                  title:'"'+ that.data.key + '"的搜索结果',
            })
            wx.showLoading({
                  title: '加载中',
            })
            db.collection('publish').where({
                  status: 0,
                  key: db.RegExp({
                        regexp: '.*' + key + '.*',
                        options: 'i',
                  })
            }).orderBy('creat', 'desc').limit(20).get({
                  success(e) {
                        wx.hideLoading();
                        that.setData({
                              blank: true,
                              page: 0,
                              list: e.data,
                              nomore: false,
                        })
                  }
            })
      },
      onReachBottom() {
            this.more();
      },
      //获取输入的关键词
      keyInput(e) {
            this.data.key = e.detail
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll: function (e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      //加载更多
      more() {
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                  return false
            }
            let page = that.data.page + 1;
            if (that.data.sortCur == -2) {
                  var sortid = _.neq(-2); //除-2之外所有
            } else {
                  var sortid = that.data.sortCur + '' //小程序搜索必须对应格式
            }
            db.collection('publish').where({
                  status: 0,
                  key: db.RegExp({
                        regexp: '.*' + that.data.key + '.*',
                        options: 'i',
                  })
            }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
                  success: function (res) {
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