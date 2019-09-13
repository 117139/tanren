//app.js
App({
	IPurl1: 'http://192.168.129.120/',
	IPurl2: "http://192.168.129.120/",
	// IPurl:"http://ceshi.800123456.top/",
  IPurl:"https://tangrenjie.800123456.top",
	onLaunch: function() {
		// // 展示本地存储能力
		// var logs = wx.getStorageSync('logs') || []
		// logs.unshift(Date.now())
		// wx.setStorageSync('logs', logs)

    var that =this
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							that.globalData.userInfo = res.userInfo
							
							console.log(res.userInfo)
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							// 登录
              if (!that.globalData.userInfo) {
                // wx.reLaunch({
                //   url: '/pages/login/login',
                //   fail: (err) => {
                //     console.log("失败: " + JSON.stringify(err));
                //   }
                // })
              } else {
                wx.setStorageSync('userWxmsg', that.globalData.userInfo)
                that.dologin()
              }
							

						}
					})
				} else {
					// wx.reLaunch({
					// 	url: '/pages/login/login',
					// })
				}
			}
		})
	},
	dologin(type) {
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
				// return
				wx.request({
					url:  that.IPurl+'/index/userlogin/login', 
					data: {
						'code':rcode,
						'avatarUrl':that.globalData.userInfo.avatarUrl,
						'nickName':that.globalData.userInfo.nickName,
					},
					// header: {
					// 	'content-type': 'application/x-www-form-urlencoded' 
					// },
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res)
						console.log(res.data)
						if(res.data.errCode==0){
							// wx.reLaunch({
							//   url: '/pages/index/index',
							//   fail: (err) => {
							//     console.log("失败: " + JSON.stringify(err));
							//   }
							// })
              wx.setStorageSync('login', 'login')
              wx.setStorageSync('usermsg', res.data.retData)
              if (type =='shouquan'){
                wx.showToast({
                  icon:'none',
                  title: '登录成功',
                })
                setTimeout(function(){
                  wx.navigateBack()
                },1000)
              }
							console.log('登录成功')
		          
						}else{
							wx.showToast({
								icon:'none',
								title:res.data.ertips
							})
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
	/**   
	   * 预览图片  
	   */
	previewImage(e) {
	  var current = e.target.dataset.src;
		var arr1=[]
		arr1.push(current)
		console.log(arr1);
	  wx.previewImage({
	    current: current, // 当前显示图片的http链接  
	    urls: arr1 // 需要预览的图片http链接列表  
	  })
	},
	jump(e){
		console.log(e.currentTarget.dataset.url)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
	sharerw(type){
		var that =this
		if(type!='share'){
			return
		}
		wx.request({
			url:  that.IPurl+'/index/personal/share',
			data:{
				"id":wx.getStorageSync('usermsg').id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errCode==0){
					wx.showToast({
						icon:'none',
						// title:'分享成功'
						title:res.data.ertips
					})
		
				}
			
			},
			fail() {
				wx.showToast({
					 icon:'none',
					 title:'操作失败'
				})
			}
		})
	},
	//获取支付信息
	Pay(order_info_id,type){
		let that=this
		let datas
		if(type==='info'){
			datas= {
				op:'pay',
				key:that.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				order_info_id: order_info_id
			}
		}
		if(type==='no'){
			datas= {
				op:'pay',
				key:that.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				partner_trade_no: order_info_id
			}
		}
		console.log(JSON.stringify(datas))
		wx.request({
			url: that.IPurl1 + 'order',
			data: datas,
			header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
			},
			method: "POST",
			success: function (res) {
				console.log('194'+res.data);
				if(res.data.error==0){
					that.doWxPay(res);
				}else{
					
				}
				
			},
			fail: function (err) {
				wx.showToast({
						icon: "none",
						title: '服务器异常，清稍候再试'
				})
			},
		});
	},
	doWxPay(param) {
    console.log(param)
		// wx.showToast({
		// 	title:'doWxPay'
		// })
		//小程序发起微信支付
		wx.requestPayment({
			timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
			nonceStr: param.data.nonceStr,//随机字符串
			package: param.data.package,
			signType: 'MD5',
			paySign: param.data.paySign,
			success: function (event) {
				// success
				console.log(event);
				
				// wx.redirectTo({
				// 	url: '/pages/OrderList/OrderList?id=-2'
				// })
				wx.showToast({
					title: '支付成功',
					icon: 'none',
					duration: 1000
				});
			},
			fail: function (error) {
				// fail
				console.log("支付失败")
				
				// wx.redirectTo({
				// 	url: '/pages/OrderList/OrderList?id=0'
				// })
				wx.showToast({
					title: '支付失败',
					icon: 'none',
					duration: 1000
				});
				console.log(error)
			},
			complete: function () {
				// complete
				console.log("pay complete")
			}
		 
		});
	},
	
	getbanner(num){
		//192.168.129.119/index/turns/index
		let that = this
		wx.request({
			url:  that.IPurl+'/index/turns/index',
			data:{
				"turns_class":num
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					let rlist=res.data.retData
						return rlist
						
				
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
			
			},
			fail() {
				wx.showToast({
					 icon:'none',
					 title:'操作失败'
				})
			}
		})
	},
	globalData: {
		userInfo: null
	}
})
