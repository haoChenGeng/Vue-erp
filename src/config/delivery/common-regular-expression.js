export default {
    "money"   : /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
    "username": /^([\u4e00-\u9fa5\-•－—]{2,15}|[a-zA-Z]{2,15})$/,
    "idcard"  : /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
    "mobile"  : /^(13|15|18|14|17)\d{9}$/,
    "phone"   : /^(13|15|18|14|17)\d{9}$/,
    "telphone": /^(\d{2,5}[-_－—]?)?\d{6,8}([-_－—#]?\d{3,8})?$/,
    "email"   : /^([a-zA-Z0-9-_.]){1,}@([a-zA-Z0-9-_.]){1,}\.([a-zA-Z0-9-_])+$/,
}