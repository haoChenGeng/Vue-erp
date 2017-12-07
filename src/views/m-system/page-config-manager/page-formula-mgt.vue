<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :defaultTreeExpandedKeys="defaultTreeExpandedKeys"
            :showSearchToggleBtn="false"
            :treeData="treeData"
            :showTree="true"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="commonData"
            @table-selection-change="selectionChange"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="onRowDBC"
            @list-view="onView"
            @list-add="onAdd"
            @list-import="importBtn"
            @list-export="onExport"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :treeArgs="treeArgs"
            @tree-node-click="onTreeClick"
            :toolbarDisabledSymbols="disabledSymbols"
        >
        </t8t-list-view>

        <el-dialog class="import-dialog" title="请选择导入方式" v-model="importDialog" @close="closeimportDialog"
                   ref="importDialogRef"
        >
            <div class="textarea-container">
                <el-upload
                    ref="importSource"
                    class="upload-demo"
                    :data="uploadArgs"
                    :action="importURL"
                    :file-list="fileList"
                    :on-success="importDeal"
                    :on-progress="importing"
                    :on-remove="removing"
                    accept=".xlsx,.xls"
                    :auto-upload="false"
                    :multiple="false"
                >
                    <el-button size="small" type="primary">上传文件</el-button>
                    <div slot="tip" class="el-uplad__tip">请选择Excel文件,.xls、.xlsx格式</div>
                </el-upload>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="inputConfirm" :disabled="uploadFlag">确认导入</el-button>
                <el-button @click="closeimportDialog">取消</el-button>
            </div>
            <t8t-table
                v-if="importTable"
                :dataSource="importTableData"
                :columns="columns.importColumns"
                ref="checkTable"
                :pageBar=false
                :selectCol="false"
            >
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/system/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    import exportUtils from 'src/utils/export.js'

    export default {
        name: 'formula-manager',
        data() {
            return {
                mainType: '11602',
                constantType: '003001',
                variableType: '001003',
                formulaType: '003003',
                breadcrumbData: [{title: '系统管理'}, {title: '配置管理'}, {title: '公式管理'}],
                searchFields: [
                    {type: 'select', label: '公式类型', name: 'typeCode', selectSourceKey: 'typeIdList', filterable: true},
                    {
                        type: 'select',
                        label: '业务模块',
                        name: 'moduleId',
                        selectSourceKey: 'moduleIdList',
                        filterable: true
                    },
                    {
                        type: 'select',
                        label: '公式名称',
                        name: 'id',
                        selectSourceKey: 'formulaNameList',
                        filterable: true
                    }
                ],
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {prop: 'moduleId', label: '业务模块', list: 'moduleIdList'},
                    {prop: 'typeCode', label: '公式类型', list: 'typeIdList'},
                    {prop: 'formulaName', label: '公式名称'},
                    {prop: 'expression', label: '表达式'},
                    {prop: 'description', label: '描述'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}
                ],
                tableService: Service.EXPRESSION.name,
                tableMethod: Service.EXPRESSION.methods.formulaQueryPage,
                tableArgs: {},
                commonData: {
                    typeIdList: [],
                    moduleIdList: [],
                    formulaNameList: [],
                    constantTypeList: [],
                },
                defaultTreeExpandedKeys: [0],
                treeParamData: {},
                treeArgs: {},
                treeData: [],
                disabledSymbols: ['VIEW', 'EXPORT'],
                rowId: null,
                uploadArgs: {otherArgs: {}, columns: 'moduleCode,moduleName,typeCode,typeName,formulaName,description,expression,variableStr'},//表格上传需要的参数
                importURL: Utils.getImportURL(Service.EXPRESSION.name, Service.EXPRESSION.methods.importBatch),
                fileList: [],
                importDialog: false,
                uploadFlag: false,
                accountId: +Cookie.get('t8t-tc-uid'),
                selectRows: []
            }
        },

        methods: {
            onSearchSubmit(obj) {
                this.tableArgs = {search: obj}
                this.getformulaData()
            },
            beforeSubmit() {
            },
            getTree(fatherCode) {
                let list = []
                axios({
                    method: Service.CONFIGURE.methods.SYS_CODE_QUERYALL,
                    service: Service.CONFIGURE.name,
                    args: {'fatherCode': fatherCode}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.isDel === 0) {
                                list.push({
                                    id: item.id,
                                    value: item.id,
                                    code: item.code,
                                    label: item.name,
                                    name: item.name,
                                    text: item.name,
                                    fatherCode: fatherCode,
                                    children: []
                                })
                            }
                        })
                        if (fatherCode == this.formulaType) {
                            // id换code
                            list.forEach(item=>{
                                item.value = item.code
                            })
                            this.commonData.typeIdList = list
                        } else if (fatherCode == this.constantType) {
                            this.commonData.constantTypeList = list
                        }
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                }).catch((res) => {
                })
            },

            initTreeParamData() {
                axios({
                    method: Service.EXPRESSION.methods.formulaGetExpressionTree,
                    service: Service.EXPRESSION.name,
                    args: {}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.treeParamData = [
                            {
                                id: 1,
                                parentId: 0,
                                label: '常量',
                                children: res.data.result[0].children
                            },
                            {
                                id: 2,
                                parentId: 0,
                                label: '变量',
                                children: res.data.result[1].children
                            },
                            {
                                id: 3,
                                parentId: 0,
                                label: '符号',
                                children: res.data.result[2].children
                            }
                        ]
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                }).catch((res) => {
                })
            },
            getSupply() {
                let list = []
                axios({
                    method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
                    service: Service.SUPPLY_CONFIGURE.name,
                    args: {page: 1, size: 100, search: {'pPropertyCode': this.mainType}}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                parentId: 1,
                                id: item.id,
                                value: item.id,
                                text: item.propertyName,
                                label: item.propertyName
                            })
                        })
                        this.treeData = [
                            {
                                id: 0,
                                label: '业务模块',
                                children: list
                            }
                        ]
                        this.commonData.moduleIdList = list
                    }
                })
            },

            getformulaData() {
                let list = []
                axios({
                    method: Service.EXPRESSION.methods.formulaQuery,
                    service: Service.EXPRESSION.name,
                    args: {}
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                id: item.id,
                                value: item.id,
                                label: item.formulaName,
                                text: item.formulaName
                            })
                        })
                        this.commonData.formulaNameList = list
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                }).catch((res) => {
                })
            },

            initTree() {

                this.getSupply()
                this.getTree(this.constantType)
                this.getTree(this.formulaType)
                this.getformulaData()
                this.initTreeParamData()
            },


            onTreeClick(nodeData) {
                this.tableArgs = {search: {moduleId: nodeData.id}}
            },
            //行变化事件，获取已选择的行应选择此方法
            selectionChange(rows, ids) {
                this.selectRows = rows
                //已选择ID集合
                //this.selIDs = ids;
                //console.log(rows,ids);
                if (ids.length == 1) {
                    this.disabledSymbols = []
                } else if (ids.length > 1) {
                    this.disabledSymbols = ['VIEW']
                } else if (ids.length == 0) {
                    this.disabledSymbols = ['VIEW', 'EXPORT']
                }
            },
            tableRowClick(row) {
                this.rowId = row.id
            },
            importBtn() {
                if (this.$refs['importSource']) {
                    this.$refs['importSource'].clearFiles()
                }
                this.importRadio = 'add'
                this.importDialog = true
            },

            importing(event, file, fileList) {
                let list = []
                list.push(file)
                this.fileList = list
            },

            importDeal(response, file, fileList) {
                this.uploadFlag = false
                if (!response.status || response.status != 200) {
                    let msg = ''
                    for(let key in response.result) {
                        msg += `<div class="formula-title">${key}:</div>`
                        let valArr = response.result[key]
                        valArr.forEach(item=>{
                            msg += `<div class="formula-item">${item}</div>`
                        })
                    }
                    this.$alert(msg, '导入错误', {
                        confirmButtonText: '确定',
                        type: 'error'
                    }).then(() => {

                    })
                    this.$refs['importSource'].clearFiles()
                    return false
                }
                else {
                    this.$message.success('导入成功！')
                    this.importDialog = false
                    this.onSearchSubmit(this.tableArgs.search)
                }
            },

            removing() {
                this.$refs['importSource'].clearFiles()
            },
            closeimportDialog() {
                this.importDialog = false
            },
            inputConfirm() {
                this.uploadFlag = true//确认导入按钮禁用
                let error = ''
                // this.uploadArgs.otherArgs = JSON.stringify({createUser: this.accountId})
                this.importURL = Utils.getImportURL(Service.EXPRESSION.name, Service.EXPRESSION.methods.importBatch)

                if (this.$refs['importSource'].uploadFiles.length > 0) {
                    if (this.$refs['importSource'].uploadFiles.length > 1) {
                        this.$message.error('只支持单文件上传,请重新选择文件')
                        this.$refs['importSource'].clearFiles()
                        this.uploadFlag = false
                    }
                    else {
                        this.$refs['importSource'].submit()
                    }
                }
                else {
                    this.$message.error('未选择文件')
                    this.uploadFlag = false
                }
            },


            onRowDBC(row) {
                this.showDialog(row.id, 'view')
            },
            // 显示公式全屏弹窗  type: VIEW, ADD
            showDialog(id, type) {
                this.$router.push({
                    query: {id: id, mode: type},
                    path: '/tuchat-system/formula-management-dialog'
                })
            },
            onView() {
                if (!this.isOneRow()) {
                    return this.$message.error('选择一行数据')
                }
                let row = this.selectRows[0]
                this.showDialog(row.id, 'view')
            },
            onAdd() {
                this.showDialog(null, 'add')
            },

            isOneRow() {
                if (this.selectRows.length === 1) {
                    return true
                }
                return false
            },

            onExport() {
                let _arr = []
                this.selectRows.forEach(item=>{
                    _arr.push(item.id)
                })
                exportUtils({
                    service: 'M-PsgXApBPWuO7s59dK5kIAajRKg1Xz',
                    method: 'ahSiWx4aEg4rYS_s_US1iZz0-oVWT9tSSKgVqA8',// views.formula.exportBatch
                    args: {
                        page: 1,
                        size: 1000,
                        formulaIds: _arr
                    },
                    headers: '业务模块编号,业务模块名称,公式类型编码,公式类型名称,公式名称,公式描述,公式表达式,变量',
                    sorts: 'moduleCode,moduleName,typeCode,typeName,formulaName,description,expression,variableStr'
                })
            }
        },
        created() {
            this.initTree()
        }
    }
</script>

<style scoped>
    .import-dialog .upload-demo {
        width: 240px;
        margin: 20px auto 5px;
    }
</style>

<style>
    .formula-title{
        font-size: 14px;
        font-weight: bold;
    }
    .formula-item{
        color: red;
    }
</style>
