import { GM_xmlhttpRequest, GM_setValue } from '$'
import { sign_fail, sign_success } from '../utils/utils'

const juejin_sign = storageKey => {
  GM_xmlhttpRequest({
    url: 'https://api.juejin.cn/growth_api/v1/check_in',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': navigator.userAgent,
    },
    responseType: 'json',
    onload(response) {
      if (response.status === 200) {
        const data = response.response

        if (data.data === 'success' || data.err_no === 15001) {
          sign_success(storageKey)
        } else {
          sign_fail({ storageKey, err_msg: data.err_msg })
        }
      }
    },
  })
}

export default juejin_sign
