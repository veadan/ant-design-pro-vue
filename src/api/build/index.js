import { axios } from '@/utils/request'

export function dbList () {
  return axios({
    url: '/build/db/list',
    method: 'get'
  })
}

export function addDbObj (obj) {
  return axios({
    url: '/build/db/set',
    method: 'post',
    data: obj
  })
}

export function delDbObj (key) {
  return axios({
    url: '/build/db?key=' + key,
    method: 'delete'
  })
}

export function tablePage (query) {
  return axios({
    url: '/build/build/page',
    method: 'get',
    params: query
  })
}
export function putObj (obj) {
  return axios({
    url: '/build/build/code',
    method: 'put',
    params: obj
  })
}

export function buildProject (obj) {
  return axios({
    url: '/build/build/code',
    method: 'get',
    params: obj,
    responseType: 'blob' // 表明返回服务器返回的数据类型'
  })
}
