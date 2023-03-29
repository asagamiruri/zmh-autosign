import { GM_getValue, GM_setValue, GM_xmlhttpRequest } from '$'
import axios from 'axios'
import { setDOM, sign_fail, sign_success } from '../utils/utils'

// 请求地址
const path = 'https://zhutix.com/wp-json/b2/v1'
// 本地用户token
const storageToken = 'zmh_token'
const userData = GM_getValue(storageToken)

/* // axios带token
const service = axios.create({
  headers: {
    Authorization: 'Bearer ' + userData?.token,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}) */

// GM_xmlhttpRequest
const makePostRequest = (url, callback) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userData?.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      onload: res => resolve(res),
      onerror: err => reject(err),
    })
  })
}

// 仅签到请求还不够，这破系统后端判断条件很迷，目前确认 每日签到、私信列表、锋币管理、任务中心 均点一遍 再发送请求就可成功
const request = () => {
  const requestList = [
    {
      page: '每日签到',
      url: '/getUserMission',
      payload: { paged: 1, count: 10 },
    },
    {
      page: '私信列表',
      url: '/getUserDirectmessageList',
      payload: { paged: 1 },
    },
    {
      page: '锋币管理',
      url: '/getUserGoldData',
      payload: { user_id: 0 },
    },
    {
      page: '锋币管理',
      url: '/getGoldList',
      payload: { type: 'credit', user_id: 0, paged: 1, post_paged: 1 },
    },
    {
      page: '任务中心',
      url: '/getTaskData',
      payload: {},
    },
  ]
  const requstArr = []
  requestList.forEach(obj => {
    // requstArr.push(service.post(path + obj.url, obj.payload))
    requstArr.push(makePostRequest(path + obj.url))
  })
  return requstArr
}
const sign = storageKey => {
  // service.post(path + '/userMission').then(res => {
  makePostRequest(path + '/userMission').then(res => {
    if (res.status === 200) {
      const { response: data } = res

      if (data?.mission) {
        // const { my_credit: total_credit = undefined, credit = data } = data.mission || {}
        sign_success(storageKey)
      }
    }
  })
}
const zmh_sign = storageKey => {
  if (userData) {
    Promise.all(request())
      .then(data => {
        console.log(data)
        sign(storageKey)
      })
      .catch(err => {
        console.log('err', err)
      })
  } else {
    zmh_token() // 如果是致美化页面直接获取 userData
    sign_fail({
      storageKey,
      err_msg: '请重新登录',
      callback: () => {
        window.open('https://zhutix.com/tag/cursors/')
      },
    })
  }
}
export default zmh_sign

// zmh 的 token 存在油猴里
const zmh_token = () => {
  const token = localStorage['userData'] && JSON.parse(localStorage['userData'])
  console.log(token)
  GM_setValue(storageToken, token)
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
