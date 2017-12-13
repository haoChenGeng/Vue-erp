/**
* Created by tomy.li on 2017/5/11.
*/
<template>
    <div>
        <el-dialog title="报价字典项列表" class="g-w-1000 my-el-dialog selectQuoteItemdialog" v-model="addRowDialogVisible" @close="closeSelectQuoteDialog">
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                :showToggleBtn="false"
                @submit="submitSearch"
            >
            </t8t-search>
            <t8t-table
                :columns="mainTableColumns"
                :service="mainTableService"
                :method="mainTableMethod"
                :commonData="commonData"
                :args="args"
                :indexCol="false"
                :radioCol="false"
                style="min-height: 300px;"
                ref="t8ttable"
                :pageBar="true"
                @row-double-click="selectRow"
            >
            </t8t-table>
            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="addRowDialogVisible = false">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()">确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import quoteitem from 'src/services/worker/quoteitem/quoteitem.js'
    import quoteitemServices from 'src/services/worker/quoteitem/Service.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import config from './config.js'
    export default{
        props: {
            activeTableRef:{
                type: String,
                default: ''
            },
            currentQuoteCode: {
                type: String,
                default: ''
            },
            qiTypes: {
                type: Array,
                default: []
            }
        },
        name: 'selectQuoteItem',
        data(){
            return {
                activeTableRef:'',
                userId:+Cookie.get('t8t-tc-uid'),
                addRowDialogVisible: true,
                mainTableColumns:[
                    {
                        "prop": "qiCode",
                        "label": "报价项编码"
                    },
                    {
                        "prop": "qiName",
                        "label": "报价项名称"
                    },
                    {
                        "prop": "qiUnit",
                        "label": "单位"
                    },
                    {
                        "prop": "craftDetails",
                        "label": "工艺详情"
                    }
                ],
                mainTableService:quoteitemServices.quoteItem.name,
                mainTableMethod:quoteitemServices.quoteItem.methods.quoteItemQueryPage,
                args:{search:{forbiddenStatus:0,qiStatus:2,qiType_in:this.qiTypes}},
                commonData: {
                },
                formData:{
                    'tempName': '',
                    'orgId': null,
                    'pkgId': '',
                    'createUser':+Cookie.get('t8t-tc-uid'),
                },
                formCommonData:{
                },
                selectSource: {
                },
                dataSource:{
                },
                fields:[
                    {
                        name: 'qiCode',
                        placeholder: '报价项编码',
                        type: 'input',
                    },
                    {
                        name: 'qiName',
                        placeholder: '报价项名称',
                        type: 'input',
                    },
                    {
                        name: 'craftDetails',
                        placeholder: '工艺详情关键字',
                        type: 'input',
                    },
                ]
            }
        },
        created() {
        },
        methods: {

            //选中行
            selectRow(row, event){
                this.addRow(row)
                this.cancel()
            },

            closeSelectQuoteDialog() {
                this.$emit('close')
            },

            submit(){
                let tableObj = this.$refs['t8ttable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '未选择报价字典项'
                    })
                    return false
                }
                selections.forEach((item) => {
                    this.addRow(item)
                })
                this.cancel()

            },

            addRow(row){
                let tempdata =  {
                    qiId: row.id,  //报价项id
                    qiCodeVO: row.qiCode, //报价项编码
                    qiIdVO: row.qiName, //报价项名称
                    qiUnitVO: row.qiUnit //单位
                }
                let tableObj = this.$parent.$refs[this.activeTableRef]


                if( !this.currentQuoteCode ){
                    Object.assign(tableObj.templateData,tempdata);
                    tableObj.addNewRow()
                }else{
                    this.$parent.currentRow = Object.assign(this.$parent.currentRow, tempdata)

                    //增加修改记录。 条件：1.反复修改只记录一次 2. 新建的数据不予记录
                    if(this.$parent.$refs[this.activeTableRef].editedRows.indexOf(this.$parent.currentRow) < 0 && this.$parent.currentRow.hasOwnProperty('id')){

                        this.$parent.$refs[this.activeTableRef].editedRows.push(this.$parent.currentRow)
                    }
                    this.$parent.currentRow = {}
                    this.$parent.currentQuoteCode = ''
                    this.cancel()
                }

            },

            cancel : function (){
                this.addRowDialogVisible = false
            },

            submitSearch(objForm) {
                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)

                 argsObj.search = Object.assign(this.args.search,obj);

                this.args = argsObj;
            },


        }
    }

</script>

<style lang="css" scoped>
    .g-main-container-column{

    }
    .selectQuoteItemdialog{}
    .my-el-dialog .el-dialog{width:1300px  !important;}
</style>

