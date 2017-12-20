import ApiClient from 'vue-gateway-sdk'
import Config from 'src/config/server.js'

// PHP版协议
let apiClient = new ApiClient(Config.oldGatewayAddr)
// JAVA版协议
apiClient.setNewGateway(Config.newGatewayAddr)

export default apiClient
