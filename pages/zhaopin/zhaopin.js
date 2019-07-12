// pages/zhaopin/zhaopin.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
		datalist:[
			{
				"name":"日餐",
				list:[
					1,1,1,1,5
				]
			},{
				"name":"中餐",
				list:[
					1,2,3,4,5
				]
			},{
				"name":"铁板",
				list:[
					1,2,3,4,5
				]
			},{
				"name":"企台",
				list:[
					1,2,3,4,5
				]
			},{
				"name":"其他",
				list:[
					1,2,3,4,5
				]
			},
		],
    bannerimg: [
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
		
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   console.log(1)
	 wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(2)
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
		this.data.datalist[this.data.type].list.push(1)
		this.data.datalist[this.data.type].list.push(1)
		this.data.datalist[this.data.type].list.push(1)
		this.data.datalist[this.data.type].list.push(1)
		this.setData({
			datalist:this.data.datalist
		})
  },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function (res) {
		 
    if (res.from === 'button') {
			console.log(res.target.dataset.type)
    }
    // return {
    //   title: '转发',
    //   path: '/pages/index/community/topic/topic?jsonStr=' + this.data.list,
    //   success: function (res) {
    //     console.log('成功', res)
    //   }
    // }
  },
  bindcur(e){
    console.log(e.currentTarget.dataset.type)
    this.setData({
      type: e.currentTarget.dataset.type
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
	/**   
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
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
		})
	}   
})