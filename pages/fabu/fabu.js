// pages/fabu/fabu.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		kg:1,
		num:0,
		zan:0,
		show: false,
		fbtext:'',
		datalist:[],
		array: ['主题1', '主题2', '主题3', '主题4'],
		dataxq:{
			img:[1,1,1]
		},
		tmpdata:{
			fblen:0,
			imgb:[],
			zhidingcur:-1,
			zhiding:[1,2,3,4]
		},
		usertel:'',
		userpri:'',
		useraddress:'',
		hangyelb:'', //区域
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options.id)
		this.getzhuti()
		this.getzhiding()
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
				for(var i=0;i<tempFilePaths.length;i++){
					if(that.data.tmpdata.imgb.length==9){
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
	getzhuti(){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/topic_cate/index',
			data:{},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
					
					// if(rlist.length>0){
						that.setData({
							datalist:rlist,
						})
					
					// }
					
				}
				
				 
			},
			fail() {
				wx.showToast({
					 icon:'none',
					 title:'获取行业失败'
				})
			}
		})
	},
	getzhiding(){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/sticky/index',
			data:{},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				let rlist=res.data.retData
				
				if(res.data.errcode==0){
						that.data.tmpdata.zhiding=rlist
					// if(rlist.length>0){
						that.setData({
							tmpdata:that.data.tmpdata,
						})
					
					// }
					
				}
				
				 
			},
			fail() {
				wx.showToast({
					 icon:'none',
					 title:'获取行业失败'
				})
			}
		})
	},
	fabusub(){
		var that =this
		if(that.data.fbtext==""){
			wx.showToast({
				icon:"none",
				title:"请输入您的动态内容"
			})
			return
		}
		if(that.data.hangyelb==""){
			wx.showToast({
				icon:"none",
				title:"请选择主题"
			})
			return
		}
		wx.showModal({
			title: '提示',
			content: '是否要发布该动态',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.setData({
						kg:0
					})
					wx.showLoading({
						title:'请稍后。。'
					})
					// 'Authorization':wx.getStorageSync('usermsg').user_token
					var dztime
					if(that.data.tmpdata.zhidingcur==-1){
						dztime=0
					}else{
						dztime=that.data.tmpdata.zhiding[that.data.tmpdata.zhidingcur].id
					}
					var imbox=that.data.tmpdata.imgb
					imbox=imbox.join(',')
					wx.request({
						url:  app.IPurl+'/api/community/save',
						data:{
							"authorization":wx.getStorageSync('usermsg').user_token,
							'topic_id':that.data.hangyelb.id,
							'body':that.data.fbtext,
							'sticky_id':dztime,
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
						
							
							if(res.data.errcode==0){
								
								wx.showToast({
									 icon:'none',
									 title:'发表成功',
									 duration:2000
								})
								setTimeout(function(){
									wx.switchTab({
										url: "/pages/shequ/shequ"
									})
								},1000)
								
							}else{
								that.setData({
									kg:1
								})
								wx.showToast({
									 icon:'none',
									 title:res.data.ertips,
									 duration:2000
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
	bindPickerChange: function(e) {
	  console.log('picker发送选择改变，携带值为', e.detail.value)
		var that= this
	  that.setData({
			index:e.detail.value,
	    hangyelb:that.data.datalist[e.detail.value]
	  })
	},
	zhidingSelet(e){
		console.log(e.currentTarget.dataset.idx)
		var that =this
		that.data.tmpdata.zhidingcur=e.currentTarget.dataset.idx
		that.setData({
			tmpdata:that.data.tmpdata
		})
	}
})