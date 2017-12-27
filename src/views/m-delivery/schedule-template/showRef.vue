<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog"
        v-model="isDialogShow"
        size="full"
        class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar class="t8t-dark"
                        @EDIT-SUBMIT="handleClick"
                        :loading="saveLoad">
                    </t8t-toolbar>
                </div>
            </div>
            <div class="pd bt">
                <h2>排期模板引用情况</h2>
                <t8t-table ref="refTable"
                    :columns="columns"
                    :editable="true"
                    :service="service"
                    :method="method"
                    :args="args"
                    :selectCol="false"
                    :commonData="commonData"
                    @cell-form-item-change="rowChange">
                </t8t-table>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import Cookie from 'js-cookie'
    import Service from 'src/services/delivery/Service.js'
    import axios from 'src/utils/axios.js'
    export default {

        name: 'ref-dialog',
        data() {
            return {
                isDialogShow: true,
                service: Service.TEMPLATE.name,
                method: Service.TEMPLATE.methods.scheduleRef,
                args: { moduleId: this.$route.query.refId },
                columns: [
                    { "prop": "scheduleId", "label": "排期模板ID" },
                    { "prop": "scheduleId", "label": "排期模板名称", "list": "scheduleName" },
                    { "prop": "quotationId", "label": "报价模板ID" },
                    {
                        "prop": "quotationIdReference", "label": "报价模板名称", "list": 'quotations', editor: {
                            type: 'select',
                            filterable: 'true',
                            rules: [{
                                required: true,
                                message: "请填写报价模板名称"
                            }]
                        }
                    },
                    { "prop": "quotationStatus", "label": "报价模板状态", "list": "mouldStatus" },
                    { "prop": "quotationEffectime", "label": "报价模板生效日期", "formatter": "dateParser" }
                ],
                commonData: {
                    scheduleName: [
                        {
                            text: this.$route.query.scheduleName,
                            value: Number.parseInt(this.$route.query.refId)
                        }
                    ],
                    quotations: [],
                    mouldStatus: [
                        {
                            text: '待启用',
                            value: 0
                        }, {
                            text: '审核中',
                            value: 1
                        }, {
                            text: '已启用',
                            value: 2
                        }, {
                            text: '已驳回',
                            value: 3
                        }
                    ]
                },
                saveLoad: false

            }
        },
        created() {
            if (!Number.isFinite(Number(this.$route.query.refId))) {
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    message: '参数错误！',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }, function () {
                    //todo 没传参数的情况
                });
                return false;
            }
            this.getQuotations()
        },
        methods: {
            getQuotations() {
                axios({
                    method: Service.TEMPLATE.methods.queryPagePqmQuotaion,
                    service: Service.TEMPLATE.name,
                    args: { 'page': 1, size: 1000, moduleId: this.$route.query.refId }
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            let tmp = {
                                text: item.tempName,
                                quotationId: item.id,
                                quotationStatus: item.mouldStatus,
                                quotationEffectime: item.enableTime,
                                value: item.id
                            }
                            this.commonData.quotations.push(tmp)
                        })
                    };
                })
            },
            closeDialog() {
                this.$router.go(-1)
            },
            rowChange(cell, value) {
                if (cell.column.property == 'quotationIdReference') {
                    let new_data_list = this.commonData.quotations
                    var ndata = {}
                    if (typeof (new_data_list) != 'object' || new_data_list.length < 1) return;
                    for (let i = new_data_list.length - 1; i >= 0; i--) {
                        if (new_data_list[i]['value'] == value) {
                            ndata = {
                                quotationId: new_data_list[i]['quotationId'],
                                quotationName: new_data_list[i]['text'],
                                quotationStatus: new_data_list[i]['quotationStatus'],
                                quotationEffectime: new_data_list[i]['quotationEffectime']
                            }
                        }
                    }
                    let list = this.$refs['refTable'].dataSource
                    let line = cell.$index;
                    let oldData = list[line]
                    Object.assign(oldData, ndata)
                    this.$refs['refTable'].dataSource[line] = oldData
                }
            },
            handleClick() {
                var args = {};
                args['quotationIds'] = [];
                let data = Array.from(this.$refs['refTable'].dataSource);
                if (data.length < 1) {
                    this.$message({
                        type: 'error',
                        message: '请先添加报价模板'
                    });
                    return
                }
                for (let i = 0; i < data.length; i++) {
                    let { quotationId } = data[i]
                    args['quotationIds'].push(quotationId)
                }
                args['moduleId'] = this.$route.query.refId
                args['updateUser'] = Cookie.get('t8t-tc-uid')
                this.saveLoad = true
                axios({
                    method: Service.TEMPLATE.methods.scheduleRefUpdate,
                    service: Service.TEMPLATE.name,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        });
                        //刷新表格
                        this.$refs['refTable'].reloadTable();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        })
                    }
                    this.saveLoad = false
                })
            },
            //辅助资料
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            }
        }
    };

</script>

<style lang="css"
    scoped>
    .t8t-full-dialog {}

    .text-center {
        text-align: center;
    }

    .bt {
        border-top: 2px solid #eff7fa;
        margin: 0
    }

    .pd {
        padding: 0 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .footer {
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }

    .footer .left {
        font-size: 14px;
        margin-left: 10px;
    }

    .footer .right {
        font-size: 14px;
        margin-left: 1415px;
    }
</style>
<style>
    .t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 20px;
    }

    .t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container .el-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .t8t-full-dialog .toolbar-container .el-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .t8t-full-dialog .container-center {
        width: 1250px;
        margin-left: auto;
        margin-right: auto;
    }

    .t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .t8t-full-dialog .form-item-container {
        width: 25%;
    }

    .t8t-full-dialog .full-dialog-form-container {
        margin-top: 0px;
    }

    .t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .t8t-full-dialog .el-tabs__item+.el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .t8t-full-dialog .el-tabs__content {
        flex: 1;
        display: flex;
        /*        width: 1220px;
        margin: 0 auto;*/
    }

    .t8t-full-dialog .el-tab-pane {
        flex: 1;
        overflow: auto;
    }

    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>