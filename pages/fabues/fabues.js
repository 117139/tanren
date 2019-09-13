// pages/fabues/fabues.js

const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		btnkg:0,
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
		this.gethanye()
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
  scpic() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        that.upimg(tempFilePaths, 0)

      }
    })
  },
  upimg(imgs, i) {
    var that = this
    const imglen = that.data.tmpdata.imgb.length
    var newlen = Number(imglen) + Number(i)
    if (imglen == 9) {
      wx.showToast({
        icon: 'none',
        title: '最多可上传九张'
      })
      return
    }
    // console.log(img1)
    wx.uploadFile({
      url: app.IPurl + '/api/upload_image/upload',
      filePath: imgs[i],
      name: 'images',
      formData: {
        'module_name': 'used'
      },
      success(res) {
        // console.log(res.data)
        var ndata = JSON.parse(res.data)
        console.log(ndata)
        // console.log(ndata.error == 0)
        if (ndata.errcode == 0) {
          that.data.tmpdata.imgb.push(ndata.retData[0])
          that.setData({
            tmpdata: that.data.tmpdata
          })

          var news1 = that.data.tmpdata.imgb.length
          if (news1 < 9) {
            i++
            that.upimg(imgs, i)
          }

        } else {
          wx.showToast({
            icon: "none",
            title: "上传失败"
          })
        }
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
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		if(that.data.fbtext==""){
			wx.showToast({
				icon:"none",
				title:"请输入您的发布信息"
			})
			return
		}
		if(that.data.usertel==""){
			wx.showToast({
				icon:"none",
				title:"请输入您的联系电话"
			})
			return
		}
		if(that.data.userpri==""){
			wx.showToast({
				icon:"none",
				title:"请输入具体薪资"
			})
			return
		}
		if(that.data.hangyelb==""){
			wx.showToast({
				icon:"none",
				title:"请选择地区"
			})
			return
		}
		wx.showModal({
			title: '提示',
			content: '是否要发布该信息',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
          // if (that.data.btnkg == 1) {
          //   return
          // } else {
          //   that.setData({
          //     btnkg: 1
          //   })
          // }
					wx.showLoading({
						title:'请稍后。。'
					})
					var dztime
					if(that.data.tmpdata.zhidingcur==-1){
						dztime=0
					}else{
						dztime=that.data.tmpdata.zhiding[that.data.tmpdata.zhidingcur].id
					}
					var imbox=that.data.tmpdata.imgb
					imbox=imbox.join(',')
					// 'Authorization':wx.getStorageSync('usermsg').user_token
          
					wx.request({
						url:  app.IPurl+'/api/used_product/save',
						data:{
							"authorization":wx.getStorageSync('usermsg').user_token,
							'region_id':that.data.hangyelb.region_id,
							'body':that.data.fbtext,
							'price':that.data.userpri,
							'phone':that.data.usertel,
							'sticky_id':dztime,
							'path':imbox,
							'module_name':'used'
						},
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded'
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							console.log(res.data)
							wx.hideLoading()
							
							if(res.data.errcode==0){
								
								wx.showToast({
									 icon:'none',
                  title: res.data.ertips,
									 duration:2000
								})
								setTimeout(function(){
                  that.setData({
                    btnkg: 0
                  })
									wx.navigateBack()
								},1000)
								
							}else{
                that.setData({
                  btnkg: 0
                })
                if (res.data.ertips) {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.ertips
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '操作失败'
                  })
                }
							}
							
							 
						},
						fail(err) {
							wx.hideLoading()
              that.setData({
                btnkg: 0
              })
              console.log(err)
							wx.showToast({
								 icon:'none',
								 title:'操作失败',
								duration:2000
							})
						}
					})
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	gethanye(){
		// console.log(pageState)
		let that = this
		wx.request({
			url:  app.IPurl+'/api/region_cate/index',
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
	},
	usertel(e){
		console.log(e.detail.value)
		this.setData({
			usertel:e.detail.value
		})
	},
	userpri(e){
		console.log(e.detail.value)
		this.setData({
			userpri:e.detail.value
		})
	},
	useraddress(e){
		console.log(e.detail.value)
		this.setData({
			useraddress:e.detail.value
		})
	}
	
})