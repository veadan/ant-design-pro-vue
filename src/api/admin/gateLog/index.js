import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/gateLog/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/gateLog',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/gateLog/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/gateLog/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/gateLog/' + id,
    method: 'put',
    data: obj
  })
}
