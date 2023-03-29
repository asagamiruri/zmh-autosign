import { GM_getValue, GM_deleteValue, GM_registerMenuCommand } from '$'
import { sign_already } from './utils/utils'

import juejin_sign from './signs/juejin'
import zmh_sign from './signs/zhimeihua'

const fnMap = {
  last_sign_time_juejin: juejin_sign, // 掘金
  last_sign_time_zmh: zmh_sign, // 致美化
}

const currentDay = Math.floor(new Date().valueOf() / 1000 / 60 / 60 / 24)

Object.keys(fnMap).forEach(storageKey => {
  const lastSignDay = GM_getValue(storageKey, 0)

  const canSign = currentDay !== lastSignDay
  // const canSign = true
  if (canSign) {
    fnMap[storageKey](storageKey)
  } else {
    sign_already(storageKey)
  }
})

/* // 1. GM_xmlhttpRequest
juejin_sign()
// 2. axios （只能同域名下用， fetch 也一样）
zmh_sign() */
