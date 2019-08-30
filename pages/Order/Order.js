//order.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		id:'',
		paykg:true,
		orderxq:'',
		address:""
  },
  onLoad: function (option) {
    console.log(option.id)
		
			this.setData({
				id:option.id
			})
		this.getorder(option.id)  //获取时间地点
		
  },
	onShow(){
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1];
		if (currPage.data.addresschose) {
        this.setData({
            //将携带的参数赋值
            address: currPage.data.addresschose,
            addressBack: true
      });
 
		console.log(this.data.address, '地址')
 
		}
	},
	onReady(){
		
	},
	subbtn(){
		
		console.log(app.IPurl1)
		let that = this
		let data
		if(that.data.address.address_id==undefined||that.data.address.address_id==''){
			wx.showToast({
				icon:'none',
				title:'请选择地址'
			})
			return
		}
		if(that.data.paykg==false){
			return
		}else{
			wx.showLoading({
				title:'订单提交中...'
			})
			that.setData({
				paykg:false
			})
		}
			data={
				id:wx.getStorageSync('usermsg').id,
				// 'authorization':wx.getStorageSync('usermsg').user_token,
				goods_id:that.data.orderxq.goods_id,
				address_id:that.data.address.address_id
			}
		
		wx.request({
			url:  app.IPurl+'/index/personal/buy',
			data:data,
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				
				wx.hideLoading()
				console.log(res)
				
				if(res.data.errCode==0){
					wx.showToast({
						icon:'none',
						// title:'我们将尽快为您寄送您所兑换的商品，请您耐心等待!',
						title:'兑换成功',
						duration:1000
					})
					setTimeout(function(){
						wx.navigateBack()
					},1000)
				}else{
					that.setData({
						paykg:true
					})
				}
			},
			fail(res) {
				

				wx.hideLoading()
				that.setData({
					paykg:true
				})
				wx.showToast({
					title: '提交失败',
					icon: 'none',
					duration: 1000
				})
			}
		})
	
		
		// wx.navigateTo({
		// 	url:'../OrderDetails/OrderDetails'
		// })
		
	},
	goaddress(){
		wx.navigateTo({
		  url: '/pages/myaddress1/myaddress'
		})
	},
	//获取order
	getorder(id){
		let that = this
			wx.request({
				url:  app.IPurl+'/index/personal/integral_shop',
				data:{
					goods_id:id,
					id:wx.getStorageSync('usermsg').id
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				dataType:'json',
				method:'get',
				success(res) {
					// console.log(res)
					
					if(res.data.errCode==0){
						let resultd=res.data.retData
						
							that.setData({
								orderxq:resultd.good,
								address:resultd.address
							})
						
					}else if(res.data.errCode==1){
						let resultd=res.data.retData
						if(resultd.good==null){
							wx.showToast({
								icon:'none',
								title:'该商品不存在'
							})
						}
						that.setData({
							orderxq:resultd.good,
							address:resultd.address
						})
					}
				}
			})
		
	},
	
	onRetry(){
		this.onLoad()
	}
})
