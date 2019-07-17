// pages/shequ/shequ.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
		datalist: [
		  {
		    "name": "唐人街",
		    list: [
		      1, { "img": [1] }, { "img": [1, 1, 1] }, { "img": [1, 1, 1, 1, 1] }, 5
		    ]
		  }, {
		    "name": "布鲁克林",
		    list: [
		      1, 2, 3, 4, 5
		    ]
		  }, {
		    "name": "法拉盛",
		    list: [
		      1, 2, 3, 4, 5
		    ]
		  }
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
		text: '51淘甄貨,一个可以省钱的购物平台平台平台平台',
		marqueePace: 1,//滚动速度
		marqueeDistance: 0,//初始滚动距离
		size: 14,
		orientation: 'left',//滚动方向
		interval1: 20 // 时间间隔
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
		console.log('show')
    var that = this;
    var length = '';//文字长度
		var obj=wx.createSelectorQuery();
		obj.selectAll('.marquee_text').boundingClientRect();
		obj.exec(function (rect) {
			console.log(rect)
				console.log(rect[0][0].height)
				console.log(rect[0][0].width)
				length=rect[0][0].width
				console.log(length)
				var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
				that.setData({
				  length: length,
				  windowWidth: windowWidth,
				});
				that.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
		}) 
    
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
  bindcur(e) {
    console.log(e.currentTarget.dataset.type)
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
	runMarquee: function () {
    var that = this;
    var interval = setInterval(function () {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval1);
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
    app.previewImage(e)
  },
	jump(e){
		app.jump(e)
	}
})