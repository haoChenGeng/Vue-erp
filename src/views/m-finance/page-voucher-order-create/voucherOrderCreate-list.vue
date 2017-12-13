<template>
    <div class="voucher-order-create">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            @change="onChange"
            ref="t8tsearch"
            @visible-change="visibleChange"
        >
        </t8t-search>
        <t8t-toolbar
            @AddVoucher="addVoucher"
            :disabledSymbols="toolbarDisabledSymbols"
            v-loading.body.lock="toolbarLoading"
            element-loading-text="加载中"
            ref="list-toolbar"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="tableColumns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            :indexCol="true"
            ref="t8ttable"
        >
        </t8t-table>
    </div>
</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'

    export default {
        name: 'page-voucher-order-create',
        components: {},
        data () {
            return {
                // search表单数据
                payingScreenLoading: false,
                toolbarLoading: false,
                selectPayType: [{'text': 1, 'value': 'sfds'}],
                dealer: parseInt(Cookie.get('t8t-tc-uid')),
                breadcrumbData: [{title: '财务'}, {title: '财务月结'}, {title: '凭证生成'}],
                service: 'F9VrKUFwktqwRQWIMPVHZqYmm_zAw5f', // /biz/t8t-fi-fvg/app
                method: '_HGIy6bvOgD-JcX5S_G62vH84OJ86xGuFfT1k2QcFnW6kmd3mmK4yhc', // views.voucherTemplate.order.queryPage
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                createName: Cookie.get('t8t-tc-username'),
                createBy: Cookie.get('t8t-tc-username'),
                generatedAccountingTime: null,
                organizationId: null,
                createUser: parseInt(Cookie.get('t8t-tc-uid')),
                // 表头描述
                tableColumns: [
                    {prop: 'code', label: '模板编码'},
                    {prop: 'name', label: '模板名称'},
                    {prop: 'organizationName', label: '财务组织'},
                    {prop: 'dataSource', label: '数据来源', list: 'dataSource'},
                    {prop: 'generateStatus', label: '生成状态', list: 'generateStatus'},
                    {
                        prop: 'generatedAccountingTime', label: '已生成会计期间',
                        formatter: function (val) {
                            if(val>0)
                            {
                                var date = new Date(val * 1000)
                                return date.getFullYear() + "-" + (date.getMonth() + 1)
                            }
                        }
                    },
                    {prop: 'voucherCode', label: '凭证单据号'},
                    {prop: 'voucherLog', label: '日志'},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}
                ],
                //搜索表单项配置
                fields: [
                    {type: 'select', label: '财务组织', name: 'organizationId', selectSourceKey: 'organizationId'},
                    {type: 'datepicker', label: '会计期间', name: 'generatedAccountingTime', pickertype: 'month',defaultValue:new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1, 0, 0, 0)}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                toolbarDisabledSymbols:[],
                selectSource: {
                    generateStatus: [
                        {value: 0, text: '未生成'},
                        {value: 1, text: '生成成功'},
                        {value: 2, text: '生成失败'},
                        {value: 3, text: '未生成'}
                    ],
                    dataSource: [
                        {value: 1, text: '库存明细账'},
                        {value: 2, text: '项目成本表'},
                        {value: 3, text: '工长质保金'}
                    ],
                    organizationId: []
                }
            }
        },

        created() {
            this.getOrganizationOptions()
        },
        methods: {
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                commonApi.queryByFunctionCode(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.selectSource.organizationId = list
                        }
                    })
            },
            submitSearch(obj) {
                this.args = {search: obj}
            },
            //凭证生成
            addVoucher(){
              //校验传入的参数
                if (null == this.$refs.t8tsearch.formData.organizationId || null == this.$refs.t8tsearch.formData.generatedAccountingTime
                    || this.$refs.t8tsearch.formData.generatedAccountingTime.length <= 0 || this.$refs.t8tsearch.formData.organizationId.length <= 0) {
                    this.$message.error('财务组织或者会计期间不能为空')
                    return
                }
                this.organizationId = this.$refs.t8tsearch.formData.organizationId
                this.generatedAccountingTime = parseInt(this.$refs.t8tsearch.formData.generatedAccountingTime.getTime() / 1000)
                this.ids = []
                this.checkArray = this.$refs['t8ttable'].getSelectRows()
                let flag=false
                if (this.checkArray.length > 0) {
                    this.checkArray.forEach((item) => {
                      if(item.generateStatus===1&&item.generatedAccountingTime===this.generatedAccountingTime)
                      {
                          this.$message.error('模板编码为'+item.code+'的凭证单据已生成，禁止重新生成！')
                          flag=true
                          return
                      }else {
                          this.ids.push(item.id)
                      }
                    })
                } else {
                    this.$message.error('请先勾选数据后再进行凭证生成操作')
                    return
                }
                if(flag)
                {
                  return false
                }
                let voucherArg = {
                    voucherOrder: {
                        voucherTemplateIds: this.ids,
                        generatedAccountingTime: this.generatedAccountingTime,
                        organizationId: this.organizationId,
                        createName: this.createName,
                        createBy: this.createBy,
                        createUser: this.createUser
                    }
                }

                voucherOrderApi.voucherCreate(voucherArg).then((res) => {
                    if (res.data.status === 200) {
                       let createResponse=res.data.result
                        if(createResponse.fail===0)
                        {
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '生成完成，请查看生成结果',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }else{
                            let success=createResponse.success
                            let firstMessage=""
                            let createRes=createResponse.failResponse
                            if(createRes.length<=0)
                            {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '成功'+success+'条，失败'+createResponse.fail+'条',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }else {
                                createRes.forEach((item) => {
                                    firstMessage=firstMessage+'模板编码：'+item.code+',失败原因：'+item.failReason+'；'
                                })
                                firstMessage = firstMessage.toString().substring(0, firstMessage.toString().length - 1)
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '成功'+success+'条，失败'+createResponse.fail+'条,失败的原因为：'+firstMessage,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }
                    } else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                }).catch((res) => {
                    this.isLoading = false
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '网络超时',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                })
            }
        }
    }
</script>
<style
    lang="css"
    scoped
>
    .img-container {
        display: flex;
        justify-content: center;
    }

    .textarea-container {
        /*margin: 0 30px;*/
        text-align: center;
    }

    ul.payConfirm li {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>
