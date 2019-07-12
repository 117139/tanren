//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
  onLoad: function () {
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    console.log(1)
  },
	//获取首页list（搜索）
	getshoplist(type){
		// console.log(pageState)
		const pageState1 = pageState.default(this)
	  pageState1.loading()    // 切换为loading状态
		let that = this
		if(type){
			let remove=[]
			that.setData({
				pageindex:1,
				sp:remove
			})
		}
		wx.request({
			url:  app.IPurl1+'shoplist',
			data:{
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				pageindex:that.data.pageindex,
				pagesize:that.data.pagesize,
				goods_category_id: 0,            //(分类) 
				keyword:that.data.keyword      //(搜索关键字)
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				// console.log(res.data.list)
				let rlist=res.data.list
				
				if(res.data.error==0){
					
					if(rlist.length>0){
						
						
						
					}
					if(rlist.length<10){
						console.log('没了')
						// that.setData({
						// 	more:false
						// })
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
	
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  }
})
