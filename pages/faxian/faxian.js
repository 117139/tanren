// pages/faxian/faxian.js
const app=getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
		yhlist:[],
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
		console.log('触底')
		// this.getyhlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	//获取首页list（搜索）
	getyhlist(){
		// console.log(pageState)
		let that = this
		const pageState1 = pageState.default(that)
	  pageState1.loading()    // 切换为loading状态
		

		wx.request({
			url:  app.IPurl+'/api/coupon/discovery',
			data:{
				
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
					
					if(rlist.length>0){
						that.data.yhlist=that.data.yhlist.concat(rlist)
						console.log(rlist)
						that.setData({
							yhlist:that.data.yhlist
						})
						console.log(that.data.yhlist)
					}
					if(rlist.length<10){
						console.log('没了')
						
					}
					 pageState1.finish()    // 切换为finish状态
				}
				
				  // pageState1.error()    // 切换为error状态
			},
			fail() {
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	formSubmit: function(e) {
		let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		// that.setData({
		// 	keyword:e.detail.value.sr
		// })
		// that.getshoplist(1)
	},
})