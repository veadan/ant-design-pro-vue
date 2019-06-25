import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (username, password) {
  const data = {
    username,
    password,
    grant_type: 'password'
  }
  return axios({
    url: '/auth/oauth/token',
    method: 'post',
    data,
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getSmsCaptcha (tel) {
  return axios({
    url: '/admin/user/sendMsm?type=3&tel=' + tel,
    method: 'post'
  })
}

export function validateTelPhone (tel) {
  return axios({
    url: '/admin/user/validateTelPhone?tel=' + tel,
    method: 'post'
  })
}

export function getInfo () {
  return axios({
    url: '/admin/user/front/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout (token) {
  return axios({
    url: '/auth/oauth/token',
    method: 'delete',
    params: {
      access_token: token
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
