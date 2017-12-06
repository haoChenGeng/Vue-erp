let Services = {

    INVCOLLECTION: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //仓库分组查询 inventory.organization.queryPage
            INVORGLIST:'9C7rcd65dU6JnNd4kGqUpR_6QCAqFOtANDv9BpD85kG8d1j',
            //商品信息 goods.queryPage
            GOODSLIST:'e8zkQ-GO0niNdWxpsKSQjqd',
            //品牌 sys.brand.queryPage
            BRANDQUERY: 'qxe5RyC6eh-vY0QBmeXHO_bLtlJIG0G',


            /////////////////////////////////////////////////////////////

            //上架及时率报表 views.inv.report.instorageGroundTotalReport
            UPSHELFCOLLECT:'ipqtj9PhjdDB-f-b3m9I3gHBvhqA9iBUURrLRTxC4guXaeqaolQ8dR8H6poFhDF',
            //上架明细报表 views.inv.report.instorageGroundDetailReport
            UPSHELFDETAIL:'hfpXtl3AfgL7-QnJyqf7u0g0Bxbb-6Q5RmZ2aKRX_4NuZENIXWc9e2SZcEkNpTy',

            //拣货及时率报表 views.sales.reportform.pickTimelyTotal
            PICKCOLLECT:'E_9QJmqG8WHEf1WHCoJ0OCX0P0gIWlaECjeFyoD9zMGxBdoFuldIAer',
            //拣货明细报表 views.sales.reportform.pickTimelyDetail
            PICKDETAIL:'CfLGUnFjOvR4ROH_jPReILVUdqrJfykUFelKJCe38Km_3opK7HtL7ac',

            //全国库存报表 views.inv.report.record
            REPORTRECORD: '-2128Fb-52eVw1s71tiNTtSKRnlAdOx8Lvl',
            //库存记录查询  views.inv.storage.record.queryPageForUI
            QUERYPAGEFORUI:'XddOZtBpBAq1eGf2vCeDbQu9qSbQKFzxfDQAcARD0wMnvBdOPAZYNQB',
           //仓库信息查询  inventory.storage.queryPage
           STORAGEQUERYPAGE:'32ll6DtRQjZ7W4vI0AVHjp-5iDPJLyaIZC95J-R',
           //重新取价  views.inv.storage.record.getPriceAgain
           GETPRICEAGAIN:'lqB-wSlBgxhAMl_Wz9jKSpdStB3_op2-f-PjvmtwOJ22vgAppj8hsSY',
           //库存记录查询导出  views.inv.storage.record.export
           RECORDEXPORT:'j327iT-OHsc9NR-TOiMiJnqHqzjou1h7gqisFv_xfDDuWFH',
           //库存记录查询  来源单据类型   views.inv.storage.record.getSourceOrderTypes
           GETSOURCEORDERTYPES:'QGXT8rrPHLqk9Z9pQc5r-U5oCNQF2QRQo3W9WSDR6APPFoX41qnK0HkF8DkOKsy'

        }
    },

    SALES_REPORT:{
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // 销售订单进度查询报表 views.sales.order.report
            report:"4DU_6n1WKTzKIxqH0oy_2GiLMP-9e4aglnj"
        }
    }

}

export default Services

