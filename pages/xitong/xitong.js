// pages/xitong/xitong.js
const app=getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		zdxx: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getxiaoxi()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	getxiaoxi() {
		//192.168.129.119/index/turns/index
		let that = this

		wx.request({
			url: app.IPurl + '/api/marquee/index',
			data: {

			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType: 'json',
			method: 'get',
			success(res) {
				console.log(res.data)


				if (res.data.errcode == 0) {
					let rlist = res.data.retData
					that.data.zdxx = that.data.zdxx.concat(rlist)
					that.setData({
						zdxx: that.data.zdxx
					})

				} else {
					wx.showToast({
						icon: 'none',
						title: '操作失败'
					})

				}

			},
			fail() {
				wx.showToast({
					icon: 'none',
					title: '操作失败'
				})
				pageState1.error()
			}
		})
	},

})
