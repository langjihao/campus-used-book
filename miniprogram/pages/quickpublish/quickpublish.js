// pages/quickpublish/quickpublish.js
const db = wx.cloud.database();
const app = getApp();
Page({
  
  data: {
    islogin:true,
    fileList: [], //预览图列表
    piclist:[],//实际上传的fileid列表
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

    const { fileList } = this.data;
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
 
        } else {//这里是点击了取消以后
 
          console.log('用户点击取消')
 
        }}
    });
  } else {
    const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`item.png`, file));
    Promise.all(uploadTasks)
      .then(data => {
        wx.showToast({ title: '上传成功', icon: 'none' });
        const newFileList = data.map(item => ({ url: item.fileID }));
        this.setData({
          piclist:newFileList
        })
        this.setData({ cloudPath: data, fileList: newFileList });
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
  //获取输入的商品信息
  infoInput(e){
    console.log(e.detail.value)
    this.setData({
      count:e.detail.value.length
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user =wx.getStorageSync('userinfo')
            this.setData({
              userinfo:user,
              islogin:false
            })
            if(this.data.userinfo!=''){
                  this.setData({
                        islogin:true
            })
            console.log(this.data.userinfo)

  }},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})