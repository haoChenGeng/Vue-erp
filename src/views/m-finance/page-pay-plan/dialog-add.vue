<template>
    <el-dialog @close="closeDialog"
               v-model="isDialogShow"
               size="full"
               class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <t8t-toolbar @ADD="submitForm()"></t8t-toolbar>
            </div>
            <!-- 表单区 -->
            <t8t-form-panel ref="fp"
                            :dataSource="formData"
                            :fields="fields"
                            :commonData="commonData"></t8t-form-panel>
        </div>
    </el-dialog>
</template>

<script>
import { M, mb } from 'src/components/t8t-table/utils/utils.js'
import cookie from 'js-cookie'
import api from 'src/utils/api'
import request from 'src/services/finance/receiptPlanOrder.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/finance/Service.js'
const uid = +cookie.get('t8t-tc-uid')
export default {
    name: 'page-pay-plan-add-dialog',
    data() {
        return {
            isLoading: false,
            isDialogShow: true,
            formData: {
                "bizId": null,
                "createUser": null,
                "fundPurposeId": null,
                "oughtAmount": null,
                "projectId": null,
                "receiptOrgId": null,
                "receiptRoleId": null,
                "receiptTypeId": null,
                "receiptorId": null,
                "receiptorName": null
            },
            fields: [
                {
                    prop: 'bizId',
                    label: '业务类型',
                    type: 'select',
                    list: 'bizs',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'fundPurposeId',
                    label: '款项用途',
                    type: 'select',
                    list: 'fundPurposes',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'oughtAmount',
                    label: '应收金额',
                    type: 'number',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }, {
                        type: 'number',
                        message: '必须为数字值'
                    }]
                }, {
                    prop: 'projectId',
                    label: '项目ID',
                    type: 'input',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'receiptOrgId',
                    label: '收款组织',
                    type: 'select',
                    list: 'organizations',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'receiptRoleId',
                    label: '收款对象',
                    type: 'select',
                    list: 'receiptRoles',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'receiptTypeId',
                    label: '收款类型',
                    type: 'select',
                    list: 'receiptTypes',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'receiptorId',
                    label: '收款对象ID',
                    type: 'input',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }, {
                    prop: 'receiptorName',
                    label: '收款对象名称',
                    type: 'input',
                    rules: [{
                        required: true,
                        message: '不能为空'
                    }]
                }
            ],
            commonData: {
                bizs: [],
                organizations: [],
                fundPurposes: [],
                receiptRoles: [],
                receiptTypes: [],
                receiptors: []
            },
        }
    },
    created() {
        apiCommon.queryAll({ "search": { "id_gt": -1, "isDel_eq": 0 }, "fields": ["id", "name"] })
            .then((res => {
                let list = []
                if (res.data.status === 200) {
                    debugger
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })
                    this.commonData['organizations'] = list
                }
            }))
        this.getCommonData('11008', 'bizs')
        this.getCommonData('61003', 'fundPurposes')
        this.getCommonData('61004', 'receiptRoles')
        this.getCommonData('61002', 'receiptTypes')
    },
    methods: {
        submitForm() {
            let self = this
            this.$refs['fp'].validate((valid) => {
                if (valid) {
                    self.isLoading = true
                    self.formData['createUser'] = uid
                    let args = { "receiptPlanCreateDTO": self.formData }
                    request.verifyOrderAdd(args)
                        .then((res) => {
                            this.isLoading = false
                            if (res.data.status === 200) {
                                self.$msgbox(mb('提交成功。', 'success'))
                                self.dialogcloseDialogClose()
                            } else {
                                self.$msgbox(mb(res.data.message, 'error'))
                            }
                        })
                }
            })
        },
        closeDialog() {
            this.$router.go(-1)
        },
        getCommonData0(pid, name) {
            let args = { "fatherCode": pid }
            let list = []
            apiCommon.allSystemCodeList(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.commonData[name] = list
                    }
                })
        },
        //辅助资料
        getCommonData: function (fatherCode, selectName) {
            let arg = {
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
                            if (item.propertyStatus === 1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonData[selectName] = list
                    }
                })
        }
    }
};

</script>

<style
    lang="css"
    scoped
>

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

.t8t-full-dialog .toolbar-container .toolbar-button {
    padding: 0 12px;
    height: 26px;
    font-size: 12px;
    background-color: #1e3046;
    color: #d1dde9;
    border: 1px solid #09131d;
}

.t8t-full-dialog .toolbar-container .toolbar-button:hover {
    color: #1e3046;
    background-color: #d2deeb;
}

.t8t-full-dialog .container-center {
    width: 1220px;
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
    margin-top: 22px;
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
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    overflow: auto;
}





/* 顶部tab */

.t8t-full-dialog .full-dialog-form-container .el-tabs__item {
    font-size: 12px;
    height: 22px;
    line-height: 22px;
    margin-top: 13px;
    margin-bottom: 12px;
}

.t8t-full-dialog .full-dialog-form-container .el-tabs__header {
    border-top: 0;
    border-bottom: 0;
}





/* 弹窗tab里面的表格定位 */

.full-dialog-tabs-wrapper {
    display: flex;
    flex: 1;
}
</style>
