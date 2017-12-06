/* eslint-disable no-trailing-spaces */
import apiCommon from 'src/services/commonApi/commonApi.js'
import axios from 'src/utils/axios.js'
import serviceAndMethodName from './serviceAndMethodName'

export default {

    // 初始化辅助资料
    propertyInit (code) {
        let args = {
            page: 1,
            search: {
                pPropertyCode: code,
                propertyStatus: 1
            },
            size: 100
        }
        let list = []
        apiCommon.queryUnionParent(args)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus === 1) {
                            list.push({
                                value: item.id,
                                text: item.propertyName
                            })
                        };
                    })
                }
            })
        return list
    },
    // 获得树形的奖惩角色数据
    getRpRoleAndType () {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.CONFIG_ROLE_QUERYLIST,
            args: {}
        })
    },

    // 新增奖惩记录
    createConfig (config) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.CONFIG_CREATE,
            args: {
                rewardpublishConfig: config
            }
        })
    },

    // 通过id查询奖惩制度
    queryOneConfig (id) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.CONFIG_QUERY_ONE,
            args: {
                id: id
            }
        })
    },

    // 修改记录
    updateOneConfig (dto) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.CONFIG_UPDATE_ONE,
            args: {
                dto: dto
            }
        })
    },

    // 作废
    invalidConfig (dto) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.CONFIG_INVALID,
            args: {
                dto: dto
            }
        })
    },

    // 新增奖惩记录
    createBill (dto) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_CREATE,
            args: {
                dto: dto
            }
        })
    },

    // 查看奖惩记录
    queryOneBill (id) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_QUERYONE,
            args: {
                id: id
            }
        })
    },

    // 查看奖惩记录--流程id
    queryOneBillByProcInsId (procInsId) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_QUERYONE_BYPROCINSID,
            args: {
                procInsId: procInsId
            }
        })
    },

    // 查看奖惩记录列表
    queryListBill (args) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_LIST,
            args: args
        })
    },

    // 修改奖惩记录
    updateBill (dto) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_UPDATEONE,
            args: {
                dto: dto
            }
        })
    },

    // 审核奖惩记录
    auditBill (dto) {
        return axios({
            service: serviceAndMethodName.T8T_PS_SET.service,
            method: serviceAndMethodName.T8T_PS_SET.method.BILL_AUDIT,
            args: {
                dto: dto
            }
        })
    },

    // 查看审批流
    auditBillDatail (id) {
        return axios({
            service: serviceAndMethodName.T8T_WKF_DAT.service,
            method: serviceAndMethodName.T8T_WKF_DAT.method.DETAIL,
            args: {
                query: {
                    procInsId: id
                }
            }
        })
    },


}
