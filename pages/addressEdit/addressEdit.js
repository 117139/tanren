//logs.js
const app = getApp()

Page({
  data: {
    region: [],
		moren:false,
		editaddress:{
			name: "aaa", 
			tel: "18300000000", 
			address: "北京市北京市东城区", 
			xxaddress: "街道街道街道", 
			moren: "true"}
  },
  onLoad: function (option) {
    if(option.address){
			console.log(option.address)
		}
		this.setData({
			editaddress:JSON.parse(option.address)
		})
		this.data.region[0]=this.data.editaddress.province
		this.data.region[1]=this.data.editaddress.city
		this.data.region[2]=this.data.editaddress.county
		this.setData({
			region:this.data.region
		})
		console.log(this.data.region)
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

		wx.request({
			url:  app.IPurl+'/index/personal/address_edit',
			data:  {
					id:wx.getStorageSync('usermsg').id,
					name:formresult.name, 
					city:formresult.xxaddress,
					phone:formresult.tel,
					'address_id':that.data.editaddress.address_id
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
						wx.navigateBack()
					}, 1000);
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
			},
			fail() {
				 pageState1.error()    // 切换为error状态
				 wx.showToast({
				 	 icon:'none',
				 	 title:'操作失败'
				 })
			}
		})
  }
	
})
