/*
 * 获取流程分类树列表
 * @param
 * @param string
 * @return array
 */

import axios from 'src/utils/axios.js'
import Service from './Service.js'
import commonApiService from 'src/services/commonApi/Service.js'

export default{
	listCategory(args){
		return axios({
			method:Service.PROCENTERTREE.methods.LISTCATEGIRY,
			service:Service.PROCENTERTREE.name,
			args:args
		})
	},

	//获取流程分类
	getProCategory(args){
		return axios({
			method:Service.PROCENTERCATEGORY.methods.CATEGORY,
			service:Service.PROCENTERCATEGORY.name,
			args:args
		})
	},
	//获取部署列表
	getDeployLists(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.DEPLOYLIST,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},
	//获取流程列表
	FLOWLIST(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.FLOWLIST,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},
	//部署流程挂起
	suspendProcDef(args){
		return axios({
			method:Service.PROCENTERDEPLOYCTL.methods.SUSPENDPROCDEF,
			service:Service.PROCENTERDEPLOYCTL.name,
			args:args
		})
	},

	//部署流程恢复
	activateProcDef(args){
		return axios({
			method:Service.PROCENTERDEPLOYCTL.methods.ACTIVATEPROCDEF,
			service:Service.PROCENTERDEPLOYCTL.name,
			args:args
		})

	},

    //撤销流程接口
    deleteProcess(args){
        return axios({
            method:Service.PROCENTERDEPLOYCTL.methods.DELETEPROCESS,
            service:Service.PROCENTERDEPLOYCTL.name,
            args:args
        })
    },

	//获取流程图
	getProDiagram(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.PRODIAGRAM,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},

	//部署新流程
	deployProcess(args){
		return axios({
			method:Service.PROCENTERDEPLOY.methods.DEPLOYBYZIP,
			service:Service.PROCENTERDEPLOY.name,
			args:args
		})
	},

	//获取待办任务流程名
	getProcNames(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.PROCESSNAME,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})

	},

	//获取待办列表
	getDeployList(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.GETUSERTASKS,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},

	//流程挂起
	suspendProcess(args){
		return axios({
			method:Service.PROCENTERDEPLOYCTL.methods.SUSPENDPROCESS,
			service:Service.PROCENTERDEPLOYCTL.name,
			args:args
		})
	},

	//流程恢复
	activateProcess(args){
		return axios({
			method:Service.PROCENTERDEPLOYCTL.methods.ACTIVAREPROCESS,
			service:Service.PROCENTERDEPLOYCTL.name,
			args:args
		})
	},
	//获取审批流程
	getProcessDetail(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.PROCESSDETAIL,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},

	//获取用户名
	getUserinfoName(args){
		return axios({
			method:Service.USERINFODATD.methods.ACOUNT,
			service:Service.USERINFODATD.name,
			args:args
		})

	},

	//获取系统人员列表
	getSystemCode(args){
		return axios({
			method:Service.SYSTEMCODE.methods.GETSYSTEMCODE,
			service:Service.SYSTEMCODE.name,
			args:args
		})
	},

	// 获取已办进行中
	getProcessInsts(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.PROCESSINSTS,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},
	// 获取已办已完成
	getHistoricProcessInsts(args){
		return axios({
			method:Service.PROCENTERDEPLOYLIST.methods.HISTORYPROCESSINSTS,
			service:Service.PROCENTERDEPLOYLIST.name,
			args:args
		})
	},
	//获取供应商人员列表
	getSupperShop(args){
		return axios({
			method:commonApiService.SUPPLY_MASTERDATA.methods.queryShop,
			service:commonApiService.SUPPLY_MASTERDATA.name,
			args:args
		})
	},
	//更改处理人
	updateAssignee(args){
		return axios({
			method:Service.PROCENTERDEPLOYCTL.methods.UPDATEASSIGNEE,
			service:Service.PROCENTERDEPLOYCTL.name,
			args:args
		})
	},

	// 通过用户名获取用户信息
	getUserinfoByName(args){
		return axios({
			method:Service.USERINFODATD.methods.FINDUIDBYNAME,
			service:Service.USERINFODATD.name,
			args:args
		})
	},

	//执行授权
	impowerByAssigneeId(args){
		return axios({
			method:Service.IMPOWERSERVICE.methods.CREATEAGENCY,
			service:Service.IMPOWERSERVICE.name,
			args:args
		})
	},

	//授权列表
	impowerList(args){
		return axios({
			method:Service.IMPOWERSERVICE.methods.IMPOWERLIST,
			service:Service.IMPOWERSERVICE.name,
			args:args
		})
	},

	//取消授权
	cancelImpowerByRid(args){
		return axios({
			method:Service.IMPOWERSERVICE.methods.DELETEAGENCY,
			service:Service.IMPOWERSERVICE.name,
			args:args
		})
	},

    //添加分类
    createCategory(args){
	    return axios({
            method:Service.CATEGORY.methods.CREATEGATEGORY,
            service:Service.CATEGORY.name,
            args:args
        })
    },

    //修改分类数据
    updateCategory(args){
        return axios({
            method:Service.CATEGORY.methods.UPDATECATEGORY,
            service:Service.CATEGORY.name,
            args:args
        })
    },

    //修改分类状态
    updateStatusCategory(args){
        return axios({
            method:Service.CATEGORY.methods.UPDATECATEGORYSTATUS,
            service:Service.CATEGORY.name,
            args:args
        })
    },

    //查询分类数据
    searchProCategory(args){
        return axios({
            method:Service.CATEGORY.methods.SEARCHCATEGORY,
            service:Service.CATEGORY.name,
            args:args
        })
    },

    getCategoryTree(args){
        return axios({
            method:Service.CATEGORY.methods.TREE,
            service:Service.CATEGORY.name,
            args:args
        })
    },

    getCategoryPid(args){
        return axios({
            method:Service.CATEGORY.methods.CATEGORYPIDS,
            service:Service.CATEGORY.name,
            args:args
        })
    },
    //发起流程
    startProcess(args){
        return axios({
            method:Service.PROCENTERDEPLOYCTL.methods.STARTPROCESS,
            service:Service.PROCENTERDEPLOYCTL.name,
            args:args
        })
    },

    //处理任务
    completeTask(args){
        return axios({
            method:Service.PROCENTERDEPLOYCTL.methods.COMPLETETASK,
            service:Service.PROCENTERDEPLOYCTL.name,
            args:args
        })
    },
    //返回流程图并高亮当前运行节点
    retrieveProcessPicture(args){
        return axios({
            method:Service.PROCENTERDEPLOYLIST.methods.RETRIEVEPROCESSPICTURE,
            service:Service.PROCENTERDEPLOYLIST.name,
            args:args
        })
    },
    //获取选中的节点信息
    getActivityInfo(args){
        return axios({
            method:Service.PROCENTERDEPLOYLIST.methods.GETACTIVITUINFO,
            service:Service.PROCENTERDEPLOYLIST.name,
            args:args
        })
    }
}
