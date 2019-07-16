//app.js
App({
	IPurl1: 'http://192.168.129.119/',
	IPurl2: "http://192.168.129.120/",
	onLaunch: function() {
		// // 展示本地存储能力
		// var logs = wx.getStorageSync('logs') || []
		// logs.unshift(Date.now())
		// wx.setStorageSync('logs', logs)


		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo
							console.log(res.userInfo)
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							// 登录
							this.dologin()

						}
					})
				} else {
					wx.reLaunch({
						url: '/pages/login/login',
					})
				}
			}
		})
	},
	dologin() {
		let that = this
		wx.login({
			success: function(res) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId

				// console.log(that.IPurl1)
				// const url =   
				let data = {
					code: res.code
				}
				let rcode = res.code
				console.log(res.code)
				/*wx.request({
					// 发送到本地开发服务器
					// url: 'http://www.tppay.com/v1/login_module/loginInit/' + res.code,
					url: 'http://192.168.129.119/index/userlogin/login',
					//get发送
					method: "POST",
					//发送code数据
					data: {
						"code": res.code
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function(res) {
						console.log(res.data);
						//如果有openid就存入小程序缓存
						if (res.data.openid) {
							wx.setStorage({
								key: "tokenId",
								data: res.data.openid,
							})
						}
					}
				})*/
				wx.request({
					url:  that.IPurl1+'/index/userlogin/login', 
					data: {
						'code':rcode
					},
					// header: {
					// 	'content-type': 'application/x-www-form-urlencoded' 
					// },
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res)
						console.log(res.data)
						if(res.data.error==0){
							wx.reLaunch({
							  url: '/pages/index/index',
							  fail: (err) => {
							    console.log("失败: " + JSON.stringify(err));
							  }
							})
							console.log('登录成功')
		          wx.setStorageSync('login', 'login')
							wx.setStorageSync('morenaddress', res.data.user_member_shopping_address)
						}
						if(res.data.error==2){
							wx.setStorageSync('tokenstr', res.data.tokenstr)
							wx.setStorageSync('appcode', rcode)
							wx.reLaunch({
								url:'/pages/login/login'
							})
						}
					}
				})
			}
		})
	},
	globalData: {
		userInfo: null
	}
})
