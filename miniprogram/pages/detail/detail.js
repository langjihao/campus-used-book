
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
						morepub:false,
						height:[]
      },
      onLoad(e){
					this.data.id = e.scene;
					this.getPublish(e.scene);
					this.incview();
      },
			//浏览量+1
			incview(){
				wx.cloud.callFunction({
					name:"view",
					data:{
						id:this.data.id
					},})
			},
      //获取发布信息
      getPublish(e) {
            let that = this;
            db.collection('publish').doc(e).get({
                  success: function(res) {
                        that.setData({
                              iteminfo: res.data
												})
												if(res.data.type==0||res.data.type==1){
													that.getmorepub(res.data._openid)
												}
                  },
                  fail(res){
                        wx.showModal({
                              cancelColor: 'cancelColor',
                              content:'该商品已被卖家删除，快去看看其他宝贝吧',
                              confirmText:'好滴吧',
                              cancelText:"还能咋地",
                              cancelColor: 'cancelColor',
                              success(res) {
                              if (res.confirm) {
                              
                              wx.navigateBack({})
                  
                              } else {
                  
                              wx.navigateBack({})
                              }}
                            })
                  }
            })
      },
			//复制联系方式
			copy(e){
				var Q=e.currentTarget.dataset.detail.toString()
				wx.setClipboardData({
					data: Q,
					success: res => {
								wx.showToast({icon:"none",
											title: '复制成功',
											icon: 'success',
											duration: 1000,
								})
					},
					fail(res){
						console.log(res)
					}
		})
			},
      //回到首页
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
      //点击图片预览
      picview(e){
            var that = this;
            var src = e.currentTarget.dataset.src;
            var piclist=[]
            var imgList = that.data.iteminfo.piclist;
            for(var i=0;i<imgList.length;i++){
                  piclist.push(imgList[i])
            }
            wx.previewImage({
                  current: src, // 当前显示图片的http链接
                  urls: piclist // 需要预览的图片http链接列表
            })
      },
      //获取该发布人更多商品
      getmorepub(e){
            let that = this;
            db.collection('publish').where({
                  _openid: e
            }).limit(6).get({
                  success(res) {
                        if(res.data.length<=1){}
                        else{
													let list=res.data;
													//用于去掉本商品
													for(var i=0;i<list.length;i++){
														if(list[i]._id==that.data.id){
														 list.splice(i,1)
														}
													}
													that.setData({
													morepublist: list,
													morepub:true
												})
											}
                  },
                  fail(res){
                        console.log(res)
                  }
            })
			},
      //跳转到购物车页面
      navitocart(){
            wx.switchTab({
                  url: '/pages/cart/cart',
            })
      },
      //展示用户实名状态
      showauth(){
            wx.showToast({icon:"none",
              title: '该用户已实名认证',
            })
      },
      //跳转详情
      detail(e) {
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
            })
      },
      //添加到购物车
      add(){
            this.setData({
              iscart:true,
              cartnum:this.data.cartnum+1
            })
            db.collection('cart').add({
                  data:{
												status : this.data.iteminfo.status,
                        itemid : this.data.id,
                        pic : this.data.iteminfo.piclist[0],
                        sellerpic : this.data.iteminfo.avatar,
												sellername: this.data.iteminfo.nickName,
												selleropenid:this.data.iteminfo._openid,
                        price : this.data.iteminfo.price,
												title : this.data.iteminfo.title,
                        creat : new Date().getTime()
                  },
                  success(res){
                        wx.showToast({icon:"none",
                          title: '添加成功',
                        })
                  },
                  fail(res){
                        console.log(res)
                  }
            })
      },
      //从购物车删除
      delete(){
        let that = this;
        db.collection('cart').where({
                itemid : this.data.id,
          }).remove({
          success(res){
            that.setData({
              iscart:false,
              cartnum:that.data.cartnum-1
            })
          },
          fail(res){
                console.log(res)
          }
    })
      }, 
      //判断购物车商品数量并判断当前商品是否在购物车中
      judgecart(){
        let that =this;
        db.collection('cart').where({
          _openid : that.data.userinfo._openid,
          }).get({
          success(res){
            var flag = false;
            for(var i=0;i<res.data.length;i++){
              if(res.data[i].itemid==that.data.id){
                var flag = true;
              }
            }
            that.setData({
              cartnum:res.data.length,
              iscart:flag
            })
          },
          fail(res){
            console.log(res)
          }
        })
      },
      //生成分享相关内容
      onShareAppMessage() {
            return {
                  title: this.data.iteminfo.title,
                  path: '/pages/detail/detail?scene=' + this.data.iteminfo._id,
            }
			},
			//聊一聊
			startchat(){
				let that=this;
				wx.cloud.callFunction({
					name:"chat",
					data:{
						id:that.data.id,
						selleropenid:that.data.iteminfo._openid,
					},
					success(res){
						console.log(res)
						wx.navigateTo({
							url: '/pages/chat/chat?scene='+res.result
						})
					},
					fail(res){
						console.log(res)
					}
				})
			},
      onShow(){
				this.setData({
					userinfo : wx.getStorageSync('userinfo'),
					})
				if(this.data.userinfo){
				this.judgecart();
			}
		  },
			//修改
			modify(){
        wx.navigateTo({
          url: '/pages/modify/modify?scene=' + this.data.id
        })
			},
			//查看发布者更多商品
			gouser(){
				wx.navigateTo({
					url: '/pages/collection/collection?type=3&openid='+this.data.iteminfo._openid
				})
			},
			//查看标签更多商品
			gotag(e){
				console.log(e)
				wx.navigateTo({
					url: '/pages/collection/collection?type=2&tag='+e.currentTarget.dataset.tag
				})
			},
			goheight(e){
					const { height } = this.data;
					var width = wx.getSystemInfoSync().windowWidth
					var imgheight = e.detail.height
					var imgwidth = e.detail.width
					var he = width * imgheight / imgwidth
					height.push(he)
					this.setData({
						swiperheight:this.data.height[0]
					})
			},
			changeheight(e){
				this.setData({
					swiperheight:this.data.height[e.detail.current]
				})
	}

    })
