// pages/my/my.js
const app=getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
			userwxmsg:wx.getStorageSync('userWxmsg'),
			userxcxmsg:wx.getStorageSync('usermsg'),
			day:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// 		this.setData({
// 			userwxmsg:app.globalData.userInfo
// 		})
		console.log(Date.now())
		var daytime=util.getDay(Date.now(),wx.getStorageSync('usermsg').login_time)
		this.setData({
			day:daytime
		})
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
	jump(e){
		console.log(e.currentTarget.dataset.url)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
	qiandao(){
		///index/personal/sign
		let that = this
		var qdtype=wx.getStorageSync('usermsg').sign_type
		console.log(qdtype)
		if(qdtype!=2){
			wx.showToast({
				 icon:'none',
				 title:'今天已签到'
			})
			return
		}
		wx.request({
			url:  app.IPurl2+'/index/personal/sign',
			data:{
				id:wx.getStorageSync('usermsg').id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					
					// if(rlist.length>0){
						wx.showToast({
							 icon:'none',
							 title:'签到成功'
						})
					
					// }
					
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
	}
})