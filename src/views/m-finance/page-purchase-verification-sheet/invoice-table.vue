<template>
    <t8t-table
        ref="t8tTable"
        :columns="columns"
        :dataSource="dataSource"
        :templateData="templateData"
        :selectCol="true"
        :indexCol="true"
        :editable="editable"
        :pageBar="false"
    >
    </t8t-table>
</template>
<script>
    import Cookie from 'js-cookie';
    import * as Config from './config'
    export default {
        name: 'invoice-table',
        created(){

        },
        data() {
            return {
                templateData: {
                    goodsCode:null,
                    goodsName:null,
                    goodsId:null,
                    baseUnitId:39,
                    baseUnitName:null,
                    taxRate:0.00,
                    invoiceCount:0,
                    taxPrice:0.00,
                    noTaxAmount:0.00,
                    noTaxPrice:0.00,
                    taxDiff:0.00,
                    taxAmount:0.00,
                    createUser: parseInt(Cookie.get('t8t-tc-uid'))
                }
            }
        },

        props: {
            columns:Array,
            dataSource:Array,
            editable: {
                type: Boolean,
                default: false
            },
        },

        methods:{


        }
    }


</script>
