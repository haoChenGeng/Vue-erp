<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn=true
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="onTreeClick"
            >
            </t8t-tree>

            <div class="g-main-container-column">
                <t8t-toolbar
                    @VIEW-BOUND="onBtn1"
                    @ADD="onBtn2"
                    @UNBIND="onBtn3"
                >
                </t8t-toolbar>

                <t8t-table
                    :columns="columns.indexPage"
                    :dataSource="dataSource"
                    :service="service"
                    :method="method"
                    :commonData="selectSource"
                    :args="args"
                    ref="t8ttable"
                >
                </t8t-table>
            </div>

        </div>
    </div>
</template>

<script>
    import Services from 'src/services/permission/Service.js'
    import columns from './positionColumns.json'
    import axios from 'src/utils/axios.js'

    export default {
        name: 'role-bound-position',
        components: {

        },
        data () {
            return {
                breadcrumbData: [{title: '系统管理'}, {title: '角色管理'}, {title: '岗位绑定'}],
                columns: columns,
                // 搜索表单项配置
                fields: [
                    {type: 'input', label: '岗位名称', name: 'name_like'},
                    {type: 'input', label: '岗位编号', name: 'id'},
                    {type: 'select', label: '岗位类别', name: 'category', selectSourceKey: 'categoryOptions'},
                    {type: 'select', label: '是否启用', name: 'startUsing', selectSourceKey: 'startUseOptions'}
                ],
                // 搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    categoryOptions: [{
                        text: '平台岗',
                        value: 1
                    }, {
                        text: '提成岗',
                        value: 2
                    }],
                    startUseOptions: [{
                        text: '启用',
                        value: 1
                    }, {
                        text: '不启用',
                        value: 2
                    }]
                },
                searchCache: {'name_like': null, 'id': null, 'category': null, 'startUsing': null},
                service: Services.PERM.name,
                method: Services.PERM.methods.QUERY_POSITION,
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                // 树形结构数据
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel',
                    symbol: 'name'
                },
                defaultExpandedKeys: ['role_type'],
                selectTreeNode: null,
                dataSource: []
            }
        },
        created () {
            let roleTree = [{
                name: '管理员',
                type: 1,
                children: [],
                id: 'admin'
            }, {
                name: '普通角色',
                type: 0,
                children: [],
                id: 'common_user'
            }]

            axios({
                service: Services.PERM.name,
                method: Services.PERM.methods.ROLE_LIST,
                args: {
                    condition: {
                        isDel: 0,
                        type_code: '001001001'// employee type
                    }
                }
            })
            .then((res) => {
                if (res.data.status === 200) {
                    let rawData = res.data.result.rows

                    rawData.forEach(function (item) {
                        let treeElement = null

                        roleTree.forEach(function (v) {
                            if (v.type === item.type) {
                                treeElement = v
                            }
                        })

                        if (treeElement !== null) {
                            treeElement.children.push(item)
                        }
                    })

                    this.treeData = [{
                        name: '角色类型',
                        children: roleTree,
                        id: 'role_type'
                    }]

                }
            })
        },
        methods: {
            submitSearch (obj) {
                this.searchCache = obj
                this.args = { search: obj }
            },
            onBtn1 () {
                if (!this.selectTreeNode) {
                    this.$message.error('请选择要查看的角色！')
                    return
                }

                axios({
                    service: Services.PERM.name,
                    method: Services.PERM.methods.QUERY_BOUND_POSITION,
                    args: {
                        roleCode: this.selectTreeNode.code
                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                        const rs = res.data.result || []
                        this.dataSource = []
                        rs.forEach(e => {
                            const _e = {...e, roleName: this.selectTreeNode.name}
                            this.dataSource.push(_e)
                        })
                    }
                })


            },
            onBtn2 () {
                let that = this
                let selections = this.$refs['t8ttable'].getSelectRows()

                if (!this.selectTreeNode) {
                    this.$message.error('请选择要绑定的角色！')
                    return
                }

                if (selections === null || selections.length === 0) {
                    this.$message.error('请选择要绑定的岗位！')
                    return
                }

                axios({
                    service: Services.PERM.name,
                    method: Services.PERM.methods.BOUND_POSITION,
                    args: {
                        roleCode: this.selectTreeNode.code,
                        positionIds: selections.map(function (v) {
                            return v.id
                        })
                    }
                }).then((res) => {
                    let code = res.data.status
                    if (code === 200) {
                        that.$message.success('绑定成功')
                    } else if (code === 80106) {
                        that.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '以下岗位已被绑定，编号：[' + res.data.result + ']',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    } else {
                        that.$message.error('绑定失败！')
                    }
                }).catch((err) => {
                    that.$message.error(err)
                })
            },
            onBtn3 () {
                let that = this
                let selections = this.$refs['t8ttable'].getSelectRows()

                if (!this.selectTreeNode) {
                    this.$message.error('请选择要解绑的角色！')
                    return
                }

                if(selections === null || selections.length === 0) {
                    this.$message.error('请选择要解绑的岗位！')
                    return
                }

                let selectionIds = selections.map(function (v) {
                    return v.id
                })
                axios({
                    service: Services.PERM.name,
                    method: Services.PERM.methods.UNBIND_POSITION,
                    args: {
                        roleCode: this.selectTreeNode.code,
                        positionIds: selectionIds
                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                        that.$message.success('解绑成功')
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch((err) => {
                    that.$message.error(err)
                })
                // remove deleted row
                this.dataSource = this.dataSource.filter( v => selectionIds.indexOf(v.id) === -1 )
            },
            onTreeClick (data, node, component) {
//                console.log(data, node, component);
//                node.checked = node.isLeaf && !node.checked
                node.expanded = !node.expanded
                if (node.isLeaf) {
                    this.selectTreeNode = data
//                    this.onBtn1()
                } else {
                    this.selectTreeNode = null
//                    this.dataSource = null
                }

            }
        }
    }
</script>
<style scoped>
    .t8t-tree-container {
        width: 250px;
    }
</style>
