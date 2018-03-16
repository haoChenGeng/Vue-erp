/**
 * File: stores.js
 * Comment:
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/30
 * Time: 14:24
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve);
const bannerConfig = resolve =>
  require(['src/views/m-salemanager/banner-config/index.vue'], resolve);
const chargeRecord = resolve =>
  require(['src/views/m-salemanager/charge-record/list.vue'], resolve);
const proprietorOrder = resolve =>
  require(['src/views/m-salemanager/proprietor-order/list.vue'], resolve);
const couponConfig = resolve =>
  require(['src/views/m-salemanager/coupon-config/list.vue'], resolve);
const salesPromotion = resolve =>
  require(['src/views/m-salemanager/sales-promotion/list.vue'], resolve);
const uniqueServer = resolve =>
  require(['src/views/m-salemanager/special-service/list.vue'], resolve);

const routes = [
  {
    path: '/tuchat-sale-manage',
    component: Console,
    children: [
      {
        path: 'banner-config',
        component: bannerConfig,
        meta: { isFulldialog: false, title: '广告图片' }
      },
      {
        path: 'charge-record',
        component: chargeRecord,
        meta: { isFulldialog: false, title: '扣费记录' }
      },
      {
        path: 'proprietor-order',
        component: proprietorOrder,
        meta: { isFulldialog: false, title: '业主预约' }
      },
      {
        path: 'coupon-config',
        component: couponConfig,
        meta: { isFulldialog: false, title: '优惠券' }
      },
      {
        path: 'sales-promotion',
        component: salesPromotion,
        meta: { isFulldialog: false, title: '促销活动' }
      },
      {
        path: 'special-service',
        component: uniqueServer,
        meta: { isFulldialog: false, title: '特色服务' }
      }
    ]
  }
];

export default routes;
