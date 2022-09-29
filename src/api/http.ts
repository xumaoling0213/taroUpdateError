import Taro from '@tarojs/taro'
import config from '@/config'
import { saveUserInfo } from '@/api/home'


export default function request (params){
  const header = params.header || {
    'content-type': params.contentType ? 'application/x-www-form-urlencoded' : 'application/json'
  };
  header['X-Token']= Taro.getStorageSync('loginData').token;
	if (!params.url.trim() ) {
		Taro.showModal({
			title: '出错了',
			content: '请求接口地址不能为空！',
			showCancel: false
		})
		return;
	}
  return new Promise((resolve, reject)=>{
    Taro.request({
      url: config.baseUrl + params.url,
      header: header,
      method: params.method,
      data: params.data || {},
      success: (res:any) => {
        if (res.data.ret == 0) {
          resolve(res.data)
        } else if(res.data.ret == -10000) {
          console.log('http token过期');
        } else if(res.data.interactive_id == -30000) {
          Taro.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
              const Data = res.userInfo;
              let params = {
                name: Data.nickName,
                gender: Data.gender,
                avatar: Data.avatarUrl,
              }
              saveUserInfo(params).then((result:any) => {
                Taro.setStorageSync('hasLogined', true)
                Taro.setStorageSync('userInfo', result.userinfo)
              })
            }
          })
      } else {
        Taro.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none',
        })
      }
    },
    fail: err => {
      Taro.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 1000
      })
        reject(err)
      }
    })
	})
}