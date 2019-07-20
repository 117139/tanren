// pages/mysc/mysc.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		page:1,
		lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getyhlist()
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
		this.getyhlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	getyhlist(fir){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/my/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.page,
				
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					let rlist=res.data.retData.data
					if(rlist.length>0){
						that.data.lists=that.data.lists.concat(rlist)
						console.log(rlist)
						that.data.page++
						that.setData({
							page:that.data.page,
							lists:that.data.lists
						})
						console.log(that.data.yhlist)
					}else{
						// if(that.data.search){
							wx.showToast({
								 icon:'none',
								 title:'没有更多数据了'
							})
						// }
						// wx.showToast({
						// 	 icon:'none',
						// 	 title:'已经到底了'
						// })
					}
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
	
})