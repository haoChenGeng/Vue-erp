/**
 * Created by tomy.li on 2017/5/3.
 * //仓库模块
 */
let Services = {
    STORAGES: {
        // /biz/t8t-sys-acc/app
        name: 'L29ayPpC3PMWdg8tnQJNjYmuSEjMDZB',
        methods: {
            // 按照用户id获取分配的仓库分组 organization.queryOrganizationForPda
            getRelationStoragesByAccountId: '6qpYf6GYaQS4mIzrd5co3UM36bDW6ZEJrX7U0iPIc1hxXfiz3DN',

            //查询组织架构 organization.query
            organizationQuery: 'a-GBd1krF7w0DBvjMsd4F0orXdF',

            //查询组织详情 organization.findOrgById
            findOrgById: 'n1EjEy1fY2s_QBnicLnD5DoAup7FqQi3fyx'
        }
    },
     INVORGS: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
             //仓库分组分页查询 inventory.organization.queryPage
            orgQueryPage:'9C7rcd65dU6JnNd4kGqUpR_6QCAqFOtANDv9BpD85kG8d1j',
             //仓库分组不分页查询 inventory.organization.query
            orgQuery:'ObB7LfrK0M3VLALaE6xboHiffuTm4lgbkAxRdd0QS0F',
            //仓库不分页查询  inventory.storage.query
            storageQuery:'isWQivU5v8S4WStoLiUSpvTu31ya5h.swBH',
            //商品库存查询 inventory.goodsRecord.queryList
            goodsRecordList:'7EesjOInTJa7X_HMS-V-UCZCYNloSCuZjp6GdscyzGhQt1y',
            //货位查询  inventory.storageBin.query
            storageBinQuery:'99rdBMsbQptsCPGZfPbDEAo8qQJfjOG7dIcEgJ0',
            //inventory.status.query 查询库存状态
            statusQuery:"hcULftT8j8fAoEUOShvgp8iNO30wd6yjmHd"
        }
    },
}

export default Services
