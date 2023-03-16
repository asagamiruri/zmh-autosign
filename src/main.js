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
import axios from 'axios'
import { setDOM } from './utils/utils'

const userData = localStorage['userData'] && JSON.parse(localStorage['userData'])
// 保存签到日期，不重复签到
const storageKey = 'last_sign_timestamp'
const lastSignDay = GM_getValue(storageKey, 0)
const currentDay = Math.floor(new Date().valueOf() / 1000 / 60 / 60 / 24)
const service = axios.create({
  headers: {
    Authorization: 'Bearer ' + userData.token,
  },
})

// 日期不同 且 已登录有token
if (currentDay !== lastSignDay && userData.token) {
  // 1. axios
  service.post('https://zhutix.com/wp-json/b2/v1/userMission').then(res => {
    const { data } = res
    if (data) {
      GM_setValue(storageKey, currentDay)

      const { my_credit: total_credit = undefined, credit = data } = data.mission || {}
      setDOM(total_credit, credit)
    }
  })
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
  service.post('https://zhutix.com/wp-json/b2/v1/getUserInfo', { ref: null }).then(res => {
    const { data } = res
    if (data) {
      setDOM(data.credit, null) // 这里没考虑请求等页面加载，应该页面已经加载完了吧？
    }
  })
}
