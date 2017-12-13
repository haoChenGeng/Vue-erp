<template>
    <div class="productpackage">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="g-main-container">
            <!-- <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree> -->
            <div class="t8t-table">
                <t8t-toolbar
                    @EDIT-SUBMIT="editSubmit"
                    @DISABLE="disabled"
                    @ADD="add"
                    @EDIT="edit"
                    @VERSION-SHOW="versionShow"
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

    import EditTemplate from './edit.vue'
    import Service from 'src/services/worker/productpackage/Service.js'
    import TemplateOperator from 'src/services/worker/productpackage/base-method.js'
    import api from 'src/utils/api.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'

    export default {
        name: 'show',
        components: {
            EditTemplate
        },
        data(){
            return {
                breadcrumbData:[{title:'工模售前'},{title:'配置管理'},{title:'产品包'}],
                treeData: [],
                    treeProps: {
                        label: 'name',
                        children: 'children'
                    },

                 columns:
                        [
                            { "prop": "id", "label": "产品包ID" },
                            { "prop": "pkgName", "label": "产品包名称" },
                            { "prop": "bizType", "label": "业务类型" ,"list":"bizType"}
                        ],

                commonData: {
                    bizType: [],

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

        created () {

            this.getCommonOptions('11008','bizType')//业务类型

        },

        methods:{
            //搜素
            submitSearch(obj) {
                this.args = { search: obj }

            },
            onTreeClick (nodeData){
                this.args = {page:1, size:20, search: { organizeId: nodeData.id }}
            },

            add () {
                this.dialogTitle = '新建产品包'
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
                    this.dialogTitle = '编辑产品包'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id
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
                    let data = {quoteItemBatch:{ids: ids, forbiddenStatus:1, updateUser: +Cookie.get('t8t-tc-uid')}}
                    TemplateOperator.setModuleStatus(data).then((res) => {

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

            //提交
            editSubmit: function(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要提交的行！');
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要提交的行！');
                    }
                    let data = {quoteItemBatch:{ids: ids, qiStatus:2 , updateUser: +Cookie.get('t8t-tc-uid')}};
                    TemplateOperator.setModuleStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '提交成功！'
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

            versionShow (){
                let rows = this.$refs['t8tTable'].getSelectRows();
                if(rows.length < 1){
                    this.$message.error('请选择要处理的行！')
                    return
                }
                if(rows.length > 1){
                    this.$message.error('只能查看一行！')
                    return
                }
                this.$router.push({path: '/zacktest/versionShow', query:{refId:rows[0]['id'], scheduleName:rows[0]['name']}})
                this.$msgbox({
                    title: '消息',
                    type: 'success',
                    message: '查看引用',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
            },

            //行变化事件
            selectionChange (rows){

                //已选择行
                this.selectedRows = rows;
                //提交禁用按钮交互
                let editSubmit = false;
                let disableStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].qiStatus == 2){
                            editSubmit = true;
                        }
                        if(rows[i].forbiddenStatus == 1){
                            disableStatus = true;
                        }
                    }
                }
                if(editSubmit){
                    this.$refs['toolbar'].disableBySymbol('EDIT-SUBMIT');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('EDIT-SUBMIT');
                }
                if(disableStatus){
                    this.$refs['toolbar'].disableBySymbol('DISABLE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                }
            },

            //辅助资料--业务类型
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonData[selectName] = list
                    }
                })
            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

         },

    }


</script>

<style lang="css" scope>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }
    .productpackage .g-main-container{

        display: flex;
        flex-direction: column;

     }
</style>
