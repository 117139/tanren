// pages/chuzu/chuzu.js
const app = getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
		pages:[],
		hangye:-1,
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
    duration: 1000,
		sharetype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.hideShareMenu()
		this.getbanner(2)
		this.getquyu()
  },

  onRetry() {
    this.getbanner(2)
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
		this.sharerw(this.data.sharetype)
		this.setData({
			sharetype:''
		})
    this.getquyu()
    
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
  onShareAppMessage: function (res) {
		if (res.from === 'button') {
			console.log(res.target.dataset.type)
			this.setData({
				sharetype:'share'
			})
		}
		return {
		  title: '唐人街',
		  path: '/pages/share/share?type=fwcz&id='+res.target.dataset.id,
		  success: function (res) {
		    console.log('成功', res)
		  }
		}
  },
	sharerw(share){
		app.sharerw(share)
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
	onblur(e){
		var that =this
		console.log(e.detail.value)
		that.setData({
			search:e.detail.value.sr
		})
	},
	shoucangff(e){
		var that =this
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		console.log(e.currentTarget.dataset.id)
		var idx=e.currentTarget.dataset.idx
		var idx1=e.currentTarget.dataset.idx1
		wx.request({
			url:  app.IPurl+'/api/community/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'module_id':e.currentTarget.dataset.id,
				'module_type':2,
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
			
				
				if(res.data.errcode==0){
					that.data.lists[idx][idx1].user_collect = !that.data.lists[idx][idx1].user_collect
					that.setData({
						lists:that.data.lists
					})
					if(that.data.lists[idx][idx1].user_collect==1){
						that.data.lists[idx][idx1].collect--
					}else{
						that.data.lists[idx][idx1].collect++
					}
					console.log(that.data.lists[idx][idx1].user_collect)
					console.log(that.data.lists[idx][idx1].collect)
					that.setData({
						lists:that.data.lists
					})
				}else{
					
					wx.showToast({
						 icon:'none',
						 title:res.data.ertips
					})
				}
				 
			},
			fail() {
				that.setData({
					kg:1
				})
				wx.showToast({
					 icon:'none',
					 title:'操作失败'
				})
			},
			complete() {
				wx.hideLoading()
			}
		})
		
		
	},
	
	formSubmit: function(e) {
		let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		for(var i=0;i<that.data.datalist.length;i++){
			that.data.pages[i]=1
			that.data.lists[i]=[]
		}
		that.setData({
			search:e.detail.value.sr,
			pages:that.data.pages,
			lists:that.data.lists
		})
    var data1 = {
      "authorization": wx.getStorageSync('usermsg').user_token,
      "page": that.data.pages[that.data.type],
      "region_id": that.data.datalist[that.data.type].region_id,
      "search": e.detail.value.sr
    }
    console.log(JSON.stringify(data1))
		wx.request({
			url:  app.IPurl+'/api/rent_house/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.pages[that.data.type],
				"region_id":that.data.datalist[that.data.type].region_id,
				"search":e.detail.value.sr
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
					
					// if(rlist.length>0){
						that.data.pages[that.data.type]++
						that.data.lists[that.data.type]=rlist
						console.log(rlist)
						that.setData({
							lists:that.data.lists,
							pages:that.data.pages
						})
						console.log(that.data.yhlist)
					// }
					// if(rlist.length<10){
					// 	console.log('没了')
					// 	
					// }
					if(rlist.length==0){
						 wx.showToast({
						 icon:'none',
						 title:'暂无数据'
						})
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
	getquyu(){
		// console.log(pageState)
		let that = this
		const pageState1 = pageState.default(that)
    if (that.data.hangye==-1){
      pageState1.loading()    // 切换为loading状态
    }
	  
		
	
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
							hangye:rlist[0].region_id,
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
	getyhlist(fir){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/rent_house/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.pages[that.data.type],
				"region_id":that.data.datalist[that.data.type].region_id,
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
			phoneNumber: e.currentTarget.dataset.tel+'' //仅为示例，并非真实的电话号码
		})
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
	}
	
})