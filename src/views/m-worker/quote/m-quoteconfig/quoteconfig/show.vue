<template>
    <div class="quoteconfig">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <!-- <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree> -->

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
    import Service from 'src/services/worker/quoteconfig/Service.js'
    import TemplateOperator from 'src/services/worker/quoteconfig/base-method.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import apiCommon from 'src/services/commonApi/commonApi.js'

    export default {
        name: 'show',
        components: {
            EditTemplate
        },
        data(){
            return {
                breadcrumbData:[{title:'工模售前'},{title:'配置管理'},{title:'报价字典'}],
                treeData: [],
                    treeProps: {
                        label: 'name',
                        children: 'children'
                    },
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '报价项编号',name: 'qiCode'},
                    {type: 'input',label: '报价项名称',name: 'qiName'},
                    {type: 'select',label: '报价项状态',name: 'qiStatus',selectSourceKey:'moduleStatus',filterable:true},
                    {type: 'input',label: '工艺详情',name: 'craftDetails'},
                    {type: 'select',label: '禁用状态',name: 'forbiddenStatus',selectSourceKey:'forbiddenStatus',filterable:true}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    moduleStatus: [
                        {
                            text: '待启用',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 3
                        },
                        {
                            text: '已启用',
                            value: 2
                        },

                    ],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],


                },
                 columns:
                        [
                            { "prop": "qiCode", "label": "报价项编号" ,'width':"150" },
                            { "prop": "qiName", "label": "报价项名称" ,'width':"230" },
                            { "prop": "qiType", "label": "报价项类型" ,'width':"230", list: 'qiTypes' },
                            { "prop": "qiUnit", "label": "单位" ,'width':"100" },
                            { "prop": "craftDetails", "label": "工艺详情" ,'width':"440"},
                            { "prop": "qiStatus", "label": "状态" , "list":"qiStatus" ,'width':"100"},
                            { "prop": "forbiddenStatus", "label": "是否禁用" , "list":"forbiddenStatus" ,'width':"100"}
                        ],
                    commonData: {
                        qiStatus: [
                        {
                            text: '待启用',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 3
                        },
                        {
                            text: '已启用',
                            value: 2
                        }
                    ],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],
                    qiTypes:[]
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

        methods:{
            //搜素
                submitSearch(obj) {
                    this.args = { search: obj }

                },
                onTreeClick (nodeData){
                    this.args = {page:1, size:20, search: { organizeId: nodeData.id }}
                },

            add () {
                this.dialogTitle = '新增报价字典项'
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
                    this.dialogTitle = '编辑报价字典项'
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

                  this.$msgbox({
                      title: '消息',
                      message: '请确认是否禁用？',
                      showCancelButton: true,
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                          let data = {quoteItemBatch:{ids: ids, forbiddenStatus:1, updateUser: +Cookie.get('t8t-tc-uid')}}
                    TemplateOperator.setModuleStatus(data).then((res) => {

                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '禁用成功！'
                            });
                            done();
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                        } else {
                          done();
                        }
                      }
                    });



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

            versionShow:function (){

                this.$router.push({path: 'versionShow'})
                // this.$msgbox({
                //     title: '消息',
                //     type: 'success',
                //     message: '查看引用',
                //     confirmButtonText: '知道了',
                //     confirmButtonClass: 'is-plain'
                // })
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
                    this.$refs['toolbar'].disableBySymbol('EDIT-SUBMIT');
                    this.$refs['toolbar'].disableBySymbol('EDIT');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                    this.$refs['toolbar'].unDisableBySymbol('EDIT');
                }
            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            //辅助资料
            getCommonOptions: function(fatherCode) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                let _this = this
                return new Promise(function (resolve, reject){
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
                                resolve(list)
                            }else{
                                reject(list)
                            }
                        })
                })
            },

         },
     created(){
         let _this = this
         this.getCommonOptions(30005)
             .then(res => {
                 _this.commonData['qiTypes'] = res
             })
             .catch(res => {

             })
     }



    }


</script>

<style lang="css" scope>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }

    .quoteconfig .g-main-container{

        display: flex;
        flex-direction: column;

     }
</style>
