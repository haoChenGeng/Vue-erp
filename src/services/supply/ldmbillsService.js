let Services = {

      //仓库操作费清单
      OPERATEBILLS: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  // 列表 views.invOperateBills.queryPage
                  queryPage: 'qig0sBKtZh4xRG9L4t18XBVPY4lEwyWmAzoTTcKjYSjUfPK',
                  // 生成数据（同步） views.invOperateBills.create
                  // create: 'DJKMzeU2T9ufc6ejPBw9Yau85w_CwWWjMzZA4vZwjmj',
                  // 生成数据（异步） views.invOperateBills.asyncCreate
                  create: 'JnPS6fxMacRyhML37gWmBga-2rVGd1GfwseQE0dQz1mCETf',
                  // 校验是否存在结算中、已结算的仓库分组 views.invOperateBills.queryOrgList
                  queryOrgList: 'VKNXQtAoN6N6evLa3YV7fos987cR6rmvM-t8N8yMaBL74YpR6zk'
            }
      },
      //出入库明细
      REPORTFORM: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  // 列表 inv.report.form.queryPage
                  queryPage: 'zDQc2ClMH0mN1ZajQNRFShG4-rg0zwkCvg_x6rq',
            }
      },

      //仓库租赁价格
      RENTBILLS: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  // 列表 views.invRentBills.queryPage
                  queryPage: 'aMjjDkuFWF8guKOQoDcBGmBEvZCgtFg_-Bv8B_NWN9m',
                  // 生成数据 views.invRentBills.create
                  create: 'TZeXEIrvSLNgZ4FJ0PmV-7fO_ja_JxjQ9oY8K44'
            }
      },

      //仓库操作费
      OPERATE: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //仓库操作费列表 views.invOperatePrice.queryPage
                  queryPage:'VWII_nChTHibbMt5eOdqsJ4kUKMAe8JquPPUKCrLr9X8ziw',
                  //仓库操作费详情 views.invOperatePrice.findPriceDetail
                  findPriceDetail:'JQ9TCC3k1J6KBXTylsVGQygDDeMH_oV2E2IJRB6GTRNHxrSGh1U5dfu',
                  //仓库操作费暂存 views.invOperatePrice.tempSubmit
                  tempSubmit:'q02KuUwO3ocD0Tmy7DmBnm-mWD36tCdKeG38YOy63W7r8hd',
                  //仓库操作费提交 views.invOperatePrice.submit
                  submit:'HAMR1N2EGvjhpgs4uTPJUyez8tKwAjRkR4LBRjWLtqa',
                  //仓库操作费查看审核流 views.invOperatePrice.getWkfCheckStream
                  getWkfCheckStream:'LYAUHR7M0zNjR8nhrPIAwiLwwc0Fr_oQ4OHvHXzP7Fa0F3FDVrPDxuX',
                  //仓库操作费工作流审批 views.invOperatePrice.completeWorkFlow
                  completeWorkFlow:'36os1LTFisl87qKa_k8KOtYIKudkthpSGuwb0vwcr5Y9VGhLhCNe8zT',
            }
      },

      //加班费
      OVERTIMEORDER: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //加班费单据列表 views.invOvertimeOrder.queryPage
                  queryPage:'VfjdI3FpESyfRfVQcTIhUUN6ZcWfMPYbivFSYAyKM5aXu_A',
                  //加班费单据打印 views.invOvertimeOrder.print
                  print:'s2i2xzYsaX6yU2Vmrkmc4rTmjYyPldj1xbim9aQlLPQ',
                  //加班费单据提交 views.invOvertimeOrder.submit
                  submit:'PjjqimOyLT23Y8aTKl7nSbYUaULoVWZf64iX3basYC9',
                  //加班费单据暂存 views.invOvertimeOrder.tempSubmit
                  tempSubmit:'3-rBn-oPK3qO_aOxg-jxXDzcxZjCtCw3C7wu1O3e9v6hyv7',
                  //加班费单据创建提交 views.invOvertimeOrder.createSubmit
                  // createSubmit:'ouYtSC_kiJu89G8bdRdaV0jJdEn8ZHtPXAWhoNWTKgbQe-4NNYz',
                  //加班费单据创建暂存 views.invOvertimeOrder.createTempSubmit
                  // createTempSubmit:'TPRlOIgCWVeR3s-jFcIfOfEC-6Fc5gXDgvOISMNVDL9F_gZKfQdZMQg',
                  //加班费单据修改暂存 views.invOvertimeOrder.updateTempSubmit
                  // updateTempSubmit:'hcqtl5VkiKz-9H4gZjdDtRbdXevHtQnApdNFoT4Z2Kee9ydtdWgdnZ1',
                  //加班费单据修改提交 views.invOvertimeOrder.updateSumbit
                  // updateSumbit:'25A_-177m31pU-q9sByyrWF1wungAaAv9BMiZt3hLxt3vNm0grT',
                  //加班费单据作废 views.invOvertimeOrder.failed
                  failed:'_g986iJm1edOKn6d7wjsrsytqUuAYpj3N6baA7AewTX',
                  //加班费单据详情页 views.invOvertimeOrder.findById
                  findById:'nxfuZwYI7pkw8aBTsifczmQeLV0ye0qZ_tkQaAqIyvUTJ85',
                  //加班费单据详情页（审核页面） views.invOvertimeOrder.findByBpmInsId
                  findByBpmInsId:'055px8dzsbc-FT7e4u2jAuqZjh3W30hnImebM2f58VwKJOssfOePAEP',
                  //加班费单据-审核 views.invOvertimeOrder.completeWorkFlow
                  completeWorkFlow:'wHML9ZhT6-cZc6aC5F4y8897v-72FhECfK-zfJZsnoVA79RxLNu7ska',
                  //加班费单据-查看审核流 views.invOvertimeOrder.getWkfCheckStream
                  getWkfCheckStream:'OFbS7prcSjQFtnEm7SSWFa6MCtOF_bLWqYI5I-NJqKiQzzV5jDjQXGQ992v',
                  //根据日期获取日期类型 views.invOvertimeOrder.findDateType
                  findDateType: 'nu7C1AUY2itQGOsShxzMEbzjsynlyZtz5R_1eF7uQP8vypCoOcX',
            }
      },

      //拆包费管理
      INVRMPACKETORDER: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //重新生成拆包费 views.invRmPacketOrder.create
                  create: 'nx3hsawW1oPrFukhxg1mOY1kTYMVwYzVuxzXilvVReL',
                  //仓库分组拆包费列表页 views.invRmPacketOrder.queryPage
                  queryPage: '8HGT8n-aKHumBEnvGE_ZK64_uMY9VNXpe7I.j0gMHgC6kzw',
                  //拆包费商品费用详情 views.invRmPacketOrder.queryItem
                  queryItem: 'yoivhs3xY9hPzChj_JnRG2VhNeWygsVcF-aguOBZNwwjSD6',
                  //商品出库详情 views.invRmPacketOrder.queryGoodsDetail
                  queryGoodsDetail: 'WufrXDb9hjcI_Pf_YPgIkhRXJo1gsrpxCsWgdpoPW3V8LP_gVcBnfgl',
                  //批量导出商品 views.invRmPacketOrder.queryAllItem
                  queryAllItem: 'PrlogtM2beuoHa5QJfSxdeXUSSmZmkXrkRaVjnZ34xbHoqZe1In'
            }
      }

}

export default Services

