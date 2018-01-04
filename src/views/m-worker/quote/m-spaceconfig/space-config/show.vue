<template>
    <div class="spaceconfig">
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
    import Service from 'src/services/worker/spaceconfig/Service.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'

    export default {
        name: 'show',
        components: {
            EditTemplate
        },
        data(){
            return {
                breadcrumbData:[{title:'工模售前'},{title:'配置管理'},{title:'空间配置'}],
                treeData: [],
                    treeProps: {
                        label: 'name',
                        children: 'children'
                    },

                 columns:
                        [
                            { "prop": "id", "label": "空间ID" },
                            { "prop": "name", "label": "使用空间名称" },
                        ],


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
                this.dialogTitle = '新增空间类型'
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
                    this.dialogTitle = '编辑空间类型'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id
                }
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

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

         },
     created(){
        console.log()
     }



    }


</script>

<style lang="css" scope>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }
    .spaceconfig .g-main-container{

        display: flex;
        flex-direction: column;

     }
</style>
