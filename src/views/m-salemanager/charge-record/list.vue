<!--
 * File: list.vue
 * Comment:扣费记录
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 11:47
 -->
<template>
    <div class="charge-record">
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            @submit="submitSearch"
            :selectSource="selectSource"
            ref="searchBar">
        </t8t-search>
        <div class="warnings">预约成功后，业主号码将保留15天，超过规定时间号码失效</div>
        <t8t-grid
            ref="charge-table"
            :path="path"
            :columns="columns"
            :commonData="selectSource"
            :args="args"
            :indexCol="true"
            :selectCol="false"
            :pageSizes="[5,10,20,50,100]">
            <template scope="scope" slot="recordUrl">
                <span class="play-radio" @click="showPlay(scope.row)" v-if="!(scope.row).showRadio"></span>
                <div class="audio" style="display: flex;height: 32px" v-if="(scope.row).showRadio">
                    <audio controls autoplay>
                        <source :src="scope.row.recordUrl" type="audio/mpeg">
                    </audio>
                </div>
            </template>
        </t8t-grid>
    </div>


</template>

<script>
    import Service from 'src/services/salemanager/stores/Service.js'
    import Utils from 'src/utils/Utils.js'

    export default {
        data() {
            return {
                path: Service.DEDUCTIONRECORD.QUERYPAGE,
                args: {
                    search: {
                        id_gt: 0,
                    },
                    page: 1,
                    size: 20
                },
                selectSource: {
                    select: [],
                    deductionType: [
                        {value: 1, text: '业主呼叫超时扣费'},
                        {value: 2, text: '超时未回拨扣费'},
                        {value: 3, text: '公司呼叫超时扣费'}
                    ]
                },
                fields: [
                    {
                        type: 'select',
                        label: '扣费类型',
                        name: 'deductionType',
                        selectSourceKey: 'deductionType',
                        filterable: true
                    },
                    {
                        type: 'datetime',
                        label: '扣费时间',
                        name: 'times',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte',
                        inputWidth: '200'
                    }
                ],
                columns: [
                    {
                        prop: 'createTime',
                        label: '扣费时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'deductionType',
                        label: '扣费类型',
                        list: 'deductionType'
                    },
                    {
                        prop: 'axbPhone',
                        label: '业主电话'
                    },
                    {
                        prop: 'callTime',
                        label: '通话时长',
                        formatter(val) {
                            return val ? `${val}秒` : ''
                        }
                    },
                    {
                        prop: 'deductionMoney',
                        label: '通话费用',
                        formatter(val) {
                            return val ? `${val}元` : ''

                        }
                    },
                    {
                        prop: 'recordUrl',
                        label: '播放录音'
                    }
                ]
            }
        },
        created() {
        },
        activated() {
            this.$refs['charge-table'].reloadTable()
        },
        methods: {
            showPlay(obj) {
                obj.recordUrl = obj.sourceType ? Utils.getFullURL(obj.recordUrl) : obj.recordUrl
                obj.showRadio = true
            },
            submitSearch(obj) {
                delete obj['times']
                if(obj.createTime_lte) obj.createTime_lte += 24 * 3600 - 1
                this.args = {...this.args, ...{search: obj}}
            }
        }
    }
</script>

<style>
    .charge-record .view .play-radio {
        background: url('./play.png') 100% no-repeat;
        background-size: 100% !important;
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin: 8px;
        cursor: pointer;
    }
    .charge-record .warnings {
        margin: 5px;
        font-size: 14px;
        line-height: 16px;
        margin-left: 20px;
        color: #FF0000;
    }

</style>
