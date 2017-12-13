import Cookie from 'js-cookie'
import config from './server.js'

Cookie.set('my-uid', 't8t-tc-uid');
Cookie.set('my-ticket', 't8t-tc-ticket');
Cookie.set('my-username', 't8t-tc-username');
Cookie.set('my-appname', 'tuchat-pc');
Cookie.set('my-gatewayAddr', config.gatewayAddr);
Cookie.set('my-oldGatewayAddr', config.oldGatewayAddr);
Cookie.set('my-newGatewayAddr', config.newGatewayAddr);
