// pages/quickpublish/quickpublish.js
import Card from '../../palette/template';
const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({
  
  data: {
		tag:[],
		showtag:false,
		showcampus:false,
		confirm:false,
		showposter:false,
		showmore:false,
    flag:1,
		isbn:0,
		title:"",
    show:false,
    isQQ:false,
    isWX:false,
    price:5,
    kind:0,
    sorted:"通用",
    method:2,
    count:0,
    fileList: [], //预览图列表
    piclist:[],//实际上传的fileid列表
		sort:JSON.parse(config.data).sort1,
		campuslist:JSON.parse(config.data).campus
  },
  //初始化重新发布
  initial(){
    this.setData({
			tag:[],
			showtag:false,
			showcampus:false,
			confirm:false,
			showposter:false,
			showmore:false,
			flag:1,
			isbn:0,
			title:"",
			show:false,
			isQQ:false,
			isWX:false,
			price:5,
			kind:0,
			sorted:"通用",
			method:2,
			count:0,
			fileList: [], //预览图列表
			piclist:[],//实际上传的fileid列表
			sort:JSON.parse(config.data).sort1,
			campuslist:JSON.parse(config.data).campus
    })

	},
	//是否展开更多信息框
	changeshowmore(){
		this.setData({
			showmore:!this.data.showmore
		})
	},
  //跳转详情
  detail(e){
    wx.navigateTo({
      url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
})
  },
  //弹出分类界面
  showPopup() {
    this.setData({ show: !this.data.show });
  },
  //切换商品类别
  choosesort(e){
    this.setData({
      sorted:e.detail.value,
      kind:e.detail.index
    })
	},
	confirmsort(e){
		this.setData({
			sorted:e.detail.value,
			kind:e.detail.index,
			show: !this.data.show
	})  	
	},
  //是否勾选联系方式
  onQQ(e){
    if(this.data.userinfo.QQ||this.data.QQ){
      this.setData({
      isQQ:!this.data.isQQ
    })}else{
      wx.showToast({icon:"none",
        title: 'QQ为空',
      })
    }
  },
  onWX(e){
    if(this.data.userinfo.WX||this.data.WX){
      this.setData({
      isWX:!this.data.isWX
    })}else{
      wx.showToast({icon:"none",
        title: '微信为空',
      })}
  },
  //更改联系方式
  qqInput(e){
    console.log(e)
    this.setData({
      QQ:e.detail,
  })
  },
  wxInput(e){
    this.setData({
    WX:e.detail,
  })
	},
	//展示校区选项
	showcampus(){
		this.setData({ showcampus: !this.data.showcampus });
	},
	//改变校区
	choosecampus(e){
		this.setData({
			campus:e.detail.value
	})     

	},
	confirmcampus(e){
		this.setData({
			campus:e.detail.value,
			showcampus: !this.data.showcampus
	})   
	},
  //切换取货方式
  changemethod(e){
  this.setData({
    method: parseInt(e.detail),
  });
	},
  //获取地理位置
  getlocation(){
          let that = this;
          wx.getSetting({
            withSubscriptions: true,
            success(res){
                  console.log(res)
            }
          })
          wx.chooseLocation({

            success(res){
                  console.log(res)
                  that.setData({
                      place:res.name,
                  })
            },
            fail(res){
                  wx.showToast({icon:"none",
                    title: '请选择或输入地址',
                  })
            }
          })
  },
  //地址输入
  placeInput(e) {
        this.setData({
              place:e.detail.value,
        })
  },
  //价格输入
  changeprice(e){
    this.setData({
      price:e.detail
    })
  },
  //每次上传图片后，缓存图片
  afterRead(event) {
    let that = this;
    const { fileList = [] } = that.data;
		fileList.push({url: event.detail.file.url,sign:1});
    that.setData({ fileList });
  },
  //删除图片
  delete(event){
    for (let i = 0; i < this.data.fileList.length; i++) {
      if (this.data.fileList[i].index==event.detail.file.index){
        this.data.fileList.splice(i,1);
        this.setData({
          fileList:this.data.fileList
        })
      }
  }
  },
  //上传图片
  upload(){
    let that=this;
    const { fileList } = this.data;
    if (!fileList.length) {
    wx.showModal({
      title:"提示",
      content:"上传宝贝图片更易卖出嗷",
      confirmText:'我意已决',
      cancelText:"容我想想",
      cancelColor: 'cancelColor',
      success(res) {
        if (res.confirm) { 
					wx.showLoading({
						title: '正在上传',
					})    
          that.publish();
        } else {
          return
        }}
    });
  } else {
		wx.showLoading({
			title: '正在上传',
		})    
    const uploadTasks = fileList.map((file) => 
    this.uploadFilePromise(that.data.userinfo.UID+new Date().getTime()+`item.png`, file));
    Promise.all(uploadTasks)
      .then(data => {
        const newFileList = data.map(item => (item.fileID));
        that.setData({
          piclist:that.data.piclist.concat(newFileList)
        })
        that.publish();

      })
      .catch(e => {
        console.log(e);
      });
  }
  },
  //上传图片
	uploadFilePromise(fileName, chooseResult) {
		if(chooseResult.sign==0){
			return({fileID:chooseResult.url})
		}else{
  return wx.cloud.uploadFile({
    cloudPath: fileName,
    filePath: chooseResult.url
  });}
  },
  //发布商品,上传数据库
  publish() {
    let that = this;
    db.collection('publish').add({
          data: {
								creat: new Date().getTime(),
								type:0, 
								status: 0, 
								isQQ:that.data.isQQ,
								isWX:that.data.isWX,
								QQ:that.data.QQ,
								WX:that.data.WX,
                price: that.data.price, 
                kind: that.data.kind, 
                method: that.data.method,
                place: that.data.place,
                title:that.data.title,
                isbn:that.data.isbn,
                piclist:that.data.piclist,
                tag:that.data.tag,
                campus:that.data.campus,
                avatar:that.data.userinfo.avatarUrl,
                nickName:that.data.userinfo.nickName,
                },
          success(e) {
								wx.hideLoading()
                that.setData({
                  flag:2,
                  id:e._id
                })
          },})
  },
  //检查信息是否完善,补齐一些信息
  check(){
    if(this.data.method==2){
      this.setData({
        place:this.data.userinfo.campus
      })
		};
		if(this.data.title==''){
			wx.showToast({icon:"none",
				title: '您还没有填写内容',
			})
			return
		}
    if(!(this.data.isQQ||this.data.isWX)){
      wx.showToast({icon:"none",
        title: 'QQ微信选一个呦',
      })
      return
    }
    else if(this.data.userinfo.QQ!=this.data.QQ||this.data.userinfo.WX!=this.data.WX){
      this.setData({
				findchange:true
			})

    }
    else{
      console.log(1)
      this.upload()
    }
  },
  //获取输入的商品信息
  infoInput(e){
    this.setData({
      title : e.detail.value,
      count : e.detail.value.length
    })
  },
  //打开摄像头扫码isbn
  scan() {
    let that = this;
    wx.scanCode({
          onlyFromCamera: false,
          scanType: ['barCode'],
          success: res => {
                wx.showToast({icon:"none",
                      title: '扫码成功',
                      icon: 'success'
                });
                that.setData({
                      isbn: res.result
                });
                that.checkisbn();
          },
          fail() {
                wx.showToast({icon:"none",
                      title: '扫码失败，请重新扫码',
                      icon: 'none'
                })
          }
    })
  },
  //校验isbn
  checkisbn() {
      let that = this;
      let isbn = that.data.isbn;
      if (!(/978[0-9]{10}/.test(isbn))) {
            wx.showToast({icon:"none",
                  title: '请检查您的isbn号',
                  icon: 'none'
            });
            return false;
      }
      that.get_book(isbn);
  },
	//查询书籍详情
  get_book(isbn) {
        let that = this;
        wx.showLoading({
              title: '正在获取'
        })
				wx.cloud.callFunction({
					name:"books",
					data:{
						isbn:isbn
					},
					success(res){
						that.setData({
							bookinfo:res.result
						})
						that.fill()
					}
				})
  },
  //扫码后自动填充相关信息
  fill(){
    let bookinfo=this.data.bookinfo;
    let userinfo=this.data.userinfo;
    this.setData({
      title:"出一本"+bookinfo.publisher+"的"+bookinfo.title+",第"+bookinfo.edition,
      price:0.5*parseFloat(bookinfo.price),
      fileList:this.data.fileList.concat({url:bookinfo.pic,sign:0})
		})
		wx.hideLoading()
	},
  onLoad() {
		let user =wx.getStorageSync('userinfo')
    this.setData({
			campus:user.campus,
			userinfo:user,
			QQ:user.QQ,
			WX:user.WX,
			isQQ:user.QQ!='',
			isWX:user.WX!=''
		})
	},
	//生成海报
	makecanvas(){
		wx.showLoading()
		let params={
			"avatar": this.data.userinfo.avatarUrl,      
			"nickName": this.data.userinfo.nickName,      
			"title": this.data.title,      
		};
		this.setData({
			template: new Card().palette(params)
		})
	},
	//海报生成成功
	onImgOK(e){
		this.setData({
			shareImage:e.detail.path,
			showposter:true
		});
		wx.hideLoading({})
	},
	//长按保存海报
	savepic(){
		wx.saveImageToPhotosAlbum({
				filePath: this.data.shareImage,
				success: (res) => {
						wx.showToast({icon:"none",
								title: '已保存到相册',
						})
					}})
	},
	//弹出确认联系方式框
	showconfirm() {
		this.setData({confirm: !this.data.confirm });
	},
	//确认标签
	showtag(){
		if(this.data.title==''){
			wx.showToast({
				icon:"none",
				title:'请先输入商品信息',
			})
			return false
		}
		this.setData({
			showtag:!this.data.showtag
		})
	},
	settag(e){
		this.setData({
			tag:e.detail,
			showtag:false
		})
	}
})