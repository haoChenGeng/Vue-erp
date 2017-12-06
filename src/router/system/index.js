import organization from './organization.js'
import configMgt from './config_mgt.js'
import app from './app.js'
import preventRepeat from './preventRepeat.js'
import perm from './permission_mgt.js'

let routes = [].concat(
    organization,
    configMgt,
    app,
    preventRepeat,
    perm
)

export default routes
