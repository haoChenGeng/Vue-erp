<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="defaultExpandedKeys"
                :nodeKey="id"
                :disabled="disabled"
                @node-click="onTreeClick"
                @node-expand="onNodeExpand"
                @node-collapse="onNodeCollapse"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @SAVE="submit"
                    @INIT="update"
                >
                </t8t-toolbar>

                <div class="my-table-container">
                    <el-row class="my-table-head">
                        <el-col :span="8"><div class="th">编码</div></el-col>
                        <el-col :span="8"><div class="th">名称</div></el-col>
                        <el-col :span="8"><div class="th">排序</div></el-col>
                    </el-row>

                    <draggable :list="value" class="my-table-body" @change="update" @start="drag=true" @end="drag=false">
                        <el-row v-for="e, index in value" :key="e.id" class="tr">
                            <el-col :span="8"><div class="td">{{e.code}}</div></el-col>
                            <el-col :span="8">
                                <el-tooltip class="item" effect="light" content="上下拖动排序" placement="right-start">
                                    <div class="td" style="cursor: pointer;">{{e.name}}</div>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="8"><div class="td">{{e.sortId}}</div></el-col>
                        </el-row>
                    </draggable>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import permApi from 'src/services/permission/Perm.js'

    export default {
        name: 'menu-tree-drag',
        components: {
            draggable
        },
        data () {
            return {
                breadcrumbData: [{title: '系统管理'}, {title: '权限管理'}, {title: '菜单调整'}],
                value: [],
                // 树结构数据
                treeData: [],
//                treeProps: {
//                    label: function (data, node) {
//                        return data.data.name
//                    },
//                    children: 'children'
//                },
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                symbol: 'visible',
                defaultExpandedKeys: [0]
            }
        },
        mounted () {
            permApi.getMemuTree2().then((res) => {
                if (res.data.status === 200) {
                    this.treeData = [res.data.result]
                }
            })
        },
        methods: {
            update () {
                this.value.map((part, index) => {
                    part.sortId = index + 1
                })
            },
            submit () {
                let _this = this
                let sortList = []
                this.value.forEach((obj) => {
                    sortList.push({
                        id: obj.id,
                        sortId: obj.sortId
                    })
                })

                if (sortList.length === 0) {
                    _this.$message.error('无需要排序的节点')
                    return
                }
                permApi.updatePemSortId(sortList)
                    .then((res) => {
                        if (res.data.status === 200) {
                            _this.$message.success('保存成功')

                            permApi.getMemuTree2().then((res) => {
                                if (res.data.status === 200) {
                                    this.treeData = [res.data.result]
                                }
                            })
                        } else {
                            _this.$message.error(res.data.message)
                        }
                    })
//                    .catch((err) => {
//                        _this.$message.error(err)
//                    })
            },
            reset () {

            },
            onTreeClick (data, node) {
//                node.expanded = !node.expanded
                permApi.getSubMemuList(data.id).then((res) => {
                    if (res.data.status === 200) {
                        this.value = res.data.result
                    }
                })
            },
            onNodeExpand (data) {
                this.defaultExpandedKeys.push(data.id)
            },
            onNodeCollapse (data) {
                this.defaultExpandedKeys = this.defaultExpandedKeys.filter(e => e !== data.id)
            }
        }
    }
</script>
<style scoped>
    .my-table-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        text-align: center;
        font-size: 14px;
    }
    .my-table-head {
        font-weight: bold;
        background-color: #f5f5fa;
        border-top: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
    }
    .my-table-body{
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: auto;
        border: 1px solid #dfe6ec;
    }
    .th{
        height: 40px;
        line-height: 40px;
        /*border-right: 1px solid #dfe6ec;*/
    }
    .tr{
        border-bottom: 1px solid #dfe6ec;
    }
    .td{
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #dfe6ec;
    }
</style>
