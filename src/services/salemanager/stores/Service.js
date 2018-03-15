let Services = {
  // 特色服务
  SPECIALSERVICE: {
    // views.decSpecialService.update
    UPDATE: 'dcm/decSpecialService/update',
    // views.decSpecialService.create
    CREATE: 'dcm/decSpecialService/create',
    // views.decSpecialService.deleteById
    DELETEBYID: 'dcm/decSpecialService/delete',
    // views.decSpecialService.saveSort
    SAVESORT: 'dcm/decSpecialService/saveSort',
    // views.cancel.recomend
    CANCELRECOMEND: 'dcm/decSpecialService/cancelrecommend',
    // views.decSpecialService.queryPageCompany
    QUERYPAGE: 'dcm/decSpecialService/queryPageCompany',
    // views.set.recommend
    SETRECOMMEND: 'dcm/decSpecialService/setrecommend'
  },
  // 优惠券 促销活动
  PROMOTION: {
    // views.promotionActivity.create
    PROMOTIONCREATE: 'dcs/promotionActivity/create',
    // views.promotionActivity.update
    PROMOTIONUPDATE: 'dcs/promotionActivity/update',
    // views.promotionActivity.delete
    PROMOTIONDELETE: 'dcs/promotionActivity/delete',
    // views.promotionActivity.queryDiscountsForErp
    PROMOTIONQUERYPAGE: 'dcs/promotionActivity/queryDiscountsForErp',
    // views.promotionActivity.setShow
    PROMOTIONSETSHOW: 'dcs/promotionActivity/setShow',
    // views.discounts.create
    DISCOUNTSCREATE: 'dcs/discounts/create',
    // views.discounts.update
    DISCOUNTSUPDATE: 'dcs/discounts/update',
    // views.discounts.delete
    DISCOUNTSDELETE: 'dcs/discounts/delete',
    // views.discounts.queryDiscountsForErp
    DISCOUNTSQUERYPAGE: 'dcs/discounts/queryDiscountsForErp',
    // views.discounts.setShow
    DISCOUNTSSETSHOW: 'dcs/discounts/setShow'
  },
  // 业主预约
  OWNERAPPOINTMENT: {
    // views.ownerAppointment.queryPage
    QUERYPAGE: 'dcs/ownerAppointment/queryPage',
    // views.ownerAppointmentDetail.queryPage
    DETAIL: 'dcs/ownerAppointmentDetail/queryPage',
    // views.axb.getphone
    GETPHONE: 'dcs/axb/getphone'
  },
  // 扣费
  DEDUCTIONRECORD: {
    // views.deductionRecord.queryPage
    QUERYPAGE: 'dcs/deductionRecord/queryPage'
  },
  // BANNER
  BANNER: {
    // views.banner.create
    CREATE: 'dcs/banner/createBanner',
    // views.banner.delete
    DELETE: 'dcs/banner/deleteBanner',
    // views.banner.update
    UPDATE: 'dcs/banner/updateBanner',
    // views.banner.queryBanner
    QUERY: 'dcs/banner/queryBanner'
  }
};

export default Services;
