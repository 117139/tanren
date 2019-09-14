// pages/bgpingtai/bgpingtai.js
const app = getApp()
var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: [1, 1, 1],
    hangye: 0,
    search: '',
    lists: [
      [],
      [],
      []
    ],
    type: 0,
    datalist: [
      '最新',
      '热门',
      '精华',
    ],
    bannerimg: [
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
      '/static/images/banner_03.jpg',
    ],
    zdxx: '',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    text: '51淘甄貨,一个可以省钱的购物平台平台平台平台',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    size: 14,
    orientation: 'left',//滚动方向
    interval1: 20 // 时间间隔
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanner(7)

    this.getxiaoxi()
  },
  onRetry() {
    var that=this
    that.getbanner(7)

    that.getxiaoxi()
    setTimeout(function(){
      that.setData({
        pages: [1, 1, 1],
        lists: [
          [],
          [],
          []
        ],
      })
      that.getyhlist(1)
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
    this.setData({
      pages: [1, 1, 1],
      lists: [
        [],
        [],
        []
      ],
    })
    this.getyhlist(1)

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
    }
  },
  bindcur(e) {
    var that = this
    console.log(e.currentTarget.dataset.type)
    that.setData({
      type: e.currentTarget.dataset.type
    })
    if (that.data.lists[that.data.type].length == 0) {
      that.getyhlist()
    }
  },
  onblur(e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      search: e.detail.value.sr
    })
  },
  dianzan(e) {
    var that = this
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    console.log(e.currentTarget.dataset.id)
    var idx = e.currentTarget.dataset.idx
    var idx1 = e.currentTarget.dataset.idx1
    
    wx.request({
      url: app.IPurl + '/api/exposure/praise',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        'exposure_id': e.currentTarget.dataset.id
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          that.data.lists[idx][idx1].user_praise = !that.data.lists[idx][idx1].user_praise
          that.setData({
            lists: that.data.lists
          })
          if (that.data.lists[idx][idx1].user_praise == 1) {
            that.data.lists[idx][idx1].praise--
          } else {
            that.data.lists[idx][idx1].praise++
          }
          console.log(that.data.lists[idx][idx1].user_praise)
          console.log(that.data.lists[idx][idx1].praise)
          that.setData({
            lists: that.data.lists
          })
        } else {

          wx.showToast({
            icon: 'none',
            title: res.data.ertips
          })
        }

      },
      fail() {
        that.setData({
          kg: 1
        })
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      },
      complete() {
        wx.hideLoading()
      }
    })


  },
  shoucangff(e) {
    var that = this
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    console.log(e.currentTarget.dataset.id)
    var idx = e.currentTarget.dataset.idx
    var idx1 = e.currentTarget.dataset.idx1
    wx.request({
      url: app.IPurl + '/api/exposure/collect',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        'module_id': e.currentTarget.dataset.id,
        'module_type': 8,
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          that.data.lists[idx][idx1].user_collect = !that.data.lists[idx][idx1].user_collect
          that.setData({
            lists: that.data.lists
          })
          if (that.data.lists[idx][idx1].user_collect == 1) {
            that.data.lists[idx][idx1].collect--
          } else {
            that.data.lists[idx][idx1].collect++
          }
          console.log(that.data.lists[idx][idx1].user_collect)
          console.log(that.data.lists[idx][idx1].collect)
          that.setData({
            lists: that.data.lists
          })
        } else {

          wx.showToast({
            icon: 'none',
            title: res.data.ertips
          })
        }

      },
      fail() {
        that.setData({
          kg: 1
        })
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      },
      complete() {
        wx.hideLoading()
      }
    })


  },
  formSubmit: function (e) {
    let that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    for (var i = 0; i < that.data.datalist.length; i++) {
      that.data.pages[i] = 1
      that.data.lists[i] = []
    }
    that.setData({
      search: e.detail.value.sr,
      pages: that.data.pages,
      lists: that.data.lists
    })
    var tnt = that.data.type
    if (tnt == 0) {
      tnt = 3
    }
    wx.request({
      url: app.IPurl + '/api/exposure/index',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        "page": that.data.pages[that.data.type],
        "order": tnt,
        "search": e.detail.value.sr
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)
        let rlist = res.data.retData.data

        if (res.data.errcode == 0) {

          // if(rlist.length>0){
          that.data.pages[that.data.type]++
          that.data.lists[that.data.type] = rlist
          console.log(rlist)
          that.setData({
            lists: that.data.lists,
            pages: that.data.pages
          })
          console.log(that.data.yhlist)
          // }
          // if(rlist.length<10){
          // 	console.log('没了')
          // 	
          // }
          if (rlist.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '暂无数据'
            })
          }
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      }
    })
  },
  getyhlist(fir) {
    // console.log(pageState)
    let that = this
    var tnt = that.data.type
    if (tnt == 0) {
      tnt = 3
    }
    wx.request({
      url: app.IPurl + '/api/exposure/index',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        "page": that.data.pages[that.data.type],
        "order": tnt,
        "search": that.data.search
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          let rlist = res.data.retData.data
          if (rlist.length > 0) {
            that.data.lists[that.data.type] = that.data.lists[that.data.type].concat(rlist)
            console.log(rlist)
            that.data.pages[that.data.type]++
            that.setData({
              pages: that.data.pages,
              lists: that.data.lists
            })
            console.log(that.data.yhlist)
          } else {
            // if(that.data.search){
            wx.showToast({
              icon: 'none',
              title: '没有更多数据了'
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
          icon: 'none',
          title: '操作失败'
        })
      }
    })
  },
	/**   
	 * 预览图片  
	 */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var arr1 = []
    arr1.push(current)
    console.log(arr1);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: arr1 // 需要预览的图片http链接列表  
    })
  },
  call(e) {
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel+'' //仅为示例，并非真实的电话号码
    })
  },
  getbanner(num) {
    //192.168.129.119/index/turns/index
    let that = this
    const pageState1 = pageState.default(that)
    pageState1.loading()    // 切换为loading状态
    wx.request({
      url: app.IPurl + '/index/turns/index',
      data: {
        "turns_class": num,
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          let rlist = res.data.retData
          that.setData({
            bannerimg: rlist
          })
          pageState1.finish()    // 切换为finish状态
        } else {
          wx.showToast({
            icon: 'none',
            title: '操作失败'
          })
          pageState1.error()
        }

      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
        pageState1.error()
      }
    })
  },
  getxiaoxi() {
    //192.168.129.119/index/turns/index
    let that = this

    wx.request({
      url: app.IPurl + '/api/marquee/index',
      data: {

      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          let rlist = res.data.retData
          that.setData({
            zdxx: rlist
          })
          // setTimeout(function() {
          // 	console.log('show')
          // 	// var that = this;
          // 	var length = '';//文字长度
          // 	var obj=wx.createSelectorQuery();
          // 	obj.selectAll('.marquee_text').boundingClientRect();
          // 	obj.exec(function (rect) {
          // 		console.log(rect)
          // 			console.log(rect[0][0].height)
          // 			console.log(rect[0][0].width)
          // 			length=rect[0][0].width
          // 			console.log(length)
          // 			var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
          // 			that.setData({
          // 			  length: length,
          // 			  windowWidth: windowWidth,
          // 			});
          // 			that.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
          // 	}) 
          // }, 10);
        } else {
          wx.showToast({
            icon: 'none',
            title: '操作失败'
          })

        }

      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
        pageState1.error()
      }
    })
  },
  jump(e) {
    app.jump(e)
  },
  runMarquee: function () {
    var that = this;
    var interval = setInterval(function () {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval1);
  },
})