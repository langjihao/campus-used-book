
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Component({

  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
		isbn:String,
		islink:{
			type:Boolean,
			value:true
		}
  },

  pageLifetimes:{
    show(){
    },
  },
  lifetimes: {
    attached() {
			this.querybook(this.properties.isbn)
    },
    detached() {
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
		//查询书籍详情
		querybook(isbn) {
			let that = this;
			wx.cloud.callFunction({
				name:"books",
				data:{
					isbn:isbn
				},
				success(res){
					that.setData({
						bookinfo:res.result
					})
				}
			})
		},
		//跳转该书合集
		gobook(){
			wx.navigateTo({
				url: '/pages/collection/collection?type=1&isbn='+this.properties.isbn
			})
		}
	},
})