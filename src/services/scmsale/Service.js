
let Services = {

	//销售退货单
	SALEREJECTEDORDER:{
		// /biz/supply-chain/app.supply-server
		name:'OrPxhZyrpigLoRQr5OAxpkPcAyPM51UxFrlONioa4offMtOPNJ5',		
		methods:{

			//views.sales.refund.order.queryPage 销售退货单列表
			SALESLIST: 'D6760f2XYHiZACwxXD6V9MHxsO7zQndFapbkMuct_vNqbcPD6rs',
			//sales.order.queryPageOrder 查询单据编号
			ORDERSALESQUERY: '_Lq9vqiDDeKdG_pw3QvtpnIxM2mrsyN6LrKr_qR',
			//views.sales.refund.order.export 导出
			SALESEXPORT: 'QLNIBq_UEZpnUMzm_O6gZC-cI-Zja8qQtA.NiNbErwXFjkz',
			//views.sales.refund.order.stash  销售退货单暂存接口
			ORDERSTASH:'_D0JqGe-ATV71r14oTMp12I6ldxa4NW2WkOsDyBn4vF',
			//views.sales.refund.order.submit 销售退货单提交接口
			ORDERSUBMIT:'mA67iLRChOhfF4gsRH5trv3rPpfrR3xiu5gsNmSf8-DyWFU',
			//views.sales.refund.order.queryPage 销售退货单列表查询
			ORDERQUERYPAGE:'cQObZgDVYe-TSCKmZfOqlHH_vg0dkuB_8r2l9ySQIj9V8BQQ38o',
			//views.sales.refund.order.findById 销售退货单详情获取
			ORDERFINDBYID:'17qB1QoJgLZIfgQ0h5q-ybV8kCY2ouax4Uqfcuu7pXfjw99',
			//views.sales.refund.order.cancel 批量取消销售退货单
			ORDERCANCEL:'qiwdrEIJ9GX_OkVQXorgezZhxyYjMtiPNuExJHwVvahm4ON',
			//views.sales.refund.order.batchSubmit 批量提交销售退货单
			ODERBATCHSUBMIT:'so53cJbxwIwW5YoZ_vm8j1fqLjd1AGrXixcza0dUcqoJU0qZ5Gx',
			//views.sales.refund.item.cancel 批量取消销售退货单项
			ITEMCANCEL:'NorZkpSRud00cJXAdbxMZUWfctr9sl1XFkeYq0tL1Fu',
			//views.sales.order.item.queryPageWithOrder 选单:销售订单、订单项联表查询
			ORDPAGEITEM:'Mxrr4g9gBUw7WtaajFw7NA4edbxgrk5gj6ygtsHiZVmfJYduqltk4KnwudE',
			//views.sales.refund.order.findInitialInfo 根据销售订单ID获取退货单初始信息
			FINDINITIALINFO: 'ixwcWrS2oeCMlcaDjSxarohwd_csF-lZNO1OdOfmrWUmdeogeR4ZP8pSl2L',
			//views.sales.refund.order.findItemsById 查询退货单详情
			FINDITEMBYID:'zpMKNEd1XCBPvZF-hDDQ78D7hLxPmYywCey7uQFMnvCKu8TFdvS8D8n',
			//views.sales.refund.item.updateItemImgs 更新单项图片
			UPDATEITEMIMGS:'HRjPeiEmagbuYXQ6aYjDQIUjl2edwyD_gsWFtgVF7QQBSQTMjX9CjK5',
			//views.sales.refund.order.findItemsToRefundById  根据退货单项id查询退货单项
			FINDITEMSTOREFUNDBYID:'G_CTHkzKIQhjHBwodM-tP2znO4NZeziLwakCIJZz-6i60_aDR9JwB9_5Fp8oQ-mHqtn'

		}
	},

	//销售退货单验收
	SUPPLYUPDATEITEM:{
		// /biz/supply-chain/app.supply-server
		name:'sIb6FDeZdIx1SWrZC9-JVCCsoJW54nEp4zFulRS9zWFrowX69ce',		
		methods:{

			//acceptance.item.update 验收接口
			UPDATE: '4znD0LzYLk0U1wjfTDml1NoB1L1dcAn3rNK', 
			//views.inventory.storage.queryStorageByOrganizationAndType 收货仓列表
			REVINVLIST:'Utsrg7Czjgw5aYD2h47wSuT3ftOqjtXvehXrdZ.cakMmAr2ObmvHqmRmojiNdsBeaVfg_D4enTegdCX',
			//views.acceptance.queryAcceptanceOrderandItemsBySaleRefund 退货单验收信息
			ACCEPTTANCEORDER:'A1I4DJuT36e2q8hGp8LUGHo1MXv46RClY09WnBDYo97J7Th-LwJt5WT5W2ar5EWjN3191V2n36Gvnf2',
			//views.invoice.salesRefundOrder.print 打印
			PRINT:'EDO86IehFBDjfxFa7Kw__SZAtGQDKgMGR-Y9akJGf7ai8sZvtgh',
			//views.sales.refund.order.receiveOrder 接收退货单
			RECEIVEORDER:'DHO3EYi_9MOoS-5p1WCG6M-_LLs8OTvp7XtQxL4b7KG548wy3y7_Gli',
			//views.sales.refund.order.rejectOrder 驳回退货单
            REJECTORDER:'4E2D4YuQ4TpM8lp9AUCRxBG7nX_sIfO2q1VZEYJ2CwBuiYT7oxP',
            //views.acceptance.querySalesRefundAcceptanceInfo 根据销售退货单行id查询对应可验收的数量及供应商信息
            QUERYINDENTIFYCODELIST:'x576vOjBablpudUHvom_3soOD0to0jtST2hZoKmspp5zrL7npPoxdW6rpQ1fo4Eu4TX'
			
		}

	},


}

export default Services