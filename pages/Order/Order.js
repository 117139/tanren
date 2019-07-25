//order.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		paykg:true,
  },
  onLoad: function (option) {
    console.log(option.id)
		
	
		this.getorder(id)  //获取时间地点
		
  },
	onReady(){
		
	},
	subbtn(){
		
		console.log(app.IPurl1)
		let that = this
		let data
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
				op:'orderpub',
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				goods_sku_id:that.data.goods_sku_id,	//商品ID
				sku_info_id:that.data.goodslist[0].goods_sku_info[that.data.dbggtype].sku_info_id,
				logistics_self:0,											//自提
				// user_member_shopping_address_id:that.data.address.user_member_shopping_address_id, //地址id(物流选择)
				shop_store_house_id:that.data.ztaddress,
				shop_delivery_time_id:that.data.zttime,
				num:that.data.goodsnum,
				goods_unit:that.data.goodsguige
			}
		
		wx.request({
			url:  app.IPurl+'order',
			data:data,
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				
				wx.hideLoading()
				console.log(res)
				
				if(res.data.error==-2){
					app.checktoken(res.data.error)
					that.onLoad()
				}else if(res.data.error==0){
					let resultd=res.data
					console.log(res.data)
					if(res.data.order_info_id){
						console.log('178info')
						app.Pay(res.data.order_info_id,'info')
					}
					if(res.data.partner_trade_no){
						console.log('182no')
						app.Pay(res.data.partner_trade_no,'no')
					}
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
		  url: '/pages/myaddress/myaddress?id=' + id
		})
	},
	//获取地点时间
	getorder(id){
		let that = this
			wx.request({
				url:  app.IPurl+'/index/personal/integral_shop',
				data:{
					goods_id:id,
					"id":wx.getStorageSync('usermsg').id
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				dataType:'json',
				method:'POST',
				success(res) {
					// console.log(res)
					
					if(res.data.error==-2){
						app.checktoken(res.data.error)
						that.onLoad()
					}
					if(res.data.error==0){
						let resultd=res.data.list
						// console.log(res.data.list)
						// that.data.goodslist.push(res.data)
					
						let ckuadd=[]
						let ctime=[]
							for(let i in resultd){
								let ctime1=[]
								let addjson={
									'name':resultd[i].store_house.store_house_name,
									'id':resultd[i].store_house.shop_store_house_id
								}
								ckuadd.push(addjson)
								for(let j in resultd[i].timelist){
									let timejson={}
									let asd=resultd[i].timelist[j]
									// console.log(asd)
									let timejsontime=asd.delivery_date + asd.start_time+'-'+asd.end_time
									let timejsonid=asd.shop_delivery_time_id
									// let timejson="{time:"+timejsontime+",id:"+timejsonid+"}"
									timejson={
										'time':timejsontime,
										'id':timejsonid
									}
									ctime1.push(timejson)
								}
								ctime.push(ctime1)
							}
							that.setData({
								columns1:ckuadd,
								columns2:ctime,
								
							})
							that.setData({
								ztaddress:that.data.columns1[0].id,
								zttime:that.data.columns2[0][0].id
							})
					}
				}
			})
		
	},
	//阶梯价单
	ladderpri(idx,num){
		
		let that = this
		let ygnum=that.data.goodslist[idx].havenum  //已购
		let jt=that.data.goodslist[idx].goods_total_limit  //规则
		let jtpri=that.data.goodslist[idx].shopinfo_sku_price_list[that.data.dbggtype].goods_ladder_pricing_list  //规则
		let nownum
		if(that.data.goodsnum!==''){
			nownum=that.data.goodsnum
		}else{
			nownum=that.data.goodslist[idx].order_cart.goods_count//本次购买数量
		}
		
		if(num){
			nownum=num
		}
		// let numz=ygnum+nownum
		let nownum1 //定义临时变量
		let numlen //定义单个阶梯的限购数量
		let jtlist=[]        //阶梯列表
		let jtnum=[]         //阶梯数量
		let jtTotal=[]         //阶梯总价
		let numladd=[]      //阶梯的区间
		let priladd=[]      //阶梯的价格
		let Totalpri=0
		let laddermsg=[]
		for(let i in jt){
			let lownum=jt[i].lower_num
			let upnum=jt[i].upper_num
			let bpri=jtpri[i].price
			// console.log(lownum)
			// console.log(upnum)
			
			let jtzsy=jt[i].limit_num-jt[i].saled_num
			if(lownum-1<=ygnum&&ygnum<upnum){ //根据已购获取开始阶梯
	         
				let item1
				item1=upnum-ygnum        //n1阶梯限售剩余
				
				if(jtzsy<item1){
					item1=jtzsy
				}
				if(item1==0){
					continue   //售罄
				}
				if(nownum<=item1){         //限售剩余足够
					Totalpri +=100*bpri*nownum/100
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum/100
					}
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum-item1
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':item1,
						'priladd':bpri,
						'jtTotal':100*bpri*item1/100
					}
					Totalpri +=100*bpri*item1/100
					laddermsg.push(ladderOne)
				}
      } else if(ygnum<lownum){   //后续阶梯（最小值大于已购）
				numlen=upnum-lownum+1   //当前阶梯的限购数量
				if(jtzsy<numlen){
					numlen=jtzsy
				}
				if(numlen==0){
					continue   //售罄
				}
				if(nownum1<=numlen){  //限售剩余足够
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum1,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum1/100
					}
					Totalpri +=100*bpri*nownum1/100
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum1-numlen
	
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':numlen,
						'priladd':bpri,
						'jtTotal':100*bpri*numlen/100
					}
					Totalpri +=100*bpri*numlen/100
					laddermsg.push(ladderOne)
					
				}
			}
		}
		Totalpri=Totalpri.toFixed(2)
		let laddermsgs={
			'laddermsg':laddermsg,
			'Totalpri':Totalpri
		}
		// console.log(laddermsgs)
		return laddermsgs
	},
	//阶梯价wgc初始化
	ladderpri1(idx,num){
		// for(var i=0;i<idx;i++){
		// 	
		// }
		let that = this
		let ygnum=that.data.goodslist[idx].havenum  //已购
		let jt=that.data.goodslist[idx].limitlist  //规则
		var jtpri=that.data.goodslist[idx].pricelist  //规则价格
		let nownum=that.data.goodslist[idx].order_cart.goods_count//本次购买数量
		if(num){
			nownum=num
		}
		// let numz=ygnum+nownum
		// console.log(jtpri)
		let nownum1 //定义临时变量
		let numlen //定义单个阶梯的限购数量
		let jtlist=[]        //阶梯列表
		let jtnum=[]         //阶梯数量
		let jtTotal=[]         //阶梯总价
		let numladd=[]      //阶梯的区间
		let priladd=[]      //阶梯的价格
		let Totalpri=0
		let laddermsg=[]
		for(var i = 0; i < jt.length; i++){
			// console.log(nownum)
			// console.log(that.data)
			// console.log(that.data.goods[idx].pricelist)
			let lownum=jt[i].lower_num
			let upnum=jt[i].upper_num
			// console.log(jtpri[i])
			
			let bpri=jtpri[i].price
			// console.log(lownum)
			// console.log(upnum)
			
			let jtzsy=jt[i].limit_num-jt[i].saled_num
			if(lownum-1<=ygnum&&ygnum<upnum){ //根据已购获取开始阶梯
	         
				let item1
				item1=upnum-ygnum        //n1阶梯限售剩余
				
				if(jtzsy<item1){
					item1=jtzsy
				}
				if(item1==0){
					continue   //售罄
				}
				if(nownum<=item1){         //限售剩余足够
					Totalpri +=100*bpri*nownum/100
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum/100
					}
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum-item1
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':item1,
						'priladd':bpri,
						'jtTotal':100*bpri*item1/100
					}
					Totalpri +=100*bpri*item1/100
					laddermsg.push(ladderOne)
				}
			}else if(ygnum<lownum){   //后续阶梯（最小值大于已购）
				numlen=upnum-lownum+1   //当前阶梯的限购数量
				if(jtzsy<numlen){
					numlen=jtzsy
				}
				if(numlen==0){
					continue   //售罄
				}
				if(nownum1<=numlen){  //限售剩余足够
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum1,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum1/100
					}
					Totalpri +=100*bpri*nownum1/100
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum1-numlen
	
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':numlen,
						'priladd':bpri,
						'jtTotal':100*bpri*numlen/100
					}
					Totalpri +=100*bpri*numlen/100
					laddermsg.push(ladderOne)
					
				}
				
			}
		}
		Totalpri=Totalpri.toFixed(2).toString()
		let laddermsgs={
			'laddermsg':laddermsg,
			'Totalpri':Totalpri
		}
		// console.log(laddermsgs)
		return laddermsgs
	},
	//阶梯价改变
	ladderpri_gb(){
		// console.log('ladderpri_gb0')
		let that = this
		let jtgsele=that.data.goods_sele
		for(var idx=0;idx<jtgsele.length;idx++){
			// console.log('ladderpri_gb1')
			// console.log(jtgsele[idx].laddermsgs)
			if(!jtgsele[idx].laddermsgs){
				continue   //售罄
			}
			// console.log('ladderpri_gb')
			let ygnum0=that.data.goodslist[idx].havenum  //已购
			let newadd=0
			for(var i=0;i<idx;i++){
				if(jtgsele[i].goods_sku_id==jtgsele[idx].goods_sku_id){
					
					if(jtgsele[i].xuan){
						newadd += jtgsele[i].num
						// console.log('----------------------------'+newadd)
					}
				}
				
			}
			// console.log(newadd)
			let ygnum=ygnum0+newadd
			let jt=that.data.goodslist[idx].limitlist  //规则
			var jtpri=that.data.goodslist[idx].pricelist  //规则价格
			let nownum=jtgsele[idx].num//本次购买数量
			
			// let numz=ygnum+nownum
			// console.log(jtpri)
			let nownum1 //定义临时变量
			let numlen //定义单个阶梯的限购数量
			let jtlist=[]        //阶梯列表
			let jtnum=[]         //阶梯数量
			let jtTotal=[]         //阶梯总价
			let numladd=[]      //阶梯的区间
			let priladd=[]      //阶梯的价格
			let Totalpri=0
			let laddermsg=[]
			for(var i = 0; i < jt.length; i++){
				console.log(nownum)
				// console.log(that.data)
				// console.log(that.data.goods[idx].pricelist)
				let lownum=jt[i].lower_num
				let upnum=jt[i].upper_num
				// console.log(jtpri[i])
				
				let bpri=jtpri[i].price
				// console.log(lownum)
				// console.log(upnum)
				
				let jtzsy=jt[i].limit_num-jt[i].saled_num
				if(lownum-1<=ygnum&&ygnum<upnum){ //根据已购获取开始阶梯
			       
					let item1
					item1=upnum-ygnum        //n1阶梯限售剩余
					
					if(jtzsy<item1){
						item1=jtzsy
					}
					if(item1==0){
						continue   //售罄
					}
					if(nownum<=item1){         //限售剩余足够
						Totalpri +=100*bpri*nownum/100
						let ladderOne={
							'numladd':lownum+'-'+upnum,
							'jtnum':nownum,
							'priladd':bpri,
							'jtTotal':100*bpri*nownum/100
						}
						laddermsg.push(ladderOne)
						break;   //结束
					}else{                   //限售剩余不足
						nownum1=nownum-item1
						let ladderOne={
							'numladd':lownum+'-'+upnum,
							'jtnum':item1,
							'priladd':bpri,
							'jtTotal':100*bpri*item1/100
						}
						Totalpri +=100*bpri*item1/100
						laddermsg.push(ladderOne)
					}
				}else	if(ygnum<lownum){   //后续阶梯（最小值大于已购）
					numlen=upnum-lownum+1   //当前阶梯的限购数量
					if(jtzsy<numlen){
						numlen=jtzsy
					}
					if(numlen==0){
						continue   //售罄
					}
					if(nownum1<=numlen){  //限售剩余足够
						let ladderOne={
							'numladd':lownum+'-'+upnum,
							'jtnum':nownum1,
							'priladd':bpri,
							'jtTotal':100*bpri*nownum1/100
						}
						Totalpri +=100*bpri*nownum1/100
						laddermsg.push(ladderOne)
						break;   //结束
					}else{                   //限售剩余不足
						nownum1=nownum1-numlen
				
						let ladderOne={
							'numladd':lownum+'-'+upnum,
							'jtnum':numlen,
							'priladd':bpri,
							'jtTotal':100*bpri*numlen/100
						}
						Totalpri +=100*bpri*numlen/100
						laddermsg.push(ladderOne)
						
					}
					
				}
			}
			Totalpri=Totalpri.toFixed(2).toString()
			let laddermsgs={
				'laddermsg':laddermsg,
				'Totalpri':Totalpri
			}
			// console.log(laddermsgs)
			that.data.goods_sele[idx].laddermsgs=laddermsgs
			// return laddermsgs
		}
		// console.log('------------------------------xiugai')
		that.setData({
			goods_sele:that.data.goods_sele
		})
	},
	
	onRetry(){
		this.onLoad()
	}
})
