
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
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
		list: Array,
		nomore:Boolean,
  },
  /**
   * 组件注册页面生命周期
   */
  pageLifetimes:{
    show(){
    },
  },
  lifetimes: {
    attached() {
			this.setData({
				userinfo:wx.getStorageSync('userinfo')
			})
			
    },
    detached() {

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
		onlycampus:false,
		onlysell:false,
		showtype:0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
		//处理数组，分为两列
		handleArray(arr) {
			let operateArr = []
			console.log(2)
			for (let i = 0; i < 2; i++) {
				operateArr.push([])
			}
			for (let i = 0, j = 0; i < arr.length; i++) {
				if (j < 2) {
					operateArr[j].push(arr[i])
					j++
				} else {
					j = 0
					operateArr[j].push(arr[i])
					j++
				}

			}
			console.log("处理后的数组：", operateArr)
			return operateArr
		},
		//跳转详情
		detail(e) {
			wx.navigateTo({
						url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
			})
		},
		//只看本校区
		onlycampus(){
			if(this.data.userinfo){
			this.setData({
				onlycampus:!this.data.onlycampus
			})}
			else{
				wx.showToast({icon:"none",
					title: '未登录，不可用',
				})
			}
		},
		//不看求购
		onlysell(){
			this.setData({
				onlysell:!this.data.onlysell
			})
		},
		//改变显示布局
		changeshowtype(){
			if(this.data.showtype==0){
				this.setData({
					showtype:1
				})
			}
			else{
				this.setData({
					showtype:0
				})
			}
		},
		//查看标签更多商品
		gotag(e){
			console.log(e)
			wx.navigateTo({
				url: '/pages/collection/collection?type=2&tag='+e.currentTarget.dataset.tag
			})
		},
		//查看发布者更多商品
		gouser(e){
			console.log(e)
			wx.navigateTo({
				url: '/pages/collection/collection?type=3&openid='+e.currentTarget.dataset.id
			})
		},
  }
})