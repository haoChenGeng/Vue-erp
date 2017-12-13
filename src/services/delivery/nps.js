import axios from 'src/utils/axios.js'
let Service = {
	NPS:{
		name:'uSt1vBYExVgL-kbP8EbQjnaxRB7bQXj', // /biz/t8t-ps-csm/app
		methods:{
			 queryOne:"txgkrBaJ-tg3-xbzToxlU_-lSQzlgJDtTTCre84nfQL", // views.nps.bill.item.queryOne
			 queryPage:"OKHGCRY9K3HhR9aipdM3Nf94yZ9YBsP427X",//views.nps.bill.queryPage
			 itemConfirm:"ep011IjGr1qBCPmKhrcGyvdmh9spRze2IqJaYLu",// views.nps.bill.item.confirm
			 billExport:"DE3KDLcQCr4kYcLcuN7ZAU3pGWvHrnb",//views.nps.bill.export
			 autiClose:"diPQc43qOFl9uIkFImUDsuUBAzb_JWyZzIi", // views.nps.bill.autiClose
			 makeCall:"Ytl5tybWFcAZVU9WVdvZDxQ",//views.makeCall
		}
	},
	SUPPLY_CONFIGURE:{
		name:'rWpKotZR9xK91ht70_7YB62Z5mjzfQlwaP2QPInsqVT54TB11oa', ///biz/supply-chain/app.supply-server
		methods:{
			queryPropertyUnion:"66nS9zn0S94COMMfrLSJJXuPEgR62pUPz1ePMqb"//property.queryPropertyUnion
		}
	},
	AREA:{
		name:'xow0eCU1tI80eNpW9XyHLZPpyFO_5Q6', // /biz/t8t-sys-dst/app
		methods:{
			pctreeGetConfig:"vhErxe1cvalLLHx7492ZUEz-ZLhasDcOoJg5MnIyBtEg4ZI" //localDistrict.pctree.get.config
		}
	}
}

let methods = {
	 queryOne(args){
	 	return axios({
            method: Service.NPS.methods.queryOne,
            service: Service.NPS.name,
            args: args
        })
	 },
	 queryPropertyUnion(args){
	 	return axios({
            method: Service.SUPPLY_CONFIGURE.methods.queryPropertyUnion,
            service: Service.SUPPLY_CONFIGURE.name,
            args: args
        })
	 },
	 itemConfirm(args){
	 	return axios({
            method: Service.NPS.methods.itemConfirm,
            service: Service.NPS.name,
            args: args
        })
	 },
	 pctreeGetConfig(args){
	 	return axios({
            method: Service.AREA.methods.pctreeGetConfig,
            service: Service.AREA.name,
            args: args
        })
	 },
	 autiClose(args){
	 	return axios({
            method: Service.NPS.methods.autiClose,
            service: Service.NPS.name,
            args: args
        })
	 },
	 makeCall(args){
	 	 return axios({
            method: Service.NPS.methods.makeCall,
            service: Service.NPS.name,
            args: args
        })	
	 }
}

export {Service, methods};