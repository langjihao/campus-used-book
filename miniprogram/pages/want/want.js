// pages/quickpublish/quickpublish.js
const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({
  
  data: {
		confirm:false,
    flag:1,
    isbn:0,
    show:false,
    isQQ:true,
    isWX:true,
    price:5,
    kind:0,
    sorted:"通用",
    method:2,
    count:0,
    fileList: [], //预览图列表
    piclist:[],//实际上传的fileid列表
    labels: [],//默认标签+专业标签+课程标签
    labelsActive: [], // 选中的标签
    sort:JSON.parse(config.data).sort1
  },
  //初始化重新发布
  initial(){
    this.setData({
      title:"",
      flag:1,
      isbn:0,
      show:false,
      isQQ:true,
      isWX:true,
      price:5,
      kind:0,
      sorted:"通用",
      method:2,
      count:0,
      fileList: [], //预览图列表
      piclist:[],//实际上传的fileid列表
      labels: [],//默认标签+专业标签+课程标签
      labelsActive: [], // 选中的标签
      sort:JSON.parse(config.data).sort1
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
  //弹出层开关
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
  //确认类别
  confirmsort(){
    this.showPopup()
  },
  //是否勾选联系方式
  onQQ(e){
    if(this.data.userinfo.QQ||this.data.QQ){
      this.setData({
      isQQ:!this.data.isQQ
    })}else{
      wx.showToast({
        title: 'QQ为空',
      })
    }
  },
  onWX(e){
    if(this.data.userinfo.WX||this.data.WX){
      this.setData({
      isWX:!this.data.isWX
    })}else{
      wx.showToast({
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
  //价格输入
  changeprice(e){
    this.setData({
      price:e.detail
    })
  },
  //每次上传图片后，缓存图片
  afterRead(event) {
    let that = this;
    console.log(event.detail)
    const { fileList = [] } = that.data;
    fileList.push({url: event.detail.file.url });
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
			that.publish()
  } else {
    const uploadTasks = fileList.map((file) => 
    this.uploadFilePromise(that.data.userinfo.UID+new Date().getTime()+`item.png`, file));
    Promise.all(uploadTasks)
      .then(data => {
        wx.showToast({ title: '上传成功', icon: 'none' });
        const newFileList = data.map(item => (item.fileID));
        that.setData({
          piclist:that.data.piclist.concat(newFileList)
        })
        that.publish();

      })
      .catch(e => {
        wx.showToast({ title: '上传失败', icon: 'none' });
        console.log(e);
      });
  }
  },
  //上传图片
  uploadFilePromise(fileName, chooseResult) {
  return wx.cloud.uploadFile({
    cloudPath: fileName,
    filePath: chooseResult.url
  });
  },
  //发布求购信息
  publish() {
    let that = this;
    db.collection('publish').add({
          data: {
								creat: new Date().getTime(),
								type:1,
								status: 0, 
								isbn:0,
								isQQ:that.data.isQQ,
								QQ:that.data.userinfo.QQ,
								method:2,
								WX:that.data.userinfo.WX,
								isWX:that.data.isWX,
                price: that.data.price, 
                kind: that.data.kind, 
								title:that.data.title,
								place:that.data.userinfo.campus,
								isauth:that.data.userinfo.isauth,
                piclist:that.data.piclist,
                tag:that.data.labelsActive,
                campus:that.data.userinfo.campus,
                avatar:that.data.userinfo.avatarUrl,
                nickName:that.data.userinfo.nickName,
                },
          success(e) {
                wx.showToast({
                  title: '发布成功',
                }),
                that.setData({
                  flag:2,
                  id:e._id
                })
          },
          fail(e){
                console.log(e)}
        })
  },
  //检查信息是否完善,补齐一些信息
  check(){
    if(!(this.data.isQQ||this.data.isWX)){
      wx.showToast({
        title: '请至少选择一种联系方式',
      })
      return
    }
    else if(this.data.userinfo.QQ!=this.data.QQ||this.data.userinfo.WX!=this.data.WX){
      let that=this;
      db.collection('user').doc(that.data.userinfo._id).update({
        data:{
          QQ : that.data.QQ,
          WX : that.data.WX
        },
        success(res){
          that.upload();
        }
      })
    }
    else{
      this.upload()
    }
  },
  //获取输入的求购信息
  infoInput(e){
    this.setData({
      title : e.detail.value,
      count : e.detail.value.length
    })
	},
	//弹出确认联系方式框
  showconfirm() {
    this.setData({confirm: !this.data.confirm });
	},
	//修改校区
	changecampus(){},
  //获取推荐标签
  gettag(){
    let that=this;
    //获取库内常用标签
    db.collection("tag").doc("book").get({
      success(res){
        that.setData({
          labels:that.data.labels.concat(res.data.tag)
        }) 
      }
    })
    //获取学生专业年级等标签
    // let school = {name:that.data.userinfo.school,active:false};
    // let major={name:that.data.userinfo.major+'专业教材',active:false};
    // let gradenum=22-that.data.userinfo.grade;
    // if(gradenum==1){
    //   var grade="大一";
    // }else if(gradenum==2){
    //   var grade="大二";
    // }else if(gradenum==3){
    //   var grade="大三";
    // }else{
    //   var grade="大四";
    // }
    // let gradetag={name:grade,active:false};
    // let tags=[school,gradetag,major]
    // that.setData({
    //   labels:that.data.labels.concat(tags)
    // })
  },
  //读取用户选择的标签
  onTagTap(event) {
    const labelname = event.currentTarget.dataset.label
    const labels = this.data.labels
    let labelsActive = this.data.labelsActive

    // 当前标签
    const label = labels.find(item => {
      return item.name === labelname
    })

    if (!label.active && labelsActive.length >= 3) {
      wx.showToast({
        title: '最多选择三个标签',
      })
      return
    }
    label.active = !label.active

    // 激活的标签
    labelsActive = []
    labels.forEach(item => {
      if (item.active) {
        labelsActive.push(item.name)
      }
    })
    this.setData({
      labels: labels,
      labelsActive: labelsActive,
    })
  },

  onLoad() {
    let user =wx.getStorageSync('userinfo')
    this.setData({
      userinfo:user,
      islogin:false
    })
    if(this.data.userinfo!=''){
          this.setData({
                islogin:true,
                QQ:this.data.userinfo.QQ,
                WX:this.data.userinfo.WX,
    })
  }

  },

})