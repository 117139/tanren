//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../libs/bmap/bmap-wx.min.js');
 var wxMarkerData = [];  //定位成功回调对象
var pageState = require('../../utils/pageState/index.js')
const util = require('../../utils/util.js')
Page({
  data: {
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
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  onLoad: function () {
		this.getdizhi()
		this.gettime()
		this.getbanner()
		this.getshoplist(0)
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
		pageState1.finish()
		return
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
