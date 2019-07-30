// pages/jiudian/jiudian.js
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
    bannerimg: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    mstj:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	this.getbanner(6)
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
		this.getyhlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindcur(e){
		var that =this
    console.log(e.currentTarget.dataset.type)
    that.setData({
      type: e.currentTarget.dataset.type
    })
		if(that.data.lists[that.data.type].length==0){
			that.getyhlist()
		}
  },
	getbanner(num){
		//192.168.129.119/index/turns/index
		let that = this
		wx.request({
			url:  app.IPurl+'/index/turns/index',
			data:{
				"turns_class":num,
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					
					let rlist=res.data.retData
					that.setData({
						bannerimg:rlist
					})
				
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
	},
	getquyu(){
		// console.log(pageState)
		let that = this
		const pageState1 = pageState.default(that)
	  pageState1.loading()    // 切换为loading状态
		
	
		wx.request({
			url:  app.IPurl+'/api/region_cate/index',
			data:{},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					let rlist=res.data.retData
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
			url:  app.IPurl+'/index/hotel/first',
			data:{
				"page":that.data.pages[that.data.type],
				"region_name":that.data.datalist[that.data.type].region_name,
				"hotel_content":that.data.search
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				if(res.data.errCode==0){
					let rlist=res.data.retData.hotel.data
					console.log(rlist)
					// let tuijian1=res.data.retData.elect
					// console.log(res.data.retData.elect)
					that.setData({
						mstj:res.data.retData.elect
					})
					
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
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
		})
	},
	jump(e){
		app.jump(e)
	},
})