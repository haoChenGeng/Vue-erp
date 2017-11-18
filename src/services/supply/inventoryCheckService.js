let Services = {

    CHECK: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            //仓库查询 inventory.storage.query
            storageQuery:'oRwCkczBRxRyTuV5UDRvUtAg5iRibWe3vdI',
            // views.inventory.storage.queryStorageByOrganizationAndType
            queryStorageByOrganizationAndType:"UccZQuRgOXsoQKD6SiARwBeBnS87VapGlQhebclvcJU6wRpdIRmDZcDmsUqjdbxMKIuNq60NdFekOKt",
            //货位查询 inventory.storageBin.query
            storageBinQuery:'dD7zVCn1ZoK4LpQxfInaMkG4S-GE5sNYSUleqht',
            //分页查询商品分组 sys.group.queryPage
            //groupQueryPage :'2FxRWaItVrHz7qzhD3mnTiSUj27gj.Q',
            //盘点单列表 views.inventoryCheck.queryPage
            inventoryCheckQueryPage: '0S372jRexzZ-MznS4yrMkPQhMyryIvHfcr_tApntc02',
            //盘点单导出 views.inventoryCheck.queryExport
            inventoryCheckQueryExport: 'qwkltEJbsWpDAUlE0l3HGa1h1lFqqvzhfgryelPeFO5bngN',
            //盘点单删除 views.inventoryCheck.deleteByIds
            inventoryCheckDeleteByIds: 'KQTgXxHrVCzySOyhWi3m6kcfSxppFArRlRQ-eg7VSzHCG_6',
            //盘点单新增 views.inventoryCheck.create
            inventoryCheckCreate: 'CdOeWe0m__iec99xMrRqDeHfae_ekTbBgxJ_PIb',
            //获取商品信息 views.inventoryCheck.findGoodsRecord
            inventoryCheckFindGoodsRecord: 'uJJ5ENyXBpZcA2cVCddi7Kza1MucVVsGLV5Tn-WBKiW4685Bgw3',
            //盘点单详情页 views.inventoryCheck.findCheckOrderDataById
            inventoryCheckFindCheckOrderDataById: 'yA-5k9iF0dNJipMMq1QiOqkP1seMDIg643sXlCyviFsVLQqvujLsqa0j__iyVaZ',
            //盘点单编辑暂存 views.inventoryCheck.tempSubmit
            inventoryCheckTemp: 'ZyePcak13VPMkrCQytVuC1IgYiWhTjTxKWW-vGvPfxhH39-',
            //盘点单提交 views.inventoryCheck.submit
            inventoryCheckSubmit: 'fnzvsZ9blmcF-ily3-AlzPDdAoheFj6iDdrqPv-',
            //盘点单打印 views.inventoryCheck.printCheckOrder
            printCheckOrder: 'swxdZGJGT4UhEDjPAsSHDDIaCZhn92onSWzUuJ6mAktms5BgQP9',
            //盘点单导出 views.inventoryCheck.queryExport
            queryExport: 'YZIcMAqGhO6vta_IwoVqu0DtIILwfiAL5LOeLZ_Rs8iTOzz',
            //盘点单取消 views.inventoryCheck.cancelCheckOrder
            inventoryCheckCancelCheckOrder: 'crXXfqN-1K9Uc99bH58NnI4VoTnL3zee6MwJ2deA1gqKovCdtBrgnCx',
            //盘点单列表页提交 views.inventoryCheck.batchSubmit
            inventoryCheckBatchSubmit: 'c3nnbJZspV3DtIrFzwKJ4h4jjq6Dq9XkSItCagowWI-cZOS',
            //盘点单初盘列表 views.inventoryCheck.findFirstCheckItemByCheckId //views.inventoryCheck.findFirstCheckItemById
            findFirstCheckItemById: 'lraZQAPgcH8pgZ98e7PBVrVYh5ewKpYm1cIhsgt-V5FqUubov6g5cwUvoHgOaYOnsun',
            //盘点单-初盘保存 views.inventoryCheck.tempSubmitFirstCheckForm
            tempSubmitFirstCheckForm: 'bkadEfIrU3U0zEM3JpEeG3OrZMAypobBSYSDCe_jznS8ARYkHyLzMbWrWFtY1Hi',
            //盘点单-初盘提交 views.inventoryCheck.submitFirstCheckForm
            submitFirstCheckForm: 'GS9QKNkZ0WBkby9mdHNwi8OcMSuOXIDHi67CDOgnNOe0i-ZyxvOFZyWJPgW',
            //盘点单复盘列表 views.inventoryCheck.findSecondCheckItemByCheckId //views.inventoryCheck.findSecondCheckItemById
            findSecondCheckItemById: 'v8-ri8Ty0cU9spB4iSdLmPnqd9wIfBsBsNRszKPEyKStganxt7ek4j2xYQUkI3-e7yQdaGb',
            //盘点单-复盘保存 views.inventoryCheck.tempSubmitSecondCheckForm
            tempSubmitSecondCheckForm: '0emegb44tUD2vHP6sFk26QvcjZiroKDAObVGFfFT2pWALmE13bW97hUaO3Y-n9rWOBs',
            //盘点单-复盘提交 views.inventoryCheck.submitSecondCheckForm
            submitSecondCheckForm: 'qyubjCB7mUiyvPc98gvAG2c_Xrjr56owOYhat5Mtivks_vFDtxRvjMf_KOl',

            //盘点损益单列表 views.inventoryCheck.queryPageWithProfitLoss
            queryPageWithProfitLoss: 'aPjjXl4uGV4uZUmv1WyJ250ffGisabWNlaUgLTWtaOT0fiGFtxauZnmK_sqc01-',
            //盘点损益单明细 views.inventoryCheckItem.queryPage
            inventoryCheckItemQueryPage: 'syJBpVY674FY0iXQpHYbIca9x2C5dq_zS3IXFhDpmYF4iRFlchi',
            //盘点损益单提交 views.inventoryCheck.beginWorkFlow
            // beginWorkFlow: 'itFushAAhgaCsBRNBoPL-R-X_ophqf0cZgfRetLi_Oyat14RjGE',
            //盘点损益单审核 views.inventoryCheck.completeWorkFlow
            completeWorkFlow: '3BDTNLm5IC1_lQH-hbCljTtkJTHjGWBiXbEuYMLgv0Jf3a-AZYJKuoB',
            //盘点损益单根据流程id获取盘点损益单数据 views.inventoryProfitLoss.findProfitLossAndItem
            findProfitLossAndItem: 'o0urpvS6SQEFSN3CrOkyUEiQP7RsxsNRRMsT7wvVhEydNVnfydueV2qlrOpkPz9fisG',
            //盘点损益单工作流 views.inventoryCheck.getWkfCheckStream
            getWkfCheckStream: 'DJKXDZuo8OdwaPPxW9x9fzbTL6YmQRpt5qOuPIKqHI97oT1_BrdP6q5',
            //盘点损益单打印 views.inventoryCheck.printProfitLossOrder
            printProfitLossOrder: 'u8m5fnEf7FskKFur3EdLeKm31nlJ5AqYY-wlhSw7Ox8brTZuEfBkGe5XnKU',
            //盘点损益单确认调账 views.inventoryCheck.confirmDiff
            confirmDiff: 'AGVI_seqbNFrU3EaS5XrcwmEHNUZhHorbMHH0DQ720JJJ61',
            //盘点损益单导出 views.inventoryCheck.profitAndLossExport
            profitAndLossExport: 'x766FhIs_KDFqOWu-hWDbbNlL2NpW9XwcpEBOHc0oN5oblE8F-MxmSaFiok',
            //盘点损益单明细保存 views.inventoryProfitLoss.tempSubmitProfitLossOrder
            tempSubmitProfitLossOrder: 'UsuxS_ZmnMu8Oez4QuVwaQVkhzdBJ7DSoksf9pQis2dDKqoOyqJN-3jTqarf9D8opF_RTLn',
            //盘点损益单单个提交 views.inventoryProfitLoss.submitProfitLossOrder
            submitProfitLossOrder: 'cl3wZA-LAqfGDXQExtIV4TZUril3EcTGKxW92FuiIssiNZb4NvnkPGm0fEf2I2kTVR_',
            //盘点损益单批量提交 views.inventoryProfitLoss.batchSubmitProfitLossOrder
            batchSubmitProfitLossOrder: 'mAD_zQl40c_TTieA-kTjCuljFy_vOZgIa8k5Dr0xa94fjOxwPv3iK6iAiF3NLN2NemomAX_5pIH',
            //盘点单审核提交责任人 索赔数量 views.inventoryProfitLossItem.updateItems
            updateItems:'WlgPYkMaazVn2YFIzwYl3yTCzqGmR0S09yLuhxHEttYB8RYDRkAXOQUVTJu',

            //附件列表 views.InvProfitLossOrderAccessory.queryPage
            accessoryQueryPage: 'phgfoCF1aAQwJ_hMMQ5hxsAOB3-ntE6T9e_VdXrkeZuWxUEEuNvQgW-bQNygc77',
            //附件上传 views.InvProfitLossOrderAccessory.create
            accessoryCreate: 'TGXWNsBkFw4rpLq-h-HIqz4ujRpzl74IpzL_I66DTNo5uAcAUyLJd8XOClh',
            //附件删除 views.InvProfitLossOrderAccessory.delete
            accessoryDelete: '7DCyFqTbNnu4XTyqr_qEHSvTdA4DcO7kyQz4d035BrPoXWVaFtH5jzX7gRe',
        },
    },
    SAFE_STOCK:{
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // 分页查询，导出
            page:"6CJy4VwUK3Cn4Z0x_6zzwu5qK-4WVPpkkuz",
            // 导入
            importData:"IgVTJLi8ZS0E6oOSFKQTSR-X2rPFikjZCCyHk_6",
            // 删除
            deleteData:"zLMIGgtQtMBKhyIvyGwH_pCtgMDTb5v-UM-eo5X"
        }
    },
    GOODSTYPE: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // 新增分类 views.mdmGoodsType.create
            create: "LYDC6p3bKBuy6ZwgKnM2x-CQ1eC9R6h1_xTD6dd",
            // 分类列表页 views.mdmGoodsType.queryPage
            queryPage: "r4x4wBLyAZmR_bwFOt4oDgiwjU4VmXzpXbDjXD2VjOS",
            // 修改分类 views.mdmGoodsType.update
            update: "yu781Qo0wpp5CoNV6IidpwpmtY9kDbFseaLwoZJ",
            // 启用 views.mdmGoodsType.typeEnable
            typeEnable: "Ugxsi8Vjoaa2VDK8li7_ULYjIqQwGGgPeJoz3SuTNL6",
            // 反启用 views.mdmGoodsType.typeDisable
            typeDisable: "40ExoVtwxHk3e7dTG6Hnnmvs2NwpIqC9TjQ3gYv4_Mz",
            // 分类树删除节点 views.mdmGoodsTree.deleteById
            deleteByIdTree: "TeIaTcDkBlH1kGbkhPz5zKUJKbwdHLMqMp-77vEp8G4",
            // 分类树查询节点列表 views.mdmGoodsTree.searchTree
            searchTree: "qIe1G6EeAA6eJ2aiP4jjch-22CY5fK8klI-qrxR1lhi",
            // 分类树修改节点 views.mdmGoodsTree.update
            updateTree: "0RIIyNMwWu97Ag1KGiZ-y2rHJ46hL9DAwYYt1ql",
            // 分类树新增节点 views.mdmGoodsTree.create
            createTree: "serxsDbpSgYoKyHrfQTVjUshg0X1IpjdXAtVa83",
            // 商品分类管理-复制商品 views.mdmGoodsType.typeCopy
            typeCopy: "GiFlkW.uMlYA-lN2C9pXGM9aXAeCnI2GzN_b373",
        }
    },
    //商品分类管理-获取商品
    GOODSRELATE: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
            // 商品分类管理-商品列表 views.mdmGoodsRelate.queryPage
            queryPage: "7SANL-TmYE-uuZsSsKMFk6wFxZP5g-XE0BA4WA81D7R",
            // 商品分类管理-新增商品 views.mdmGoodsRelate.create
            create: "H-R9HRjQaKF6G4hpfYzx58xCJL3dAdHgHiMDD6_",
            // 商品分类管理-删除商品 views.mdmGoodsRelate.deleteByIds
            deleteByIds: "LR87EgyYBC7W9eTHx1mAEtHIGs-UFw-YBtmpt9-AT0wdzpi",
            // 商品分类管理-修改商品 views.mdmGoodsRelate.moveGoods
            moveGoods: "GPigVfEhYDwOHo7wzm0Q827CTsZF--WTM4gTKUmQf6c",
            // 商品分类管理-导入商品 views.mdmGoodsRelate.importData
            importData: "_I1EEM0R8m2V0GNRAbz07mQIyu3Pq7dTirHtgrblsnWovnV",
        }
    }
}

export default Services

