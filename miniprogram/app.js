const config = require("config.js");
App({
      openid: '',
      userinfo:'',
			canReflect:true,
			globalData: {},
      onLaunch: function() {
            if (!wx.cloud) {
                  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
            } else {
                  wx.cloud.init({
                       env: JSON.parse(config.data).env,
                        traceUser: true,
                  })
            }
						wx.getSystemInfo({
							success: e => {
								this.globalData.StatusBar = e.statusBarHeight;
								let capsule = wx.getMenuButtonBoundingClientRect();
						if (capsule) {
							 this.globalData.Custom = capsule;
							this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
						} else {
							this.globalData.CustomBar = e.statusBarHeight + 50;
						}
							}
						})
      }
})