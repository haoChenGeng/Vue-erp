/**
 * Created by tomy.li on 2017/4/27.
 * 采购相关配置
 */
let Services = {

    //采购退货出库
    PomRefundOut: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //退货订单列表综合查询 pom.refund.queryOrderForOut
            LIST: 'YPL2ZwTP2WghslKCdvmRPuniGAiQmvsKy7-bAT9',

            //退货出库单详情  inv.refundout.item.queryListForUI
            ITEMLIST: 'O9rqxOt9H7fIoA3Hho_1edE4JTyLnXRKDgEq9YVQpNWOZ7w',

            //退货出库单单表查询 inv.refundout.order.queryPage
            searchOrder: 'fQ_DReSynvd8T_J_W5aD0WserTrahG_lejsXhLaQAZ6',

            //前端查询库存和暂存的出库记录 inv.refundout.record.queryStorageRecordForUI
            storageRecord: 'GFA2gLoDKkbkOYF0A7gWwjdDT3vdnPwZQ_RKlQMLwocVAdmVlXgUh1SPR2g__O9',

            //查询退货出库成功的具体数据 view.inv.refundout.record.queryListForUI
            storageRecordHis: 'jq438yEQ9BxtrAjsY-guAqtJsJd-d7eJP5fFR01dbEwr3G7zLnMuJQbVoDY',

            //根据仓库分组查询出库仓库 inventory.storage.queryStorageForOut
            storageForOut: 'n3IRo3ZQ4CiwHZGq-7QLpu6Fv993xCnAzh8jHSx2qGgBMTzTy_u',

            //更新出库单记录包括新增、更新、删除 inv.refundout.record.updates
            updateRecord: 'fZ5p8n5sIoY1NFs5hJf4z3cWAgcWXdea8IYXGVpjvFD',

            //确认出库 inv.refundout.order.confirm
            confirm: 'phIEsFWEzGiQ7TdP87ha-ZnU1fG6vY96DbIn3jL',

            //打印 invoice.invRefundOutOrder.print
            print: 'K0RZU7nE_2wjHISKC452Jl5GvvO2ts6QvSHTwpP8WVM9egx',

        }
    },

    InventoryStorage: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //inventory.storage.queryPage
            inventoryStorageQueryPage: 'ydLPwvNK06afNfsjS4uwQe5gItF1rr-f45kdsh4',
            //inventory.storage.query
            inventoryStorageQuery: 'jaMJ0wQK2Qfw_U-SG8fPkqdJnJ2urAt19qJ',
            //views.inventory.storage.search
            inventoryStorageSearch: 'D8HFzIiE6ncd66NV_L8axfhJtKsNafBqZ7PAK2FwOz-'
        }
    },

    Goods: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //goods.queryPageGoodsUnion
            goodsQueryPage: 'GQmaI1lf4z1CBJE-wtTx0KSrfoeHg-x3TBc45dZ',
            //goods.queryGoodsList
            goodsQueryList: '5JhDA9Vs9C7mCvM91t_EfEvYCNqXftm',
        }
    },

    InventoryOrganization: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // pom.refund.queryOrderForOut  退货订单列表查询
            QUERYPAGE: 'YPL2ZwTP2WghslKCdvmRPuniGAiQmvsKy7-bAT9',
        }
    },
    DirectOrder:{
         // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods:{
        //views.direct.order.report
          excelExport:'FaKZZwym-_zOoNO3iv0diaNrJuENBKVvzmVvq7p',
          directOrderReportOrder:'ITNQFg3ZCVg6Iy66cPvQUdQGuAa0R8S27r8BxlWDdAf8R9ZGiyOoNiIG_sq',//views.direct.order.directOrderReportOrder
        }

    }
}

export default Services

