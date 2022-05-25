const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
const config = require("../../config.js");

Page({
  data: {
		InputBottom: 0,
		showusual:false,
		focus:false
	},
	//键盘弹起，输入框调节
  InputFocus(e) {
    this.setData({
			InputBottom: e.detail.height,
			focus:true
    })
	},
		//跳转详情
		detail(e) {
			wx.navigateTo({
						url: '/pages/detail/detail?scene=' + this.data.iteminfo.itemid,
			})
		},
	//键盘关闭
  InputBlur(e) {
    this.setData({
			InputBottom: 0,
			focus:false
    })
	},
	onLoad(e){
		let that = this;
			this.setData({
				roomId:e.scene
			})
			db.collection("chatlist").doc(e.scene).get().then(res=>{
					console.log(res)
					if(res.data.buyeropenid==wx.getStorageSync('openid')){
						var usual = JSON.parse(config.data).buy;
					}
					else{
						var usual = JSON.parse(config.data).sell
					}
					that.setData({
						iteminfo:res.data,
						usual:usual,
					})
				}
			);
			
	},
	//选择图片
	selectImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
						var bufferData = res.data;
            wx.showLoading()
            wx.cloud.callFunction({
              name: 'chatpush',
              data: {
                roomId:that.data.roomId,
                msgType: 'image',
                content: bufferData
              },
              success: res => {
                console.log(res)
                if (res.result.code == 300) {
                  that.setData({
                    errMsg: res.result.msg
                  })
                }
              },
              fail: res => {
                console.log(res)
              },
              complete: res => {
                this.setData({
                  content: ''
                })
                wx.hideLoading();
              }
            })
          }
        })
      }
    })
  },
	//发送
  async submit() {
		var that = this;
		this.setData({
			focus:true
		})
      wx.cloud.callFunction({
        name: 'chatpush',
        data: {
          roomId:that.data.roomId,
          msgType: 'text',
          content: that.data.content
        },
        success: res => {
          if (res.result.code == 300) {
            that.setData({
              errMsg: res.result.msg
            })
          }
        },
        complete: res => {
          this.setData({
            content: ''
          })
        }
      })
	},
	//返回上一层
	back(){
		wx.navigateBack()
	},
	//弹出常用语选择框
	showusual(){
		this.setData({
			showusual:!this.data.showusual
		})
	},
	//点击常用语发送
	OnSelect(e){
		console.log(e)
		this.setData({
			content:e.detail.name
		})
		this.submit()
	}
})