const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({
      data: {
            fileList:[],//暂存图片区
            piclist:[],//实际上传区
            islogin:false,
            entime: {
                  enter: 600,
                  leave: 300
            }, //进入褪出动画时长
            steps: [{
                        text: '步骤一',
                        desc: '扫描isbn码'
                  },
                  {
                        text: '步骤二',
                        desc: '补充图书信息'
                  },
                  {
                        text: '步骤三',
                        desc: '发布成功'
                  },
            ],
            price: 8,
            choosemethod: 0,//选择配送方式
            cids: '-1', //种类
            isbn: '',
            step1: true,
            step2: false,
            step3: false,
            active: 0,
            choosesort: false,
            note_counts: 0,
            notes: '',
            kindid: 0,
            sort: JSON.parse(config.data).sort,
            method: [{
                  name: '自提',
                  id: 0,
                  check: true,
            }, {
                  name: '帮送',
                  id: 1,
                  check: false
            }],
      },
      initial(){
            this.setData({
                  fileList:[],
                  piclist:[],
                  islogin:false,
                  entime: {
                        enter: 600,
                        leave: 300
                  }, //进入褪出动画时长
                  steps: [{
                              text: '步骤一',
                              desc: '扫描isbn码'
                        },
                        {
                              text: '步骤二',
                              desc: '补充图书信息'
                        },
                        {
                              text: '步骤三',
                              desc: '发布成功'
                        },
                  ],
                  price: 8,
                  choosemethod: 0,
                  cids: '-1', //学院选择的默认值
                  isbn: '',
                  step1: true,
                  step2: false,
                  step3: false,
                  active: 0,
                  choosesort: false,
                  note_counts: 0,
                  notes: '',
                  kindid: 0,
                  sort: JSON.parse(config.data).sort,
                  method: [{
                        name: '自提',
                        id: 0,
                        check: true,
                  }, {
                        name: '帮送',
                        id: 1,
                        check: false
                  }],

            })
            this.onShow()
      },
      onShow() {
            let user =wx.getStorageSync('userinfo')
            if(user){
            this.setData({
              userinfo:user,
              islogin:true,
              kind: [{
                  name: user.stuinfo.Major+'专业教材',
                  id: 0,
                  check: true,
            }, {
                  name: '其他',
                  id: 1,
                  check: false
            }],
            })     
            }
            else{
                  this.setData({
                        islogin:false,
                  })
            }
            //this.getcourse();
      },
      //手动输入isbn
      isbnInput(e) {
            this.setData({
                  isbn:e.detail.value
            });
      },
      //打开摄像头扫码isbn
      scan() {
            let that = this;
            wx.scanCode({
                  onlyFromCamera: false,
                  scanType: ['barCode'],
                  success: res => {
                        wx.showToast({
                              title: '扫码成功',
                              icon: 'success'
                        })
                        that.setData({
                              isbn: res.result
                        })
                  },
                  fail() {
                        wx.showToast({
                              title: '扫码失败，请重新扫码或者手动输入',
                              icon: 'none'
                        })
                  }
            })
      },
      confirm() {
            let that = this;
            let isbn = that.data.isbn;
            if (!(/978[0-9]{10}/.test(isbn))) {
                  wx.showToast({
                        title: '请检查您的isbn号',
                        icon: 'none'
                  });
                  return false;
            }
            if (!this.data.islogin) {
                  wx.showModal({
                        title: '温馨提示',
                        content: '该功能需要注册方可使用，是否马上去注册',
                        success(res) {
                              if (res.confirm) {
                                    wx.navigateTo({
                                          url: '/pages/wxlogin/wxlogin',
                                    })
                              }
                        }
                  })
                  return false
            }
            that.get_book(isbn);
      },
      //查询书籍数据库详情
      get_book(isbn) {
            let that = this;
            wx.showLoading({
                  title: '正在获取'
            })
            //先检查是否存在该书记录，没有再进行云函数调用
            db.collection('books').where({
                  isbn: isbn
            }).get({
                  success(res) {
                        //添加到数据库
                        if (res.data == "") {
                              that.addbooks(isbn);
                        } else {
                              wx.hideLoading();
                              that.setData({
                                    bookinfo: res.data[0],
                                    step1: false,
                                    step2: true,
                                    step3: false,
                                    active: 1,
                              })
                        }
                  }
            })
      },
      //添加书籍信息到数据库
      addbooks(bn) {
            let that = this;
            wx.cloud.callFunction({
                  name: 'books',
                  data: {
                        $url: "bookinfo", //云函数路由参数
                        isbn: bn
                  },
                  success: res => {
                        console.log(res)
                        if (res.result.body.status == 0) {
                              wx.hideLoading();
                              if(res.result.body.result.pic==''){
                                    res.result.body.result.pic='cloud://cloud1-7gg95toua8c7bcf8.636c-cloud1-7gg95toua8c7bcf8-1256970835/nopic.png'
                              }
                              that.setData({
                                    bookinfo: res.result.body.result,
                                    step1: false,
                                    step2: true,
                                    step3: false,
                                    active: 1,
                              })
                              db.collection('books').add({
                                    data: res.result.body.result,
                                    success: function(res) {
                                    },
                                    fail: console.error
                              })
                        }
                  },
                  fail: err => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '查询失败',
                        })
                        console.error(err)
                  }
            })
      },
      //每次上传图片后，缓存图片
      afterRead(event) {
      let that = this;
      console.log(event.detail)
      const { fileList = [] } = that.data;
      fileList.push({ ...event.detail, url: event.detail.file.url });
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
      }},
      //发布
      upload(){
      let that = this;
      const { fileList } = that.data;
      if (!fileList.length) {
      wx.showModal({
            title:"提示",
            content:"上传宝贝图片更易卖出嗷",
            confirmText:'我意已决',
            cancelText:"容我想想",
            cancelColor: 'cancelColor',
            success: function (res) {

            if (res.confirm) {//这里是点击了确定以后
            
            console.log('用户点击确定')
            that.publish()

            } else {//这里是点击了取消以后

            console.log('用户点击取消')

            }}
      });
      } else {
      wx.showLoading({
            title: '正在上传',
      })
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(that.data.userinfo.UID+new Date().getTime()+`item.png`, file));
      Promise.all(uploadTasks)
            .then(data => {
            wx.hideLoading()
            wx.showToast({ title: '上传成功', icon: 'none' });
            const newFileList = data.map(item => ({ url: item.fileID }));
            that.setData({
            piclist:newFileList
            })
            that.publish()
            })
            .catch(e => {
            wx.hideLoading()
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
      //价格输入改变
      priceChange(e) {
            this.data.price = e.detail;
      },

      //书籍类别选择
      kindChange(e) {
            let that = this;
            let kind = that.data.kind;
            let id = e.detail.value;
            for (let i = 0; i < kind.length; i++) {
                  kind[i].check = false
            }
            kind[id].check = true;
            if (id == 1) {
                  that.setData({
                        kind: kind,
                        choosesort: true,
                        kindid: id
                  })
            } else {
                  that.setData({
                        kind: kind,
                        cids: that.data.userinfo.stuinfo.MajorID,
                        choosesort: false,
                        kindid: id
                  })
            }
      },
      //选择专业
      chosort(e) {
            let that = this;
            that.setData({
                  cids: e.detail.value
            })
      },
      //取货方式改变
      delChange(e) {
            let that = this;
            let method = that.data.method;
            let id = e.detail.value;
            for (let i = 0; i < method.length; i++) {
                  method[i].check = false
            }
            method[id].check = true;
            if (id == 1) {
                  that.setData({
                        method: method,
                        choosemethod: 1
                  })
            } else {
                  that.setData({
                        method: method,
                        choosemethod: 0
                  })
            }
      },
      //输入备注
      noteInput(e) {
            let that = this;
            that.setData({
                  note_counts: e.detail.cursor,
                  notes: e.detail.value,
            })
      },
      //发布校检
      check_pub() {
            let that = this;
            //如果用户选择了其他类别，需要确认类别
            if (that.data.kind[1].check) {
                  if (that.data.cids == -1) {
                        wx.showToast({
                              title: '请选择类别',
                              icon: 'none',
                        });
                        return false;
                  }
            }
            //如果用户选择了自提，需要填入详细地址
            if (that.data.method[0].check) {
                  if (that.data.place == '') {
                        wx.showToast({
                              title: '请输入地址',
                              icon: 'none',
                        });
                        return false;
                  }
            }
            that.upload();
      },
      //正式发布
      publish() {
            let that = this;
            wx.showModal({
                  title: '温馨提示',
                  content: '经检测您填写的信息无误，是否马上发布？',
                  success(res) {
                        if (res.confirm) {
                              db.collection('publish').add({
                                    data: {
                                          creat: new Date().getTime(),
                                          status: 0, 
                                          price: that.data.price, 
                                          kindid: that.data.kindid, 
                                          sortid: parseInt(that.data.cids),
                                          methodid: that.data.choosemethod, //0自1配
                                          place: that.data.place, //选择自提时地址
                                          notes: that.data.notes,
                                          bookinfo: {
                                                _id: that.data.bookinfo._id,
                                                author: that.data.bookinfo.author,
                                                edition: that.data.bookinfo.edition,
                                                pic: that.data.bookinfo.pic,
                                                price: that.data.bookinfo.price,
                                                title: that.data.bookinfo.title,
                                          },
                                          piclist:that.data.piclist,
                                          key: that.data.bookinfo.title + that.data.bookinfo.keyword,
                                          campus:that.data.userinfo.stuinfo.Distinct,
                                          publisherinfo:{avatar:that.data.userinfo.info.avatarUrl,snickname:that.data.userinfo.snickname,
                                          isauth:that.data.userinfo.isauth,
                                          }
                                    },
                                    success(e) {
                                          console.log(e)
                                          that.setData({
                                                step1: false,
                                                step2: false,
                                                step3: true,
                                                active: 2,
                                                detail_id: e._id
                                          });
                                          //滚动到顶部
                                          wx.pageScrollTo({
                                                scrollTop: 0,
                                          })
                                    },
                                    fail(e){
                                          console.log(e)}
                              })
                        }
                  }
            })
      },
      //查看详情
      detail() {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + that.data.detail_id,
            })
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
                        lat:res.latitude,
                        lon:res.longitude
                    })
              },
              fail(res){
                    wx.showToast({
                      title: '请选择或输入地址',
                    })
              }
            })
      },
      //地址输入
      placeInput(e) {
            console.log(e)
            this.setData({
                  place:e.detail.value,
                  lat:0,
                  lon:0
            })
      },
})