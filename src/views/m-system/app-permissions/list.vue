<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @list-view="doView"
            @list-edit="doEdit"
            @list-add="doAdd"
            @list-enable="doEnable"
            @list-disable="doDisable"
            @list-oplog="doOplog"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="handleTableDobuleClick"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
        <detail-dialog
            v-if="showDetail"
            :id="detailId"
            :title="detailTitle"
            :type="detailType"
            ref="detailDialog"
        ></detail-dialog>
        <operation-records
            v-if="showOprationRecords"
            :id="detailId"
            ref="oprationRecordsDialog"
        >
        </operation-records>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Services from 'src/services/system/Service.js'
    import DetailDialog from './dialog.vue'
    import OperationRecords from './operation-records.vue'
    import api from 'src/services/system/app.js'
    import Cookie from 'js-cookie'
    export default {
        components: {
            T8tListView,
            DetailDialog,
            OperationRecords
        },
        watch: {
            // $route: function () {
            //     this.$refs['list-view'].getTableInstance().reloadTable()
            // }
        },
        activated () {
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // service 和 method 目前需要加密
                deleteMethod: 'grJ0da3SuZlogdFJdFYaPsUbrOZIRv-',
                tableArgs: {},
                showDetail:false,
                // 表头描述
                tableColumns: [
                    {prop: 'permissionCode', label: '权限编码'},
                    {prop: 'permissionName', label: '权限名'},
                    {prop: 'developType', label: '开发类型', list: 'developType'},
                    {prop: 'permissionType', label: '权限类型', list: 'permissionType'},
                    {prop: 'isDel', label: '是否启用', list: 'isDel'},
                    {prop: 'enableOrgName', label: '启用组织'},
                    {prop: 'isShow', label: '是否展示', list: 'isShow'},
                    {prop: 'androidVersionNumber', label: 'android版本号',formatter(val, row, col, table){
                           if(val == '' || val == '0'){
                                if(row.developType == 0){
                                   return '新功能'
                                }else{
                                    return '无'
                                }
                           }
                           return val
                        }},
                    {prop: 'androidVersionValue', label: 'android版本值',formatter(val, row, col, table){
                           if(val == '' || val == '0'){
                               if(row.developType == 0){
                                   return '新功能'
                                }else{
                                    return '无'
                                }
                           }
                           return val
                        }},
                    {prop: 'iosVersionNumber', label: 'ios版本号',formatter(val, row, col, table){
                           if(val == '' || val == '0'){
                               if(row.developType == 0){
                                   return '新功能'
                                }else{
                                    return '无'
                                }
                           }
                           return val
                        }},
                    {prop: 'iosVersionValue', label: 'ios版本值',formatter(val, row, col, table){
                           if(val == '' || val == '0'){
                               if(row.developType == 0){
                                   return '新功能'
                                }else{
                                    return '无'
                                }
                           }
                           return val
                        }},
                    {prop: 'updateTime', label: '上次更新时间', formatter: 'dateParser'},
                    {prop: 'createTime', label: '创建日期', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input',label: '权限名称',name: 'permissionName_like'},
                    {type: 'input',label: '权限编码',name: 'permissionCode_like'},
                    {type: 'select',label: '是否启用',name: 'isDel', selectSourceKey:'isDel'},
                    {type: 'select',label: '是否展示',name: 'isShow', selectSourceKey:'isShow'},
                    {type:'input', label:'Android版本号', name:'androidVersionNumber'},
                    {type:'input', label:'Android版本值', name:'androidVersionValue'},
                    {type:'input', label:'iOS版本号', name:'iosVersionNumber'},
                    {type:'input', label:'iOS版本值', name:'iosVersionValue'},
                    {type:'select', label:'是否公共权限', name:'isPublic', selectSourceKey:'isPublic'},
                    {type:'select', label:'权限类型', name:'permissionType', selectSourceKey:'permissionType'},
                    {type:'select', label:'开发类型', name:'developType', selectSourceKey:'developType'}
                ],
                // 面包屑
                breadcrumbData: [{ title: '交付' },{ title: '业务APP' },{ title: 'APP权限管理' }
                ],
                // 搜索项对应值
                searchOptions: {
                    permissionType: [
                    ],
                    developType: [
                        {value: 0, text: '原生'},
                        {value: 1, text: 'H5'}
                    ],
                    isDel: [
                        {value: 0, text: '启用'},
                        {value: 1, text: '禁用'}
                    ],
                    isShow: [
                        {value: 0, text: '展示'},
                        {value: 1, text: '不展示'}
                    ],
                    isPublic:[
                        {value: 0, text: '是'},
                        {value: 1, text: '否'}
                    ],
                    enableOrg: [
                    ]
                },
                detailId:null,
                detailTitle:'新增权限',
                detailType:'add',
                method:Services.APP.methods.permissionExtServiceQueryPage,
                service:Services.APP.name,
                showOprationRecords:false
            }
        },
        created(){
            this.getCommonOptions('11013', 'permissionType')
        },
        methods: {
            onSearchSubmit (obj) {
                this.tableArgs = {search: obj}
            },
            onchange (val) {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                let that = this
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.$refs['list-view'].getTableInstance().reloadTable()
                        }
                    })
                }
            },
            doView () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                this.detailId = rows[0]['id']
                this.detailType = 'view'
                this.detailTitle = '查看权限'
                this.showDetail = true
            },
            handleTableDobuleClick(row){
                this.detailId = row.id
                this.detailType = 'view'
                this.detailTitle = '查看权限'
                this.showDetail = true
            },
            doAdd () {
                this.detailType = 'add'
                this.detailTitle = '添加权限'
                this.showDetail = true
                this.detailId = null
            },
            doEdit () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                this.detailId = rows[0]['id']
                this.detailType = 'edit'
                this.detailTitle = '编辑权限'
                this.showDetail = true
            },
            doOplog(){
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                this.showOprationRecords = true
                this.detailId = rows[0]['id']
            },
            doEnable(){
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                let isDel = rows.every((item) => {
                    return item.isDel == 1
                })
                if(!isDel){
                     this.$message.error('只能对已禁用的行进行操作')
                    return
                }
                let args = {permissionExt:[]}
                args.permissionExt = rows.reduce((acc, item) =>{
                            acc.push({
                                 "id": item.id,
                                 "isDel": 0,
                                 "updateUser": Cookie.get('t8t-tc-uid'),
                                 "updateName": Cookie.get('t8t-tc-username'),
                                "updateBy": Cookie.get('t8t-tc-username')
                            })
                            return acc
                        }, [])
                this.updIsDel(args, 'ENABLE')
            },
            doDisable(){
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                let isDel = rows.every((item) => {
                    return item.isDel == 0
                })
                if(!isDel){
                     this.$message.error('只能对未禁用的行进行操作')
                    return
                }
                let args = {permissionExt:[]}
                args.permissionExt = rows.reduce((acc, item) =>{
                            acc.push({
                                 "id": item.id,
                                 "isDel": 1,
                                 "updateUser": Cookie.get('t8t-tc-uid'),
                                 "updateName": Cookie.get('t8t-tc-username'),
                                "updateBy": Cookie.get('t8t-tc-username')
                            })
                            return acc
                        }, [])
                this.updIsDel(args, 'DISABLE')
            },
            updIsDel(args, button){
                 this.$refs['list-view'].$refs['list-toolbar'].disableBySymbol(button);
                api.permissionExtServiceUpdateIsDel(args).then((res) => {
                    this.$refs['list-view'].$refs['list-toolbar'].unDisableBySymbol(button);
                    if(res.data.status == 200){
                        var _this = this
                        this.$msgbox({
                            title: '更新成功',
                            type: 'success',
                            message: '',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        }).then((res) =>{
                            _this.$refs['list-view'].getTableInstance().reloadTable()
                        })
                    }else{
                        this.$msgbox({
                            title: '更新失败',
                            type: 'error',
                            message: res.data.error || res.data.result,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                          })
                    }
                }).catch(()=>{
                    this.$refs['list-view'].$refs['list-toolbar'].unDisableBySymbol(button);
                     this.$msgbox({
                            title: '更新失败',
                            type: 'error',
                            message: '服务器异常',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                          })
                })
            },
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.searchOptions[selectName] = list;
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
