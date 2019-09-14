//logs.js
// const util = require('../../utils/util.js')
const app=getApp()
Page({
  data: {
		sqid:'',
		fbtext:'',
    tmpdata:{
    	fblen:0,
    	imgb:[]
    }
  },
  onLoad: function (options) {
    this.setData({
    	sqid:options.sqid
    })
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
            url: app.IPurl +'/api/recommend_comment/save',
						data:{
							"authorization":wx.getStorageSync('usermsg').user_token,
							'community_id':that.data.sqid,
							'body':that.data.fbtext,
							'path':imbox,
							'module_name':'community'
						},
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded'
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							console.log(res.data)
						
							
							if(res.data.errcode==0){
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
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	
	},
	
})
