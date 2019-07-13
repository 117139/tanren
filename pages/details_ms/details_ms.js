// pages/details_ms/details_ms.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		num:0,
		zan:0,
		show: false,
		fbtext:'',
		
		dataxq:{
			list:[
				1,{img:[1,2,3]},{img:[1]},1
			]
		},
		tmpdata:{
			fblen:0,
			imgb:[]
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options.id)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
		console.log(res)
		if (res.from === 'button') {
			console.log(res.target.dataset.supid)
    }
    return {
      title: '转发',
      path: '/pages/share/share/?supid=' + res.target.dataset.type,
      success: function (res) {
        console.log('成功', res)
      }
    }
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
    this.setData({ show: true });
  },
	bint(e){
		console.log(e.detail.value)
		console.log(e.detail.value.length)
		this.data.tmpdata.fblen=e.detail.value.length
		this.setData({
			fbtext:e.detail.value,
			tmpdata:this.data.tmpdata
		})
		// this.setData({
		// 	
		// 	fblen:e.detail.value.length
		// })
	},
	imgdel(e){
		var that =this
		console.log(e.currentTarget.dataset.idx)
		wx.showModal({
			title: '提示',
			content: '确定要删除这张图片吗',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.data.tmpdata.imgb.splice(e.currentTarget.dataset.idx)
					that.setData({
						tmpdata:that.data.tmpdata
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
	},
	scpic(){
		var that=this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log(res)
				const tempFilePaths = res.tempFilePaths
				that.data.tmpdata.imgb.push(res.tempFilePaths[0])
				that.setData({
					tmpdata:that.data.tmpdata
				})
			}
		})
	},
	fabusub(){
		var that =this
		if(that.data.fbtext==""){
			wx.showToast({
				icon:"none",
				title:"请输入您的评论"
			})
			return
		}
		wx.showModal({
			title: '提示',
			content: '是否要发布该评论',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					console.log(that.data.fbtext)
					console.log(that.data.tmpdata.imgb)
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
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
  }
})