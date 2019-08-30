// pages/setyj/setyj.js
const app=getApp()
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
	formSubmit: function(e) {
		let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		var fdata=e.detail.value
		// that.setData({
		// 	keyword:e.detail.value.sr
		// })
		// that.getshoplist(1)
		///index/personal/idea
    if (fdata.fankui.length==0){
      wx.showToast({
        icon:'none',
        title: '请输入内容',
      })
      return
    }
    if(that.data.btnkg==1){
      return
    }else{
      that.setData({
        btnkg:1
      })
    }
		wx.request({
			url:  app.IPurl+'/index/personal/idea',
			data:  {
					id:wx.getStorageSync('usermsg').id,
					content:fdata.fankui
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
						title:'提交成功'
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
            btnkg:0
          })
				 wx.showToast({
					 icon:'none',
					 title:'操作失败'
				 })
			}
		})
		
	},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})