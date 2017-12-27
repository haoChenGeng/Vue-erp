import ApiClient from 'vue-gateway-sdk'
import Config from 'src/config/server.js'

import Global from 'vue-gateway-sdk/src/core/Global'

Global.setUidName('t8t-tc-uid')
Global.setTicketName('t8t-tc-ticket')

// PHP版协议
let apiClient = new ApiClient(Config.oldGatewayAddr, Global)

// JAVA版协议
apiClient.setNewGateway(Config.newGatewayAddr)

export default apiClient
