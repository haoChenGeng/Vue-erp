module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(169);


/***/ },

/***/ 3:
/***/ function(module, exports) {

	module.exports = function normalizeComponent (
	  rawScriptExports,
	  compiledTemplate,
	  scopeId,
	  cssModules
	) {
	  var esModule
	  var scriptExports = rawScriptExports = rawScriptExports || {}

	  // ES6 modules interop
	  var type = typeof rawScriptExports.default
	  if (type === 'object' || type === 'function') {
	    esModule = rawScriptExports
	    scriptExports = rawScriptExports.default
	  }

	  // Vue.extend constructor export interop
	  var options = typeof scriptExports === 'function'
	    ? scriptExports.options
	    : scriptExports

	  // render functions
	  if (compiledTemplate) {
	    options.render = compiledTemplate.render
	    options.staticRenderFns = compiledTemplate.staticRenderFns
	  }

	  // scopedId
	  if (scopeId) {
	    options._scopeId = scopeId
	  }

	  // inject cssModules
	  if (cssModules) {
	    var computed = options.computed || (options.computed = {})
	    Object.keys(cssModules).forEach(function (key) {
	      var module = cssModules[key]
	      computed[key] = function () { return module }
	    })
	  }

	  return {
	    esModule: esModule,
	    exports: scriptExports,
	    options: options
	  }
	}


/***/ },

/***/ 55:
/***/ function(module, exports) {

	module.exports = require("vue");

/***/ },

/***/ 116:
/***/ function(module, exports) {

	module.exports = require("t8t-element-ui/lib/utils/dom");

/***/ },

/***/ 163:
/***/ function(module, exports) {

	module.exports = require("t8t-element-ui/lib/utils/merge");

/***/ },

/***/ 169:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _directive = __webpack_require__(170);

	var _directive2 = _interopRequireDefault(_directive);

	var _index = __webpack_require__(174);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  install: function install(Vue) {
	    Vue.use(_directive2.default);
	    Vue.prototype.$loading = _index2.default;
	  },

	  directive: _directive2.default,
	  service: _index2.default
	};

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _vue = __webpack_require__(55);

	var _vue2 = _interopRequireDefault(_vue);

	var _dom = __webpack_require__(116);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Mask = _vue2.default.extend(__webpack_require__(171));

	exports.install = function (Vue) {
	  if (Vue.prototype.$isServer) return;
	  var toggleLoading = function toggleLoading(el, binding) {
	    if (binding.value) {
	      Vue.nextTick(function () {
	        if (binding.modifiers.fullscreen) {
	          el.originalPosition = document.body.style.position;
	          el.originalOverflow = document.body.style.overflow;

	          (0, _dom.addClass)(el.mask, 'is-fullscreen');
	          insertDom(document.body, el, binding);
	        } else {
	          (0, _dom.removeClass)(el.mask, 'is-fullscreen');

	          if (binding.modifiers.body) {
	            el.originalPosition = document.body.style.position;

	            ['top', 'left'].forEach(function (property) {
	              var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
	              el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
	            });
	            ['height', 'width'].forEach(function (property) {
	              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
	            });

	            insertDom(document.body, el, binding);
	          } else {
	            el.originalPosition = el.style.position;
	            insertDom(el, el, binding);
	          }
	        }
	      });
	    } else {
	      if (el.domVisible) {
	        el.instance.$on('after-leave', function (_) {
	          el.domVisible = false;
	          if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
	            document.body.style.overflow = el.originalOverflow;
	          }
	          if (binding.modifiers.fullscreen || binding.modifiers.body) {
	            document.body.style.position = el.originalPosition;
	          } else {
	            el.style.position = el.originalPosition;
	          }
	        });
	        el.instance.visible = false;
	      }
	    }
	  };
	  var insertDom = function insertDom(parent, el, binding) {
	    if (!el.domVisible) {
	      Object.keys(el.maskStyle).forEach(function (property) {
	        el.mask.style[property] = el.maskStyle[property];
	      });

	      if (el.originalPosition !== 'absolute') {
	        parent.style.position = 'relative';
	      }
	      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
	        parent.style.overflow = 'hidden';
	      }
	      el.domVisible = true;

	      parent.appendChild(el.mask);
	      Vue.nextTick(function () {
	        el.instance.visible = true;
	      });
	      el.domInserted = true;
	    }
	  };

	  Vue.directive('loading', {
	    bind: function bind(el, binding) {
	      var mask = new Mask({
	        el: document.createElement('div'),
	        data: {
	          text: el.getAttribute('element-loading-text'),
	          fullscreen: !!binding.modifiers.fullscreen
	        }
	      });
	      el.instance = mask;
	      el.mask = mask.$el;
	      el.maskStyle = {};

	      toggleLoading(el, binding);
	    },

	    update: function update(el, binding) {
	      if (binding.oldValue !== binding.value) {
	        toggleLoading(el, binding);
	      }
	    },

	    unbind: function unbind(el, binding) {
	      if (el.domInserted) {
	        if (binding.modifiers.fullscreen || binding.modifiers.body) {
	          document.body.removeChild(el.mask);
	        } else {
	          el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
	        }
	      }
	    }
	  });
	};

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	var Component = __webpack_require__(3)(
	  /* script */
	  __webpack_require__(172),
	  /* template */
	  __webpack_require__(173),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)

	module.exports = Component.exports


/***/ },

/***/ 172:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	exports.default = {
	  data: function data() {
	    return {
	      text: null,
	      fullscreen: true,
	      visible: false,
	      customClass: ''
	    };
	  },


	  methods: {
	    handleAfterLeave: function handleAfterLeave() {
	      this.$emit('after-leave');
	    }
	  }
	};

/***/ },

/***/ 173:
/***/ function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('transition', {
	    attrs: {
	      "name": "el-loading-fade"
	    },
	    on: {
	      "after-leave": _vm.handleAfterLeave
	    }
	  }, [_c('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.visible),
	      expression: "visible"
	    }],
	    staticClass: "el-loading-mask",
	    class: [_vm.customClass, {
	      'is-fullscreen': _vm.fullscreen
	    }]
	  }, [_c('div', {
	    staticClass: "el-loading-spinner"
	  }, [_c('svg', {
	    staticClass: "circular",
	    attrs: {
	      "viewBox": "25 25 50 50"
	    }
	  }, [_c('circle', {
	    staticClass: "path",
	    attrs: {
	      "cx": "50",
	      "cy": "50",
	      "r": "20",
	      "fill": "none"
	    }
	  })]), (_vm.text) ? _c('p', {
	    staticClass: "el-loading-text"
	  }, [_vm._v(_vm._s(_vm.text))]) : _vm._e()])])])
	},staticRenderFns: []}

/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vue = __webpack_require__(55);

	var _vue2 = _interopRequireDefault(_vue);

	var _loading = __webpack_require__(171);

	var _loading2 = _interopRequireDefault(_loading);

	var _merge = __webpack_require__(163);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var LoadingConstructor = _vue2.default.extend(_loading2.default);

	var defaults = {
	  text: null,
	  fullscreen: true,
	  body: false,
	  lock: false,
	  customClass: ''
	};

	var fullscreenLoading = void 0;

	LoadingConstructor.prototype.originalPosition = '';
	LoadingConstructor.prototype.originalOverflow = '';

	LoadingConstructor.prototype.close = function () {
	  var _this = this;

	  if (this.fullscreen && this.originalOverflow !== 'hidden') {
	    document.body.style.overflow = this.originalOverflow;
	  }
	  if (this.fullscreen || this.body) {
	    document.body.style.position = this.originalPosition;
	  } else {
	    this.target.style.position = this.originalPosition;
	  }
	  if (this.fullscreen) {
	    fullscreenLoading = undefined;
	  }
	  this.$on('after-leave', function (_) {
	    _this.$el && _this.$el.parentNode && _this.$el.parentNode.removeChild(_this.$el);
	    _this.$destroy();
	  });
	  this.visible = false;
	};

	var addStyle = function addStyle(options, parent, instance) {
	  var maskStyle = {};
	  if (options.fullscreen) {
	    instance.originalPosition = document.body.style.position;
	    instance.originalOverflow = document.body.style.overflow;
	  } else if (options.body) {
	    instance.originalPosition = document.body.style.position;
	    ['top', 'left'].forEach(function (property) {
	      var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
	      maskStyle[property] = options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
	    });
	    ['height', 'width'].forEach(function (property) {
	      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
	    });
	  } else {
	    instance.originalPosition = parent.style.position;
	  }
	  Object.keys(maskStyle).forEach(function (property) {
	    instance.$el.style[property] = maskStyle[property];
	  });
	};

	var Loading = function Loading() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  if (_vue2.default.prototype.$isServer) return;
	  options = (0, _merge2.default)({}, defaults, options);
	  if (typeof options.target === 'string') {
	    options.target = document.querySelector(options.target);
	  }
	  options.target = options.target || document.body;
	  if (options.target !== document.body) {
	    options.fullscreen = false;
	  } else {
	    options.body = true;
	  }
	  if (options.fullscreen && fullscreenLoading) {
	    return fullscreenLoading;
	  }

	  var parent = options.body ? document.body : options.target;
	  var instance = new LoadingConstructor({
	    el: document.createElement('div'),
	    data: options
	  });

	  addStyle(options, parent, instance);
	  if (instance.originalPosition !== 'absolute') {
	    parent.style.position = 'relative';
	  }
	  if (options.fullscreen && options.lock) {
	    parent.style.overflow = 'hidden';
	  }
	  parent.appendChild(instance.$el);
	  _vue2.default.nextTick(function () {
	    instance.visible = true;
	  });
	  if (options.fullscreen) {
	    fullscreenLoading = instance;
	  }
	  return instance;
	};

	exports.default = Loading;

/***/ }

/******/ });