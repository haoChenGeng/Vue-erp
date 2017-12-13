<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :showSearchToggleBtn="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :treeArgs="treeArgs"
            :defaultTreeExpandedKeys = "defaultTreeExpandedKeys"
            :showTree="true"
            :beforeTreeSubmit="beforeTreeSubmit"
            :tableService="service"
            :tableMethod="method"
            :tableColumns="tableColumns"
            :tableCommonData="commonData"
            :refreshOnTreeClick="true"
            :tableRadioCol="true"
            @list-view="onView"
            @list-edit="onEdit"
            @list-add="onAdd"
            @table-current-row-change="onTableCRC"
            @table-row-dobule-click="onTableRDC"
            @table-data-loaded = "tableDataLoaded"
        >
        </t8t-list-view>
        <my-dialog
            v-if="isShow"
            :status="dialogStatus"
            :rowData="formData"
            :commonData="commonData"
            @close="isShow=false"
            @success="onSuccess"
        ></my-dialog>
    </div>
</template>

<script>
    import api from 'src/services/system/organization.js'
    import Service from 'src/services/system/Service.js'
    import MyDialog from './org-dialog.vue'
    export default {
        components: {
            MyDialog
        },
        data () {
            return {
                service: Service.ORG.name,
                method: Service.ORG.methods.ORG_QUERY_V2,
                tableColumns: [
                    { "prop": "id", "label": "组织ID" },
                    { "prop": "name", "label": "组织名称"},
                    { "prop": "typeCode", "label": "组织形态", "list": "typeCodeOptions" },
                    { "prop": "location", "label": "地址" },
                    { "prop": "isDel", "label": "禁用状态", "list": "isDelOptions" },
                    { "prop": "description", "label": "描述" }
                ],
                commonData: {
                    typeCodeOptions: [],
                    functionCodeOptions: [],
                    isDelOptions: [
                        { text: '是', value: 1 },
                        { text: '否', value: 0 }
                    ],
                    partners: []
                },
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                treeArgs: null,
                defaultTreeExpandedKeys : [0],
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '主数据'},
                    {title: '组织机构'}
                ],
                searchFields: [
                    {type: 'input',label: '组织名称',name: 'name_like'},
                    {type: 'select',label: '组织形态',name: 'typeCode', selectSourceKey:'typeCodeOptions'},
                    {type: 'select',label: '组织职能',name: 'functionCode', selectSourceKey:'functionCodeOptions', isHide: true},
                    {type: 'select',label: '禁用状态',name: 'isDel', selectSourceKey:'isDelOptions', isHide: true}
                ],
                isShow: false,
                curRow: null,
                formData: null,
                dialogStatus: ''
            }
        },
        methods: {
            initTree() {
                api.queryTreeV2({isAll:1})
                    .then((res) => {
//                        let rs = res.data.result
//                        this.treeData = [{
//                            id: 0,
//                            name: '组织机构',
//                            children: rs
//                        }]
                        this.treeData = res.data.result
                    })
            },
            initCommonData() {
                api.queryBatchSystemCode({"list": ["001001", "001003", "001004"]})
                    .then((res) => {
                        if (res.data.status === 200) {
                            let resultData = res.data.result

                            this.commonData.partners = resultData['001001'].map((item) => {
                                if (item.isDel === 0) {
                                    return {
                                        value: item.code,
                                        text: item.name
                                    }
                                }
                            })

                            this.commonData.typeCodeOptions = resultData['001003'].map((item) => {
                                if (item.isDel === 0) {
                                    return {
                                        value: item.code,
                                        text: item.name
                                    }
                                }
                            })

                            this.commonData.functionCodeOptions = resultData['001004'].map((item) => {
                                if (item.isDel === 0) {
                                    return {
                                        value: item.code,
                                        text: item.name
                                    }
                                }
                            })
                        }
                    })
            },
            beforeTreeSubmit(data){
                this.treeArgs = {
                    selfPid: data.id
                }
                return true

            },
            // 点击左侧树某节点，右边表单选择节点
            tableDataLoaded() {
              if(this.treeArgs !== null){
                  let table = this.$refs['list-view'].getTableInstance()
                  if (table.dataSource.length > 0) {
                      this.$nextTick(_ => table.store.commit('setCurrentRow', table.dataSource[0]))
                  }

                  this.treeArgs = null
              }
            },
            // table当前行改变
            onTableCRC(curRow,oldRow) {
                this.curRow = curRow
            },
            // table 双击
            onTableRDC(row) {
                this.curRow = row
                this.formData = this.curRow
                this.showDialog('view')
            },
            onView(symbol, event) {
                if(!this.curRow){
                    return this.$message("请选择一行数据！")
                }
                this.formData = this.curRow
                this.showDialog('view')
            },
            onAdd(symbol, event) {
                if (!this.curRow) {
                    this.formData = {} // 未选中情况
                } else {
                    this.formData = {
                        rootId: this.curRow.rootId,
                        parentId: this.curRow.id,
                        parentName: this.curRow.name
                    }
                }

                this.showDialog('add')
            },
            onEdit(symbol, event) {
                if(!this.curRow){
                    return this.$message("请选择一行数据！")
                }
                this.formData = this.curRow
                this.showDialog('edit')
            },
            showDialog(status) {
                //ERP不能创建土巴兔组织，请在OA操作
                if(status === 'add' && this.formData.rootId === 1) {
                    this.$message.error("ERP不能创建土巴兔组织，请在OA操作")
                    return
                }

                this.dialogStatus = status
                this.isShow = true
            },
            onSuccess(data) {
                this.$refs['list-view'].getTableInstance().reloadTable()// TODO 刷新树组件
                this.initTree()
            }
        },
        created(){
            this.initTree()
            this.initCommonData()
        }
    }
</script>

<style lang="css" scoped>

</style>
