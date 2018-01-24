let Status = {
    401:'系统出错了，请联系工作人员。', //'permission denied',
    403:'系统出错了，请联系工作人员。', //'forbidden',
    404:'系统出错了，请联系工作人员。', //'no such method',
    480:'系统出错了，请联系工作人员。', //'invalid arguments',
    500:'系统出错了，请联系工作人员。', //'unknown error in server',
    501:'系统出错了，请联系工作人员。', //'invalid request',
    502:'系统出错了，请联系工作人员。', //'invalid response',
    503:'系统出错了，请联系工作人员。', //'route service faild',
    504:'系统繁忙，请稍候重试。', //'service is busy',
    505:'访问系统超时了，请再试一次。', //'call service timeout',

    600: '系统出错了，请联系工作人员。', //'服务名和接口名为空',   //INVALID_REQUEST_PARAMS
    601: '系统出错了，请联系工作人员。',//'未知错误，服务调用失败', //SERVICE_REQUEST_FAILED
    602: '您没有权限访问本页面，请联系管理员申请权限。',//'接口名和服务名不在可访问白名单内',   //INVALID_SERVICE_OR_METHOD
    603: '操作太频繁啦',//'请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_IP
    604: '操作太频繁啦',//'请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_USERID
    605: '登录状态失效了，请重新登录系统',//'不合法的ticket', //INVALID_TICKET
    606: '非法请求',//'非法请求', //INVALID_REQUEST
    607: '您没有权限访问数据接口，请联系管理员申请权限。',//'权限校验失败，当前用户没有操作某个接口或服务的权限', //INVALID_PERMISSION
    608: '文件上传失败',//'图片上传失败', //UPLOAD_FILE_ERROR
    609: '文件上传失败',//'图片上传失败', //INVALID_BUCKET_NAME
    610: '文件上传失败',//'图片服务配置不存在', //EMPTY_FILE_SERVER_CONFIG
    611: '上传文件内容为空',//'上传内容为空或者', //EMPTY_UPLOAD_CONTENT
    612: '导入文件时读取excel内容失败或内容为空',//'上传内容为空或者', //EMPTY_EXCEL_CONTENT
    613: '不支持上传此类型的文件',//'非法的文件名后缀', //INVALID_FILE_EXT
    614: '文件不合法， 可能文件被人为修改过格式',//'非法文件类型',  //INVALID_FILE_TYPE
    615: '文件上传失败', //'文件上传失败',  //FILE_UPLOAD_ERROR
    616: '验证码错误',//'验证码错误',   //INVALID_CAPTCHA_CODE
    617: '验证码已过期',//'验证码已过期',  //EXPIRED_CAPTCHA
    618: '验证码为空',//'验证码为空',   //CAPTCHA_IS_NULL
    619: '导出内容为空',//'导出为空',     //EXPORT_EMPTY
    620: '页面权限校验失败',//'url权限失败', //INVALID_URL_PERMISSION
    621: '请求失败',//'请求失败',    //REQUEST_FAILED

    1001:'系统出错了，请联系工作人员。', //'interface not implement',
    2001:'系统出错了，请联系工作人员。', //'请求体中JSON格式不正确',
    2002:'系统出错了，请联系工作人员。', //'请求体为空',
    2003:'系统出错了，请联系工作人员。', //'对外暴露的接口为空',
    2004:'系统出错了，请联系工作人员。', //'对外暴露的实现对象为空'
    80098:'您没有权限访问本页面，请联系管理员申请权限。' //没有页面访问权限
}

export default Status
