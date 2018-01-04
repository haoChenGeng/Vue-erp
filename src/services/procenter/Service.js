
let Services = {
	//流程分类树
	PROCENTERTREE:{
		// /biz/t8t-wkf-dat/app
		name:'tac4MBKgFxtkOyGS5xolDBVgEEqR4_j',
		methods:{
			// listProcessCategorys
			LISTCATEGIRY:'N4VlGazqhEV4O7p5tFECXLmvbMA87jp'
		}
	},

	//流程分类
	PROCENTERCATEGORY:{
		// /biz/to8to-it/app.tit-configure
		name:'UXCW5_FfDpVAC4RS04cKtoUQPAo0Ct1bM6DkpEzEh-tmghj',
		methods:{
			// systemCode.searchByPage
			CATEGORY:'P5ZnSOIfU9FZfG5oeLRcGlaqV3mIzl0g-JG',
		}
	},

	//列表
	PROCENTERDEPLOYLIST:{
		//  /biz/t8t-wkf-dat/app
		name:'kahC43ofmx3VBfYN4D86B0aWN7xyrzY',
		methods:{
			// getProcessDef 获取部署列表
			DEPLOYLIST:'5k_j_P_WD8RwL8UqaGgemLL',
			//   retrieveProcessPicture 获取流程图
			PRODIAGRAM:'ocM-RfcwmwgITykyYSQX_K9vYW-g7j.vb43',
			// getUserTask 获取流程列表
			FLOWLIST:'Hi_a7GN6TG85Q0RgZpY',
			//获取审批流程
			PROCESSDETAIL:'h9Gn7JK_3a-JnhpyXXPI7xixH31',

			// getUserTaskWeb 待办
			GETUSERTASKSWEB:'9bMs6cQMGe_LEaZPtnQU6_k',

			//getAllProcessName 获取流程名
			PROCESSNAME:'bzPfRPsZAIkInrHzR0Ww3jYQ_-B',
			//   getProcessInstsWeb 获取已办进行中
			PROCESSINSTSWEB:'mN-bBZSV7j6gslGBe2R8YAd8iBn',
			//  getHistoricProcessInstsWeb  获取已办已完成
			HISTORYPROCESSINSTSWEB:'NXGklFkG5yvT_vupqPexl6hpmeFSq4FqJKrsYWV',
            // views.queryProcInfoByStarter 我的在办
            QUERYPROCINFOBYSTARTER: 'qKH0uUvM502z9e4Eh-3Dbw24I34XnWxYXfCtGiH5-Nk',
            // retrieveProcessPicture 返回流程图并高亮当前运行节点
            RETRIEVEPROCESSPICTURE:'caQX8iZlaSbYUOb-Wad-zIItpQHKCn-OTEy',
            //views.getActivityInfo
            GETACTIVITUINFO:'UwqvS8Ww3OrN3ZNE8PbR9gnMv-gwilk'
		}
	},

	//部署列表操作
	PROCENTERDEPLOYCTL:{
		// /biz/t8t-wkf-ctl/app
		name:'ubBdWrXdnC-1cRnPgZs7CXA6xZRnzF0',
		methods:{
			// suspendProcDef 部署流程挂起
			SUSPENDPROCDEF:'5nyeHyB7ZEuri3TpRh3tD0d',
			// activateProcDef 部署流程恢复
			ACTIVATEPROCDEF:'fcpjGsaCz11JaX2oP0Tevt2',
			// suspendProcess 流程挂起
			SUSPENDPROCESS:'IiBNEwBUZHvaZEd884hkl9s',
			// activateProcess 流程恢复
			ACTIVAREPROCESS:'r-jGv4CJ2_eJr8ju5dL55tG',
			// updateAssignee 更改处理人
			UPDATEASSIGNEE:'vhuF2ysepV8qxRGxwy2tauE',
            //startProcess 发起流程
            STARTPROCESS:'ufxCx62mvy5O56qyW1J',
            //completeTask处理任务
            COMPLETETASK:'zxbXS3heSFwAqv910ZQ'
		}
	},

	//部署流程
	PROCENTERDEPLOY:{
		///biz/workflow/app.bpmnserver
		name:'75HlZS4nGZjFaJVfcJTtxqRfF8pIixrHj8VLVGRXNwD',
		methods:{
			//  deployByZip //部署新流程
			DEPLOYBYZIP:'3qjAn-cqKdzGCqqoRdo'
		}
	},


	//获取用户账号信息
	USERINFODATD:{
		// /biz/to8to-it/app.account
		name:'VVFThqq6Am6swm_FAiqN6rrCR46gTZuiCR5qQ5N',
		methods:{
			// account.query
			ACOUNT:'1zrMMREJIKUfTbFF_QMtddb',
			// account.findByName
			FINDUIDBYNAME:'rWhkvIhueB4zmbk3Mhcl3hYq2q5'
		}
	},
	//获取系统人员列表
	SYSTEMCODE:{
		// /biz/to8to-it/app.tit-configure
		name:'6ke2igQ72I0buaw0iMB5QK05wLEnhMQ7HuZlwSYYzEgGJCu',
		// systemCode.listNextLevel
		methods:{
			GETSYSTEMCODE:'MXXlQL4yf_XaY2HZLHGADkzYymPhjUU-DJJ'
		}

	},
	//授权功能
	IMPOWERSERVICE:{
		// /biz/t8t-wkf-ctl/app
		name:'ubBdWrXdnC-1cRnPgZs7CXA6xZRnzF0',
		methods:{
			//views.createAgency
			CREATEAGENCY:'2M_S3N4E_Qzk9CCpO9CH9-BA6UT', //创建授权
			//views.queryAgency
			IMPOWERLIST:'lbZvPBChkehHxtjvcDe8L2Nru8y',//授权列表
			//views.deleteAgency
			DELETEAGENCY:'D0zKDUrN3VmS8o2xeDh7_Lp0ynf',//取消授权
		}
	},
    CATEGORY:{
	    // /biz/t8t-wkf-bpm/app
	    name:'U_Uwpq1EYRL1nw5uYeS5kdEskn_Q26K',
        methods:{
	        //views.createCategory
            CREATEGATEGORY:'GcageCv_T_wEaS93LLdsdPRWUUaJJgn',
            //views.getCategories
            SEARCHCATEGORY:'RdOLFf_hAyM7bPId_uCSRjTPLNEjzon',
            //views.updateCategory
            UPDATECATEGORY:'QoonamrRzgeZFpbXCmQoInbZS4QspJB',
            //views.updateCategoryStatus
            UPDATECATEGORYSTATUS:'yB143AKgQw4gHnW9m1GiYUYopvSv7Hm-loDD7tS',
            // views.listProcCategorys
            TREE:'0AQQGTyJIyMNDgtJ3doayCo38O1cYfXK-mm',
            //views.getCategoryPids
            CATEGORYPIDS:'MCOWT8SpIDi_P6nikI18e4QgTv1zrDd'
        }
    },
    //部署流程
    WORKFLOW:{
        // /biz/t8t-wkf-bpm/app
        name:'pQXz7EdPwVrOsEK1WynO21gH--Bnbyi',
        methods:{
            //  views.listProcCategorys
            LISTPROCESSCATEGORY:'C66IFbiHFe-Mzok0JHNlOoss0N9MWcx2wlW',   // 分类树和流程
            // views.queryProcess
            QUERYPROCESS: 'fjlUgmlG7zLURjhrVAcT6lWX8h2',    // 查询接口
            // views.updateProcess
            UPDATEPROCESS: '2fjRpZj6xhUBfZFOiDLHxViZvIdeD4E',   // 编辑
            // views.insertProcess
            INSERTPROCESS: 'PUVDPQo7aFEVTLG5rTDmohGmzmNfs.r',      // 新建流程
            // views.delProcess
            DELPROCESS: 'LdVSoc43wGHYZrRy2pW2VzLdDm_',      // 启用/禁用流程
            // views.getOneProcess
            GETONEPROCESS: 'sk62c1hvoLkHg4t51EUUH-WLmyaFBsP',      // 查询
            // views.getCategories
            GETCATEGORIES: 'Y0i3HqIGSslCeEP0Vwilsqqj3ytq-.M',      // 分类树
            // views.getProcBpmInfos
            GETPROCBPMINFOS: 'I85ObDNhRvd-fAt0VDczbxoOUv-7gaJ', // 版本管理 - 分类版本列表
            // views.createProcBpmInfo
            CREATEPROCBPMINFO: 'MWVWMmrbKm9TJFAFx5m5eIk6fvKzSgTIaqx', // 版本管理 - 新增版本
            // views.updateProcBpmInfo
            UPDATEPROCBPMINFO: 'TZEGAo_fQ4jWF59EH21rlLTqTMHWhQw6Iut', // 版本管理 - 更新版本（单条）
            // views.getProcBpmInfoVersions
            GETPROCBPMINFOVERSIONS: '5U0yq2AIsSnb6QlkuMuoGsMph2RqGhk-8lE37a-uTcO', // 版本管理 - 获取所有版本号
            // views.updateRunBpm
            UPDATERUNBPM: 'THUHVn_jPO9hEb5LDaDHHkxWj-l', // 版本管理 - 设置主版本号
            //views.OutputProcInfo
            OUTPUTPROCINFO:'msrZf5Q1ZsK8hPxa9J7R4e6ZrwbqD2G'
        }
    },

    //流程实例相关
    ProcessInsService:{
        // /biz/t8t-wkf-dat/app
        name:'tac4MBKgFxtkOyGS5xolDBVgEEqR4_j',
        methods:{
            getProcessInsts:'ouPCdbPwR9KlvisnAd8UAhC'//getProcessInsts
        }
    }
}

export default Services
