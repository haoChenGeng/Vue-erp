import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
export default {
	warehouseInfo:{
		service:null,
		method:null,
		args:{},
		columns:[
			       {"prop": "storageName","label": "仓库名称"},
			       {"prop": "workerCode","label": "仓库管理员"},
			       {"prop": "storekeeperPhoneId","label": "仓库管理员电话"},
			       {"prop": "disPlanDeliverTime","label": "安排配送日期", "formatter": "dayParser"}
		],
		formatters:{
			dayParser:function(text){
				let dateString
                if (text === 0 || text === null || text == '') {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000)
                    dateString = formatDate(objDate, 'yyyy-MM-dd')
                }
                return dateString
			}
		}

	},
	installManInfo:{
		service:null,
		method:null,
		args:{},
		columns:[
			       {"prop": "skuId","label": "SKUID"},
			       {"prop": "goodsName","label": "商品名称"},
			       {"prop": "usedSpace","label": "空间"},
			       {"prop": "expectInstallNum","label": "安装数量"},
			       {"prop": "basicUnitName","label": "单位"}
		],
		formatters:{
			dayParser:function(text){
				let dateString
                if (text === 0 || text === null || text == '') {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000)
                    dateString = formatDate(objDate, 'yyyy-MM-dd')
                }
                return dateString
			}
		}
	},
	attachInfo:{
		service:null,
		method:null,
		args:{},
		columns:[
			       {"prop": "typeName","label": "附件类型"},
			       {"prop": "attachName","label": "附件名称"},
			       {"prop": "createTime","label": "上传时间", "formatter":"dateParser"},
			     //  {"prop": "remark","label": "备注"},
			       {"prop": "createUserName","label": "上传人"}
		]
	},
	guiltyList:{
		service:Service.INSTALLATION.name,
		method:Service.INSTALLATION.methods.instalRewardPunishRecordQueryPage,
		args:{},
		columns:[
			       {"prop": "rpRoleTypeCode","label": "责任方", list:'userOrganizationList'},
			       {"prop": "money","label": "罚款金额"},
			       {"prop": "reason","label": "罚款原因"}
		]
	}
}