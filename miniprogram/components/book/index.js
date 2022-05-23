
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
		//获取图书详情
		querybook(e){
			console.log(e)
			let that = this;
			db.collection('books').where({
				isbn:e
			}).get().then(res=>{
				that.setData({
					bookinfo:res.data[0]
				})
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