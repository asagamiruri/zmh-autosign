/* import { createApp } from 'vue'
import './style.css';
import App from './App.vue'

createApp(App).mount(
  (() => {
    const app = document.createElement('div')
    document.body.append(app)
    return app
  })()
) */

import { GM_xmlhttpRequest, GM_getValue, GM_setValue } from '$'
import service from './utils/service'
import { setDOM } from './utils/utils'

// 本地用户token
const userData = localStorage['userData'] && JSON.parse(localStorage['userData'])
// 保存签到日期，不重复签到
const storageKey = 'last_sign_timestamp'
// 请求地址
const host = 'https://zhutix.com/wp-json/b2/v1'
// 这个计算，每天早上8点currentDay改变
const lastSignDay = GM_getValue(storageKey, 0)
const currentDay = Math.floor(new Date().valueOf() / 1000 / 60 / 60 / 24)
// 日期不同 且 已登录有token
const canSign = currentDay !== lastSignDay && userData.token

if (canSign) {
  // 仅签到请求还不够，这破系统后端判断条件很迷，目前确认 每日签到、私信列表、锋币管理、任务中心 均点一遍 再发送请求就可成功

  // 1. axios
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
      requstArr.push(service.post(host + obj.url, obj.payload))
    })
  }
  const sign = () => {
    service.post(host + '/userMission').then(res => {
      const { data } = res
      if (data) {
        GM_setValue(storageKey, currentDay)

        const { my_credit: total_credit = undefined, credit = data } = data.mission || {}
        setDOM(total_credit, credit)
      }
    })
  }
  Promise.all(request()).then(sign())

  // 2. GM_xmlhttpRequest
  /* GM_xmlhttpRequest({
    // url: 'https://zhutix.com/wp-json/b2/v1/userMission',
    url: 'https://zhutix.com/wp-json/b2/v1/getUserInfo',
    method: 'POST',
    data: {
      ref: null,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + getToken,
    },
    responseType: 'json',
    onload(res) {
      console.dir(res)
    },
  }) */
} else {
  service.post(host + '/getUserInfo', { ref: null }).then(res => {
    const { data } = res
    if (data) {
      setDOM(data.credit, null) // 这里没考虑请求等页面加载，应该页面已经加载完了吧？
    }
  })
}
