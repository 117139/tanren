// pages/huodong/huodong.js
const app = getApp()
// var pageState = require('../../utils/pageState/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yhlist: [],
    keyword: '',
    page: 1
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
    console.log('触底')
    this.getyhlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取活动list（搜索）
  getyhlist(type) {
    // console.log(pageState)
    let that = this
    // if(type){
    // 	
    // }else{
    // 	const pageState = pageState.default(that)
    // 	pageState.loading()    // 切换为loading状态
    // }


    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.IPurl + '/api/activity/discovery',
      data: {
        page: that.data.page,
        search: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {

        console.log(res.data)
        

        if (res.data.errcode == 0) {
          let rlist = res.data.retData.data
          if (type == "ss") {
            console.log('ss')
            that.data.yhlist = []
          }
          if (rlist.length > 0) {
            that.data.page++
            that.data.yhlist = that.data.yhlist.concat(rlist)
            console.log(rlist)
            that.setData({
              page: that.data.page,
              yhlist: that.data.yhlist
            })
            console.log(that.data.yhlist)
          } else {
            wx.showToast({
              icon: 'none',
              title: '暂无更多数据'
            })
            that.setData({
              yhlist: that.data.yhlist
            })
          }

        }else{
          if(res.data.errmsg){
            wx.showToast({
              icon: 'none',
              title: res.data.errmsg
            }) 
          }else{
            wx.showToast({
              icon: 'none',
              title: '获取数据失败'
            })
          }
        }
        wx.hideLoading()
        // pageState1.error()    // 切换为error状态
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
        // pageState.error()    // 切换为error状态
      }
    })
  },
  formSubmit: function (e) {
    let that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    that.setData({
      keyword: e.detail.value.sr,
      page: 1
    })
    that.getyhlist('ss')
  },
})