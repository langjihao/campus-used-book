const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            show:false,
            first_title: true,
            place: '',
            islogin:false
      },
      onLoad(e) {
            this.data.id = e.scene;
            this.getPublish(e.scene);
            let user =wx.getStorageSync('userinfo')
            if(user){
            this.setData({
              userinfo:user,
              islogin:true,
            })}},
      changeTitle(e) {
            let that = this;
            that.setData({
                  first_title: e.currentTarget.dataset.id
            })
      },
      //获取发布信息
      getPublish(e) {
            let that = this;
            db.collection('publish').doc(e).get({
                  success: function(res) {
                        that.setData({
                              sort_1Name: JSON.parse(config.data).sort_1[parseInt(res.data.sort_1id) + 1],
                              publishinfo: res.data
                        })
                        that.getSeller(res.data._openid, res.data.bookinfo._id)

                  }
            })
      },
      //获取卖家信息
      getSeller(m, n) {
            let that = this;
            db.collection('user').where({
                  _openid:m
            }).get({
                  success: res => {
                        that.setData({
                              selleruserinfo: res.data[0],
                              actions: [
                                    {
                                      name: 'QQ',
                                    },
                                    {
                                      name: '微信',
                                    },
                                    {
                                      name: '站内信',
                                      subname: '暂未开通',
                                    },
                                  ],
                        })
                        that.getBook(n)
                  }
            })
      },
      //获取书本信息
      getBook(e) {
            let that = this;
            db.collection('books').doc(e).get({
                  success: function(res) {
                        that.setData({
                              bookinfo: res.data
                        })
                  }
            })
      },
      //回到首页
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
      navitocart(){
            wx.switchTab({
                  url: '/pages/cart/cart',
            })
      },
      //获取卖家联系方式
      contact(){
            this.setData({
                  show:true
            })
      },
      onClose(){
            console.log(111)
            this.setData({ show : false });
      },
      //选择复制某种联系方式
      onSelect(e) {
            console.log(e.detail.name)
            if(e.detail.name=='QQ'){
                  this.setData({
                        copydata : this.data.selleruserinfo.QQ
                  })
            }
            else if(e.detail.name=='微信'){
                  this.setData({
                        copydata : this.data.selleruserinfo.WX
                  })
                  console.log(this.data.selleruserinfo.WX)
            }         
            wx.setClipboardData({
            data: this.data.copydata,
            success: res => {
                  wx.showToast({
                        title: '复制卖家' + e.detail.name+'成功,快去联系他吧',
                        icon: 'success',
                        duration: 1000,
                  })
            }
      })},
      //添加到购物车
      add(){
            if(this.data.publishinfo.piclist==[]){
                  this.setData({
                        pic:'cloud://cloud1-7gg95toua8c7bcf8.636c-cloud1-7gg95toua8c7bcf8-1256970835/nopic.png'
                  })
                  
            }
            else{
                  this.setData({
                        pic:this.data.publishinfo.piclist[0].url
                  })
            }
            console.log(this.data.userinfo._openid)
            db.collection('cart').add({
                  data:{
                        itemid : this.data.id,
                        pic : this.data.pic,
                        sellerpic : this.data.selleruserinfo.info.avatarUrl,
                        sellername: this.data.selleruserinfo.info.nickName,
                        price : this.data.publishinfo.price,
                        title : this.data.publishinfo.bookinfo.title,
                        creat : new Date().getTime()
                  },
                  success(res){
                        wx.showToast({
                          title: '添加成功',
                        })
                  },
                  fail(res){
                        console.log(res)
                  }
            })
      },
      onShareAppMessage() {
            return {
                  title: '这本《' + this.data.bookinfo.title + '》只要￥' + this.data.publishinfo.price + '元，快来看看吧',
                  path: '/pages/detail/detail?scene=' + this.data.publishinfo._id,
            }
      }})
