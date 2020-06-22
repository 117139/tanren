// pages/myjf/myjf.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		jifen:0,
		show: false,
		tmpdata:{},
    money:0,
    in_id:'',
    sticky:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getjf()
		this.getrenwu()
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

  },
	getjf(){
		let that = this
		wx.request({
			url:  app.IPurl+'/index/personal/integral',
			data:{
				"id":wx.getStorageSync('usermsg').id
				
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					// let rlist=res.data.retData.data
					that.setData({
						jifen:res.data.retData,
            
					})
							
						
					
				}else{
					wx.showToast({
						 icon:'none',
						 title:'没有更多数据了'
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
	getrenwu(){
		let that = this
		wx.request({
			url:  app.IPurl+'/index/personal/select_task',
			data:{
				"id":wx.getStorageSync('usermsg').id
				
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'post',
			success(res) {
				console.log(res.data)
				
				
				if(res.data.errCode==0){
					// let rlist=res.data.retData.data
					that.setData({
						tmpdata:res.data.retData,
            sticky: res.data.sticky
					})
							
						
					
				}else{
					wx.showToast({
						 icon:'none',
						 title:'没有更多数据了'
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
	/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	onClose() {
	  this.setData({ show: false });
	},
	onClose1() {
	  this.setData({ show: false });
	// },
  // //获取支付信息
  // Pay() {
    let that = this
    
    // console.log(JSON.stringify(datas))
    wx.request({
      url: app.IPurl + '/api/integral_pay/index',
      data: {
        "authorization": wx.getStorageSync('usermsg').user_token,
        integral_id: that.data.in_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log('194' + res.data);
        if (res.data.code == 0) {
          app.doWxPay(res.data);
        } else {
          if(res.data.ertips){
            wx.showToast({
              icon:'none',
              title: res.data.ertips,
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '操作失败',
            })
          }
        }

      },
      fail: function (err) {
        wx.showToast({
          icon: "none",
          title: '服务器异常，请稍候再试'
        })
      },
    });
  },
	showpp(e){
		console.log(e.currentTarget.dataset.mon)
		this.setData({
			show: true ,
      money: e.currentTarget.dataset.mon,
			in_id:e.currentTarget.dataset.id
		});
	},
})