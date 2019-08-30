//logs.js
const app = getApp()

Page({
  data: {
    btnkg:0,
    region: [],
		moren:true
  },
  onLoad: function () {
    that.setData({
      btnkg: 0
    })
  },
	//选择地区
	bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
	//设置默认
	switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
		this.setData({
			moren:e.detail.value
		})
  },
	//提交表单
	formSubmit(e) {
		let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let formresult=e.detail.value
		if (formresult.name=='') {
			wx.showToast({
				title: '收货人姓名不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		// if (!(/^1\d{10}$/.test(formresult.tel))) {
		if (formresult.tel=='') {
			wx.showToast({
				title: '手机号码不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		// if (formresult.address=='') {
		// 	wx.showToast({
		// 		title: '请选择地区',
		// 		duration: 2000,
		// 		icon:'none'
		// 	});
		// 	return false;
		// }
		if (formresult.xxaddress=='') {
			wx.showToast({
				title: '请填写详情地址',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
    if (that.data.btnkg==1){
      return
    }else{
      that.setData({
        btnkg:1
      })
    }
	//http://water5100.800123456.top/WebService.asmx/useraddress
		wx.request({
			url:  app.IPurl+'/index/personal/address',
			data:  {
					id:wx.getStorageSync('usermsg').id,
					name:formresult.name, 
					city:formresult.xxaddress,
					phone:formresult.tel
		    },
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded' 
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				if(res.data.errCode==0){
					wx.showToast({
						title:'保存成功'
					})
					setTimeout(function() {
            that.setData({
              btnkg: 0
            })
						wx.navigateBack()
					}, 1000);
				}else{
          that.setData({
            btnkg: 0
          })
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
			},
			fail() {
        that.setData({
          btnkg: 0
        })
				 wx.showToast({
				 	 icon:'none',
				 	 title:'操作失败'
				 })
			}
		})
  },
})
