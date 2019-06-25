import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/admin/element/list',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return axios({
    url: '/admin/element',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/element/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/element/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/element/' + id,
    method: 'put',
    data: obj
  })
}
