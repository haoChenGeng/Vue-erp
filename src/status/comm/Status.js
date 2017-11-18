let Status = {
    200: '请求成功',    //REQUEST_SUCCESS
    600: '服务名和接口名为空',   //INVALID_REQUEST_PARAMS
    601: '未知错误，服务调用失败', //SERVICE_REQUEST_FAILED
    602: '非法服务名或方法名',   //INVALID_SERVICE_OR_METHOD
    603: '请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_IP
    604: '请求频率过大', //LARGE_REQUEST_FREQUENCY_BY_USERID
    605: '不合法的ticket', //INVALID_TICKET
    606: '非法请求', //INVALID_REQUEST
    607: '非法请求', //INVALID_PERMISSION
    608: '图片上传失败', //UPLOAD_FILE_ERROR
    609: '图片上传失败', //INVALID_BUCKET_NAME
    610: '图片服务配置不存在', //EMPTY_FILE_SERVER_CONFIG
    611: '上传内容为空或者', //EMPTY_UPLOAD_CONTENT
    612: '上传内容为空或者', //EMPTY_EXCEL_CONTENT
    613: '非法的文件名后缀', //INVALID_FILE_EXT
    614: '非法文件类型',  //INVALID_FILE_TYPE
    615: '文件上传失败',  //FILE_UPLOAD_ERROR
    616: '验证码错误',   //INVALID_CAPTCHA_CODE
    617: '验证码已过期',  //EXPIRED_CAPTCHA
    618: '验证码为空',   //CAPTCHA_IS_NULL
    619: '导出为空',     //EXPORT_EMPTY
    620: 'url权限失败', //INVALID_URL_PERMISSION
    621: '请求失败',    //REQUEST_FAILED
}

export default Status
