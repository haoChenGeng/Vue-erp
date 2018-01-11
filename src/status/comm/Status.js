let Status = {
    600: '服务名和接口名为空', //'服务名和接口名为空',   //INVALID_REQUEST_PARAMS
    601: '数据请求失败, 请联系工作人员检查服务配置',//'未知错误，服务调用失败', //SERVICE_REQUEST_FAILED
    602: '您没有权限访问本页面，请联系管理员申请权限。',//'非法服务名或方法名',   //INVALID_SERVICE_OR_METHOD
    603: '操作太频繁啦',//'请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_IP
    604: '操作太频繁啦',//'请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_USERID
    605: '登录状态失效了，请重新登录系统',//'不合法的ticket', //INVALID_TICKET
    606: '非法请求',//'非法请求', //INVALID_REQUEST
    607: '您没有权限访问数据接口，请联系管理员申请权限。',//'非法请求', //INVALID_PERMISSION
    608: '文件上传失败',//'图片上传失败', //UPLOAD_FILE_ERROR
    609: '文件上传失败',//'图片上传失败', //INVALID_BUCKET_NAME
    610: '文件服务配置不存在',//'图片服务配置不存在', //EMPTY_FILE_SERVER_CONFIG
    611: '上传文件内容为空',//'上传内容为空或者', //EMPTY_UPLOAD_CONTENT
    612: '导入文件时读取excel内容失败或内容为空',//'上传内容为空或者', //EMPTY_EXCEL_CONTENT
    613: '非法的文件名后缀',//'非法的文件名后缀', //INVALID_FILE_EXT
    614: '非法文件类型',//'非法文件类型',  //INVALID_FILE_TYPE
    615: '文件上传失败', //'文件上传失败',  //FILE_UPLOAD_ERROR
    616: '验证码错误',//'验证码错误',   //INVALID_CAPTCHA_CODE
    617: '验证码已过期',//'验证码已过期',  //EXPIRED_CAPTCHA
    618: '验证码为空',//'验证码为空',   //CAPTCHA_IS_NULL
    619: '导出内容为空',//'导出为空',     //EXPORT_EMPTY
    620: '页面权限校验失败',//'url权限失败', //INVALID_URL_PERMISSION
    621: '请求失败',//'请求失败',    //REQUEST_FAILED
}

export default Status
