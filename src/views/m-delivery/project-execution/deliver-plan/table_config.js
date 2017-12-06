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
			       {"prop": "workerCode","label": "计划明细ID"},
			       {"prop": "workerCode","label": "品类"},
			       {"prop": "workerCode","label": "工地地址"},
			       {"prop": "workerCode","label": "开始时间", "formatter": "dayParser"},
			       {"prop": "workerCode","label": "结束时间", "formatter": "dayParser"}
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
			      // {"prop": "remark","label": "备注"},
			       {"prop": "createUserName","label": "上传人"}
		]
	},
	guiltyList:{
		service:null,
		method:null,
		args:{},
		columns:[
			       {"prop": "workerCode","label": "责任方"},
			       {"prop": "workerCode","label": "罚款金额"},
			       {"prop": "workerCode","label": "罚款原因"}
		]
	}
}