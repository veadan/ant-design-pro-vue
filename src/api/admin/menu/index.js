import { axios } from '@/utils/request'

export function fetchTree (query) {
  return axios({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll () {
  return axios({
    url: '/admin/menu/all',
    method: 'get'
  })
}
export function addObj (obj) {
  return axios({
    url: '/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return axios({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return axios({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return axios({
    url: '/admin/menu/' + id,
    method: 'put',
    data: obj
  })
}
