<template>
    <div id="my-table-id"></div>
</template>
<script>
    let treeData = [];
    let treeManager;
    export default {

        name: 'treeGrid',

        data() {
            return {

            };
        },

        mounted() {
            this.$nextTick(()=>{
                this.initTreeGrid()
            })
        }

        methods: {
            initTreeGrid() {
                let _this = this
                treeManager = $("#my-table-id").ligerGrid({
                    columns: [{
                            display: '商品编码',
                            name: 'goodsCode',
                            id: 'index',
                            align: 'left'
                        },

                        {
                            display: '退货数量',
                            name: 'refundNum',
                            editor: {
                                type: 'int'
                            },
                            type: 'int'
                        },

                        {
                            display: '退货原因',
                            name: 'refundReasonType',
                            editor: {
                                type: 'select',
                                data: _this.options.status,
                                valueField: 'value',
                                textField: 'text',
                                onChange: function (item) {console.log(item)
                                    // 值改变
                                    if(item.selected){
                                        traverse(item.record, item.value)
                                    }
                                    function traverse(node, value) {
                                        let childNodes = node.items || []

                                        childNodes.forEach((child) => {
                                            child.refundReasonType = value
                                            traverse(child);
                                        })
                                    }
                                }
                            },
                            render: function(item) {
                                if (item.refundReasonType == '') {
                                    return '<span class="g-placeholder">选择退货原因</span>'
                                }
                                for (var i = 0; i < _this.options.status.length; i++) {
                                    if (_this.options.status[i]['value'] == item.refundReasonType)
                                        return _this.options.status[i]['text']
                                }
                                return item.refundReasonType;
                            }
                        },

                        {
                            display: '操作',
                            render: function(row) {
                                let __id = row.__id
                                let html = '<button href="javascript:;" data-id="' + __id + '" class="my-btn1 el-button el-button--default el-button--mini">上传图片</button>' +
                                        '<button href="javascript:;" data-id="' + __id + '" class="my-btn2 el-button el-button--default el-button--mini">查看图片</button>'
                                return html;
                            }
                        }
                    ],
                    fixedCellHeight: false,
                    width: '95%',
                    height: '97%',
                    data: {
                        Rows: treeData
                    },
                    tree: {
                        childrenName: 'items',
                        columnId: 'index'
                    },
                    rownumbers: true,
                    enabledSort: false,
                    checkbox: true,
                    usePager: false,
                    enabledEdit: true,
                    onBeforeEdit: onBeforeEdit
                });

                $( "#refund-table" ).on("click", ".my-btn1", onUpload);
                $( "#refund-table" ).on("click", ".my-btn2", onGallery);

                function onUpload() {
                    var __id = $(this).data('id')
                    if (!treeManager.isSelected(__id)) return _this.$message('勾选后编辑！')
                    _this.showUpload(__id)
                }

                function onGallery() {
                    var __id = $(this).data('id')
                    if (!treeManager.isSelected(__id)) return _this.$message('勾选后编辑！')
                    _this.showGallery(__id)
                }

                function onBeforeEdit(e) {
                    if (treeManager.isSelected(e.rowindex)) {
                        if (e.column.name != 'refundNum') return true
                    }
                    _this.$message('勾选后编辑！')
                    return false;
                }
            },

            showGallery(){

            },

            showUpload(){

            }
        }
    };
</script>
<style lang="css" scoped>

</style>
