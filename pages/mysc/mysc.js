// pages/mysc/mysc.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		page:1,
		lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getyhlist()
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
	getyhlist(fir){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/my/collect',
			data:{
				"authorization":wx.getStorageSync('usermsg').user_token,
				"page":that.data.page,
				
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
					if(res.data.retData.data&&rlist.length>0){
						that.data.lists=that.data.lists.concat(rlist)
						console.log(rlist)
						that.data.page++
						that.setData({
							page:that.data.page,
							lists:that.data.lists
						})
						console.log(that.data.yhlist)
					}else{
					
							wx.showToast({
								 icon:'none',
								 title:'没有更多数据了'
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
  dianzan(e) {
    var that = this
    console.log(e.currentTarget.dataset.id)
    var idx = e.currentTarget.dataset.idx
    var idx1 = e.currentTarget.dataset.idx1
    wx.request({
      url: app.IPurl + '/api/community/praise',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        'community_id': e.currentTarget.dataset.id
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          that.data.lists[idx1].user_praise = !that.data.lists[idx1].user_praise
          that.setData({
            lists: that.data.lists
          })
          if (that.data.lists[idx1].user_praise == 1) {
            that.data.lists[idx1].praise--
          } else {
            that.data.lists[idx1].praise++
          }
          console.log(that.data.lists[idx1].user_praise)
          console.log(that.data.lists[idx1].praise)
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
    console.log(e.currentTarget.dataset.id)
    var idx1 = e.currentTarget.dataset.idx1
    wx.request({
      url: app.IPurl + '/api/community/collect',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        'module_id': e.currentTarget.dataset.id,
        'module_type': e.currentTarget.dataset.type,
				
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)


        if (res.data.errcode == 0) {
          that.data.lists[idx1].user_collect = !that.data.lists[idx1].user_collect
          that.setData({
            lists: that.data.lists
          })
          if (that.data.lists[idx1].user_collect == 1) {
            that.data.lists[idx1].collect--
          } else {
            that.data.lists[idx1].collect++
          }
          console.log(that.data.lists[idx1].user_collect)
          console.log(that.data.lists[idx1].collect)
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
	jump(e){
    app.jump(e)
  },
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
		})
	},
  previewImage(e){
    app.previewImage(e)
  }
})