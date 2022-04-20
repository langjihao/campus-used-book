const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
            check:false,
            ids: -1,
            TEL: '',
            WX: '',
            QQ: '',
            campus: JSON.parse(config.data).campus,
      },
      //跳转到实名认证页
      navitoauth(){
            wx.navigateTo({
                  url: '/pages/verify/verify'
                })
      },
      //校区选择
      choose(e){
            this.setData({
                  ids:e.detail.value
            })     
      },
      //微信同号
      same(){
            this.setData({
                  check: !this.data.check
                  })
      },
      onShow() {
            let user =wx.getStorageSync('userinfo');
            let openid = wx.getStorageSync('openid')
            this.setData({
              userinfo:user,
              openid:openid
            })
      },
      telInput(e){
            this.data.TEL = e.detail.value;
      },
      wxInput(e) {
            if(this.data.check){
                  this.data.WX=this.data.TEL
            }
            this.data.WX = e.detail.value;
      },
      qqInput(e) {
            this.data.QQ = e.detail.value;
      },    
      //同步最新头像昵称
      getUserpro(e) {
            wx.getUserProfile({
                  desc: '更新头像和昵称',
                  success(res){
                    this.setData({
                      userInfo: res.userInfo,
                  })

            } ,
            fail(res){
                  that.setData({
                        userInfo: that.data.userinfo
                  })
            }
      }),
      that.check();},
      //校检
      check() {
            let that = this;
            //校检手机
            let TEL = that.data.TEL;
            if (TEL == '') {
                  wx.showToast({
                        title: '请先获取您的电话',
                        icon: 'none',
                        duration: 2000
                  });
                  return false
            }
            //校检校区
            let ids = that.data.ids;
            let campus = that.data.campus;
            if (ids == -1) {
                  wx.showToast({
                        title: '请先获取您的校区',
                        icon: 'none',
                        duration: 2000
                  });
            }
            //校检QQ号
            let QQ = that.data.QQ;
            if (QQ !== '') {
                  if (!(/^\s*[.0-9]{5,11}\s*$/.test(QQ))) {
                        wx.showToast({
                              title: '请输入正确QQ号',
                              icon: 'none',
                              duration: 2000
                        });
                        return false;
                  }
            }
            //校检微信号
            let WX = that.data.WX;
            if (WX !== '') {
                  if (!(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(WX))) {
                        wx.showToast({
                              title: '请输入正确微信号',
                              icon: 'none',
                              duration: 2000
                        });
                        return false;
                  }
            }
            wx.showLoading({
                  title: '正在提交',
            })
            db.collection('user').doc(that.data.userinfo._id).update({
                  data: {
                        TEL: that.data.TEL,
                        QQ: that.data.QQ,
                        WX: that.data.WX,
                        // info: that.data.userInfo,
                        updatedat: new Date().getTime(),
                  },
                  success: function(res) {
                        console.log(res)
                        db.collection('user').doc(that.data.userinfo._id).get({
                              success: function(res) {
                                    wx.setStorageSync('userinfo',res.data[0])
                                    wx.hideLoading();
                                    wx.showToast({
                                          title: '修改成功',
                                          icon: 'success'
                                    })
                              },
                        })
                  },
                  fail(res) {
                        console.log(res)
                        wx.hideLoading();

                        wx.showToast({
                              title: '注册失败，请重新提交',
                              icon: 'none',
                        })
                  }
            })
      },
})