import { GM_getValue } from '$'
import { sign_already } from './utils/utils'

import juejin_sign from './signs/juejin'
import zmh_sign from './signs/zhimeihua'
import ff14_sign from './signs/ff14'

const fnMap = {
  last_sign_time_juejin: juejin_sign, // 掘金
  last_gacha_time_juejin: juejin_sign, // 掘金免费单抽
  last_sign_time_zmh: zmh_sign, // 致美化
  last_sign_time_ff14: ff14_sign, // 狒狒积分
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
