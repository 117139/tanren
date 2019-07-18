// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		fxdata:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		if(options.type=="fwcz"){
			
		}
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
	gohome(){
		wx.switchTab({
			url: '/pages/index/index'
		})
	},/**   
     * 预览图片  
     */
  previewImage: function (e) {
    var current = e.target.dataset.src;
		var arr1=[]
		arr1.push(current)
		console.log(arr1);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: arr1 // 需要预览的图片http链接列表  
    })
  },
	getfwzc(id){
		let that = this
		wx.request({
			url:  app.IPurl2+'/index/dining/index',
			data:{
				"page":that.data.pages[that.data.type],
				"region_name":that.data.datalist[that.data.type].region_name,
				"search":that.data.search
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
					
					
						
						that.setData({
							fxdata:rlist
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
	}
})