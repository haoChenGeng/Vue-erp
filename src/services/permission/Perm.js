/*
 * @FileName: Perm
 * @Description:
 * @Date: 2017-03-03
 * @version: 1.0
 * @author: <carl.wu@corp.to8to.com>
 */

import Cookie from 'js-cookie'
import Service from '../../utils/Service'
import axios from '../../utils/axios.js'
import newService from './Service.js'

export default {

    buttons (fid) {
        let args = {
            fatherUrl: fid,
            accountID: Cookie.get('t8t-tc-uid')
        }

        return axios({
            method: Service.PERM.methods.LIST_BY_ACCOUNTID_FATHERURL,
            service: Service.PERM.name,
            args: args
        })
    },
    getMemuTree (excluded) {
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.ALL_BIZ_OBJ_LIST_TREE,
            args: {
                excluded: excluded
            }
        })
    },
    getMemuTree2 (excluded) {
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.ALL_BIZ_OBJ_LIST_TREE2,
            args: {
                excluded: excluded
            }
        })
    },
    getSubMemuList (parentId) {
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.PERMISSION_LIST_SUB_LV,
            args: {
                parentId: parentId
            }
        })
    },
    updatePemSortId (sortList) {
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.UPDATE_PERM_SORT,
            args: {
                list: sortList
            }
        })
    },
    bizObjectAdd(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.bizObjectAdd,
            args: args
        })
    },
    bizObjectUpdate(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.bizObjectUpdate,
            args: args
        })
    },
    permissionGetById(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionGetById,
            args: args
        })
    },
    permissionDelete(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionDelete,
            args: args
        })
    },
    permissionAdd(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionAdd,
            args: args
        })
    },
    permissionUpdate(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionUpdate,
            args: args
        })
    },
    permissionQueryPage(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionQueryPage,
            args: args
        })
    },
    permissionDeleteByIdList(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.permissionDeleteByIdList,
            args: args
        })
    },
    systemCodeSearchByPage(args){
        return axios({
            service: newService.CONFIGURE.name,
            method: newService.CONFIGURE.methods.systemCodeSearchByPage,
            args: args
        })
    },
    genNewChildCode(args){
        return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.genNewChildCode,
            args: args
        })
    },
    accountRoleDetail(args){
         return axios({
            service: newService.PERM.name,
            method: newService.PERM.methods.accountRoleDetail,
            args: args
        })

    }
}
