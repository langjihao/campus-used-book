
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Component({

  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
		id:String,
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
			console.log(this.properties.id)
			this.queryitem()
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
		//获取商品详情
		queryitem(){
			let that = this;
			db.collection('publish').doc(this.properties.id).get().then(res=>{
				console.log(res)
				that.setData({
					iteminfo:res.data
				})
				})
		},
		//跳转详情
		detail() {
			wx.navigateTo({
					url: '/pages/detail/detail?scene=' + this.properties.id,
			})
		},
		},
})