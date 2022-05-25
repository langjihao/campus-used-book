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
            list: [],
						nomore:false,
						page:0,
      },
      onShow(e){
        this.gethistory();
      },
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
                  wx.showToast({icon:"none",
                        title: '请输入关键词',
                        icon: 'none',
                  })
                  return false;
            }
            wx.setNavigationBarTitle({
                  title:'"'+ that.data.key + '"的搜索结果',
						})
						//写入历史记录
            let history = that.data.hislist.concat(that.data.key);
            //去重
            var his = history.filter(function(element,index,self){
              return self.indexOf(element) === index;});
            wx.setStorageSync('history', his)
            wx.showLoading({
                  title: '加载中',
            })
            db.collection('publish').where({
                  status: 0,
                  title: db.RegExp({
                        regexp: '.*' + key + '.*',
                        options: 'i',
                  })
            }).orderBy('creat', 'desc').limit(20).get({
                  success(res) {
											if (res.data.length == 0) {
											that.setData({
														nomore: true
											})
											wx.hideLoading();
											return false;
											}
											if (res.data.length < 20) {
														that.setData({
																	nomore: true
														})
											}
                        wx.hideLoading();
                        that.setData({
                              blank: true,
                              page: 0,
                              list: res.data,
                        })
                  },})
      },
      //删除所有历史记录
      deleteall(e){
        this.setData({
          hislist:[]
        })
        wx.setStorageSync('history', this.data.hislist)
      },
      //获取历史搜索关键词
      gethistory(){
        this.setData({
          hislist:wx.getStorageSync('history')
        })      
      },
      //点击历史记录直接搜索
      onTagTap(e){
        this.setData({
          key:e.currentTarget.dataset.key
        })
        this.search()
      },
      onReachBottom() {
            this.more();
      },
      //获取输入的关键词
      keyInput(e) {
						this.data.key = e.detail
						this.setData({
							list:[],
							page:0
						})
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll(e){
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      //加载更多
      more() {
            let that = this;
            if (that.data.nomore) {
                  return false
            }
            let page = that.data.page + 1;
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
                        wx.showToast({icon:"none",
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
      },
})