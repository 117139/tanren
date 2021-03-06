// pages/jiudianpl/jiudianpl.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		sqid:'',
		fbtext:'',
		tmpdata:{
			fblen:0,
			imgb:[],
			call:0,
			weishen:0,
			weidao:0,
			fuwu:0
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({
			sqid:options.sqid
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
  onShareAppMessage: function () {

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
					that.data.tmpdata.imgb.splice(e.currentTarget.dataset.idx,1)
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
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log(res)
				const tempFilePaths = res.tempFilePaths
				const imglen=that.data.tmpdata.imgb.length
				for(var i=0;i<tempFilePaths.length;i++){
					// console.log(imglen)
					var newlen=Number(imglen)+Number(i)
					// console.log(newlen)
					if(newlen==9){
						wx.showToast({
							icon:'none',
							title:'最多可上传九张'
						})
						break;
					}
					wx.uploadFile({
							url: app.IPurl+'/api/upload_image/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[i],
							name: 'images',
							formData: {
								'module_name': 'used'
							},
							success (res){
								console.log(res.data)
								var ndata=JSON.parse(res.data)
								console.log(ndata)
								console.log(ndata.errcode==0)
								if(ndata.errcode==0){
									that.data.tmpdata.imgb.push(ndata.retData[0])
									that.setData({
										tmpdata:that.data.tmpdata
									})
								}else{
									wx.showToast({
										icon:"none",
										title:"上传失败"
									})
								}
							}
						})
					
				}
			}
		})
	},
	pingfen(e){
		var that=this
		var type = e.currentTarget.dataset.type
		var pf = e.currentTarget.dataset.pf
		if(type==0){
			that.data.tmpdata.weidao=pf
		}else if(type==1){
			that.data.tmpdata.weishen=pf
		}else if(type==2){
			that.data.tmpdata.fuwu=pf
		}else{
			
		}
		that.data.tmpdata.call=(that.data.tmpdata.weidao*1+that.data.tmpdata.weishen*1+that.data.tmpdata.fuwu*1)/3
		that.setData({
			tmpdata:that.data.tmpdata
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
		if(that.data.tmpdata.fuwu==0||that.data.tmpdata.weishen==0||that.data.tmpdata.weidao==0){
			wx.showToast({
				icon:"none",
				title:"请进行打分"
			})
			return
		}
		wx.showModal({
			title: '提示',
			content: '是否要发布该评论',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.setData({
						kg:0
					})
					var imbox=that.data.tmpdata.imgb
					imbox=imbox.join(',')
					wx.showLoading({
						title:'请稍后。。'
					})
					// 'Authorization':wx.getStorageSync('usermsg').user_token
					wx.request({
						url:  app.IPurl+'/index/hotel/comment',
						data:{
							"authorization":wx.getStorageSync('usermsg').user_token,
							"id":wx.getStorageSync('usermsg').id,
							'hotel_id':that.data.sqid,
							'comment_content':that.data.fbtext,
							'comment_service':that.data.tmpdata.fuwu,   //服务评分
							'comment_hygiene':that.data.tmpdata.weishen,   //卫生评分
							'comment_ambient':that.data.tmpdata.weidao,     //味道评分 环境
							'path':imbox,
							'module_name':'community'
						},
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded'
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							wx.hideLoading()
							console.log(res.data)
						
							
							if(res.data.errCode==0){
								// that.getpl(1)
								wx.showToast({
									 icon:'none',
									 title:'发表成功'
								})
								setTimeout(function(){
									wx.navigateBack()
									
								},1000)
								
							}else{
								that.setData({
									kg:1
								})
								wx.showToast({
									 icon:'none',
									 title:res.data.ertips
								})
							}
							
							 
						},
						fail() {
							wx.hideLoading()
							that.setData({
								kg:1
							})
							wx.showToast({
								 icon:'none',
								 title:'操作失败'
							})
						},
						complete() {
						}
					})
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	
	},
})