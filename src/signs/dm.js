import { GM_xmlhttpRequest } from '$'
import { sign_success } from '../utils/utils'

const path = 'https://bbs.3dmgame.com/connect.php?mod=check&op=cookie'

const dm_sign = storageKey => {
  GM_xmlhttpRequest({
    url: path,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'user-agent': navigator.userAgent,
    },
    responseType: 'json',
    onload: res => {
      if (res.status === 200) {
        console.log('看看 https://bbs.3dmgame.com/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog 有没有增加积分')
        sign_success(storageKey)
      }
    },
  })
}

export default dm_sign
