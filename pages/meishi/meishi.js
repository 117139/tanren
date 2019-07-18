// pages/meishi/meishi.js
const app=getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages:[],
    hangye:0,
    search:'',
    lists:[],
    type:0,
    datalist:[],
		bannerimg: [
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getquyu()
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
	},
	getquyu(){
		// console.log(pageState)
		let that = this
		const pageState1 = pageState.default(that)
	  pageState1.loading()    // 切换为loading状态
		
	
		wx.request({
			url:  app.IPurl2+'/api/region_cate/index',
			data:{},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
					
					if(rlist.length>0){
						// that.data.yhlist=that.data.yhlist.concat(rlist)
						// console.log(rlist)
						var narr=[]
						var narr1=[]
						var pages=[]
						for(var i=0;i<rlist.length;i++){
							narr.push(narr1)
							pages.push(1)
						}
						that.setData({
							datalist:rlist,
							pages:pages,
							hangye:rlist[0].region_name,
							lists:narr
						})
						that.getyhlist()
						// console.log(that.data.yhlist)
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
	
	getyhlist(){
		// /index/dining/index
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
				let rlist=res.data.retData.data
				
				if(res.data.errcode==0){
					
					if(rlist.length>0){
						that.data.lists[that.data.type]=that.data.lists[that.data.type].concat(rlist)
						console.log(rlist)
						that.data.pages[that.data.type]++
						that.setData({
							pages:that.data.pages,
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
	}
})