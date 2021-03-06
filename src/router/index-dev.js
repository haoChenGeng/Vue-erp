import Vue from 'vue';
import VueRouter from 'vue-router';
import api from 'src/utils/api.js';
import Cookie from 'js-cookie';
import Utils from 'src/utils/Utils.js';

Vue.use(VueRouter);
// 判断是否生产环境
const debug = process.env.NODE_ENV !== 'production';

// 登录
import login from './login/index.js';
// 404
import forbidden from './404/index.js';
// workbench工作台
import workbench from './workbench/index.js';

import salemanager from './salemanager/index.js';

// dev
// import dev from './index.js';

let routes = [];

routes = routes.concat(salemanager);

// 只输入域名时，跳转到首页
routes.push({
  path: '/',
  redirect: '/tuchat-index'
});

routes = routes.concat(login, forbidden, workbench);

// =========================================================================================

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  let _args = { ...{ local: 'tuchat-pc' }, ...to.query };

  if (_args.uid && _args.certificate && _args.from) {
    //认证成功后跳转的链接地址
    var query = to.query;
    var uid = to.query.uid;
    /* delete query['uid']
        delete query['from']
        delete query['certificate']
        let jumpUrl = {
            path:to.path,
            query:query,
            replace: true
        }*/

    let jumpUrl = {
      path: query['url'] ? decodeURI(query['url']) : '/tuchat-index',
      //query:query,
      replace: true
    };

    let args = {
      local: 'tuchat-pc',
      uid: _args['uid'],
      certificate: _args['certificate'],
      from: _args['from']
    };
    if (Cookie.get('t8t-tc-uid') && Cookie.get('t8t-tc-uid') != uid) {
      Vue.prototype
        .$confirm(
          `警告：${Cookie.get(
            't8t-tc-username'
          )}已登录系统，继续登录将使${Cookie.get('t8t-tc-username')}下线`,
          '警告',
          {
            confirmButtonText: '继续登录',
            cancelButtonText: '取消登录',
            type: 'warning'
          }
        )
        .then(_ => {
          routerCheckCertificate(args, jumpUrl);
        })
        .catch(_ => {
          console.log('取消');
        });
    } else {
      routerCheckCertificate(args, jumpUrl);
    }
  } else {
    //未登录则重定向到登录页, 排除login页面防止死循环
    if (
      (!Cookie.get('t8t-tc-ticket') || !Cookie.get('t8t-tc-uid')) &&
      ['/login/', '/login'].indexOf(to.path) < 0
    ) {
      Utils.redirectLoginPage();
      return;
    }

    //首页地址更改
    if (['/index/', '/index'].indexOf(to.path) > -1) {
      return next('/tuchat-index');
    }

    if (to.meta.auth === false || debug === true) {
      return next();
    }
    // 鉴权页面
    let args = {
      ticket: Cookie.get('t8t-tc-ticket'),
      accountId: Cookie.get('t8t-tc-uid'),
      url: '#' + to.path
    };

    api.account
      .checkPermission(args)
      .then(res => {
        if (res.data.status === 200) {
          if (res.data.result === true) {
            next();
          } else {
            next('/forbidden/404?status=2');
          }
        } else if (res.data.status === 605) {
          //不合法的ticket
          //直接登出
          Utils.logout(false);

          //提示被别人挤出
          next('/forbidden/404?status=1');
        } else if (
          res.data.status === 607 ||
          res.data.status === 602 ||
          res.data.status === 80098
        ) {
          //权限校验失败，当前用户没有操作某个接口或服务的权限 或者 接口/服务未在访问白名单 或者没有页面访问权限
          next('/forbidden/404?status=2');
        } else {
          //其他错误
          next('/forbidden/404?status=4');
        }
      })
      .catch(err => {
        next('/forbidden/404?status=4');
      });
  }
});

router.afterEach(route => {
  let title;
  if (route.meta.title) {
    title = route.meta.title + ' - 土巴兔商家后台';
  } else {
    title = '土巴兔商家后台';
  }
  document.title = title;
  // 本地开发路由弹窗提示
  routerAlert(route);
});

function routerAlert(route) {
  if (
    debug &&
    route.meta.auth !== false &&
    route.meta.isFulldialog !== true &&
    route.meta.isFulldialog !== false
  ) {
    let _url =
      'http://192.168.1.156:3000/kai-fa-zhi-nan/lu-you-shi-yong-gui-fan.html';
    Vue.prototype
      .$confirm(
        '此页面路由写法不规范<br><a href="' +
          _url +
          '" target="_blank">到这里查看规范</a>',
        '警告',
        {
          confirmButtonText: '去看看',
          cancelButtonText: '残忍拒绝',
          type: 'warning'
        }
      )
      .then(() => {
        let a = document.createElement('a');
        a.href = _url;
        a.target = '_blank';
        a.click();
      })
      .catch(() => {
        console.log('残忍拒绝');
      });
  }
}

function routerCheckCertificate(_args, jumpUrl) {
  var domain = debug === true ? 'localhost' : '.to8to.com';
  api.newaccount
    .checkCertificate(_args)
    .then(res => {
      if (res.data.status == 200) {
        Vue.prototype.$message.success('登录成功');
        Cookie.set(
          't8t-tc-ticket',
          res.data.result.tickets['tuchat-pc'].value,
          { domain: domain }
        );
        Cookie.set('t8t-tc-uid', res.data.result.user.id, { domain: domain });
        Cookie.set('t8t-tc-username', res.data.result.user.name, {
          domain: domain
        });

        //装修公司id
        let comid =
          res.data.result.bounds.length >= 1
            ? res.data.result.bounds[0].extId
            : 0;
        Cookie.set('t8t-tc-comid', comid, { domain: domain });
        //获取登录的装修公司信息

        if (comid) {
          Vue.prototype.$http
            .fetch('fcominfo/getbyId', {
              id: comid
            })
            .then(res => {
              if (res.data.status == 200) {
                Cookie.set(
                  't8t-tc-comname',
                  res.data.result && res.data.result.name
                    ? res.data.result.name
                    : '',
                  { domain: domain }
                );
              }
              router.replace(jumpUrl);
            });
        } else {
          router.replace(jumpUrl);
        }
      } else {
        Vue.prototype.$message.error(`授权登录失败`);
      }
    })
    .catch(err => {
      debugger;
      Vue.prototype.$message.error('请求超时或服务器出错');
      console.log(err);
    });
}

export default router;
