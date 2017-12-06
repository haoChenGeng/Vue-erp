import axios from 'src/utils/axios.js'
import comServices from 'src/services/delivery/Service.js'

let Service = {
	INSTALLATION:{
		name:"UtVjoo4vY9I5lCC0V9yK2CC_6iT774K", ///biz/t8t-ps-pim/app
		methods:{
			makeInstallationView:"YabXXSrAU_q7QBJ-rfQZZpQtDbP6X2_spV9LvVPqQ9RZFHoM8XQ-74bAwtLORJt", //views.deliverInstallPlan.makeInstallationView
			queryInstallTask:"k2nedaFUmuoWNkhUl0qvd1swJepOpfr-91IzUDkPQJLO2BlC-U8T9YeoF6L",//views.deliverInstallPlan.queryInstallTask
			makeInstallation:"PZJaArySRkp6S_SUaEaegPbGEPsVI-rrTGhq7jJQvH8_cwo-6pP992kWrg2",//views.deliverInstallPlan.makeInstallation
			validateInstallPlan:"WhNfFdzgNrk5hO7OUbQaLKnXfLJBtjEAq6ivcPVRsefAR5L5ItYB75QQ71i-Pzo",//views.deliverInstallPlan.validateInstallPlan
			queryResponsibility:"8XVTWSnBdLmDL6GIBI8bJNLlCmWL7gC70kO6WoVQ7ooCXKjR1vOKVFRJ5RgBmTu", //views.deliverInstallPlan.queryResponsibility
			makeInstallAgain:"d1l1ijOMxFwYquesoqv7qur3hmyG0ntbHyg1630x7VYb3SLYZI-lYh2pbLX",//views.deliverInstallPlan.makeInstallAgain
			makeInstallReturn:"557tkNnzftMZzjt19lt9KvNZoxh2WhKM3WhCNqjOxcxvUKgzb3yYteK5vS3",// views.deliverInstallPlan.makeInstallReturn
			addReturnMemoDTO:"-3C28Gn_2MiyPoo6804GGPtUiAqhCt3jo8uJUA7mq236Y0B21SB45Ln4TYi", // views.deliverInstallPlan.addReturnMemoDTO
			instalRewardPunishRecordQueryPage:"pGD1rWtK8T4HA9ooM0HKR0D41ZyzoxQ8laI2J1D_WVEp3TU6zrbiTlJ8wgk",//views.instalRewardPunishRecord.queryPage
			queryInstallBillByPage:"q6k5fKK6vcpNydVYrcXe2vFEwvVhlb6v7kJq6M1rr-AP6n_ZQeMoFF2sPBT",//views.installBill.queryInstallBillByPage
			findInstallBillDetailById:"ETtPSHRnbCuUa4gdCW4swQIwdYzBSWxfMJ2P7-DtYvEDbGsIz9Mz9AGoRCxAntq",//views.installBill.findInstallBillDetailById
			updateInstallBill:"jeawmqW3dmMA6UL4yjIjUvT773QhKnOeYcXJJ_7hRLkQPSclPz2",//views.installBill.updateInstallBill
			listGoodsInfo:"QGRG6Urf4iR0e216B9wETh8jy-4liv3l3KpHNK8lEnHXaB7lEK64YYe",//views.deliverInstallPlan.listGoodsInfo
			queryInstallItemByInstallPlanId:"QZcbmsQpyPO8rQ99fTLUcO9m3RbZaUqd8SHfAsfhkfJNaafY-xVOsqiV59zm40jOfuNd14D", //views.installBill.queryInstallItemByInstallPlanId
            updateStatusById:"_KIF5S-o7ELFnKN855ZIUYb-X-CM1O887mQtHJcJ5yW5CulH09WRVrbyK8w",//views.deliverInstallPlan.updateStatusById
            checkSubmitAgain:"A7KJCgtECAbKAqqOxtwrMwrUTBX3NCYE2B7rDD-0W-aquS82Yoq",//views.installBill.checkSubmitAgain
            exportInstallBill:"954A4wezR83PkY-cuCAVvJuZDBA-ESM8NuV",//views.installBill.export
            updateStatusById:"_KIF5S-o7ELFnKN855ZIUYb-X-CM1O887mQtHJcJ5yW5CulH09WRVrbyK8w",//views.deliverInstallPlan.updateStatusById
            exportDeliverInstallPlan:"xNN8IeiGCu8EBA_NFN-CDfozMCcJ5DtdV0M9phFfRZXFXrn",//views.deliverInstallPlan.export
            addCostReview:"IiSSe17nIQ5gb1BoYDHUXzdXbvWFKSK2qxMBXFickQhKdB-",//views.installBill.addCostReview
        }
	},
	PROJECTOFFER:{
		name:"hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3", // /biz/dsp-prs-pqm/app
		methods:{
			spaceQuery:"lvtq0Ai02AJnuRtKlztsLtlvptX", //views.space.query
		}
	},
    PSODM:{
        name:"Y3bqdnyKwaUOuqbZ_oi3S6MIGvsN8SM", // /biz/t8t-ps-odm/app
        methods:{
            submitByErp:"w1Ke0AZc8qG3B8XDp_tEv4aMcY62D3smmYdy5nB", //views.surcharge.submitByErp
            queryPage:"4CuD0EYH54Oi82O7rpmx3AvAn7mjhKzkfD0BvdjIw4B", //views.surchargeOrder.queryPage
        }
    }
};

let methods = {
		makeInstallationView:function(args){
			return axios({
	            service: Service.INSTALLATION.name,
	            method: Service.INSTALLATION.methods.makeInstallationView,
	            args: args
        	})
		},
		spaceQuery:function(args){
			return axios({
	            service: Service.PROJECTOFFER.name,
	            method: Service.PROJECTOFFER.methods.spaceQuery,
	            args: args
        	})
		},
		makeInstallation:function(args){
			return axios({
	            service: Service.INSTALLATION.name,
	            method: Service.INSTALLATION.methods.makeInstallation,
	            args: args
        	})
		},
		validateInstallPlan:function(args){
			return axios({
	            service: Service.INSTALLATION.name,
	            method: Service.INSTALLATION.methods.validateInstallPlan,
	            args: args
        	})
		},
		queryTreeByType(args) {
	        return axios({
	            method: comServices.ORGANIZATION.methods.queryTreeByType,
	            service: comServices.ORGANIZATION.name,
	            args: args
	        })
    	},
    	queryResponsibility(args){
    		return axios({
	            method: Service.INSTALLATION.methods.queryResponsibility,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	makeInstallAgain(args){
    		return axios({
	            method: Service.INSTALLATION.methods.makeInstallAgain,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	makeInstallReturn(args){
    		return axios({
	            method: Service.INSTALLATION.methods.makeInstallReturn,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	addReturnMemoDTO(args){
    		return axios({
	            method: Service.INSTALLATION.methods.addReturnMemoDTO,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	findInstallBillDetailById(args){
    		return axios({
	            method: Service.INSTALLATION.methods.findInstallBillDetailById,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	updateInstallBill(args){
    		return axios({
	            method: Service.INSTALLATION.methods.updateInstallBill,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
    	queryInstallItemByInstallPlanId(args){
    		return axios({
	            method: Service.INSTALLATION.methods.queryInstallItemByInstallPlanId,
	            service: Service.INSTALLATION.name,
	            args: args
	        })
    	},
        updateStatusById(args)
        {
            return axios({
                method: Service.INSTALLATION.methods.updateStatusById,
                service: Service.INSTALLATION.name,
                args: args
            })
        },
        checkSubmitAgain(args)
        {
            return axios({
                method: Service.INSTALLATION.methods.checkSubmitAgain,
                service: Service.INSTALLATION.name,
                args: args
            })
        },
        exportInstallBill(args)
        {
            return axios({
                method: Service.INSTALLATION.methods.exportInstallBill,
                service: Service.INSTALLATION.name,
                args: args
            })
        },
        updateStatusById(args){
            return axios({
                service: Service.INSTALLATION.name,
                method: Service.INSTALLATION.methods.updateStatusById,
                args: args
            })
        },
        exportDeliverInstallPlan(args){
            return axios({
                service: Service.INSTALLATION.name,
                method: Service.INSTALLATION.methods.exportDeliverInstallPlan,
                args: args
            })
        },
        addCostReview(args){
            return axios({
                service: Service.INSTALLATION.name,
                method: Service.INSTALLATION.methods.addCostReview,
                args: args
            })
        },
        submitByErp(args){
            return axios({
                service: Service.PSODM.name,
                method: Service.PSODM.methods.submitByErp,
                args: args
            })
        },
        queryPage(args){
            return axios({
                service: Service.PSODM.name,
                method: Service.PSODM.methods.queryPage,
                args: args
            })
        }
};


export {Service, methods};
