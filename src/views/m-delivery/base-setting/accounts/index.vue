<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="false"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="view"
            @table-selection-change="selectionChange"
            @list-view="view"
            @list-edit="edit"
            @list-add="add"
            @list-delete="remove"
            @search-submit="onSearchSubmit"
            @tree-node-click="onTreeClick"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    export default {
        data(){
            return {
                breadcrumbData: [{title: '交付'}, {title: '交付基础配置'}, {title: '核算发包配置'}],
                searchFields: [
                    {
                        type: 'popup',
                        label: '产品包模板',
                        name: 'productPkgTempId',
                        textValue: 'tempName',
                        triggerOnFocus:false,
                        filedValue: 'id',
                        remote: true,
                        service: Service.PRSPQM.name,
                        method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"tempName_like",
                        dialog: {
                            title: '产品包模板',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包模板名称', name: 'tempName_like'},
                                ]
                            },
                            table:{
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                                args:{ search: { tempStatus: 2 } },
                                radioCol:true,
                                columns:[
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'tempName',
                                    label: '产品包模板名称'
                                }
                                ]
                            }
                        }
                    },
                    {type: 'date', label: '生效日期自', name: 'effectTime_gt'},
                    {type: 'date', label: '生效日期至', name: 'effectTime_lt'}
                ],
                searchOptions:{},
                treeData:[],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {prop: 'productPkgTempName', label: '产品包模板'},
                    {prop: 'effectTime', label: '生效日期',formatter: this.dateParser},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateName', label: '最后更新人'},
                    {prop: 'updateTime', label: '更新时间', formatter: 'dateParser'}
                ],
                tableService: Service.ENTRY.name,
                tableMethod:Service.ENTRY.methods.accountsConfigQueryPage,
                tableArgs:{sort: ['id_desc']},
                selIds: []
            }
        },
        created(){
            TemplateOperator.queryTreeByType({typeCodes:['001003010']}).then((res) => {
                if(res.data.status === 200){
                    this.treeData = [res.data.result];
                }
            })
        },
        // watch:{
        //     $route(val){
        //         if(val.path == '/tochat-delivery/base-setting/accounts-index'){
        //             this.$refs['list-view'].getTableInstance().reloadTable();
        //         }
        //     }
        // },
        activated(){
            if(this.$route.path == '/tochat-delivery/base-setting/accounts-index'){
                this.$refs['list-view'].getTableInstance().reloadTable();
            }
        },
        methods:{
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            add(){
                this.$router.push({
                    path: '/tochat-delivery/base-setting/accounts-detail?type=add'
                })
            },
            edit(){
                let selIds = this.selIds;
                if (selIds.length === 0) {
                    this.$message.error('请选择需要操作的行！')
                }else if(selIds.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.$router.push({
                        path: '/tochat-delivery/base-setting/accounts-detail?type=edit&id='+selIds[0]
                    })
                }
            },
            view(){
                let selIds = this.selIds;
                if (selIds.length === 0) {
                    this.$message.error('请选择需要操作的行！')
                }else if(selIds.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.$router.push({
                        path: '/tochat-delivery/base-setting/accounts-detail?type=view&id='+selIds[0]
                    })
                }
            },
            remove(){
                let selIds = this.selIds;
                if (selIds.length === 0) {
                    this.$message.error('请选择需要操作的行！')
                }else{
                    this.$confirm('是否确定删除？', '提示',{
                        type: 'warning'
                    }).then((result)=>{
                        if(result){
                            let username = Cookie.get('t8t-tc-username') ? Cookie.get('t8t-tc-username') : '';
                            Model.accountsConfigSetDeleted({ids: selIds, updateBy: username, updateName: username}).then((res)=>{
                                if(res.data.status === 200){
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '删除成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: ()=>{
                                            this.$refs['list-view'].getTableInstance().reloadTable();
                                        }
                                    });
                                }else{
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }
                            }).catch((error)=>{
                                this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: '操作失败！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                });
                            })
                        }
                    }).catch(()=>{

                    })
                }
            },
            //行变化事件
            selectionChange (rows,selIds){
                //已选择行
                this.selIds = selIds;
            },
            onTreeClick (nodeData){
                this.tableArgs = {page:1, size:20, sort: ['id_desc'], search: { organizationId: nodeData.id }}
            },
            onSearchSubmit(formData){
                this.tableArgs = {page:1, size:20, sort: ['id_desc'], search: formData}
            }
        }
    }
</script>
