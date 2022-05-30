
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Component({

  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
		tag:{
			type:Array,
			value:[]
		},
		word:String
  },

  pageLifetimes:{
    show(){
    },
  },
  lifetimes: {
    attached() {
			this.setData({
				selected:this.properties.tag
			})
			this.aitag(this.properties.word)
			this.getusertag()
    },
    detached() {
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
		unselected:["全新","有笔记","仅拆封","做了几页"],
		selected:[]
  },
  /**
   * 组件的方法列表
   */
  methods: {
		//获取用户身份关联标签
		getusertag(){
			let user = wx.getStorageSync('userinfo');
			let major = user.major;
			let school = user.school;
			this.setData({
				unselected : this.data.unselected.concat([major,school])
			})},
		//根据用户输入的文字识别标签
		aitag(text){
			let that=this;
			wx.cloud.callFunction({
				name:"aitag",
				data:{
					text:text
				},
				success(res){
					that.setData({
						unselected:that.data.unselected.concat(res.result.aitag)
					})
				}
			})

		},
		//选中标签
		select(e){
			let that = this;
			if(that.data.selected.length==5){
				wx.showToast({
					icon:'none',
					title: '选的够多了',
				})
				return
			}
			let unselected = that.data.unselected;
			let selected = that.data.selected.concat(e.currentTarget.dataset.key);
			for(var i=0;i<unselected.length;i++){
				if(unselected[i]==e.currentTarget.dataset.key){
					unselected.splice(i,1)
				}
			}
			var temp = selected.filter(function(element,index,self){
				return self.indexOf(element) === index;});
			that.setData({
				selected:temp,
				unselected:unselected
			})
		},
		//取消标签
		cancel(e){
			let that = this;
			let selected = that.data.selected;
			let unselected = that.data.unselected.concat(e.currentTarget.dataset.key);
			for(var i=0;i<selected.length;i++){
				if(selected[i]==e.currentTarget.dataset.key){
					selected.splice(i,1)
				}
			}
			var temp = unselected.filter(function(element,index,self){
				return self.indexOf(element) === index;});
			that.setData({
				unselected:temp,
				selected:selected
			})
		},
		//获取自定义标签的输入
		tagInput(e){
			this.data.key = e.detail
		},
		//添加自定义标签
		add(){
			let that = this;
			if(that.data.selected.length==5){
				wx.showToast({
					icon:'none',
					title: '选的够多了',
				})
				return
			}
			let selected = this.data.selected.concat(that.data.key);
			var temp = selected.filter(function(element,index,self){
				return self.indexOf(element) === index;});
			this.setData({
				selected:temp,
				key:''
			})
		},
		//确认
		confirm(){
			this.triggerEvent('settag',this.data.selected)
		}
		},
		
})