import { GM_xmlhttpRequest } from '$'
import { sign_fail, sign_success } from '../utils/utils'

const path = 'https://api.juejin.cn/growth_api/v1'
const urlList = {
  last_sign_time_juejin: '/check_in',
  last_gacha_time_juejin: '/lottery/draw',
}

// 包含签到和免费单抽
const juejin_sign = storageKey => {
  GM_xmlhttpRequest({
    url: path + urlList[storageKey],
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': navigator.userAgent,
    },
    responseType: 'json',
    onload: response => {
      if (response.status === 200) {
        const data = response.response
        console.log(storageKey, data)

        if (storageKey === 'last_sign_time_juejin') {
          // 签到
          data.err_msg === 'success' || data.err_no === 15001
            ? sign_success(storageKey)
            : sign_fail({ storageKey, err_msg: data.err_msg })
        } else if (storageKey === 'last_gacha_time_juejin') {
          // 免费单抽
          data.err_msg === 'success'
            ? sign_success(storageKey, `奖励： ${data.data.lottery_name}`)
            : sign_fail({ storageKey, err_msg: data.err_msg })
        }
      }
    },
  })
}

export default juejin_sign
