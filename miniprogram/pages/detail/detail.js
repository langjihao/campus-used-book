const { data } = require("../../config");

const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            show:false,
            first_title: true,
            place: '',
            islogin:false,
            morepub:false
      },
      onLoad(e) {
            this.data.id = e.scene;
            this.getPublish(e.scene);
            let user =wx.getStorageSync('userinfo')
            if(user){
            this.setData({
              userinfo:user,
              islogin:true,
            })
      }
      },
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
                              publishinfo: res.data
                        })
                        that.getSeller(res.data._openid)
                  },
                  //主要是购物车跳转 但原商品已经被删除的情况，或许以后得加上清除购物车记录或者改变商品状态标记
                  fail(res){
                        wx.showModal({
                              cancelColor: 'cancelColor',
                              content:'该商品已被卖家删除，快去看看其他宝贝吧',
                              confirmText:'好滴吧',
                              cancelText:"还能咋地",
                              cancelColor: 'cancelColor',
                              success: function (res) {
                  
                              if (res.confirm) {
                              
                              wx.navigateBack({})
                  
                              } else {
                  
                              wx.navigateBack({})
                  
                              }}
                            })
                  }
            })
      },
      //获取卖家信息
      getSeller() {
            let that = this;
            let data = that.data.publishinfo;
            let actions0 = [
              {
                name: '站内信',
                subname: '暂未开通',
              },
            ];
            db.collection('user').where({
                  _openid:data._openid
            }).get({
                  success(res){
                        if (data.isQQ){
                          var actions1 = actions0.concat({name:'QQ'})
                        }
                        else{
                          var actions1 = actions0
                        }
                        if (data.isWX){
                          var actions2 = actions1.concat({name:'微信'})
                        }
                        else{
                          var actions2 = actions1
                        }
                        that.setData({
                          selleruserinfo: res.data[0],
                          actions:actions2
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
      //点击图片预览
      picview(e){
            var that = this;
            var src = e.currentTarget.dataset.src;
            var piclist=[]
            var imgList = that.data.publishinfo.piclist;
            for(var i=0;i<imgList.length;i++){
                  piclist.push(imgList[i])
            }
            console.log(piclist)
            wx.previewImage({
                  current: src, // 当前显示图片的http链接
                  urls: piclist // 需要预览的图片http链接列表
            })
      },
      //获取该发布人更多商品
      getmorepub(openid){
            let that = this;
            db.collection('publish').where({
                  _openid: openid
            }).limit(6).get({
                  success(res) {
                        if(res.data.length===0){}
                        else{
                              that.setData({
                              morepublist: res.data,
                              morepub:true
                        })}
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
      //获取卖家联系方式
      contact(){
            this.setData({
                  show:true
            })
      },
      //展示用户实名状态
      showauth(){
            wx.showToast({
              title: '该用户已实名认证',
            })
      },
      //跳转详情
      detail(e) {
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
            })
      },
      onClose(){
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
            db.collection('cart').add({
                  data:{
                        itemid : this.data.id,
                        pic : this.data.publishinfo.piclist[0],
                        sellerpic : this.data.selleruserinfo.avatarUrl,
                        sellername: this.data.selleruserinfo.nickName,
                        price : this.data.publishinfo.price,
                        title : this.data.publishinfo.title,
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
      //生成分享相关内容
      onShareAppMessage() {
            return {
                  title: '这本《' + this.data.bookinfo.title + '》只要￥' + this.data.publishinfo.price + '元，快来看看吧',
                  path: '/pages/detail/detail?scene=' + this.data.publishinfo._id,
            }
      }})
