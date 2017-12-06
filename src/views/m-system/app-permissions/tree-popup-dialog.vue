<template>
    <div class="t8t-form-popup-dialog">
        <div class="t8t-form-popup-bg"></div>

        <el-dialog
            v-model="visible"
            :title="title"
            :modal="modal"
            :show-close="showClose"
            :size="size"
            @close="close"
            :showCheckbox="true"
            >
           <t8t-tree
                ref="dialogTreeRef"
                :data="treeData" 
                :props="treeProps"
                :default-expanded-keys="[1]"
                :showCheckbox="true"
                :defaultCheckedKeys="defaultSelectedList"
                @node-click="onTreeClick"
                class="dialog_tree"
                :hideArrow="true"
            >
            </t8t-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
                <el-button @click="close">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'src/services/delivery/foremanworker.js'
    export default {
        name: 'tree-popup-dialog',
        data () {
            return {
                visible: true,
                modal: false,
                showClose: true,
                currenRow: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                treeData:[],
                selectedList:[]
            }
        },
        props: {
            title: String,
            size: {
                type:String
            },
            dialogWidth: {
                type: String,
                default: '450px'
            },
            defaultSelectedList: Array
        },
        mounted () {
            if (this.dialogWidth) {
                let dialog  = document.querySelectorAll('.t8t-form-popup-dialog .el-dialog')[0];
                dialog.style.width=this.dialogWidth
            }
        },
        created(){
            this.treeSubOrg()
        },
        methods: {
            close: function(){
                this.$emit('close')
            },
            treeSubOrg(){
            return api.organizationQueryTreeByType({}).then((res) => {
                      if (res.data.status === 200) {
                              this.treeData = [res.data.result]
                          }
             })
            },
            getCheckedData(){
                return this.$refs.dialogTreeRef.$refs.treeRef.getCheckedNodes()
            },
            confirm(){
                let data = this.getUnicoNode(this.getCheckedData())
                this.close()
                this.$emit('confirm', data)
            },
            getUnicoNode(list){
                if(!Array.isArray(list)  || list.length < 1){
                    return []
                }
                return list.filter((item, index, array) =>{
                    var res = true
                    array.forEach((val) => {
                        if(item.parentId == val.id){
                             res = false
                             return
                        }
                    })
                    return res
                })
            }
        }
    }
</script>
<style lang="css">
.t8t-form-popup-dialog .table-container {
    height: 300px;
}
.t8t-form-popup-dialog .t8t-search .search-group-cli {
    right: 0;
}
.t8t-form-popup-dialog .el-dialog__body {
    padding-bottom: 20px;
}
.dialog_tree{
    height: 500px;
}
</style>

<style lang="css">
.t8t-form-popup-dialog .el-dialog__wrapper {
    overflow: inherit;
}
.el-select-dropdown {
    z-index: 3000!important;
}
.t8t-form-popup-dialog .t8t-search {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
    margin-top: -30px;
}
.t8t-form-popup-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1988;
}
.t8t-form-popup-dialog .el-dialog__header {
    padding:30px 20px 20px !important;
}
.t8t-form-popup-dialog .el-dialog__body {
    padding: 30px 20px 20px 20px !important;
}
.t8t-form-popup-dialog .t8t-table-container .pagenav-container .el-pagination .btn-refresh{
    margin-left: 0;
}
.t8t-form-popup-dialog .t8t-search .el-input__inner {
    border: 1px solid #bfcbd9  !important;
    border-radius: 2px !important;
}
</style>
