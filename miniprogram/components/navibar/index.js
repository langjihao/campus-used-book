// components/navibar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
			// 状态栏高度
			statusBarHeight: wx.getStorageSync('statusBarHeight') ,
			// 导航栏高度
			navigationBarHeight: wx.getStorageSync('navigationBarHeight'),
			// 胶囊按钮高度
			menuButtonHeight: wx.getStorageSync('menuButtonHeight'),
			// 导航栏和状态栏高度
			navigationBarAndStatusBarHeight:
				wx.getStorageSync('statusBarHeight') +
				wx.getStorageSync('navigationBarHeight')
				,

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
