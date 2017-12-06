/**
* Created by tomy.li on 2017/5/17.
*/
<template>
    <div class="groupDosageMapping">
        <el-dialog size="full" class="groupDosageMappingDialog t8t-full-dialog2 dialog-new" v-model="groupDosageMappingDialogVisible" @close="closeGroupDosageMappingDialog" :show-close="false" :close-on-press-escape="false">
            <div class="t8t-full-dialog2-container">

                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="cancel()">返回</el-button>
                        </div>
                        <t8t-toolbar :symbolList="['TEMP-SAVE']" class="t8t-dark"
                                     @TEMP-SAVE="tempSave()"
                                     :disabledSymbols="disabledSymbols"
                        ></t8t-toolbar><!--顶部工具栏-->
                        <div>
                            <el-button @click="addRow()">新增</el-button>
                            <el-button @click="editRow()">修改</el-button>
                            <el-button @click="submitRows()" :disabled="!isCanSubmit">提交</el-button>
                            <el-button @click="effectRows()" :disabled="!isCanEffect">启用</el-button>
                            <el-button @click="forbiddenRows()" :disabled="!isCanForbidden">禁用</el-button>
                            <el-button @click="addRow(true)">添加子组件</el-button>
                        </div>
                    </div>
                </div>

                <div class="dialog2-main-container">

                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="formData"
                            :fields="propertyCode == '03' ? formFields2 : formFields"
                            :commonData="selectSource"
                            ref="groupDosageMappingForm"
                        >
                        </t8t-form-panel>
                    </div>

                    <div class="g-main-container-column">
                        <t8t-table
                            :columns="propertyCode == '03' ? mainTableColumns2 : mainTableColumns"
                            :edit-mode="editMode"
                            :service="mainTableService"
                            :method="mainTableMethod"
                            :commonData="commonData"
                            :args="args"
                            :indexCol="false"
                            ref="t8ttable"
                            :pageBar="true"
                            :editable="true"
                            :templateData="templateData"
                            @cell-click="cellClick"
                            @selection-change="selectionChange"
                        >
                            <!--<template scope="scope" slot="id" :class="cell-text">
                                <div class="cell-text" style="float: left;">
                                    <el-button type="primary" size="mini" class="add-bom" @click="addRow(scope.row)" title="添加组件" v-if="scope.row.bomGdmId == 0 && scope.row.id && scope.row.isBom == 1"><i class="el-icon-plus el-icon&#45;&#45;left"></i>组件</el-button>
                                </div>

                                <div class="cell-text">
                                    {{scope.row.id}}
                                </div>
                            </template>-->
                        </t8t-table>
                    </div>
                </div>

            </div>

        </el-dialog>

        <!--sku搜索工长价及业主价需要用到组织， 其中组织形态为分公司， 此处通过门店id转换-->
        <selectSkuGoodDialog
            v-if="addGoodsDialogVisible"
            @close="closeSelectGoodsDialog"
            @open="addGoodsDialogVisible===true"
            :activeTableRef="activeTableRef"
            :skuId="skuId"
            :orgId="branchCompanyId"
            :bomGdmId="bomGdmId"
        >
        </selectSkuGoodDialog>
        <selectExpenseQuotaDialog
            v-if="addExpenseQuotaDialogVisible"
            @close="closeSelectGoodsDialog"
            @open="addExpenseQuotaDialogVisible===true"
            :activeTableRef="activeTableRef"
            :skuId="skuId"
            :orgId="this.headData.orgId"
            :pkg="this.headData.pkgId"
            :pkgTemp="this.headData.tempId"
            :workType="this.headData.categoryId"
        >
        </selectExpenseQuotaDialog>
    </div>
</template>
<script>
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import groupDosageMappingMethods from 'src/services/worker/groupDosageMapping/methods.js'
    import groupDosageMappingServices from 'src/services/worker/groupDosageMapping/Service.js'
    import priceConfigDialog from './groupDosageMapping.vue'
    import selectSkuGoodDialog from './selectSkuGoodDialog.vue'
    import selectExpenseQuotaDialog from './selectExpenseQuotaDialog.vue'
    import config from './config.js'
    import TemplateOperator from 'src/services/worker/categorysearch/base-method.js'
    import formula from 'src/services/formula/methods.js'
    import formulaService from 'src/services/formula/Service.js'
    import storages from 'src/services/storages/storages.js'
    export default {
        name: "groupDosageMapping",
        components: {
            selectSkuGoodDialog,
            selectExpenseQuotaDialog
        },
        data(){
            return {
                editMode:'cell',
                gdMappingId:'',
                tempCode:'',
                groupDosageMappingDialogVisible:true,
                addGoodsDialogVisible: false,
                addExpenseQuotaDialogVisible:false,
                currentRow: {},
                skuId: '',
                bomGdmId:0,
                propertyCode: '',
                activeTableRef: 't8ttable',
                disabledSymbols:[],
                isCanSubmit:true,
                isCanEffect:true,
                isCanForbidden:true,
                mainTableService: groupDosageMappingServices.default.name,
                mainTableMethod: groupDosageMappingServices.default.methods.searchGroupDosageMapping,
                mainTableColumns: [
                    {
                        "prop": "id",
                        "label": "ID",
                        "width":100
                    },
                    {
                        "prop": "bomGdmId",
                        "label": "父组件ID",
                        "width":100
                    },
                    {
                        "prop": "needSelect",
                        "label": "需要选品",
                        list:'needSelectSel',
                        "required":true,
                        "width":100,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    required: true, message: '请选择是否需要选品'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "isBom",
                        "label": "是否bom",
                        list:'isBomSel',
                        "required":true,
                        "width":100,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    required: true, message: '请选择是否为BOM'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "goodsId",
                        "label": "商品ID",
                        "width":100
                    },
                    {
                        "prop": "skuId",
                        "label": "SKU ID",
                    },
                    {
                        "prop": "productName",
                        "label": "商品名称"
                    },
                    {
                        "prop": "productModelVo",
                        "label": "商品型号"
                    },
                    {
                        "prop": "productFormatVO",
                        "label": "商品规格"
                    },
                    {
                        "prop": "productBrandNameVO",
                        "label": "品牌"
                    },
                    {
                        "prop": "dosagePercent",
                        "label": "用量比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|[1-9]{1}[0-9]{0,3}|([1-9]{1}[0-9]{0,3}|0)\.[0-9]{1,2})$/, message: '0-9999，最多保留两位小数'
                                },
                                {
                                    required: true, message: '请填写用量比例'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "dosageEquationId",
                        "label": "用量公式名称",
                        list:'dosageEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择用量公式'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "floatPercent",
                        "label": "浮动比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|((0\.[0-9]{1,4})?))$/, message: '必须为数字，不能大于等于1，最多保留四位小数'
                                },
                                {
                                    required: true, message: '请填写浮动比例'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "forbiddenStatus",
                        "label": "是否禁用",
                        "list": "gd_mapping_forbidden_status",
                        "width":80
                    },
                    {
                        "prop": "gdMappingStatus",
                        "label": "状态",
                        "list": "gd_mapping_status",
                        "width":80
                    }

                ],
                mainTableColumns2: [
                    {
                        "prop": "expenseQuotaItemId",
                        "label": "工费项IID",
                    },
                    {
                        "prop": "expenseQuotaItemName",
                        "label": "工费项名称"
                    },
                    {
                        "prop": "dosagePercent",
                        "label": "用量比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|[1-9]{1}[0-9]{0,3}|([1-9]{1}[0-9]{0,3}|0)\.[0-9]{1,2})$/, message: '0-9999，最多保留两位小数'
                                },
                                {
                                    required: true, message: '请填写用量比例'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "dosageEquationId",
                        "label": "用量公式名称",
                        list:'dosageEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择用量公式'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "floatPercent",
                        "label": "浮动比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|((0\.[0-9]{1,4})?))$/, message: '必须为数字，不能大于等于1，最多保留四位小数'
                                },
                                {
                                    required: true, message: '请填写浮动比例'
                                }
                            ]
                        },
                    },

                    {
                        "prop": "forbiddenStatus",
                        "label": "是否禁用",
                        "list": "gd_mapping_forbidden_status",
                        "width":80
                    },
                    {
                        "prop": "gdMappingStatus",
                        "label": "状态",
                        "list": "gd_mapping_status",
                        "width":80
                    }

                ],
                args:{},
                commonData:{
                    'types': [],
                    'goodsCategory':[],
                    'gd_mapping_status':config.datas.gd_mapping_status,
                    'gd_mapping_forbidden_status':config.datas.gd_mapping_forbidden_status,
                    "needSelectSel": config.datas.needSelectSel,
                    "isBomSel": config.datas.isBomSel,
                    dosageEquations:[],
                },

                templateData:{
                    dosageEquationId:null,
                    dosagePercent:null,
                    floatPercent:null,
                    gdmName:'',
                    bomGdmId:0
                },

                formData:{
                    'gd_mapping_status':config.datas.gd_mapping_status,
                },

                formFields:[
                    {
                        type : 'input',
                        prop:'id',
                        label:'组合ID',
                        disabled:true
                    },
                    {
                        type : 'select',
                        prop:'gdType',
                        list:'types',
                        label:'组合类型',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'categoryName',
                        label:'品类',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'gdMappingStatus',
                        label:'组合状态',
                        list:'tempItemStatus',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'qiName',
                        label:'报价项名称',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'spaceName',
                        label:'空间',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'placeId',
                        label:'位置',
                        list:'places',
                        disabled:true
                    },
                    /*{
                        type : 'select',
                        prop:'tempItemStatus',
                        label:'行状态',
                        disabled:true,
                        list:'tempItemStatus'
                    },*/
                    {
                        type : 'input',
                        prop:'tempName',
                        label:'产品包模板名称',
                        disabled:true
                    },

                ],
                formFields2:[
                    {
                        type : 'input',
                        prop:'id',
                        label:'组合ID',
                        disabled:true
                    },
                    {
                        type : 'select',
                        prop:'gdType',
                        list:'types',
                        label:'组合类型',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'categoryName',
                        label:'工种',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'gdMappingStatus',
                        label:'组合状态',
                        list:'tempItemStatus',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'qiName',
                        label:'报价项名称',
                        disabled:true
                    },
                    {
                        type: 'input',
                        prop: 'spaceName',
                        label:'空间',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'placeId',
                        label:'位置',
                        list:'places',
                        disabled:true
                    },
                    /*{
                        type : 'select',
                        prop:'tempItemStatus',
                        label:'行状态',
                        disabled:true,
                        list:'tempItemStatus'
                    },*/
                    {
                        type : 'input',
                        prop:'tempName',
                        label:'产品包模板名称',
                        disabled:true
                    },

                ],

                selectSource:{
                    'types': [],
                    'tempItemStatus' : config.datas.temp_item_status,
                    'goodsCategory': [],
                    'places': []
                },
                goodsCategory:[],
                headData:{},
                branchCompanyId:null,
                actionModel:'',
                accountId:+Cookie.get('t8t-tc-uid'),
                hotRow:[]

            }
        },

        created() {
            this.init()
            this.getCommonOptions('31003','types')
            this.getCommonOptions(30003,'places');
            this.getCategoryGoods()

            //请求公式
            apiCommon.queryUnionParent({
                page: 1,
                search: {
                    pPropertyCode: 11602,
                    propertyCode: this.propertyCode == '02' ? 3001 : 4000 //主材应用‘设计’模块的公式 ， 辅材及工费应用'交付'模块的公式
                },
                size: 100
            }).then((res) => {
                if (res.data.status === 200) {
                    if(res.data.result.length > 0){

                        let formulaModuleId = res.data.result[0].id

                        let formulaModuleFeild = []

                        //查找到公式字段

                        //主材
                        if(this.propertyCode == '02'){
                            formulaModuleFeild = this.mainTableColumns.filter((item) => {return item.prop=='dosageEquationId'})
                        }

                        //辅材及工费
                        else {
                            formulaModuleFeild = this.mainTableColumns2.filter((item) => {return item.prop=='dosageEquationId'})

                        }

                        //公式模块id设置到搜索组件
                        if(formulaModuleFeild.length){
                            formulaModuleFeild[0].editor.args = {search:{moduleId:formulaModuleId}}
                        }

                        formula.selectFormulaByModuleId(formulaModuleId).then((res2) => {
                            if( res2.data.status == 200 ){
                                this.commonData.dosageEquations = formula.formatFormulaForView(res2.data.result)
                            }
                        })
                    }
                }
            })
        },

        methods: {
            init: function (){
                this.gdMappingId = this.$route.query.gdMappingId
                this.tempCode = this.$route.query.tempCode
                this.propertyCode = this.$route.query.propertyCode

                this.args  = {groupDosageMapping:{'gdMappingId':this.gdMappingId}}
                let that = this
                groupDosageMappingMethods.getSkuTitle(this.gdMappingId).then((res) => {
                    if(res.data.status == 200){
                        this.headData = this.formData = Object.assign({},res.data.result)

                        this.templateData['dosageEquationId']  = this.headData.dosageEquationId
                        this.templateData['dosagePercent']  = this.headData.dosagePercent
                        this.templateData['floatPercent']  = this.headData.floatPercent

                        storages.findOrgById(this.headData.orgId).then(res2 => {
                            if( res2.data.status == 200 ){
                                let orginfo = res2.data.result

                                //门店
                                if(orginfo.typeCode == '001003010'){
                                    this.branchCompanyId = res2.data.result['parentId']
                                }


                                //其他：默认此处应该为分公司：001003006
                                else{
                                    this.branchCompanyId = this.headData.orgId
                                }

                            }
                        })
                    }
                })

            },
            closeSelectGoodsDialog: function() {
                this.addGoodsDialogVisible = false
                this.addExpenseQuotaDialogVisible = false
            },
            getCateGoryNameById: function(categoryId){
                this.getCategoryGoods()
                let cates = this.selectSource['goodsCategory']
                let name = '';
                cates.forEach((item) => {
                    if( item['value'] ==  categoryId){
                        name = item['text']
                    }
                })
                return name
            },
            cancel: function (){
                this.$router.go(-1)
            },
            isRowCanEdit: function (rowData) {
                //0-待启用 3-已驳回
                return [0,3].indexOf(rowData['gdMappingStatus']) > -1
            },
            isRowCanSubmit: function (rowData) {
                //0-待启用
                return [0].indexOf(rowData['gdMappingStatus']) > -1
            },

            isRowCanEffect: function (rowData) {
                //gdMappingStatus 2-已启用
                //forbiddenStatus 1-已禁用
                return [1].indexOf(rowData['forbiddenStatus']) > -1
            },

            isRowCanForbidden: function (rowData) {
                //gdMappingStatus 2-已启用
                //forbiddenStatus 0-未禁用
                return [2].indexOf(rowData['gdMappingStatus']) > -1 && [0].indexOf(rowData['forbiddenStatus']) > -1
            },

            //是否可编辑生效时间
            isCanEditEffectTime(rowData){
                //待启用、且未填写或已填写的时间早于当前时间，则允许修改
                return ( rowData['gdMappingStatus'] == 0 &&
                    (
                        rowData['effectTimeVO'] == "" ||
                        ( new Date(rowData['effectTimeVO']).getTime() < new Date().getTime() )
                    )
                )
            },

            cleanHotRow: function(){
                this.hotRow = []
            },

            //是否为新增行
            isNewRow: function(row){
                return this.$refs['t8ttable'].addedRows.indexOf(row) > -1
            },
            isRowEdited(row){
                return this.$refs['t8ttable'].editedRows.indexOf(row) > -1
            },

            cellClick: function (row, column, cell, event) {

                //组件行
                if( !this.isEmpty(row.bomGdmId) ){
                    if( column.property === 'isBom' || column.property === 'needSelect' ){
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }
                }

                //编辑行之前必须手动触发编辑状态
                if( !this.isNewRow(row) ){
                    if(this.hotRow.indexOf(row) > -1 && ( this.actionModel == 'edit')){
                        if( column.property === 'skuId' ){

                            //工费类
                            if( this.propertyCode == '03' ){
                                this.addExpenseQuotaDialogVisible = true
                            }else{
                                this.addGoodsDialogVisible = true
                            }
                            this.skuId = row.skuId
                            this.currentRow = row
                        }
                    }else{
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }
                }

                // if( column.property == 'effectTimeVO' && !this.isCanEditEffectTime(row) ){
                //     this.$refs['t8ttable'].handleFormItemBlur()
                // }

            },
            selectSku: function (obj){
                this.itemId = obj.row.id
                this.getRerundOrderInfoById(obj.row.refundOrderId).then((res) => {
                    if (res.data.status === 200) {
                        this.invOrgId = res.data.result.rows[0]['invOrgId']
                        this.dialogVisible = true
                        this.currentRefundOrderData = res.data.result.rows[0]
                    } else {
                        this.$msgbox(mb('获取退货单信息失败', 'error'))
                    }
                });
            },

            selectionChange: function(selRows, selIDs, selIndexes){

                //一次只能编辑一行
                /*if( selIDs.length < 1 ){
                    this.cleanHotRow()
                }*/
            },

            /*
            * 增子组件
            * isAddingBomItem 是否为添加子组件
            * */
            addRow: function (isAddingBomItem = false){

                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                // let deletedIDs = tableObj.deletedIDs

                if( editedRows.length > 0 ){
                    this.$message({
                        type: 'warning',
                        message: '请先保存修改的行！'
                    });
                    return false
                }

                /*if( addedRows.length > 0 ){
                    this.$message({
                        type: 'warning',
                        message: '请先保存新增的行！'
                    });
                    return false
                }*/

                if( isAddingBomItem ){

                    let selections = tableObj.getSelectRows()
                    if( selections.length < 1 ){
                        return this.$message({
                            type: 'warning',
                            message: '请选择需要添加组件的行'
                        })
                    }
                    if( selections.length > 1 ){
                        return this.$message({
                            type: 'warning',
                            message: '只能选择针对一行操作'
                        })
                    }

                    let selection = selections[0]

                    if( selection.isBom == 1 &&  selection.bomGdmId == 0 && selection.id ){

                    }else{
                        return this.$message({
                            type: 'warning',
                            message: '只能为已经保存的BOM行添加组件'
                        })
                    }


                    this.bomGdmId = selections[0].id
                }
                else{
                    this.bomGdmId = 0
                }


                this.skuId = ''
                this.actionModel = 'add'

                //工费类
                if( this.propertyCode == '03' ){
                    this.addExpenseQuotaDialogVisible = true
                }else{
                    this.addGoodsDialogVisible = true
                }
                // this.$refs['t8ttable'].addNewRow()
            },

            editRow: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                if( addedRows.length > 0 ){
                    this.$message({
                        type: 'warning',
                        message: '请先保存新增的行！'
                    });
                    return false
                }

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要修改的商品'
                    })
                    return false
                }
                /*if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '一次只能修改一行'
                    })
                    return false
                }*/


                /*if( editedRows.length > 0 ){
                    if( !this.isRowEdited(selection) ){
                        this.$message({
                            type: 'warning',
                            message: '已经修改了其他数据行'
                        });
                        return false
                    }
                }*/

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanEdit(item) ){
                        this.$message({
                            type: 'warning',
                            message: '仅可修改状态为“待启用”和“已驳回”的商品'
                        })
                        return false
                    }
                }

                this.hotRow = Object.assign([],selections)
                this.actionModel = 'edit'
                //this.editMode = 'selection'
            },

            submitRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要提交的商品'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanSubmit(item) ){
                        this.$message({
                            type: 'warning',
                            message: '仅可将状态为“待启用”的商品提交'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.isCanSubmit = false
                   groupDosageMappingMethods.checkGdm({
                       'ids':ids,
                       'gdMappingStatus':2,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '提交成功'
                           })
                        this.isCanSubmit = true
                        tableObj.reloadTable()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                        this.isCanSubmit = true
                    }
                   })
                }
            },

            effectRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要启用的SKU'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanEffect(item) ){
                        this.$message({
                            type: 'error',
                            message: '仅可启用状态为“已禁用”的SKU'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.isCanEffect = false
                    groupDosageMappingMethods.effectGdm({
                       'ids':ids,
                       'forbiddenStatus':0,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '启用成功'
                           })
                        this.isCanEffect = true
                        tableObj.reloadTable()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                           this.isCanEffect = true

                    }
                   })
                }
            },

            forbiddenRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要禁用的SKU'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanForbidden(item) ){
                        this.$message({
                            type: 'error',
                            message: '仅可禁用SKU状态为“已启用”且禁用状态为‘否’的SKU'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.isCanForbidden = false

                    groupDosageMappingMethods.forbiddenGdm({
                       'ids':ids,
                       'forbiddenStatus':1,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '禁用成功'
                           })
                            this.isCanForbidden = true
                           tableObj.reloadTable()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                            this.isCanForbidden = true
                       }
                   })
                }
            },

            tempSave: function (){
                let that = this
                let tableObj = this.$refs['t8ttable']
                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                tableObj.validate((isValid) => {

                    if (!isValid) {
                        return false
                    }else{
                        if(that.actionModel == 'add'){
                            if( addedRows.length > 0 ){
                                let rows = [];
                                addedRows.forEach((item) => {

                                    let skuId = ''
                                    let goodsId = ''
                                    //工费类
                                    if( this.propertyCode == '03' ){
                                        skuId = item.expenseQuotaItemId
                                        goodsId = item.expenseQuotaItemId
                                    }

                                    //主辅材
                                    else{
                                        skuId = item.skuId
                                        goodsId = item.goodsId
                                    }

                                    rows.push({
                                        gdMappingId: that.gdMappingId,
                                        skuId: skuId,
                                        goodsId: goodsId || '',
                                        gdmName:item.gdmName || '',
                                        dosagePercent: item.dosagePercent,
                                        floatPercent: item.floatPercent,
                                        dosageEquationId: item.dosageEquationId,
                                        createUser:this.accountId,
                                        dosageTypeCode:'02',//用量关系类型, 此处类型为sku。
                                        itemCode: that.tempCode,
                                        gdType:this.headData.gdType,
                                        bomGdmId: item.bomGdmId || 0,
                                        needSelect: item.needSelect || 0,
                                        isBom: item.isBom || 0
                                        // effectTimeVO:item.effectTimeVO,
                                        // gdType: item.gdType,
                                        // categoryId: item.categoryId,
                                        // categoryName:that.getCateGoryNameById(item.categoryId),
                                        // skuId: item.skuId,
                                        // dosageEquationId: item.dosageEquationId,
                                        // dosagePercent: item.dosagePercent,
                                        // floatPercent: item.floatPercent,
                                        // costUnitPrice: item.costUnitPrice,
                                        // createUser:that.accountId
                                    })
                                })

                                that.disabledSymbols.push('TEMP-SAVE')
                                groupDosageMappingMethods.createGdmBatch(rows).then((res) => {
                                    if( res.data.status == 200 ){
                                        that.$message({
                                            type: 'success',
                                            message: '暂存成功'
                                        })
                                        that.disabledSymbols.shift(that.disabledSymbols.indexOf('TEMP-SAVE'))
                                        tableObj.reloadTable()
                                        tableObj.resetActionLog()
                                    }else{

                                        that.$message({
                                            type: 'warning',
                                            message: res.data.result
                                        })
                                        that.disabledSymbols.shift(that.disabledSymbols.indexOf('TEMP-SAVE'))
                                    }
                                })

                            }else{
                                that.$message({
                                    type: 'warning',
                                    message: '没有新增的SKU'
                                })
                            }

                        }

                        else if(that.actionModel == 'edit'){
                            if( editedRows.length > 0 ){
                                let rows = [];
                                editedRows.forEach((item) => {

                                    let skuId = ''
                                    let goodsId = ''
                                    //工费类
                                    if( this.propertyCode == '03' ){
                                        skuId = item.expenseQuotaItemId
                                        goodsId = item.expenseQuotaItemId
                                    }

                                    //主辅材
                                    else{
                                        skuId = item.skuId
                                        goodsId = item.goodsId
                                    }

                                    rows.push({
                                        id: item.id,
                                        gdMappingId: that.gdMappingId,
                                        skuId: skuId,
                                        goodsId: goodsId,
                                        gdmName:item.gdmName || '',
                                        dosagePercent: item.dosagePercent,
                                        floatPercent: item.floatPercent,
                                        dosageEquationId: item.dosageEquationId,
                                        updateUser:this.accountId,
                                        dosageTypeCode:'02',//用量关系类型, 此处类型为sku。
                                        gdType:this.headData.gdType,
                                        bomGdmId: item.bomGdmId || 0,
                                        needSelect: item.needSelect || 0,
                                        isBom: item.isBom || 0
                                        // gdType: item.gdType,
                                        // categoryId: item.categoryId,
                                        // categoryName: this.getCateGoryNameById(item.categoryId),
                                        // skuId: item.skuId,
                                        // dosageEquationId: item.dosageEquationId,
                                        // dosagePercent: item.dosagePercent,
                                        // floatPercent: item.floatPercent,
                                        // costUnitPrice: item.costUnitPrice,
                                        // //new Date('2017-10-11 13:40').getTime()/1000
                                    })
                                })

                                that.disabledSymbols.push('TEMP-SAVE')
                                groupDosageMappingMethods.updateGdmBatch(rows).then((res) => {
                                    if( res.data.status == 200 ){
                                        that.disabledSymbols.shift(that.disabledSymbols.indexOf('TEMP-SAVE'))
                                        tableObj.reloadTable()
                                        tableObj.resetActionLog()
                                    }else{

                                        that.$message({
                                            type: 'warning',
                                            message: res.data.result
                                        })
                                        that.disabledSymbols.shift(that.disabledSymbols.indexOf('TEMP-SAVE'))
                                    }
                                })

                            }else{
                                that.$message({
                                    type: 'warning',
                                    message: '没有修改的SKU'
                                })
                            }
                        }else{
                            that.$message({
                                type: 'warning',
                                message: '数据没有变化'
                            })
                        }
                    }
                })
            },

            //获取辅助资料
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
                            this.selectSource[selectName] = list
                            this.commonData[selectName] = list
                        }
                    })
            },

            getCategoryGoods: function(selectName) {
                let arg =  {

                    queryGroupTreeOfOneDto:{

                        fields:["id","groupName","parentId"],
                        groupCode:"02"
                    }
                }
                let list = []
                TemplateOperator.queryCategory(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.children.forEach((item) => {

                                list.push({
                                    value: item.id,
                                    text: item.groupName
                                });

                            })

                            this.selectSource['goodsCategory']  = list
                            this.commonData['goodsCategory']  = list
                            this.goodsCategory = list
                        }
                    })
            },

            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },

            isNull(str){
                return str == null || str == '' || str == undefined
            },
        }

    }
</script>
<style lang="css" scoped>
    .g-main-container-column{
        min-height: 300px;
    }
</style>
<style>

    .t8t-full-dialog2 .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog2 .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }


</style>
