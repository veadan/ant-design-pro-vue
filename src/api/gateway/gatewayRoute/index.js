import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/gateway/gatewayRoute/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/gateway/gatewayRoute',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/gateway/gatewayRoute/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/gateway/gatewayRoute/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/gateway/gatewayRoute/' + id,
    method: 'put',
    data: obj
  })
}