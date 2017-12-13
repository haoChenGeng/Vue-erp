let Services = {
      //仓库分组
      ORG: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //仓库分组查询（不分页） inventory.organization.query
                  QUERY:'dGp2YJY1ieUk6qNm_jvWz3xKHpgfCTyITqzdYGvbCDw',
            }
      },
      //承运商
      SHOPCARRIE: {
            // /biz/t8t-scm-ldm/app
            name: '9ZudOCvl-nCdNpDe_5iW-3xcR85xwXM',
            methods: {
                  // conf.urbanTPrice.query 承运商列表
                  urbanTPriceQuery: 'KZ0g6buXcVMqYOWG1-KLV8JrSWL3r6qEx3z'
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

      //仓库租赁价格
      RENT: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //仓库租赁列表 views.invRentPrice.queryPage
                  queryPage:'DdYMXsEU_Kdt4eKfA2X5YtRJ90fAfraN7AdM72KKIm3',
                  //仓库租赁详情 views.invRentPrice.findPriceDetail
                  findPriceDetail:'CKHy5Jc84zJam4i8-qgjX-4aBd2nH42r1iuzezE-z2J_Th7rOed',
                  //仓库租赁暂存 views.invRentPrice.tempSubmit
                  tempSubmit:'Rutkf7PiZIu7HtJeQGVBmiaeMnPqgFkNMGGkK5gbXEI',
                  //仓库租赁提交 views.invRentPrice.submit
                  submit:'p1HD_SuL71FazCYz0-4hP-p4rHfmJqW3yZI5eQb',
                  //仓库租赁查看审核流 views.invRentPrice.getWkfCheckStream
                  getWkfCheckStream:'XdPaSi0rWBzxSjOoYs-wsRACa2OahI_YpWdHjATHi-sGdpBTBsY',
                  //仓库租赁工作流审批 views.invRentPrice.completeWorkFlow
                  completeWorkFlow:'FMOLyfiPsrNK431UymqhaA_z6z8uBwrVQqo3362flYnDauUxYuV',
                  //仓库租赁禁用 views.invRentPrice.forbidden
                  forbidden:'rk43uHH_Vp41Q4VrpU89OAhYpf2bhqqvlIlrGOxqtO-',
                  //仓库租赁反禁用 views.invRentPrice.unForbidden
                  unForbidden:'BxOeYPuBmB6zaNYHBVQD_7WCPAXCcNV1ghrKYMKTA5W',
            }
      },
      //加班费
      OVERTIME: {
            // /biz/supply-chain/app.supply-server
            name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
            methods: {
                  //加班费列表 views.invOvertimePrice.queryPage
                  queryPage: "inatg7NgiJB5U_ZahmVucLdTgnXrlMa8ylWKc3dOZGiO-XE",
                  //加班费新增 views.invOvertimePrice.create
                  create: "CNLIzPuR8tRf2bunOFP63OC84m0IIFwqiGA7-Kws58n",
                  //加班费修改 views.invOvertimePrice.update
                  update: "GQTBEinFJdCRP5i1QKnDpSFEx3HB8SFqSbHi8P5ey9q"
            }
      }

}

export default Services

