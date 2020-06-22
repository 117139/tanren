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
    page_zt:1,
		search:'',
		ak:"HHnGRVsuG6aDpQQQveZnpOE14sk1ZyLd", //填写申请到的ak  
    markers: [],  
    longitude:'',   //经度  
    latitude:'',    //纬度  
    address:'',     //地址  
    cityInfo:{},    //城市信息 
		NewDate:[],    //时间
    bannerimg: [],
		tuijian:[],
		lists:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    currentIndex:0
  },
  onLoad: function () {
		// this.getdizhi()
		this.gettime()
		this.getbanner()
		/*this.gettuijian()
		this.getshoplist(0)*/
		// this.getSetting()
  },
  onShow: function() {
    var that =this
    this.setData({
      page: 1,
      page_zt: 1,
      tuijian: [],
      lists: [],
    })
    setTimeout(function(){
      that.gettuijian()
      that.getshoplist(0)
    },800)
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    console.log(1)
		this.getshoplist()
  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target.dataset.type)
    }
  },
  handleChange: function (e) {
    var that =this
    console.log(e.detail.current)
    that.setData({
      currentIndex: e.detail.current
    })
    if (e.detail.current == that.data.tuijian.length-1){
      console.log('ajax')
      that.gettuijian()
    }
  },
  zt_jiazai(){
    console.log(1)
    var that =this
    // that.data.tuijian.push(that.data.tuijian[0])
    // that.setData({
    //   tuijian: that.data.tuijian
    // })
    that.gettuijian()
  },
	//获取首页list（推荐内容）
	getshoplist(type){
		let that = this	
		wx.request({
      url: app.IPurl +'/api/recommend/index',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
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
	getSetting:function(){ //获取用户的当前设置
    const _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true)                     {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.goAddress();
        }
        else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          _this.goAddress();
        }
      }
    })
  },
	goAddress(){
		wx.getLocation({
		 type: 'wgs84',
		 success (res) {
			 const latitude = res.latitude
			 const longitude = res.longitude
			 const speed = res.speed
			 const accuracy = res.accuracy
			 console.log(latitude,longitude)
		 }
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
      url: app.IPurl +'/api/hot_subject/index',
			data:{
        "authorization": wx.getStorageSync('usermsg').user_token,
				"page":that.data.page_zt,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errcode==0){
          let rlist = res.data.retData.data
          if (rlist.length>0){
            that.data.page_zt++
          }
          that.data.tuijian = that.data.tuijian.concat(rlist)
          that.setData({
            tuijian: that.data.tuijian,
            page_zt: that.data.page_zt
          })
				
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
	dianzan(e){
    var that = this
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		console.log(e.currentTarget.dataset.id)
		var idx1=e.currentTarget.dataset.idx1
		wx.request({
      url: app.IPurl +'/api/recommend/praise',
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
    var that = this
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		console.log(e.currentTarget.dataset.id)
		var idx1=e.currentTarget.dataset.idx1
		wx.request({
      url: app.IPurl +'/api/recommend/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				'module_id':e.currentTarget.dataset.id,
				'module_type':10
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
		// this.getdizhi()
		// this.gettime()
		// this.getbanner()
		// this.gettuijian()
    this.gettime()
    this.getbanner()
    this.gettuijian()
    this.getshoplist(0)
		// this.getshoplist(0)
	}
})
