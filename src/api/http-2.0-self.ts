import Taro from '@tarojs/taro'

export default function request(params) {
  const baseURL = 'https://distribution-beta.boomegg.cn'
  const header = params.header || {
    'content-type': 'application/json' // 默认值
  };
  header['content-type'] = params.contentType ? 'application/x-www-form-urlencoded' : 'application/json';

  let token = Taro.getStorageSync("token"); // 在本地缓存中获取token
  // debugger;
  token = 'e6c20e091e2fabefb5269ceae4899759';
  if(token) {
    if(!header || !header["X-Token"]) {
        header["X-Token"] = token;
    }
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: baseURL + params.url,
      header: header,
      method: params.method,
      data: params.data || {},
      success: (res:any) => {
        if (res.data.ret == 0) {
          resolve(res.data)
        } else if(res.data.ret == -10000) {
          // // debugger;
          // reLogin().then((res:any) => {
          //   // debugger
          //   resolve(res.data);
          // }).catch(reason => {
          //     console.log(reason);
          // })
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

// 重新登录
function reLogin() {
  return new Promise((resolve, reject) => {
    // 先移除已存在的token
    // Taro.removeStorageSync('token');
    Taro.showToast({
      title: '登录信息过期',
      icon: "none",
      duration: 1000 // 持续时间
    })
    setTimeout(() => {
      Taro.showLoading({ // 显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框
        title: '重新登录中',
        mask: true, // 是否显示透明蒙层，防止触摸穿透
        success: function() {
          Taro.login({
            success: res => {
              const tt = {
                url: 'https://distribution-beta.boomegg.cn/login',
                method: 'get',
                data: {
                  code: res.code, 
                  appid: 'wx2b6b52fe09290c6c', 
                  game_appid: 'wx75a03576951c34be',
                },
              }
              // debugger;
              request(tt).then((res:any) => {
                  Taro.hideLoading();
                  // debugger
                  if(res.data.ret == 0) {
                      let token = res.data.token;
                      Taro.setStorageSync('token',token);
                      Taro.showToast({
                          title: '登陆成功',
                          icon: 'success'
                      })
                      resolve(res);
                  } else {
                      reject('error');
                }
              })
            }
          })
        }
      })
    }, 1000)
  })
}
