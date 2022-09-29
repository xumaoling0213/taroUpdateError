import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import qs from 'qs'
// import adapter from 'axios-miniprogram-adapter'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    // timeout: 15000, // request timeout
    // withCredentials: true, // send cookies when cross-domain requests
    // adapter,
})

// request interceptor
service.interceptors.request.use(
    config => {
        // if (store.getters.token) {
        //     config.headers['X-Sid'] = getToken()
        // }
        if (config.headers['Content-Type'] == 'application/json') {
            config.data = JSON.stringify(config.data)
        } else if (config.headers['Content-Type'] == 'application/octet-stream') {
            config.data = JSON.stringify(config.data)
        } else if (config.headers['Content-Type'] == 'multipart/form-data') {
            //不做处理
        } else {
            //默认的Content-Type
            if (config.method === 'post' || config.method == 'put' || config.method == 'delete') {
                config.data = qs.stringify(config.data)
            }
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        return config
    },
    error => {
        // do something with request error
        console.warn('请求拦截报错：', error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.hasOwnProperty('ret') && res.ret !== 0) {
            // Message({
            //     message: res.msg || 'Error',
            //     type: 'error',
            //     duration: 5 * 1000
            // })

            //-10000: Token expired;
            if (res.ret === -10000) {
                // // to re-login
                // MessageBox.confirm('登录态已失效，请重新登录！', '提示', {
                //     confirmButtonText: '重新登录',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                    // store.dispatch('user/resetToken').then(() => {
                    //     location.reload()
                    // })
                // })
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.warn('请求返回错误:', error) // for debug
        // Message({
        //     message: error.msg || 'Network Error:' + error,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service
