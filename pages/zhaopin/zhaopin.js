// pages/zhaopin/zhaopin.js
const app = getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnkg:0,
		pages:[],
		search:'',
    type:0,
		datalist:[],
		lists:[],
    bannerimg: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
		sharetype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   console.log(1)
	 wx.hideShareMenu()
	 this.getbanner()
	 this.gethanye()
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
    this.sharerw(this.data.sharetype)
		this.setData({
			sharetype:''
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
		console.log('触底')
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
      path: '/pages/share/share?type=zpqz&id='+res.target.dataset.id,
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
		console.log(e.currentTarget.dataset.id)
		var idx=e.currentTarget.dataset.idx
		var idx1=e.currentTarget.dataset.idx1
    if (that.data.btnkg == 1) {
      return
    } else {
      that.setData({
        btnkg: 1
      })
    }
		wx.request({
			url:  app.IPurl+'/api/community/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'module_id':e.currentTarget.dataset.id,
				'module_type':3,
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
			
        that.setData({
          btnkg: 0
        })
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
          that.setData({
            btnkg: 0
          })
          if (res.data.ertips){
            wx.showToast({
              icon: 'none',
              title: res.data.ertips
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '操作失败'
            })
          }
				}
				 
			},
			fail() {
        that.setData({
          btnkg: 0,
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
    if (that.data.btnkg == 1) {
      return
    } else {
      that.setData({
        btnkg: 1
      })
    }
		wx.request({
			url:  app.IPurl+'/api/job_seek/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.pages[that.data.type],
				"profession_id":that.data.datalist[that.data.type].id,
				"search":e.detail.value.sr
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
        that.setData({
          btnkg: 0
        })
				if(res.data.errcode==0){
					let rlist=res.data.retData.data
					
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
				}else{
          that.setData({
            btnkg: 0
          })
          if (res.data.ertips) {
            wx.showToast({
              icon: 'none',
              title: res.data.ertips
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '操作失败'
            })
          }
        }
			},
			fail() {
        that.setData({
          btnkg: 0
        })
				 wx.showToast({
					 icon:'none',
					 title:'操作失败'
				 })
			}
		})
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
	//获取首页list（搜索）
	gethanye(){
		// console.log(pageState)
		let that = this
		const pageState1 = pageState.default(that)
	  pageState1.loading()    // 切换为loading状态
		
	
		wx.request({
			url:  app.IPurl+'/api/profession_cate/index',
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
							hangye:rlist[0].id,
							lists:narr
						})
						that.getyhlist()
						// console.log(that.data.yhlist)
					}
					
					 pageState1.finish()    // 切换为finish状态
				}else{
          pageState1.error()    // 切换为error状态
          if (res.data.ertips) {
            wx.showToast({
              icon: 'none',
              title: res.data.ertips
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '获取失败'
            })
          }
        }
				
				  // pageState1.error()    // 切换为error状态
			},
			fail() {
				pageState1.error()    // 切换为error状态
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
			}
		})
	},
	getyhlist(fir){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/job_seek/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.pages[that.data.type],
				"profession_id":that.data.datalist[that.data.type].id,
				"search":that.data.search
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					let rlist=res.data.retData.data
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
	getbanner(){
		//192.168.129.119/index/turns/index
		let that = this
		wx.request({
			url:  app.IPurl+'/index/turns/index',
			data:{
				"turns_class":1,
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
					
					
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