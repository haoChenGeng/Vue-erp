import axios from 'src/utils/axios.js'
import Service from './Service.js'
import commonApi from 'src/services/commonApi/commonApi.js'

export default {
    getCommonOptions(args){
        let arg =  {
            page: 1,
            search: args, // { pPropertyCode: code}
            size: 100
        }
        let list = [];
        commonApi.queryUnionParent(arg).then((res) => {
            if (res.data.status === 200) {
                res.data.result.forEach((item) => {
                    if (item.propertyStatus===1) {
                        list.push({
                            value: item.id,
                            text: item.propertyName
                        })
                    }
                });
            }
        });
        return list;
    },
    getCommonOptionsByWholeCode(wholeCode,depth){
        if(!wholeCode){
            return [];
        }
        let args =  {
            wholeCode: wholeCode,
            depth : depth || 3
        }
        let list = [];
        axios({
            method: Service.PROPERTY.methods.queryChildrenByWholeCode,
            service: Service.PROPERTY.name,
            args: args
        }).then((res) => {
            if (res.data.status === 200) {
                res.data.result.forEach((item) => {
                    if (item.propertyStatus===1) {
                        list.push({
                            value: item.wholeCode,
                            text: item.propertyName
                        })
                    }
                });
            }
        });
        return list;
    },
    getCommonOptionsByWholeCodes(wholeCodes,depth){
        if(!wholeCodes){
            return {};
        }
        let args =  {
            wholeCodes: wholeCodes,
            depth : depth || 3
        }
        let obj = {};
        axios({
            method: Service.PROPERTY.methods.queryChildrenByWholeCodes,
            service: Service.PROPERTY.name,
            args: args
        }).then((res) => {
            if (res.data.status === 200) {
                let result = res.data.result;
                for(let key in result){
                    obj[key] = [];
                    result[key].forEach((item)=>{
                        obj[key].push({
                            value: item.wholeCode,
                            text: item.propertyName
                        })
                    })
                }
            }
        });
        return obj;
    },
    unitPriceSave(args) {
        return axios({
            method: Service.TEMPLATE.methods.unitPriceSave,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    unitPriceSetExpire(args) {
        return axios({
            method: Service.TEMPLATE.methods.unitPriceSetExpire,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    productPkgTempBaseQuery(args) {
        return axios({
            method: Service.PRSPQM.methods.productPkgTempBaseQuery,
            service: Service.PRSPQM.name,
            args: args
        })
    },
    expenseDictionarySave(args){
         return axios({
            method: Service.TEMPLATE.methods.expenseDictionarySave,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    expenseDictionaryBatchSetStatus(args){
         return axios({
            method: Service.TEMPLATE.methods.expenseDictionaryBatchSetStatus,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    productPackageQueryPage(args){
         return axios({
            method: Service.PRSPQM.methods.productPackageQueryPage,
            service: Service.PRSPQM.name,
            args: args
        })
    },
    expenseDictionaryQueryPage(args){
         return axios({
            method: Service.TEMPLATE.methods.expenseDictionaryQueryPage,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    expenseQuotaQueryPage(args){
         return axios({
            method: Service.TEMPLATE.methods.expenseQuotaQueryPage,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    expenseQuotaSetExpire(args){
         return axios({
            method: Service.TEMPLATE.methods.expenseQuotaSetExpire,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    expenseQuotaSave(args){
        return axios({
            method: Service.TEMPLATE.methods.expenseQuotaSave,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    accountsConfigCreate(args){
        return axios({
            method: Service.ENTRY.methods.accountsConfigCreate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    accountsConfigUpdate(args){
        return axios({
            method: Service.ENTRY.methods.accountsConfigUpdate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    accountsConfigQueryDosage(args){
        return axios({
            method: Service.ENTRY.methods.accountsConfigQueryDosage,
            service: Service.ENTRY.name,
            args: args
        })
    },
    accountsConfigFindById(args){
        return axios({
            method: Service.ENTRY.methods.accountsConfigFindById,
            service: Service.ENTRY.name,
            args: args
        })
    },
    accountsConfigSetDeleted(args){
        return axios({
            method: Service.ENTRY.methods.accountsConfigSetDeleted,
            service: Service.ENTRY.name,
            args: args
        })
    },
    accountItemGetAccountItem(args){
        return axios({
            method: Service.PSSUB.methods.accountItemGetAccountItem,
            service: Service.PSSUB.name,
            args: args
        })
    },
    contractBillGetDetail(args){
        return axios({
            method: Service.PSSUB.methods.contractBillGetDetail,
            service: Service.PSSUB.name,
            args: args
        })
    },
    projectNodeGetByProcessId(args){
        return axios({
            method: Service.PLAN.methods.projectNodeGetByProcessId,
            service: Service.PLAN.name,
            args: args
        })
    },
    decorationOrderFindOrderById(args){
        return axios({
            method: Service.PRSMDM.methods.decorationOrderFindOrderById,
            service: Service.PRSMDM.name,
            args: args
        })
    },
    checkGetProjectDetail(args){
        return axios({
            method: Service.YANSHOU.methods.checkGetProjectDetail,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    decorationOrderFindSheetById(args){
        return axios({
            method: Service.PRSMDM.methods.decorationOrderFindSheetById,
            service: Service.PRSMDM.name,
            args: args
        })
    },
    settleConfigSetStatus(args){
        return axios({
            method: Service.PSSET.methods.settleConfigSetStatus,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleConfigListAsTree(args){
        return axios({
            method: Service.PSSET.methods.settleConfigListAsTree,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleConfigCreate(args){
        return axios({
            method: Service.PSSET.methods.settleConfigCreate,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleConfigUpdate(args){
        return axios({
            method: Service.PSSET.methods.settleConfigUpdate,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleConfigGetDetail(args){
        return axios({
            method: Service.PSSET.methods.settleConfigGetDetail,
            service: Service.PSSET.name,
            args: args
        })
    },
    sensitvieInfoGetPhone(args){
        return axios({
            method: Service.SYSSTI.methods.sensitvieInfoGetPhone,
            service: Service.SYSSTI.name,
            args: args
        })
    },
    sensitvieInfoGetPhoneOfUser(args){
        return axios({
            method: Service.SYSSTI.methods.sensitvieInfoGetPhoneOfUser,
            service: Service.SYSSTI.name,
            args: args
        })
    },
    settleBillItemQueryPage(args){
        return axios({
            method: Service.PSSET.methods.settleBillItemQueryPage,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleBillFindDetailByProcessId(args){
        return axios({
            method: Service.PSSET.methods.settleBillFindDetailByProcessId,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleInstallBillFindByProcessId(args){
        return axios({
            method: Service.PSSET.methods.settleInstallBillFindByProcessId,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleBillRemit(args){
        return axios({
            method: Service.PSSET.methods.settleBillRemit,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleInstallBillApplyRemit(args){
        return axios({
            method: Service.PSSET.methods.settleInstallBillApplyRemit,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleBillVerify(args){
        return axios({
            method: Service.PSSET.methods.settleBillVerify,
            service: Service.PSSET.name,
            args: args
        })
    },
    settleInstallBillVerify(args){
        return axios({
            method: Service.PSSET.methods.settleInstallBillVerify,
            service: Service.PSSET.name,
            args: args
        })
    },
    callRecordGetByUuid(args){
        return axios({
            method: Service.PSCSM.methods.callRecordGetByUuid,
            service: Service.PSCSM.name,
            args: args
        })
    },
    projectGetById(args){
        return axios({
            method: Service.PSSET.methods.projectGetById,
            service: Service.PSSET.name,
            args: args
        })
    },
}
