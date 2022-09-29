import { createApp } from 'vue'
import './app.scss'
import Taro from '@tarojs/taro'


const App = createApp({
  onShow (options) {},
  onLaunch(opts) {
    Taro.setStorageSync('scene', opts.scene)
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export default App
