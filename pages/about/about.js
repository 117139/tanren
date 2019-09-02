// pages/about/about.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getabout()
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
	getabout(){
		
		
		let that =this
		//http://water5100.800123456.top/WebService.asmx/useraddress
		wx.request({
			url:  app.IPurl+'/index/personal/about',
			data:  {
					id:wx.getStorageSync('usermsg').id,
				},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded' 
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				if(res.data.errCode==0){
					that.setData({
						addresslist:res.data.retData
					})
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
				
			
					// pageState1.error()    // 切换为error状态
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