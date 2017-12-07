<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @ENABLE="enabled"
                    @DISABLE="disabled"
                    @ADD="add"
                    @EDIT="edit"
                    @SHOW_REF="showRef"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                >
                    <template slot="id" scope="scope">
                        <a href="javascript:;" @click="showDetail(scope.row['id'], scope.row['name'])">{{scope.row['id']}}</a>
                    </template>
                </t8t-table>
            </div>
        </div>
        <edit-template
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </edit-template>
    </div>
</template>

<script>
    import EditTemplate from './edit-template.vue'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'template-base',
        components: {
            EditTemplate
        },
        data () {
            return {
                breadcrumbData: [{ title: '交付' },{ title: '交付基础数据' },{ title: '排期模板维护' }],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input',label: 'ID',name: 'id'},
                    {type: 'input',label: '名称',name: 'name_like'},
                    {type: 'select',label: '报价模板',name: 'quotationId',selectSourceKey:'quotations',filterable:true},
                    {type: 'select',label: '状态',name: 'moduleStatus', selectSourceKey:'module_status_arr',filterable:true},
                    {type: 'datetime',label: '生效日期',name: 'effectTime_gt'},
                    {type: 'datetime',label: '生效日期至',name: 'effectTime_lte'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    module_status_arr: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '禁用',
                            value: 0
                        }
                    ],
                    quotations: [] //报价模板list
                },
                columns:
                    [
                        { "prop": "id", "label": "ID" },
                        { "prop": "name", "label": "名称" },
                        { "prop": "insideSchdule", "label": "内部工期" },
                        { "prop": "outsideSchdule", "label": "外部工期" },
                        { "prop": "moduleStatus", "label": "状态" , "list":"moduleStatus"},
                        { "prop": "effectTime", "label": "生效日期", "formatter": "dateParser"}
                    ],
                commonData: {
                    moduleStatus: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '禁用',
                            value: 0
                        }
                    ]
                },
                service: Service.TEMPLATE.name,
                method:  Service.TEMPLATE.methods.QUERY,
                args: {},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[],
            }
        },
        created (){
            TemplateOperator.queryQuoteList({page:1,size:200,optType:1}).then((res) => {
                if(res.data.status === 200){
                    let list = [];
                    let rows = res.data.result.rows;
                    for(let i in rows){
                        list.push({text:rows[i]['tempName'], value: rows[i]['id']});
                    }
                    this.selectSource.quotations = list;
                }
            });
            TemplateOperator.queryTreeByType({typeCodes:['001003010']}).then((res) => {
                if(res.data.status === 200){
                    this.treeData = [res.data.result];
                }
            })
        },
        methods: {
            //搜素
            submitSearch(obj) {
                this.args = { search: obj }
            },
            onTreeClick (nodeData){
                this.args = {page:1, size:20, search: { organizeId: nodeData.id }}
            },
            //查看详情
            showDetail: function(id, name){
                this.$router.push({
                    path: '/tochat-delivery/template-detail',
                    query:{id: id, name:name}
                })
            },
            //启用
            enabled: function(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要启用的行！');
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要启用的行！');
                    }
                    let data = {ids: ids, status:1 ,optType: 1, updateUser: +Cookie.get('t8t-tc-uid')};
                    TemplateOperator.setModuleStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '启用成功！'
                            });
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            disabled: function(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要禁用的行！')
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要禁用的行！');
                    }
                    let data = {ids: ids, status:0 ,optType: 2, updateUser: +Cookie.get('t8t-tc-uid')}
                    TemplateOperator.setModuleStatus(data).then((res) => {
                        console.log(res)
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '禁用成功！'
                            });
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            add () {
                this.dialogTitle = '新增排期模板'
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
            },
            edit (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要编辑的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行编辑！')
                } else{
                    this.dialogTitle = '编辑排期模板'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id
                }
            },
            showRef (){
                let rows = this.$refs['t8tTable'].getSelectRows();
                if(rows.length < 1){
                    this.$message.error('请选择要处理的行！')
                    return
                }
                if(rows.length > 1){
                    this.$message.error('只能查看一行！')
                    return
                }
                this.$router.push({path: '/tochat-delivery/template-ref', query:{refId:rows[0]['id'], scheduleName:rows[0]['name']}})
                // this.$msgbox({
                //     title: '消息',
                //     type: 'success',
                //     message: '查看引用',
                //     confirmButtonText: '知道了',
                //     confirmButtonClass: 'is-plain'
                // })
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange (rows){
                //已选择行
                this.selectedRows = rows;
                //启用禁用按钮交互
                let enableStatus = false;
                let disableStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].moduleStatus == 1){
                            enableStatus = true;
                        }
                        if(rows[i].moduleStatus == 0){
                            disableStatus = true;
                        }
                    }
                }
                if(enableStatus){
                    this.$refs['toolbar'].disableBySymbol('ENABLE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('ENABLE');
                }
                if(disableStatus){
                    this.$refs['toolbar'].disableBySymbol('DISABLE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                }
            }
        }
    }
</script>

<style>

</style>
