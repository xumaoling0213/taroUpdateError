import Taro from "@tarojs/taro"
const debug = process.env.NODE_ENV !== 'production'

export default {
  debug,
  // baseUrl: debug ? 'https://distribution-beta.boomegg.cn' : 'https://url.production/api', // past
  baseUrl: !debug ? 'https://distribution-beta.boomegg.cn' : 'https://mprogram.boomegg.cn',  // 正式环境https://mprogram.boomegg.cn 测试环境https://distribution-beta.boomegg.cn
  appId: Taro.getEnv() === 'WEAPP' ? Taro.getAccountInfoSync().miniProgram.appId : '',
}
