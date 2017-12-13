// 供应链管理模块
let Services = {
    allocate: {
        // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //views.inv.allocate.queryPageOrder   调拨单列表查询
            queryList: 'tH26xWlyAvmhXxFrR-slz5om5qNXKp_qfzsqGK_E8NTqbpR',
            //views.inv.allocate.createSave   调拨单新增暂存
            createSave:'OIdvHBXN9i8OeYCd0fD79uU6PzJrXBUR7nrQEABUXFi',
            //views.inv.allocate.createSubmit  调拨单新增提交
            createSubmit:'BHHErFcaSrzHaIsKUP_iOH55wzZ2xD23XV9kLwZ03ZK_fOO',
            //views.inv.allocate.submitOrder 列表页调拨单批量提交接口
            submitOrder:'YrevqyYmTfxvGzA1pQe82edQbyGzFuh7eukq_GAj_Q3',
            //views.inv.allocate.cancelOrder  批量调拨单整单取消
            cancelOrder:'e837u.HuhzvpKKarHCxzJUkupn2b7S2u3h0gGTKcdWI',
            //views.inv.storage.findManagerByGroupId    查询仓库分组下面非禁用已生效得首个收货仓库信息
            findManagerByGroupId:"NWDRFj6LHzSUn8D8iLjlkRJUAWFUCb2fmS3VzXFBy5y8AFeJUCNtHBc",
            //views.inv.allocate.findOrder  根据id查看单详情信息
            findOrderById:"B7IOFLwCDtOJfJYUV_jYeHt66NfKtSy7kj_555JuBkV",
            //views.inv.allocate.updateSaving  调拨单更新暂存
            updateSaving:"iLUnSe68aXUq38kJYHBsRGZ-mOXBtX3GlXZ5pNYVTcAbdBD",
            //views.inv.allocate.updateSubmit  调拨单更新提交
            updateSubmit:"jFTNLEijb0_ni39eFHhlLF_3M2-CKC0xgwumAShzOdWFmnr",
            //views.inv.allocate.cancelItem  调拨单取消行
            cancelItems:"3_wx8PYG2eFBpAOZ0l5OJ9xidEjVyl9jyYD1Nt-hiOZ",
            //views.inv.allocate.completeWorkFlow  审核提交  
            completeWorkFlow:"XLPaXRaHjANsuGg5_n-0q4d9MDZuhCVSK5nTLMI5x3XPmNPWsC3",
            //views.inv.allcoate.getWkfCheckStream   审批流查看  
            showFlow:"-7K4_afP7_bZe8b97oyoQ0t8kHu5-GGnA-v6eI77uUA5KzVs3mW",
            //views.inv.allocate.deleteOrder  暂存单据删除
            deleteOrder:'MslWO3RhZYr4SrEubFf7SyeXCWLrEkd49X7eT_yYEE4',
            //views.inv.allocate.start 列表批量启动
            start:"F335-YyADshdv4oQtngmLpplGsNfduS_wY-",
            //views.inv.allocate.singleStart  详情单个启动
            singleStart:"RLaLYqCSU-xquZ6kPseiX9M3g-dxjDejRPMKFBo-89Z",
            //views.inv.allocate.queryPageAcceptance  调拨单验收列表
            queryPageAcceptance:"GkjSJhKawbIQ4iHlvWVDoMWV-R1lx2TW11TwvhW_uhWjBabyGoQXiQ_",
            //views.allocate.acceptance.queryDetail  调拨验收
            queryAcceptanceDetail:"LERV5Tw-I1OybZK7m2960uc2C9_1JbR0AmSJ7VOLwDQKEtBPgiFFtvw",
            //acceptance.item.update 验收
            acceptanceUpdate:"UZc8VIYwzWItVbB_dhLUuYRWHfa1EyiLEyC",
            //views.inv.allocate.cancelPick 撤销拣货
            cancelPick:'9HxC5Pp50hRUU0e41Q9HVD5WjuBjDY7m-rupeNDiAMh'

        }
    },
    pickOrder:{
        // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //views.inv.pick.allocate.queryPickOrders  条件查询调拨单拣货单
            queryPickOrders:"ddmonkr1U29ZI4mTnDtb5wuYZzzP-VgPFE2cZZofrlQdYUfb_IWYHRz",
            //views.inv.pick.allocate.orders.cancel  撤销拣货
            cancel:"_42EBMduPre7KGy5j6AWSQqnQQBYuyCFXkVtZaM59rFcFxH9HeKsQnS",
            //views.inv.pick.allocate.orders.confirmPick  确认下架,列表批量操作
            confirmPick:"BZedAvsxeMK4pFaBaibNoeSLPpPQb9R_24kOY7ZLJtmEewkAWJLMKrD7ICd",
            //views.inv.pick.queryShelvesDetail  查询下架明细
            queryShelvesDetail:"ZmRjnYzKudR81Nn9lWkqqHVXgYllWVJUudiRvx_E1RfWYgo",
            //views.inv.pick.allocate.confirmPick  确认下架，详情单个操作
            confirmPickOrder:"Da6hbGtEjDMvwDQpO9sWUUMzSnVRuCKT8OmBeiTPOLmXLqfQrV2",
            //views.invoice.pickOrder.allocate.print  调拨拣货单打印
            print:"VLfeErGSMQUtoStbeN2zoX_QGXSHxtWTL6lPMsg_wFGX_7iWr7jPZH3"


        }

    },
    outStorage:{
         // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //views.inv.outstorage.allocate.order.check   出库单确认复核
            check:"A2LMvJrVvkmOdeKkU9Yd4XrdwzrV7DorY__dsTBuW3-Beb24-d-td0J_VMR",
            //views.inv.outstorage.allocate.order.check.cancel  取消复核
            cancel:"egmUK4LcYE0YlJp5hd1I1V44Oa1CsGRngqey5hLBLVocm2lYFGcTlfoUiscT3_vHjWr",
            //views.inv.outstorage.allocate.orders.delivery 确认出库
            delivery:"optxmrD5SeF9QdHBzo7Q_e_VJqNtfmgi4xSAZsRJfxjDSYQiB7XtXWclSwqciMB",
            //views.inv.outstorage.allocate.orders.delay 撤销出库
            delay:"duSSne27v7JZ45OS6hfC70HkLiYlVdbV0vHz5jY0UaI5KjIYh42KpURYyH0",
            //views.inv.outstorage.allocate.queryPageOrder  复核出库列表
            queryPageOrder:"UNggEqvpJ_xNgrAOIksC9zrCyEIMZPTP9mhDdEGTsLVXS8Y_iKH_LSN6uua_Ov7",
            //views.inv.outstorage.allocate.items.deliveryNum.update  调整出库数量(已复核的出库单行才能修改) 
            updateDeliveryNum:"1VSA4R6eC9eglkOZSFu6MKkk8zkEW_9ogFDSqJEzsdxHys_JH0VA1uU20BMJ_U74xOcN_oLHw5B",
            //views.inv.outstorage.allocate.queryOrderDetail  出库单明细查询
            queryOrderDetail:"gYrqRqPyOgApQZE_rPP_3N9OVM5YiidQkxO9XTl4XgicJWYfrZZjZWYjuDtPJ3vg0zD",
            //views.invoice.allocateOutStorage.print  出库单打印
            print:"QplULm79rYFa-mb2nVaR-UeGgdcnCydZt1dH_1a8i8kZlCyNEHtgXQA"

        }
        
    }


}

export default Services
