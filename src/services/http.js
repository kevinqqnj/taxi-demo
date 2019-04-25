import axios from 'axios'
import Cookies from 'js-cookie'

import config from '@/config'

export default axios.create({
  baseURL: `${config.base_url}/api/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  }
})