// pages/settel/settel.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnkg:0,
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

  },

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

  },
	formSubmit: function(e) {
		let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		///index/personal/update_account
    if (e.detail.value.tel==''){
      wx.showToast({
        icon:'none',
        title: '请输入手机号',
      })
      return
    }
    if (that.data.btnkg == 1) {
      return
    } else {
      that.setData({
        btnkg: 1
      })
    }
		wx.request({
			url:  app.IPurl+'/index/personal/update_account',
			data:{
				"id":wx.getStorageSync('usermsg').id,
				"account":e.detail.value.tel
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					
					// let rlist=res.data.retData
					// that.setData({
					// 	bannerimg:rlist
					// })
					wx.showToast({
						 icon:'none',
						 title:'操作成功'
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