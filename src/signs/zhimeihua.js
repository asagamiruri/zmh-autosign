import { GM_getValue, GM_setValue, GM_xmlhttpRequest } from '$'
// import axios from 'axios'
import { formatParams, sign_fail, sign_success } from '../utils/utils'

// 请求地址
const path = 'https://zhutix.com/wp-json/b2/v1'
// 本地用户token
const storageToken = 'zmh_token'
const b2token = GM_getValue(storageToken)
const Authorization = 'Bearer ' + b2token

/* // axios带token
const service = axios.create({
  headers: {
    Authorization: 'Bearer ' + userData?.token,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}) */

// GM_xmlhttpRequest
const makePostRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'POST',
      headers: {
        Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formatParams(data),
      onload: res => resolve(res),
      onerror: err => reject(err),
    })
  })
}

// 仅签到请求还不够，这破系统后端判断条件很迷，
// 目前确认 每日签到、私信列表、锋币管理、任务中心 均点一遍 再发送请求就可成功
const request = () => {
  const requestList = [
    {
      page: '每日签到',
      url: '/getUserMission',
      data: { paged: 1, count: 10 },
    },
    {
      page: '私信列表',
      url: '/getUserDirectmessageList',
      data: { paged: 1 },
    },
    {
      page: '锋币管理',
      url: '/getUserGoldData',
      data: { user_id: 0 },
    },
    {
      page: '锋币管理',
      url: '/getGoldList',
      data: { type: 'credit', user_id: 0, paged: 1, post_paged: 1 },
    },
    {
      page: '任务中心',
      url: '/getTaskData',
      data: {},
    },
  ]
  const requstArr = []
  requestList.forEach(obj => {
    // requstArr.push(service.post(path + obj.url, obj.data))
    requstArr.push(makePostRequest(path + obj.url, obj.data))
  })
  return requstArr
}
const sign = storageKey => {
  // service.post(path + '/userMission').then(res => {
  makePostRequest(path + '/userMission').then(res => {
    if (res.status === 200) {
      const { response: data } = res
      const info = JSON.parse(data)
      console.log('zmh签到接口返回：', info)

      if (info?.mission || info === '1') {
        // const { my_credit: total_credit = undefined, credit = data } = data.mission || {}
        sign_success(storageKey)
      } else {
        // sign_fail({
        //   storageKey,
        //   err_msg: '可能没触发刷新',
        //   callback: () => {
        //     // 左键点击菜单手动重新发送签到请求
        //     sign()
        //   },
        // })
      }
    }
  })
}
const zmh_sign = storageKey => {
  // sign(storageKey)
  Promise.all(request())
    .then(data => {
      console.log(data)
      if (data[4].status !== 200) {
        if (window.location.host === 'zhutix.com') zmh_token()
        sign_fail({
          storageKey,
          err_msg: '请重新登录',
          callback: () => {
            window.open('https://zhutix.com/tag/cursors/')
          },
        })
      } else {
        sign(storageKey)
      }
    })
    .catch(err => {
      console.log('err', err)
    })
}
export default zmh_sign

// zmh 的 token 存在油猴里
const zmh_token = () => {
  const b2token = document.cookie
    .split(';')
    .filter(item => item.includes('b2_token'))[0]
    ?.split('=')[1]
  GM_setValue(storageToken, b2token)
}

// 旧方法：已签到后获取积分总额
/* const zmh_getInfo = () => {
  service.post(path + '/getUserInfo', { ref: null }).then(res => {
    const { data } = res
    if (data) {
      setDOM(data.credit, null) // 这里没考虑请求等页面加载，应该页面已经加载完了吧？
    }
  })
} */
