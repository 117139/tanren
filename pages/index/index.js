//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../libs/bmap/bmap-wx.min.js');
 var wxMarkerData = [];  //定位成功回调对象
var pageState = require('../../utils/pageState/index.js')
const util = require('../../utils/util.js')
Page({
  data: {
		page:1,
		search:'',
		ak:"HHnGRVsuG6aDpQQQveZnpOE14sk1ZyLd", //填写申请到的ak  
    markers: [],  
    longitude:'',   //经度  
    latitude:'',    //纬度  
    address:'',     //地址  
    cityInfo:{},    //城市信息 
		NewDate:[],    //时间
    bannerimg: [
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
    ],
		tuijian:[],
		lists:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  onLoad: function () {
		// this.getdizhi()
		this.gettime()
		this.getbanner()
		this.gettuijian()
		this.getshoplist(0)
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    console.log(1)
		this.getshoplist()
  },
	//获取首页list（搜索）
	getshoplist(type){
		let that = this	
		wx.request({
			url:  app.IPurl+'/api/community/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'recommend':1,
				'search':that.data.search,
				'page':that.data.page
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
					let rlist=res.data.retData.data
					console.log(rlist)
					if(rlist.length>0){
						that.data.page++
						that.data.lists=that.data.lists.concat(rlist)
						that.setData({
							page:that.data.page,
							lists:that.data.lists
						})
						
					}else{
						wx.showToast({
							 icon:'none',
							 title:'已经到底了'
						})
					}
					
				}
			},
			fail() {
				wx.showToast({
					 icon:'none',
					 title:'获取信息失败'
				})
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
  },
	getdizhi(){
		var that = this;  
    /* 获取定位地理位置 */  
    // 新建bmap对象   
    var BMap = new bmap.BMapWX({   
        ak: that.data.ak   
    });   
    var fail = function(data) {   
        console.log(data);  
    };   
    var success = function(data) {   
        //返回数据内，已经包含经纬度  
        console.log(data);  
        //使用wxMarkerData获取数据  
        wxMarkerData = data.wxMarkerData;    
        //把所有数据放在初始化data内  
        that.setData({   
            markers: wxMarkerData,  
            latitude: wxMarkerData[0].latitude,  
            longitude: wxMarkerData[0].longitude,  
            address: wxMarkerData[0].address,  
            cityInfo: data.originalData.result.addressComponent  
        });   
    }   
    // 发起regeocoding检索请求   
    BMap.regeocoding({   
        fail: fail,   
        success: success  
    });
	},
	gettime(){
		let time = util.formatTime(new Date());
		let date=util.getDates(7, time);
		console.log(date);
		this.setData({
			NewDate:date
		})
	},
	jump(e){
		console.log(e.currentTarget.dataset.url)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
	getbanner(){
		//192.168.129.119/index/turns/index
		let that = this
		const pageState1 = pageState.default(that)
		pageState1.loading()    // 切换为loading状态
		
		wx.request({
			url:  app.IPurl+'/index/turns/index',
			data:{
				"turns_class":0,
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
				 pageState1.error() 
				wx.showToast({
					 icon:'none',
					 title:'操作失败'
				})
			}
		})
	},
	gettuijian(){
		let that = this
		wx.request({
			url:  app.IPurl+'index/dining/homeelect',
			data:{
				"turns_class":0,
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					let rlist=res.data.retData
					
						that.setData({
							tuijian:rlist
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
	dianzan(e){
		var that =this
		console.log(e.currentTarget.dataset.id)
		var idx1=e.currentTarget.dataset.idx1
		wx.request({
			url:  app.IPurl+'/api/community/praise',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'community_id':e.currentTarget.dataset.id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
			
				
				if(res.data.errcode==0){
					that.data.lists[idx1].user_praise = !that.data.lists[idx1].user_praise
					that.setData({
						lists:that.data.lists
					})
					if(that.data.lists[idx1].user_praise==1){
						that.data.lists[idx1].praise--
					}else{
						that.data.lists[idx1].praise++
					}
					console.log(that.data.lists[idx1].user_praise)
					console.log(that.data.lists[idx1].praise)
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
	shoucangff(e){
		var that =this
		console.log(e.currentTarget.dataset.id)
		var idx1=e.currentTarget.dataset.idx1
		wx.request({
			url:  app.IPurl+'/api/community/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'community_id':e.currentTarget.dataset.id
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
			
				
				if(res.data.errcode==0){
					that.data.lists[idx1].user_collect = !that.data.lists[idx1].user_collect
					that.setData({
						lists:that.data.lists
					})
					if(that.data.lists[idx1].user_collect==1){
						that.data.lists[idx1].collect--
					}else{
						that.data.lists[idx1].collect++
					}
					console.log(that.data.lists[idx1].user_collect)
					console.log(that.data.lists[idx1].collect)
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
	
	onRetry(){
		this.onload()
	}
})
