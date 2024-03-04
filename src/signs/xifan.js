import { GM_xmlhttpRequest } from '$'
import { sign_success } from '../utils/utils'

const path = 'https://dick.xfani.com/index.php/qian/sign'

const xifan_sign = storageKey => {
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
        const { response: data } = res

        if (data.code === 0 || data.code === 1) {
          sign_success(storageKey)
        }
      }
    },
  })
}

export default xifan_sign
