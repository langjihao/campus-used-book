const config = require("config.js");
App({
      openid: '',
      userinfo:'',
			canReflect:true,
			globalData: {
				ColorList: [{
					title: '嫣红',
					name: 'red',
					color: '#e54d42'
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d'
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08'
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f'
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a'
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4'
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff'
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6'
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0'
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997'
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f'
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3'
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa'
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333'
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff'
				},
			]
			},
      onLaunch: function() {
            if (!wx.cloud) {
                  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
            } else {
                  wx.cloud.init({
                      env: JSON.parse(config.data).env,
                      traceUser: true,
                  })
            }
						const { statusBarHeight, platform } = wx.getSystemInfoSync()
    				const { top, height } = wx.getMenuButtonBoundingClientRect()
						wx.setStorageSync('statusBarHeight', statusBarHeight)
						wx.setStorageSync('menuButtonHeight', height ? height : 32)
						if (top && top !== 0 && height && height !== 0) {
								const navigationBarHeight = (top - statusBarHeight) * 2 + height
								wx.setStorageSync('navigationBarHeight', navigationBarHeight)
						} else {
								wx.setStorageSync(
									'navigationBarHeight',
									platform === 'android' ? 48 : 40
								)
						}
			}
})