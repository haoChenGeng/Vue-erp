// 供应链管理模块
let Services = {
    shop: {
        // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //shop.query
            queryList: 'lRB4t7OSR93xBO_wNZ6'
        }
    },
    send:{
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods:{
            //views.purchase.send.order.queryPageOfOutItem
            queryPageOfOutItem: 'cldmYlHmHFvWxTxMKbchRtbuWpH9xaanQgXNzxITUxWW8PUuAPNaj4wI-lfWVz4',
            //views.purchase.send.order.queryPageOfOut
            queryPageOfOut: 'OTQA4xQ4W_52vdyR7LEQ9fJhwJyuhMLA8_38jZ3_GfJwc6Fey-zIPXQ3qoa',
        }
    },
    org:{
          // /biz/t8t-sys-acc/app
        name: 'PQ7MA37RKUMX182N4Ldrany1U61bWrG',
        methods:{
            //views.org.queryAvl
            queryAvl:'UbZpUqAmT6tMwDqH9edQwnFLd-j',
            //organization.queryTemp
            queryTemp:'8IcJs9POFGucC9d_gwIaWqqrN8c6U8fpxoo',
            //org.queryRootId
            queryRootId:'l-Z3FzSjDVnYJiR1MpsjPwu'
        }
       
    },
    inventory: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //inventory.organization.query
            orgQuery: '5yaWq6FU5XsYbycWg96GgN24JyBSFN7FYBRp15Wurfc',
            //仓库分组查询 inventory.organization.queryPage
            orgQueryPage:'9C7rcd65dU6JnNd4kGqUpR_6QCAqFOtANDv9BpD85kG8d1j',
        }
    },
}

export default Services
