Component({
  "data": {
    "selected":null,
    "color": "#707070",
    "selectedColor": "#000000",
    "list": [
          {
                "pagePath": "/pages/index/index",
                "text": "首页",
                "iconPath": "/images/tabbar/index.png",
                "selectedIconPath": "/images/tabbar/index-selected.png"
          },
          {
                "pagePath": "/pages/explore/explore",
                "text": "发现",
                "iconPath": "/images/tabbar/explore.png",
                "selectedIconPath": "/images/tabbar/explore-selected.png"
          },
          {
                "pagePath": "/pages/publish/publish",
                "text": "发布",
                "iconPath": "/images/tabbar/publish.png",
                "selectedIconPath": "/images/tabbar/publish-selected.png"
          },
          {
                "pagePath": "/pages/cart/cart",
                "text": "想买",
                "iconPath": "/images/tabbar/cart.png",
                "selectedIconPath": "/images/tabbar/cart-selected.png"
          },
          {
                "pagePath": "/pages/my/my",
                "text": "我的",
                "iconPath": "/images/tabbar/my.png",
                "selectedIconPath": "/images/tabbar/my-selected.png"
          }
    ]
},
attached() {
},
methods: {
  switchTab(e) {
    const data = e.currentTarget.dataset
    const url = data.path
    //切换tab时，改变路由地址
    wx.switchTab({url})
    this.setData({
      //切换tab时，改变当前激活的序号，改变tab颜色图标等样式  
      selected: data.index
    })
  }
}
})