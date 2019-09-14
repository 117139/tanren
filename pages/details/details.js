// pages/details/details.js
const app=getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnkg:0,
		sqid:"",
		shoucang:'',
		page:1,
		num:0,
		zan:0,
		show: false,
		fbtext:'',
		total:0,
		dataxq:{},
		dataxqpl:[],
		tmpdata:{
			fblen:0,
			imgb:[]
		},
		sharetype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options.id)
		this.setData({
			sqid:options.id
		})
		this.getdetails(options.id)
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
    this.getdetails(this.data.sqid)
		this.sharerw(this.data.sharetype)
		this.setData({
			sharetype:''
		})
		this.setData({
			page:1
		})
		this.getpl(1)
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
  onShareAppMessage: function (res) {
		this.setData({
			sharetype:'share'
		})
		if (res.from === 'button') {
			// console.log(res.target.dataset.type)
			this.setData({
				sharetype:'share'
			})
		}
  //   return {
  //     title: '转发',
  //     path: '/pages/share/share/?spid=' + this.data.sqid,
  //     success: function (res) {
  //       console.log('成功', res)
  //     }
  //   }
  },
	
	sharerw(share){
		app.sharerw(share)
	},
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
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
				'module_id':that.data.sqid,
				"module_type":1
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
					that.setData({
						shoucang:!that.data.shoucang
					})
					if(that.data.shoucang==1){
						that.data.dataxq.collect--
					}else{
						that.data.dataxq.collect++
					}
					that.setData({
						dataxq:that.data.dataxq
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
	
	onClose() {
    this.setData({ show: false });
  },
	showpp(){
    // this.setData({ show: true });
		wx.navigateTo({
			url:'/pages/ershoupl/ershoupl?sqid='+this.data.sqid
		})
  },
	
	
	getdetails(id){
		var that =this
		const pageState1 = pageState.default(that)
		pageState1.loading()    // 切换为loading状态
		wx.request({
			url:  app.IPurl+'/api/used_product/show',
			data:{
				"used_id":id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					
					let rlist=res.data.retData
					// if(rlist.length>0){
					
						that.setData({
							dataxq:rlist,
							shoucang:rlist.user_collect,
							total:rlist.review
						})
					
					pageState1.finish()    // 切换为finish状态
				}else{
					 wx.showToast({
						 icon:'none',
						 title:'获取失败'
					})
					pageState1.error()
				}
				
			},
			fail() {
				 wx.showToast({
					 icon:'none',
           title:'获取失败'
				 })
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	getpl(type){
		var that =this
		
		if(type==1){
			that.data.page=1
			that.data.dataxqpl=[]
			that.setData({
				page:that.data.page,
				dataxqpl:that.data.dataxqpl
			})
		}
		wx.request({
			url:  app.IPurl+'/api/used_comment/index',
			data:{
				"used_id":that.data.sqid,
				'page':that.data.page
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
					var total =res.data.retData.total
					if(rlist.length>0){
						that.data.dataxqpl=that.data.dataxqpl.concat(rlist)
						that.data.page++
						that.setData({
							page:that.data.page,
							dataxqpl:rlist,
							total:total
						})
					}else{
						if(that.data.dataxqpl.length==0){
							return
						}
						wx.showToast({
							 icon:'none',
							 title:'已经到底了'
						})
					}
					
				}else{
					 wx.showToast({
						 icon:'none',
             title:'获取失败'
					})
				}
			},
			fail() {
				 wx.showToast({
					 icon:'none',
           title:'获取失败'
				 })
			}
		})
	},
	previewImage(e){
		app.previewImage(e)
	},
	onRetry(){
		this.getdetails(this.data.id)
	}
})