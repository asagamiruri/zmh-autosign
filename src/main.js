import { GM_getValue } from '$'
import { FN_MAP, sign_already } from './utils/utils'

const currentDay = Math.floor(new Date().valueOf() / 1000 / 60 / 60 / 24)

Object.keys(FN_MAP).forEach(storageKey => {
  const lastSignDay = GM_getValue(storageKey, 0)

  const canSign = currentDay !== lastSignDay
  // const canSign = true
  if (canSign) {
    FN_MAP[storageKey](storageKey)
  } else {
    sign_already(storageKey)
  }
})

/* // 1. GM_xmlhttpRequest
juejin_sign()
// 2. axios （只能同域名下用， fetch 也一样）
zmh_sign() */
