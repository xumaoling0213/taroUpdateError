import Taro from "@tarojs/taro";
import { saveUserInfo} from '@/api/home'

/**
 * 格式化时间
 * @param date
 * @returns {string}
 */
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

/**
 * 格式化数字
 * @param n
 * @returns {string}
 */
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/**
 * 部署格式化日期工具
 * @param date
 * @param fmt
 * @returns {*}
 */
export function timeFormat(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}


// // 时间戳转化成时间格式
// function add0(m){return m<10?'0'+m:m }
// export function formatDate(shijianchuo) {
//   if(!shijianchuo) {
//     return '';
//   }
//   //shijianchuo是整数，否则要parseInt转换
//   shijianchuo = shijianchuo * 1000;
//   var time = new Date(shijianchuo);
//   var y = time.getFullYear();
//   var m = time.getMonth()+1;
//   var d = time.getDate();
//   var h = time.getHours();
//   var mm = time.getMinutes();
//   var s = time.getSeconds();
//   const date =  y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
//   // const date =  add0(m)+ '-' + add0(d);
//   return date;
// }

export function formatDate(date, fmt,) {
  // fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  fmt = fmt || 'MM-dd hh:mm'
  if (date === null || typeof date === 'undefined' || date === '' || date === 0) {
      return null
  } else {
      // 时间要转成obj，否则报错
      date = new Date(date * 1000)
  }
  var o = {
      'M+': date.getMonth() + 1, // 月
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
  }
  return fmt
}

// 判断有没有授权过，如果没授权登录的话，需要先进行授权登录才能进行互动操作
export function  isAuth() {
  let hasLogined = Taro.getStorageSync('hasLogined')
  if (!hasLogined) {
    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const Data = res.userInfo;
        let params = {
          name: Data.nickName,
          gender: Data.gender,
          avatar: Data.avatarUrl,
          // update: true, // 更新
        }
        saveUserInfo(params).then((result:any) => {
          if(result.ret == 0) {
            Taro.setStorageSync('hasLogined', true)
            Taro.setStorageSync('userInfo', result.userinfo)
            hasLogined = true;
          }
        })
      }
    })
  }
  return hasLogined
}

// module.exports = {
//   format,
// };
