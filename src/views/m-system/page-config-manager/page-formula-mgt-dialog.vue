<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark" @SAVE="onSave" :symbolList="symbolList" :disabledSymbols="disabledSymbols">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRules" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业务模块：" prop="moduleId">
                                            <el-select :disabled="disabled" v-model.number="formData.moduleId" filterable clearable placeholder="请选择业务模块">
                                                <el-option v-for="item in commonData.moduleIdList" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="公式名称：" prop="formulaName">
                                            <el-input :disabled="disabled" v-model="formData.formulaName">
                                            </el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="公式类型：" prop="typeCode">
                                            <el-select :disabled="disabled" v-model="formData.typeCode" filterable clearable placeholder="请选择公式类型">
                                                <el-option v-for="item in commonData.typeIdList" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="描述：" prop="description">
                                            <el-input :disabled="disabled" :autosize="autosize" resize="none" type="textarea" v-model="formData.description"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef1" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人：">
                                            <el-input v-model="formData.createUserName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建时间：">
                                            <el-input :value="formData.createTime | toDate" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="修改人：">
                                            <el-input v-model="formData.updateUserName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="修改时间：">
                                            <el-input :value="formData.updateTime | toDate" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!--section2-->
                    <div class="section2" :class="{'flag-hide': flag===false}">
                        <div class="my-toolbar" v-if="!disabled">
                            <el-button type="primary" size="small" icon="plus" @click="add()" v-if="flag===true" :disabled="btnDisabled">新增行
                            </el-button>
                            <el-button type="danger" size="small" icon="close" @click="del()" v-if="flag===true" :disabled="btnDisabled">删除行
                            </el-button>
                            <el-button type="primary" size="small" @click="toggle">
                                {{flag === false ? '新增公式' : '新增表达式'}}
                            </el-button>
                        </div>
                        <t8t-table ref="t8ttable" :columns="columns" :templateData="templateData" :dataSource="dataSource" :selectCol="true" :indexCol="true"
                            :editable="true" :pageBar="false" @row-click="onChange" v-if="flag===true">
                            <template slot="btn" scope="scope">
                                <el-button size="small" :disabled="disabled" @click="showDetail(scope.row)">引用
                                </el-button>
                            </template>
                        </t8t-table>
                    </div>
                    <!--section3-->
                    <div class="section3">
                        <div class="left">
                            <div class="left-header">
                                <el-button class="l-btn" size="small" @click="insertText('+')" :disabled="disabled">+
                                </el-button>
                                <el-button class="l-btn" size="small" @click="insertText('-')" :disabled="disabled">-
                                </el-button>
                                <el-button class="l-btn" size="small" @click="insertText('*')" :disabled="disabled">*
                                </el-button>
                                <el-button class="l-btn" size="small" @click="insertText('/')" :disabled="disabled">/
                                </el-button>
                                <el-button class="l-btn" size="small" @click="insertText('(')" :disabled="disabled">(
                                </el-button>
                                <el-button class="l-btn" size="small" @click="insertText(')')" :disabled="disabled">)
                                </el-button>
                            </div>
                            <div class="left-body">
                                <textarea id="js-textarea" v-model="textarea1" class="lb-textarea" :disabled="disabled"></textarea>
                            </div>
                        </div>
                        <div class="right" v-if="flag===true">
                            <h1 class="right-header">
                                校验公式：
                            </h1>
                            <div class="right-body">
                                <div class="mb20 ipt-container">
                                    <div class="l">入参值：</div>
                                    <div class="r" style="display: flex;">
                                        <div class="item-container" v-for="item in paramMap" style="display: flex; align-items: center;">
                                            <span>{{item.label}}</span>
                                            <el-input v-if="item.type===1" v-model="item.value" :disabled="disabled" class="w85" style="display: flex; align-items: center;"></el-input>
                                            <el-input v-if="item.type===2" type="textarea" :autosize="{ minRows: 2 }" v-model="item.value" class="w85" :disabled="disabled"
                                                style="display: flex; align-items: center;"></el-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb20 ipt-container">
                                    <div class="l">运算结果：</div>
                                    <div class="r">
                                        <el-input v-model="result0" disabled class="w160"></el-input>
                                    </div>
                                </div>
                                <el-button v-if="!disabled" :disabled="checkDisabled0" @click="onCheck" class="fr">
                                    校验
                                </el-button>
                                <span v-html="SQLmessage0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <div v-if="dialogVisible">
            <el-dialog title="变量配置" class="formula-dialog" v-model="allshow" @close="closeDialog1">
                <el-row>
                    <el-col :span="24">
                        <el-radio-group v-model="radio">
                            <el-radio :label="1">数据库来源</el-radio>
                            <el-radio :label="2">接口来源</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row v-if="radio==1">
                    <el-col :span="15">
                        <span class="h2">数据来源：</span>
                        <el-row class="border h90">
                            <el-row>
                                <el-cascader v-model="SQLData.f1" :options="treeSource.options1" filterable @change="options2Change"></el-cascader>
                                <el-button size="small" @click="addRow">+</el-button>
                            </el-row>
                            <el-row v-for="(item, index) in SQLData.f2">
                                <el-cascader v-model="item.v1" :options="treeSource.options1" filterable @change="options2Change"></el-cascader>
                                联表条件：
                                <el-cascader v-model="item.v2" :options="treeSource.options2" filterable></el-cascader>
                                =
                                <el-cascader v-model="item.v3" :options="treeSource.options2" filterable></el-cascader>
                                <el-button size="small" @click="delRow(index)">-</el-button>
                            </el-row>

                        </el-row>
                        <div class="h2">目标值：</div>
                        <el-row class="border" style="margin-top: 14px; height: 116px; overflow: auto;">
                            <el-row>
                                <el-col :span="10">
                                    <span style="display: inline-block;width: 80px;text-align: right">目标值：</span>
                                    <el-cascader v-model="SQLData.f3" :options="treeSource.options2" filterable style="margin-top: 12px"></el-cascader>
                                    <br>
                                    <span style="display: inline-block;width: 80px;text-align: right ">计算逻辑：</span>
                                    <el-select v-model="SQLData.f4 " placeholder="请选择 " class="w178 " style="margin-top: 16px ">
                                        <el-option v-for="item in options1 " :label="item.label " :value="item.value ">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="14 ">
                                    <el-col :span="4 ">
                                        <div style="display: inline-block;width: 70px;text-align: right;margin-top: 17px ">
                                            order by:
                                        </div>
                                    </el-col>
                                    <el-col :span="20 ">
                                        <el-row v-for="(item, index) in SQLData.f6 ">
                                            <el-cascader v-model="item.v1 " :options="treeSource.options2 " filterable></el-cascader>
                                            <el-select v-model="item.v2 " placeholder="请选择 " style="width: 80px; ">
                                                <el-option v-for="item in options7 " :label="item.label " :value="item.value ">
                                                </el-option>
                                            </el-select>
                                            <el-button v-if="index==0 " size="small " @click="addRow2 ">+</el-button>
                                            <el-button v-else size="small " @click="delRow2(index) ">-</el-button>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="24 ">
                                        <span style="display: inline-block;width: 70px;text-align: right;margin-top: 17px ">limit:</span>
                                        <el-input style="width: 40px; margin-left: 5px " v-model="SQLData.f7 "></el-input>
                                        <span>, 1</span>
                                    </el-col>
                                </el-col>
                            </el-row>
                        </el-row>
                        <div class="h2 ">筛选条件：</div>
                        <el-row class="border " style="height: 96.1px; overflow: auto; ">
                            <el-row v-for="(item, index) in SQLData.f5 ">
                                <el-select style="width: 52px " v-model="item.v1 ">
                                    <el-option v-for="item in options5 " :label="item.label " :value="item.value ">
                                    </el-option>
                                </el-select>
                                <el-cascader v-model="item.v2 " :options="treeSource.options2 " filterable></el-cascader>
                                <el-select style="width: 85px " v-model="item.v3 ">
                                    <el-option v-for="item in options2 " :label="item.label " :value="item.value ">
                                    </el-option>
                                </el-select>
                                <el-cascader style="width: 110px " v-model="item.v4 " :options="options3 ">
                                </el-cascader>
                                <el-input style="width: 100px " v-model="item.v5 " :disabled="!(item.v4.length===1 && (item.v4[0]===1 || item.v4[0]===2 )) "></el-input>
                                <el-select style="width: 52px " v-model="item.v6 ">
                                    <el-option v-for="item in options6 " :label="item.label " :value="item.value ">
                                    </el-option>
                                </el-select>
                                <el-select style="width: 72px " v-model="item.v7 ">
                                    <el-option v-for="item in options4 " :label="item.label " :value="item.value ">
                                    </el-option>
                                </el-select>
                                <el-button v-if="index==0 " size="small " @click="addRow1 ">+</el-button>
                                <el-button v-else size="small " @click="delRow1(index) ">-</el-button>
                            </el-row>
                        </el-row>
                    </el-col>
                    <el-col :span="9">
                        <div class="h2 ">查询语句：</div>
                        <el-row class="nm ">
                            <textarea id="js-textarea2 " v-model="SQLStr " class="textarea2 " disabled></textarea>
                        </el-row>
                        <div class="h2 ">校验变量：</div>
                        <el-row class="border " style="height: 256px; overflow: auto; position: relative; ">
                            <div class="right-body border-none ">
                                <div class="mb20 ipt-container ">
                                    <div class="l ">入参值：</div>
                                    <div class="r ">
                                        <div class="item-container " v-for="(item, index) in rucanArr ">
                                            <span>{{item.label}}</span>
                                            <el-input v-model="item.value " :disabled="disabled " class="w85 "></el-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb20 ipt-container ">
                                    <div class="l ">变量值：</div>
                                    <div class="r ">
                                        <el-input v-model="result " disabled class="w160 "></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-row>
                        <span v-html="SQLmessage " style="position: absolute; width: 315px; bottom: 23px; right: 106px; "></span>
                        <el-button v-if="!disabled " :disabled="checkDisabled " @click="validSQL(SQLStr) " style="position: absolute; bottom: 23px; right: 23px ">校验
                        </el-button>
                    </el-col>
                </el-row>
                <el-row v-if="radio==2 ">
                    <el-col :span="24 ">
                        <el-row>
                            <el-col :span="8 ">
                                <span>服务名：</span>
                                <el-input v-model="dialogService " style="width: 330px "></el-input>
                            </el-col>
                            <el-col :span="8 ">
                                <span>接口名：</span>
                                <el-input v-model="dialogMethod " style="width: 330px "></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div class="h2 ">校验变量：</div>
                            <el-row class="border ">
                                <div class="right-body border-none ">
                                    <div class="mb20 ipt-container ">
                                        <div class="l ">入参值：</div>
                                        <div class="r ">
                                            <el-input type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容" v-model="apiRucan">
                                            </el-input>
                                        </div>
                                    </div>
                                    <div class="mb20 ipt-container ">
                                        <div class="l ">变量值：</div>
                                        <div class="r ">
                                            <el-input v-model="result " disabled class="w160 "></el-input>
                                        </div>
                                    </div>
                                    <el-button v-if="!disabled " :disabled="checkDisabled " @click="validSQL1(SQLStr) " class="fr ">校验
                                    </el-button>
                                    <span v-html="SQLmessage1 "></span>
                                </div>
                            </el-row>
                        </el-row>
                    </el-col>
                </el-row>

                <div slot="footer" v-if="!disabled">
                    <el-button type="primary " :disabled="confirmDisabled" @click="saveDialog ">确定</el-button>
                    <el-button @click="closeDialog1 ">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import Service from 'src/services/system/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    import { isEqual, uniqWith, uniq } from 'lodash'

    var FieldList = {}

    export default {
        name: 'page-formula-mgt-dialog',
        data() {
            let _this = this
            return {
                mode: '',
                flag: true,
                disabledSymbols: ['SAVE'],
                curRow: {},
                allshow: true,
                dataSource: [],
                dialogService: '',
                dialogMethod: '',
                confirmDisabled: true,
                SQLmessage0: '',
                SQLmessage: '',
                SQLmessage1: '',
                options12: [],
                options23: [],
                mainType: '11602',
                constantType: '003001',
                variableType: '001003',
                formulaType: '003003',
                isTopHide: false,
                isDialogShow: true,
                dialogVisible: false,
                radio: 1,
                activeTabName: 'basic',
                disabled: false,
                checkDisabled0: false,
                checkDisabled: true,
                symbolList: ['SAVE'],
                commonData: {
                    typeIdList: [],
                    moduleIdList: []
                },
                formData: {
                    moduleId: null,
                    typeCode: null,
                    formulaName: '',
                    expression: '',
                    description: '',
                    createUserName: null,
                    createTime: 0,
                    updateUserName: null,
                    updateTime: 0
                },
                formRules: {
                    moduleId: [
                        { type: 'number', required: true, message: '请选择业务模块', trigger: 'change' }
                    ],
                    typeCode: [
                        { type: 'string', required: true, message: '请选择公式类型', trigger: 'change' }
                    ],
                    formulaName: [
                        { type: 'string', required: true, message: '请填写公式名称', trigger: 'change' }
                    ],
                    description: [
                        { type: 'string', required: true, message: '请填写描述', trigger: 'change' }
                    ]
                },
                textarea1: '',
                paramMap: [],
                result0: '',
                result: '',
                columns: [
                    {
                        prop: 'btn',
                        label: '',
                        width: 80
                    },
                    {
                        prop: 'variableName',
                        label: '变量名',
                        editor: {
                            type: 'input'
                        }
                    },
                    {
                        prop: 'description',
                        label: '入参值说明',
                        editor: {
                            type: 'input'
                        }
                    },
                    {
                        prop: 'dataSource',
                        label: '变量配置',
                        onClick(val, row) {
                            if (!row.variableName) {
                                _this.$message('先输入变量名！')
                                return
                            }
                            _this.curRow = row
                            if (_this.mode === 'add') {
                                _this.initDialog1(row)
                            } else {
                                _this.initDialog2(row)
                            }
                        }
                    }
                ],
                templateData: {
                    variableName: null,
                    description: null,
                    dataSource: null,
                    serverName: null,
                    apiName: null,
                    rucan: null
                },
                SQLData: {
                    f1: null,
                    f2: [],
                    f3: null,
                    f4: null,
                    f5: [{
                        v1: '',
                        v2: '',
                        v3: '',
                        v4: '',
                        v5: '',
                        v6: '',
                        v7: ''
                    }],
                    f6: [{
                        v1: '',
                        v2: 'ASC'
                    }],
                    f7: null
                },
                SQLStr: '',
                options1: [
                    {
                        value: null,
                        label: ''
                    },
                    {
                        value: 'SUM',
                        label: '合计'
                    },
                    {
                        value: 'COUNT',
                        label: '计数'
                    },
                    {
                        value: 'AVG',
                        label: '平均值'
                    },
                    {
                        value: 'MAX',
                        label: '最大值'
                    },
                    {
                        value: 'MIN',
                        label: '最小值'
                    }
                ],
                options2: [
                    {
                        value: '=',
                        label: '='
                    },
                    {
                        value: '<>',
                        label: '≠'
                    },
                    {
                        value: '>',
                        label: '>'
                    },
                    {
                        value: '<',
                        label: '<'
                    },
                    {
                        value: '>=',
                        label: '≥'
                    },
                    {
                        value: '<=',
                        label: '≤'
                    },
                    {
                        value: 'IN',
                        label: '包含'
                    },
                    {
                        value: 'NOT IN',
                        label: '不包含'
                    }
                ],
                options3: [
                    {
                        value: 1,
                        label: '入参值'
                    },
                    {
                        value: 2,
                        label: '自定义值'
                    }
                ],
                options4: [
                    {
                        value: '',
                        label: ''
                    },
                    {
                        value: 'AND',
                        label: '并且'
                    },
                    {
                        value: 'OR',
                        label: '或者'
                    }
                ],
                options5: [
                    {
                        value: '',
                        label: ''
                    },
                    {
                        value: '(',
                        label: '('
                    }
                ],
                options6: [
                    {
                        value: '',
                        label: ''
                    },
                    {
                        value: ')',
                        label: ')'
                    }
                ],
                options7: [
                    {
                        value: 'ASC',
                        label: 'ASC'
                    },
                    {
                        value: 'DESC',
                        label: 'DESC'
                    }
                ],
                treeSource: {
                    options1: [],
                    options2: []
                },
                rucanArr: [],
                apiRucan: '',
                allRucan: [],
                btnDisabled: true
            }
        },
        watch: {
            textarea1: function (val) {
                // console.log(val)
            },
            SQLData: {
                handler: function (val, oldVal) {
                    if (this.$route.query.mode === 'add') {
                        this.SQLmessage = ''
                        this.SQLData2str(val)
                        this.genRuCan()
                    } else {
                        this.SQLStr = this.curRow.dataSource
                    }
                },
                deep: true
            },
            rucanArr: {
                handler: function (val) {
                    this.SQLmessage1 = ''
                    this.checkDisabled = false
                    val.forEach(i => {
                        if (i.value === null || i.value === '') {
                            this.checkDisabled = true
                        }
                    })
                },
                deep: true
            },
            SQLStr: function () {
                this.confirmDisabled = true
            },
            dataSource: {
                handler: function (val) {
                    if (this.$route.query.mode !== 'add') return
                    let res = []
                    val.forEach(item => {
                        if (item.type === 2) {
                            let _rucan = {}
                            _rucan[item.variableName] = item.apiRucan
                            res = res.concat(this.dealParamMap(_rucan, 2, item.variableName))
                        } else {
                            res = res.concat(this.dealParamMap(item.rucan, 1, item.variableName))
                        }
                    })
                    res.forEach(item => {
                        item.value = ''
                    })
                    this.paramMap = res
                },
                deep: true
            },
            paramMap: {
                handler: function (val) {
                    this.SQLmessage0 = ''
                    this.checkDisabled0 = false
                    val.forEach(i => {
                        if (i.value === null || i.value === '') {
                            this.checkDisabled0 = true
                        }
                    })
                },
                deep: true
            },
            radio: function (val) {
                this.confirmDisabled = true
            },
            formData: {
                handler: function (val) {
                    if (val.moduleId && val.typeCode && val.formulaName && val.description) {
                        this.btnDisabled = false
                    } else {
                        this.btnDisabled = true
                    }
                },
                deep: true
            }
        },
        methods: {
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/tuchat-system/formula-management' })
            },
            closeDialog1() {
                this.dialogVisible = false
            },
            initDialog(id, mode) {
                this.getCommonData()
                if (mode === 'add') {
                    this.disabled = false
                } else if (mode === 'view') {
                    // this.disabled = true
                    this.symbolList = ['']
                    this.formulaFindById(id)
                } else if (mode === 'edit') {
                    this.disabled = false
                    this.formulaFindById(id)
                }
            },
            getCommonData() {
                // 业务模块
                axios({
                    method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
                    service: Service.SUPPLY_CONFIGURE.name,
                    args: { page: 1, size: 100, search: { 'pPropertyCode': this.mainType } }//
                }).then((res) => {
                    if (res.data.status === 200) {
                        let list = []
                        res.data.result.forEach((item) => {
                            list.push({
                                parentId: 1,
                                id: item.id,
                                value: item.id,
                                text: item.propertyName,
                                label: item.propertyName
                            })
                        })
                        this.commonData.moduleIdList = list
                    }
                })
                // 公式类型
                axios({
                    method: Service.CONFIGURE.methods.SYS_CODE_QUERYALL,
                    service: Service.CONFIGURE.name,
                    args: { 'fatherCode': this.formulaType }//
                }).then((res) => {
                    if (res.data.status === 200) {
                        let list = []
                        res.data.result.forEach((item) => {
                            if (item.isDel === 0) {
                                list.push({
                                    id: item.id,
                                    value: item.code,
                                    label: item.name,
                                    name: item.name,
                                    text: item.name,
                                    fatherCode: this.formulaType,
                                    children: []
                                })
                            }
                        })
                        this.commonData.typeIdList = list
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                })
            },
            formulaFindById(id) {
                axios({
                    method: Service.EXPRESSION.methods.formulaFindById,
                    service: Service.EXPRESSION.name,
                    args: { id: id }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.formData = Object.assign(this.formData, res.data.result)
                        this.textarea1 = res.data.result.expression
                        // this.paramMap = this.dealParamMap(res.data.result.paramMap)
                        this.getUserData(this.formData.createUser).then(res => {
                            this.formData.createUserName = res
                        })
                        this.getUserData(this.formData.updateUser).then(res => {
                            this.formData.updateUserName = res
                        })
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                })
                // 获取变量
                axios({
                    method: Service.EXPRESSION.methods.queryByFormulaId,
                    service: Service.EXPRESSION.name,
                    args: { formulaId: id }
                }).then((res) => {
                    if (res.data.status === 200) {
                        // console.log(res.data.result, this.mode)
                        this.dataSource = res.data.result || []
                        if (this.mode === 'view') {
                            let res = []
                            this.dataSource.forEach(item => {
                                if (item.apiName !== '' && item.serverName !== '') {
                                    let _rucan = {}
                                    _rucan[item.variableName] = ''
                                    res = res.concat(this.dealParamMap({}, 2, item.variableName))
                                } else {
                                    var arr = this._getRucanArrFromSQLStr(item.dataSource)
                                    let _rucan = {}
                                    arr.forEach(item => {
                                        _rucan[item.label] = ''
                                    })
                                    res = res.concat(this.dealParamMap(_rucan, 1, item.variableName))
                                }
                            })
                            res.forEach(item => {
                                item.value = ''
                            })
                            this.paramMap = res
                        }
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                })
            },
            dealParamMap(obj, type, vars) {
                var arr = []
                for (let i in obj) {
                    arr.push({ label: i, value: obj[i], type: type, vars: vars })
                }
                return arr
            },
            dealParamMap1(arr) {
                let obj = {}
                arr.forEach(item => {
                    let _value = ''
                    if (item.value !== null) {
                        if (item.value.startsWith('"') && item.value.endsWith('"')) {
                            // 字符串
                            _value = item.value.slice(1, -1)
                        } else {
                            // 数字
                            _value = +item.value
                        }
                    }
                    obj[item.label] = _value
                })
                return obj
            },
            getUserData(userID) {
                return axios({
                    method: Service.ACCOUNT.methods.accountFindById,
                    service: Service.ACCOUNT.name,
                    args: { 'id': userID }
                }).then((res) => {
                    if (res.data.status === 200) {
                        return res.data.result && res.data.result.name || ''
                    } else {
                        this.$message.error(res.data.message ? res.data.message : '获取数据失败！')
                    }
                })
            },
            insertText(str) {
                let obj = document.querySelector('#js-textarea')
                if (document.selection) {
                    var sel = document.selection.createRange()
                    sel.text = str
                } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                    var startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.value
                    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
                    this.textarea1 = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
                    cursorPos += str.length
                    obj.selectionStart = obj.selectionEnd = cursorPos
                    obj.focus()
                } else {
                    obj.value += str
                    this.textarea1 += str
                }
            },
            // 处理选择行变化
            add() {
                this.$refs['t8ttable'].addNewRow()
            },
            del() {
                let selectRows = this.$refs['t8ttable'].getSelectRows()
                if (selectRows.length !== 1) {
                    this.$message.error('一次可以删除一行')
                    return
                }

                // 选中的行标示 selectRows[0].variableName
                // 所有的行 this.dataSource
                // 依赖列表 row.variableName -> row.SQLData.f5.v4中的变量
                let _del = selectRows[0].variableName
                let depArr = []
                for (var i = 0; i < this.dataSource.length; i++) {
                    // 是本身就退出本次循环
                    if (this.dataSource[i].variableName === _del) continue

                    this.dataSource[i] &&
                        this.dataSource[i].SQLData &&
                        this.dataSource[i].SQLData.f5 &&
                        this.dataSource[i].SQLData.f5.forEach(item => {
                            if (item.v4.length === 1 && !(item.v4[0] === 1 || item.v4[0] === 2)) {
                                if (item.v4[0] === _del) {
                                    depArr.push(this.dataSource[i].variableName)
                                }
                            }
                        })
                }
                // 数组去重
                depArr = uniq(depArr)
                if (depArr.length === 0) {
                    this.$refs['t8ttable'].delRows()
                } else {
                    let msg = `变量${_del}被${depArr}引用`
                    this.$message.error(msg)
                }

            },
            showDetail(row) {
                let _str = '{' + row.variableName + '}'
                this.insertText(_str)
            },
            addRow() {
                this.SQLData.f2.push({ v1: null, v2: null, v3: null })
            },
            delRow(index) {
                this.SQLData.f2.splice(index, 1)
                this.getOptions2()
            },
            addRow1() {
                this.SQLData.f5.push({ v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '' })
            },
            delRow1(index) {
                this.SQLData.f5.splice(index, 1)
            },
            addRow2() {
                this.SQLData.f6.push({ v1: '', v2: 'ASC' })
            },
            delRow2(index) {
                this.SQLData.f6.splice(index, 1)
            },
            SQLData2str(obj) {
                let _field = ''
                let _from = ''
                let _where = ''
                let _orderby = ''
                let _limit = ''

                function last(arr) {
                    if (!Array.isArray(arr)) return ''
                    return arr.join('.')
                }

                if (obj.f4 === null) {
                    _field = last(obj.f3)
                } else {
                    _field = `${obj.f4}(${last(obj.f3)})`
                }

                _from = last(obj.f1)
                obj.f2.forEach(item => {
                    _from += ` LEFT JOIN ${last(item.v1)} ON ( ${last(item.v2)} = ${last(item.v3)} )`
                })

                if (obj.f5.length === 1 && obj.f5[0].v1 === '' && obj.f5[0].v2 === '' && obj.f5[0].v3 === '' && obj.f5[0].v4 === '' && obj.f5[0].v5 === '' && obj.f5[0].v6 === '' && obj.f5[0].v7 === '') {
                    _where = ''
                } else {
                    _where = 'WHERE'
                    obj.f5.forEach(item => {
                        let _str = ''
                        // 入参值
                        if (item.v4.length === 1 && (item.v4[0] === 1)) {
                            _str = '#{' + item.v5 + '}'
                        }
                        // 自定义值
                        if (item.v4.length === 1 && (item.v4[0] === 2)) {
                            _str = '\'' + item.v5 + '\''
                        }
                        // 变量
                        if (item.v4.length === 1 && !(item.v4[0] === 1 || item.v4[0] === 2)) {
                            _str = '{' + item.v4[0] + '}'
                        }

                        // 数据库
                        if (item.v4.length === 3) {
                            _str = item.v4.join('.')
                        }
                        if (item.v3 === 'IN' || item.v3 === 'NOT IN') {
                            _str = '(' + _str + ')'
                        }
                        _where += ` ${item.v1} ${last(item.v2)} ${item.v3} ${_str} ${item.v6} ${item.v7}`
                    })
                }

                if (obj.f6.length === 1 && obj.f6[0].v1 === '') {
                    _orderby = ''
                } else {
                    let _str = ''
                    obj.f6.forEach(item => {
                        _str += ` ${last(item.v1)} ${item.v2},`
                    })
                    _str = _str.slice(0, -1)
                    _orderby = `ORDER BY ${_str}`
                }

                if (!obj.f7) {
                    _limit = ''
                } else {
                    _limit = `LIMIT ${obj.f7},1`
                }

                let tmpl = `SELECT ${_field} FROM ${_from} ${_where} ${_orderby} ${_limit}`
                this.SQLStr = tmpl
            },
            getDatabaseTree() {
                axios({
                    method: Service.EXPRESSION.methods.formulaQueryDatabaseTree,
                    service: Service.EXPRESSION.name,
                    args: {}
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.treeSource.options1 = res.data.result
                        return res.data.result
                    } else {
                        this.$message.error('DatabaseTree获取失败！')
                    }
                })
            },
            genRuCan() {
                let _list = []
                this.SQLData.f5.forEach(item => {
                    // 入参
                    if (item.v4.length === 1 && item.v4[0] === 1) {
                        _list.push({ label: item.v5, value: null })
                    }
                    // 变量名
                    if (item.v4.length === 1 && !(item.v4[0] === 1 || item.v4[0] === 2)) {
                        _list.push({ label: item.v4[0], value: null })
                    }
                })
                this.rucanArr = _list
            },
            validSQL(str) {
                let _parameter = this.dealParamMap1(this.rucanArr)
                if (this.isEmptyObject(_parameter)) {
                    _parameter = null
                }
                axios({
                    method: Service.EXPRESSION.methods.getValueBySql,
                    service: Service.EXPRESSION.name,
                    args: {
                        sql: this.SQLStr,
                        variableName: this.curRow.variableName,
                        parameter: _parameter
                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.result = res.data.result
                        this.confirmDisabled = false
                        this.SQLmessage = `<span style="color: green">校验成功</span>`
                    } else {
                        this.SQLmessage = `<span style="color: red">${res.data.result}</span>`
                        this.confirmDisabled = true
                    }
                })
            },
            validSQL1(str) {
                try {
                    JSON.parse(this.apiRucan)
                } catch (e) {
                    this.$message.error('json格式错误！')
                    return
                }
                let _args = JSON.parse(this.apiRucan)
                if (this.isEmptyObject(_args)) {
                    _args = null
                }
                axios({
                    method: Service.EXPRESSION.methods.getValueByApi,
                    service: Service.EXPRESSION.name,
                    args: {
                        service: this.dialogService,
                        method: this.dialogMethod,
                        variableName: this.curRow.variableName,
                        args: _args
                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.result = res.data.result
                        this.confirmDisabled = false
                        this.SQLmessage1 = `<span style="color: green">校验成功</span>`
                    } else {
                        this.SQLmessage1 = `<span style="color: red">${res.data.result}</span>`
                        this.confirmDisabled = true
                    }
                })
            },
            saveDialog() {
                if (this.radio === 1) {
                    this.curRow.type = 1
                    this.curRow.dataSource = this.SQLStr
                    this.curRow.rucan = this.dealParamMap1(this.rucanArr)
                    this.curRow.rucanArr = this.rucanArr
                    this.curRow.SQLData = JSON.parse(JSON.stringify(this.SQLData))
                } else if (this.radio === 2) {
                    this.curRow.type = 2
                    this.curRow.serverName = this.dialogService
                    this.curRow.apiName = this.dialogMethod
                    this.curRow.apiRucan = this.apiRucan
                }
                this.closeDialog1()
            },
            // 通过选择数据源拉取字段
            options2Change(val) {
                // 判断val是否缓存
                if (val.toString() in FieldList) {
                    this.getOptions2()
                    return false
                } else {
                    // 没有缓存拉取并存储
                    this.queryFieldList({ schema: val[0], table: val[1] })
                        .then(res => {
                            FieldList[val.toString()] = res
                            this.getOptions2()
                        })
                }
            },
            getOptions2() {
                // _itemArr已选择数据库数组，没选为[]
                // this.treeSource.options2为_itemArr到字段树的映射
                let _itemArr = []
                _itemArr.push(this.SQLData.f1 || [])
                this.SQLData.f2.forEach(item => {
                    _itemArr.push(item.v1 || [])
                })
                _itemArr = uniqWith(_itemArr, isEqual)

                // 获取新的options2
                let _options2 = []
                _itemArr.forEach(item => {
                    // 空数组不处理
                    if (item.length !== 0) {
                        this._addChildren(_options2, item)
                    }
                })
                this.treeSource.options2 = _options2
                let _options3 = [this.options3[0], this.options3[1]]
                this.dataSource.forEach(i => {
                    if (i.variableName !== this.curRow.variableName) {
                        let item = {
                            label: i.variableName || '你没有起名字',
                            value: i.variableName
                        }
                        _options3.push(item)
                    }
                })
                _options2.forEach(i => {
                    _options3.push(i)
                })
                this.options3 = _options3
            },
            queryFieldList(args) {
                return axios({
                    method: Service.EXPRESSION.methods.queryFieldList,
                    service: Service.EXPRESSION.name,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        return res.data.result
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            _addChildren(options2, item) {
                let options = this.treeSource.options1
                let _children = FieldList[item.toString()]
                // item对应的数据
                let _data = null
                options.forEach(item1 => {
                    // 一级匹配
                    if (item1.value === item[0]) {
                        let node1 = {
                            label: item1.label,
                            value: item1.value,
                            children: []
                        }
                        // 二级匹配
                        item1.children.forEach(item2 => {
                            if (item2.value === item[1]) {
                                let node2 = {
                                    label: item2.label,
                                    value: item2.value,
                                    children: _children
                                }
                                node1.children.push(node2)
                                _data = node1
                            }
                        })
                    }
                })
                // 向options2加入数据
                if (_isInArr(item[0], options2)) {
                    options2.forEach(item1 => {
                        if (item1.value === item[0]) {
                            if (_isInArr(item[1], item1.children)) {

                            } else {
                                item1.children.push(_data.children[0])
                            }
                        }
                    })
                } else {
                    options2.push(_data)
                }

                function _isInArr(value, options) {
                    return options.some(i => {
                        return value === i.value
                    })
                }
            },
            _getResultNew(args) {
                return axios({
                    method: Service.EXPRESSION.methods.getResultNew,
                    service: Service.EXPRESSION.name,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        return res.data.result
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            _expressionValidate(args) {
                return axios({
                    method: Service.EXPRESSION.methods.expressionValidate,
                    service: Service.EXPRESSION.name,
                    args: args
                }).then((res) => {
                    return res
                })
            },
            onCheck() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        this.checkFormula()
                    } else {

                    }
                })
            },
            checkFormula() {
                let _variables = []
                this.dataSource.forEach(item => {
                    let tmp = {
                        moduleId: this.formData.moduleId,
                        variableName: item.variableName,
                        createUser: Cookie.get('t8t-tc-uid'),
                        description: item.description,
                        dataSource: item.dataSource,
                        serverName: item.serverName,
                        apiName: item.apiName
                    }
                    _variables.push(tmp)
                })

                let _sqlParams = {}
                let _apiParams = {}

                this.paramMap.forEach(item => {
                    let _value = null

                    if (item.type === 2) {
                        try {

                            JSON.parse(item.value)
                        } catch (e) {
                            this.$message.error(item.vars + '--json格式错误！')
                            return
                        }
                        _apiParams[item.vars] = JSON.parse(item.value)
                    } else if (item.type === 1) {
                        if (item.value.startsWith('"') && item.value.endsWith('"')) {
                            // 字符串
                            _value = item.value.slice(1, -1)
                        } else {
                            // 数字
                            _value = +item.value
                        }
                        !_sqlParams[item.vars] && (_sqlParams[item.vars] = {})
                        _sqlParams[item.vars][item.label] = _value
                    }
                })

                function isEmptyObject(obj) {
                    for (var key in obj) {
                        return false
                    }
                    return true
                }

                isEmptyObject(_sqlParams) && (_sqlParams = null)
                isEmptyObject(_apiParams) && (_apiParams = null)

                let args = {
                    formula: {
                        typeCode: this.formData.typeCode,
                        moduleId: this.formData.moduleId,
                        formulaName: this.formData.formulaName,
                        expression: this.textarea1,
                        createUser: Cookie.get('t8t-tc-uid'),
                        description: this.formData.description,
                        variables: _variables
                    },
                    sqlArgs: _sqlParams,
                    apiArgs: _apiParams
                }
                // view下改名校验
                if (this.mode === 'view') {
                    args.formula.formulaName = Math.random().toString(36).substr(2)
                }
                this._expressionValidate(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.result0 = res.data.result
                            this.SQLmessage0 = `<span style="color: green">校验成功</span>`
                            this.disabledSymbols = []
                        } else if (res.data.status === 501) {
                            this.$message.error('公式表达式为空')
                        } else {
                            this.SQLmessage0 = `<span style="color: red">${res.data.result}</span>`
                        }
                    })
            },
            onSave() {
                if (this.flag) {
                    this.saveFun1()
                } else {
                    this.saveFun2()
                }
            },
            // 保存公式
            saveFun1() {
                let _variables = []
                this.dataSource.forEach(item => {
                    let tmp = {
                        moduleId: this.formData.moduleId,
                        variableName: item.variableName,
                        createUser: Cookie.get('t8t-tc-uid'),
                        description: item.description,
                        dataSource: item.dataSource,
                        serverName: item.serverName,
                        apiName: item.apiName
                    }
                    _variables.push(tmp)
                })
                let args = {
                    formula: {
                        typeCode: this.formData.typeCode,
                        moduleId: this.formData.moduleId,
                        formulaName: this.formData.formulaName,
                        expression: this.textarea1,
                        createUser: Cookie.get('t8t-tc-uid'),
                        description: this.formData.description,
                        variables: _variables
                    }
                }
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        axios({
                            method: Service.EXPRESSION.methods.createNew,
                            service: Service.EXPRESSION.name,
                            args: args
                        }).then((res) => {
                            if (res.data.status === 200) {
                                this.$message('公式创建成功')
                                this.$router.push('/tuchat-system/formula-management')
                            } else {
                                this.$message.error('公式创建失败')
                            }
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 保存表达式
            saveFun2() {
                let args = {
                    formula: {
                        typeCode: this.formData.typeCode,
                        moduleId: this.formData.moduleId,
                        formulaName: this.formData.formulaName,
                        expression: this.textarea1,
                        createUser: Cookie.get('t8t-tc-uid'),
                        description: this.formData.description
                    }
                }
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        axios({
                            method: Service.EXPRESSION.methods.createNew,
                            service: Service.EXPRESSION.name,
                            args: args
                        }).then((res) => {
                            if (res.data.status === 200) {
                                this.$message('表达式创建成功')
                                this.$router.push('/tuchat-system/formula-management')
                            } else {
                                this.$message.error('表达式创建失败')
                            }
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            initDialog1(row) {
                this.SQLmessage = ''
                this.dialogVisible = true
                this.allshow = true
                this.radio = this.curRow.type || 1
                if (this.curRow.serverName && this.curRow.apiName) {
                    this.radio = 2
                }
                this.SQLStr = this.curRow.dataSource
                this.rucanArr = this.curRow.rucanArr
                this.dialogService = this.curRow.serverName
                this.dialogMethod = this.curRow.apiName

                if (this.curRow.SQLData) {
                    this.SQLData = JSON.parse(JSON.stringify(this.curRow.SQLData))
                } else {
                    this.SQLData = {
                        f1: null,
                        f2: [],
                        f3: null,
                        f4: null,
                        f5: [{
                            v1: '',
                            v2: '',
                            v3: '',
                            v4: '',
                            v5: '',
                            v6: '',
                            v7: ''
                        }],
                        f6: [{
                            v1: '',
                            v2: 'ASC'
                        }],
                        f7: null
                    }
                }
                this.getOptions2()
            },
            initDialog2() {
                this.SQLmessage = ''
                this.dialogVisible = true
                this.allshow = true
                this.radio = this.curRow.type || 1
                if (this.curRow.serverName && this.curRow.apiName) {
                    this.radio = 2
                }
                this.SQLStr = this.curRow.dataSource
                this.rucanArr = this._getRucanArrFromSQLStr(this.SQLStr)
                this.dialogService = this.curRow.serverName
                this.dialogMethod = this.curRow.apiName
            },
            onChange() {
                if (this.$route.query.mode !== 'add') {
                    this.$refs['t8ttable'].resetActiveCell()
                }
            },
            isEmptyObject(obj) {
                for (var key in obj) {
                    return false
                }
                return true
            },
            toggle() {
                this.flag = !this.flag
                if (this.flag === true) {
                    this.disabledSymbols = ['SAVE']
                } else {
                    this.disabledSymbols = []
                }
            },
            _getRucanArrFromSQLStr(SQLStr) {
                let _list = []
                var str1Arr = SQLStr.split('{')
                str1Arr.forEach(item => {
                    if (item.indexOf('}') > -1) {
                        _list.push(item.split('}')[0])
                    }
                })
                let _ret = []
                _list.forEach(item => {
                    _ret.push({ label: item, value: null })
                })
                return _ret
            }
        },
        created() {
            this.getDatabaseTree()
            let id = this.$route.query.id
            let mode = this.$route.query.mode
            this.mode = mode
            this.initDialog(id, mode)
        }
    }
</script>

<style lang="css" scoped>
    .section2 {
        display: flex;
        flex: 1;
        flex-direction: column;
        margin: 0 20px;
    }

    .section3 {
        display: flex;
        flex: 1;
        flex-direction: row;
    }

    .left,
    .right {
        margin: 20px;
        border: 1px solid #999;
    }

    .border {
        border: 1px solid #999;
    }

    .left,
    .right,
    .left-body {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .left-header {
        display: flex;
        justify-content: center;
        margin: 20px;
    }

    .lb-textarea {
        height: 100%;
    }

    .right-header {
        height: 68px;
        line-height: 68px;
        margin: 0 20px;
    }

    .right-body {
        border-top: 1px solid #999;
        padding: 20px;
        overflow: auto;
    }

    .mb20 {
        margin-bottom: 20px;
    }

    .ipt-container {
        display: flex;
        flex-direction: row;
    }

    .l {
        font-weight: bold;
        margin-right: 10px;
        line-height: 35px;
    }

    .r {
        flex: 1;
    }

    .w85 {
        width: 85px;
    }

    .w160 {
        width: 160px;
    }

    .item-container {
        display: inline-block;
        margin-bottom: 5px;
    }

    .h2 {
        font-size: 18px;
        font-weight: bold;
        margin-left: 10px;
    }

    .el-row {
        margin: 10px;
        /*padding: 10px;*/
    }

    .nm {
        margin: 10px;
    }

    .textarea2 {
        width: 100%;
        height: 90px;
    }

    .h90 {
        height: 96px;
        overflow: auto;
    }

    .w178 {
        width: 178px;
    }

    .border-none {
        border: none;
    }

    .f5-w {
        width: 100px;
    }

    .f5-w-min {
        width: 60px;
    }

    .fr {
        float: right;
    }

    .flag-hide {
        flex: none;
        height: 20px;
    }
</style>

<style>
    .formula-dialog .el-dialog {
        width: 1280px;
    }
</style>
