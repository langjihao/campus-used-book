
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
		showtype: {
			type:Number,
			value:1
		},
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
  }
})