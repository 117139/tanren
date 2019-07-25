//myaddress.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		addresslist:[
			{
				"name":"啊实打实大",
				"mobile":"1830000000",
				"address":"地址地址地址地址地址地址地址",
			},{
				"name":"啊实打实大",
				"mobile":"1830000000",
				"address":"地址地址地址地址地址地址地址",
			},{
				"name":"啊实打实大",
				"mobile":"1830000000",
				"address":"地址地址地址地址地址地址地址",
			},],
    mridx:0
  },
  onLoad: function (option) {
		
  },
	onShow(){
		this.getaddlist(1)
	},
	selecmr(e){
		let that =this
		console.log(e.currentTarget.dataset.id)
		let id=e.currentTarget.dataset.id
		wx.request({
			url:  app.IPurl+'/index/personal/update_defa',
			data:  {
					'id':wx.getStorageSync('usermsg').id,
					'address_id' :id,
					'default_address' :0,
		    },
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded' 
			// },
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				if(res.data.errCode==0){
					that.getaddlist()
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
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
	addressEdit(e){
		
		console.log(e.currentTarget.dataset.id)
		let address=this.data.addresslist[e.currentTarget.dataset.id]
		 address=JSON.stringify(address)
		wx.navigateTo({
			url:'/pages/addressEdit/addressEdit?address='+address
		})
	},
	addressDel(e){
		let that =this
		console.log(e.currentTarget.dataset.id)
		let id=e.currentTarget.dataset.id
		wx.showModal({
			content:"确定要删除改地址吗?",
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					wx.request({
						url:  app.IPurl+'/index/personal/address_del',
						data:  {
								'id':wx.getStorageSync('usermsg').id,
								'address_id' :id
					    },
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded' 
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							console.log(res.data)
							
							if(res.data.errCode==0){
								that.getaddlist()
							}else{
								wx.showToast({
									 icon:'none',
									 title:'操作失败'
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
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	getaddlist(type1){
		
		
		let that =this
		//http://water5100.800123456.top/WebService.asmx/useraddress
		wx.request({
			url:  app.IPurl+'/index/personal/address_select',
			data:  {
					id:wx.getStorageSync('usermsg').id,
				},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				console.log(res.data)
				
				if(res.data.errCode==0){
					that.setData({
						addresslist:res.data.retData
					})
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
				
			
					// pageState1.error()    // 切换为error状态
			},
			fail() {
				
				 
				 wx.showToast({
				 	 icon:'none',
				 	 title:'操作失败'
				 })
			}
		})
	},
	onRetry(){
		this.getaddlist(1)
	}
})
