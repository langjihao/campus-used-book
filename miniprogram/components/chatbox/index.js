
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var messageWatcher = null;
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    roomId: {
      type: String,
      observer: function (newVal, oldVal) {
        if (newVal != undefined && newVal != null) {
          this.initWatcher(newVal)
        }

      }
    }
  },
  /**
   * 组件注册页面生命周期
   */
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
  },
  lifetimes: {
    attached() {
      var that = this;
      that.initMessageHistory();
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            systemInfo: res
					})
        }
      })
    },
    detached() {
      try {
				this.messageWatcher.close()
				console.log("关闭成功")
      } catch (error) {
        console.log('--消息监听器关闭失败--')
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    openid:wx.getStorageSync('openid'),
    scrollId: '',
    systemInfo: {},
    //消息记录列表
    chatList: [],
    //标记触顶事件
    isTop: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    viewImage(e) {
      // console.log(e)
      let url = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: [url],
      })
    },
    //触顶事件
    tapTop() {
      var that = this;
      that.setData({
        isTop: true
      }, () => {
        this.reqMsgHis();
      })

    },
    //初始化
    initMessageHistory() {
      //初始化消息历史
      var that = this;
      that.setData({
        chatList: []
      }, () => {
        that.reqMsgHis();
      })
    },
    // 请求聊天记录
    reqMsgHis() {
			var that = this;
      wx.showLoading({
        title: '获取历史记录',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'querychathis',
        data: {
          step: that.data.chatList.length,
          roomId: that.properties.roomId
        },
        success: res => {
					console.log(res)
          let tarr = res.result.data
          let newsLen = tarr.length
          if (newsLen == 0) {
            //查无数据
            setTimeout(function () {
              wx.showToast({icon:"none",
                title: '到顶了',
                icon: 'none'
              })
            }, 300)

          }
          tarr = tarr.reverse()
          that.setData({
            chatList: tarr.concat(that.data.chatList)
          }, () => {
            let len = that.data.chatList.length
            if (that.data.isTop) {
              setTimeout(function () {
                that.setData({
                  scrollId: 'msg-' + parseInt(newsLen)
                })
              }, 100)
            } else {
              setTimeout(function () {
                that.setData({
                  scrollId: 'msg-' + parseInt(len - 1)
                })
              }, 100)
            }

          })
        },
        fail: res => {
          console.log(res)
        },
        complete: res => {
          wx.hideLoading();
        }
      })
    },
    //初始化聊天监听器
    initWatcher() {
			console.log("开启监听")
			var that = this;
      this.messageWatcher = db.collection('chat').where({
				roomId: that.properties.roomId,
      }).watch({
        onChange: function (snapshot) {
					//只打印变动的信息
          if (snapshot.docChanges.length != 0) {
						console.log(snapshot.docChanges)
            let tarr = []
            snapshot.docChanges.forEach(function (ele, index) {
              tarr.push(ele.doc)
            })
            that.setData({
              chatList: that.data.chatList.concat(tarr)
            }, () => {
              let len = that.data.chatList.length
              setTimeout(function () {
                that.setData({
                  scrollId: 'msg-' + parseInt(len - 1)
                })
              }, 100)
            })
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    }
  }
})