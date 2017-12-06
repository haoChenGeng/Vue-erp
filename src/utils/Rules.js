/**
 * Created by Carl.wu on 2017/4/5.
 */

export default {
    phone (rule, value, callback) {
        if (value === "") {
            callback(new Error('手机号不能为空'));
        } else if (value.match()) {

        }

        callback()
    }
}
