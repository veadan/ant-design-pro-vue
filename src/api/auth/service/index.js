import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/auth/service/page',
    method: 'get',
    params: query
  })
}

export function getAll () {
  return axios({
    url: '/auth/service/all',
    method: 'get'
  })
}

export function addObj (obj) {
  return axios({
    url: '/auth/service',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/auth/service/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/auth/service/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/auth/service/' + id,
    method: 'put',
    data: obj
  })
}

export function getClients (id) {
  return axios({
    url: '/auth/service/' + id + '/client',
    method: 'get'
  })
}

export function modifyClients (id, data) {
  return axios({
    url: '/auth/service/' + id + '/client',
    method: 'put',
    params: data
  })
}

export function buildProject (id, packageName) {
  const data = { id, packageName }
  return axios({
    url: '/auth/generator/build',
    method: 'post',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型'
  })
}
