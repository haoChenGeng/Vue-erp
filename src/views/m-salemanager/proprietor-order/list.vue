<!--
 * File: list.vue
 * Comment:业主预约
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 16:17
 -->
<template>
    <div class="proprietor-template">
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            @submit="submitSearch"
            :selectSource="selectSource"
            ref="searchBar">

        </t8t-search>
        <div class="warnings">
          <p>注：来自土巴兔平台的业主电话是虚拟小号，会按店铺宝合同进行收费；来自商家小程序的业主电话是业主的真实号码，不会进行收费，土巴兔也不会提供给其他装修公司。</p>
          <p>虚拟小号如果发现打不通的情况，可以再次点击“查看”按钮获取新号码。</p>
        </div>

        <t8t-grid
            :columns="columns"
            :path="path"
            :args="args"
            :commonData="selectSource"
            :indexCol="true"
            :selectCol="false"
            ref="orderTable"
            :pageSizes="[5,10,20,50,100]">
            <template scope="scope" slot="axbPhone">
                {{scope.row.axbPhone}}
              <el-button v-if="!scope.row.axbPhone" class="view-phone"
                         @click="viewPhone(scope.row)" :disabled="scope.row.loading">查看</el-button>
            </template>
            <template scope="scope" slot="appointmentCount">
                <a style="color:blue;cursor:pointer"
                   @click="viewAppointments(scope.row)">{{scope.row.appointmentCount}}</a>
            </template>
        </t8t-grid>
        <!--<el-dialog title="查看电话" class="g-w-460 sales-promotion-dialog" v-model="showDialog" @close="closeDialog">-->
            <!--<div class="owerphones">-->
                <!--<label>业主电话：<span>{{phone}}</span></label>-->
                <!--<p class="warnings">温馨提示：此号码经过转译，并非业主真实号码</p>-->
            <!--</div>-->
            <!--<div slot="footer">-->
                <!--<div class="grid-content">-->
                    <!--<el-button size="small" @click="closeDialog">关闭</el-button>-->
                <!--</div>-->
            <!--</div>-->
        <!--</el-dialog>-->

        <el-dialog title="预约详情" class="g-w-460 sales-proprietor-dialog" size="large" v-model="showDetailDialog" @close="closeDialog">
            <div style="display: flex;height: 300px">
                <t8t-grid
                    :path="detailPath"
                    :args="detailArgs"
                    :indexCol="true"
                    :selectCol="false"
                    ref="detailTable"
                    :columns="tcolumns"
                    :commonData="selectSource"
                >
                </t8t-grid>
            </div>
        </el-dialog>
    </div>


</template>

<script>
    import Service from 'src/services/salemanager/stores/Service.js'
    import Api from 'src/services/salemanager/stores/storeApi.js'

    export default {
      data() {
            return {
                tcolumns: [
                    {
                        prop: 'appointmentTime',
                        label: '预约时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'sourceType',
                        label: '预约渠道',
                        list: 'sourceType'
                    },
                    {
                        prop: 'appointmentType',
                        label: '预约类型',
                        list: 'appointmentType'
                    }
                ],
                showDialog: false,
                showDetailDialog: false,
                phone: '',
                detailPath: Service.OWNERAPPOINTMENT.DETAIL,
                detailArgs: {
                    search: {
                        phoneId: 0
                    },
                    page: 1,
                    size: 20
                },
                path: Service.OWNERAPPOINTMENT.QUERYPAGE,
                args: {
                    search: {
                        id_gt: 0
                    },
                    page: 1,
                    size: 20
                },
                selectSource: {
                    appointmentType: [
                        {value: 1, text: '免费预约'},
                        {value: 2, text: '业主来电'},
                        {value: 3, text: '优惠券'},
                        {value: 4, text: '促销'},
                        {value: 5, text: '为我报价'}
                    ],
                    sourceType: [
                      {value: 0, text: '土巴兔平台'},
                      {value: 1, text: '商家小程序'}
                    ]
                },
                fields: [
                    {
                        type: 'select',
                        label: '预约类型',
                        name: 'appointmentType',
                        selectSourceKey: 'appointmentType',
                        filterable: true
                    },
                    {
                        type: 'datetime',
                        label: '预约时间',
                        name: 'times',
                        pickertype: 'daterange',
                        startField: 'beginTime',
                        endField: 'endTime'
                    }
                ],
                columns: [
                    {
                        prop: 'appointmentTime',
                        label: '预约时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'sourceType',
                        label: '预约渠道',
                        list: 'sourceType'
                    },
                    {
                        prop: 'appointmentType',
                        label: '预约类型',
                        list: 'appointmentType'
                    },
                    {
                        prop: 'appointmentCount',
                        label: '预约次数'
                    },
                    {
                        prop: 'ownerName',
                        label: '业主称呼'
                    },
                    {
                        prop: 'axbPhone',
                        label: '业主电话'
                    }
                ]
            }
        },
        created() {
        },
        activated() {
            this.$refs.orderTable.reloadTable()
        },
        methods: {
            viewPhone(row) {
                this.$set(row, 'loading', true)
                Api.OWNERAPPOINTMENT.getPhone({appointmentId: row.id}).then(res => {
                    row.loading = false
                    if (res.data.status === 200) {
                        if (res.data.result.code) {
                            this.$message.success('操作成功')
                            row.axbPhone = res.data.result.info
                        } else {
                            this.$message.error(res.data.result.info || '电话获取失败')
                        }
                    } else {
                        this.$message.error(res.data.error || res.data.message || '电话获取失败')
                        return
                    }
                }).catch(_ => {
                    row.loading = false
                    this.$message.error('电话获取失败')
                })
            },
            closeDialog() {
                this.phone = ''
                this.showDialog = false
            },
            viewAppointments(row) {
                if (!row.phoneId) {
                    this.$message.error('电话ID获取异常')
                    return
                }
                this.detailArgs = {...this.detailArgs, ...{search: {phoneId: row.phoneId}}}
                this.showDetailDialog = true
            },
            submitSearch(obj) {
                delete obj['times']
                if(obj.endTime) obj.endTime += 24 * 3600 - 1
                this.args = {...this.args, ...{search: obj}}
            }
        }
    }
</script>

<style scoped>
    .proprietor-template .view-phone {
        color: #00a0e9;
        cursor: pointer;
        border: none;
        background: none;
        /* height: 4px; */
        font-size: 12px;
    }

    .proprietor-template .view-phone.is-disabled:hover{
      background: none;
    }

    .proprietor-template .owerphones {
        font-size: 16px;
        text-align: center;
    }

    .proprietor-template .owerphones .warnings {
        color: #FF0000;
    }
    .proprietor-template .warnings {
        margin: 5px;
        font-size: 14px;
        line-height: 18px;
        margin-left: 20px;
        color: #FF0000;
    }
    .proprietor-template .warnings p{
      margin: 0;
    }

</style>
