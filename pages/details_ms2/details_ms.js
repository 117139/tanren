// pages/details_ms/details_ms.js
const app=getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnkg:0,
		page:1,
		sqid:'',
		num:0,
		zan:0,
		shoucang:0,
		show: false,
		fbtext:'',
		
		dataxq:{
		},
		dataxqpl:[],
		tmpdata:{
			fblen:0,
			imgb:[],
			call:0,
			weishen:0,
			weidao:0,
			fuwu:0
		},
		sharetype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options.id)
		this.getdetails(options.id)
		this.setData({
			sqid:options.id
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
		this.getpl()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
		this.setData({
			sharetype:'share'
		})
		if (res.from === 'button') {
			// console.log(res.target.dataset.supid)
    }
    // return {
    //   title: '转发',
    //   path: '/pages/share/share/?supid=' + res.target.dataset.type,
    //   success: function (res) {
    //     console.log('成功', res)
    //   }
    // }
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
	dianzan(e){
		console.log(e.currentTarget.dataset.id)
		this.setData({
			zan:!this.data.zan
		})
	},
	onClose() {
    this.setData({ show: false });
  },
	showpp(){
    // this.setData({ show: true });
		wx.navigateTo({
			url:'/pages/jiudianpl/jiudianpl?sqid='+this.data.sqid
		})
  },
	
	shoucangff(e){
		var that =this
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
				"module_type":6
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
	
	getdetails(id){
		var that =this
		const pageState1 = pageState.default(that)
		pageState1.loading()    // 切换为loading状态
		wx.request({
			url:  app.IPurl+'/index/hotel/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"hotel_id":id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'post',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					
					let rlist=res.data.retData
					// if(rlist.length>0){
						if(rlist.user_comment.data.length>0){
							that.data.page++
						}
						that.setData({
              dataxq: rlist.hotel[0],
							shoucang:rlist.hotel[0].user_collect,
							dataxqpl:rlist.user_comment.data,
							page:that.data.page
						})
					// that.getpl()
					pageState1.finish()    // 切换为finish状态
				}else{
					 wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
					pageState1.error()
				}
				
			},
			fail() {
				 wx.showToast({
					 icon:'none',
					 title:'操作失败'
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
			url:  app.IPurl+'/index/dining/selectcomm',
			data:{
				'model_type':2,   //(0->查美食 1->查叫车 2->查酒店),
				"model_id":that.data.sqid,
				'page':that.data.page
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					
					let rlist=res.data.retData.data
					var total =res.data.retData.total
					if(rlist.length>0){
						that.data.dataxqpl=that.data.dataxqpl.concat(rlist)
						that.data.page++
						that.setData({
							page:that.data.page,
							dataxqpl:that.data.dataxqpl,
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
	previewImage(e){
		app.previewImage(e)
	},
	onRetry(){
		this.getdetails(this.data.sqid)
	},
	
})