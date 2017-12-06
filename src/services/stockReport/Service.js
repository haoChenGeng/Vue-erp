// 缺货报表相关配置
let Services = {

    OrgOrderGoods: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // sales.order.reportformByOrgOrderGoods
            LIST: 'WDLnnsfE8kkuOqghT2Uujqo9ECheL7SZPAdCRFfbFDxfSXPTEGbh2HK',

        }
    },

    OrgGoods: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // sales.order.reportformByOrgGoods
            //LIST: 'FkxXY9F5oI32RWTAmaS-ZJj0zyHT3fbB22PvZBl9fmdFyLu',

            //sales.order.reportfrom
            LIST:'X62ndXJrZyNQCaDMfNSQrfoE4ZkGttcWUsB',

        }
    },

    //库存分组查询
    InventoryOrganization : {
        ///biz/supply-chain/app.supply-server
        name:'yAW-RC36YR2iK4mi70tzS3sieRIwyfJWwVA3eIB6oA7hwiO01hL',
        methods:{
            //inventory.organization.queryPage
            QUERYPAGE:'-dNBrlKCoQ7CxTrH2OC9xARfetRPZkfbx5igVZnqNEYhrg0'
        }
    }
}

export default Services
