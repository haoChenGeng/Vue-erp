<template>
    <div class="apartment-space">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

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
    import Service from 'src/services/worker/apartmentspace/Service.js'
    import TemplateOperator from 'src/services/worker/apartmentspace/base-method.js'
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
                breadcrumbData:[{title:'工模售前'},{title:'配置管理'},{title:'户型空间'}],
                treeData: [],
                    treeProps: {
                        label: 'name',
                        children: 'children'
                    },

                columns:[],

                userSpace:{
                    'houseType':[],
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

        created(){

            this.getCommonOptions('houseType')//户型空间

       },
        watch: {
            userSpace: function(val,oldVal) {
                this.getdata()
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
                this.dialogTitle = '新增户型空间'
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
                    this.dialogTitle = '编辑户型空间'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].houseTypeId
                }
            },




            //查询空间配置
            getCommonOptions: function(selectName) {
                let arg =  {
                    page: 1,
                    size: 100
                }
                let list = []
                let copyUserSpace = Object.assign({},this.userSpace);
                TemplateOperator.queryUserSpace(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })

                        })
                        copyUserSpace[selectName] = list
                        this.userSpace = copyUserSpace
                    }
                })

            },

            getdata(){
                let datas=[]
                datas.push({ prop:"houseTypeName",label:"户型",fixed:'left' })

                if (this.userSpace.houseType) {

                    this.userSpace.houseType.forEach((item)=>{
                        datas.push({
                            prop:item.value,
                            label:item.text
                        })

                    })
                }

                this.columns=   datas;

            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

         },



    }


</script>

<style lang="css" scope>
   .apartment-space .table-container {
        /*flex: 1;
        overflow: auto;
        margin-left: -1px;
        max-width: 1721px;*/
     }
    .apartment-space .g-main-container{

        display: flex;
        flex-direction: column;

     }

</style>
