<template>
    <div class="account-management">
        <t8t-list-view ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :treeData="treeData"
            :treeProps="treeProps"
            :treeArgs="treeArgs"
            :defaultTreeExpandedKeys="defaultTreeExpandedKeys"
            :showTree="true"
            :beforeTreeSubmit="beforeTreeSubmit"
            :tableService="service"
            :tableMethod="method"
            :tableColumns="tableColumns"
            :refreshOnTreeClick="true"
            :tableRadioCol="true"
            @list-view="onView"
            @list-edit="onEdit"
            @list-add="onAdd"
            @list-edit-pswd="onEditPswd"
            @table-current-row-change="onTableCRC"
            @table-row-dobule-click="onTableRDC">
        </t8t-list-view>
        <my-dialog v-if="myDialog.isShow"
            :status="myDialog.status"
            :id="id"
            :allUserOptions="allUserOptions"
            @close="myDialog.isShow=false">
        </my-dialog>
        <!-- 修改密码 -->
        <pass-dialog v-if="isPassShow"
            :id="id"
            :username="username"
            @close="isPassShow=false">
        </pass-dialog>
    </div>
</template>

<script>
    import Service from './Service.js'
    import api from './api.js'
    import MyDialog from './my-dialog.vue'
    import PassDialog from './pass-dialog.vue'
    export default {
        name: 'account-management',
        components: {
            MyDialog,
            PassDialog
        },
        data() {
            return {
                isPassShow: false,
                breadcrumbData: [
                    { title: '系统管理' },
                    { title: '主数据' },
                    { title: '权限管理' }
                ],
                searchFields: [
                    { type: 'input', label: '账号ID', name: 'ID' },
                    { type: 'input', label: '用户账号', name: 'username_preLike' },
                    { type: 'input', label: '电话号码', name: 'mobile' }
                ],
                service: Service.USER.name,
                method: Service.USER.methods.list,
                tableColumns: [
                    { 'prop': 'id', 'label': 'ID' },
                    { 'prop': 'username', 'label': '用户账号' },
                    { 'prop': 'mobile', 'label': '电话号码' },
                    { 'prop': 'createTime', 'label': '创建时间', formatter: 'dateParser' }
                ],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                treeArgs: null,
                defaultTreeExpandedKeys: [0],
                myDialog: {
                    isShow: false,
                    status: 'add'
                },
                id: null,
            }
        },
        methods: {
            // table当前行改变
            onTableCRC(curRow, oldRow) {
                this.id = curRow.id
                this.username = curRow.username
            },
            // table 双击
            onTableRDC(row) {
                this.id = row.id
                this.myDialog = {
                    isShow: true,
                    status: 'view'
                }
            },
            onAdd() {
                this.myDialog = {
                    isShow: true,
                    status: 'add'
                }
            },
            onEdit() {
                if (this._isSingleRow() === false) {
                    return this.$message("请选择一行数据！")
                }
                this.myDialog = {
                    isShow: true,
                    status: 'edit'
                }
            },
            onView() {
                if (this._isSingleRow() === false) {
                    return this.$message("请选择一行数据！")
                }
                this.myDialog = {
                    isShow: true,
                    status: 'view'
                }
            },
            onEditPswd() {
                if (this._isSingleRow() === false) {
                    return this.$message("请选择一行数据！")
                }
                this.isPassShow = true
            },
            _isSingleRow() {
                if (!this.id) {
                    return false
                }
                return true
            },
            getTreeData() {
                api.allSystemCodeList({ 'fatherCode': '001001' })
                    .then(res => {
                        if (res.data.status === 200) {
                            let _treeData = [{ name: '用户分类', id: 0, children: [] }]
                            res.data.result.rows.forEach(item=>{
                                item.name = `(${item.code})${item.name}`
                            })
                            _treeData[0].children = res.data.result.rows
                            this.treeData = _treeData

                            this.allUserOptions = this._initUser(res.data.result.rows)
                        }
                    })
            },
            _initUser(rows) {
                let res = []
                rows.forEach(item => {
                    res.push({
                        text: item.name,
                        value: item.code
                    })
                })
                return res
            },
            beforeTreeSubmit(data) {
                this.treeArgs = {
                    typeCode: data.code
                }
                return true
            }
        },
        created() {
            this.getTreeData()
        }
    }
</script>

<style scoped>

</style>
