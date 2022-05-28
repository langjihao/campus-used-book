// pages/collection/collecttion.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
		showtype:1,
		skip:0,
		nomore:false,
		list:[]
	},
	onLoad(e){
		if(e.type=="3"){
			this.setData({
				type:3,
				openid:e.openid
			})
			this.queryuser()
		}
		else if(e.type=="2"){
			this.setData({
				type:2,
				tag:e.tag
			})
			this.querytag()
		}
		else{
			this.setData({
				type:1,
				isbn:e.isbn
			})
			this.querybook()


		}
	},
	//查询某本书
	querybook(){
		let that = this;
		this.setData({
			type:1,
			query:{
				isbn:this.data.isbn,
				status:0
			}
		
		})
		this.querylist()
	},
	//查询某用户的发布
	queryuser(){
		let that = this;
		this.setData({
			type:3,
			query:{
				_openid:this.data.openid,
				status:0
			}
		})
		db.collection('user').doc(that.data.openid).get({
			success(res){
				that.setData({
					avatarUrl:res.data.avatarUrl,
					nickName:res.data.nickName
				})
				wx.setNavigationBarTitle({
					title: res.data.nickName+'的更多发布',
				})
				that.querylist()
			}
		})
	},
	//查询某个标签
	querytag(){
		this.setData({
			type:2,
			query:{
				tag:this.data.tag,
				status:0
			}
		})
		wx.setNavigationBarTitle({
			title: this.data.tag+'的更多相关发布',
		})
		this.querylist()
	},
	//调用查询云函数
	querylist(){
		let that=this;
		wx.cloud.callFunction({
			name:"querylist",
			data:{
				skip:that.data.skip,
				query:that.data.query,
			},
			success(res){
				console.log(res)
				that.setData({
					list:that.data.list.concat(res.result.data)
				})
				if(res.result.data.length<20){
					that.setData({
						nomore:true
					})
				}
			},
			fail(err){
				console.log(err)
			}
		})
	},
	//跳转详情
	detail(e){
		wx.navigateTo({
					url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
		})
	},
	//获取更多
	onReachBottom(){
		if(this.data.nomore){
			return
		}
		this.setData({
			skip:this.data.skip+1
		})
		this.querylist()
	},
	//排序方式设定--时间、价格、热度
	sortby(){

	}
})