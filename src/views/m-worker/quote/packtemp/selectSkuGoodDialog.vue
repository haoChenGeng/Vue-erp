/**
* Created by tomy.li on 2017/5/11.
*/
<template>
    <div>
        <el-dialog title="选择SKU" class="g-w-1000 my-el-dialog selectQuoteItemdialog" v-model="addGoodsDialogVisible" @close="closeSelectQuoteDialog">
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                :showToggleBtn="true"
                @submit="submitSearch"
            >
            </t8t-search>

            <el-row :gutter="20" class="worker-sku-goods-contain">
                <el-col :span="5">
                    <el-tree
                    ref="treeselect"
                    :data="treedata"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :default-expand-all="true"
                    :props="defaultProps"
                    accordion
                    @node-click="handleNodeClick"
                    class="worker-sku-goods-tree">
                    </el-tree>
                </el-col>
                <el-col :span="19">
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
                        @row-click="onRowClick"
                        @selection-change="selectionChange"
                        :selectable="selectable"
                    >
                    </t8t-table>
                    <!--<div>
                        <el-row type="flex" justify="left">
                            <el-col :span="24">
                                <div class="box-card">
                                    <br/>

                                </div>

                                <el-alert
                                    title=" 没有工长价或业主价的商品不可选择"
                                    type="warning"
                                    :closable="false"
                                    show-icon>
                                </el-alert>
                            </el-col>
                        </el-row>
                    </div>-->

                </el-col>
            </el-row>

            <div slot="footer">

                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="addGoodsDialogVisible = false">取消</el-button>
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
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import quoteitem from 'src/services/worker/quoteitem/quoteitem.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import TemplateOperator from 'src/services/worker/categorysearch/base-method.js'
    import quoteitemServices from 'src/services/worker/quoteitem/Service.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import config from './config.js'
    export default{
        // props:['activeTableRef'],
        name: 'selectQuoteItem',
        components: {
            // T8tSearch
        },
        props: {
            // getAddGoodsDialogVisible: {
            //     type: Boolean,
            //     default: true
            // }
            skuId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            },
            activeTableRef: {
                type: String,
                default: ''
            },
            bomGdmId: {
                type: String,
                default: ''
            },
        },
        // watch: {
        //     getAddGoodsDialogVisible: function(val, old) {
        //         this.addGoodsDialogVisible = val
        //     }
        // },
        data(){
            return {
                addGoodsDialogVisible: true,
                activeTableRef:'',
                goodsGroups: [],
                userId:+Cookie.get('t8t-tc-uid'),
                mainTableColumns:[
                    {
                        "prop": "id",
                        "label": "商品ID"
                    },
                    {
                        "prop": "skuId",
                        "label": "SKU ID"
                    },
                    {
                        "prop": "goodsName",
                        "label": "商品名称"
                    },
                    {
                        "prop": "model",
                        "label": "商品型号"
                    },
                    {
                        "prop": "standard",
                        "label": "商品规格"
                    },
                    {
                        "prop": "brandName",
                        "label": "品牌"
                    },
                   /* {
                        "prop": "shopName",
                        "label": "商家名称"
                    }*/
                ],
                mainTableService: '',
                mainTableMethod: '',
//                mainTableService:packtempServices.supply.name,
//                mainTableMethod:packtempServices.supply.methods.queryGoodsForSetSku,
                args:{search:null},
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
                        name: 'goodsId',
                        placeholder: '商品ID',
                        type: 'input',
                    },
                    {
                        name: 'skuId',
                        placeholder: 'SKU ID',
                        type: 'input',
                    },
                    {
                        name: 'goodsName',
                        placeholder: '商品名称',
                        type: 'input',
                    },
                    {
                        name: 'model',
                        placeholder: '商品型号',
                        type: 'input',
                    },
                ],
                treedata:[],
                defaultProps: {
                  children: 'children',
                  label: 'label'
                }
            }
        },
        created() {
            this.getTreeData()

        },
        methods: {

            //选中行
            selectRow(row, event){
                if( !this.isCanSkuSelection(row) ){
                    this.$refs['t8ttable'].toggleRowSelection(row, false)
                    this.$message.error('没有工长价或业主价')
                    return false
                }else{

                    this.addRow(row)
                    this.cancel()
                }
            },

            closeSelectQuoteDialog() {
                this.$emit('close')
            },

            onRowClick(row){
                if( !this.isCanSkuSelection(row) ){
                    this.$refs['t8ttable'].toggleRowSelection(row, false)
                    this.$message.error('没有工长价或业主价')
                }
            },
            selectionChange(selection){
                let tab = this.$refs['t8ttable']
                selection.forEach((row, index) => {
                    if( !this.isCanSkuSelection(row) ){
                        tab.toggleRowSelection(row, false)
                    }
                })
            },

            submit(){
                let tableObj = this.$refs['t8ttable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '未选择商品'
                    })
                    return false
                }
                selections.forEach((item) => {
                    this.addRow(item)
                })
                this.cancel()

            },

            addRow(row){
                debugger
                let tempdata =  {
                    skuId: row.skuId,
                    goodsId: row.id,
                    productName: row.goodsName,
                    productModelVo: row.model,
                    productFormatVO: row.standard,
                    productBrandNameVO: row.brandName,
                    shopNameVO: row.shopName,
                    bomGdmId:this.bomGdmId
                }

                //非成品标记为非bom，且不需要选品(指补货选品 不是报价选品)
                if( this.bomGdmId ){
                    tempdata.isBom = 0
                    tempdata.needSelect = 0
                }
                let tableObj = this.$parent.$refs[this.activeTableRef]
                Object.assign(tableObj.templateData,tempdata);
                if (!this.skuId) {
                    tableObj.addNewRow()
                } else {
                    this.$parent.currentRow = Object.assign(this.$parent.currentRow, tempdata)
                    this.$parent.$refs[this.activeTableRef].editedRows.push(this.$parent.currentRow)
                    // tempdata.forEach((item) => {
                    //     debugger
                    //     this.$parent.currentRow[item] = tempdata[item]
                    // })
                }
            },

            cancel : function (){
                this.addGoodsDialogVisible = false
                this.$parent.closeSelectGoodsDialog()
            },

            submitSearch(objForm) {
                objForm.gGoodsGroups = this.goodsGroups ? this.goodsGroups : []
                let obj = Object.assign({},objForm);
                if(obj.goodsId){

                    obj.goodsIds = [+obj.goodsId]
                }
                let argsObj = Object.assign({},this.args)
                argsObj.queryEffectGoodsByCityAndSalePriceDTO.searchGoods = obj;

                this.args = argsObj;
            },

            getTreeData() {
                let categoryId = this.$parent.formData.categoryId
                this.treedata = [{
                    label: '全部',
                    value: '',
                    children: []
                }]

                //通过分类id查询分类CODE
                TemplateOperator.queryList({
                    "search":{
                        "id_in":[categoryId]
                    },
                    "fields":["id" ,"depth","description","groupCode","groupName"]
                }).then(res1 => {

                    if(res1.data.status == 200){
                        let groupCode = res1.data.result[0].groupCode

                        let arg =  {
                            queryGroupTreeOfOneDto:{
                                fields:["id","groupName","parentId","groupCode","groupStatus"],
                                groupCode: groupCode
                            }
                        }

                        //通过顶级获取分类code获取分类树
                        TemplateOperator.queryCategory(arg).then((res) => {

                            //找到对应分组
                            let cateData = []
                            this.goodsGroups = [].concat([],categoryId)
                            if (res.data.result.children && res.data.result.children.length>0) {
                                cateData = res.data.result.children
                            }

                            if (res.data.status === 200) {
                                if( res.data.result ){
                                    this.buildTreeData(this.treedata[0].children, cateData)
                                    this.getAllCates(this.goodsGroups,this.treedata[0].children)

                                    if(this.goodsGroups.length){

                                        this.mainTableService = packtempServices.supply.name
                                        this.mainTableMethod = packtempServices.supply.methods.queryEffectGoodsByCityAndSalePrice
                                    }


                                    this.args = {
                                        'queryEffectGoodsByCityAndSalePriceDTO':{
                                            "orgId":this.orgId,
                                            "searchGoods":{
                                                gGoodsGroups:this.goodsGroups
                                            },
                                        }
                                    }
                                }
                            }
                        })
                    }else{

                    }
                })

            },

            buildTreeData(currentnode, childrendata) {
                if (childrendata && childrendata.length > 0) {
                    childrendata.forEach((item) => {
                        let newCode = {
                            label: item.groupName,
                            value: item.id,
                            children: []
                        }
                        currentnode.push(newCode)

                        this.buildTreeData(newCode.children, item.children)
                    })
                }
            },

            getAllCates(currentnode, childrendata){
                if (childrendata && childrendata.length > 0) {
                    childrendata.forEach((item) => {
                        this.goodsGroups = [].concat(this.goodsGroups,item.value)

                        this.getAllCates(this.goodsGroups, item.children)
                    })
                }
            },

            handleNodeClick(data) {
                let formData = this.$refs["search"].getFormData()

                this.goodsGroups = [].concat([],this.$parent.formData.categoryId)
                if( data.value ){
                    this.goodsGroups = [data.value]
                }else{

                }

                this.getAllCates(this.goodsGroups, data.children)

                this.submitSearch(formData)
            },
            selectable(row, index){
                return this.isCanSkuSelection(row)
            },
            isCanSkuSelection(row){
                return true
                //return  row.salesPriceFlag == 3
            }

        }
    }

</script>

<style lang="css" scoped>
    .g-main-container-column{

    }
    .selectQuoteItemdialog{}
    .my-el-dialog .el-dialog{width:1300px  !important;}
    .worker-sku-goods-contain{margin-left: 10px!important;}
    .worker-sku-goods-tree{max-height: 340px; overflow: auto;font-size:12px !important;}
</style>

