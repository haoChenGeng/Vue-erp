/*
 * @FileName: filter
 * @Description: 通用过滤器
 * @Date: 2017-03-07
 * @version: 1.0
 * @author: <carl.wu@corp.to8to.com>
 */

import Vue from 'vue'
import axios from './axios'
import Service from './Service'

// 时间戳转日期格式
Vue.filter('toDate', (value) => {
	if(value === 0) return ''
	var date = new Date(value * 1000);
	var Y = date.getFullYear(),
		m = date.getMonth() + 1,
		d = date.getDate(),
		H = date.getHours(),
		i = date.getMinutes(),
		s = date.getSeconds();
	if (m < 10) {
		m = '0' + m;
	}
	if (d < 10) {
		d = '0' + d;
	}
	if (H < 10) {
		H = '0' + H;
	}
	if (i < 10) {
		i = '0' + i;
	}
	if (s < 10) {
		s = '0' + s;
	}

	var t = Y+'-'+m+'-'+d+' '+H+':'+i+':'+s;
	return t;
})

export default {}
