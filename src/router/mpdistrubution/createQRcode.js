/**
 * Created by terry.hao on 2018/3/16.
 * 生成分销二维码
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const CreateCode = resolve =>
  require(['src/views/m-mpDistribution/create-qrcode.vue'], resolve)

const routes = [
  {
    path: '/mp-distribution',
    component: Console,
    children: [
      {
        path: 'create-qrcode',
        meta: {
          isFulldialog: false,
          title: '生成分销二维码',
        },
        component: CreateCode,
      },
    ],
  },
]

export default routes
