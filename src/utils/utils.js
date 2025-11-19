import { GM_registerMenuCommand, GM_setValue } from '$'
import dm_sign from '../signs/dm'
// import juejin_sign from '../signs/juejin'
// import xifan_sign from '../signs/xifan'
import zmh_sign from '../signs/zhimeihua'

export const FN_MAP = {
  // last_gacha_time_juejin: juejin_sign, // 掘金免费单抽
  // last_sign_time_ff14: ff14_sign, // 狒狒积分（登录太麻烦了搞不定）
  // last_sign_time_juejin: juejin_sign, // 掘金
  last_sign_time_zmh: zmh_sign, // 致美化
  last_sign_time_3dm: dm_sign, // 3dm
  // last_sign_time_xifan: xifan_sign, // 稀饭动漫
}

const KEY_MAP = {
  // last_gacha_time_juejin: '掘金单抽',
  // last_sign_time_ff14: 'ff14',
  // last_sign_time_juejin: '掘金',
  last_sign_time_zmh: '致美化',
  last_sign_time_3dm: '3dm',
  // last_sign_time_xifan: '稀饭动漫',
}

// 旧代码：设置dom提示（zmh）
export const setDOM = (total_credit, credit) => {
  const wbrr = document.querySelector('.wbrr')

  const obj = {
    total_credit: total_credit ? `全部积分： ${total_credit}` : '今日已签到',
    credit: credit ? `今日签到：${credit}` : '今日已签到',
  }
  Object.keys(obj).forEach(key => {
    const newNode = document.createElement('span')
    newNode.innerHTML = obj[key]
    newNode.style.padding = '0 10px 0'
    wbrr.appendChild(newNode)
  })
}

// 签到成功
export const sign_success = (storageKey, success_msg) => {
  // 今日日期
  const currentDay = Math.floor(new Date().valueOf() / 1000 / 60 / 60 / 24)
  const name = `✔️ ${KEY_MAP[storageKey]}  ${success_msg ? success_msg : '签到成功'}`
  GM_registerMenuCommand(name, () => console.log('签到成功'))
  GM_setValue(storageKey, currentDay)
}

// 已签到
export const sign_already = storageKey => {
  const name = `✔️ ${KEY_MAP[storageKey]} 已签到`
  GM_registerMenuCommand(name, () => console.log('已签到'))
}

// 签到失败
export const sign_fail = ({ storageKey, callback, err_msg }) => {
  const name = `❌ ${KEY_MAP[storageKey]} 失败： ${err_msg}`
  GM_registerMenuCommand(name, callback)
}

export const formatParams = data => {
  let _result = []
  for (let key in data) {
    let value = data[key]
    if (value.constructor == Array) {
      value.forEach(_value => {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}
